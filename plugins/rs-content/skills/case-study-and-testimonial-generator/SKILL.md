---
name: case-study-and-testimonial-generator
description: Produce one or more client-approvable, IP-safe case studies plus draft testimonials from an IntuitioLabs project's source docs (hub, PRD, production/handover doc) and the latest GTM strategy. Phased with human checkpoints, ends in markdown files per track. Trigger on "write a case study for this project", "draft testimonials for the client", "case study with tech trend angle".
---

# Case Study and Testimonial Generator

Turns a finished project's source materials into case studies that are not leaky, not generic and not
overclaimed: source ingestion (planning vs production), tech-trend scan, angle per track, IP protection
audit, draft (~400-500 words), then testimonial versions per speaker. Each phase ends at a STOP checkpoint.

## When to use

After a project has shipped and you need publishable proof. Have ready: project sources (ideally also a
production/KT doc that reflects what shipped), the latest GTM strategy, client name/industry/product name,
number of case studies and target reader per track, testimonial speakers with exact titles, the permitted
outcome language and logo/branding permission. The prompt asks for all nine inputs at its gate. It names
a "Ballin baseline" as its structure reference; if that example is not available, say so and continue.

## Not for

Client deliverables, and anything not published under the RightShift name. For LinkedIn posts or voice use
the other rs-content skills; for a proposal or deck use rs-sales.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-content/prompts/case-study-and-testimonial-generator/current/case-study-and-testimonial-generator-v2.md`).
Ask the user for the inputs it lists before starting and do not skip its STOP checkpoints. The file ends
with a superseded "Version 1" note; ignore it.
