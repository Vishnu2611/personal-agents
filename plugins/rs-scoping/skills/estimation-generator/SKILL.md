---
name: estimation-generator
description: Fill the IntuitioLabs Estimation Template (.xlsx) from a PRD — man-day sizing, weekly FTE plan, rate-card pricing, margin guardrails. Trigger on "estimate this project" or "fill the estimation sheet".
---

# Estimation Generator

## When to use

To produce a contract-ready effort estimate and execution plan from a PRD (and, when available, a
Technical Design Component/Build Inventory). Sizes work in man-days, builds the weekly FTE resource
plan, prices off the studio rate cards, applies the margin/anti-pattern guardrails from the embedded
Master Context Pack, and flags High-complexity features as spike-needed (two-tier estimate). Outputs
the filled workbook (estimate + plan). Trigger when the user asks to "estimate this project", "size
the PRD", "fill the estimation sheet", or build a proposal estimate.

Turns a PRD (preferably plus a Technical Design Component Inventory) into a **filled Estimation
Template** — the estimate and the execution plan — with every number a live formula. Gated phases.

## How to run

1. **Load the prompt + knowledge.** Read `resources/prompt.md` (the full Estimation Agent v2.1
   prompt — Phase 0 Classify → Phase 1 Size in man-days → Phase 2 Execution Plan → Phase 3 Price &
   Commercial → Phase 4 Materialise into the template). Use `resources/master-context-pack.md` as the
   only knowledge base for taxonomy, benchmarks, overhead rules, margins, and the 17 anti-patterns.
2. **Unit of estimation.** If a Technical Design **Component / Build Inventory** is supplied, size
   **per component**; otherwise size per PRD Section 10 feature. Author in **man-days (1 MD = 8h)**;
   leave QA to the template formula.
3. **Rates come from the template**, not the Pack — the `Cost Rate Card` / `Price Rate Card` tabs are
   authoritative (supersede Pack §9.2).
4. **Confidence tiering.** Read each feature's PRD `Technical Complexity`; size High-complexity rows
   as a conservative range + a budgeted discovery spike; produce a two-tier estimate (estimable-now
   vs spike-needed).
5. **Descriptions are inherited, never authored.** Column-E descriptions are condensed from the
   PRD Section 10a paste-ready block for each row's `Trace ID` (pre-v6 PRD: from the feature's
   Section 6 block; no source block → STOP and ask) — **never synthesized from the row name to
   pass the validator**. Shape checks are a floor, not the bar. Confirm the description audience
   (client- vs engineer-facing) at Phase 0.
6. **Hard rules (machine-checked — the estimate is not done until step 7 passes):**
   - Every Development description follows SOP §3: 2–4 user-perspective bullets + exactly one
     `• Technical -` line. Never a single line.
   - Substance floors: every row carries its PRD trace_id (e.g. `(PRD 6.A.2)` on the Technical
     line); user bullets are no name-echo (≥60% title-token re-use fails) and never
     generic-verb-only (browse/manage/use/view/access with nothing specific); the Technical line
     names a real noun-mechanism (service/store/SDK/algorithm).
   - No role cell > 5 man-days — a **decomposition trigger, not a ceiling**: split the feature.
     Exactly 5 MD only on a `spike`-tagged row (genuine technical unknown, not a framework/vendor
     choice).
   - Task grain: **one row = one session-sized deliverable.** No row > ~6 MD across FE+BE+AI; no
     feature (trace-group) > ~6 MD in one discipline — split into work-item rows with sub-trace
     ids (`PRD 6.A.2.1`, …), each describing its own deliverable.
   - Plan FTEs in 0.5 steps; PM always 0.2; Architect ∈ {0.2, 0.25, 0.5, 0.75, 1}. Weeks derived
     from the work (§4.4 duration/team-peak bands), unused template weeks left at 0.
   - Plan hours = Development hours **exactly, per role** — set the per-role Buffer (`overhead.buffer`
     object, Development row 84) to the difference. DevOps must be > 0 MD and ≥ 1% of dev hours.
7. **Materialise + validate.** Fill a **copy** of `resources/estimation-template.xlsx` by running
   `scripts/fill_template.py` with your structured estimate (JSON — see the script's docstring for
   the schema), then run `scripts/validate_estimate.py` on the output and **iterate on the inputs
   until it exits green**. It writes input cells only and preserves every formula. Fix floor
   failures by going back to the PRD block for that trace_id — never by token-tweaking a bullet
   until the check passes.
8. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to the prose packet.
9. **Offer Notion publication after final approval.** Ask whether to create the estimate in Notion
   (project hub) — the user decides; never create or update a page without an explicit yes. On yes,
   create a summary page (build log, two-tier split, reconciliation, risks/spikes, validation
   results) with the filled `.xlsx` attached, via the Notion MCP, and report the page URL; if the
   MCP is unavailable, say so and provide paste-ready markdown.

## Running the scripts
```bash
python scripts/fill_template.py \
  --template resources/estimation-template.xlsx \
  --input estimate.json \
  --output "Project - Estimation.xlsx"
python scripts/validate_estimate.py "Project - Estimation.xlsx"   # must PASS before delivery
```
`openpyxl` is pre-installed in the code-execution sandbox, so this runs on claude.ai / the API code
tool / Claude Code. Formula cells are never written; the workbook computes when opened.

## Inputs you need from the user
- **Required:** the PRD (Section 10 — from PRD v6 with per-row `Trace ID`s and the Section 10a
  paste-ready description blocks), or the Technical Design Component Inventory.
- **Optional:** commercial overrides (discount tier, buffer, pricing model, margin floor), target
  duration/team.

## Output
The filled **Estimation Template** (`Development`, `Design`, `Plan`, `Estimation-Detail`,
`Estimation-Summary`) = estimate + execution plan, a two-tier (estimable-now vs spike-needed)
summary, and the decisions/risks/spike list.
