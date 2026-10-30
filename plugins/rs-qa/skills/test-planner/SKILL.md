---
name: test-planner
description: Turn an approved PRD (or just one feature's detail) into a risk-based Test Strategy & Plan plus a Test Coverage Matrix, ready for a test-case writer. Trigger on "plan testing" or "test strategy".
---

# Test Planner

Turns an approved PRD into a **Test Strategy & Plan**: a risk-based, per-feature testing plan whose
depth scales with the PRD's `Technical Complexity` rating, plus a **Test Coverage Matrix** — the
scenario-level artifact the **test-case-generator** skill expands into step-by-step test cases. Gated
phases with a human checkpoint each.

## When to use

After the PRD is approved (and, ideally, after Technical Design if it exists), to decide what needs
testing, how rigorously, and in what order — before any test cases are written. Feeds the
**test-case-generator** skill. Trigger when the user asks to "plan testing for this PRD", "build a
test strategy", "what needs to be tested", or wants a QA coverage matrix before writing test cases.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — it is the full Test
   Planner v1 prompt (Phase 0 Ingest & Mode Detection → Phase 1 Test Strategy Frame → Phase 2
   Feature Test Planning → Phase 3 NFR/Integration Test Plans → Phase 4 Coverage & Handoff), each
   phase closing with a reflection block + human checkpoint, plus a running Decision Log.
2. **Detect the input mode first (Phase 0) and say so.** Full-PRD Mode plans every Section 10
   feature; **Single-Feature Mode** accepts just one feature's detail (name + a one-sentence test
   objective is enough) and scopes the whole-project sections (roles, coverage cross-check, release
   plan) down instead of blocking on a full PRD. Thin/missing acceptance criteria or edge cases are
   never a gate failure in either mode — tag `PRD GAP:` and proceed from QA judgment.
3. **Apply the risk-based depth model (Section 2 of the output).** Test depth is driven by the
   feature's `Technical Complexity` (L/M/H) — Low gets a lean floor, High gets full-pyramid coverage
   plus a scenario that validates the named `Technical Risk/Approach`. Never plan uniform depth across
   features regardless of complexity, and never skip this model just because only one feature was
   supplied.
4. **Trace everything.** Every test scenario cites the acceptance criterion, edge case, or risk it
   verifies (`AC-#` / `Edge-#` / `Risk`). Where detail is too thin to plan a scenario from, tag
   `PRD GAP:` and raise it at the checkpoint — never invent silently.
5. **Respect the altitude line.** This skill plans **what** to test and **how rigorously** — it does
   not write step-by-step test cases, concrete input values, or expected UI copy. That's the
   **test-case-generator** skill's job.
6. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to all output.

## Inputs you need from the user
- **Required:** either the **Approved PRD** (Sections 4, 6, 7, 9, 10, 10b — especially `Technical
  Complexity` and `Technical Risk/Approach`), **or just one feature's detail** (name, and ideally
  Priority/Proposed Behaviour/acceptance criteria/edge cases/complexity — missing pieces are inferred
  and tagged, not blocked on).
- **Optional:** the Technical Design Component Inventory (sharper integration/component test scoping),
  BRD/Opportunity Packet (context where the PRD is thin), constraints (compliance obligations, target
  platforms, existing test tooling, non-negotiable coverage mandates).

## Output
A full Test Strategy & Plan (Sections 0–13): strategy overview, the risk-based prioritization model,
environment/data strategy, role/access-control test approach, per-feature test plans, the NFR and
integration/data test plans, automation and regression strategy, the **Test Coverage Matrix**
(Section 10) and its PRD cross-check (Section 10b), a release/phase test plan, and a Decision Log.
Section 10 is the artifact the **test-case-generator** skill consumes.
