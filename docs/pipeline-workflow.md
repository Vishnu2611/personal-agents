# Pipeline Workflow — what pans in and out of each stage

A single-glance view of the document-generation pipeline: for **every stage**, its *objective*, *what it
generates*, *how it is reviewed*, and *what that output is then used for*. The diagram shows the flow and
the human review gates; the table carries the full per-stage detail.

> Source: [`pipeline-workflow.d2`](./pipeline-workflow.d2) · Render: `d2 --layout elk pipeline-workflow.d2 pipeline-workflow.png`
> Companion to [`PIPELINE.md`](./PIPELINE.md) (hand-off contracts) and [`README.md`](../README.md) (folder map).

![Pipeline workflow](./pipeline-workflow.png)

## How to read it

- **Blue box** = a generator stage. **Purple box** = the new stage 7. **Diamond** = a human review gate.
  **Green box** = a terminal output and who/what consumes it.
- **Edge labels** state *what the artifact is used for* as it passes to the next stage (the "pan-out").
- **Dashed containers** = the three tracks that branch off the **approved PRD** and run independently:
  a **Build & commercial** track, a **Quality** track (parallel — it does not gate the build), and the
  new **Implementation** track.
- The numbers (`1 · BRD`, `3 · Estimation`, `4 · Technical Design`, …) are the **folder IDs**
  (`01-…`, `03-…`, `04-…`), not the run order. The **arrows** show the true run order — note Technical
  Design (folder 04) runs *before* Estimation (folder 03).

## Every stage at a glance

| # | Stage | Objective (what it's for) | Generates (artifact) | How it's reviewed (gate) | Output used for (purpose) |
|---|---|---|---|---|---|
| — | **Opportunity Packet** | Capture discovery. | Problem, ask, timeline, budget signals, gaps. | — (discovery input) | Feeds the BRD. |
| 1 | **BRD Generator** *(optional upstream of PRD)* | Frame the business problem at business altitude. | BRD — exec summary, objectives & metrics, product narrative, scope map, risks. | **Business owner:** is scope, objective, and product map right? | If produced and approved, becomes the **scope contract** for the PRD (BRD Mode). If skipped, the PRD runs straight off the Opportunity Packet (Packet Mode). |
| 2 | **PRD Generator** | Turn scope (BRD if approved, else the Opportunity Packet) into a dual-layer product spec. | PRD — feature blocks (POV + Given/When/Then acceptance criteria + edge cases), §9 data model, §10 estimation breakdown + complexity. | **Product + eng:** coverage matrix 100%? complexity and acceptance criteria sound? | Feeds **three parallel tracks** (build, quality, implementation). |
| 4 | **Technical Design** | Make hidden work countable. | System architecture + integration topology + Component / Build Inventory + sequence diagrams (High-complexity features). | **Eng lead:** is every buildable component surfaced and sizing-ready? | Component inventory → Estimation sizes per component. |
| 3 | **Estimation Agent** | Size effort per component. | Filled estimation workbook + execution plan + two-tier estimate (estimable-now vs spike). | **Delivery lead:** are estimates and spike flags defensible? | Feature/estimate list → Feature POV → client proposal. |
| — | **Feature POV → Proposal** | Turn the estimate into client-facing narrative. | User-POV narrative per feature. | — (terminal) | **Client-facing proposal** (Gamma). |
| 5 | **Test Planner** | Risk-based QA strategy off the same PRD. | Test Strategy & Plan + Test Coverage Matrix (one row per scenario, traced to acceptance criteria). | **QA lead:** does coverage match the PRD's risk and complexity? | Coverage matrix → Test Case Generator. |
| 6 | **Test Case Generator** | Make scenarios executable. | Concrete test cases (steps · data · expected) + Gherkin for automatable ones. | **QA:** are cases faithful to scenarios? (else `DECISION NEEDED`) | **QA execution** — manual + automated runs / test-mgmt import. |
| 7 | **Spec Generator** *(NEW)* | Repackage the PRD (or a single feature spec) into TDD-ready specs. | Per feature: `requirements.md` (EARS) + `design.md` + `tasks.md` (RED → GREEN tasks at agreed test seams), plus a project rollup index. | **Eng:** is EARS valid and every task traced to a requirement? | **TDD implementation** — a coding agent (e.g. Claude Code via `mattpocock-skills:tdd`, started with `/implement` or `/implement-spec`) or human implementer builds each feature from the approved spec. |

## The one rule the gates encode

Every arrow between stages crosses a **human approval gate**. Nothing flows downstream on the model's word
alone — a person confirms the artifact is right *for its specific consumer* before the next stage depends on
it. That is what keeps an error in one stage from silently compounding through the rest of the chain.
