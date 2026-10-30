# Spec Generator (TDD-driven feature specs)

Pipeline stage that turns an **approved PRD** (with the **BRD** for business traceability) — or a
single approved feature spec, when no PRD exists — into **per-feature spec folders** in this
project's own three-file format — one folder per feature, each holding three files:

```
specs/
├── README.md                     # project index + task rollup (all features, priority, release, deps)
├── <feature-slug>/
│   ├── requirements.md           # user stories + EARS acceptance criteria
│   ├── design.md                 # architecture, components, data models, sequence diagram, error handling, test seams
│   └── tasks.md                  # ordered, TDD tasks (RED → GREEN at an agreed seam), each traced to a requirement
└── ...
```

- **Status:** Current (v4) — no external methodology dependency, TDD-driven task format; single-feature
  input is the `/to-spec` spec; in a multi-repo project, runs once per repo and writes that repo's
  slice; every `requirements.md` carries source frontmatter (read by the `rs-guard` PR gate)
- **Run order:** … → PRD Generator v7 → **Spec Generator (this)** → TDD implementation. Single-feature
  runs (no PRD): Ticket Intake + `/grill-with-docs` + `/to-spec` → **Spec Generator, Single-Feature Mode** → TDD
  implementation.
- **Upstream:** PRD Generator v7 — Section 6 feature blocks (Given/When/Then acceptance criteria,
  edge cases, persona/JTBD, "What will be done?" work items), Section 9 (data model + integrations),
  Section 10 (Technical Complexity). BRD used only for the business-trace line. **Or**, with no PRD, a
  single approved feature spec (Ticket Brief + the `/to-spec` spec, or a Feature Design Brief).
- **Downstream:** Terminal — the spec folders are a **human-approvable handoff artifact** that a
  TDD-practicing coding agent (e.g. Claude Code via `mattpocock-skills:tdd`) or human
  implementer then executes, task-by-task, each task a RED → GREEN cycle at an agreed seam (clean-up
  happens at code review, not per task).

## Why it exists

The pipeline's docs are **proposal- and planning-facing** (client-recognizable POV, estimate, QA
strategy). Execution needs the same content **repackaged for TDD**: strict EARS requirements to verify
against, a per-feature design to build to, and a task list where every task is a RED → GREEN
cycle citing the requirement it satisfies. This stage is that repackaging — it invents no new scope;
it **transforms** approved content (a PRD, or a single feature spec) into spec folders.

## Self-contained by design

This is a **self-contained stage** (per the design decision): it reads the **PRD (+ BRD)** — or a
single feature spec, when no PRD exists — and generates all three files itself. It does **not** depend
on the Technical Design (04) or Sprint Mapper stages, and does not consume their output. Where a
Technical Design package exists, a human can paste it as optional context (Input C) to enrich
`design.md`, but it is never required.

## PRD → spec mapping (the transform)

| Spec artifact | Sourced from PRD v7 | Transform applied |
|---|---|---|
| `requirements.md` → **User Story** | §6 `Primary persona & user need (JTBD)` + POV layer | Rephrased to `As a … I want … so that …` |
| `requirements.md` → **Acceptance Criteria (EARS)** | §6 Technical Behavior `Given/When/Then` + Edge cases (≥2) | Converted to EARS (`WHEN … THE SYSTEM SHALL …`, `IF … THEN …`, `WHILE …`, `WHERE …`) |
| `design.md` → Architecture / Components / Data Models | §6 Proposed Behaviour (technical approach), §9 entities + integrations | Scoped to the single feature |
| `design.md` → Sequence / data-flow diagram | §6 approach for **Med/High** complexity features only | D2 per the repo's locked diagram standard; Low-complexity features get none |
| `design.md` → Error handling | §6 Edge cases | Mapped to handling behavior |
| `tasks.md` → tasks | §6 "What will be done?" work items + design components | Ordered, TDD tasks — each a RED → GREEN cycle at a seam from `design.md`, `_Requirements: n.m_` traced |
| `specs/README.md` → task rollup | §10 Priority + §11 Release Plan + dependencies | Per-feature index + project-level ordering |

With no PRD (single-feature mode), the same transform runs off the feature spec's equivalent fields
instead of §6/§9/§10 — see `spec-generator-v4.md`'s Input P-alt.

## Key design rules

- **Transform, don't re-plan.** Every requirement, design point, and task traces back to a PRD element
  (or the feature spec, in a no-PRD run). New scope that isn't in the source is tagged `PRD GAP` and
  raised at a checkpoint — never invented.
- **EARS is the requirements contract.** Acceptance criteria use the five EARS patterns; each is
  atomic, testable, and numbered so `tasks.md` can cite it.
- **Tasks are TDD cycles.** Every task in `tasks.md` names its RED step (failing test first, at a
  seam agreed in `design.md`) and GREEN step (minimal code), and cites the requirement number(s) it satisfies
  (`_Requirements: 2.1, 2.3_`) — no orphan tasks, no uncovered requirements, no task without a
  concrete test named first.
- **Proportional design depth.** Full architecture + sequence diagram for Med/High-complexity features;
  a lean design for Low-complexity CRUD-style features. Mirrors Technical Design (04) proportionality.
- **Phase-gated, human-in-the-loop.** Requirements → Design → Tasks, each approved before the next.
  `Quick Plan` (all phases, no gates) and `Single-Feature Mode` (one feature end-to-end — the mode
  used for no-PRD runs) are supported alternatives.

## Files
- `current/spec-generator-v4.md` — the prompt (gated phases: Intake & Feature Inventory → Requirements
  (EARS) → Design → Tasks & Project Rollup).
- `versions/spec-generator-v3.md` — superseded (no repo slice, no source frontmatter — kept for diffing).
- `versions/spec-generator-v2.md` — superseded (single-feature input was a brainstorming design doc — kept for diffing).
- `versions/spec-generator-v1.md` — superseded (pre-TDD checkbox tasks — kept for diffing).
- `improvements/` — WIP rewrites (promote to `current/` when validated).
- `examples/` — worked spec packages per project.
