---
name: startup-pitch-deck-generator
description: Generate a 13-slide, citation-driven investor pitch deck narrative for a startup from founder, team, feature, prototype, market and traction inputs, with web research, [X] placeholders for unverifiable data and a references appendix. Trigger on "startup pitch deck", "write an investor pitch deck for this founder", "pitch deck with citations".
---

# Startup Pitch Deck Generator

Takes founder-supplied inputs and produces a full slide-by-slide pitch deck narrative (cover through appendix) following the standard investor structure. Strict data-integrity rules apply: no invented data, every external claim cited in an appendix slide, anything unverifiable left as an `[X]` placeholder with a data-gaps list.

## When to use

When a startup client needs an investor pitch deck written, using founder and team info, feature list and rationale, a prototype link or description, problem/market/why-now context, business model, founder-supplied traction and the raise ask (optionally existing market research links). It web-searches before writing, so it needs web search access. Traction must come from the founders only.

## Not for

Producing the scope itself — use `rs-scoping`. Not for a proposal deck selling RightShift's own prototype work (see `gamma-prototype-proposal-deck`) and not for critiquing an existing deck (see `pitch-deck-analyzer`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source: `src/plugins/rs-sales/prompts/startup-pitch-deck-generator/current/startup-pitch-deck-generator-v2.md`). Ignore the Notion property header, the "Copy prompt" UI text, and the trailing "Copy failed — try from claude.ai in browser" line; they are not part of the prompt. Ask the user for any required inputs it lists before starting.
