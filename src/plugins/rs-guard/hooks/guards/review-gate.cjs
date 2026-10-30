'use strict';
// Deny a non-draft `gh pr create` (or `gh pr ready`) unless gstack's /review finished a clean pass on
// exactly the current working-tree content. Freshness is gstack's own verdict: gstack-review-read
// grades each review row CURRENT / STALE / UNVERIFIED against a working-tree content fingerprint, so
// committing reviewed content keeps it CURRENT and any later change (including a QA report) makes it
// STALE. Applies to every branch. A missing gstack install is reported by the dependencies check.
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { prContext } = require('../lib/pr.cjs');
const { gstackRoot } = require('../bin/rs-doctor.cjs');

const ORDER = 'Run gstack `/review` as the last step before `rs-receipt verify` (after QA is recorded); it must '
  + 'finish clean, with no open findings, on the current code. If it changes code, re-run QA and the receipts.';

function readReviews(root, repo) {
  const bin = path.join(root, 'bin', 'gstack-review-read');
  if (!fs.existsSync(bin)) return { error: `${bin} not found` };
  const r = spawnSync(bin, [], { cwd: repo, encoding: 'utf8', timeout: 20000 });
  if (r.error || r.status !== 0) return { error: (r.error && r.error.message) || r.stderr.trim() || `exit ${r.status}` };
  const head = r.stdout.split('---CONFIG---')[0].trim();
  if (head === 'NO_REVIEWS' || head === '') return { rows: [] };
  const rows = head.split('\n').flatMap((l) => { try { return [JSON.parse(l)]; } catch { return []; } });
  return { rows: rows.filter((row) => row.skill === 'review') };
}

// One-line verdict for `rs-receipt status`: CURRENT, the latest verdict with its reason, or why unknown.
function reviewSummary(repo) {
  const root = gstackRoot();
  if (!root) return 'unknown (gstack not installed)';
  const { rows, error } = readReviews(root, repo);
  if (error) return `unknown (${error})`;
  if (rows.some((row) => row.review_freshness && row.review_freshness.status === 'CURRENT')) return 'CURRENT';
  if (!rows.length) return 'none on this branch';
  const f = rows[rows.length - 1].review_freshness || { status: 'UNVERIFIED', reason: 'no freshness verdict' };
  return `${f.status} (${f.reason})`;
}

module.exports = {
  reviewSummary,
  name: 'review-gate',
  check(ctx) {
    const pr = prContext(ctx);
    if (!pr || !pr.sha) return null; // verify-receipt reports a missing repo
    const root = gstackRoot();
    if (!root) return null; // the dependencies check reports a missing gstack
    const { rows, error } = readReviews(root, pr.root);
    if (error) return `Blocked: could not read gstack's review log (${error}). ${ORDER}`;
    if (rows.some((row) => row.review_freshness && row.review_freshness.status === 'CURRENT')) return null;
    if (!rows.length) return `Blocked: no gstack /review recorded for branch \`${pr.branch}\`. ${ORDER}`;
    const last = rows[rows.length - 1];
    const f = last.review_freshness || { status: 'UNVERIFIED', reason: 'no freshness verdict' };
    return `Blocked: the latest gstack /review is ${f.status} (${f.reason}). ${ORDER}`;
  },
};
