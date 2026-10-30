'use strict';
// Deny git commands that destroy work or bypass review. Ordinary `git push` of a feature branch is
// allowed: feature branches must be pushed to open PRs.
const { parseGit, currentBranch, protectedBranches } = require('../lib/git.cjs');

const PUSH_OPTS_WITH_VALUE = new Set(['-o', '--push-option', '--repo', '--receive-pack', '--exec']);

const shortCluster = (a, letter) => /^-[A-Za-z]+$/.test(a) && a.includes(letter);
const hasFlag = (args, long, letter) => args.some((a) => a === long || shortCluster(a, letter));

function checkPush(args, cwd) {
  const positional = [];
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--force' || a.startsWith('--force-with-lease') || shortCluster(a, 'f')) {
      return 'force-push rewrites shared history';
    }
    if (a === '--mirror' || a === '--all') return `\`git push ${a}\` would push the default branch`;
    if (PUSH_OPTS_WITH_VALUE.has(a)) i += 1;
    else if (a === '--') continue;
    else if (!a.startsWith('-')) positional.push(a);
  }
  if (positional.slice(1).some((r) => r.startsWith('+'))) return 'a `+refspec` is a force-push';

  const protectedSet = protectedBranches(cwd);
  const refspecs = positional.slice(1);
  const branch = currentBranch(cwd);
  const targets = refspecs.length
    ? refspecs.map((r) => {
      const dst = r.includes(':') ? r.slice(r.indexOf(':') + 1) : r;
      const name = dst.replace(/^refs\/heads\//, '');
      return name === 'HEAD' ? branch : name;
    })
    : [branch];
  const hit = targets.find((t) => t && protectedSet.has(t));
  return hit ? `pushing to the default branch \`${hit}\` bypasses review; push a feature branch and open a PR` : null;
}

function checkGit(g) {
  const { sub, args } = g;
  switch (sub) {
    case 'push':
      // Which branch is protected depends on the repository; a `cd` to a run-time path hides it.
      return g.cwd ? checkPush(args, g.cwd) : 'cannot tell which repository this push targets (a `cd` in the same '
        + 'command goes to a path only known at run time); run `git push` from inside the repository';
    case 'reset':
      return args.includes('--hard') ? '`git reset --hard` discards uncommitted work' : null;
    case 'clean':
      return hasFlag(args, '--force', 'f') ? '`git clean -f` deletes untracked files' : null;
    case 'branch': {
      const del = hasFlag(args, '--delete', 'd');
      const force = hasFlag(args, '--force', 'f');
      return hasFlag(args, null, 'D') || (del && force) ? '`git branch -D` deletes a branch even if it is not merged' : null;
    }
    case 'checkout':
      return args.includes('.') ? '`git checkout .` discards uncommitted changes' : null;
    case 'restore': {
      if (!args.includes('.')) return null;
      const stagedOnly = hasFlag(args, '--staged', 'S') && !hasFlag(args, '--worktree', 'W');
      return stagedOnly ? null : '`git restore .` discards uncommitted changes';
    }
    default:
      return null;
  }
}

module.exports = {
  name: 'dangerous-git',
  check({ steps }) {
    for (const { argv, cwd } of steps) {
      const g = parseGit(argv, cwd);
      if (!g) continue;
      const reason = checkGit(g);
      if (reason) return `Blocked: ${reason}. If this is really needed, ask the human to run it themselves.`;
    }
    return null;
  },
};
