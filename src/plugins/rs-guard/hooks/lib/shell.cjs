'use strict';
// Split a Bash command string into simple commands (argv arrays) the way a shell would, closely
// enough for guard matching: quotes, escapes, comments, operators (&& || ; | & newline ( )),
// redirections (dropped with their targets) and heredoc bodies (skipped, never parsed as commands).
// `stepsOf` also tracks the directory each command runs in, following `cd` and subshells.
// Not a full shell: `bash -c "..."`, eval and aliases are not expanded. Guards protect against agent
// mistakes, not a hostile user.

const path = require('path');

const OPERATOR_CHARS = new Set(['&', '|', ';', '\n', '(', ')']);
const TEXT_CARRIERS = new Set(['echo', 'cat', 'printf', 'python', 'python3', 'node']);
const PREFIXES = new Set(['command', 'exec', 'time', 'nohup', 'sudo']);

// Commands in order, as {argv}, with {open} / {close} markers for each `(` and `)`.
function tokenize(input) {
  const src = String(input || '');
  const commands = [];
  let words = [];
  let word = null; // null = no word in progress; '' = empty quoted word in progress
  let skipNextWord = false; // the next word is a redirection target
  let heredocNext = null; // {strip} when the next word is a heredoc delimiter
  const pendingHeredocs = [];

  const endWord = () => {
    if (word === null) return;
    if (heredocNext) {
      pendingHeredocs.push({ delim: word, strip: heredocNext.strip });
      heredocNext = null;
    } else if (skipNextWord) {
      skipNextWord = false;
    } else {
      words.push(word);
    }
    word = null;
  };
  const endCommand = () => {
    endWord();
    if (words.length) commands.push({ argv: words });
    words = [];
  };

  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      if (src[i + 1] === '\n') { i += 2; continue; }
      word = (word || '') + (src[i + 1] || '');
      i += 2;
      continue;
    }
    if (c === "'") {
      const end = src.indexOf("'", i + 1);
      const stop = end === -1 ? src.length : end;
      word = (word || '') + src.slice(i + 1, stop);
      i = stop + 1;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      let buf = '';
      while (j < src.length && src[j] !== '"') {
        if (src[j] === '\\' && j + 1 < src.length && '"\\$`\n'.includes(src[j + 1])) {
          if (src[j + 1] !== '\n') buf += src[j + 1];
          j += 2;
        } else {
          buf += src[j];
          j += 1;
        }
      }
      word = (word || '') + buf;
      i = j + 1;
      continue;
    }
    if (c === '#' && word === null) {
      while (i < src.length && src[i] !== '\n') i += 1;
      continue;
    }
    if (c === ' ' || c === '\t') { endWord(); i += 1; continue; }
    if (c === '<' || c === '>') {
      if (word !== null && /^\d+$/.test(word)) word = null; // a leading fd number belongs to the redirection
      else endWord();
      let op = '';
      while (i < src.length && (src[i] === '<' || src[i] === '>')) { op += src[i]; i += 1; }
      if (op === '<<' && src[i] === '-') { op += '-'; i += 1; }
      if (src[i] === '&') {
        i += 1;
        while (i < src.length && /[0-9-]/.test(src[i])) i += 1;
        continue; // 2>&1 style: no target word
      }
      if (op === '<<' || op === '<<-') heredocNext = { strip: op === '<<-' };
      else skipNextWord = true;
      continue;
    }
    if (OPERATOR_CHARS.has(c)) {
      endCommand();
      if (c === '(') commands.push({ open: true });
      if (c === ')') commands.push({ close: true });
      i += 1;
      if (c === '\n' && pendingHeredocs.length) i = skipHeredocBodies(src, i, pendingHeredocs.splice(0));
      continue;
    }
    word = (word || '') + c;
    i += 1;
  }
  endCommand();
  return commands;
}

function splitCommands(input) {
  return tokenize(input).filter((t) => t.argv).map((t) => t.argv);
}

function skipHeredocBodies(src, i, heredocs) {
  for (const { delim, strip } of heredocs) {
    while (i < src.length) {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? src.length : nl;
      const line = src.slice(i, end);
      i = end + 1;
      if ((strip ? line.replace(/^\t+/, '') : line) === delim) break;
    }
  }
  return i;
}

// Strip `VAR=value` assignments and wrapper prefixes (env, sudo, ...) so argv[0] is the real program.
function normalize(argv) {
  let a = argv.slice();
  for (;;) {
    while (a.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(a[0])) a = a.slice(1);
    if (!a.length) return a;
    const head = basename(a[0]);
    if (head === 'env') {
      a = a.slice(1);
      while (a.length && a[0].startsWith('-')) a = a.slice(1);
      continue;
    }
    if (PREFIXES.has(head)) { a = a.slice(1); continue; }
    return a;
  }
}

function basename(p) {
  return String(p).split('/').pop();
}

// The directory `cd <args>` moves `dir` to, or null when it is only known at run time
// (`cd -`, `$VAR`, globs, command substitution) or the starting directory is already unknown.
function changeDir(dir, args) {
  let i = 0;
  while (i < args.length && /^-[LPe@]+$/.test(args[i])) i += 1;
  if (args[i] === '--') i += 1;
  const rest = args.slice(i);
  const home = process.env.HOME;
  let target = rest.length ? rest[0] : home;
  if (!target || target === '-' || /[$`*?[\]]/.test(target)) return null;
  if (target === '~' || target.startsWith('~/')) {
    if (!home) return null;
    target = path.join(home, target.slice(1));
  } else if (target.startsWith('~')) {
    return null;
  }
  if (path.isAbsolute(target)) return path.resolve(target);
  return dir ? path.resolve(dir, target) : null;
}

// Simple commands worth guarding, each with the directory it runs in ({argv, cwd}); cwd is null when
// a `cd` makes it unknowable. A subshell's `cd` ends with the subshell. Normalized, empty and
// text-carrying commands removed.
function stepsOf(input, cwd) {
  const steps = [];
  const stack = [];
  let dir = cwd || null;
  for (const t of tokenize(input)) {
    if (t.open) { stack.push(dir); continue; }
    if (t.close) { if (stack.length) dir = stack.pop(); continue; }
    const argv = normalize(t.argv);
    if (!argv.length) continue;
    const head = basename(argv[0]);
    if (head === 'cd' || head === 'pushd') { dir = changeDir(dir, argv.slice(1)); continue; }
    if (head === 'popd') { dir = null; continue; }
    if (TEXT_CARRIERS.has(head)) continue;
    steps.push({ argv, cwd: dir });
  }
  return steps;
}

module.exports = { splitCommands, normalize, stepsOf, basename };
