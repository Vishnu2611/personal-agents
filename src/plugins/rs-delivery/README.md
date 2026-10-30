# rs-delivery

Claude Code plugin. Takes a project or ticket from idea to a shipped, linked-back Pull Request, via
two branches: a full **New application** process, or a lighter **Single feature** process.

## Install

```
/plugin marketplace add IntuitioLabsLLC/rightshift-managed-agents
/plugin install rs-delivery@rightshift
```

Installing pulls in `mattpocock-skills`, `rs-scoping` and `rs-guard` automatically (declared as plugin
dependencies) — this plugin defers the middle of both pipelines to them rather than reimplementing
either.

## Branches

`rs-delivery:kickoff` is the entry point — it asks **New application** or **Single feature** once
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
| Repo Knowledge Base | `rs-delivery:repo-knowledge-base` | Run once per repo. Indexes the repo into `manifest.yaml`, optionally writing to Notion and/or an Obsidian vault. |
| Design Guidelines | `rs-delivery:design-guidelines` | Run once per repo. Defines or extracts `Design Guidelines/design-system.md`. |
| Kickoff | `rs-delivery:kickoff` | Confirms this is the New application branch, states the pipeline, hands off to BRD or straight to PRD. |
| BRD *(optional)* | `rs-scoping:brd-generator` | Business case — exec summary, objectives & metrics, product narrative, scope map, risks. Skip straight to PRD if there's no separate business case to write. |
| PRD | `rs-scoping:prd-generator` | Turns the BRD (if produced) or the raw ask into a dual-layer product spec — feature blocks with Given/When/Then acceptance criteria, data model, technical complexity. |
| Technical Design | `rs-scoping:technical-design-generator` | System architecture, integration topology, and a Component/Build Inventory off the approved PRD. |
| Spec Generator | `rs-delivery:spec-generator` | Phased mode, all in-scope PRD features: per-feature `requirements.md` (EARS) + `design.md` + `tasks.md` (TDD — RED → GREEN per task, at test seams agreed in `design.md`), plus a project rollup index. |
| **Review** | Human | Reviews the full `specs/` package before any feature enters design or implementation. |
| Feature Design Brief | `rs-delivery:feature-design-brief` | Per feature. Fans out three subagent "hats" — Flow, Visual-Design, Accessibility & IA — and synthesizes `Feature Designs/<slug>.md`. |
| **Prototype Gate** | `rs-delivery:feature-prototype` | **Hard gate.** Clickable local prototype, explicit human accept/reject verdict, before implementation. |
| Implement | `/implement` or `/to-tickets` + `/implement-spec` (`mattpocock-skills`, human-typed), `mattpocock-skills:tdd` | One slice: `/implement specs/<slug>/` works through `tasks.md`. Several slices: `/to-tickets` groups the tasks into tracker tickets with blocking links, `/implement-spec` builds them in parallel on one integration branch with a draft PR. Every task RED → GREEN at an agreed seam; clean-up happens at code review. |
| QA Verify | `rs-delivery:qa-verify-report` | Drives a running app via Playwright MCP against `tasks.md`'s/`requirements.md`'s acceptance criteria. |
| Review | Matt `code-review` (automatic at the end of `/implement`), gstack `/review` (human-typed) | Matt: Standards + Spec, reported separately. gstack: bugs, security and the gate-integrity scan (did a change weaken a test, CI or lint check?), fixes mechanical issues itself. Runs **after** QA is recorded and before the verify receipt; `rs-guard` blocks the PR until gstack's verdict on the current code is `CURRENT`. |
| Ship | gstack `/ship --no-pr` (human-typed), then `rs-delivery:ship-with-ticket` | `/ship --no-pr` runs **before QA**: merges the base branch, tests, reviews and fixes, bumps `VERSION`/`CHANGELOG` only where they exist, pushes. After QA, the final `/review` and the verify receipt, `ship-with-ticket` opens the PR (Matt's `pr` body, human-confirmed) linked to the ticket and posts the link back. |

### Single feature

```
Kickoff ─▶ Ticket Intake (optional) ─▶ /grill-with-docs ─▶ /to-spec ─▶ Spec Generator (Single-Feature Mode) ─▶ Feature Design Brief ─▶ [Prototype Gate] ─▶ Implement ─▶ QA Verify ─▶ Ship
```

| Stage | Owner | What happens |
|---|---|---|
| Kickoff | `rs-delivery:kickoff` | Confirms this is the Single feature branch, states the pipeline, hands off to Ticket Intake, or tells the human to type `/grill-with-docs`. |
| Ticket Intake *(optional)* | `rs-delivery:ticket-intake` | Reads one ticket via a ticketing MCP — Linear, Jira, or Asana — and writes `Ticket Briefs/<ID>.md`. Skip if the human is describing the feature directly instead of working a ticket. |
| Design interview | `/grill-with-docs` (`mattpocock-skills`, human-typed) | Rounds of numbered questions with recommended answers until the design is settled; updates `GLOSSARY.md` and, for hard-to-reverse decisions, `docs/adr/`. Only a human can start it. |
| Spec on the tracker | `/to-spec` (`mattpocock-skills`, human-typed) | Turns the interview into a spec issue on the project's tracker (configured in `docs/agents/issue-tracker.md`), labelled `ready-for-agent`. |
| Spec Generator | `rs-delivery:spec-generator` | **Single-Feature Mode**, Input P-alt (Ticket Brief + the `/to-spec` spec — no PRD): `requirements.md` (EARS) + `design.md` + `tasks.md` (TDD) for the one feature. |
| Feature Design Brief | `rs-delivery:feature-design-brief` | Same as the New application branch — Flow/Visual-Design/Accessibility & IA hats, synthesized brief. |
| **Prototype Gate** | `rs-delivery:feature-prototype` | Same hard gate — no implementation without an explicit accept. |
| Implement | `/implement`, or `/to-tickets` + `/implement-spec` | Same as the New application branch — chosen by how many slices `tasks.md` holds. |
| QA Verify | `rs-delivery:qa-verify-report` | Same mechanics, off this feature's `requirements.md`/ticket acceptance criteria. |
| Review | Matt `code-review` (automatic at the end of `/implement`), gstack `/review` (human-typed) | Matt: Standards + Spec, reported separately. gstack: bugs, security and the gate-integrity scan (did a change weaken a test, CI or lint check?), fixes mechanical issues itself. Runs **after** QA is recorded and before the verify receipt; `rs-guard` blocks the PR until gstack's verdict on the current code is `CURRENT`. |
| Ship | gstack `/ship --no-pr`, then `rs-delivery:ship-with-ticket` | Same as the New application branch. |

## Ticketing adapters

| System | Status |
|---|---|
| Linear | Full adapter — default suggestion at the Ticket Intake gate |
| Jira (Atlassian Rovo MCP) | Full adapter |
| Asana | Full adapter |

`ticket-intake` always asks which system rather than assuming, even when defaulting to Linear. See
its `SKILL.md` for each system's MCP connection instructions.

## Enforced gates

The gates this pipeline relies on (tests passed, prototype approved, QA with no failing P0, no
dangerous git) are enforced by hooks in the separate `rs-guard` plugin, which `rs-delivery` declares
as a dependency. They live apart because Claude Code turns a plugin off, hooks included, when one of
its dependencies is missing; `rs-guard` has none, so the gates stay on. `qa-verify-report` and
`feature-design-brief` write what those gates read (the QA receipt and the `ticket:` frontmatter).

## Why depend on mattpocock-skills, gstack and rs-scoping instead of reimplementing

`mattpocock-skills` (`mattpocock/skills`, MIT, pinned to v1.3.1 in this repo's marketplace) owns the
engineering method: the human-typed `/grill-with-docs` interview (with the glossary and ADRs it keeps),
`/to-spec`, `/to-tickets`, `/implement` / `/implement-spec`, `tdd`, `diagnosing-bugs`, `code-review`
and the `pr` body. gstack (`garrytan/gstack`, a required tool pinned by commit and checked by
`rs-guard`, not a plugin) owns `/ship` and the pre-landing `/review`. The `rs-scoping` plugin already
implements a human-gated BRD → PRD → Technical Design workflow. Duplicating any of them here would
drift from upstream improvements. This plugin only builds what none of them covers: a branch decision
(`kickoff`), repo/ticket context in, EARS specs with agreed test seams, design-briefing and
prototype-gating each feature, live QA, and shipping back to the ticket — with `rs-guard` enforcing
the gates in between.
