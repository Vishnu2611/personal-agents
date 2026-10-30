---
name: rightshift-feature-generator
description: Turns a founder's problem statement, solution statement, customer interview notes and lean canvas into a three-phase product roadmap and 8-12 detailed earliest-testable-product features sized for Lovable, using Gemini Deep Research or Claude. Trigger on "earliest testable product features", "generate a roadmap from customer interviews", "what do we build first".
---

# RightShift Feature Generator

Runs a research-backed accelerator prompt that analyses customer discovery notes (the primary source), researches 3-5 competitors, and outputs a Product Roadmap (Month 1, Months 2-3, Months 4-6) followed by the Earliest Testable Product Features in a detailed per-feature format with dependency analysis.

## When to use

Use at the start, before anything is built, when a founder has customer interviews and needs to decide the first testable feature set. Needs the problem statement, solution statement, raw customer interview notes (leave out your own key quotes, insights, referrals and next steps so the model does not build on them) and a lean canvas. Run in Gemini with Deep Research enabled or in Claude, pasting the prompt as is. Step 2 in the source is only a note to review the output carefully. This generates features from discovery; it does not audit a built prototype (`prototype-feature-audit-and-ideation`) nor cut features down to an MVP (`prototype-to-mvp-feature-generation`).

## Not for

Production delivery of an approved PRD (use `rs-delivery`), scoring an existing prototype feature set (use `prototype-feature-audit-and-ideation`), and choosing the MVP cut (use `prototype-to-mvp-feature-generation`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-prototype/prompts/rightshift-feature-generator/current/rightshift-feature-generator-v1.md`). Ask the user for any required inputs it lists
before starting.
