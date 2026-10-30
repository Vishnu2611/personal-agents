---
name: competitive-and-market-research
description: Guides a multi-step market, competitive and startup-viability analysis: the same prompt is run in Gemini and Perplexity deep research, then Claude synthesizes both outputs into an executive summary, market analysis and competitive analysis with conflicts flagged and sources tagged. Trigger on "competitive analysis", "synthesize Gemini and Perplexity research", "is this startup idea viable".
---

# Competitive and Market Research

A staged workflow: run deep-research prompts in Gemini and Perplexity (market and competitive analysis, product differentiation, target segments), then use the Claude synthesis prompt to merge both outputs, mark disagreements between sources and keep citations.

## When to use

When you want a viability view of a startup or product idea that cross-checks two deep-research sources. Needs the startup name, product description and target market, plus the Gemini and Perplexity outputs for the synthesis step. Unlike **market-analyzer** (a single VC-style report) it reconciles two sources and covers competitors, differentiation and target segments; unlike **company-research** it is about a product idea and its market, not one prospect.

## Not for

Researching a single prospect company for sales, writing a single-source investment report, or producing client-facing documents (that begins in `rs-scoping`: opportunity-packet, then brd-generator).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-research/prompts/competitive-and-market-research/current/competitive-and-market-research-v1.md`). Ask the user for any required inputs it lists
before starting.
