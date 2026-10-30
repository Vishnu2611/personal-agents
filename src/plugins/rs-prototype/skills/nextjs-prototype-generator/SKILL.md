---
name: nextjs-prototype-generator
description: Builds a demo-ready, Vercel-deployable Next.js App Router web app (TypeScript, Tailwind, shadcn/ui, framer-motion, NextAuth demo login, Playwright visual audit) from a proposal deck, a feature audit, design screenshots and reference exemplars. Trigger on "build the Next.js prototype", "Vercel-ready demo app for investors", "turn this proposal deck into a working web prototype".
---

# Next.js Prototype Generator

Builds a funded-looking, fully functional web prototype in a phased, review-gated process: input validation, Phase 0 plan, foundation and design system, core feature flows, motion and polish, Playwright visual audit, and Vercel deployment prep.

## When to use

Use for a web product that needs real routes, role-based demo login and a polished look for investor fundraising or early user feedback. Needs all four inputs: proposal deck (PDF or Gamma URL), feature audit (URL or pasted text), design screenshots and reference exemplars (defaults are named in the prompt). Stops and asks if any is missing. The source file also carries earlier Versions 3, 2 and 1 of the same prompt after the Version 4 section; they are superseded history, so follow only the Version 4 section and ignore everything from the "# Version 3" heading onward. For a single-file mobile iOS-frame demo, use `html-prototype-generator` instead.

## Not for

Production delivery of an approved PRD (use `rs-delivery`), visual or UI design in Figma (use `rs-design`), and single-file mobile demos (use `html-prototype-generator`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-prototype/prompts/nextjs-prototype-generator/current/nextjs-prototype-generator-v4.md`). Ask the user for any required inputs it lists
before starting.
