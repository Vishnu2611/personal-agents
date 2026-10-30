'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { tempRepo, runHook, bashInput, denied, git } = require('./helpers.cjs');

const run = (cmd, cwd) => runHook('pre-bash.cjs', bashInput(cmd, cwd));

const DENIED_ON_FEATURE_BRANCH = [
  'git push --force',
  'git push -f origin feat/x',
  'git push -uf origin feat/x',
  'git push --force-with-lease origin feat/x',
  'git push origin +feat/x',
  'git push origin main',
  'git push origin feat/x:main',
  'git push origin HEAD:refs/heads/master',
  'git push origin :main',
  'git push --all',
  'git -C . push origin main',
  'git reset --hard',
  'git reset --hard HEAD~1',
  'git clean -f',
  'git clean -fdx',
  'git branch -D old',
  'git branch --delete --force old',
  'git checkout .',
  'git checkout -- .',
  'git restore .',
  'git restore --staged --worktree .',
  'npm test && git push --force',
];

const ALLOWED_ON_FEATURE_BRANCH = [
  'git push',
  'git push origin feat/x',
  'git push -u origin feat/x',
  'git push origin HEAD',
  'git reset --soft HEAD~1',
  'git clean -n',
  'git branch -d merged',
  'git checkout main',
  'git checkout -- a.txt',
  'git restore --staged .',
  'git status',
  'git commit -m "never git push --force"',
  'echo git reset --hard',
  "cat <<'EOF'\ngit push --force\nEOF",
];

test('dangerous git commands are denied', (t) => {
  const dir = tempRepo(t);
  for (const cmd of DENIED_ON_FEATURE_BRANCH) {
    const r = run(cmd, dir);
    assert.equal(r.status, 0, cmd);
    assert.ok(denied(r), `expected deny: ${cmd}`);
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /^\[rs-guard:dangerous-git\] Blocked:/);
  }
});

test('ordinary git commands on a feature branch are allowed', (t) => {
  const dir = tempRepo(t);
  for (const cmd of ALLOWED_ON_FEATURE_BRANCH) {
    const r = run(cmd, dir);
    assert.equal(r.status, 0, cmd);
    assert.equal(r.stdout, '', `expected no decision: ${cmd}`);
  }
});

test('a bare push while on the default branch is denied', (t) => {
  const dir = tempRepo(t, { branch: 'main' });
  assert.ok(denied(run('git push', dir)));
  assert.ok(denied(run('git push origin', dir)));
  assert.ok(denied(run('git push origin HEAD', dir)));
});

test('the branch origin/HEAD points at is protected too', (t) => {
  const dir = tempRepo(t);
  git(dir, 'update-ref', 'refs/remotes/origin/develop', 'HEAD');
  git(dir, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/develop');
  assert.ok(denied(run('git push origin develop', dir)));
});

test('non-Bash tools and malformed input produce no decision', () => {
  assert.equal(runHook('pre-bash.cjs', { tool_name: 'Read', tool_input: { file_path: 'x' } }).stdout, '');
  const r = runHook('pre-bash.cjs', 'not json');
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '');
});
