---
name: page-design-evaluation-generic
description: Produces a scored six-dimension teardown of any web page (messaging and copy, audience routing, design and hierarchy, trust, navigation, conversion) with a 3-second test, persona simulation, top priorities and an audience-readiness verdict, from a page screenshot and filled-in variables. Trigger on "evaluate this page design", "teardown of this landing page", "score this page for conversion".
---

# Page Design Evaluation (Generic)

The parameterized master of the page evaluation framework: all business-specific content is a `[VARIABLE]` to fill before running. It runs a mandatory 3-second above-the-fold test and a persona simulation, scores six dimensions 1-10 against calibration anchors, and ends with a weighted overall score, top 3 priorities, one thing to preserve and a primary-audience readiness verdict.

## When to use

Use for any page type (homepage, service subpage, landing page, contact page, case study hub) of any business. Every variable must be filled before running: business name, site URL, company type, page type, primary conversion goal, audience list and audience personas, design system, verified metrics, competitor benchmarks, routing mechanism and dimension weights. Attach a page screenshot and, if available, a brief or audience profile. Use `rightshift-site-design-evaluation` for the RightShift homepage specifically, and `figma-page-review-vs-brief` for a frame-versus-brief review.

## Not for

Not for redesigning the page or building it in code (`rs-prototype`, `rs-delivery`). Not for a frame-by-frame review against a brief with comment-ready fixes (`figma-page-review-vs-brief`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-design/prompts/page-design-evaluation-generic/current/page-design-evaluation-generic-v1.md`). Ask the user for any required inputs it lists
before starting.
