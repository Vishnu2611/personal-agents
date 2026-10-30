# PRD Generator

Turns an **Opportunity Packet** — plus, when one exists, an **Approved BRD** — into a full **Product
Requirement Document** with a dual-layer feature structure and an embedded estimation breakdown that
the Estimation Agent consumes. The BRD is optional: supplying an Approved one puts the prompt in
**BRD Mode** (the BRD is the scope authority); omitting it runs **Packet Mode** instead (the
Opportunity Packet becomes the scope authority, and the PRD is flagged provisional pending BRD
reconciliation).

- **Latest version:** v7 · **Status:** Current (promoted 2026-08-06; supersedes v6)
- **Notion:** v4 page `374b19fd-bedb-81f7-a191-e51988db5ed5` — **Notion still hosts v4; local promoted prompt is v7 (Notion + `skills/` sync pending).**
- **Upstream:** Opportunity Packet (Input A, required) + BRD Generator (Input F, optional)
- **Downstream:** Estimation Agent (Section 10 + 10b Coverage Matrix) · Test Planner (Given/When/Then acceptance criteria)

## Inputs
- Input A (required): Opportunity Packet — transcripts, emails, notes, client docs
- Input F (optional — enables BRD Mode): Approved BRD (incl. Document Control header for version/status). Omitted → Packet Mode.
- Input B (optional): feature list / estimate rows
- Input C (optional): constraints — timeline, budget, tech stack, compliance
- Input D (optional): links — Figma, prior PRDs, SOWs
- Input E (optional): commercial context — contract type, change-order rules
- Input G (optional): existing estimation / feature-task sheet — features/tasks/descriptions only (no hours/costs); gathered in Phase 0
- Input H (optional): document theme / style preference — gathered in Phase 0

## Output
Full PRD (Sections 0–13): Product POV Narrative, role-organized **dual-layer feature blocks**
(POV + Implementation Detail + Technical Behavior), Estimation Breakdown (Section 10 incl. Work
Items count), Scope Coverage Matrix (Section 10b), and a Decision Log entry per ruling. Section 0
states which mode produced it.

## Conflict rule
**BRD Mode:** where the Opportunity Packet contradicts the BRD, **the BRD wins** and the conflict is
tagged `BRD CONFLICT` — a human decides. **Packet Mode:** where a secondary input (Input B/G)
contradicts the Opportunity Packet, **the packet wins** and the conflict is tagged `PACKET CONFLICT`.

## Files
- `current/prd-generator-v7.md` — **v7 (live, promoted 2026-08-06).** Makes the BRD optional: adds
  **Scope Authority & Mode** (BRD Mode if an Approved BRD is supplied, else Packet Mode against the
  Opportunity Packet), a new `PACKET CONFLICT` tag, and a provisional-scope flag on Packet Mode output
  in Sections 0/5/10b/12. Carries forward all of v6 unchanged when a BRD is present.
- `versions/prd-generator-v6.md` — **v6 (technical-depth + user-need traceability).** User-need
  traceability + prioritization: binds every feature to a **primary persona + user need (JTBD)**
  tracing to a Section 2 pain handle; adds a **value-driver rationale** (+ optional MoSCoW) per
  priority; rewrites acceptance criteria into testable **Given/When/Then** form (hand straight to the
  Test Planner, stage 05); adds a **Phase 0 — Optional Context Intake & Theme** (six gated phases, 0–5)
  taking an optional estimation/feature-task sheet (Input G) and theme preference (Input H). Builds on
  v5's technical-depth work. Adopts cherry-picked patterns from VoltAgent `product-manager` +
  `ux-researcher` (MIT). Superseded by v7 (which carries all of it forward).
- `versions/prd-generator-v4.md` — prior live version. **Also contains v3 inline** (under a `# V3` heading) —
  v3 was kept in a Notion toggle on the same page.
- `versions/prd-generator-v5.md` — **v5 (technical-depth for estimation).** Added Section 10
  `Technical Complexity` (L/M/H) + `Technical Risk / Approach`, made the technical approach mandatory for
  complexity-tagged features, and extended the granularity rule to decompose High-complexity features to
  user-story level. Superseded by v6.
- `versions/prd-generator-from-notes-v2.md` — the older "from notes/transcripts/client docs" lineage.
  **Contains both v2 and v1 inline** (both were toggles on the page).
- `versions/product-pov-generator-v1.md` — Product POV Generator (feeds PRD as the POV input).
- `improvements/` — empty; the next draft (v8) goes here, promoted to `current/` when ready.

## Known issues / improvement ideas
_(fill in as we analyze — e.g. Section 10 ↔ Estimation contract drift, role-map consistency, etc.)_
