---
name: gamma-prototype-proposal-deck
description: Generate a client-facing prototype proposal Gamma deck from an Opportunity Packet, a feature dataset and an exact price, in two gated stages (select 4-6 demo features under a 7-10 day build constraint, then build the deck). Trigger on "prototype proposal deck", "build a Gamma proposal deck for this prospect", "pick the demo features and make the deck".
---

# Gamma Prototype Proposal Deck

Two-stage prompt (v3, Intuitio Labs): Stage 1 scores a feature dataset and selects 4-6 features for a demo-able prototype, ending in a structured Handoff Block; Stage 2 turns the approved Handoff Block into a scoped, timeline-based prototype proposal deck generated in Gamma. Each stage ends at a human checkpoint.

## When to use

After an opportunity conversation, when a startup with a defined feature set should be offered a fixed-scope **prototype** (not a production build) as the first engagement. Required inputs: the Opportunity Packet, the feature dataset (URL or pasted list) and tab, an exact PRICE (a single figure, not a range or TBD) and the PLATFORM (Web / Mobile / Both); optional: platform sections, coverage rule, a reference Gamma deck. Whatever price the user supplies goes into the deck, so confirm it before Stage 2 and check the final deck for any price placeholder before sending.

The prompt file also carries older Version 2 and Version 1 drafts of the same prompt below Version 3. Only the "Version 3" section applies.

## Not for

Producing the scope itself (opportunity packet, BRD, PRD, estimate) — use `rs-scoping`. Not for a full platform build proposal, and not for investor decks (see `startup-pitch-deck-generator`). Not for building the prototype — see `rs-prototype`.

## How to run

Read `resources/prompt.md` and follow its **Version 3** section exactly (from "Version 3 — Mathew" up to the "Version 2 — Deep" heading); ignore the Notion property header and everything from "Version 2 — Deep" onward (older versions and notes). It is the canonical prompt (source: `src/plugins/rs-sales/prompts/gamma-prototype-proposal-deck/current/gamma-prototype-proposal-deck-v3.md`). Ask the user for any required inputs it lists before starting, and do not pass a checkpoint without explicit approval. Do not leave a price placeholder in the deck.
