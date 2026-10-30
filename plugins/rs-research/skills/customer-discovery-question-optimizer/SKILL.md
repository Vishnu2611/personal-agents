---
name: customer-discovery-question-optimizer
description: Optimizes drafted customer-discovery interview questions, or generates new ones, from a startup concept, target customer and core assumption, returning per-question framework, rationale, evidence target, follow-ups and success criteria. Internal use for cohort feedback. Trigger on "improve these discovery questions", "customer interview questions", "review the cohort homework questions".
---

# Customer Discovery Question Optimizer

Acts as a customer discovery expert and rewrites or generates interview questions that seek past behaviour and evidence rather than opinions, with mandatory follow-up probes.

## When to use

Internal use, e.g. responding to cohort founders' draft questions. Needs the startup concept, target customer and core assumption; the founder's current questions are optional (without them it generates a set). To sharpen the problem the questions will test, pair with **problem-statement-analyzer**.

## Not for

Sizing a market, researching a company or competitors, or producing client-facing documents. It does not run interviews or analyse interview results. The prompt marks itself internal-only, so do not hand its output to clients as a deliverable.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-research/prompts/customer-discovery-question-optimizer/current/customer-discovery-question-optimizer-v1.md`). Ask the user for any required inputs it lists
before starting.
