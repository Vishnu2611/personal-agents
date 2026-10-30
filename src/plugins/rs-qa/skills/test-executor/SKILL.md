---
name: test-executor
description: Execute selected test cases from a Test Case Generator package against a running application via Playwright MCP, resolving cross-case dependencies and recording real Pass/Fail/Blocked verdicts. Trigger on "run these test cases", "execute TC-...", or "QA this build".
---

# Test Executor

Turns the Test Case Generator's **test case package** into **actually-observed results**: pick one
test case, a scenario's worth, a whole epic, a priority tier, or the whole package, and this skill
drives a real running application through Playwright MCP, checks each step's actual result against
its literal expected result, and produces an execution log, a defect log, and an updated traceability
matrix. Gated phases with a human checkpoint each. Unlike the upstream doc-gen skills, this one
requires live browser tool access — it is not a copy-paste chat prompt.

## When to use

After a Test Case Package exists (Test Case Generator's Section 3 test cases + Section 5 traceability
matrix), when you're ready to actually run them against a local, staging, or other non-production
build of the application. Trigger when the user asks to "run test case TC-...", "execute these test
cases", "QA this build", "re-run the failed cases", or hands you a test case ID / group of IDs to
execute.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — it is the full Test
   Executor v1 prompt (Phase 0 Scope, Environment, Order & Test Data Resolution → Phase 1 Live
   Execution → Phase 2 Traceability, Defects & Report), each phase closing with a reflection block +
   human checkpoint, plus a running Decision Log.
2. **Ask for the selection explicitly if it isn't already given, then resolve it (Phase 0) and say
   so.** Never assume `all` or infer scope — ask whether the human wants an Epic or list of Epics, a
   Test Case ID or set of IDs, a Scenario ID, a Feature code, a Priority tier, `all`, or (Re-run Mode)
   `failed` / `blocked` / `not-run`. Selectors combine as a union unless the user says "only."
3. **Resolve run order before touching the browser.** Preconditions are prose, not structured links —
   scan every selected case's Preconditions/Test data for entities another case in the package
   creates, auto-include unselected prerequisite cases (tagging `AUTO-INCLUDED:`), and fall back to
   the package's own Section 3/5 order where no dependency is inferable. Flag anything unresolvable
   as `PRECONDITION GAP:` rather than guessing.
4. **Resolve every case's test data before touching the browser.** For the *entire* resolved case
   list (e.g., every case under a selected Epic, not just the ones named explicitly), check each
   Preconditions/Test data item: already created by another case in this run (in-run), safely
   synthesizable per the package's Section 2 conventions (tag `AUTO-GENERATED:`), or nothing in-run
   creates it and it isn't safe to invent (tag `TEST DATA NEEDED:`). Collect every `TEST DATA NEEDED:`
   item into one consolidated ask at the Phase 0 checkpoint — never discover a missing value mid-case.
5. **Execute literally, never invent.** Translate each step's Action into Playwright MCP tool calls
   (locate elements via `browser_snapshot`/`browser_find`, never a blind selector guess), and compare
   the actual result against the case's exact Expected Result text — not a general impression that
   things "worked." An ambiguous step is `STEP GAP:`, not silent improvisation. Capture evidence
   (screenshot/console/network) on every Fail and Blocked, and on every P0 case regardless of verdict.
6. **Never take a destructive or irreversible action beyond what a case's own steps and the source
   package's Test data conventions authorize.** Stop and ask if the target looks like production, a
   step looks irreversible, or the same step fails repeatedly — don't push through or route around it.
7. **Respect the altitude line.** This skill does not re-plan scope, priority, steps, or expected
   results — disagreements are tagged `DECISION NEEDED:` and raised at the checkpoint. It also does
   not write a checked-in automation suite (step definitions, page objects, CI config); its output is
   an execution report, not framework code.
8. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to all output.
9. **Save the report to a file, don't just print it.** At the Phase 2 final checkpoint, write the
   complete Execution Report to an `Execution Reports/` folder at the target repo's root (create it
   if needed) — one new file per run, named `<Project slug>-<Selection slug>-<YYYYMMDD-HHMMSS>.md`,
   never overwritten or appended to by a later run. This is what makes the report reviewable (instead
   of scrolled through terminal output) and consumable by a downstream agent (bug-tracker sync,
   auto-fix, re-run planner).

## Inputs you need from the user

- **Required:** the **Test Case Package** (at least Section 3 Test Cases + Section 5 Traceability
  Matrix; Section 2 Test data conventions and Section 4 Gherkin sharpen execution where present), a
  **selection** (Test Case ID(s)/Scenario ID(s)/Feature/Epic/Priority/`all`/re-run keyword) — ask for
  this explicitly if the user hasn't already given it — and the **target environment** (base URL,
  environment name, any credential/seed notes not already in Section 2).
- **Optional:** an explicit run-order override if the human wants a sequence different from the
  inferred dependency order, a bug-tracker field/column mapping (Linear, Jira, GitHub Issues) for the
  Defect Log's handoff notes, and any test data values the human wants to supply up front — anything
  not supplied is resolved in Phase 0 (auto-generated where safe, otherwise asked for as
  `TEST DATA NEEDED:`).

## Output

An Execution Report (Sections 0–7): run metadata, scope and order resolution, a full per-case
execution log (steps, actual results, evidence, verdicts), a defect log for every Fail, an updated
traceability matrix (real Pass/Fail/Blocked/Not Run verdicts in place of `Not Run` placeholders), an
execution summary with a P0 pass-rate call-out, consolidated risks/open questions, and a Decision Log.
Saved as a single markdown file under `Execution Reports/` in the target repo (one file per run — see
"How to run" step 9) rather than left in chat, so it's easy to review and so a later agent (bug
tracking, auto-fix, re-run planning) can read it directly. Ready for a bug-tracker handoff and/or a
release go/no-go call, and for a later Re-run Mode pass once fixes land.
