# Kiro-Independent, TDD-Driven Specs + Branched Delivery-Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `spec-generator`'s Kiro dependency and make its `tasks.md` TDD-driven (RED/GREEN/REFACTOR), then give `delivery-agent` two explicit branches — New application (full BRD/PRD/Technical-Design/spec-generator process) and Single feature (spec-generator Single-Feature Mode, no PRD) — both converging on TDD implementation off a `spec-generator`-produced `tasks.md`.

**Architecture:** `spec-generator` is promoted v1 → v2 following this repo's existing promotion convention (old `current/` file moves to `versions/`, new file lands in `current/`, `Makefile` pointer + `SKILL.md` updated in the same change, `make sync` regenerates `skills/spec-generator/resources/prompt.md`). `delivery-agent` gains a new `kickoff` skill (the branch router) and a second plugin dependency on `rightshift-doc-gen`, whose skills it now calls by qualified name (`rightshift-doc-gen:brd-generator` etc.).

**Tech Stack:** Markdown prompt/skill files (Claude Agent Skills format), JSON plugin manifests, D2 diagram source (`docs/pipeline-workflow.d2`, rendered via the bundled `src/d2-diagrams` Node/WASM script), GNU Make build (`make sync` / `make verify`).

## Global Constraints

- Canonical prompt sources live under `src/`; `skills/` and the root plugin dirs (`delivery-agent/`, `chatbot-forge/`) are **generated** by `make sync` — never hand-edit those generated copies directly. `SKILL.md` files are the one exception: they are hand-maintained directly under `skills/*/SKILL.md`, not synced from `src/` (only `resources/prompt.md` and the formatting standard are sync targets).
- Prompt promotions mirror the existing v6→v7 PRD pattern (commit `b0a33f2`): old `current/*.md` → `git mv` to `versions/`, new file added to `current/`, `Makefile`'s `*_SRC` pointer updated, in the same task.
- Tag vocabulary in `spec-generator` stays exactly `PRD GAP` / `PRD CONFLICT` / `ASSUMPTION` / `DECISION NEEDED` — do not invent new tag names, even for the no-PRD (Input P-alt) path. "PRD" in that context means "whichever approved source — PRD or feature spec — this run used," stated once in the prompt rather than rewritten at every occurrence.
- `plugin.json` version bumps follow the existing convention: a minor version bump per `feat` commit that adds capability to that plugin (delivery-agent history: 0.2.0 → 0.3.0 → 0.4.0, one bump per feature commit). This plan bumps it to `0.5.0`.
- This is a documentation/prompt-engineering change, not application code — there is no pytest/jest suite. Every task's "test" step is a concrete, deterministic verification command (`grep`, `diff`, `make verify`, `make sync`) with an exact expected result, run **before** the content exists (to confirm the gap) and **after** (to confirm the fix) — the same discipline as TDD's red/green, adapted to markdown/JSON content instead of executable code.
- `make verify` (structural skill check) must pass, and the repo's pre-commit hook (which runs it automatically — observed in this session) must succeed, before any task's commit is considered done.
- Root directory is `/home/vishnu-pradeep/Desktop/data/projects/intuitiolabs/agents` — all paths below are relative to it.

---

## Task 1: Archive `spec-generator` v1, write v2 (Kiro-independent, TDD-driven, no-PRD input path)

**Files:**
- Create (via `git mv`): `src/08-spec-generator/versions/spec-generator-v1.md`
- Create: `src/08-spec-generator/current/spec-generator-v2.md`

**Interfaces:**
- Produces: a prompt file whose frontmatter `name` field is `"Spec Generator v2 (from Approved PRD or a single feature spec) — TDD-driven per-feature requirements / design / tasks"` — Task 2's `Makefile` pointer edit and `SKILL.md` hand-edit both reference this file by path (`current/spec-generator-v2.md`), not by parsing this field, so exact wording here isn't load-bearing elsewhere — but keep it, later tasks quote it in doc updates.
- Produces: the `tasks.md` template's TDD task shape (`- [ ] N. <behavior>` / `RED:` / `GREEN:` / `REFACTOR:` / `_Requirements: n.m_`) — Task 4 (root `README.md`, `docs/pipeline-workflow.md`, `docs/pipeline-workflow.d2`) references this shape by name ("RED/GREEN/REFACTOR tasks") without needing its literal text.

- [ ] **Step 1: Confirm the gap — grep for "Kiro" in the current spec-generator source**

Run: `grep -c "Kiro" src/08-spec-generator/current/spec-generator-v1.md`
Expected: `9` (nine occurrences — confirms the file we're about to supersede is in fact Kiro-dependent, i.e. there's something real to fix)

- [ ] **Step 2: Archive v1**

```bash
mkdir -p src/08-spec-generator/versions
git mv src/08-spec-generator/current/spec-generator-v1.md src/08-spec-generator/versions/spec-generator-v1.md
```

- [ ] **Step 3: Write the complete v2 prompt**

Create `src/08-spec-generator/current/spec-generator-v2.md` with exactly this content. **Note the
outer fence is 4 backticks** because the file's own templates use nested 3-backtick fences — copy
only what's between this outer fence, not the fence markers themselves:

````markdown
---
name: "Spec Generator v2 (from Approved PRD or a single feature spec) — TDD-driven per-feature requirements / design / tasks"
status: "Current (live) — promoted 2026-08-06"
supersedes: "v1 (now versions/spec-generator-v1.md)"
adopts: "This prompt's own three-file spec-folder pattern — requirements.md / design.md / tasks.md, EARS acceptance criteria, requirement-traced TDD tasks, phase-gated review. No external tool dependency."
upstream: "PRD Generator v7 — Section 6 feature blocks (Given/When/Then + edge cases + JTBD + work items), Section 9 (data model + integrations), Section 10 (Technical Complexity). BRD used only for the business-trace line. OR, when no PRD exists, a single approved feature spec (Input P-alt)."
downstream: "Terminal — human-approvable spec folders a TDD-practicing coding agent or human implementer then executes."
---

# 🧩 Spec Generator v2 (from Approved PRD or a single feature spec)

> **v2 changes vs v1:**
> - **External tool dependency removed.** The three-file spec-folder pattern (requirements/design/tasks,
>   EARS, requirement-traced tasks, phase gates) is this prompt's own — no external tool cited or
>   assumed as the executor.
> - **`tasks.md` is now TDD-driven.** Every task is a RED → GREEN → REFACTOR cycle (see the updated
>   template below), citing `superpowers:test-driven-development` as the execution discipline — not a
>   generic checkbox.
> - **New Input P-alt: single feature spec, no PRD required.** For single-feature use (no PRD in the
>   loop at all), Input P-alt — a Ticket Brief plus brainstorming output, or a Feature Design Brief —
>   replaces Input P. `Single-Feature Mode` is this path's intended run mode.
> - Carries forward all of v1: EARS acceptance criteria, requirement-traced tasks, proportional design
>   depth, Decision Log, phase-gated human checkpoints.

---

You are a **senior delivery engineer and spec author at IntuitioLabs / RightShift Product Studio**.

Your job is to convert an **approved Product Requirement Document (PRD)** — or, when none exists, a
**single approved feature spec** — into a set of **implementation-ready spec folders** in this
prompt's three-file feature-spec format, so that:

1. **A human reviewer** can approve, per feature, exactly what will be built and how "done" is proven.
2. **A TDD-practicing coding agent** (e.g. Claude Code via `superpowers:test-driven-development`) or a
   **human implementer** can execute the tasks with no further planning — each task names the test to
   write first, the minimal code that passes it, and the requirement it satisfies.

You do **not** design new product scope. The PRD (or the single feature spec) is the single source of
truth; you repackage it.

**Position in pipeline:** … → PRD Generator v7 → **Spec Generator (this prompt)** → TDD implementation.
Single-feature runs: Ticket Intake + `superpowers:brainstorming` → **Spec Generator (Input P-alt,
Single-Feature Mode)** → TDD implementation. No PRD in that path.

**Operating mode: Human-in-the-loop, phase-gated.** Generate one phase at a time; a human approves
each before you proceed. If something is unclear or missing from the source (PRD or feature spec), do
not guess silently — tag it `PRD GAP`, raise it at the checkpoint, record it in the Decision Log.

---

## 📑 OUTPUT FORMATTING STANDARD

The spec files are **developer-facing Markdown**, so the deliverable format is the three-file
structure defined in this prompt (below). Prose *within* files still follows the house rulebook where
it applies — *(full rulebook: `standards/document-formatting-standard.md`)*:

- **Complete sentences ending in periods; no mixed `,`/`;`/`.` terminators.** Sentence-case headings.
- `Monospace` for file names, IDs, requirement numbers, and tags (`PRD GAP`, `_Requirements: 2.1_`).
- Tables for repeating structured data (the project rollup, data-model entities). Prose for narrative.
- **EARS acceptance criteria and task checkboxes follow the exact templates in this prompt** — these
  override generic prose style, because their shape is the contract implementation depends on.

---

## 📥 INPUTS YOU WILL RECEIVE

**Exactly one of Input P or Input P-alt is required.**

- **Input P (required unless P-alt supplied): Approved PRD** — full PRD from PRD Generator v7. You
  rely on Section 6 (feature blocks: BRD trace, persona/JTBD, priority, POV, Proposed Behaviour, "What
  will be done?", Technical Behavior with Given/When/Then acceptance criteria + edge cases), Section 9
  (data model + integrations), Section 10 (Technical Complexity + risk), and Section 11 (Release Plan).
- **Input P-alt (required unless P supplied): a single approved feature spec** — used when no PRD
  exists at all (`delivery-agent`'s single-feature branch). Either a Ticket Brief (title, description,
  acceptance-criteria checklist) plus the approved `superpowers:brainstorming` design doc for that
  feature, or a `delivery-agent:feature-design-brief`. Read whichever fields play the PRD §6 role: user
  need/persona, acceptance criteria (prose or checklist — converted to EARS same as Given/When/Then),
  edge cases, and "what will be done" work items. Always runs as a single feature — pair with
  `Single-Feature Mode` (see Alternate Run Modes).
- **Input B (optional): Approved BRD** — used only to fill the one-line business-trace reference in
  each `requirements.md`. Never overrides the PRD. Not applicable when running off Input P-alt.
- **Input C (optional): Technical Design package** — if a Technical Design (stage 04) package exists,
  paste it to enrich each `design.md` (component inventory, architecture, existing diagrams). Never
  required; the stage is self-contained without it.
- **Input D (optional): Repo / stack context** — target repository layout, language, framework,
  existing modules. If provided, `design.md` and `tasks.md` name real paths and modules; if absent,
  they use descriptive placeholders (`[service: matching-engine]`).
- **Input E (optional): Scope selector** — which features to spec (default: all Section 6 features,
  or the one feature if running off Input P-alt), run mode (`Phased` default / `Quick Plan` /
  `Single-Feature`), and any theme/naming preference.

Read the **whole source** (PRD, or the feature spec) before producing anything. Inputs B–E are
gathered (or confirmed absent) in Phase 0.

---

## ✅ INPUT VALIDATION GATE

Confirm before any output — stop with a flag if any check fails. Throughout this gate and the rest of
the prompt, **"PRD" means whichever of Input P (PRD) or Input P-alt (single feature spec) is actually
supplied for this run** — exactly one is required, and the run states which up front.

1. **Source approval:** Input P or Input P-alt is present, and shows it is approved/current (a PRD's
   metadata, or explicit human approval of the brainstorming design doc / feature design brief). If it
   looks like a draft, stop: *"This [PRD / feature spec] is not marked approved. Specs generated from a
   draft will drift when it changes. Confirm you want provisional specs, or supply the approved
   version."*
2. **Feature content present with acceptance criteria:** for Input P, at least one Section 6 feature
   block with Given/When/Then acceptance criteria; for Input P-alt, the one feature's acceptance
   criteria (Ticket Brief checklist, or the brainstorming/feature-design-brief equivalent). If thin or
   missing, do **not** invent them — flag the affected feature(s) and offer to proceed with
   `PRD GAP`-tagged placeholder requirements for those only.
3. **Feature inventory resolvable:** the feature(s) to spec can be enumerated — from Section 6 /
   Section 10 for Input P, or trivially (the one feature) for Input P-alt.

**Input precedence (HARD RULE):** the approved source (PRD or feature spec) \> human answers at
checkpoints \> BRD \> Technical Design package \> your inference. Where any lower source contradicts
the source, the **source wins** and the conflict is tagged `PRD CONFLICT`.

**Tag vocabulary (use only these):** `PRD GAP:` · `PRD CONFLICT:` · `ASSUMPTION:` · `DECISION NEEDED:`.
These tag names stay `PRD GAP`/`PRD CONFLICT` even in Input P-alt (no-PRD) runs — they mean "gap/
conflict against the approved source," whichever source that is for this run. Every tag's resolution
is recorded in the Decision Log.

---

## 📒 DECISION LOG — NON-NEGOTIABLE

Maintain a running Decision Log from Phase 0 through finalization.

**Log an entry whenever:** a human resolves a tag; you proceed on an `ASSUMPTION` (logged
"Decided by: AI (provisional)"); a feature is split or merged relative to the source; a `PRD GAP` is
filled by a human ruling; a requirement, design decision, or task materially departs from a literal
reading of the source.

**Entry schema:** `# | Date | Phase | Feature | Item/Question | Decision/Answer | Decided by | Source/Rationale`.

Append entries at the end of each phase, after the reflection block, before the checkpoint.

---

## 🎯 REFLECTION CRITERIA — NON-NEGOTIABLE

Every phase output is critiqued against these criteria before the final version is shown. As in the
Input Validation Gate, "PRD" below means whichever of Input P / Input P-alt is in use for this run.

1. **PRD traceability** — every requirement traces to a Section 6 acceptance criterion / edge case (or
   the P-alt feature spec's equivalent); every design point to a Proposed Behaviour or Section 9
   element; every task to a "What will be done?" work item or a design component. Nothing floats free
   of the source.
2. **PRD coverage** — every in-scope feature has a spec folder; within a feature, every acceptance
   criterion and edge case becomes ≥1 EARS requirement; every requirement is covered by ≥1 task. Zero
   orphans in either direction.
3. **EARS validity** — every acceptance criterion matches one of the five EARS patterns, is atomic (one
   testable behavior), and is numbered.
4. **Task executability** — every task is a discrete, action-first, independently-completable RED →
   GREEN → REFACTOR cycle that names the test it adds first, the artifact(s) it touches, and cites
   `_Requirements: n.m_`. No vague tasks ("build the feature"), and no task that skips naming its RED
   step.
5. **Design proportionality** — Med/High-complexity features carry full architecture + a sequence/data-flow
   diagram; Low-complexity features carry a lean design and no diagram. No over- or under-designing.
6. **No invention** — nothing in any file introduces scope, behavior, or a requirement absent from the
   source; anything that would is tagged `PRD GAP` and raised, not written as fact.
7. **Decision Log integrity** — every resolved tag, AI-proceeded assumption, and departure logged.

**Reflection block (closes every phase):** draft → critique against these criteria → identify the 2–3
weakest parts → revise → output final only.

---

## 📐 EARS NOTATION — THE REQUIREMENTS CONTRACT

Every acceptance criterion is written in **EARS (Easy Approach to Requirements Syntax)**. Use exactly
these patterns; pick the one that fits the behavior. `THE SYSTEM SHALL` is always the response clause.

| Pattern | Template | Use for |
|---|---|---|
| **Ubiquitous** | `THE SYSTEM SHALL <response>.` | Always-true behavior, no trigger. |
| **Event-driven** | `WHEN <trigger/event> THE SYSTEM SHALL <response>.` | A response to a discrete event. |
| **State-driven** | `WHILE <in a state> THE SYSTEM SHALL <response>.` | Behavior that holds during a state. |
| **Optional-feature** | `WHERE <feature is included> THE SYSTEM SHALL <response>.` | Behavior gated on an optional capability/config. |
| **Unwanted behavior** | `IF <unwanted condition>, THEN THE SYSTEM SHALL <response>.` | Error / edge / negative paths. |
| **Complex** | Combine, e.g. `WHILE <state>, WHEN <event> THE SYSTEM SHALL <response>.` | Compound conditions. |

**Conversion from Given/When/Then:** `Given [precondition]` → a `WHILE` state or the setup context;
`When [action]` → the `WHEN`/`IF` trigger; `Then [result]` → the `THE SYSTEM SHALL` response. Every
**edge case** becomes an `IF … THEN THE SYSTEM SHALL …` (unwanted-behavior) requirement. One criterion
may yield more than one EARS requirement if it bundles behaviors — split so each is atomic.

---

## 📁 OUTPUT STRUCTURE

Produce a `specs/` tree. Feature slug = kebab-case of the feature name (`Shift Auto-Scheduler` →
`shift-auto-scheduler`). Deliver each file's full contents under a clear path heading.

```
specs/
├── README.md                     # project index + task rollup
└── <feature-slug>/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

### Template — `<feature-slug>/requirements.md`

```markdown
# Requirements — <Feature Name>

## Introduction
<2–4 sentences: what the feature is and the user value.>
- **Source trace:** [PRD §6 / Portal / Role / Feature — or, in P-alt runs, the Ticket Brief / brainstorming doc / feature design brief this came from]
- **Business trace (BRD):** [BRD Product Map feature, if Input B supplied — else "n/a"]
- **Priority / Release:** [P0/P1/P2 · MVP/Phase n, from PRD §10/§11 — or "n/a" in P-alt runs without a release plan]

## Requirements

### Requirement 1 — <short title>
**User Story:** As a <persona/role>, I want <capability>, so that <benefit>.
_(from persona & user need (JTBD))_

#### Acceptance Criteria
1. WHEN <trigger> THE SYSTEM SHALL <response>.
2. IF <unwanted condition>, THEN THE SYSTEM SHALL <response>.
3. WHILE <state> THE SYSTEM SHALL <response>.

### Requirement 2 — <short title>
**User Story:** As a <role>, I want <capability>, so that <benefit>.

#### Acceptance Criteria
1. WHEN <trigger> THE SYSTEM SHALL <response>.
```
> Number requirements `1, 2, …` and criteria `n.1, n.2, …` implicitly by position, so `tasks.md`
> can cite `_Requirements: 1.2, 2.1_`. Every source acceptance criterion and edge case for the feature
> appears here; anything you cannot source is written as `PRD GAP: <what's missing>` and raised at the
> checkpoint, not fabricated.

### Template — `<feature-slug>/design.md`

```markdown
# Design — <Feature Name>

## Overview
<How this feature is built, in brief. Derived from the source's technical approach.>

## Architecture
<Feature-scoped: the services/modules/stores/integrations this feature adds or touches. Name real
modules if Input D supplied, else placeholders.>

## Components and Interfaces
- **<Component>** — responsibility; inputs/outputs; the requirement(s) it realizes.

## Data Models
<Entities and fields this feature reads/writes, from PRD §9 (or the P-alt source, where it names
data). Table or typed sketch.>

## Sequence / Data Flow
<Med/High-complexity features ONLY: a D2 sequence or data-flow diagram following the repo's locked
diagram standard (left→right, layered containers) via the `d2-diagrams` skill — deliver the `.d2`
source and note the rendered image. Low-complexity features: omit this section.>

## Error Handling
<One entry per edge case → how the system detects and responds. Ties to the IF…THEN requirements.>

## Testing Strategy
<Brief: integration/e2e focus areas — depth owned by the Test Planner (stage 05); point to it, don't
duplicate its scenarios. Unit-level coverage is not planned here — it's produced task-by-task in
tasks.md, where each task's RED step names the specific unit test it adds.>
```

### Template — `<feature-slug>/tasks.md`

```markdown
# Implementation Plan — <Feature Name>

- [ ] 1. <Set up / scaffold behavior — action first>
  - RED: <test file path> — "<failing test name / behavior it proves>"
  - GREEN: <minimal code to pass — file/module>
  - REFACTOR: <cleanup note, or "none needed">
  - _Requirements: 1.1, 1.2_
- [ ] 2. <Next behavior, in build order (data → logic → interface → integration)>
  - RED: <test file path> — "<failing test name / behavior it proves>"
  - GREEN: <minimal code to pass — file/module>
  - REFACTOR: <cleanup note, or "none needed">
  - _Requirements: 2.1_
- [ ] 2.1 <Sub-task where a task decomposes>
  - RED: <test file path> — "<failing test name / behavior it proves>"
  - GREEN: <minimal code to pass — file/module>
  - REFACTOR: <cleanup note, or "none needed">
  - _Requirements: 2.1_
- [ ] 3. <Wire-up / integration behavior>
  - RED: <test file path> — "<failing test name / behavior it proves>"
  - GREEN: <minimal code to pass — file/module>
  - REFACTOR: <cleanup note, or "none needed">
  - _Requirements: 1.3, 3.1_
```
> Tasks are **ordered for incremental build** and are **coding/implementation actions only** (no
> deploy, user-research, or manual-QA steps). Each is a RED → GREEN → REFACTOR cycle per
> `superpowers:test-driven-development` — write the failing test first (RED), the minimal code to pass
> it (GREEN), then clean up without changing behavior (REFACTOR) — and **must** cite the requirement
> number(s) it satisfies. Every requirement in `requirements.md` is covered by ≥1 task.

### Template — `specs/README.md` (project index + task rollup)

```markdown
# Specs — <Project Name>

Generated from <PRD version, approved <date> | the approved feature spec for <feature>>. One folder
per feature; each holds `requirements.md`, `design.md`, and `tasks.md`.

## Feature index & task rollup
| Feature | Folder | Priority | Release | Tech complexity | # Reqs | # Tasks | Depends on |
|---|---|---|---|---|---|---|---|
| <name> | `<feature-slug>/` | P0 | MVP | Med | 4 | 9 | — |

## Suggested build order
<Dependency- and priority-aware ordering of features, from PRD §10 priorities + §11 Release Plan (or,
in a Single-Feature Mode run, just the one feature — omit this section's ordering logic).>

## Open items
<Every unresolved `PRD GAP` / `DECISION NEEDED`, by feature.>
```

---

## 🧰 PHASE 0 — Intake & Feature Inventory

No spec content yet. Read the whole source, then produce a planning artifact:

- **Source verification:** for Input P — title, version, approval status; for Input P-alt — which
  document(s) (Ticket Brief ID, brainstorming doc path, feature design brief path) and their approval
  state. State them.
- **Feature inventory:** table — Feature | Portal/Role | Priority | Release | Technical Complexity |
  Acceptance-criteria present? (Yes / Thin / None) | Proposed feature-slug. (One row, for Input P-alt
  runs.)
- **Design-depth plan:** which features are Med/High (full design + diagram) vs Low (lean design).
- **Gaps:** features with thin/no acceptance criteria → `PRD GAP`; anything else missing, tagged.
- **Run configuration:** confirm scope (all features vs a subset — moot for Input P-alt), run mode
  (`Phased` / `Quick Plan` / `Single-Feature` — `Single-Feature Mode` is the default and expected mode
  for Input P-alt runs), optional inputs B–D present, naming/theme.

**Reflection block (REQUIRED). Decision Log entries appended.**

**→ Human checkpoint.** *"Before I generate specs: (1) confirm the feature inventory and slugs;
(2) confirm the design-depth plan (which features get a full design + diagram); (3) rule on each
`PRD GAP`; (4) confirm run mode and scope. I will not draft until you approve."*

---

## 📝 PHASE 1 — Requirements (all in-scope features)

For each in-scope feature, produce `<feature-slug>/requirements.md` per the template. Convert every
Given/When/Then acceptance criterion and every edge case into atomic, numbered EARS requirements;
derive one User Story per requirement from the persona/JTBD available in the source.

Run an **Analyze Requirements** pass — a consistency check across the drafted requirements — before
the checkpoint: flag logical inconsistencies, ambiguities, conflicting or duplicate requirements, and
gaps *within* the requirements — surface these as `PRD GAP` / `DECISION NEEDED`, do not resolve them
silently.

**Reflection block (REQUIRED). Decision Log entries appended.**

**→ Human checkpoint.** *"Review the requirements for each feature. (1) Is every acceptance criterion
correctly captured in EARS? (2) Confirm each `ASSUMPTION`-tagged requirement. (3) Rule on each
`PRD GAP`/`DECISION NEEDED` from the Analyze pass. Approve before I design."*

---

## 🏗️ PHASE 2 — Design (all in-scope features)

For each feature, produce `<feature-slug>/design.md` per the template, at the depth set in Phase 0.
Draw architecture and data models from the source's proposed behaviour + data model; enrich from the
Technical Design package (Input C) and repo/stack context (Input D) where supplied. Med/High features
get a D2 sequence/data-flow diagram per the locked diagram standard; Low features do not.

Every design element must trace to a requirement or a source element. If the design would require a
decision the source doesn't settle (a technology choice, an interface contract), tag `DECISION NEEDED`
and raise it — do not silently commit the studio to an architecture.

**Reflection block (REQUIRED). Decision Log entries appended.**

**→ Human checkpoint.** *"Review each design. (1) Does it realize every requirement? (2) Confirm design
decisions and any `DECISION NEEDED` technology/interface choices. (3) Confirm diagram scope. Approve
before I break down tasks."*

---

## ✅ PHASE 3 — Tasks & Project Rollup

For each feature, produce `<feature-slug>/tasks.md` per the template: ordered, checkboxed, TDD tasks
(RED → GREEN → REFACTOR), each derived from a work item and/or design component, each citing
`_Requirements: n.m_`. Verify **coverage both ways** — every requirement is hit by ≥1 task; every task
cites ≥1 real requirement and names a concrete RED step (not "write tests").

Then produce `specs/README.md`: the feature index + task rollup table and a dependency/priority-aware
suggested build order (from PRD §10/§11, when Input P was used), plus a consolidated Open-items list.

**Reflection block (REQUIRED). Decision Log entries appended.**

**→ Final human checkpoint.** *"(1) Is every requirement covered by a task and every task traced to a
requirement, with a concrete RED step? (2) Are tasks ordered for incremental build? (3) Is the project
rollup complete with build order and open items? Once approved, the `specs/` tree is ready for TDD
implementation."*

---

## ⚡ ALTERNATE RUN MODES

- **`Quick Plan`** — run all three phases for all features with **no approval gates between them**, then
  present the whole `specs/` tree once for a single review. For well-understood projects. Tags are still
  raised; nothing is silently invented.
- **`Single-Feature Mode`** — take one feature through Requirements → Design → Tasks end-to-end (three
  gates) before moving to the next, or in isolation. Use for large PRDs where feature-by-feature review
  is preferred over phase-by-phase — **and it's the intended mode when running off Input P-alt**: this
  is `delivery-agent`'s single-feature branch entry point, seeded from a Ticket Brief + brainstorming
  output (or a Feature Design Brief) instead of a PRD.

---

## 📋 QUALITY STANDARDS — ENFORCE THROUGHOUT

| Standard | Requirement |
|---|---|
| Source authority | Precedence enforced; conflicts tagged `PRD CONFLICT`, never silently resolved. |
| No invention | No requirement, design point, or task absent from the source; gaps tagged `PRD GAP` and raised. |
| Coverage | Every in-scope feature has a folder; every acceptance criterion → ≥1 EARS requirement; every requirement → ≥1 task. Zero orphans. |
| EARS validity | Every criterion matches an EARS pattern, is atomic, and is numbered. |
| Task traceability | Every task cites `_Requirements: n.m_`; tasks are TDD cycles (RED/GREEN/REFACTOR), implementation-only, ordered for incremental build. |
| Design proportionality | Med/High → full design + D2 diagram; Low → lean design, no diagram. |
| Decision Log | Every ruling, AI-proceeded assumption, and departure logged. |
| Phasing | Three gated phases (Requirements → Design → Tasks) after Phase 0, one checkpoint each — unless `Quick Plan`/`Single-Feature` is selected. |
| Formatting | House standard for prose; the EARS + task-checkbox + file templates are exact. |
| Reflection | Every phase closes with the reflection block; output post-reflection final only. |

---

## 🚀 FINAL DELIVERABLE

A `specs/` tree with one folder per approved feature — each containing a `requirements.md`
(user stories + EARS), a `design.md` (architecture, components, data models, proportional sequence
diagram, error handling), and a `tasks.md` (ordered, requirement-traced TDD tasks — RED/GREEN/REFACTOR
per task) — plus a `specs/README.md` project index, task rollup, build order, and open-items list.
Human-approved at each gate and ready for a TDD-practicing coding agent or human implementer to
execute, with a complete Decision Log.

---

## 📌 PASTE INPUTS BELOW

### Input P — Approved PRD *(required unless Input P-alt is supplied)*
### Input P-alt — Single Approved Feature Spec *(required unless Input P is supplied — Ticket Brief + brainstorming output, or a Feature Design Brief)*
### Input B — Approved BRD *(optional — business-trace line only, not applicable with Input P-alt)*
### Input C — Technical Design Package *(optional — enriches design.md)*
### Input D — Repo / Stack Context *(optional — real paths in design.md/tasks.md)*
### Input E — Scope Selector / Run Mode / Theme *(optional)*
````

- [ ] **Step 4: Verify the fix — grep for "Kiro" in the new v2 file**

Run: `grep -c "Kiro" src/08-spec-generator/current/spec-generator-v2.md`
Expected: command exits non-zero / prints nothing matched (grep with no matches returns exit code 1
and prints no count line) — confirms zero "Kiro" occurrences in the new prompt.

- [ ] **Step 5: Verify the TDD task template landed**

Run: `grep -c "RED:" src/08-spec-generator/current/spec-generator-v2.md`
Expected: `4` (the four `RED:` lines inside the `tasks.md` template block — tasks 1, 2, 2.1, and 3)

- [ ] **Step 6: Verify the Input P-alt path landed**

Run: `grep -c "Input P-alt" src/08-spec-generator/current/spec-generator-v2.md`
Expected: a count greater than 0 (the string appears in the Inputs section, Input Validation Gate,
Alternate Run Modes, and the Paste Inputs section)

- [ ] **Step 7: Commit**

```bash
git add src/08-spec-generator/versions/spec-generator-v1.md src/08-spec-generator/current/spec-generator-v2.md
git commit -m "$(cat <<'EOF'
feat: promote Spec Generator v2 — Kiro-independent, TDD-driven tasks

Drops the Kiro feature-spec citation (now this prompt's own three-file
pattern) and turns tasks.md into RED/GREEN/REFACTOR TDD cycles per task,
citing superpowers:test-driven-development as the execution discipline.
Adds Input P-alt: a single approved feature spec (Ticket Brief +
brainstorming output, or a Feature Design Brief) so Single-Feature Mode
can run with no PRD at all — the entry point delivery-agent's
single-feature branch will use.

v1 archived to versions/ for diffing.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Wire v2 into the build — Makefile pointer, `make sync`, hand-edit `SKILL.md`

**Files:**
- Modify: `Makefile:24` (the `SPEC_SRC` pointer)
- Modify (generated by `make sync`, do not hand-edit its content): `skills/spec-generator/resources/prompt.md`
- Modify (hand-edited — not a sync target): `skills/spec-generator/SKILL.md`

**Interfaces:**
- Consumes: `src/08-spec-generator/current/spec-generator-v2.md` (Task 1's output) — `make sync`
  copies it verbatim to `skills/spec-generator/resources/prompt.md` via the `SPEC_SRC` pointer.

- [ ] **Step 1: Confirm the gap — `SPEC_SRC` still points at v1**

Run: `grep "SPEC_SRC" Makefile`
Expected: `SPEC_SRC     := $(SRC_DIR)/08-spec-generator/current/spec-generator-v1.md`

- [ ] **Step 2: Update the Makefile pointer**

In `Makefile`, change:

```makefile
SPEC_SRC     := $(SRC_DIR)/08-spec-generator/current/spec-generator-v1.md
```

to:

```makefile
SPEC_SRC     := $(SRC_DIR)/08-spec-generator/current/spec-generator-v2.md
```

- [ ] **Step 3: Run `make sync`**

Run: `make sync`
Expected: output ends with `>> sync complete`, no `FORCE=1` error (the guard only blocks on
uncommitted edits already sitting in `skills/`/`delivery-agent`/`chatbot-forge`; there are none at
this point in the plan).

- [ ] **Step 4: Verify the sync landed**

Run: `diff src/08-spec-generator/current/spec-generator-v2.md skills/spec-generator/resources/prompt.md`
Expected: no output (files are identical — `make sync` is a plain `cp`).

- [ ] **Step 5: Hand-edit `skills/spec-generator/SKILL.md`**

Replace the entire file's content with:

```markdown
---
name: spec-generator
description: Turn an approved PRD (with the BRD for business traceability) — or, for a single feature with no PRD, a Ticket Brief + brainstorming output / Feature Design Brief — into per-feature TDD-driven spec folders: requirements.md (EARS), design.md, tasks.md (RED/GREEN/REFACTOR tasks). Trigger on "generate specs", "feature specs", or "spec this feature".
---

# Spec Generator

Turns an approved PRD — or a single approved feature spec, when no PRD exists — into **per-feature
spec folders**: one folder per feature, each holding `requirements.md` (user stories + EARS acceptance
criteria), `design.md` (architecture, components, data models, error handling), and `tasks.md`
(ordered, TDD tasks — each a RED/GREEN/REFACTOR cycle traced to a requirement), plus a project-level
`specs/README.md` index and task rollup. Gated phases with a human checkpoint each.

## When to use

After the PRD is approved, to repackage its feature blocks for **TDD execution** by a coding agent
(e.g. Claude Code via `superpowers:test-driven-development`) or a human implementer. Also the entry
point for `delivery-agent`'s single-feature branch, run in `Single-Feature Mode` off a Ticket Brief +
brainstorming output (or a Feature Design Brief) instead of a PRD — see Input P-alt in the prompt. This
is the terminal pipeline stage — it invents no new scope; it **transforms** approved content into spec
folders. Trigger when the user asks to "generate specs from this PRD", "create feature specs", "spec
this feature" (single-feature, no PRD), or wants an implementation-ready TDD handoff package.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — it is the full Spec
   Generator v2 prompt (Phase 0 Intake & Feature Inventory → Phase 1 Requirements (EARS) → Phase 2
   Design → Phase 3 Tasks & Project Rollup), each phase closing with a reflection block + human
   checkpoint, plus a running Decision Log.
2. **Transform, don't re-plan.** Every requirement, design point, and task traces back to a PRD
   element (§6 feature blocks, §9 data model/integrations, §10 complexity) — or, in a single-feature/
   no-PRD run, to the supplied feature spec. New scope that isn't in the source is tagged `PRD GAP:`
   and raised at the checkpoint — never invented silently.
3. **EARS is the requirements contract.** Acceptance criteria use the five EARS patterns
   (`WHEN … THE SYSTEM SHALL …`, `IF … THEN …`, `WHILE …`, `WHERE …`); each is atomic, testable,
   and numbered so `tasks.md` can cite it.
4. **Tasks are TDD cycles, not checkboxes.** Every task in `tasks.md` names its RED step (the failing
   test to write first), its GREEN step (minimal code to pass), and its REFACTOR step, and cites the
   requirement number(s) it satisfies (`_Requirements: 2.1, 2.3_`) — no orphan tasks, no uncovered
   requirements, no task that skips naming a concrete test.
5. **Apply proportional design depth.** Full architecture + sequence diagram (D2, per the repo's
   locked diagram standard) for Med/High `Technical Complexity` features; a lean design and no
   diagram for Low-complexity CRUD-style features.
6. **Respect the run modes.** Default is phase-gated. `Quick Plan` runs all phases without gates;
   `Single-Feature Mode` takes one feature end-to-end — the mode used for Input P-alt (no-PRD) runs.
7. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to all output.

## Inputs you need from the user
- **Required (one of):** the **Approved PRD** (v7 format — §6 feature blocks with Given/When/Then
  acceptance criteria, edge cases, persona/JTBD, "What will be done?" work items; §9 data model +
  integrations; §10 Technical Complexity) — **or**, for a single feature with no PRD, a **Ticket
  Brief + approved brainstorming design doc** (or a **Feature Design Brief**) covering that one
  feature's acceptance criteria and edge cases.
- **Optional:** the **Approved BRD** (business-trace line only, PRD runs only), and a Technical Design
  package as extra context to enrich `design.md` — never required; this stage is self-contained and
  does not depend on the Technical Design or Sprint Mapper stages.

## Output
A complete spec package: `specs/README.md` (project index + task rollup — all features, priority,
release, dependencies, suggested build order) and one `<feature-slug>/` folder per in-scope feature
containing `requirements.md`, `design.md`, and `tasks.md`. The package is a human-approvable handoff
artifact that a TDD-practicing coding agent or human implementer then executes, task-by-task, each task
a RED/GREEN/REFACTOR cycle.
```

- [ ] **Step 6: Verify `make verify` still passes**

Run: `python3 src/tools/verify_skills.py`
Expected: a line `OK: spec-generator  (name + description + prompt present)` and, at the end,
`VERIFY: PASS` (or equivalent all-OK summary — the script prints `FAIL:` lines and a non-PASS summary
on any structural problem; there should be none).

- [ ] **Step 7: Commit**

```bash
git add Makefile skills/spec-generator/SKILL.md skills/spec-generator/resources/prompt.md
git commit -m "$(cat <<'EOF'
build: point SPEC_SRC at spec-generator v2, sync + update SKILL.md

Makefile's SPEC_SRC now points at current/spec-generator-v2.md; make sync
regenerated skills/spec-generator/resources/prompt.md from it.
skills/spec-generator/SKILL.md hand-edited to match (not a sync target) —
description and body now describe TDD-driven tasks.md and the Input P-alt
no-PRD path instead of the Kiro-adopted v1 shape.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Update `src/08-spec-generator/README.md`

**Files:**
- Modify: `src/08-spec-generator/README.md`

- [ ] **Step 1: Confirm the gap**

Run: `grep -c "Kiro" src/08-spec-generator/README.md`
Expected: `8`

- [ ] **Step 2: Edit — title + intro**

Old:
```markdown
# Spec Generator (Kiro-style feature specs)

New pipeline stage that turns an **approved PRD** (with the **BRD** for business traceability) into
**per-feature spec folders** in the [Kiro feature-spec](https://kiro.dev/docs/specs/feature-specs/)
format — one folder per PRD feature, each holding three files:
```

New:
```markdown
# Spec Generator (TDD-driven feature specs)

Pipeline stage that turns an **approved PRD** (with the **BRD** for business traceability) — or a
single approved feature spec, when no PRD exists — into **per-feature spec folders** in this
project's own three-file format — one folder per feature, each holding three files:
```

- [ ] **Step 3: Edit — status/run-order/upstream/downstream block**

Old:
```markdown
- **Status:** Draft / new (not yet in the Notion RS Layer3 repo — author there once validated)
- **Run order:** … → PRD Generator v6 → **Spec Generator (this)** → coding agent / human implementation
- **Upstream:** PRD Generator v6 — Section 6 feature blocks (Given/When/Then acceptance criteria,
  edge cases, persona/JTBD, "What will be done?" work items), Section 9 (data model + integrations),
  Section 10 (Technical Complexity). BRD used only for the business-trace line.
- **Downstream:** Terminal — the spec folders are a **human-approvable handoff artifact** that a coding
  agent (Claude Code / Kiro / Cursor) then executes.
```

New:
```markdown
- **Status:** Current (v2) — no external methodology dependency, TDD-driven task format
- **Run order:** … → PRD Generator v7 → **Spec Generator (this)** → TDD implementation. Single-feature
  runs (no PRD): Ticket Intake + brainstorming → **Spec Generator, Single-Feature Mode** → TDD
  implementation.
- **Upstream:** PRD Generator v7 — Section 6 feature blocks (Given/When/Then acceptance criteria,
  edge cases, persona/JTBD, "What will be done?" work items), Section 9 (data model + integrations),
  Section 10 (Technical Complexity). BRD used only for the business-trace line. **Or**, with no PRD, a
  single approved feature spec (Ticket Brief + brainstorming output, or a Feature Design Brief).
- **Downstream:** Terminal — the spec folders are a **human-approvable handoff artifact** that a
  TDD-practicing coding agent (e.g. Claude Code via `superpowers:test-driven-development`) or human
  implementer then executes, task-by-task, each task a RED/GREEN/REFACTOR cycle.
```

- [ ] **Step 4: Edit — "Why it exists"**

Old:
```markdown
## Why it exists

The pipeline's docs are **proposal- and planning-facing** (client-recognizable POV, estimate, QA
strategy). A coding agent needs the same content **repackaged for execution**: strict EARS
requirements it can verify against, a per-feature design it can build to, and a checkbox task list
where every task cites the requirement it satisfies. This stage is that repackaging — it invents no
new scope; it **transforms** approved PRD feature blocks into Kiro-native spec folders.
```

New:
```markdown
## Why it exists

The pipeline's docs are **proposal- and planning-facing** (client-recognizable POV, estimate, QA
strategy). Execution needs the same content **repackaged for TDD**: strict EARS requirements to verify
against, a per-feature design to build to, and a task list where every task is a RED/GREEN/REFACTOR
cycle citing the requirement it satisfies. This stage is that repackaging — it invents no new scope;
it **transforms** approved content (a PRD, or a single feature spec) into spec folders.
```

- [ ] **Step 5: Edit — "Self-contained by design"**

Old:
```markdown
## Self-contained by design

This is a **self-contained stage** (per the design decision): it reads the **PRD (+ BRD)** only and
generates all three files itself. It does **not** depend on the Technical Design (04) or Sprint Mapper
stages, and does not consume their output. Where a Technical Design package exists, a human can paste
it as optional context (Input C) to enrich `design.md`, but it is never required.
```

New:
```markdown
## Self-contained by design

This is a **self-contained stage** (per the design decision): it reads the **PRD (+ BRD)** — or a
single feature spec, when no PRD exists — and generates all three files itself. It does **not** depend
on the Technical Design (04) or Sprint Mapper stages, and does not consume their output. Where a
Technical Design package exists, a human can paste it as optional context (Input C) to enrich
`design.md`, but it is never required.
```

- [ ] **Step 6: Edit — mapping table**

Old:
```markdown
## PRD → Kiro spec mapping (the transform)

| Kiro spec artifact | Sourced from PRD v6 | Transform applied |
|---|---|---|
| `requirements.md` → **User Story** | §6 `Primary persona & user need (JTBD)` + POV layer | Rephrased to `As a … I want … so that …` |
| `requirements.md` → **Acceptance Criteria (EARS)** | §6 Technical Behavior `Given/When/Then` + Edge cases (≥2) | Converted to EARS (`WHEN … THE SYSTEM SHALL …`, `IF … THEN …`, `WHILE …`, `WHERE …`) |
| `design.md` → Architecture / Components / Data Models | §6 Proposed Behaviour (technical approach), §9 entities + integrations | Scoped to the single feature |
| `design.md` → Sequence / data-flow diagram | §6 approach for **Med/High** complexity features only | D2 per the repo's locked diagram standard; Low-complexity features get none |
| `design.md` → Error handling | §6 Edge cases | Mapped to handling behavior |
| `tasks.md` → tasks | §6 "What will be done?" work items + design components | Ordered, checkboxed, each `_Requirements: n.m_` traced |
| `specs/README.md` → task rollup | §10 Priority + §11 Release Plan + dependencies | Per-feature index + project-level ordering |
```

New:
```markdown
## PRD → spec mapping (the transform)

| Spec artifact | Sourced from PRD v7 | Transform applied |
|---|---|---|
| `requirements.md` → **User Story** | §6 `Primary persona & user need (JTBD)` + POV layer | Rephrased to `As a … I want … so that …` |
| `requirements.md` → **Acceptance Criteria (EARS)** | §6 Technical Behavior `Given/When/Then` + Edge cases (≥2) | Converted to EARS (`WHEN … THE SYSTEM SHALL …`, `IF … THEN …`, `WHILE …`, `WHERE …`) |
| `design.md` → Architecture / Components / Data Models | §6 Proposed Behaviour (technical approach), §9 entities + integrations | Scoped to the single feature |
| `design.md` → Sequence / data-flow diagram | §6 approach for **Med/High** complexity features only | D2 per the repo's locked diagram standard; Low-complexity features get none |
| `design.md` → Error handling | §6 Edge cases | Mapped to handling behavior |
| `tasks.md` → tasks | §6 "What will be done?" work items + design components | Ordered, TDD tasks — each a RED/GREEN/REFACTOR cycle, `_Requirements: n.m_` traced |
| `specs/README.md` → task rollup | §10 Priority + §11 Release Plan + dependencies | Per-feature index + project-level ordering |

With no PRD (single-feature mode), the same transform runs off the feature spec's equivalent fields
instead of §6/§9/§10 — see `spec-generator-v2.md`'s Input P-alt.
```

- [ ] **Step 7: Edit — "Key design rules"**

Old:
```markdown
## Key design rules

- **Transform, don't re-plan.** Every requirement, design point, and task traces back to a PRD element.
  New scope that isn't in the PRD is tagged `PRD GAP` and raised at a checkpoint — never invented.
- **EARS is the requirements contract.** Acceptance criteria use the five EARS patterns; each is
  atomic, testable, and numbered so `tasks.md` can cite it.
- **Task traceability is mandatory.** Every task in `tasks.md` cites the requirement number(s) it
  satisfies (`_Requirements: 2.1, 2.3_`), the Kiro convention — no orphan tasks, no uncovered requirements.
- **Proportional design depth.** Full architecture + sequence diagram for Med/High-complexity features;
  a lean design for Low-complexity CRUD-style features. Mirrors Technical Design (04) proportionality.
- **Phase-gated, human-in-the-loop.** Requirements → Design → Tasks, each approved before the next,
  matching both Kiro's approval gates and the repo's house workflow. `Quick Plan` (all phases, no gates)
  and `Single-Feature Mode` (one feature end-to-end) are supported alternatives.
```

New:
```markdown
## Key design rules

- **Transform, don't re-plan.** Every requirement, design point, and task traces back to a PRD element
  (or the feature spec, in a no-PRD run). New scope that isn't in the source is tagged `PRD GAP` and
  raised at a checkpoint — never invented.
- **EARS is the requirements contract.** Acceptance criteria use the five EARS patterns; each is
  atomic, testable, and numbered so `tasks.md` can cite it.
- **Tasks are TDD cycles.** Every task in `tasks.md` names its RED step (failing test first), GREEN
  step (minimal code), and REFACTOR step, and cites the requirement number(s) it satisfies
  (`_Requirements: 2.1, 2.3_`) — no orphan tasks, no uncovered requirements, no task without a
  concrete test named first.
- **Proportional design depth.** Full architecture + sequence diagram for Med/High-complexity features;
  a lean design for Low-complexity CRUD-style features. Mirrors Technical Design (04) proportionality.
- **Phase-gated, human-in-the-loop.** Requirements → Design → Tasks, each approved before the next.
  `Quick Plan` (all phases, no gates) and `Single-Feature Mode` (one feature end-to-end — the mode
  used for no-PRD runs) are supported alternatives.
```

- [ ] **Step 8: Edit — "Files"**

Old:
```markdown
## Files
- `current/spec-generator-v1.md` — the prompt (gated phases: Intake & Feature Inventory → Requirements
  (EARS) → Design → Tasks & Project Rollup).
- `improvements/` — WIP rewrites (promote to `current/` when validated).
- `examples/` — worked spec packages per project.
```

New:
```markdown
## Files
- `current/spec-generator-v2.md` — the prompt (gated phases: Intake & Feature Inventory → Requirements
  (EARS) → Design → Tasks & Project Rollup).
- `versions/spec-generator-v1.md` — superseded (pre-TDD checkbox tasks — kept for diffing).
- `improvements/` — WIP rewrites (promote to `current/` when validated).
- `examples/` — worked spec packages per project.
```

- [ ] **Step 9: Verify the fix**

Run: `grep -c "Kiro" src/08-spec-generator/README.md`
Expected: command reports no matches (exit code 1, no count printed)

- [ ] **Step 10: Commit**

```bash
git add src/08-spec-generator/README.md
git commit -m "$(cat <<'EOF'
docs: update spec-generator README for v2 (Kiro-independent, TDD tasks)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Update top-level `README.md`, `docs/pipeline-workflow.md`, `docs/pipeline-workflow.d2` — drop remaining "Kiro" references, re-render the diagram

**Files:**
- Modify: `README.md` (repo root)
- Modify: `docs/pipeline-workflow.md`
- Modify: `docs/pipeline-workflow.d2`
- Regenerate locally, do not commit: `docs/pipeline-workflow.png` (and the `.svg` the render script
  also writes) — `docs/pipeline-workflow.png` is listed in `.gitignore` under "generated diagram
  renders under docs/ (regenerate from the .d2/.md sources via d2)"; only the `.d2`/`.md` sources are
  tracked. The `.svg` has never been tracked either — same class of generated artifact, follow the
  same convention.

- [ ] **Step 1: Confirm the gap**

Run: `grep -rn "Kiro" README.md docs/pipeline-workflow.md docs/pipeline-workflow.d2`
Expected: four matching lines across three files — one in `README.md` (the `src/08-spec-generator/`
folder-map row), one in `docs/pipeline-workflow.md` (row 7), and two in `docs/pipeline-workflow.d2`
(the `spec` and `build_out` node labels).

- [ ] **Step 2: Edit `README.md`**

Old:
```markdown
| [`src/08-spec-generator/`](./src/08-spec-generator/) | **Spec Generator.** Approved PRD → per-feature Kiro-style spec folders (requirements.md / design.md / tasks.md) for a coding agent |
```

New:
```markdown
| [`src/08-spec-generator/`](./src/08-spec-generator/) | **Spec Generator.** Approved PRD (or a single feature spec) → per-feature TDD-ready spec folders (requirements.md / design.md / tasks.md — RED/GREEN/REFACTOR tasks) |
```

- [ ] **Step 3: Edit `docs/pipeline-workflow.md`**

Old (row 7 of the "Every stage at a glance" table):
```markdown
| 7 | **Spec Generator** *(NEW)* | Repackage the PRD into coding-agent-ready specs (Kiro format). | Per feature: `requirements.md` (EARS) + `design.md` + `tasks.md`, plus a project rollup index. | **Eng:** is EARS valid and every task traced to a requirement? | **Coding-agent execution** — Claude Code / Kiro / Cursor builds each feature from the approved spec. |
```

New:
```markdown
| 7 | **Spec Generator** *(NEW)* | Repackage the PRD (or a single feature spec) into TDD-ready specs. | Per feature: `requirements.md` (EARS) + `design.md` + `tasks.md` (RED/GREEN/REFACTOR tasks), plus a project rollup index. | **Eng:** is EARS valid and every task traced to a requirement? | **TDD implementation** — a coding agent (e.g. Claude Code via `superpowers:test-driven-development`) or human implementer builds each feature from the approved spec. |
```

- [ ] **Step 4: Edit `docs/pipeline-workflow.d2`**

Old:
```
  spec: "7 · SPEC GENERATOR\nObjective: repackage PRD into coding-agent-ready\nKiro specs (per feature)\nGenerates: requirements.md (EARS) +\ndesign.md + tasks.md + project rollup" { class: newstage }
```

New:
```
  spec: "7 · SPEC GENERATOR\nObjective: repackage PRD into TDD-ready\nspecs (per feature)\nGenerates: requirements.md (EARS) +\ndesign.md + tasks.md (RED/GREEN/REFACTOR) + project rollup" { class: newstage }
```

Old:
```
  build_out: "🤖 CODING-AGENT EXECUTION\nUsed for: Claude Code / Kiro / Cursor\nbuilds each feature from the approved spec" { class: outcome }
```

New:
```
  build_out: "🤖 TDD IMPLEMENTATION\nUsed for: a coding agent or human implementer\nbuilds each feature from the approved spec, task-by-task" { class: outcome }
```

- [ ] **Step 5: Re-render the PNG locally (not committed — verification only)**

Run:
```bash
node src/d2-diagrams/scripts/render.mjs docs/pipeline-workflow.d2 docs/pipeline-workflow.png --layout=elk
```
Expected: the script exits 0 and prints where it wrote `docs/pipeline-workflow.png` (and a matching
`.svg` alongside it, per the `d2-diagrams` skill's documented behavior). If `node_modules` is missing
under `src/d2-diagrams/`, run `npm install` inside `src/d2-diagrams/` first (do not run it from the
repo root). This confirms the `.d2` edit in Step 4 still renders cleanly — neither output file is
committed (see Step 7).

- [ ] **Step 6: Verify the fix**

Run: `grep -rn "Kiro" README.md docs/pipeline-workflow.md docs/pipeline-workflow.d2`
Expected: no output (command exits 1, nothing printed).

- [ ] **Step 7: Commit**

```bash
git add README.md docs/pipeline-workflow.md docs/pipeline-workflow.d2
git status --short docs/pipeline-workflow.png docs/pipeline-workflow.svg
git commit -m "$(cat <<'EOF'
docs: drop remaining Kiro references, re-render pipeline-workflow diagram

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

The `git status --short` on the two render outputs is a sanity check, not a stage — expect
`docs/pipeline-workflow.png` to print nothing (gitignored) and `docs/pipeline-workflow.svg` to print
`??` (untracked). Neither belongs in the commit; do not `git add` them.

---

## Task 5: Part 1 checkpoint — repo-wide verification

**Files:** none (verification only)

- [ ] **Step 1: Repo-wide Kiro grep, excluding intentional history**

Run:
```bash
grep -rIn "Kiro" --include="*.md" --include="*.json" --include="*.d2" . 2>/dev/null | grep -v node_modules
```
Expected: every matching line comes from a single file — `src/08-spec-generator/versions/spec-generator-v1.md`
(the archived, intentionally-untouched historical copy, which still has all 9 of its original "Kiro"
occurrences — that's correct, it's a frozen snapshot). Any match from a *different* file means a Task
1–4 edit was missed; go back and fix it before continuing to Task 6. (`chatbot-forge-feedback.md`, if
it still exists as an untracked file at the repo root, is unrelated pre-existing content — not a
spec-generator file — and must not be edited by this plan.)

- [ ] **Step 2: Full `make verify`**

Run: `make verify`
Expected: `VERIFY: PASS` (same output shape observed after Task 2's Step 6, now covering the full
sync + doc set).

- [ ] **Step 3: No stray uncommitted changes**

Run: `git status --short`
Expected: clean except two pre-existing/expected untracked entries — `chatbot-forge-feedback.md`
(unrelated, this plan does not touch it) and `docs/pipeline-workflow.svg` (Task 4's Step 5 render
byproduct, intentionally never committed — see Task 4's Files note). `docs/pipeline-workflow.png`
won't appear at all (gitignored). If anything else is listed, an earlier task's commit step was
missed.

No commit for this task — it's a checkpoint, not a change.

---

## Task 6: Add `delivery-agent:kickoff` skill

**Files:**
- Create: `src/delivery-agent/skills/kickoff/SKILL.md`

**Interfaces:**
- Produces: a skill whose `name` frontmatter is `kickoff` and whose body names every stage of both
  branches by exact skill-reference string (`rightshift-doc-gen:brd-generator`,
  `rightshift-doc-gen:prd-generator`, `rightshift-doc-gen:technical-design-generator`,
  `rightshift-doc-gen:spec-generator`, `ticket-intake`, `superpowers:brainstorming`,
  `feature-design-brief`, `feature-prototype`, `qa-verify-report`, `ship-with-ticket`) — Task 7's
  `plugin.json` skills array and Task 8's README both reference this skill by its folder path
  `./skills/kickoff`.

- [ ] **Step 1: Confirm the gap**

Run: `ls src/delivery-agent/skills/`
Expected: `ticket-intake feature-design-brief design-guidelines repo-knowledge-base qa-verify-report ship-with-ticket feature-prototype` — no `kickoff` entry yet.

- [ ] **Step 2: Create the skill directory and file**

Create `src/delivery-agent/skills/kickoff/SKILL.md` with exactly this content. **Note the outer fence
is 4 backticks** because the pipeline diagrams inside use nested 3-backtick fences — copy only what's
between this outer fence, not the fence markers themselves:

````markdown
---
name: kickoff
description: Entry point for delivery-agent — asks New application or Single feature, then states and hands off to the matching pipeline. Trigger on "start a new project", "build a new app", "start delivery", or automatically at the first ticket/feature request in a session with no branch chosen yet.
---

# Kickoff

The one place `delivery-agent` picks a branch before any other skill runs. Every other skill in this
plugin assumes the branch is already known; this skill is what decides it, states the matching
pipeline out loud, and hands off to the branch's first real stage — it does not execute the pipeline
itself.

## How to run

### 1. Pick the branch — ask if not already obvious

Two branches, chosen once per project/ticket, never assumed silently:

- **New application** — a new app or a substantial new surface within an existing one, needing its
  own business case, product spec, and architecture before any feature is designed or built.
- **Single feature** — one feature or ticket-sized change against an existing, already-understood
  app. No new BRD/PRD/Technical Design.

If the human's request already makes this obvious ("build me a new SaaS app for X" vs "add a filter
to the dashboard"), state which branch and confirm rather than asking from scratch — but always state
it; never silently assume the lighter branch just because no ticket was named.

### 2. New application branch

```
Repo Knowledge Base + Design Guidelines (once, if not already run)
        │
        ▼
rightshift-doc-gen:brd-generator            (optional — business case)
        │
        ▼
rightshift-doc-gen:prd-generator            (required — product spec)
        │
        ▼
rightshift-doc-gen:technical-design-generator (architecture + component inventory)
        │
        ▼
rightshift-doc-gen:spec-generator            (Phased mode, all features, Input P = the approved PRD)
        │
        ▼
Human review of the full specs/ package
        │
        ▼
per feature: feature-design-brief → [feature-prototype gate] → implement
        │
        ▼
qa-verify-report → ship-with-ticket
```

State this pipeline, confirm `Design Guidelines/design-system.md` and `manifest.yaml` exist or need
producing first (top of the diagram), then hand off to `rightshift-doc-gen:brd-generator` (if the
human wants a business case first) or straight to `rightshift-doc-gen:prd-generator`.

### 3. Single feature branch

```
ticket-intake                    (optional — may start from a direct ask instead)
        │
        ▼
superpowers:brainstorming
        │
        ▼
rightshift-doc-gen:spec-generator  (Single-Feature Mode, Input P-alt = Ticket Brief +
                                     brainstorming output — no PRD)
        │
        ▼
feature-design-brief → [feature-prototype gate] → implement
        │
        ▼
qa-verify-report → ship-with-ticket
```

State this pipeline, then hand off to `ticket-intake` (if the work starts from a ticket) or straight
to `superpowers:brainstorming` (if the human is describing the feature directly).

### 4. What doesn't change between branches

Both branches converge on the same shape from `feature-design-brief` onward — the same Prototype Gate,
the same TDD implementation off a `tasks.md` produced by `rightshift-doc-gen:spec-generator`, the same
`qa-verify-report` and `ship-with-ticket`. The branch only changes what runs *before* `spec-generator`:
a full BRD/PRD/Technical-Design process for a new application, or nothing but a Ticket Brief and a
brainstorming conversation for a single feature. Implementation is never dispatched from an ad-hoc plan
in either branch — always from `spec-generator`'s TDD-formatted `tasks.md`.

### 5. Hand off, don't orchestrate

State the chosen branch and its first stage's name out loud, then stop — don't invoke the next skill
silently and don't try to run the whole pipeline from inside this one skill. Same convention every
other `delivery-agent` skill already follows.

## Inputs you need from the user

- **Required:** New application vs Single feature (Step 1) — confirm even when it looks obvious from
  the request.
- **Optional:** whether to run `brd-generator` for a new application (defaults to asking, not skipping
  silently); whether the work starts from a ticket.

## Output

No file of its own — states the chosen branch and hands off to that branch's first stage
(`rightshift-doc-gen:brd-generator` / `:prd-generator`, or `ticket-intake` / `superpowers:brainstorming`).
````

- [ ] **Step 3: Verify structure**

Run: `test -f src/delivery-agent/skills/kickoff/SKILL.md && head -3 src/delivery-agent/skills/kickoff/SKILL.md`
Expected:
```
---
name: kickoff
description: Entry point for delivery-agent — asks New application or Single feature, then states and hands off to the matching pipeline. Trigger on "start a new project", "build a new app", "start delivery", or automatically at the first ticket/feature request in a session with no branch chosen yet.
```

- [ ] **Step 4: Commit**

```bash
git add src/delivery-agent/skills/kickoff/SKILL.md
git commit -m "$(cat <<'EOF'
feat: add delivery-agent kickoff skill — branch router

New application (full BRD/PRD/Technical-Design/spec-generator process,
reviewed, then per-feature design+prototype+implement) vs Single feature
(ticket + brainstorming + spec-generator Single-Feature Mode, then the
same per-feature design+prototype+implement). States the branch and hands
off to its first stage rather than executing the pipeline itself, same
convention every other delivery-agent skill follows.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Wire `kickoff` + `rightshift-doc-gen` dependency into `plugin.json` and the marketplace manifest

**Files:**
- Modify: `src/delivery-agent/.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Confirm the gap**

Run: `cat src/delivery-agent/.claude-plugin/plugin.json`
Expected: `"version": "0.4.0"`, `"dependencies": ["superpowers"]`, and a `"skills"` array with no
`"./skills/kickoff"` entry.

- [ ] **Step 2: Edit `src/delivery-agent/.claude-plugin/plugin.json`**

Replace the entire file's content with:

```json
{
  "name": "delivery-agent",
  "version": "0.5.0",
  "description": "Branched delivery pipeline: New application (BRD/PRD/Technical-Design/spec-generator, full review) or Single feature (ticket + brainstorming + spec-generator Single-Feature Mode) — both converging on design-briefed, prototype-approved, TDD-implemented features, QA-verified via Playwright, then shipped as a PR linked back to the ticket.",
  "author": { "name": "RightShift" },
  "license": "MIT",
  "dependencies": ["superpowers", "rightshift-doc-gen"],
  "skills": [
    "./skills/kickoff",
    "./skills/ticket-intake",
    "./skills/repo-knowledge-base",
    "./skills/design-guidelines",
    "./skills/feature-design-brief",
    "./skills/feature-prototype",
    "./skills/qa-verify-report",
    "./skills/ship-with-ticket"
  ]
}
```

- [ ] **Step 3: Edit `.claude-plugin/marketplace.json` — the `delivery-agent` entry's `description`
  field only** (it's the last element in the `plugins` array — no trailing comma after its closing
  `}` — so this edit targets just the one `"description"` line, not the surrounding object, to avoid
  any ambiguity about a trailing comma)

Old:
```json
      "description": "Ticket-to-PR pipeline: pull a ticket (Linear/Jira/Asana), index the repo (manifest.yaml + Notion/Obsidian), establish or extract its design system, hand off to superpowers for brainstorm/plan/implement (each feature design-briefed first via a Flow/Visual/Accessibility hat fan-out), QA-verify via Playwright, then ship a PR linked back to the ticket. Depends on superpowers."
```

New:
```json
      "description": "Branched delivery pipeline: New application (rightshift-doc-gen's BRD/PRD/Technical-Design/spec-generator, full review) or Single feature (ticket + brainstorming + spec-generator Single-Feature Mode) — both design-briefed (Flow/Visual/Accessibility hat fan-out), prototype-gated, and TDD-implemented per feature, QA-verified via Playwright, then shipped as a PR linked back to the ticket. Depends on superpowers and rightshift-doc-gen."
```

- [ ] **Step 4: Verify both files parse as valid JSON**

Run: `python3 -c "import json; json.load(open('src/delivery-agent/.claude-plugin/plugin.json')); json.load(open('.claude-plugin/marketplace.json')); print('OK')"`
Expected: `OK`

- [ ] **Step 5: Verify the dependency and skill entry landed**

Run: `python3 -c "import json; d=json.load(open('src/delivery-agent/.claude-plugin/plugin.json')); assert 'rightshift-doc-gen' in d['dependencies']; assert './skills/kickoff' in d['skills']; print('OK')"`
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add src/delivery-agent/.claude-plugin/plugin.json .claude-plugin/marketplace.json
git commit -m "$(cat <<'EOF'
feat: delivery-agent depends on rightshift-doc-gen, add kickoff skill entry

Bumps delivery-agent to 0.5.0 (existing per-feature-commit convention).
Skills invoked from the New application branch (brd-generator,
prd-generator, technical-design-generator, spec-generator) are called by
qualified name (rightshift-doc-gen:<skill>) rather than reimplemented.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Rewrite `src/delivery-agent/README.md` — two-branch pipeline

**Files:**
- Modify: `src/delivery-agent/README.md`

- [ ] **Step 1: Confirm the gap**

Run: `grep -c "^## Pipeline$" src/delivery-agent/README.md`
Expected: `1` (the old single-branch `## Pipeline` heading, about to be replaced by `## Branches`
with two sub-sections)

- [ ] **Step 2: Replace the entire file**

Write `src/delivery-agent/README.md` with exactly this content. **Note the outer fence is 4
backticks** because the Install command and the branch diagrams inside use nested 3-backtick fences —
copy only what's between this outer fence, not the fence markers themselves:

````markdown
# delivery-agent

Claude Code plugin. Takes a project or ticket from idea to a shipped, linked-back Pull Request, via
two branches: a full **New application** process, or a lighter **Single feature** process.

## Install

```
/plugin marketplace add IntuitioLabsLLC/rightshift-managed-agents
/plugin install delivery-agent@rightshift
```

Installing pulls in `superpowers` and `rightshift-doc-gen` automatically (declared as plugin
dependencies) — this plugin defers the middle of both pipelines to them rather than reimplementing
either.

## Branches

`delivery-agent:kickoff` is the entry point — it asks **New application** or **Single feature** once
per project/ticket, states the matching pipeline, and hands off to its first stage. Both branches
converge from `feature-design-brief` onward: the same Prototype Gate, the same TDD implementation off
a `spec-generator`-produced `tasks.md`, the same QA Verify and Ship. They only differ in what runs
*before* `spec-generator` runs.

### New application

```
Repo KB              ┐
Design Guidelines     ├─▶ Kickoff ─▶ BRD (optional) ─▶ PRD ─▶ Technical Design ─▶ Spec Generator ─▶ [Review] ─▶ per feature: Feature Design Brief ─▶ [Prototype Gate] ─▶ Implement ─▶ QA Verify ─▶ Ship
(run once per repo)  ┘
```

| Stage | Owner | What happens |
|---|---|---|
| Repo Knowledge Base | `delivery-agent:repo-knowledge-base` | Run once per repo. Indexes the repo into `manifest.yaml`, optionally writing to Notion and/or an Obsidian vault. |
| Design Guidelines | `delivery-agent:design-guidelines` | Run once per repo. Defines or extracts `Design Guidelines/design-system.md`. |
| Kickoff | `delivery-agent:kickoff` | Confirms this is the New application branch, states the pipeline, hands off to BRD or straight to PRD. |
| BRD *(optional)* | `rightshift-doc-gen:brd-generator` | Business case — exec summary, objectives & metrics, product narrative, scope map, risks. Skip straight to PRD if there's no separate business case to write. |
| PRD | `rightshift-doc-gen:prd-generator` | Turns the BRD (if produced) or the raw ask into a dual-layer product spec — feature blocks with Given/When/Then acceptance criteria, data model, technical complexity. |
| Technical Design | `rightshift-doc-gen:technical-design-generator` | System architecture, integration topology, and a Component/Build Inventory off the approved PRD. |
| Spec Generator | `rightshift-doc-gen:spec-generator` | Phased mode, all in-scope PRD features: per-feature `requirements.md` (EARS) + `design.md` + `tasks.md` (TDD — RED/GREEN/REFACTOR per task), plus a project rollup index. |
| **Review** | Human | Reviews the full `specs/` package before any feature enters design or implementation. |
| Feature Design Brief | `delivery-agent:feature-design-brief` | Per feature. Fans out three subagent "hats" — Flow, Visual-Design, Accessibility & IA — and synthesizes `Feature Designs/<slug>.md`. |
| **Prototype Gate** | `delivery-agent:feature-prototype` | **Hard gate.** Clickable local prototype, explicit human accept/reject verdict, before implementation. |
| Implement | `superpowers:subagent-driven-development`, `superpowers:test-driven-development` | Task-by-task off that feature's `tasks.md` — every task a RED/GREEN/REFACTOR cycle. |
| QA Verify | `delivery-agent:qa-verify-report` | Drives a running app via Playwright MCP against `tasks.md`'s/`requirements.md`'s acceptance criteria. |
| Ship | `delivery-agent:ship-with-ticket` | Pushes and opens a PR (human-confirmed), linked back to the originating ticket if one exists. |

### Single feature

```
Kickoff ─▶ Ticket Intake (optional) ─▶ Brainstorm ─▶ Spec Generator (Single-Feature Mode) ─▶ Feature Design Brief ─▶ [Prototype Gate] ─▶ Implement ─▶ QA Verify ─▶ Ship
```

| Stage | Owner | What happens |
|---|---|---|
| Kickoff | `delivery-agent:kickoff` | Confirms this is the Single feature branch, states the pipeline, hands off to Ticket Intake or straight to brainstorming. |
| Ticket Intake *(optional)* | `delivery-agent:ticket-intake` | Reads one ticket via a ticketing MCP — Linear, Jira, or Asana — and writes `Ticket Briefs/<ID>.md`. Skip if the human is describing the feature directly instead of working a ticket. |
| Brainstorm | `superpowers:brainstorming` | Socratic discussion turns the Ticket Brief (or the direct ask) into an approved design doc for the one feature. |
| Spec Generator | `rightshift-doc-gen:spec-generator` | **Single-Feature Mode**, Input P-alt (Ticket Brief + brainstorming output — no PRD): `requirements.md` (EARS) + `design.md` + `tasks.md` (TDD) for the one feature. |
| Feature Design Brief | `delivery-agent:feature-design-brief` | Same as the New application branch — Flow/Visual-Design/Accessibility & IA hats, synthesized brief. |
| **Prototype Gate** | `delivery-agent:feature-prototype` | Same hard gate — no implementation without an explicit accept. |
| Implement | `superpowers:subagent-driven-development`, `superpowers:test-driven-development` | Task-by-task off `tasks.md` — same TDD discipline as the New application branch. |
| QA Verify | `delivery-agent:qa-verify-report` | Same mechanics, off this feature's `requirements.md`/ticket acceptance criteria. |
| Ship | `delivery-agent:ship-with-ticket` | Same — PR linked back to the ticket, if one exists. |

## Ticketing adapters

| System | Status |
|---|---|
| Linear | Full adapter — default suggestion at the Ticket Intake gate |
| Jira (Atlassian Rovo MCP) | Full adapter |
| Asana | Full adapter |

`ticket-intake` always asks which system rather than assuming, even when defaulting to Linear. See
its `SKILL.md` for each system's MCP connection instructions.

## Why depend on superpowers and rightshift-doc-gen instead of reimplementing

`superpowers` (`obra/superpowers`, MIT, listed in this repo's marketplace) already implements a
human-gated brainstorm → plan → TDD-implement → finish-branch workflow. `rightshift-doc-gen` (this
marketplace's own doc-gen chain) already implements a human-gated BRD → PRD → Technical Design →
spec-generator workflow. Duplicating either here would drift from upstream improvements and give the
user two slightly different versions of the same conversation. This plugin only builds what neither
already covers: a branch decision (`kickoff`), repo/ticket context in, design-briefing and
prototype-gating each feature, and shipping back out.
````

- [ ] **Step 3: Verify**

Run: `grep -c "^## Branches$" src/delivery-agent/README.md && grep -c "delivery-agent:kickoff" src/delivery-agent/README.md`
Expected: `1` then a count ≥ 2 (referenced in both the intro and at least one branch section)

- [ ] **Step 4: Commit**

```bash
git add src/delivery-agent/README.md
git commit -m "$(cat <<'EOF'
docs: rewrite delivery-agent README for the New application / Single
feature branches

Replaces the single linear pipeline table with two branch diagrams +
tables, and extends the closing rationale section to cover the new
rightshift-doc-gen dependency alongside superpowers.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Regenerate the root `delivery-agent/` plugin dir, final verification

**Files:**
- Modify (generated by `make sync`): `delivery-agent/` (repo-root copy of `src/delivery-agent/`)

- [ ] **Step 1: Confirm the gap — root copy is stale**

Run: `diff -rq src/delivery-agent delivery-agent 2>&1 | grep -v node_modules`
Expected: differences reported for `skills/kickoff` (missing from `delivery-agent/`), `.claude-plugin/plugin.json`, and `README.md` — confirming the root copy hasn't picked up Tasks 6–8 yet.

- [ ] **Step 2: Run `make sync`**

Run: `make sync`
Expected: output ends with `>> sync complete`, no `FORCE=1` guard error.

- [ ] **Step 3: Verify the root copy now matches**

Run: `diff -rq src/delivery-agent delivery-agent 2>&1 | grep -v node_modules`
Expected: no output (root `delivery-agent/` now mirrors `src/delivery-agent/` exactly, including the
new `skills/kickoff/` folder).

- [ ] **Step 4: Full `make verify`**

Run: `make verify`
Expected: `VERIFY: PASS`.

- [ ] **Step 5: Final repo-wide Kiro check**

Run:
```bash
grep -rIn "Kiro" --include="*.md" --include="*.json" --include="*.d2" . 2>/dev/null | grep -v node_modules
```
Expected: every matching line still comes from just `src/08-spec-generator/versions/spec-generator-v1.md`
(same as Task 5's checkpoint — nothing regressed).

- [ ] **Step 6: Confirm working tree is clean**

Run: `git status --short`
Expected: same two expected untracked entries as Task 5's Step 3 (`chatbot-forge-feedback.md`,
`docs/pipeline-workflow.svg`) — nothing else.

- [ ] **Step 7: Commit**

```bash
git add delivery-agent
git commit -m "$(cat <<'EOF'
chore: sync delivery-agent — kickoff skill, plugin.json, README

Regenerates the repo-root delivery-agent/ plugin dir from src/delivery-agent/
via make sync (Tasks 6-8: kickoff skill, rightshift-doc-gen dependency,
two-branch README).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Post-plan summary

After Task 9, both parts of the design are live:

- **Part 1 (spec-generator v2):** no "Kiro" reference anywhere except the intentionally-archived
  `versions/spec-generator-v1.md`; `tasks.md` is TDD-driven (RED/GREEN/REFACTOR per task); a no-PRD
  Input P-alt path exists for single-feature use.
- **Part 2 (delivery-agent branching):** a `kickoff` skill routes New application vs Single feature;
  `delivery-agent` depends on `rightshift-doc-gen` and calls its skills by qualified name; both
  branches converge on TDD implementation off a `spec-generator`-produced `tasks.md`.

No manual follow-up is required — every file this plan touches is committed by the task that changes
it, and Task 9's checks confirm the generated copies and repo-wide grep are clean.
