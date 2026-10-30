---
name: rightshift-site-design-evaluation
description: Evaluates the RightShift homepage across six scored dimensions with a persona simulation of four buyer types, an enterprise versus startup tension test, and a prioritized action list with three copy variants per copy change, from a homepage screenshot and architecture brief. Trigger on "evaluate the RightShift homepage", "homepage teardown for rightshift.co", "enterprise readiness check of the site".
---

# RightShift Site Design Evaluation

The RightShift-specific instance of the page evaluation framework, with the business context (three pillars, four audiences, dark editorial design system, verified metrics) written into the prompt. It runs a 3-second test and persona simulation, scores six dimensions, gives an enterprise readiness verdict, then a P1/P2/P3 action list with exactly three copy variants (clarity, differentiation, credibility) for every copy action and an estimated score impact.

## When to use

Use when the page under review is the RightShift homepage (rightshift.co). Attach a homepage screenshot and, ideally, the Website Architecture Brief. The business context, metrics and section list are hard-coded for RightShift; for another business or page type use `page-design-evaluation-generic`. The prompt file opens with a "How I built it" section; that is build-methodology background and can be skipped. Its closing "Usage notes" restate the prompt's own operating rules (run the preamble before scoring, give exactly 3 variants for every [COPY] action, the Estimated Score Impact is mandatory, the action list is a separate block) and must be followed.

## Not for

Not for any site other than RightShift (use `page-design-evaluation-generic`). Not for a frame-versus-brief check (`figma-page-review-vs-brief`). Not for implementing the changes in code (`rs-prototype`, `rs-delivery`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-design/prompts/rightshift-site-design-evaluation/current/rightshift-site-design-evaluation-v1.md`). Ask the user for any required inputs it lists
before starting.
