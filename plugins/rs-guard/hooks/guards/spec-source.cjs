'use strict';
// Deny a non-draft `gh pr create` (or `gh pr ready`) on a ticket branch of a multi-repo project (a
// .rs-harness.json role) unless a `specs/*/requirements.md` lists the ticket in its frontmatter
// `tickets:` and cites a real `source:` URL (spec-generator v4). Proves the code was specified from
// the approved PRD or /to-spec spec, not from memory. Single-repo projects and chores are not gated.
const { prContext } = require('../lib/pr.cjs');
const { SPECS, roleOf, specsFor } = require('../lib/project.cjs');

const realUrl = (s) => typeof s === 'string' && /^https?:\/\/[^\s<>]+$/.test(s);

module.exports = {
  name: 'spec-source',
  check(ctx) {
    const pr = prContext(ctx);
    if (!pr || !pr.sha || !pr.ticket) return null;
    const { role } = roleOf(pr.root);
    if (!role) return null; // single repo, or an unknown role (reported by prototype-gate)
    const specs = specsFor(pr.root, pr.ticket);
    if (!specs.length) {
      return `Blocked: no \`${SPECS}/*/requirements.md\` lists ${pr.ticket} in its frontmatter \`tickets:\`. Run `
        + 'rs-delivery:spec-generator for this repo\'s slice, or, if this ticket splits an existing spec\'s work, add '
        + `${pr.ticket} to that spec's \`tickets:\` list and commit it.`;
    }
    if (!specs.some((s) => realUrl(s.source))) {
      return `Blocked: ${specs.map((s) => `\`${s.file}\``).join(', ')} lists ${pr.ticket} but has no \`source:\` URL. `
        + 'Record the approved PRD page or /to-spec issue the spec was written from (spec-generator v4 frontmatter).';
    }
    return null;
  },
};
