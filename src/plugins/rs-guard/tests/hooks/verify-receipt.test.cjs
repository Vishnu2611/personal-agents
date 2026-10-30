'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { HOOKS, tempRepo, runHook, bashInput, denied, git } = require('./helpers.cjs');

const prCreate = (cwd, cmd = 'gh pr create --fill') => runHook('pre-bash.cjs', bashInput(cmd, cwd));
const receipt = (cwd, ...args) => spawnSync('node', [path.join(HOOKS, 'bin', 'rs-receipt.cjs'), ...args],
  { cwd, encoding: 'utf8' });
const reason = (r) => r.json.hookSpecificOutput.permissionDecisionReason;

test('PR is denied without a verify receipt', (t) => {
  const dir = tempRepo(t);
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /\[rs-guard:verify-receipt\] Blocked: no verify receipt for HEAD/);
  assert.match(reason(r), /rs-receipt\.cjs" verify -- <test command>/);
});

test('rs-receipt verify writes a pass receipt and the PR is allowed', (t) => {
  const dir = tempRepo(t);
  const w = receipt(dir, 'verify', '--', 'node', '-e', 'process.exit(0)');
  assert.equal(w.status, 0, w.stderr);
  const sha = git(dir, 'rev-parse', 'HEAD');
  const rec = JSON.parse(fs.readFileSync(path.join(dir, '.rs-receipts', 'verify', `${sha}.json`), 'utf8'));
  assert.equal(rec.kind, 'verify');
  assert.equal(rec.sha, sha);
  assert.equal(rec.result, 'pass');
  assert.equal(rec.exit_code, 0);
  assert.equal(rec.tree_clean, true);
  assert.ok(rec.created_at && rec.tool_version && rec.command);
  assert.equal(prCreate(dir).stdout, '');
});

test('a failing test run records fail and the PR stays denied', (t) => {
  const dir = tempRepo(t);
  const w = receipt(dir, 'verify', '--', 'node -e "process.exit(3)"');
  assert.equal(w.status, 3);
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /not a clean pass \(result: fail, exit code: 3\)/);
});

test('a new commit invalidates the receipt (sha mismatch)', (t) => {
  const dir = tempRepo(t);
  receipt(dir, 'verify', '--', 'true');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'changed\n');
  git(dir, 'commit', '-qam', 'more');
  assert.ok(denied(prCreate(dir)));
});

test('uncommitted tracked changes deny the PR even with a receipt', (t) => {
  const dir = tempRepo(t);
  receipt(dir, 'verify', '--', 'true');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'dirty\n');
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /uncommitted changes to tracked files/);
});

test('untracked files do not block', (t) => {
  const dir = tempRepo(t);
  receipt(dir, 'verify', '--', 'true');
  fs.writeFileSync(path.join(dir, 'notes.pdf'), 'x');
  assert.equal(prCreate(dir).stdout, '');
});

test('rs-receipt refuses to verify a dirty tree', (t) => {
  const dir = tempRepo(t);
  fs.writeFileSync(path.join(dir, 'a.txt'), 'dirty\n');
  const w = receipt(dir, 'verify', '--', 'true');
  assert.equal(w.status, 2);
  assert.match(w.stderr, /commit first/);
});

test('tests that modify tracked files produce a fail receipt', (t) => {
  const dir = tempRepo(t);
  const w = receipt(dir, 'verify', '--', 'node -e "require(\'fs\').writeFileSync(\'a.txt\',\'x\')"');
  assert.equal(w.status, 1);
  assert.match(w.stderr, /receipt marked fail/);
});

test('draft PRs are allowed without a receipt', (t) => {
  const dir = tempRepo(t);
  assert.equal(prCreate(dir, 'gh pr create --draft --fill').stdout, '');
  assert.equal(prCreate(dir, 'gh pr create -d').stdout, '');
});

test('text mentioning gh pr create is not an invocation', (t) => {
  const dir = tempRepo(t);
  assert.equal(prCreate(dir, 'echo "gh pr create"').stdout, '');
  assert.equal(prCreate(dir, "cat > notes.md <<'EOF'\nrun gh pr create later\nEOF").stdout, '');
  assert.equal(prCreate(dir, 'git commit -m "gh pr create"').stdout, '');
  assert.equal(prCreate(dir, 'gh pr view').stdout, '');
});

test('gh pr create chained after other commands is caught', (t) => {
  const dir = tempRepo(t);
  assert.ok(denied(prCreate(dir, 'git push -u origin feat/x && gh pr create --fill')));
  assert.ok(denied(prCreate(dir, 'gh -R org/repo pr create --title "x"')));
});

test('rs-receipt status reports receipts for HEAD', (t) => {
  const dir = tempRepo(t);
  receipt(dir, 'verify', '--', 'true');
  const s = receipt(dir, 'status');
  assert.equal(s.status, 0);
  assert.match(s.stdout, /verify: pass/);
  assert.match(s.stdout, /qa: missing/);
  assert.match(s.stdout, /gstack \/review: /);
});

test('gh pr ready (draft becoming reviewable) is gated like a non-draft create', (t) => {
  const dir = tempRepo(t);
  const r = prCreate(dir, 'gh pr ready 12');
  assert.ok(denied(r));
  assert.match(reason(r), /verify-receipt\] Blocked: no verify receipt/);
  assert.equal(prCreate(dir, 'gh pr ready --undo 12').stdout, '');
  receipt(dir, 'verify', '--', 'true');
  assert.equal(prCreate(dir, 'gh pr ready').stdout, '');
});
