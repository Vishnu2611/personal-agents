# Technical Design Generator

New pipeline stage between **PRD** and **Estimation**. Turns an approved PRD into **architecture +
workflow diagrams** and a **Component / Build Inventory** — the flat list of buildable units
(services, jobs, stores, integrations, screens) the Estimation Agent sizes against. Makes hidden
work *countable*, which is where estimate accuracy lives.

- **Status:** Draft / new (not yet in the Notion RS Layer3 repo — author there once validated)
- **Run order:** Opportunity Packet → BRD v2 → PRD v5 → **Technical Design (this)** → Estimation v2.1
- **Upstream:** PRD Generator v5 — Sections 6, 9, 10 (esp. `Technical Complexity` L/M/H ratings)
- **Downstream:** Estimation Agent v2.1 — sizes per component from the inventory

## Why it exists

A PRD describes *features*; an estimate needs *buildable components*. "Build the matching engine"
(one feature) hides a vector store + embeddings pipeline + ranking service + graph query (four
sizeable components). This stage surfaces them.

## Proportionality (the key rule)

- **Whole project, always:** system architecture + integration topology + component inventory.
- **High-complexity features only:** deep workflow/sequence/data-flow diagrams (= the discovery-spike
  content the Estimation Agent budgets). Don't diagram every CRUD screen.

## Diagram standards (locked)

Every diagram follows: **D2 (d2lang)** source → rendered via `d2 --layout elk` (straight, orthogonal,
non-overlapping lines); **left → right** flow; **AWS Architecture Icons** with **AWS as the default
cloud** unless a different provider is specified; **Miro-style** layer containers/swimlanes (Client ·
Services · Data · Async · AI · External) with labeled directional edges. Deliver the `.d2` source
alongside the exported image.

## Output → Estimation handoff

The **Component / Build Inventory** (Component · Type · Serves Feature(s) · Disciplines · FP Block ·
Complexity · Spike? · Notes) is the artifact Estimation v2.1 consumes: it sizes **per component**
(more granular and accurate than per feature), grounded by the sequence diagrams.

## Files
- `current/technical-design-generator-v1.md` — the prompt (gated phases: Triage → System Architecture
  → Deep Design for High-complexity features → Component Inventory & Handoff). Diagrams in Mermaid.
- `improvements/` — WIP rewrites
- `examples/` — worked technical-design packages per project
