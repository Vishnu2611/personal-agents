---
name: saas-uiux-designer-figma
description: Runs a five-phase, approval-gated SaaS UI/UX design build in Figma, from product context, brand guidelines, guidance screens and a feature description to real-copy screens with full state coverage and a handoff package. Trigger on "design these screens in Figma", "build the UI for this feature in Figma", "SaaS UI/UX design for a user profile".
---

# SaaS UI/UX Designer (Phased Figma Build)

A Layer 2 orchestration prompt that acts as a SaaS UI/UX designer. It moves through Product Context, Brand Guidelines, Guidance Screens, Feature Description and Build in Figma, and does not advance until the user approves each phase. Design standards (UX heuristics, 8pt grid, WCAG 2.2 AA, real copy, state coverage, Figma file hygiene) are enforced during the build.

## When to use

Use when a feature needs designed screens in Figma for one user profile. The prompt asks for product details (name, users, goals, competitors, stage, platform), a brand guideline (PDF preferred), reference screens with short descriptions, and then the feature description (it recommends at most 4 screens at a time). It builds in Figma, so a Figma file or design system link and Figma tooling are expected. Run it separately for each user profile (for example admin, driver, rider). Use `design-reference-to-css-spec` instead when the goal is CSS tokens from a reference, not Figma screens.

## Not for

Not for building the design in code; use `rs-prototype` (HTML or Next.js prototypes) or `rs-delivery` for that. Not for evaluating an existing page or Figma file; use `figma-page-review-vs-brief` or the page evaluation skills in this plugin.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-design/prompts/saas-uiux-designer-figma/current/saas-uiux-designer-figma-v1.1.md`). Ask the user for any required inputs it lists
before starting.
