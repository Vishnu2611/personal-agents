---
name: test-case-generator
description: Expand a Test Planner Coverage Matrix (or a few scenarios) into executable test cases plus Gherkin for automatable ones. Trigger on "write test cases" or "generate test cases".
---

# Test Case Generator

Turns the Test Planner's Test Coverage Matrix into **executable test cases** — preconditions,
numbered steps, literal test data, and expected results — plus a **Gherkin/BDD scenario** for every
scenario tagged automatable. The last doc-gen stage before QA execution or automation. Gated phases
with a human checkpoint each.

## When to use

After a Test Planner Coverage Matrix exists (or when the user hands you one or a few test scenarios
directly), to turn "what to test and how rigorously" into steps someone can actually run. Trigger when
the user asks to "write test cases", "generate test cases from this test plan", "turn this scenario
into steps", or wants a package ready to import into a test management tool.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — it is the full Test Case
   Generator v1 prompt (Phase 0 Ingest & Traceability Skeleton → Phase 1 Test Data & Conventions Frame
   → Phase 2 Test Case Authoring → Phase 3 Automation Artifacts → Phase 4 Coverage & Handoff), each
   phase closing with a reflection block + human checkpoint, plus a running Decision Log.
2. **Detect the input mode first (Phase 0) and say so.** Full Coverage Matrix Mode expands every
   Section 10 scenario; **Single-Scenario Mode** accepts just one or a few scenarios directly (a
   description + testable objective is enough) and scopes the traceability/coverage sections down to
   just what was supplied — never blocks on a full Test Planner output.
3. **Apply the expansion model.** Same steps + different data → one parameterized test case with a
   data table; different steps/preconditions/expected results → separate test cases, same Scenario
   ID. Case count and rigor are **inherited** from the scenario's priority/complexity — never
   re-decided here. If a scenario looks wrong or under-scoped, tag `DECISION NEEDED:` rather than
   silently fixing it.
4. **Automation candidacy is inherited, not re-decided.** Automate-now scenarios get a Gherkin
   scenario in Section 4 alongside the manual case; Automate-later states its blocker; Manual-only
   gets nothing extra invented.
5. **Respect the altitude line.** This skill does not re-plan scope, priority, or test depth, and it
   does not write automation framework glue code (step definitions, page objects) — only Gherkin
   scenario text.
6. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to all output.

## Inputs you need from the user
- **Required:** either the Test Planner's **Section 10 Test Coverage Matrix** (+ Section 10b), or
  **just one/a few scenarios** directly (description + testable objective is enough — missing fields
  are inferred and tagged, not blocked on).
- **Optional:** additional test data/environment specifics not already in the Test Planner's Section
  3, a test management tool's field/column schema (TestRail/Xray/Zephyr/etc.), an automation
  framework/language preference (Playwright/Cypress/Selenium/Postman) to phrase Gherkin steps in.

## Output
A test case package (Sections 0–8): traceability overview, test data conventions, concrete test cases
per scenario (preconditions, step/data/expected-result tables, automation status), Gherkin artifacts
for automatable scenarios, a traceability matrix with execution-status placeholders, a coverage
cross-check against the input scenarios, and a Decision Log. Ready for manual QA execution or import
into a test management tool.
