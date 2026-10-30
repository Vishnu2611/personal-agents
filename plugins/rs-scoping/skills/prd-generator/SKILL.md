---
name: prd-generator
description: Generate a dual-layer PRD from an Opportunity Packet — an Approved BRD is optional and, when supplied, becomes the scope authority. Engineering-ready feature specs plus an estimation-ready Section 10 with complexity ratings. Second pipeline stage. Trigger on "write a PRD".
---

# PRD Generator

Turns an Opportunity Packet — plus, when one exists, an approved BRD — into a dual-layer PRD that
serves the client, engineering, and the Estimation Agent at once. Built in five gated phases with a
human checkpoint each.

## When to use

To produce engineering-ready feature specs (User Experience + Implementation Detail + Technical
Behavior) and an estimation-ready Section 10 — per-feature FP block, disciplines, work-item count,
Technical Complexity (L/M/H), technical risk, a stable **Trace ID** per row, and **Section 10a
paste-ready estimation descriptions** derived from each feature's Section 6 block (never from the row
name). Feeds the **technical-design-generator** and **estimation-generator** skills. Trigger when the
user asks to "write/create a PRD", "turn the BRD into a product requirements doc", or continue the
Opportunity Packet → PRD → estimation flow — a signed-off BRD is not a prerequisite.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — it is the full PRD
   Generator v7 prompt (Phase 0 Sync Check → Phase 1 Frame → Phase 2 Features → Phase 3 Technical
   Context → Phase 4 Estimation Handoff, each closing with reflection + checkpoint, plus a running
   Decision Log). Do not run ahead of the checkpoints.
2. **Determine the mode, first thing.** If an Approved BRD is supplied, this is **BRD Mode** — the
   BRD is the scope authority. If not, this is **Packet Mode** — the Opportunity Packet (plus any
   feature list / existing estimation sheet supplied) becomes the scope authority instead, and the
   PRD is flagged provisional pending BRD reconciliation. State the mode out loud before drafting.
3. **Enforce scope authority.** Precedence: BRD Mode — Approved BRD > human answers > Opportunity
   Packet > assumptions, conflicts tagged `BRD CONFLICT`. Packet Mode — Opportunity Packet > human
   answers > Input B/G > assumptions, conflicts tagged `PACKET CONFLICT`. Net-new features →
   `SCOPE ADDITION` in either mode. Never silently resolve.
4. **Emit the depth signal.** Section 10 must carry **Technical Complexity (L/M/H)** and a
   **Technical Risk / Approach** per row; complexity-tagged features state their approach in Proposed
   Behaviour; High-complexity features decompose to user-story-level sub-features.
5. **Emit the estimation contract.** Every Section 10 row carries a stable **Trace ID**
   (`PRD 6.<Epic>.<n>`) and a **Section 10a paste-ready description** (2–4 benefit-led user bullets
   + one `• Technical - [named noun-mechanism]` line) **derived from that feature's Section 6 block —
   never from the row name**. Features expected past ~6 MD in a single discipline split into
   session-sized work-item rows. **Handoff is blocked** while any row lacks its Trace ID or
   description block.
6. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to all output.
7. **Offer Notion publication after final approval.** Ask whether to create the approved PRD in
   Notion and write the Decision Log entries to the hub's database — the user decides each; never
   create or update pages/rows without an explicit yes. On yes, mirror the document via the Notion
   MCP and report the URLs; if the MCP is unavailable, say so and provide paste-ready markdown.

## Inputs you need from the user
- **Required:** the **Opportunity Packet**.
- **Optional:** an **Approved BRD** (Input F — if supplied, must show Status = Approved to enable BRD
  Mode; if omitted, the PRD runs in Packet Mode against the Opportunity Packet). Also optional:
  feature list, constraints (timeline/team/stack/compliance), links, commercial context, an existing
  estimation/feature-task sheet.

## Output
A full PRD (Sections 0–13) + Decision Log, marked BRD Mode or Packet Mode in Section 0. **Sections
10 + 10a + 10b** pass to the **technical-design** skill (which deep-designs the High-complexity
features) and the **estimation** skill.
