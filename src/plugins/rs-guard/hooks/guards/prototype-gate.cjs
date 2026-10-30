'use strict';
// Deny a non-draft `gh pr create` (or `gh pr ready`) on a ticket branch unless that ticket's design brief
// (`Feature Designs/*.md` with `ticket: <ID>` or `tickets: [<ID>, …]` frontmatter) records `Verdict: APPROVED` under
// `## Prototype Approval`. Branches with no ticket ID (chores) are not gated, nor are repos whose
// .rs-harness.json role has no UI (be, infra). An unknown role is reported here, for every gate.
const { prContext } = require('../lib/pr.cjs');
const { CONFIG, DESIGNS, designsFor, prototypeApproved, roleOf } = require('../lib/project.cjs');

module.exports = {
  name: 'prototype-gate',
  check(ctx) {
    const pr = prContext(ctx);
    if (!pr) return null;
    if (!pr.sha) return null; // verify-receipt reports a missing repo
    const { gates, error } = roleOf(pr.root);
    if (error) return `Blocked: ${error}.`;
    if (!pr.ticket || !gates.prototype) return null;
    const designs = designsFor(pr.root, pr.ticket);
    if (!designs.length) {
      return `Blocked: branch \`${pr.branch}\` is for ticket ${pr.ticket}, but no \`${DESIGNS}/*.md\` brief has `
        + `\`ticket: ${pr.ticket}\` (or \`tickets:\` listing it) in its frontmatter. Run rs-delivery:feature-design-brief and rs-delivery:feature-prototype `
        + `first. If ${pr.ticket} is not a ticket, set "ticket_prefixes" in ${CONFIG}.`;
    }
    if (!designs.some((d) => prototypeApproved(d.text))) {
      return `Blocked: ${designs.map((d) => `\`${d.file}\``).join(', ')} has no \`## Prototype Approval\` section `
        + 'with `Verdict: APPROVED`. Get the human\'s explicit prototype approval via rs-delivery:feature-prototype.';
    }
    return null;
  },
};
