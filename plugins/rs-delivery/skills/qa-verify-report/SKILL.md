---
name: qa-verify-report
description: Drive a running app against acceptance criteria (spec, ticket, or a Test Case Package) and write an Execution Report. Browser mode uses Playwright MCP; API mode (backend repos) calls the endpoints against the API contract. Trigger on "QA this" or "verify against staging".
---

# QA Verify & Report

Turns acceptance criteria into **actually-observed verdicts**, live, via Playwright MCP. Same
mechanics as the `rs-qa` plugin's `test-executor` skill, but with a lighter input: it
runs directly off a spec's or ticket's acceptance criteria when no formal Test Case Package exists
(the common case for ticket-driven work), or off a real Test Case Package when one does. Two gated
phases, one human checkpoint each. Requires live tool access — not a copy-paste chat prompt.

**Two modes, chosen by the repo's role** (`.rs-harness.json` `"role"`):

| Role | Mode | Drives the app through |
|---|---|---|
| `fe`, or no role (single repo) | **Browser** | Playwright MCP, as a user would |
| `be` | **API** | HTTP requests to the endpoints in the API contract file (`docs/agents/project-context.md` names it) |
| `infra` | none | No QA gate: the plan output goes in the PR instead. Say so and stop. |

A human may switch a single-repo project to API mode for an API-only feature; state the mode at the
Phase 0 checkpoint either way.

**Altitude rule:** does not decide what to test or rewrite an acceptance criterion it thinks looks
wrong — tag `DECISION NEEDED:` and raise it at the checkpoint. Does not produce a checked-in
automation suite; the output is an execution report, not framework code.

## Prerequisites

- **Browser mode:** Playwright MCP connected (`claude mcp add --transport http playwright ...` or your MCP client's
  equivalent) — if unavailable, say so; do not describe hypothetical execution.
- **API mode:** `curl` (or the project's HTTP client) on PATH, the API contract file, and credentials
  for the target environment supplied by the human (environment variable names, never pasted into
  the report).
- A confirmed, reachable, **non-production** target environment.

## How to run

### Phase 0 — Scope & data (no execution yet)

1. **Pick the source of scenarios**, in this priority order: a formal Test Case Package if one exists
   (reuse it as-is — same shape `test-executor` consumes); otherwise the spec's/ticket's acceptance
   criteria (from `rs-delivery:spec-generator`'s `requirements.md` EARS list, or the ticket's checklist from
   `Ticket Briefs/<ID>.md`) treated as ad-hoc scenarios, one per criterion. State which source is in
   use.
2. **Ask for the target environment** if not already given — base URL, environment name, any
   credential/seed notes.
3. **Resolve test data up front**, not mid-run: for each scenario, note what data it needs; generate
   safely-synthesizable values (tag `AUTO-GENERATED:`), and collect anything else into one consolidated
   `TEST DATA NEEDED:` ask.
4. **Environment smoke check** — browser mode: a navigate + snapshot confirms the base URL is
   reachable and is not production. API mode: one safe read (a health or list endpoint from the
   contract) confirms the same.
   In API mode, also map each scenario to the contract operation(s) it exercises (method + path);
   a criterion with no matching operation is `DECISION NEEDED:` (the contract may lack it), not an
   improvised call.

**→ Human checkpoint.** *"Confirm: (1) this is the right scenario list and source; (2) the target
environment is correct and safe to execute against; (3) every `TEST DATA NEEDED:` item above — provide
a value or approve the auto-generated ones. I will not touch the application until you approve."*

### Phase 1 — Live execution & report

In **API mode**, step 5 becomes: send each scenario's request(s) exactly as the contract defines them
(method, path, parameters, body), then compare the actual status code, required response fields and
their types, and any state change (read it back with a follow-up GET) against the criterion and the
contract. A response that passes the criterion but breaks the contract (missing required field, wrong
type, undocumented status) is a **Fail**. Evidence is the request line and the response status plus a
trimmed body; redact `Authorization`, cookies, tokens and personal data before writing anything down.
Requests that change data run only against the confirmed non-production target, and anything that
looks irreversible (bulk deletes, payments, emails to real addresses) is a hard stop as below.

5. **Execute literally.** Locate elements via `browser_snapshot`/`browser_find` — never a blind
   selector. Map actions to `browser_navigate`, `browser_click`, `browser_type`/`browser_fill_form`,
   `browser_select_option`, `browser_file_upload`, `browser_wait_for`; use
   `browser_console_messages`/`browser_network_requests` when the UI alone can't confirm a result.
   Compare the actual result against the criterion's exact expected text — not a general impression
   that it "worked." An ambiguous mapping is `STEP GAP:` (best-reasonable interpretation, flagged),
   never silent improvisation.
6. **Verdicts:** **Pass** (matches literally) · **Fail** (contradicts — produces a Defect Log entry) ·
   **Blocked** (couldn't be run at all — environment/precondition issue, distinct from Fail) ·
   **Not Run** (explicitly out of scope by human ruling).
7. **Evidence:** a screenshot (or console/network excerpt) on **every Fail and Blocked**, no
   exceptions; on every **P0/critical** scenario regardless of verdict.
8. **Hard-stop conditions** — stop and ask, don't push through: the target looks like production, a
   step looks irreversible, or 2–3 consecutive tool failures hit the same step.
9. **Write the report to a file**, don't just print it: `Execution Reports/<Project
   slug>-<Selection slug>-<YYYYMMDD-HHMMSS>.md` at the target repo's root (create the folder if
   needed) — one new file per run, never overwritten or appended. Contents: mode (browser or API; in
   API mode the contract file path and its commit), scenario list + source, environment, execution log (per-scenario actual results + evidence), a defect log (one entry per
   Fail: repro steps, expected vs. actual, evidence), a summary (pass/fail/blocked counts, P0 pass rate
   called out separately), and open tags (`STEP GAP:`, `DECISION NEEDED:`, etc.).

**→ Human checkpoint.** *"Does every scenario have a verdict? Does every Fail have a defect entry?
Saved to `Execution Reports/<filename>.md` — open it there. Once approved, `ship-with-ticket` can read
this report as its QA sign-off."*

10. **Record the QA receipt** once the human approves the report. Commit the report file, then run
    `rs-receipt qa --report "Execution Reports/<filename>.md" --p0-failed <n>`, where `<n>` is the
    number of P0/critical scenarios whose verdict is **Fail** or **Blocked**. The full `node …/rs-receipt.cjs`
    command is printed at session start and in any PR-hook denial. The receipt is bound to the current
    commit: on a ticket branch the rs-guard PR hook refuses a non-draft `gh pr create` unless it exists
    with `p0_failed: 0`, and any later commit means QA must be re-run. Never pass a smaller `<n>` than the
    report shows.
11. **Next: gstack `/review`, then the verify receipt, then `ship-with-ticket`.** Tell the human the
    remaining order before a PR: gstack `/review` (it must finish clean on the current code, so it
    runs after this report is committed), then `rs-receipt verify -- <tests>`, then
    `rs-delivery:ship-with-ticket` to open the PR. If `/review` changes code, QA is re-run on the fixed
    code. QA itself runs after gstack `/ship --no-pr`, which merges the base branch and may change code
    — if `/ship --no-pr` hasn't run on this branch yet, say so before executing.

## Inputs you need from the user

- **Required:** the target environment (base URL, env name, credential/seed notes). In API mode, the
  names of the environment variables holding credentials.
- **Optional:** an explicit scenario selection if only part of the spec/ticket should be verified
  (defaults to all acceptance criteria); a Test Case Package if a formal one exists; test data values
  supplied up front.

## Output

`Execution Reports/<slug>-<timestamp>.md` — verdicts, evidence, defect log, summary with a
P0-pass-rate call-out. This is the file `ship-with-ticket`'s QA gate checks for before it will open a
PR.
