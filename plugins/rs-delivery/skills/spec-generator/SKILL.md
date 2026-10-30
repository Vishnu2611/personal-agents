---
name: spec-generator
description: Turn an approved PRD (with the BRD for business traceability) — or, for a single feature with no PRD, a Ticket Brief + the /to-spec spec / Feature Design Brief — into per-feature TDD-driven spec folders: requirements.md (EARS), design.md (incl. agreed test seams), tasks.md (RED → GREEN tasks). Trigger on "generate specs", "feature specs", or "spec this feature".
---

# Spec Generator

Turns an approved PRD — or a single approved feature spec, when no PRD exists — into **per-feature
spec folders**: one folder per feature, each holding `requirements.md` (user stories + EARS acceptance
criteria), `design.md` (architecture, components, data models, error handling), and `tasks.md`
(ordered, TDD tasks — each a RED → GREEN cycle at an agreed seam, traced to a requirement), plus a project-level
`specs/README.md` index and task rollup. Gated phases with a human checkpoint each.

## When to use

After the PRD is approved, to repackage its feature blocks for **TDD execution** by a coding agent
(e.g. Claude Code via `mattpocock-skills:tdd`) or a human implementer. Also the entry
point for `rs-delivery`'s single-feature branch, run in `Single-Feature Mode` off a Ticket Brief +
the `/to-spec` spec on the tracker (or a Feature Design Brief) instead of a PRD — see Input P-alt in the prompt. This
is the terminal pipeline stage — it invents no new scope; it **transforms** approved content into spec
folders. Trigger when the user asks to "generate specs from this PRD", "create feature specs", "spec
this feature" (single-feature, no PRD), or wants an implementation-ready TDD handoff package.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — it is the full Spec
   Generator v4 prompt (Phase 0 Intake & Feature Inventory → Phase 1 Requirements (EARS) → Phase 2
   Design → Phase 3 Tasks & Project Rollup), each phase closing with a reflection block + human
   checkpoint, plus a running Decision Log.
2. **Transform, don't re-plan.** Every requirement, design point, and task traces back to a PRD
   element (§6 feature blocks, §9 data model/integrations, §10 complexity) — or, in a single-feature/
   no-PRD run, to the supplied feature spec. New scope that isn't in the source is tagged `PRD GAP:`
   and raised at the checkpoint — never invented silently.
3. **EARS is the requirements contract.** Acceptance criteria use the five EARS patterns
   (`WHEN … THE SYSTEM SHALL …`, `IF … THEN …`, `WHILE …`, `WHERE …`); each is atomic, testable,
   and numbered so `tasks.md` can cite it.
4. **Tasks are TDD cycles, not checkboxes.** Every task in `tasks.md` is one vertical slice: its RED
   step (the failing test to write first, at a seam listed in `design.md`'s `## Test seams`) and its
   GREEN step (minimal code to pass). No REFACTOR step — clean-up belongs to code review. Each cites the
   requirement number(s) it satisfies (`_Requirements: 2.1, 2.3_`) — no orphan tasks, no uncovered
   requirements, no task that skips naming a concrete test.
   Seams come from the `/to-spec` spec's Testing Decisions (P-alt runs) or are proposed in
   `design.md` and confirmed at the Design checkpoint (PRD runs) — few, ideally one, at the highest
   public boundary. No test at an unconfirmed seam.
5. **Apply proportional design depth.** Full architecture + sequence diagram (D2, per the repo's
   locked diagram standard) for Med/High `Technical Complexity` features; a lean design and no
   diagram for Low-complexity CRUD-style features.
6. **Respect the run modes.** Default is phase-gated. `Quick Plan` runs all phases without gates;
   `Single-Feature Mode` takes one feature end-to-end — the mode used for Input P-alt (no-PRD) runs.
7. **Multi-repo projects: write this repo's slice.** When `.rs-harness.json` names a `role`
   (`fe`, `be`, `infra`), supply Input S from `docs/agents/project-context.md` (role, sibling repos,
   API contract path) and the parent and child ticket IDs. Read the source in full (the PRD feature
   block from Notion, or the parent ticket's `/to-spec` spec), but specify only this repo's part;
   sibling repos' work is listed, not specified, and API changes go through the contract file.
8. **Record the source.** Every `requirements.md` opens with frontmatter naming the feature, the
   tickets it covers, the source URL and the source's last-edited time as read through the MCP. In
   multi-repo projects the `rs-guard` PR gate requires a spec that lists the branch's ticket and
   cites a source.
9. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to all output.

## Inputs you need from the user
- **Required (one of):** the **Approved PRD** (v7 format — §6 feature blocks with Given/When/Then
  acceptance criteria, edge cases, persona/JTBD, "What will be done?" work items; §9 data model +
  integrations; §10 Technical Complexity) — **or**, for a single feature with no PRD, a **Ticket
  Brief + the approved `/to-spec` spec** from the tracker (or a **Feature Design Brief**) covering that one
  feature's acceptance criteria and edge cases.
- **Optional:** the **Approved BRD** (business-trace line only, PRD runs only), and a Technical Design
  package as extra context to enrich `design.md` — never required; this stage is self-contained and
  does not depend on the Technical Design or Sprint Mapper stages.

## Output
A complete spec package: `specs/README.md` (project index + task rollup — all features, priority,
release, dependencies, suggested build order) and one `<feature-slug>/` folder per in-scope feature
containing `requirements.md`, `design.md`, and `tasks.md`. The package is a human-approvable handoff
artifact that a TDD-practicing coding agent or human implementer then executes, task-by-task, each task
a RED → GREEN cycle at an agreed seam.
