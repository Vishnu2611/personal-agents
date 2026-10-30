---
name: pitch-deck-analyzer
description: Analyze a pitch deck from a given URL as a seasoned serial entrepreneur and investor, and deliver slide-by-slide, reference-backed improvement recommendations with alternatives and priority actions. Trigger on "review this pitch deck", "analyze our pitch deck", "feedback on the deck before we send it".
---

# Pitch Deck Analyzer

Reviews a pitch deck through a founder-and-investor lens: overall structure, slide-by-slide analysis, and problem, solution, market, business model, traction, financials and funding-ask evaluation, benchmarked against successful decks, with an executive summary, detailed recommendations and priority action items.

## When to use

To review a pitch deck (for example a startup client's, or one of ours) before it goes out. The user must supply the pitch deck URL, which replaces the `[USER WILL PROVIDE LINK]` placeholder. The prompt's example comparisons (such as Airbnb and Uber) and its "[Provide specific links to these decks]" instruction are guidance for research, not input. It evaluates from an entrepreneur-raising-a-seed-round perspective, so it fits investor decks, not sales proposals.

## Not for

Producing the deck — see `startup-pitch-deck-generator`. Not for producing the scope — use `rs-scoping`. Not for evaluating a written executive summary (see `executive-summary-evaluator`) or for editorial and client-communication QA (see `rs-content`).

## How to run

Read `resources/prompt.md` and follow the analysis prompt (from "Role & Context" through "Key Success Metrics for Recommendations") exactly. Source: `src/plugins/rs-sales/prompts/pitch-deck-analyzer/current/pitch-deck-analyzer-v1.md`. Ignore the Notion header and everything from the final "# Prompt" heading onward: that is a separate internal "Customer Discovery Question Optimizer" prompt, not part of this skill. Ask the user for the pitch deck URL before starting.
