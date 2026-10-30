---
name: ship-with-ticket
description: Last step of rs-delivery — after /ship --no-pr, QA, gstack /review and the verify receipt, open the PR (Matt Pocock's /pr body) linked back to the originating ticket, then post the PR link to the ticket. Trigger on "ship this", "open the PR", or "I'm done, wrap it up".
---

# Ship With Ticket

The final step of the pipeline: opens the pull request for finished, verified work and links it to
the ticket it started from. It does not merge, test or review anything itself — those already
happened in the order below, and the `rs-guard` hooks refuse the PR if any of them is missing or
stale for the current code.

## The order this step closes

```
implement (/implement or /implement-spec — Matt code-review runs at the end)
        │
        ▼
/ship --no-pr        (gstack, human-typed: merges the base branch, runs tests, reviews and fixes,
                      bumps VERSION / CHANGELOG only where those files already exist, commits, pushes;
                      opens no PR. If it asks to create TODOS.md and there is none, answer Skip.)
        │
        ▼
rs-delivery:qa-verify-report  →  commit the report  →  rs-receipt qa --report … --p0-failed <n>
        │
        ▼
/review              (gstack, human-typed: final pass on the exact final code — must finish clean)
        │
        ▼
rs-receipt verify -- <test command>
        │
        ▼
rs-delivery:ship-with-ticket   (this skill: open the PR, link the ticket)
```

`/ship` runs **before** QA because it changes code (base merge, fixes, version files), and QA, the
review verdict and the receipts must all describe the code that ships. If anything changes code after
QA, QA, `/review` and the receipts are redone on the new code.

## How to run

1. **Find the originating ticket.** Look for a `Ticket Briefs/<ID>.md` file from this session or
   branch. If none exists (work wasn't started via `ticket-intake`), ask for the ticket ID/URL
   directly — don't guess one from the branch name. A chore with no ticket ships without a link.
2. **Check readiness, don't redo it.** Run `rs-receipt status` (the full `node …/rs-receipt.cjs`
   command is printed at session start): it shows the verify and QA receipts for the current commit
   and gstack's `/review` verdict (`CURRENT` is needed). Also confirm the branch has an upstream
   (`/ship --no-pr` pushed it). If the branch was never pushed, or a receipt is missing for the current commit, tell
   the human which step in the order above is outstanding and stop — never run `/ship` or `/review`
   yourself; they are typed by the human. The `rs-guard` hooks are the real check; this step just
   avoids a surprise denial.
3. **Write the PR body with Matt Pocock's `pr` skill** (`mattpocock-skills:pr`): Summary, Evidence
   (before/after — link the `Execution Reports/` file as the QA evidence), Merge Danger. Add the
   ticket link: a close keyword the tracker recognizes where one exists (e.g. `Closes ABC-123` for
   Linear/Jira), otherwise the ticket's URL (e.g. an Asana task link). Read the ticketing system from
   `Ticket Briefs/<ID>.md` rather than assuming Linear. Use the base branch `/ship` merged.
4. **Confirm with the human before the PR is opened** — show the title, base branch and body. Like any
   action visible to other people, this isn't reversible by editing local files.
5. **Open the PR** with `gh pr create` (not `--draft`). If `rs-guard` denies it, relay the denial
   verbatim — it names the missing or stale step — and stop; don't work around it.
6. **After the PR is open,** post a short status comment to the ticket (via the same MCP
   `ticket-intake` used) with the PR link. If the ticketing MCP isn't connected in this session, print
   the comment text and ask the human to add it instead of failing silently.

## Inputs you need from the user

- **Required:** explicit go-ahead before the PR is opened.
- **Optional:** the ticket ID/URL, if no `Ticket Briefs/` file exists for this branch; a different
  base branch than the one `/ship` used.

## Output

A pull request with Matt's `pr` body and the ticket linked in its title/body, and a status comment on
the ticket linking back to the PR.
