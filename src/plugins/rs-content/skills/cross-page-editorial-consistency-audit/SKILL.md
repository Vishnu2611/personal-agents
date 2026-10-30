---
name: cross-page-editorial-consistency-audit
description: Audit a set of Figma pages against each other for errors, inconsistencies, gaps and voice drift, returning one severity-ranked table (max 25 rows). Input is the page URLs plus a canonical reference (voice guide, tokens, retired terms). Trigger on "cross-page consistency audit", "check the site pages for terminology drift", "pre-launch editorial audit".
---

# Cross-Page Editorial and Consistency Audit

A multi-page editorial audit that compares pages to each other rather than one page to its brief. It
catches errors, inconsistencies (lists variants with frequency, never picks the canonical), gaps and voice
drift, and outputs one table sorted red, yellow, green with no preamble.

## When to use

At milestones (pre-launch, post-launch, quarterly) once each page already passes its own review. Needs the
Figma node URLs for every page in scope, plus a canonical reference. The prompt's "Canonical references"
block holds hard-coded values for the RightShift site (V2 design tokens, retired terms such as "AOF"/"ATA",
approved testimonials, unresolved logos, held "$1.3B+" metric); confirm or replace them with the current
ones before running.

## Not for

Client deliverables. It is not a per-page design review against a brief (see rs-design), and it does not
fix the findings.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-content/prompts/cross-page-editorial-consistency-audit/current/cross-page-editorial-consistency-audit-v1.md`).
The fenced code block under "The prompt" is the prompt; the sections around it (how to use, what it
catches, rules, workflow) are guidance for the human. Ask the user for the page URLs, the canonical
references and any scope filter before starting.
