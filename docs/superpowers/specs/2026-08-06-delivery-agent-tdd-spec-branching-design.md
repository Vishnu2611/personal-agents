# Design: Kiro-independent, TDD-driven specs + branched delivery-agent

Date: 2026-08-06
Status: Approved (design phase) — pending spec self-review + user sign-off

## Context

Two plugins in this marketplace, today:

- **`rightshift-doc-gen`** (source `./`, skills auto-discovered from `./skills`) — the doc-gen
  chain: `brd-generator` → `prd-generator` → `technical-design-generator` → `estimation-generator`,
  a parallel QA track (`test-planner` → `test-case-generator` → `test-executor`), and
  `spec-generator` (turns an approved PRD into per-feature `requirements.md`/`design.md`/`tasks.md`
  folders). Canonical prompt sources live under `src/NN-*/current/*.md`; `make sync` copies them
  into `skills/*/resources/prompt.md`.
- **`delivery-agent`** (source `./delivery-agent`, dev source `src/delivery-agent`) — ticket-to-PR
  pipeline. Depends on `superpowers` only. One linear track today: Repo KB + Design Guidelines
  (once per repo) → Ticket Intake → `superpowers:brainstorming` → `superpowers:subagent-driven-development`
  (plan) → Feature Design Brief → Feature Prototype (hard gate) → Implement
  (`subagent-driven-development` + `test-driven-development`) → QA Verify → Ship.

`spec-generator`'s canonical prompt
(`src/08-spec-generator/current/spec-generator-v1.md`) explicitly **adopts "Kiro feature-spec
methodology"**, cites `kiro.dev` in its frontmatter, and names the downstream executor as
"a coding agent (Claude Code / Kiro / Cursor)". `delivery-agent` has no branching — every ticket,
regardless of size, walks the same single track, and never invokes `spec-generator` at all (its
own `qa-verify-report` skill already references `08-spec-generator`'s `requirements.md` EARS list
as a fallback scenario source — a latent, never-wired dependency).

## Goals

1. Remove the Kiro dependency from the spec format — own the three-file
   (`requirements.md`/`design.md`/`tasks.md`) pattern as this repo's, not an adopted external one.
2. Make `tasks.md` a **TDD-driven** spec: each task is a RED → GREEN → REFACTOR cycle, not a
   generic checkbox, and cites `superpowers:test-driven-development` as the execution discipline.
3. Give `delivery-agent` two explicit branches:
   - **New application** — full BRD(optional)/PRD/Technical-Design/Spec-Generator process, reviewed,
     then per-feature design + prototype + implementation.
   - **Single feature** — lighter: a feature spec (via `spec-generator` Single-Feature Mode, no PRD
     required) + a design/prototype artifact, then implementation.
4. `delivery-agent` becomes a true orchestrator: it composes `superpowers` (brainstorm/plan/TDD/
   finish-branch) and `rightshift-doc-gen` (BRD/PRD/Technical-Design/spec-generator) rather than
   reimplementing either.

## Non-goals

- No change to `brd-generator`, `prd-generator`, `technical-design-generator`, `estimation-generator`,
  `test-planner`, `test-case-generator`. Only `spec-generator` changes.
- No merge of the two plugins, no marketplace restructuring.
- `docs/PIPELINE.md` is not touched — it has no `spec-generator` section today (pre-existing gap,
  unrelated to this change).
- Estimation is not part of either `delivery-agent` branch — that's a client-proposal concern, out
  of scope for a ticket/app-to-PR pipeline.

## Decision: dependency wiring

`delivery-agent` adds `rightshift-doc-gen` as a **second plugin dependency**, next to `superpowers`,
and invokes its skills by qualified name (`rightshift-doc-gen:brd-generator`, `:prd-generator`,
`:technical-design-generator`, `:spec-generator`). Rejected alternative: porting copies of those
skills into `delivery-agent` for self-containment — this recreates exactly the drift risk
`delivery-agent`'s own README already argues against for `superpowers` ("Duplicating that here would
drift from upstream improvements and give the user two slightly different versions of the same
conversation").

---

## Part 1 — Spec Generator v2 (Kiro-independent, TDD-driven)

Versioning mirrors the PRD v6→v7 promotion (`b0a33f2`): new prompt lands in `current/`, the old one
moves to `versions/`, `README.md` and the Makefile pointer update alongside it.

### File moves

- `src/08-spec-generator/current/spec-generator-v1.md` → `src/08-spec-generator/versions/spec-generator-v1.md`
- New `src/08-spec-generator/current/spec-generator-v2.md`
- `Makefile`: `SPEC_SRC := $(SRC_DIR)/08-spec-generator/current/spec-generator-v2.md`

### Content changes (`spec-generator-v2.md`)

- **Frontmatter.** `name` → `"Spec Generator v2 (from Approved PRD or a single feature spec) —
  TDD-driven per-feature requirements / design / tasks"`. `adopts` line rewritten: drop the Kiro
  citation, describe the pattern as this prompt's own — three-file spec folders, EARS acceptance
  criteria, requirement-traced TDD tasks, phase-gated review. Add a `supersedes: v1` field and a
  short "v2 changes vs v1" callout block at the top (same convention PRD v7 uses), listing: Kiro
  dependency removed, tasks are now TDD cycles, new no-PRD input path for single-feature mode.
- **Body prose.** Every remaining "Kiro"/"kiro.dev" reference removed. "A coding agent (Claude Code /
  Kiro / Cursor)" → "a TDD-practicing coding agent (e.g. Claude Code via
  `superpowers:test-driven-development`) or a human implementer". The "Analyze Requirements pass
  (Kiro's consistency check)" phrase in Phase 1 → "an Analyze Requirements pass" (same check, no
  attribution).
- **Inputs section — new alt path.** Today Input P *requires* an Approved PRD, and the Input
  Validation Gate hard-stops if it isn't marked approved. Add **Input P-alt**: a single approved
  feature spec — a Ticket Brief plus a `superpowers:brainstorming` design doc, or a
  `delivery-agent:feature-design-brief` — used when no PRD exists at all (the single-feature,
  no-PRD case). The Input Validation Gate's approval check applies to whichever of P / P-alt is
  supplied; Section 6-style feature content is read from P-alt's equivalent fields (persona/JTBD,
  Given/When/Then criteria or EARS-ready acceptance criteria, edge cases, work items) instead of PRD
  §6/§9/§10.
- **`tasks.md` template — TDD cycles, not generic checkboxes.**

  ```markdown
  - [ ] 1. <behavior to implement — action first>
    - RED: <test file path> — "<failing test name / behavior it proves>"
    - GREEN: <minimal code to pass — file/module>
    - REFACTOR: <cleanup note, or "none needed">
    - _Requirements: 1.1, 1.2_
  - [ ] 2. <next behavior, build order: data → logic → interface → integration>
    - RED: ...
    - GREEN: ...
    - REFACTOR: ...
    - _Requirements: 2.1_
  ```

  Each task is still one discrete, independently-completable unit citing `_Requirements: n.m_` —
  the RED/GREEN/REFACTOR sub-bullets replace the old free-form sub-step bullet, not the requirement
  citation.
- **Reflection criterion #4 ("Task executability")** updated: a task is only executable if it also
  names the RED step's test first — "no vague tasks" now explicitly includes "no task skipping the
  failing-test-first step."
- **`design.md`'s Testing Strategy section** — clarify: unit-level coverage is produced task-by-task
  via each task's RED step during implementation; this section stays focused on
  integration/e2e/broader strategy ownership (Test Planner, stage 05) — no duplication between the
  two.
- **Single-Feature Mode** (existing alternate run mode) gets an explicit note: this is
  `delivery-agent`'s single-feature branch entry point — seeded from Input P-alt, not a PRD, still
  three gates (Requirements → Design → Tasks) for the one feature.

### Downstream file updates (same commit, mirroring the v7 promotion)

- `skills/spec-generator/SKILL.md` — description and body hand-edited to match (not auto-synced —
  only `resources/prompt.md` and the formatting standard are `make sync` targets).
- `skills/spec-generator/resources/prompt.md` — refreshed via `make sync` once the Makefile pointer
  moves to v2 (sync guard is clean today; no uncommitted `skills/` edits to conflict with).
- `src/08-spec-generator/README.md` — drop the "(Kiro-style feature specs)" title suffix, the
  `kiro.dev` link, the "Kiro spec artifact" column header and "the Kiro convention" phrase in the
  mapping table; note the new Input P-alt path and TDD task shape.
- Top-level `README.md` line 66 — drop "Kiro-style".
- `docs/pipeline-workflow.md` (table row 7) and `docs/pipeline-workflow.d2` (`spec` and `build_out`
  node labels) — drop "Kiro specs" / "Claude Code / Kiro / Cursor" wording. Re-render
  `pipeline-workflow.png` afterward (via the `d2-diagrams` skill) so the doc image matches.
- `make verify` re-run after the sync to confirm `skills/spec-generator` still passes structural
  checks (frontmatter name/description, `resources/prompt.md` present) — content-level checks aren't
  part of that script, so no verifier change is needed for the P-alt/TDD content itself.

---

## Part 2 — `delivery-agent` branching

### New skill: `delivery-agent:kickoff`

Entry point. Trigger: "start a new project", "build a new app", "start on ticket …" (when no branch
is yet established for the session), "kick off delivery". Asks one question if not already
obvious from context — **New application** or **Single feature** — then states the matching
pipeline below and hands off to its first real stage. Does not execute the pipeline itself; same
"state and hand off, don't silently orchestrate" convention every other `delivery-agent` skill
already follows, applied to the one place that needs to pick a branch first.

### Branch A — New application

```
Repo KB + Design Guidelines (once)
        │
        ▼
rightshift-doc-gen:brd-generator (optional)
        │
        ▼
rightshift-doc-gen:prd-generator
        │
        ▼
rightshift-doc-gen:technical-design-generator
        │
        ▼
rightshift-doc-gen:spec-generator  (Phased mode, all features, Input P = approved PRD)
        │
        ▼
Human review of the full specs/ package
        │
        ▼
per feature ─▶ feature-design-brief ─▶ [Prototype Gate] ─▶ Implement (TDD off that
                                                              feature's tasks.md)
        │
        ▼
qa-verify-report ─▶ ship-with-ticket
```

`spec-generator`'s `design.md` (architecture/data-model/error-handling, per feature) and
`feature-design-brief`'s brief (flow/visual/accessibility) are complementary, not duplicates — the
former is engineering-facing, the latter UX-facing. Implementation tasks are dispatched from
`tasks.md`'s TDD cycles; UI-touching tasks also carry the feature-design-brief + design-system.md
context per that skill's existing Step 5 convention.

### Branch B — Single feature

```
ticket-intake (optional — may start from a direct ask instead)
        │
        ▼
superpowers:brainstorming
        │
        ▼
rightshift-doc-gen:spec-generator  (Single-Feature Mode, Input P-alt = Ticket Brief +
                                     brainstorming output — no PRD)
        │
        ▼
feature-design-brief ─▶ [Prototype Gate] ─▶ Implement (TDD off tasks.md)
        │
        ▼
qa-verify-report ─▶ ship-with-ticket
```

Both branches converge on the same shape: implementation is always dispatched from a TDD-formatted
`tasks.md`, never from an ad-hoc plan. That's what makes "the specs" TDD-driven regardless of which
branch produced them — Branch A just has more upstream process (BRD/PRD/Technical Design) before
`spec-generator` runs.

### `plugin.json` / README changes

- `src/delivery-agent/.claude-plugin/plugin.json`: `dependencies` → `["superpowers",
  "rightshift-doc-gen"]`; `skills` array gains `"./skills/kickoff"`.
- `.claude-plugin/*.json` (root marketplace manifest) — the `delivery-agent` entry's `description`
  updated to mention the two branches and the new dependency.
- `src/delivery-agent/README.md` (and its generated copy) — pipeline section rewritten: the current
  single ASCII pipeline + table replaced with Branch A / Branch B diagrams and stage tables above,
  plus the `kickoff` row and the `rightshift-doc-gen` dependency note (mirrors the existing
  "Why depend on superpowers" section — add a parallel paragraph for `rightshift-doc-gen`).
- No changes needed to `ticket-intake`, `repo-knowledge-base`, `design-guidelines`,
  `feature-design-brief`, `feature-prototype`, `qa-verify-report`, `ship-with-ticket` — all reused
  as-is by both branches.

---

## Verification

- `make verify` — structural check on all `rightshift-doc-gen` skills including `spec-generator`.
- `make sync` — propagates `spec-generator-v2.md` into `skills/spec-generator/resources/prompt.md`;
  guard refuses if `skills/`/`delivery-agent` has uncommitted edits at sync time (none expected —
  hand-edits to `SKILL.md` happen in the same commit, same as the v7 promotion).
- Manual read-through of both `delivery-agent` pipeline branches against the stage tables above —
  every stage a real, existing skill name (own or `rightshift-doc-gen:`-qualified), no invented
  skill referenced anywhere but `kickoff` itself.

## Open items

None outstanding — no `DECISION NEEDED` / `TBD` left in this design.
