---
name: figma-page-review-vs-brief
description: Reviews one Figma frame against its Notion brief and a chosen page goal (Conversion Landing, Service / Capability, Trust / Proof, Navigational / Hub) and returns a severity-ranked, paste-ready table of issues for Figma comments. Trigger on "review this Figma page against the brief", "pre-handoff teardown of this frame", "check this page against its brief".
---

# Figma Page Review vs Brief & Goal

A per-page Figma design review that diffs the design against the brief rather than redesigning it. It first checks that the chosen goal matches what the brief says the page is for, then applies a seven-part rubric (copy drift, missing sections, extra sections, sourcing and policy violations, V2 design token compliance, CTA hierarchy, hierarchy and scannability) and outputs at most 20 rows ranked red, yellow, blue. It never applies fixes and never invents copy.

## When to use

Use when a single Figma frame has a Notion brief and needs a check before handoff or publish. Inputs: the Figma frame URL (ending in `?node-id=...`), the Notion brief URL, one page goal, and optionally a page type label. The rubric contains RightShift-specific project rules (retired terms, unverified metrics and client logos, the V2 violet-on-#090909 token set), so it is tuned to RightShift site pages. Choose this over `page-design-evaluation-generic` when a brief and Figma frame exist and you want comment-ready fixes; the generic and site evaluations score a live page screenshot. Once individual pages clear, the cross-page editorial audit in `rs-content` covers consistency across the set.

## Not for

Not for redesigning the page or auto-applying fixes. Not for scoring a whole page across audiences (use `page-design-evaluation-generic` or `rightshift-site-design-evaluation`). Not for building it in code (`rs-prototype`, `rs-delivery`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-design/prompts/figma-page-review-vs-brief/current/figma-page-review-vs-brief-v1.md`). Ask the user for any required inputs it lists
before starting.
