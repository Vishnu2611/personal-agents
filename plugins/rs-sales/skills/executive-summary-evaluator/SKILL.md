---
name: executive-summary-evaluator
description: Evaluate a startup executive summary as a senior VC analyst, scoring it 1-10 across eight screening dimensions with red flags, rewrite suggestions and an investment-readiness verdict. Trigger on "evaluate this executive summary", "score our exec summary", "VC-style review of the summary before we send it".
---

# Executive Summary Evaluator

A VC-analyst-perspective evaluation of a startup executive summary across eight core dimensions, each scored with reasoning and best-practice citations, ending in an overall assessment and what each score means for the investment decision.

## When to use

To review an executive summary before it goes out. The user must paste the summary in place of the `[PASTE THE STARTUP'S EXECUTIVE SUMMARY HERE]` placeholder. It evaluates as an investor would, so it fits investor-facing startup summaries, not RightShift proposals or BRD summaries. Output is meant to be thorough (2000-3000 words).

## Not for

Producing the scope or the BRD's executive summary — use `rs-scoping`. Not for reviewing a whole deck (see `pitch-deck-analyzer`) or for editorial and client-communication QA (see `rs-content`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source: `src/plugins/rs-sales/prompts/executive-summary-evaluator/current/executive-summary-evaluator-v1.md`). Ignore the Notion property header. Ask the user for the executive summary text before starting.
