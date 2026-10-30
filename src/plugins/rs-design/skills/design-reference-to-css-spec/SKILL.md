---
name: design-reference-to-css-spec
description: Extracts a complete CSS design system spec (fonts, type scale, color palette, component rules, spacing and shape, atmosphere brief) from a design reference, mapped to an existing globals.css when one is given. Trigger on "extract a CSS spec from this design", "turn this Figma or screenshot into design tokens", "restyle my project to match this reference".
---

# Design Reference to CSS Spec

A meta-prompt that takes a Figma link, live URL or screenshot and outputs a design system spec in CSS. For an existing project it outputs a single self-contained restyle prompt mapped to the exact names in globals.css; for a new project it outputs a structured markdown token spec. Values come only from the reference, and approximated ones are marked as inferred.

## When to use

Use when there is a visual reference and the next step is styling or restyling. Required input is the reference (Figma URL, live URL or screenshot; if a link is private or inaccessible the prompt asks for a screenshot). Optional input is the project's globals.css. If the reference has both dark and light modes the prompt asks which to extract. Its output is meant to feed a project-creation or restyle prompt.

## Not for

Not for designing screens (use `saas-uiux-designer-figma`) or for evaluating a page against a brief (use the review skills here). Not for applying the CSS to the codebase; the output is a spec or prompt for that step, which belongs in `rs-prototype` or `rs-delivery`.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-design/prompts/design-reference-to-css-spec/current/design-reference-to-css-spec-v1.md`). Ask the user for any required inputs it lists
before starting.
