# Document Generation Pipeline

The three prompts this project improves sit in the middle of a longer chain. Understanding the
hand-off contract between each stage is essential before changing any single prompt — a change
to BRD output ripples into PRD input, which ripples into Estimation input.

## Full chain

```
┌─────────────────────┐
│ Create Opportunity  │  Inputs:  meeting transcript + email thread(s)
│ Packet              │  Output:  Opportunity Packet page (Opportunities DB)
│ (Notion Agent)      │           problem, ask, timeline, budget signals, gaps
└──────────┬──────────┘
           │  Opportunity Packet
           ▼
┌─────────────────────┐
│ BRD Generator v2    │  Inputs:  Opportunity Packet (A, required)
│ (Claude Prompt)     │           + constraints/business context (optional)
│  ★ improve me       │  Output:  Business Requirement Document
│                     │           Doc Control, Exec Summary, Business Objectives & Metrics,
│                     │           Product Narrative, Stakeholders, Scope (Product Map +
│                     │           Boundaries), Assumptions & Risks, Open Items
└──────────┬──────────┘
           │  Approved BRD (Sections 1/3/5a → Input F, OPTIONAL — enables BRD Mode)  +  Opportunity Packet
           ▼
┌─────────────────────┐
│ PRD Generator v7    │  Inputs:  Opportunity Packet (A, required) + Approved BRD (F, optional —
│ (Claude Prompt)     │           enables BRD Mode; omitted → Packet Mode) + feature list (B),
│  ★ improve me       │           constraints (C), links (D), commercial (E)
│                     │  Output:  Full PRD (Sections 0–13): Product POV Narrative,
│                     │           role-organized dual-layer feature blocks, Estimation
│                     │           Breakdown (Section 10 + Work Items count), Scope Coverage
│                     │           Matrix (Section 10b), Decision Log
└──────────┬──────────┘
           │  PRD §10 (Estimation Breakdown, incl. Technical Complexity L/M/H — v5) + §10b (Coverage Matrix)
           ▼
┌─────────────────────┐
│ Technical Design    │  Inputs:  Approved PRD v5 (§6/§9/§10), optional constraints/stack, brownfield arch
│ Generator v1 (NEW)  │  Output:  System architecture + integration topology (whole project) +
│  ☆ new stage        │           workflow/sequence/data-flow diagrams (High-complexity features only) +
│                     │           **Component / Build Inventory** (services/jobs/stores/integrations/screens)
└──────────┬──────────┘
           │  Component / Build Inventory (+ architecture & sequence diagrams)
           ▼
┌─────────────────────┐
│ Estimation Agent    │  Inputs:  Technical Design Component Inventory (preferred unit) OR PRD §10 + §10b,
│ v2.1 (Claude Prompt)│           the Estimation Template workbook, Master Context Pack, commercial overrides
│  ★ improve me       │  Output:  Filled Estimation Template (estimate + execution plan) + two-tier
│                     │           estimate (estimable-now vs spike-needed) → proposal
└──────────┬──────────┘
           │  Feature/estimate list
           ▼
┌─────────────────────┐
│ Feature POV         │  Inputs:  feature/estimate list + persona context
│ Narrative           │  Output:  user-POV narrative paragraphs per feature
└─────────────────────┘           → Gamma Platform Proposal Generation

           (parallel QA branch, off the same approved PRD — does not gate Technical Design/Estimation)
           │  Approved PRD (§4/§6/§7/§9/§10/§10b)
           ▼
┌─────────────────────┐
│ Test Planner        │  Inputs:  Approved PRD v5 (§4/§6/§7/§9/§10/§10b), optional Technical Design
│ v1 (NEW)            │           Component Inventory, constraints
│  ☆ new stage        │  Output:  Test Strategy & Plan — risk-based per-feature test plans, NFR/
│                     │           integration test plans, Test Coverage Matrix (§10 + §10b cross-check)
└──────────┬──────────┘
           │  Test Coverage Matrix (one row per test scenario, traced to PRD acceptance criteria/edge cases)
           ▼
┌─────────────────────┐
│ Test Case           │  Inputs:  Test Coverage Matrix (§10 + §10b), or one/a few scenarios directly
│ Generator v1 (NEW)  │  Output:  concrete test cases (preconditions, steps, data, expected results) +
│  ☆ new stage        │           Gherkin/BDD scenarios for Automate-now cases + traceability matrix
└──────────┬──────────┘
           │  Test Case Package (§3 test cases, §4 Gherkin, §5 traceability matrix)
           ▼
┌─────────────────────┐
│ Test Executor       │  Inputs:  Test Case Package + a Test Case ID/scenario/epic/priority
│ v1 (NEW, live       │           selection + a running target environment (Playwright MCP)
│  browser tools)     │  Output:  live execution — per-step actual results, a defect log,
│  ☆ new stage        │           an updated traceability matrix (real Pass/Fail/Blocked
└─────────────────────┘           verdicts) → bug tracker / release go-no-go
```

## Hand-off contracts (what each stage promises the next)

| Boundary | Producer guarantees | Consumer depends on |
|---|---|---|
| Packet → BRD | Clean problem/ask/timeline/budget + flagged gaps | BRD can flag where packet is thin |
| BRD → PRD *(optional)* | Approved BRD; Exec Summary + Product Narrative + Product Map | PRD Input F, if supplied — enables **BRD Mode** and **BRD wins on conflict** (tag `BRD CONFLICT`). If no BRD is supplied, PRD runs in **Packet Mode**: the Opportunity Packet is the scope authority instead (tag `PACKET CONFLICT` on a secondary-input conflict), and the PRD is flagged provisional pending BRD reconciliation |
| PRD → Technical Design | Section 10 features + `Technical Complexity` ratings + Section 9 integrations | TD knows which features to deep-design (High-complexity) |
| Technical Design → Estimation | Component / Build Inventory (per-component, with disciplines + FP block + spike flags) + diagrams | Estimation sizes per component, not per fuzzy feature |
| PRD → Estimation *(if TD skipped)* | Section 10 + Section 10b + Work Items count | Estimation falls back to per-feature sizing (lower accuracy on High-complexity rows) |
| Estimation → Feature POV | Feature/estimate list | Narrative copy per feature |
| PRD → Test Planner | Sections 4/6/7/9/10/10b (esp. `Technical Complexity` + `Technical Risk/Approach`) | Test Planner scales scenario depth per feature off the complexity rating; a PRD with thin Section 6 acceptance criteria/edge cases forces `PRD GAP` tags instead of invented scenarios |
| Test Planner → Test Case Generator | Test Coverage Matrix (§10) + cross-check (§10b) — one row per test scenario (`TS-<Epic/Feature Abbrev>-<seq>`), each traced to a PRD acceptance criterion/edge case/risk, with priority/complexity/automation-candidacy carried, plus a mandatory `API / Data validation` scenario for every Section 9 integration/mutation and, where a Figma reference was supplied, an optional §14 Design Fidelity Addendum (`DF-` entries) | Test Case Generator expands each row into concrete steps/data/expected results and Gherkin (where automatable); it inherits depth and priority rather than re-deciding them, tagging `DECISION NEEDED` if a scenario looks wrong instead of silently fixing it. `API / Data validation` scenarios get a status/schema/persisted-value case shape with a stated tolerance invariant, never a frozen exact value; each §14 `DF-` entry (if any) expands into its own §9 `DC-` Design Check case, kept out of the §5/§6 Pass/Fail traceability |
| Test Case Generator → Test Executor | Test Case Package — §3 test cases (`TC-<Abbrev>-<scenario-seq>-<case-seq>`; preconditions, steps, data, expected results) + §4 Gherkin + §5 traceability matrix + §2 test data conventions, plus an optional §9 set of `DC-` Design Check cases | Test Executor resolves a human's selection (ID/scenario/epic/priority) plus cross-case dependency order from preconditions, then executes literally against a running app via Playwright MCP; it never rewrites a step or expected result, tagging `DECISION NEEDED` if a case looks wrong or stale instead of silently fixing it. Active `API / Data validation` steps run via `browser_network_request`, checked against their stated invariant; `DC-` cases (if any) run via Figma MCP + Playwright MCP and land in a separate, informational Design Fidelity Results section that never feeds the P0 pass-rate gate |

## Key design rules already baked into the prompts

- **BRD is upstream of PRD, but optional (v7).** The BRD is business-level (no system requirements,
  architecture, API or data design). When supplied and approved, it's the scope authority: if the
  Opportunity Packet contradicts it, **the BRD wins** and the conflict is tagged `BRD CONFLICT` for a
  human to resolve. When no BRD is supplied, the PRD runs in **Packet Mode** instead — the Opportunity
  Packet itself becomes the scope authority (conflicts from a secondary input tagged `PACKET CONFLICT`)
  and the PRD is marked provisional pending BRD reconciliation, if one is produced later.
- **PRD v7 is dual-layer:** every feature carries a POV layer (user value) + Implementation Detail
  + Technical Behavior, organized by portal/role.
- **Estimation produces no client-facing totals** in some variants — no total hours, no role-hour
  breakdowns, no internal cost — those stay internal. (Confirm which variant is current; this
  differs across versions — see `03-estimation-agent/`.)
- **Test Planner is a parallel QA branch, not a pipeline gate.** It reads the same approved PRD
  Technical Design and Estimation do, but neither of those stages depends on it — it can run before,
  after, or alongside them. Its own depth is driven by PRD `Technical Complexity`, mirroring how
  Estimation's confidence tiering works off the same column.
- **Both QA-branch stages accept a scoped-down input, not just the full document.** Test Planner will
  plan from a single feature's detail (`Single-Feature Mode`) and Test Case Generator will expand a
  single scenario (`Single-Scenario Mode`) — in both, a gate that would otherwise require the full
  upstream document instead requires only a minimal shape (a name/description + a testable objective)
  and tags what's missing rather than blocking. Whole-document sections (roles, coverage cross-check,
  release plan) scope down to what was actually supplied instead of being padded or invented.
- **Test Case Generator never re-plans.** It inherits scenario priority, complexity, and automation
  candidacy from the Test Planner; if a scenario looks wrong it tags `DECISION NEEDED` and asks,
  the same discipline as BRD/PRD conflict tagging one layer up.
- **Test Executor is the first stage that requires live tool access, not a chat paste.** It drives a
  real running application through Playwright MCP, so it only works in an agentic runtime (Claude
  Code, the Agent SDK, or another MCP client). It never re-plans, invents a step, or takes an action
  beyond what a case's steps and test data conventions authorize — ambiguity is `STEP GAP`, not
  improvisation, matching the same tagging discipline as every stage above it.
- **A passing UI check is not evidence the data layer is correct.** Every feature with a PRD Section 9
  integration/mutation gets a mandatory `API / Data validation` scenario, planned by the Test Planner,
  expanded into a status/schema/persisted-value case by the Test Case Generator, and executed directly
  (no UI action) by the Test Executor via `browser_network_request` — checked against a stated
  invariant, never a frozen exact value, so generated IDs/timestamps don't produce false failures.
- **Figma design-fidelity checking is optional and deliberately decoupled**, not a fifth scenario
  `Type`. It has its own ID namespace (`DF-` at the Test Planner, `DC-` at the Test Case Generator) and
  its own verdict vocabulary (Match / Deviation Noted / Not Verifiable) precisely because visual
  fidelity needs a "close enough" tolerance that would corrupt this pipeline's otherwise-strict literal
  Pass/Fail discipline if mixed in. It never contributes to the P0 pass-rate release-gate signal.
- **Scenario/case IDs are now `TS-<Epic/Feature Abbrev>-<seq>` / `TC-<Abbrev>-<scenario-seq>-<case-seq>`**
  — the short abbreviation (e.g. `AUTH`) is assigned once per epic/feature at the Test Planner's Phase 0
  checkpoint and reused by every downstream stage, replacing the older FP-block-coded IDs. The FP Block
  itself is still tracked as a Section 10 column for cross-domain traceability — it's just no longer
  duplicated inside the ID string.

## What to verify when improving any one prompt

1. Does the change keep the **output contract** the next stage relies on? (section numbers,
   matrix presence, work-item counts)
2. Does it preserve the **conflict-resolution precedence** (BRD > Packet)?
3. Does it stay within the document's **altitude** (BRD = business, PRD = product, Estimation =
   effort)? Don't let one prompt leak into another's job.
