#!/usr/bin/env node
'use strict';
// rs-doctor: check the tools the Rightshift harness requires, and print the exact fix for each miss.
//
//   rs-doctor                  human-readable report; exit 1 if a required tool is missing
//   rs-doctor --session-start  SessionStart hook mode: JSON additionalContext on stdout, always exit 0
//   rs-doctor --install [--yes]
//                              for a human: show the plan, ask, then put gstack at the pinned commit
//                              (fetch + checkout + ./setup --no-team). Everything else is printed only.
//
// Installing runs third-party code and downloads a browser, so only a human runs --install; the
// rs-guard `installers` check denies it to the agent.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { receiptCli } = require('../lib/receipts.cjs');

// RS_HARNESS_PINS points at another pins file (tests use it to pin a local fake gstack).
const PINS = JSON.parse(fs.readFileSync(process.env.RS_HARNESS_PINS || path.join(__dirname, '..', 'pins.json'), 'utf8'));

const configDir = (env) => env.CLAUDE_CONFIG_DIR || path.join(env.HOME || os.homedir(), '.claude');

function version(cmd, env) {
  const r = spawnSync(cmd, ['--version'], { encoding: 'utf8', env });
  if (r.error || r.status !== 0) return null;
  const m = r.stdout.match(/\d+\.\d+\.\d+/);
  return m ? m[0] : '';
}

const cmpVersion = (a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
};

function gstackRoots(env) {
  const home = env.HOME || os.homedir();
  return [env.GSTACK_ROOT, path.join(configDir(env), 'skills', 'gstack'), path.join(home, '.claude', 'skills', 'gstack')]
    .filter(Boolean);
}

// Where gstack is (or should go), and the exact commands that put it at the pinned commit.
function gstackState(env) {
  const pin = PINS.gstack;
  const root = gstackRoots(env).find((r) => {
    try { return fs.statSync(path.join(r, 'bin')).isDirectory(); } catch { return false; }
  });
  // New installs go where Claude Code reads skills: $CLAUDE_CONFIG_DIR/skills (gstack's setup uses the same).
  const target = root || env.GSTACK_ROOT || path.join(configDir(env), 'skills', 'gstack');
  const r = root ? spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8', env }) : null;
  const head = r && r.status === 0 ? r.stdout.trim() : null;
  const steps = [
    ...(root ? [] : [['git', 'init', '-q'], ['git', 'remote', 'add', 'origin', pin.repo]]),
    ['git', 'fetch', '--depth', '1', 'origin', pin.commit],
    ['git', 'checkout', '-q', '--detach', 'FETCH_HEAD'],
    ['./setup', '--no-team'],
  ];
  return { pin, root, target, head, steps };
}

const shellJoin = (argv) => argv.map((a) => (/^[\w@%+=:,./-]+$/.test(a) ? a : `'${a.replace(/'/g, "'\\''")}'`)).join(' ');

function gstackFix(st) {
  const cmds = st.steps.map(shellJoin).join(' && ');
  return `mkdir -p "${st.target}" && cd "${st.target}" && ${cmds}  (or run rs-doctor --install)`;
}

function checkGstack(env) {
  const st = gstackState(env);
  if (!st.root) return { name: 'gstack', ok: false, detail: 'not installed', fix: gstackFix(st) };
  if (st.head !== st.pin.commit) {
    return {
      name: 'gstack', ok: false,
      detail: `at ${st.head ? st.head.slice(0, 12) : 'unknown commit'} (${st.root}), pinned ${st.pin.commit.slice(0, 12)}`,
      fix: gstackFix(st),
    };
  }
  return { name: 'gstack', ok: true, detail: `${st.pin.version} @ ${st.pin.commit.slice(0, 12)} (${st.root})` };
}

// Org-synced plugins live in <config>/plugins/synced/<org>/<id>/ and are absent from installed_plugins.json.
function syncedPlugin(env, name) {
  const root = path.join(configDir(env), 'plugins', 'synced');
  const dirs = (p) => { try { return fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(p, d.name)); } catch { return []; } };
  for (const dir of dirs(root).flatMap(dirs)) {
    try {
      const m = JSON.parse(fs.readFileSync(path.join(dir, '.claude-plugin', 'plugin.json'), 'utf8'));
      if (m.name === name) return { key: `${name} (org-synced)`, version: m.version, scope: 'synced' };
    } catch { /* not a plugin */ }
  }
  return null;
}

function checkMatt(env, projectRoot) {
  const pin = PINS['mattpocock-skills'];
  const fix = `claude plugin marketplace add ${pin.repo} && claude plugin install mattpocock-skills@${pin.marketplace}`;
  let installed = {};
  try {
    installed = JSON.parse(fs.readFileSync(path.join(configDir(env), 'plugins', 'installed_plugins.json'), 'utf8')).plugins || {};
  } catch { /* missing file = nothing installed */ }
  const entries = Object.entries(installed)
    .filter(([key]) => key.startsWith('mattpocock-skills@'))
    .flatMap(([key, list]) => (Array.isArray(list) ? list : []).map((e) => ({ key, ...e })));
  const usable = entries.find((e) => e.scope === 'user' || (projectRoot && e.projectPath === projectRoot))
    || syncedPlugin(env, 'mattpocock-skills');
  if (!usable) return { name: 'mattpocock-skills', ok: false, detail: 'plugin not installed for this project', fix };
  const detail = [usable.key, usable.version, `(${usable.scope})`].filter(Boolean).join(' ');
  const pinned = pin.ref.replace(/^v/, '');
  // An older version still works, so it is a warning, not a block.
  const warn = usable.version && cmpVersion(usable.version, pinned) < 0
    ? `version ${usable.version} is older than the pinned ${pin.ref}; update it when convenient` : undefined;
  return { name: 'mattpocock-skills', ok: true, detail, warn };
}

function runChecks({ env = process.env, platform = process.platform, projectRoot = null } = {}) {
  if (platform === 'win32') {
    return [{ name: 'platform', ok: false, detail: 'native Windows is not supported (gstack needs macOS/Linux)',
      fix: 'Use WSL: https://learn.microsoft.com/windows/wsl/install, then run Claude Code inside it.' }];
  }
  const checks = [];
  const tool = (name, fix) => {
    const v = version(name, env);
    checks.push(v === null ? { name, ok: false, detail: 'not found', fix } : { name, ok: true, detail: v });
  };
  tool('git', 'Install git: https://git-scm.com/downloads');
  tool('gh', 'Install the GitHub CLI: https://cli.github.com, then `gh auth login`');
  const bun = version('bun', env);
  const bunFix = 'curl -fsSL https://bun.sh/install | bash';
  if (bun === null) checks.push({ name: 'bun', ok: false, detail: 'not found (gstack needs it)', fix: bunFix });
  else if (cmpVersion(bun, PINS.bun.min) < 0) checks.push({ name: 'bun', ok: false, detail: `${bun} < ${PINS.bun.min}`, fix: 'bun upgrade' });
  else checks.push({ name: 'bun', ok: true, detail: bun });
  checks.push(checkGstack(env));
  checks.push(checkMatt(env, projectRoot));
  return checks;
}

const missing = (checks) => checks.filter((c) => !c.ok);

function fixText(failed) {
  return failed.map((c) => `- ${c.name}: ${c.detail}\n  fix: ${c.fix}`).join('\n');
}

function sessionContext(checks) {
  const failed = missing(checks);
  const lines = [`Rightshift harness (rs-guard): record receipts with \`${receiptCli()}\` (verify -- <test cmd> | qa --report <path> --p0-failed <n> | status).`];
  const warned = checks.filter((c) => c.ok && c.warn);
  if (warned.length) lines.push(...warned.map((c) => `Note: ${c.name} ${c.warn}.`));
  if (failed.length) {
    lines.push('', 'STOP: required tools for the Rightshift harness are missing. Non-draft `gh pr create`, `gh pr ready` and '
      + '`git push` are blocked until they are installed. Tell the human, show them the fixes below, and ask '
      + 'them to run them. Do not run installers yourself.', fixText(failed));
  }
  return lines.join('\n');
}

// Wait for a typed answer. fs.readSync on a terminal's stdin fails at once (EAGAIN), so use readline.
function askYes(question) {
  const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    let answered = false;
    rl.question(question, (a) => { answered = true; rl.close(); resolve(/^y(es)?$/i.test(a.trim())); });
    rl.on('close', () => { if (!answered) resolve(false); });
  });
}

// Run outside Claude Code, CLAUDE_CONFIG_DIR is often unset although Claude Code uses another directory.
function configNote(env) {
  if (env.CLAUDE_CONFIG_DIR) return '';
  return `Note: CLAUDE_CONFIG_DIR is not set, so this checked ${configDir(env)}. If Claude Code runs with a `
    + 'different config directory, re-run with CLAUDE_CONFIG_DIR=<that directory>.\n\n';
}

async function install(argv, env = process.env) {
  const checks = runChecks({ env, projectRoot: repoRootOf(process.cwd()) });
  const failed = missing(checks);
  process.stdout.write(configNote(env));
  const gstack = failed.find((c) => c.name === 'gstack');
  const manual = failed.filter((c) => c.name !== 'gstack');
  if (!failed.length) { process.stdout.write('All required tools are present. Nothing to install.\n'); return 0; }
  if (manual.length) process.stdout.write(`Install these yourself:\n${fixText(manual)}\n\n`);
  if (!gstack) return 1;

  const st = gstackState(env);
  if (st.root) {
    const dirty = spawnSync('git', ['-C', st.root, 'status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8', env });
    if (dirty.status !== 0 || dirty.stdout.trim()) {
      process.stderr.write(`rs-doctor: ${st.root} is not a clean git checkout; fix it by hand:\n  ${gstack.fix}\n`);
      return 2;
    }
  } else if (fs.existsSync(st.target) && fs.readdirSync(st.target).length) {
    process.stderr.write(`rs-doctor: ${st.target} exists and is not a gstack install; move it away first.\n`);
    return 2;
  }
  process.stdout.write(`gstack will be put at the pinned commit ${st.pin.commit} in ${st.target}:\n`
    + `${st.steps.map((a) => `  ${shellJoin(a)}`).join('\n')}\n`
    + './setup is gstack\'s own installer: it runs third-party code and downloads a headless browser.\n');
  if (!argv.includes('--yes')) {
    if (!process.stdin.isTTY) {
      process.stderr.write('rs-doctor: not a terminal; re-run with --yes to proceed.\n');
      return 2;
    }
    if (!(await askYes('Proceed? [y/N] '))) { process.stdout.write('Cancelled.\n'); return 1; }
  }
  fs.mkdirSync(st.target, { recursive: true });
  for (const step of st.steps) {
    process.stdout.write(`$ ${shellJoin(step)}\n`);
    const r = spawnSync(step[0], step.slice(1), { cwd: st.target, stdio: 'inherit', env });
    if (r.status !== 0) {
      process.stderr.write(`rs-doctor: step failed (${r.error ? r.error.message : `exit ${r.status}`}); stopping.\n`);
      return 1;
    }
  }
  const after = checkGstack(env);
  process.stdout.write(`${after.ok ? 'ok  ' : 'MISS'} gstack: ${after.detail}\n`);
  return after.ok && !manual.length ? 0 : 1;
}

function main(argv) {
  if (argv.includes('--install')) return install(argv);
  if (argv.includes('--session-start')) {
    let raw = '';
    try { raw = fs.readFileSync(0, 'utf8'); } catch { /* no stdin */ }
    let input = {};
    try { input = JSON.parse(raw); } catch { /* not JSON */ }
    const projectRoot = repoRootOf(input.cwd || process.cwd());
    const ctx = sessionContext(runChecks({ projectRoot }));
    return mcpContext(projectRoot).then((mcp) => {
      const text = mcp ? `${ctx}\n${mcp}` : ctx;
      process.stdout.write(`${JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: text } })}\n`);
      return 0;
    });
  }
  const checks = runChecks({ projectRoot: repoRootOf(process.cwd()) });
  process.stdout.write(configNote(process.env));
  for (const c of checks) {
    process.stdout.write(`${c.ok ? (c.warn ? 'warn' : 'ok  ') : 'MISS'} ${c.name}: ${c.detail}\n`);
    if (c.warn) process.stdout.write(`     note: ${c.warn}\n`);
    if (!c.ok) process.stdout.write(`     fix: ${c.fix}\n`);
  }
  return missing(checks).length ? 1 : 0;
}

// Session-start note on the MCP servers the project's planning needs (.rs-harness.json "required_mcp").
async function mcpContext(projectRoot) {
  const { serverStates, blocking, describe } = require('../lib/mcp.cjs');
  let states;
  try { states = await serverStates(projectRoot); } catch { return ''; }
  if (!states.length) return '';
  const bad = blocking(states);
  const unknown = states.filter((s) => s.status === 'unknown').map((s) => s.name);
  const lines = [];
  if (bad.length) {
    lines.push('', 'STOP: MCP servers this project needs for planning are not available. Planning skills (kickoff, '
      + 'ticket-intake, spec-generator, feature-design-brief, /grill-with-docs, /to-spec, /to-tickets) are blocked '
      + 'until they are; coding, tests and PRs still work. Tell the human:', describe(bad));
  }
  if (unknown.length) lines.push(`Note: could not check MCP server(s) ${unknown.join(', ')}; planning is not blocked on them.`);
  return lines.join('\n');
}

function repoRootOf(cwd) {
  const r = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : cwd;
}

if (require.main === module) Promise.resolve(main(process.argv.slice(2))).then((code) => { process.exitCode = code; });

// The installed gstack checkout, or null. Used by the review gate to call gstack's own tools.
const gstackRoot = (env = process.env) => gstackState(env).root;

module.exports = { runChecks, missing, fixText, sessionContext, gstackRoot, PINS };
