# Test Case Generator

New pipeline stage that consumes the **Test Planner's Test Coverage Matrix** and expands every test
scenario into **concrete, executable test cases** — preconditions, numbered steps, literal test data,
and expected results — plus a **Gherkin/BDD scenario** for every scenario the Test Planner tagged
automatable. This is the last doc-gen stage before actual QA execution or test automation.

- **Status:** Draft / new (not sourced from Notion — author there once validated, same as Technical
  Design and Test Planner)
- **Run order:** … → PRD v5 → (Technical Design v1, optional) → Test Planner v1 →
  **Test Case Generator (this)** → QA execution / test management tool
- **Upstream:** Test Planner v1 — Section 10 (Test Coverage Matrix) + Section 10b (cross-check),
  sharpened by Sections 2/3/6/7/8 when included
- **Downstream:** Manual QA execution and/or an automation framework (the Gherkin scenarios feed
  step-definition implementation — not written here)

## Why it exists

The Test Planner decides *what* to test and *how rigorously*. Nobody can run a Test Coverage Matrix
row directly — "verify duplicate submissions are rejected" isn't a test until someone states the exact
starting state, the exact data, the numbered actions, and the exact expected result. This stage
realizes each scenario into something a QA engineer who has never seen the feature can execute cold,
and — for anything automatable — a Gherkin scenario an automation engineer can wire up without
re-deriving intent.

## The key mechanic: expansion, not re-planning

- **Same steps, different data → one parameterized test case** (a Test Data table, multiple rows).
- **Different steps/preconditions/expected results → separate test cases**, same Scenario ID.
- **Case count and rigor are inherited from the Test Planner's priority/complexity**, never re-decided
  here — if a scenario looks wrong or under-scoped, that's a `DECISION NEEDED:` tag back to the human,
  not a silent fix.
- **Automation candidacy is inherited too.** Automate-now scenarios get a Gherkin scenario in addition
  to the manual case; Automate-later states its blocker; Manual-only gets nothing extra invented.

## Altitude rule

This stage does not decide what to test, how rigorously, or at what priority (that's the Test
Planner's job), and it does not write automation framework glue code (step definitions, page objects)
— only the Gherkin scenario text. Same discipline as every other boundary in this pipeline (BRD/PRD,
PRD/architecture, Test Planner/Test Case Generator).

## Files

- `current/test-case-generator-v1.md` — the prompt (gated phases: Ingest & Traceability Skeleton →
  Test Data & Conventions Frame → Test Case Authoring → Automation Artifacts → Coverage & Handoff).
- `improvements/` — WIP rewrites (create when the first iteration is drafted).

## Known issues / improvement ideas

_(fill in as we validate against a real Test Coverage Matrix — e.g. whether the parameterize-vs-split
call needs a firmer rule, how much test-management-tool-specific formatting Section 8 should own.)_
