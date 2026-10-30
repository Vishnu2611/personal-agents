'use strict';
// Deny a non-draft `gh pr create` (or `gh pr ready`) on a ticket branch unless QA passed on the current HEAD with no
// failing P0 scenario. Branches with no ticket ID (chores) are not QA-gated, nor are infra repos
// (.rs-harness.json role "infra"), whose plan output goes in the PR instead.
const { prContext } = require('../lib/pr.cjs');
const { roleOf } = require('../lib/project.cjs');
const { readReceipt, receiptCli } = require('../lib/receipts.cjs');

module.exports = {
  name: 'qa-receipt',
  check(ctx) {
    const pr = prContext(ctx);
    if (!pr) return null;
    if (!pr.sha || !pr.ticket) return null; // verify-receipt reports a missing repo
    const { gates } = roleOf(pr.root);
    if (!gates || !gates.qa) return null; // an unknown role is reported by prototype-gate
    const fix = `Run rs-delivery:qa-verify-report (${gates.qa} QA), commit its Execution Reports/ file, then run `
      + `\`${receiptCli()} qa --report "<report path>" --p0-failed <n>\`. Or open a draft PR with \`--draft\`.`;
    const r = readReceipt(pr.root, 'qa', pr.sha);
    if (!r) return `Blocked: ${pr.ticket} has no QA receipt for HEAD ${pr.sha.slice(0, 12)}. ${fix}`;
    if (r.sha !== pr.sha || r.result !== 'pass' || r.p0_failed !== 0) {
      return `Blocked: the QA receipt for HEAD ${pr.sha.slice(0, 12)} is not a pass `
        + `(${r.p0_failed} P0 scenario(s) failed or blocked, report: ${r.report}). Fix them and re-run QA.`;
    }
    return null;
  },
};
