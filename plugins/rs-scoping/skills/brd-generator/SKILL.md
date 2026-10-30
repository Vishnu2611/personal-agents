---
name: brd-generator
description: Generate a client-facing BRD (business case, objectives, scope, risks) from an Opportunity Packet — transcripts, emails, notes. First BRD→PRD→estimation stage. Trigger on "create a BRD".
---

# BRD Generator

Turns a raw Opportunity Packet into a sign-off-ready **Business Requirement Document** — the business
case in plain English, before any system design. Built in gated phases with a human checkpoint each.

## When to use

At the **start** of a new IntuitioLabs/RightShift engagement, to capture the business case —
executive summary, objectives & metrics, product narrative, stakeholders, scope (in/out/phasing),
and risks — before any technical spec. First stage of the doc-gen pipeline; its output feeds the
**prd-generator**. Trigger when the user asks to "create/write a BRD", "turn this discovery call
into a business requirements doc", or start the BRD→PRD→estimation flow.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — it is the full BRD
   Generator v3 prompt (gated Phase 0 → Phase 1 Business Case → Phase 2 Scope → Phase 3 Risks &
   Handoff, each closing with the reflection block and a human checkpoint). Do not run ahead of the
   checkpoints.
2. **Apply the formatting standard.** Every section of the output must follow
   `resources/document-formatting-standard.md` (consistent sentence/period punctuation, parallel
   bullets ≤ 2 levels, numbered sentence-case sections, tables for structured data).
3. **Never fabricate.** Business figures, names, and dates come only from the inputs; tag gaps
   `[CLIENT INPUT REQUIRED]` / `[NEEDS REVIEW]`.
4. **Benefit-led Product Map.** Each Product Map feature carries one benefit-led intent sentence
   derived from the packet — never the feature name re-worded (>~60% title-word re-use = rewrite
   or tag `[NEEDS REVIEW]`). These sentences seed the PRD and estimation descriptions downstream.
5. **Offer Notion publication after final approval.** Ask whether to create the approved BRD in
   Notion (project hub) — the user decides; never create or update a page without an explicit yes
   for this artifact. On yes, mirror the document structure via the Notion MCP and report the page
   URL; if the MCP is unavailable, say so and provide paste-ready markdown.

## Inputs you need from the user
- **Required:** the Opportunity Packet (transcripts / emails / notes / client docs).
- **Optional:** known constraints, business context (sponsor, budget, dates, metrics), and a prior
  BRD (triggers Revision Mode with a changelog).

## Output
A complete BRD. Its **Executive Summary, Product Narrative, and Product Map (Sections 1, 3, 5a)** are
the bundle passed into the **prd-generator** skill as Input F.
