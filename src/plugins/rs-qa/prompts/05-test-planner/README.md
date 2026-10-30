# Test Planner

New pipeline stage that consumes the **approved PRD** (and, optionally, the Technical Design
Component Inventory) and produces a **Test Strategy & Plan** — a risk-based, per-feature testing plan
plus a **Test Coverage Matrix**, the flat list of test scenarios the **Test Case Generator** stage
expands into detailed, step-by-step test cases.

- **Status:** Draft / new (not sourced from Notion — author there once validated, same as
  Technical Design)
- **Run order:** Opportunity Packet → BRD v2 → PRD v5 → (Technical Design v1, optional) →
  **Test Planner (this)** → Test Case Generator v1
- **Upstream:** PRD Generator v5 — Sections 4, 6, 7, 9, 10, 10b (esp. `Technical Complexity` L/M/H and
  `Technical Risk/Approach`) — **or just one feature's detail** (see Input Modes below)
- **Downstream:** Test Case Generator v1 (`06-test-case-generator/`) — expands each Test Coverage
  Matrix row into preconditions, numbered steps, test data, and expected results

## Input modes: full PRD or a single feature

The prompt runs in **Full-PRD Mode** (default — plans every Section 10 feature) or **Single-Feature
Mode**, where a feature name plus a one-sentence test objective is enough to proceed. Thin or missing
acceptance criteria/edge cases are never a gate failure in either mode — they're tagged `PRD GAP:` and
drafted from QA judgment. Whole-project sections that don't apply to one feature (roles, the coverage
cross-check, the release plan) scope down instead of blocking.

## Why it exists

A PRD says what to build and how confident the estimator should be. It doesn't say what to verify, how
hard, or in what order. Two features with the same work-item count can need very different test rigor
— a settings screen needs a happy path and a permissions check; a matching engine needs edge-case
coverage, integration contract tests, and a dedicated test for the exact risk the PRD flagged. This
stage makes that testing effort **explicit and risk-proportional** instead of uniform.

## The key mechanic: risk-based depth

Test depth is driven by the PRD's `Technical Complexity` rating, not by feature size or habit:

| Complexity | Scenario floor | Test levels | Automation default |
| --- | --- | --- | --- |
| Low | 2 (happy path + negative/permission check) | System + regression | Automate now |
| Med | 4 (happy path, edge case, negative path, integration/data-boundary check) | System + Integration + regression | Mostly automate now |
| High | 1 per acceptance criterion + 1 per edge case + 1 named-risk validation + 1 exploratory charter | Unit + Integration + System + E2E + targeted NFR + Exploratory | Mixed, risk-validation scenario starts manual |

## Altitude rule

This stage plans **what** to test and **how rigorously** — it does not write step-by-step test cases,
exact input values, or expected UI copy. That's the Test Case Generator's job, same way the PRD
doesn't leak into architecture.

## Files

- `current/test-planner-v1.md` — the prompt (gated phases: Ingest & Coverage Skeleton → Test Strategy
  Frame → Feature Test Planning → NFR/Integration Test Plans → Coverage & Handoff).
- `improvements/` — WIP rewrites (create when the first iteration is drafted).

## Known issues / improvement ideas

_(fill in as we validate against a real PRD — e.g. whether the depth-tier floors need tuning per
project type, how to handle PRDs with no Technical Complexity ratings at all.)_
