'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { ticketFromBranch, frontmatterTickets, prototypeApproved } = require(
  path.join(require('./helpers.cjs').HOOKS, 'lib', 'project.cjs'));

test('without ticket_prefixes only uppercase IDs count', () => {
  assert.equal(ticketFromBranch('feat/RS-142-checkin'), 'RS-142');
  assert.equal(ticketFromBranch('RS-7'), 'RS-7');
  assert.equal(ticketFromBranch('vishnu/rs-142-checkin'), null);
  assert.equal(ticketFromBranch('fix/utf-8-bug'), null);
  assert.equal(ticketFromBranch('chore/node-20-upgrade'), null);
  assert.equal(ticketFromBranch('feat/no-ticket'), null);
  assert.equal(ticketFromBranch(null), null);
});

test('with ticket_prefixes, listed prefixes match in any case and nothing else does', () => {
  const prefixes = ['RS', 'ABC'];
  assert.equal(ticketFromBranch('vishnu/rs-142-checkin', prefixes), 'RS-142');
  assert.equal(ticketFromBranch('feat/ABC-9', prefixes), 'ABC-9');
  assert.equal(ticketFromBranch('fix/utf-8-bug', prefixes), null);
  assert.equal(ticketFromBranch('feat/UTF-8', prefixes), null);
  assert.equal(ticketFromBranch('feat/xrs-1', prefixes), null);
});

test('frontmatter ticket is read and normalized', () => {
  assert.deepEqual(frontmatterTickets('---\nticket: rs-142\n---\n# X'), ['RS-142']);
  assert.deepEqual(frontmatterTickets('---\ntitle: x\nticket: "RS-1"\n---\n'), ['RS-1']);
  assert.deepEqual(frontmatterTickets('# X\nticket: RS-1\n'), []);
  assert.deepEqual(frontmatterTickets('---\ntickets: [COM-12, com-15]\n---\n'), ['COM-12', 'COM-15']);
  assert.deepEqual(frontmatterTickets('---\ntickets:\n  - COM-15\n  - "COM-16"\nsource: x\n---\n'), ['COM-15', 'COM-16']);
});

test('prototype approval needs Verdict: APPROVED inside the section', () => {
  const ok = '# F\n\n## Prototype Approval\nPrototype: x.html\nVerdict: APPROVED\nApproved: 2026-10-13\n';
  assert.equal(prototypeApproved(ok), true);
  assert.equal(prototypeApproved('# F\n\n## Prototype Approval\nVerdict: **APPROVED**\n'), true);
  assert.equal(prototypeApproved('# F\n## Prototype Approval\nVerdict: REJECTED\n'), false);
  assert.equal(prototypeApproved('# F\n## Prototype Approval\nVerdict: NOT APPROVED\n'), false);
  assert.equal(prototypeApproved('# F\n## Prototype Approval\n\n## Notes\nVerdict: APPROVED\n'), false);
  assert.equal(prototypeApproved('# F\nVerdict: APPROVED\n'), false);
});
