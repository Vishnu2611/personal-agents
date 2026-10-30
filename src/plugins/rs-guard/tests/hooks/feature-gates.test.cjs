'use strict';
// prototype-gate and qa-receipt: only ticket branches are gated.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { HOOKS, tempRepo, runHook, bashInput, denied, git } = require('./helpers.cjs');

const prCreate = (cwd) => runHook('pre-bash.cjs', bashInput('gh pr create --fill', cwd));
const receipt = (cwd, ...args) => spawnSync('node', [path.join(HOOKS, 'bin', 'rs-receipt.cjs'), ...args],
  { cwd, encoding: 'utf8' });
const reason = (r) => (r.json ? r.json.hookSpecificOutput.permissionDecisionReason : '');

const APPROVED = '## Prototype Approval\nPrototype: Prototypes/checkin.html\nVerdict: APPROVED\nApproved: 2026-10-13\n';

function addDesign(dir, { ticket = 'RS-142', approval = APPROVED } = {}) {
  fs.mkdirSync(path.join(dir, 'Feature Designs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'Feature Designs', 'checkin.md'),
    `---\nticket: ${ticket}\n---\n# Check-in\n\n## Flow\nx\n\n${approval}`);
}

function addReport(dir) {
  fs.mkdirSync(path.join(dir, 'Execution Reports'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'Execution Reports', 'qa.md'), '# QA\nP0 pass rate 100%\n');
}

function commitAll(dir, msg = 'work') {
  git(dir, 'add', '-A');
  git(dir, 'commit', '-qm', msg);
}

// Everything a ticket branch needs: approved design, committed report, QA + verify receipts on HEAD.
function readyTicketRepo(t) {
  const dir = tempRepo(t, { branch: 'feat/RS-142-checkin' });
  addDesign(dir);
  addReport(dir);
  commitAll(dir);
  assert.equal(receipt(dir, 'qa', '--report', 'Execution Reports/qa.md', '--p0-failed', '0').status, 0);
  assert.equal(receipt(dir, 'verify', '--', 'true').status, 0);
  return dir;
}

test('a ticket branch with approved design, QA and verify receipts may open a PR', (t) => {
  const r = prCreate(readyTicketRepo(t));
  assert.equal(r.stdout, '', reason(r));
});

test('a chore branch needs only the verify receipt', (t) => {
  const dir = tempRepo(t, { branch: 'chore/bump-deps' });
  receipt(dir, 'verify', '--', 'true');
  assert.equal(prCreate(dir).stdout, '');
});

test('ticket branch without a design brief is denied by prototype-gate', (t) => {
  const dir = tempRepo(t, { branch: 'feat/RS-142-checkin' });
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /\[rs-guard:prototype-gate\] Blocked: branch `feat\/RS-142-checkin` is for ticket RS-142/);
  assert.match(reason(r), /\[rs-guard:qa-receipt\] Blocked: RS-142 has no QA receipt/);
});

test('design without APPROVED verdict is denied', (t) => {
  const dir = tempRepo(t, { branch: 'feat/RS-142-checkin' });
  addDesign(dir, { approval: '## Prototype Approval\nVerdict: REJECTED\n' });
  addReport(dir);
  commitAll(dir);
  receipt(dir, 'qa', '--report', 'Execution Reports/qa.md', '--p0-failed', '0');
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /Feature Designs\/checkin\.md` has no `## Prototype Approval` section with `Verdict: APPROVED`/);
  assert.doesNotMatch(reason(r), /qa-receipt|verify-receipt/);
});

test('design for a different ticket does not count', (t) => {
  const dir = tempRepo(t, { branch: 'feat/RS-142-checkin' });
  addDesign(dir, { ticket: 'RS-999' });
  commitAll(dir);
  assert.match(reason(prCreate(dir)), /prototype-gate\] Blocked: branch/);
});

test('QA receipt with failing P0 is denied', (t) => {
  const dir = tempRepo(t, { branch: 'feat/RS-142-checkin' });
  addDesign(dir);
  addReport(dir);
  commitAll(dir);
  assert.equal(receipt(dir, 'qa', '--report', 'Execution Reports/qa.md', '--p0-failed', '2').status, 1);
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /qa-receipt\] Blocked: the QA receipt for HEAD \w+ is not a pass \(2 P0/);
});

test('a commit after QA invalidates the QA receipt', (t) => {
  const dir = readyTicketRepo(t);
  fs.writeFileSync(path.join(dir, 'a.txt'), 'fix\n');
  commitAll(dir, 'fix');
  receipt(dir, 'verify', '--', 'true');
  assert.match(reason(prCreate(dir)), /qa-receipt\] Blocked: RS-142 has no QA receipt/);
});

test('lowercase ticket branch is gated once the project lists its prefix', (t) => {
  const dir = tempRepo(t, { branch: 'vishnu/rs-142-checkin' });
  receipt(dir, 'verify', '--', 'true');
  assert.equal(prCreate(dir).stdout, '', 'no prefixes: lowercase is not a ticket');
  fs.writeFileSync(path.join(dir, '.rs-harness.json'), '{"ticket_prefixes": ["RS"]}\n');
  commitAll(dir, 'config');
  receipt(dir, 'verify', '--', 'true');
  assert.match(reason(prCreate(dir)), /prototype-gate\] Blocked: branch `vishnu\/rs-142-checkin` is for ticket RS-142/);
});

test('rs-receipt qa refuses an uncommitted report and bad arguments', (t) => {
  const dir = tempRepo(t, { branch: 'feat/RS-142-checkin' });
  addReport(dir);
  const w = receipt(dir, 'qa', '--report', 'Execution Reports/qa.md', '--p0-failed', '0');
  assert.equal(w.status, 2);
  assert.match(w.stderr, /commit the report first/);
  assert.equal(receipt(dir, 'qa', '--report', 'x.md').status, 2);
  assert.equal(receipt(dir, 'qa', '--report', 'missing.md', '--p0-failed', '0').status, 2);
});

// review-gate: gstack's own freshness verdict decides; applies to every branch.
function reviewRows(t, content) {
  const f = path.join(fs.mkdtempSync(path.join(require('os').tmpdir(), 'rs-rows-')), 'rows.txt');
  t.after(() => fs.rmSync(path.dirname(f), { recursive: true, force: true }));
  fs.writeFileSync(f, content);
  return { RS_TEST_REVIEW_ROWS: f };
}
const prWith = (cwd, env) => runHook('pre-bash.cjs', bashInput('gh pr create --fill', cwd), env);

test('review-gate: no gstack /review denies, on a chore branch too', (t) => {
  const dir = tempRepo(t, { branch: 'chore/bump-deps' });
  receipt(dir, 'verify', '--', 'true');
  const r = prWith(dir, reviewRows(t, 'NO_REVIEWS\n'));
  assert.ok(denied(r));
  assert.match(reason(r), /\[rs-guard:review-gate\] Blocked: no gstack \/review recorded for branch `chore\/bump-deps`/);
  assert.match(reason(r), /last step before `rs-receipt verify`/);
});

test('review-gate: a STALE review denies with gstack\'s reason', (t) => {
  const dir = tempRepo(t);
  receipt(dir, 'verify', '--', 'true');
  const rows = [
    { skill: 'review', review_freshness: { status: 'STALE', reason: 'working-tree content differs from reviewed content' } },
    { skill: 'plan-eng-review' },
  ].map((r) => JSON.stringify(r)).join('\n');
  const r = prWith(dir, reviewRows(t, `${rows}\n`));
  assert.match(reason(r), /review-gate\] Blocked: the latest gstack \/review is STALE \(working-tree content differs/);
});

test('review-gate: any CURRENT review row allows; drafts are not checked', (t) => {
  const dir = tempRepo(t);
  receipt(dir, 'verify', '--', 'true');
  const rows = [
    { skill: 'review', review_freshness: { status: 'STALE', reason: 'old' } },
    { skill: 'review', review_freshness: { status: 'CURRENT', reason: 'completed clean pass on unchanged content' } },
  ].map((r) => JSON.stringify(r)).join('\n');
  assert.equal(prWith(dir, reviewRows(t, `${rows}\n`)).stdout, '');
  assert.equal(runHook('pre-bash.cjs', bashInput('gh pr create --draft', dir), reviewRows(t, 'NO_REVIEWS\n')).stdout, '');
});

test('rs-receipt status reports gstack /review verdict', (t) => {
  const dir = tempRepo(t);
  const status = (env) => spawnSync('node', [path.join(HOOKS, 'bin', 'rs-receipt.cjs'), 'status'],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, ...require('./helpers.cjs').healthyEnv(), ...env } }).stdout;
  assert.match(status({}), /gstack \/review: CURRENT/);
  assert.match(status(reviewRows(t, 'NO_REVIEWS\n')), /gstack \/review: none on this branch/);
  const stale = JSON.stringify({ skill: 'review', review_freshness: { status: 'STALE', reason: 'working-tree content differs' } });
  assert.match(status(reviewRows(t, `${stale}\n`)), /gstack \/review: STALE \(working-tree content differs\)/);
});

// Repo roles (.rs-harness.json "role") for multi-repo projects: fe keeps every gate, be drops the
// prototype gate, infra drops prototype and QA.
const setRole = (dir, role) => {
  fs.writeFileSync(path.join(dir, '.rs-harness.json'), JSON.stringify({ role, ticket_prefixes: ['COM'] }));
  commitAll(dir, 'role');
};

test('role fe keeps the prototype gate', (t) => {
  const dir = tempRepo(t, { branch: 'feat/COM-15-report-page' });
  setRole(dir, 'fe');
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /\[rs-guard:prototype-gate\] Blocked: branch `feat\/COM-15-report-page` is for ticket COM-15/);
  assert.match(reason(r), /\[rs-guard:qa-receipt\] Blocked: COM-15 has no QA receipt/);
  assert.match(reason(r), /qa-verify-report \(browser QA\)/);
});

test('role be needs QA but no prototype', (t) => {
  const dir = tempRepo(t, { branch: 'feat/COM-14-report-api' });
  setRole(dir, 'be');
  receipt(dir, 'verify', '--', 'true');
  let r = prCreate(dir);
  assert.ok(denied(r));
  assert.doesNotMatch(reason(r), /prototype-gate/);
  assert.match(reason(r), /\[rs-guard:qa-receipt\] Blocked: COM-14 has no QA receipt.*\(API QA\)/);
  addReport(dir);
  addSpec(dir, '---\nfeature: report\ntickets: [COM-12, COM-14]\nsource: https://linear.app/acme/issue/COM-12\n---');
  commitAll(dir, 'qa report and spec');
  assert.equal(receipt(dir, 'qa', '--report', 'Execution Reports/qa.md', '--p0-failed', '0').status, 0);
  assert.equal(receipt(dir, 'verify', '--', 'true').status, 0);
  r = prCreate(dir);
  assert.equal(r.stdout, '', reason(r));
});

test('role infra needs only the verify receipt', (t) => {
  const dir = tempRepo(t, { branch: 'feat/COM-13-report-storage' });
  setRole(dir, 'infra');
  addSpec(dir, '---\nfeature: report\ntickets: [COM-13]\nsource: https://linear.app/acme/issue/COM-12\n---');
  commitAll(dir, 'spec');
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.equal(r.stdout, '', reason(r));
});

test('an unknown role denies the PR and names the valid ones', (t) => {
  const dir = tempRepo(t, { branch: 'chore/x' });
  setRole(dir, 'frontend');
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /\.rs-harness\.json has "role": "frontend"; use one of "fe", "be", "infra"/);
});

test('rs-receipt status shows the role and its ticket gates', (t) => {
  const dir = tempRepo(t);
  assert.match(receipt(dir, 'status').stdout, /role: none \(single repo\); ticket branches also need: prototype approval, browser or API QA/);
  setRole(dir, 'infra');
  assert.match(receipt(dir, 'status').stdout, /role: infra; ticket branches also need: nothing more/);
  setRole(dir, 'be');
  assert.match(receipt(dir, 'status').stdout, /role: be; ticket branches also need: API QA/);
});

// spec-source: in a multi-repo project, a ticket branch needs a spec listing the ticket and citing a source.
function addSpec(dir, frontmatter) {
  fs.mkdirSync(path.join(dir, 'specs', 'report'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'specs', 'report', 'requirements.md'), `${frontmatter}\n# Requirements — Report\n`);
}

function infraTicket(t) {
  const dir = tempRepo(t, { branch: 'feat/COM-13-report-storage' });
  setRole(dir, 'infra');
  return dir;
}

const finish = (dir) => { commitAll(dir, 'spec'); assert.equal(receipt(dir, 'verify', '--', 'true').status, 0); return prCreate(dir); };

test('a role repo ticket branch needs a spec that lists the ticket', (t) => {
  const dir = infraTicket(t);
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /\[rs-guard:spec-source\] Blocked: no `specs\/\*\/requirements\.md` lists COM-13/);
});

test('a spec listing the ticket with a source URL passes, inline or block list', (t) => {
  const a = infraTicket(t);
  addSpec(a, '---\nfeature: report\ntickets: [COM-12, com-13]\nsource: https://www.notion.so/acme/Compass-PRD-7a8b\nsource_edited: unknown\nrepo_role: infra\n---');
  let r = finish(a);
  assert.equal(r.stdout, '', reason(r));
  const b = infraTicket(t);
  addSpec(b, '---\nfeature: report\ntickets:\n  - COM-12\n  - "COM-13"\nsource: "https://linear.app/acme/issue/COM-12"\n---');
  r = finish(b);
  assert.equal(r.stdout, '', reason(r));
});

test('a spec without a real source URL is denied', (t) => {
  const dir = infraTicket(t);
  addSpec(dir, '---\nfeature: report\ntickets: [COM-13]\nsource: <URL of the approved PRD page>\n---');
  const r = finish(dir);
  assert.ok(denied(r));
  assert.match(reason(r), /`specs\/report\/requirements\.md` lists COM-13 but has no `source:` URL/);
});

test('single-repo projects and chores are not spec-gated', (t) => {
  const single = readyTicketRepo(t);
  assert.equal(prCreate(single).stdout, '');
  const chore = tempRepo(t, { branch: 'chore/bump' });
  setRole(chore, 'be');
  receipt(chore, 'verify', '--', 'true');
  assert.equal(prCreate(chore).stdout, '');
});

test('a design brief listing several tickets clears the prototype gate for each', (t) => {
  const dir = tempRepo(t, { branch: 'feat/COM-16-report-filters' });
  setRole(dir, 'fe');
  fs.mkdirSync(path.join(dir, 'Feature Designs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'Feature Designs', 'report.md'),
    `---\ntickets: [COM-12, COM-15, COM-16]\n---\n# Report\n\n${APPROVED}`);
  receipt(dir, 'verify', '--', 'true');
  commitAll(dir, 'brief');
  receipt(dir, 'verify', '--', 'true');
  const r = prCreate(dir);
  assert.doesNotMatch(reason(r), /prototype-gate/);
});
