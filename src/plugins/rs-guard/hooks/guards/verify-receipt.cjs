'use strict';
// Deny a non-draft `gh pr create` (or `gh pr ready`) unless the tests passed on the current HEAD with a clean tree.
const { trackedTreeClean } = require('../lib/git.cjs');
const { prContext, NO_REPO } = require('../lib/pr.cjs');
const { readReceipt, receiptCli } = require('../lib/receipts.cjs');

module.exports = {
  name: 'verify-receipt',
  check(ctx) {
    const pr = prContext(ctx);
    if (!pr) return null;
    const { root, sha } = pr;
    if (!sha) return pr.why || NO_REPO;
    const fix = `Commit your work, then run \`${receiptCli()} verify -- <test command>\`, then retry. `
      + 'Or open a draft PR with `--draft`.';
    if (!trackedTreeClean(root)) return `Blocked: uncommitted changes to tracked files. ${fix}`;
    const r = readReceipt(root, 'verify', sha);
    if (!r) return `Blocked: no verify receipt for HEAD ${sha.slice(0, 12)}. ${fix}`;
    if (r.sha !== sha || r.result !== 'pass' || r.tree_clean !== true) {
      return `Blocked: the verify receipt for HEAD ${sha.slice(0, 12)} is not a clean pass `
        + `(result: ${r.result}, exit code: ${r.exit_code}). Fix the failures. ${fix}`;
    }
    return null;
  },
};
