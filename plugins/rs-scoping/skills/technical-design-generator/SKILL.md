---
name: technical-design-generator
description: Turn an approved PRD into architecture + workflow diagrams (D2) and a Component/Build Inventory to estimate against. Runs before estimation. Trigger on "technical design" or "architecture".
---

# Technical Design Generator

Bridges PRD features and the estimate: produces architecture + workflow diagrams and the
**Component / Build Inventory** the estimator sizes against. Gated phases with a checkpoint each.

## When to use

After the PRD and before estimation, especially when features are technically complex, to make
hidden engineering work countable — a system architecture diagram, integration topology,
workflow/sequence diagrams for the hard features, and a Component/Build Inventory (services, jobs,
stores, integrations, screens). Diagrams are authored in D2 (d2lang) with AWS icons, left-to-right,
ELK orthogonal non-overlapping lines, Miro-style layer containers. Trigger when the user asks for
"architecture", "technical design", "system/sequence diagrams", or a "component breakdown" before
estimating.

## How to run

1. **Load the prompt.** Read `resources/prompt.md` and follow it exactly — gated phases: Phase 0
   Triage (stack + which features need deep design) → Phase 1 System Architecture → Phase 2 Deep
   Design for High-complexity features → Phase 3 Component / Build Inventory & Handoff.
2. **Follow the Diagram Standards (in the prompt) for every diagram:** **D2 (d2lang)**;
   `direction: right` (left→right); **AWS Architecture Icons**, AWS as the default cloud unless the
   user specifies otherwise; **ELK layout** (the renderer's `--layout=elk` flag) for straight,
   orthogonal, non-overlapping lines; **Miro-style** layer containers (Client · Services · Data ·
   Async · AI · External) with labeled directional edges. Deliver the `.d2` source **and** the
   rendered image.
3. **Render every diagram with the `d2-diagrams` skill** as soon as its `.d2` source is done —
   invoke the skill if available, or run its script directly:
   `node d2-diagrams/scripts/render.mjs <diagram>.d2 <diagram>.png --layout=elk`
   (repo root; on claude.ai the skill mounts at `/mnt/skills/user/d2-diagrams/`). Render errors are
   real D2 compiler errors — fix the `.d2` source and re-render until clean, within the phase,
   before its checkpoint. A diagram is not done until it renders.
4. **Be proportional.** Architecture + topology + inventory for the whole project; deep
   workflow/sequence/data-flow diagrams **only** for `High`-complexity features (= the spike content).
5. **Apply the formatting standard** (`resources/document-formatting-standard.md`) to the prose parts.
6. **Offer Notion publication after final approval.** Ask whether to create the package in Notion
   (project hub) — the user decides; never create or update a page without an explicit yes. On yes,
   publish the inventory + rendered diagrams (with `.d2` sources) via the Notion MCP and report the
   page URL; if the MCP is unavailable, say so and provide paste-ready markdown.

## Rendering note
No `d2` binary is needed: the **`d2-diagrams` skill** renders via the official `@terrastruct/d2`
WASM build over Node.js (works under restricted network egress; PNG output also writes the matching
SVG). If its `node_modules` is missing, run `npm install` inside the `d2-diagrams/` directory once.
Only if Node.js itself is unavailable, deliver the `.d2` source flagged as unrendered.

## Inputs you need from the user
- **Required:** the Approved PRD (Sections 6, 9, 10 — especially the Technical Complexity ratings).
- **Optional:** tech-stack/cloud constraints, BRD/packet for context, existing architecture (brownfield).

## Output
A technical design package: architecture + integration topology, deep diagrams for hard features, and
the **Component / Build Inventory** — which passes to the **estimation** skill as the unit it sizes.
