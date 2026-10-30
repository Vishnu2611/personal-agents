---
name: prototype-to-mvp-feature-generation
description: Scores each feature in a prototype feature audit against a fixed framework and returns an opinionated MVP scope — scoring table, MUST-only MVP list, and what is cut with reasons. Trigger on "what ships in the MVP", "cut the prototype down to an MVP", "MUST SHOULD COULD WON'T the features".
---

# Prototype to MVP Feature Generation

Acts as a product strategist applying a five-dimension framework (Core Promise Fit, Day-1 Reach, Differentiation, Effort S/M/L, Trust-Critical) and a MUST / SHOULD / COULD / WON'T decision rule, and produces exactly three sections, scope only, with no timelines or team sizing.

## When to use

Use after a prototype exists and the founder must decide v1 scope. It requires the product feature audit document (the prompt asks the user to paste it). Customer interviews or synthesis are optional and, when present, override intuition. Without them it proceeds on the audit alone, scores Differentiation and Day-1 Reach more conservatively, and flags the absence. It does not invent features beyond the audit, except to flag missing trust-critical ones (auth, legal). The audit itself comes from `prototype-feature-audit-and-ideation`.

## Not for

Production delivery of an approved PRD (use `rs-delivery`), generating new feature ideas from customer interviews (use `rightshift-feature-generator`), and scoring features for prototype build order (use `prototype-feature-audit-and-ideation`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-prototype/prompts/prototype-to-mvp-feature-generation/current/prototype-to-mvp-feature-generation-v1.md`). Ask the user for any required inputs it lists
before starting.
