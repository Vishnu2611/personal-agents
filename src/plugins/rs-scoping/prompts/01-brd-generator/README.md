# BRD Generator

Turns an **Opportunity Packet** into a **Business Requirement Document** — business-level only
(no system requirements, architecture, API, or data design). Sits between discovery and the PRD.

- **Latest version:** v4 · **Status:** Current (promoted 2026-07-21; supersedes v2/v3)
- **Notion:** v2 page `379b19fd-bedb-816f-94a2-fd2b757a4b97` — **Notion still hosts v2; local promoted prompt is v4 (Notion + `skills/` sync pending).**
- **Upstream:** Create Opportunity Packet
- **Downstream:** PRD Generator v6 (Exec Summary + Product Narrative + Product Map → Input F; Section 2 `O-n`/`M-n` objectives feed PRD Section 3)

## Inputs
- Input A (required): Opportunity Packet — transcripts, emails, notes, client docs
- Input B (optional): known constraints / context
- Input C (optional): business context — sponsor, budget, dates, success metrics, strategic goals
- Input D (optional): prior BRD version → triggers Revision Mode (changelog + version bump)
- Input E (optional): existing feature list / estimation sheet / product doc — feature names + descriptions only (no estimation numbers); seeds the Product Map; gathered in Phase 0
- Input F (optional): document theme / style preference — gathered in Phase 0

## Output
Business Requirement Document: Doc Control + Changelog, Executive Summary, Business Objectives &
Metrics, Product Narrative, Stakeholders, Scope (Product Map + Boundaries), Assumptions & Risks,
Open Items. → human review → client sign-off; Sections 1/3/5a feed PRD Generator v6.

## Files
- `current/brd-generator-v4.md` — **v4 (live, promoted 2026-07-21).** Value-anchored, measurable
  objectives: Section 2 objectives carry a **business-value lever** (Revenue/Cost/Risk/Time/Experience)
  and a structured metric (**`Baseline → Target (timeframe), measured by [method]`**) with each missing
  component tagged individually; quantifies current-state baselines; adds stable `O-n`/`M-n` handles
  that **PRD v6 Section 3 inherits**; gives Stakeholders a "what success looks like" column. **Adds a
  Phase 0 — Optional Context Intake & Theme** (five gated phases, 0–4) taking an optional feature list /
  estimation sheet (Input E — names + descriptions only) and theme preference (Input F). Builds on v3's
  formatting-standard work. Adopts cherry-picked patterns from the VoltAgent `business-analyst` (MIT).
- `versions/brd-generator-v2.md` — prior live version.
- `versions/brd-generator-v3-full.md` — v3 formatting-standard upgrade (full prompt); superseded by v4.
- `versions/brd-generator-v3.md` — the v3 diff summary.
- `improvements/` — empty; the next draft (v5) goes here, promoted to `current/` when ready.

## Known issues / improvement ideas
_(fill in as we analyze — e.g. weak success-metric extraction, scope-boundary ambiguity, etc.)_
