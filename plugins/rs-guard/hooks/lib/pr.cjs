'use strict';
// Shared context for the PR gates: a non-draft `gh pr create`, or `gh pr ready`, is gated.
const { parsePrForReview, repoRoot, headSha, currentBranch, originSlug } = require('./git.cjs');
const { readConfig, ticketFromBranch } = require('./project.cjs');

const RUN_HERE = 'Run it from inside the repository the PR is for, with no `cd` in the same command and no `--repo`.';

// The repository a gated PR command acts on, or {why} when the gates cannot tell which one it is.
// A `cd` earlier in the command moves it (steps carry each command's directory); `--repo` is accepted
// only when it names this checkout's own origin.
function target(step, pr) {
  if (!step.cwd) {
    return { why: 'Blocked: cannot tell which repository this PR command runs in (a `cd` in the same command goes to a '
      + `path only known at run time). ${RUN_HERE}` };
  }
  const root = repoRoot(step.cwd);
  if (root && pr.repo !== null) {
    const want = String(pr.repo).replace(/^https?:\/\/[^/]+\//, '').replace(/\.git$/, '').toLowerCase();
    if (want !== originSlug(root)) {
      return { why: `Blocked: \`--repo ${pr.repo}\` is not this checkout's origin, so its receipts cannot be checked here. `
        + RUN_HERE };
    }
  }
  return { root };
}

// null = not a gated PR command. Otherwise {root, sha, branch, ticket}; root/sha are null outside a repo,
// and `why` then says why when it is not simply a missing repository.
function prContext({ steps }) {
  for (const step of steps) {
    const pr = parsePrForReview(step.argv);
    if (!pr || pr.draft) continue;
    const { root, why } = target(step, pr);
    const sha = root && headSha(root);
    if (!sha) return { root: null, sha: null, branch: null, ticket: null, why: why || null };
    const branch = currentBranch(root);
    return { root, sha, branch, ticket: ticketFromBranch(branch, readConfig(root).ticket_prefixes) };
  }
  return null;
}

const NO_REPO = 'Blocked: opening a PR for review (`gh pr create` / `gh pr ready`) must run inside a git repository with at least one commit.';

module.exports = { prContext, NO_REPO };
