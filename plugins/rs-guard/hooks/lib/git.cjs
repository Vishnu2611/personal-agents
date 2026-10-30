'use strict';
// Git helpers for the guards, plus argv parsers for `git ...` and the gh commands that open a PR for review.
const { spawnSync } = require('child_process');
const path = require('path');
const { basename } = require('./shell.cjs');

function git(cwd, args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

const repoRoot = (cwd) => git(cwd, ['rev-parse', '--show-toplevel']);
const headSha = (cwd) => git(cwd, ['rev-parse', 'HEAD']);
const currentBranch = (cwd) => git(cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD']);

// `owner/name` of the origin remote (https or ssh form), or null.
function originSlug(cwd) {
  const url = git(cwd, ['remote', 'get-url', 'origin']);
  const m = url && url.match(/[:/]([^/:]+\/[^/]+?)(?:\.git)?\/?$/);
  return m ? m[1].toLowerCase() : null;
}

// Tracked changes only: untracked files never make the tree "dirty" for receipts.
function trackedTreeClean(cwd) {
  const out = git(cwd, ['status', '--porcelain', '--untracked-files=no']);
  return out !== null && out === '';
}

// main, master, and whatever origin/HEAD points at.
function protectedBranches(cwd) {
  const set = new Set(['main', 'master']);
  const ref = git(cwd, ['symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD']);
  if (ref && ref.includes('/')) set.add(ref.slice(ref.indexOf('/') + 1));
  return set;
}

const GIT_OPTS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--exec-path', '--config-env']);

// `git [global opts] <sub> args...` -> {sub, args, cwd} (cwd adjusted for -C; null when unknown), or null if not git.
function parseGit(argv, cwd) {
  if (!argv.length || basename(argv[0]) !== 'git') return null;
  let dir = cwd;
  let i = 1;
  while (i < argv.length && argv[i].startsWith('-')) {
    const opt = argv[i];
    if (opt === '-C' && i + 1 < argv.length) {
      const to = argv[i + 1];
      dir = path.isAbsolute(to) ? path.resolve(to) : dir && path.resolve(dir, to);
    }
    i += GIT_OPTS_WITH_VALUE.has(opt) ? 2 : 1;
  }
  if (i >= argv.length) return null;
  return { sub: argv[i], args: argv.slice(i + 1), cwd: dir };
}

const GH_OPTS_WITH_VALUE = new Set(['-R', '--repo', '-B', '--base', '-H', '--head', '-t', '--title', '-b', '--body',
  '-F', '--body-file', '-a', '--assignee', '-l', '--label', '-m', '--milestone', '-p', '--project', '-r', '--reviewer',
  '-T', '--template']);

// `gh pr create` -> {draft, repo}; `gh pr ready` (a draft becoming reviewable, as /implement-spec ends) ->
// {draft: false}, or {draft: true} with --undo. repo = the `-R/--repo` value, else null. null for any other command. `gh pr ready <n>` is
// checked against the current HEAD: the harness assumes it runs on the PR's own branch.
function parsePrForReview(argv) {
  if (!argv.length || basename(argv[0]) !== 'gh') return null;
  const positional = [];
  let draft = false;
  let repo = null;
  for (let i = 1; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--draft' || a === '-d' || a === '--draft=true') draft = true;
    else if (a === '-R' || a === '--repo') { repo = argv[i + 1] || ''; i += 1; }
    else if (a.startsWith('--repo=')) repo = a.slice('--repo='.length);
    else if (GH_OPTS_WITH_VALUE.has(a)) i += 1;
    else if (!a.startsWith('-')) positional.push(a);
  }
  if (positional[0] !== 'pr') return null;
  if (positional[1] === 'create') return { draft, repo };
  if (positional[1] === 'ready') return { draft: argv.includes('--undo'), repo };
  return null;
}

module.exports = { git, originSlug, repoRoot, headSha, currentBranch, trackedTreeClean, protectedBranches, parseGit, parsePrForReview };
