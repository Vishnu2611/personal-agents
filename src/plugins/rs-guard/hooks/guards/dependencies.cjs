'use strict';
// Deny non-draft `gh pr create` (or `gh pr ready`) and every `git push` while a required tool (gstack, Matt's skills,
// bun, gh, git) is missing. Everything else keeps working so the human can install them.
const { parseGit, repoRoot } = require('../lib/git.cjs');
const { prContext } = require('../lib/pr.cjs');
const { runChecks, missing, fixText } = require('../bin/rs-doctor.cjs');

module.exports = {
  name: 'dependencies',
  check(ctx) {
    const push = ctx.steps.map(({ argv, cwd }) => parseGit(argv, cwd)).find((g) => g && g.sub === 'push');
    const pr = prContext(ctx);
    if (!push && !pr) return null;
    const where = (pr && pr.root) || (push && push.cwd) || ctx.cwd;
    const failed = missing(runChecks({ projectRoot: repoRoot(where) }));
    if (!failed.length) return null;
    return 'Blocked: required tools for the Rightshift harness are missing. Ask the human to install them '
      + `(do not run installers yourself):\n${fixText(failed)}`;
  },
};
