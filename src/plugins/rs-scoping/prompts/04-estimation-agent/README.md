# Estimation Agent

Consumes the **PRD** (Section 10 Estimation Breakdown + Section 10b Coverage Matrix) and produces a
first-pass **effort/scope estimate** by epic/feature, plus clarification questions. This is the
prompt with the richest version history — many iterations (`v1.0` → `v1.6`) and "batch" variants.

- **Notion (current):** Estimation Generation From PRD — page `341b19fd-bedb-80f6-aae3-fee1cddfd147`
- **Latest version:** v1.6 · **Status:** In progress
- **Upstream:** PRD Generator v4
- **Downstream:** Feature POV Narrative → Gamma Platform Proposal

## Inputs
- PRD (or PRD link) covering scope, requirements, constraints
- Optional: known assumptions, prior estimates, target timeline/budget

## Output
First-pass estimate breakdown (scope + effort by epic/feature) + clarification questions →
Estimation sheet / Notion page.

## Version history (see `versions/`)
| Version | Notion page ID | Note |
|---|---|---|
| v1.0-batch | `2d87bd48-88a5-467a-8ef8-52d2894a1879` | batch variant |
| v1.1-batch | `709bbc4a-ddd3-48f6-b39d-e69a93f4f8ef` | batch variant |
| v1.5 | `372b19fd-bedb-808a-aa61-f940b36c2c62` | |
| v1.6 | `373b19fd-bedb-8076-b553-e41bd90e7a1e` | |
| v1.6-batch | `373b19fd-bedb-801a-ae62-de5916af0b27` | batch variant |
| Estimation Generation From PRD (live) | `341b19fd-bedb-80f6-aae3-fee1cddfd147` | the catalog "current" entry |

> Note: several pages titled just "Estimation Agent Prompt" appear to be duplicates of the same
> content — reconcile during analysis and keep the canonical one.

## Cross-version diff (from local pull, 2026-06-29)

All six versions pulled to `versions/` (~1530–1689 lines each). Key findings:

- **"No totals" rule is an INPUT gate, not an output rule.** The "strip all estimation numbers —
  no total hours, no role-hour breakdown, no internal cost, no client price, no margin" rule
  applies to the **incoming PRD** (validation gate). Every version's *deliverable* is an internal,
  contract-ready packet that **includes** total hours, per-role hour breakdown, internal cost,
  client price, and margin. There is no client-vs-internal view split in any version.
- **Batch vs interactive is the core fork.** Non-batch `v1.5`/`v1.6` insert human-in-the-loop
  `→ STOP.` gates after Phase 0/1/2; the `batch` variants replace these with `→ Proceed to next
  phase.` for autonomous end-to-end runs. Otherwise near byte-identical.
- **v1.6 is purely additive over v1.5:** adds **PHASE 4 — XLSX Estimation Sheet** (materializes the
  Phase 3 packet as a studio-format `.xlsx`: Cost Rate Card / Estimation-Detail / Estimation-Summary
  / Plan / Decisions & Risks / Validation tabs, live formulas, six-check reconciliation gate).
  Reflection Criteria 10 → 12. Phases 0–3 byte-unchanged from v1.5.
- **v1.0 → v1.5 are calibration fixes only** (structure stable §1–§17): v1.1 Other-bucket cap +
  Consulting/Audit archetype + ML rate; v1.2 fixed-dollar markup + buffer default 0%; v1.3
  Consulting margin band 57.5–60% → 55–60%; v1.4 multi-rail payment 1.3× + design-day 1.5× +
  agent-runtime sub-driver; v1.5 sub-52% margin must surface `A14 DECISION NEEDED` before Phase 1.
- **Live/current page** matches interactive v1.6 (keeps STOP gates) but uses the batch's
  "PRD-from-Sheet prompt" source wording and omits the changelog preamble.

## Open questions to resolve
- The live page mixes interactive gates with batch source-wording — is that intentional, or should
  current/ be cleanly the interactive v1.6 or the batch v1.6? Decide the canonical lineage.
- Several pages titled just "Estimation Agent Prompt" are likely duplicates — reconcile and retire.

## Files
- `current/` — Estimation Generation From PRD v1.6 (live)
- `versions/` — all the v1.x iterations + batch variants for diffing
- `improvements/` — WIP rewrites
  - `estimation-agent-v2.md` — **template-conformant rewrite (draft, now v2.2 granular + reconciled).**
    Authors in man-days, makes the `Plan` the engine (upstream of pricing), prices off the template's
    two rate cards, and fills a copy of `IntuitioLabs - Estimation Template.xlsx` with arithmetic +
    conformance validation. **v2.1 consumes PRD v5's Section 10 `Technical Complexity` + `Technical
    Risk/Approach` columns** to confidence-tier each feature and produce a **two-tier estimate**
    (estimable-now vs spike-needed — High-complexity features sized as a conservative range + a
    budgeted discovery spike, never silently point-estimated). **v2.2 (2026-07-03) adds five
    machine-checked hard rules** — SOP §3 description format (2–4 user bullets + `• Technical -`
    line), a 5-man-day granularity cap per role cell (5 only on `spike` rows), Plan FTE increments
    (0.5 steps; PM 0.2; Architect 0.2/0.25/0.5/0.75/1), duration derived from the work (§4.4
    realism bands), and exact per-role Plan = Development hour reconciliation via per-role Buffer —
    enforced by `skills/estimation-generator/scripts/validate_estimate.py`. Reuses Master Context
    Pack v1.0 (rate values deferred to the rate cards). **Pairs with
    `02-prd-generator/improvements/prd-generator-v5.md`.**
- `template/` — the studio estimation spreadsheet:
  - `IntuitioLabs - Estimation Template.xlsx` — reusable blank template (all formulas, both rate
    cards, role dropdown, formatting preserved; one sample feature row; in-workbook **SOP** tab).
    Genericised from `Mocha MVP - Estimation.xlsx` (kept at repo root as the worked example).
    **Formula repairs applied 2026-07-03:** DevOps price row (Plan 103) now uses the Price Rate
    Card for all 12 weeks; Estimation-Detail PM hours read the Plan PM row (`=Plan!Q54`); Discovery
    hours no longer multiply by the Week# value; Discovery totals include week 1.
  - `ESTIMATION-SHEET-SOP.md` — markdown mirror of the SOP tab (sheet-by-sheet + every key formula,
    incl. the §3 description format, §4 5-MD cap, and §4a plan staffing rules).

## How the spreadsheet relates to the prompt
The prompt's **Phase 4** materializes an `.xlsx` with tabs Cost Rate Card / Estimation-Detail /
Estimation-Summary / Plan. The studio template here is the human-authored counterpart with the same
spine plus `Development` and `Design` feature sheets. A future improvement is to align the agent's
Phase 4 output to emit exactly this template (same tabs, same formulas, same rate-card lookups).
