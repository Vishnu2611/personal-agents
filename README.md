# RS Layer3 — Document Generation Prompts (Local Working Copy)

Local workspace for navigating and **improving the BRD, PRD, and Estimation prompts** that
live in the Notion **RS Layer3-(Skills) Master Prompt Repository**. Everything here is a
working copy pulled from Notion so Claude Code and the team can read, diff, and rewrite the
prompts offline, then push improvements back.

> Source of truth: Notion → **RS Layer3-(Skills) Master Prompt Repository**
> (database `320b19fd-bedb-8005-bb35-e9bba401e95d`).
> This repo is a mirror + workshop. When a prompt is improved here, sync it back to Notion.

## Why this exists

We generate the same documents for every incoming project: a **BRD**, then a **PRD**, then an
**Estimation**. Those documents are only as good as the prompts that produce them. This project
gives us a clean, versioned, navigable home for those three prompt families so we can:

- Read every version of each prompt side by side.
- Spot weaknesses and drift between versions.
- Draft improvements in isolation (`improvements/`) before promoting to `current/`.
- Produce well-defined, consistent documents for all upcoming projects.

## The pipeline these prompts serve

```
Opportunity Packet → BRD Generator → PRD Generator → Technical Design → Estimation Agent → Feature POV
   (discovery)        (business)       (product)       (architecture)     (effort/scope)     (proposal)
                                              │
                                              └──→ Test Planner → Test Case Generator → Test Executor
                                                     (QA strategy)   (step-by-step test        (live execution
                                                                      cases + Gherkin)           via Playwright MCP)
```

> Technical Design (03) is a **proposed new stage** — it turns PRD features into a buildable
> Component Inventory + architecture/workflow diagrams so the estimate is sized per component, not per
> fuzzy feature. The improvement drafts (PRD v5, Estimation v2.1, Technical Design v1) are wired to
> work together; `current/` prompts remain the live versions.
>
> Test Planner (05), Test Case Generator (06), and Test Executor (07) are a **parallel QA track**
> branching off the same approved PRD — neither gates Technical Design or Estimation. Test Planner
> produces a risk-based Test Strategy & Plan + Test Coverage Matrix; Test Case Generator expands each
> scenario into executable test cases plus Gherkin/BDD for anything automatable; Test Executor then
> runs a selected test case (or a scenario's/epic's/priority tier's worth) against a real running
> application via Playwright MCP and records actual Pass/Fail/Blocked verdicts. The first two accept
> either the full upstream document or a single feature/scenario scoped down to just that; Test
> Executor is the first stage in this chain that requires live browser tool access rather than a
> copy-paste chat prompt.

See [docs/PIPELINE.md](./docs/PIPELINE.md) for the full chain, inputs/outputs, and hand-off contracts.

## Plugins

Twelve job-named plugins, all prefixed `rs-`, ship from one marketplace (`rightshift`). The middle
column is what a skill router matches against: when to reach for the plugin, and what it is not for.

| Plugin | Reach for it when | Skills |
|---|---|---|
| `rs-research` | Understand a market, prospect company or competitor before anything is scoped; sharpen discovery questions; turn a vague client complaint into a sharp problem statement. Ends where client-facing documents begin. | `company-research`, `competitive-and-market-research`, `customer-discovery-question-optimizer`, `market-analyzer`, `problem-statement-analyzer` |
| `rs-scoping` | Client notes, transcripts or emails to opportunity packet, BRD, PRD, technical design and a man-day estimate priced against the rate card. The chain that ends in a number. Not for presenting or selling it. | `brd-generator`, `estimation-generator`, `feature-pov-narrative`, `google-estimation-sheet-extractor`, `opportunity-packet`, `prd-generator`, `technical-design-generator` |
| `rs-sales` | Win scoped work: proposal and platform decks, startup pitch decks, contracts, outbound campaigns, and review of client-facing material before it goes out. Not for producing the scope. | `contract-creator`, `executive-summary-evaluator`, `gamma-prototype-proposal-deck`, `pitch-deck-analyzer`, `startup-pitch-deck-generator` |
| `rs-content` | Write what is published under the RightShift name: LinkedIn posts, case studies, traction pieces, speaking-engagement campaigns, one-pagers, editorial and client-communication QA, and the voice guide they follow. Not for client deliverables. | `case-study-and-testimonial-generator`, `cross-page-editorial-consistency-audit`, `deep-voice-guide`, `rightshift-traction`, `speaking-engagement` |
| `rs-design` | Interface and visual design (SaaS UI in Figma, design reference to CSS spec) and evaluating a page, site or Figma file against its brief. Also brand identity. Not for building it in code. | `design-reference-to-css-spec`, `figma-page-review-vs-brief`, `page-design-evaluation-generic`, `rightshift-identity`, `rightshift-site-design-evaluation`, `saas-uiux-designer-figma` |
| `rs-prototype` | Something running or clickable fast: HTML or Next.js prototypes, Spark or Propel engagements, and deciding which prototype features become the MVP. Not for production delivery. | `html-prototype-generator`, `nextjs-prototype-generator`, `prototype-feature-audit-and-ideation`, `prototype-to-mvp-feature-generation`, `rightshift-feature-generator`, `rightshift-propel`, `rightshift-spark` |
| `rs-delivery` | Ship an approved PRD: per-feature specs a coding agent can execute, then design-briefed, prototype-gated, TDD-implemented, QA-verified features shipped as a PR linked to the ticket. Not for prototypes or deciding what to build. | `design-guidelines`, `feature-design-brief`, `feature-prototype`, `kickoff`, `qa-verify-report`, `repo-knowledge-base`, `ship-with-ticket`, `spec-generator`, `ticket-intake` |
| `rs-qa` | Risk-based test strategy and coverage matrix, executable Gherkin test cases, and Playwright runs against a live application with real verdicts. Not for code review. | `qa-test-planner`, `test-case-generator`, `test-executor`, `test-planner` |
| `rs-project-management` | Run sold work: map a PRD into Linear sprints and tickets. Not for deciding what to build or writing code. | `prd-to-linear-sprint-mapper` |
| `rs-product` | Training course that teaches team leads to turn a client's stated want into a spec a designer and engineer can build from. Training, not production. | `product-thinking-course` |
| `rs-chatbot` | Build a knowledge-grounded chatbot for a client or internally, define its personality rulebook, and specify how it behaves and falls back when it does not know. | `chatbot-behaviour-and-fallback`, `chatbot-forge`, `chatbot-personality-rulebook` |
| `rs-common` | Shared utilities other rs-* plugins lean on: D2 diagram rendering and the document formatting standard. Install alongside anything else. | `d2-diagrams`, `document-formatting-standard` |
| `rs-guard` | Enforced delivery gates as hooks: blocks dangerous git and PRs without commit-bound receipts, checks required tools at session start. No dependencies, so the gates stay on. Installed with `rs-delivery`. | none (hooks only) |

Prompt stubs and idea-stage entries that are not yet skills (no prompt body to wrap) are listed in each
plugin's `src/plugins/<plugin>/prompts/PENDING.md`: `rs-sales` (2), `rs-content` (3) and `rs-project-management` (1).

### Install

```
/plugin marketplace add IntuitioLabsLLC/rightshift-managed-agents
/plugin install rs-content@rightshift
```

The repo is private and marketplace access is repo access, so sort GitHub access first. Installing
`rs-common` alongside anything else is recommended. Existing users of `rightshift-doc-gen`,
`chatbot-forge` or `delivery-agent` should read [Migrating from the old plugins](./docs/DEPLOYMENT.md#migrating-from-the-old-plugins).
Updating a skill, releasing, and how updates reach people are in
[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md#updating-a-skill).

## Folder map

Plugins are authored under [`src/plugins/`](./src/plugins/) and generated into [`plugins/`](./plugins/)
by `make sync`. Edit under `src/plugins/`, never in `plugins/`.

| Folder | What's inside |
|---|---|
| [`plugins/`](./plugins/) | **Deployable Claude plugins** — one folder per `rs-*` plugin (`.claude-plugin/plugin.json` + `skills/<skill>/SKILL.md` + resources). **Generated from `src/plugins/` — do not hand-edit.** |
| [`src/plugins/<plugin>/`](./src/plugins/) | **Source of truth** for each plugin: `.claude-plugin/plugin.json`, `skills/`, `prompts/` (versioned prompt sources), `sync.json` |
| [`src/plugins/rs-scoping/prompts/`](./src/plugins/rs-scoping/prompts/) | The numbered doc-gen prompts — `01-brd-generator`, `02-prd-generator`, `03-technical-design`, `04-estimation-agent` — plus the upstream/downstream prompts (opportunity packet, sheet extractor, feature POV; see `SUPPORTING.md`) |
| [`src/plugins/rs-qa/prompts/`](./src/plugins/rs-qa/prompts/) | The QA track — `05-test-planner`, `06-test-case-generator`, `07-test-executor` |
| [`src/plugins/rs-delivery/`](./src/plugins/rs-delivery/) | Ticket-to-PR delivery skills, including `spec-generator` (see its `README.md`) |
| [`src/standards/`](./src/standards/) | **Shared output standards** the prompts enforce — e.g. the Document Formatting Standard (synced into `rs-common`) |
| [`src/orchestrator/`](./src/orchestrator/) | Runs the skills as **one pipeline** — Agent SDK runner + Managed Agents provisioning + `pipeline.yaml` |
| [`src/tools/`](./src/tools/) | `sync_plugins.py` + `verify_plugins.py` — driven by `make sync` / `make verify` |
| [`src/_meta/`](./src/_meta/) | Catalog of the whole skill repo + Notion source IDs |
| [`src/_workspace/`](./src/_workspace/) | Scratch space — analysis notes, diffs, experiments |
| [`docs/`](./docs/) | Long-form docs — [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) (deploy, update and release flow) · [`SOP.md`](./docs/SOP.md) (distribution/versioning SOP) · [`PIPELINE.md`](./docs/PIPELINE.md) (pipeline hand-off contracts) · workflow diagrams |
| [`.claude-plugin/`](./.claude-plugin/) | Claude Code **marketplace** manifest (`marketplace.json`, one entry per plugin). The repo root is not a plugin |
| [`bin/`](./bin/) | `install.js` — the npm package's installer (`npx rightshift-skills` copies skills into `.claude/skills/`) |
| [`Makefile`](./Makefile) | One-command artifact generation (`make sync` / `dist` / `install-claude-code` / `verify` / `test` / `provision` / `run-*`) |

> The `01`–`04` prompt folders in `rs-scoping` are the **active improvement focus**. Each plugin's
> `prompts/` folder holds the versioned sources for its skills.

Each prompt folder follows the same convention:

```
NN-<prompt>/
├── README.md        # status, Notion source, version history, known issues, improvement ideas
├── current/         # the latest live version (the one in production)
├── versions/        # older / parallel versions kept for diffing
└── improvements/    # work-in-progress rewrites — promote to current/ when ready
```

## Working rhythm

1. **Read** the `current/` prompt and its `README.md` (status + known issues).
2. **Diff** against `versions/` to understand what changed and why.
3. **Draft** a candidate in `improvements/` (never edit `current/` in place).
4. **Test** the candidate against a real Opportunity Packet → BRD → PRD → Estimation run.
5. **Promote** the winner to `current/` and **sync back to Notion**, bumping the version.

## Status snapshot (from Notion, as of 2026-06-29)

| Prompt | Latest version | Status |
|---|---|---|
| BRD Generator | v2 | In Testing |
| PRD Generator | v4 | In Testing |
| Estimation (Generation From PRD / Agent) | v1.6 | In progress |
