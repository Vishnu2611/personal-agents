---
name: market-analyzer
description: Produces a VC-analyst-style investment report (TAM/SAM/SOM, market economics, funding and investor landscape, macro trends, strategy, investment thesis, due-diligence areas) from a short startup description. Trigger on "analyze this market", "VC-style market research", "size the market for this idea".
---

# Market Analyzer

Acts as a senior VC analyst and writes a comprehensive market and investment analysis report for a startup idea, with an executive summary, seven sections, cited data and risk ratings with confidence levels.

## When to use

When you need market sizing, investor landscape and an investment thesis for a startup idea, e.g. to support a pitch deck or validate an idea. Needs a 1-3 paragraph startup description and optionally a target geography or segment; run it with research mode enabled. It researches the whole market from the investor angle; for a single prospect company use **company-research**, and for a source-reconciled competitive and viability view use **competitive-and-market-research**.

## Not for

Researching one prospect company, reconciling Gemini and Perplexity outputs, or producing client-facing documents (that begins in `rs-scoping`: opportunity-packet, then brd-generator).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-research/prompts/market-analyzer/current/market-analyzer-v1.md`). Ask the user for any required inputs it lists
before starting.
