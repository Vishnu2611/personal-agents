---
name: prototype-feature-audit-and-ideation
description: Runs a web-researched, source-cited feature ideation analysis of a startup idea across seven prototype design frameworks (Kano, Aha Moment, Jobs to Be Done, Hook Model, Early Adopter, Narrative Arc, Riskiest Assumption Test) and ends with a ranked synthesis for the first prototype. Trigger on "feature audit for the prototype", "what should the prototype include", "score these features against the frameworks".
---

# Prototype Feature Audit and Ideation

Takes a pitch deck summary or idea description, rates every current feature against seven frameworks in a table, then runs eight sections of research-backed recommendations (3-5 per framework, each with a cited real example) and a closing synthesis of up to 10 bullets ranked by how many frameworks each element serves.

## When to use

Use before building a prototype, to decide what it should contain and which features deserve depth. It requires web search. The prompt contains a placeholder line `[PASTE YOUR PITCH DECK SUMMARY OR IDEA DESCRIPTION HERE ...]` that must be replaced with the real problem statement, target user, proposed features, customer interview findings and market context; ask the user for these before starting. Its output is the framework-scored feature audit that `html-prototype-generator` and `nextjs-prototype-generator` take as build-order input. It does not decide the MVP cut (`prototype-to-mvp-feature-generation`).

## Not for

Production delivery of an approved PRD (use `rs-delivery`), choosing the MVP cut (use `prototype-to-mvp-feature-generation`), and generating the earliest testable feature set from customer interviews (use `rightshift-feature-generator`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-prototype/prompts/prototype-feature-audit-and-ideation/current/prototype-feature-audit-and-ideation-v1.md`). Ask the user for any required inputs it lists
before starting.
