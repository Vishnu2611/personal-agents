'use strict';
// The gates check the repository a command actually acts on: a `cd` earlier in the same command,
// `git -C` or `gh --repo` can point it away from the session's directory.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { spawnSync } = require('child_process');
const { HOOKS, tempRepo, runHook, bashInput, denied, git } = require('./helpers.cjs');

const run = (cwd, cmd) => runHook('pre-bash.cjs', bashInput(cmd, cwd));
const reason = (r) => r.json.hookSpecificOutput.permissionDecisionReason;
const verified = (dir) => {
  const r = spawnSync('node', [path.join(HOOKS, 'bin', 'rs-receipt.cjs'), 'verify', '--', 'true'], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return dir;
};

test('a PR after cd into another repo is checked against that repo', (t) => {
  const ready = verified(tempRepo(t));
  const bare = tempRepo(t);
  assert.equal(run(ready, 'gh pr create --fill').stdout, '');
  const r = run(ready, `cd ${path.relative(ready, bare)} && gh pr create --fill`);
  assert.ok(denied(r));
  assert.match(reason(r), /\[rs-guard:verify-receipt\] Blocked: no verify receipt/);
  assert.equal(run(bare, `cd "${ready}" && gh pr create --fill`).stdout, '');
});

test('a cd inside a subshell does not move the PR', (t) => {
  const ready = verified(tempRepo(t));
  const bare = tempRepo(t);
  assert.equal(run(ready, `(cd "${bare}" && git status) && gh pr create --fill`).stdout, '');
});

test('a PR after a cd to a run-time path is denied', (t) => {
  const ready = verified(tempRepo(t));
  const r = run(ready, 'cd "$REPO" && gh pr create --fill');
  assert.ok(denied(r));
  assert.match(reason(r), /cannot tell which repository this PR command runs in/);
});

test('gh --repo is accepted only for this checkout\'s origin', (t) => {
  const ready = verified(tempRepo(t));
  git(ready, 'remote', 'add', 'origin', 'git@github.com:Acme/compass-fe.git');
  assert.equal(run(ready, 'gh pr create --fill -R acme/compass-fe').stdout, '');
  assert.equal(run(ready, 'gh pr create --fill --repo=https://github.com/Acme/compass-fe').stdout, '');
  const r = run(ready, 'gh pr create --fill -R acme/compass-be');
  assert.ok(denied(r));
  assert.match(reason(r), /`--repo acme\/compass-be` is not this checkout's origin/);
});

test('a push after cd into a repo on main is denied', (t) => {
  const feature = tempRepo(t);
  const onMain = tempRepo(t, { branch: 'main' });
  assert.equal(run(feature, 'git push origin HEAD').stdout, '');
  const r = run(feature, `cd "${onMain}" && git push`);
  assert.ok(denied(r));
  assert.match(reason(r), /pushing to the default branch `main`/);
});

test('a push after a cd to a run-time path is denied', (t) => {
  const feature = tempRepo(t);
  const r = run(feature, 'cd "$REPO" && git push');
  assert.ok(denied(r));
  assert.match(reason(r), /cannot tell which repository this push targets/);
  assert.ok(denied(run(feature, 'cd "$REPO" && git -C be push')));
  assert.equal(run(feature, `cd "$REPO" && git -C "${feature}" push origin HEAD`).stdout, '');
});
