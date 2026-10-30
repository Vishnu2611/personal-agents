---
name: html-prototype-generator
description: Builds a single-file, fully clickable iOS-style mobile app prototype (one .html file in an iPhone device frame, plus a README) from a startup proposal deck, design screenshots and ideally a feature audit. Trigger on "build a clickable mobile prototype", "single-file HTML demo", "iPhone-frame prototype for investors".
---

# HTML Prototype Generator

Builds a self-contained mobile prototype as one `.html` file that opens by double-click and looks like a native iOS app, working in four phases with a pause for user review after each (frame/tokens/login, core flows, polish and brand verification, share/deploy prep).

## When to use

Use for a mobile-app concept that needs an investor-demo or user-feedback prototype with no build step. Needs a proposal deck (PDF) and design screenshots; a feature audit (build order and depth by score), a brand guide, a target form factor and a persona are optional. If no audit is supplied the prompt derives one itself. Produce the audit first with `prototype-feature-audit-and-ideation` if you want scored build order. For a web app with routing, auth and Vercel deploy, use `nextjs-prototype-generator` instead.

## Not for

Production delivery of an approved PRD (use `rs-delivery`), visual or UI design in Figma (use `rs-design`), and web apps with real routing and auth (use `nextjs-prototype-generator`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-prototype/prompts/html-prototype-generator/current/html-prototype-generator-v1.md`). Ask the user for any required inputs it lists
before starting.
