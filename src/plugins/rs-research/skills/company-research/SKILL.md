---
name: company-research
description: Produces a prospect intelligence package (company overview and recent news, 3-5 tailored IntuitioLabs value-proposition ideas, case-study themes and talking points, and three email plus three LinkedIn reply drafts) from a prospect company name. Trigger on "research this prospect", "company research for <name>", "prep me for a call with <company>".
---

# Company Research

Turns a prospect company name that has shown positive interest into a sales engagement package: company intelligence, tailored value propositions, case-study themes and talking points, and drafted email and LinkedIn replies for the Sales Ops Tech and Account Executive.

## When to use

When a prospect has replied positively and you need to understand the company and prepare the follow-up. Needs the prospect company name; the prompt expects a research-enabled model run, and the output should be reviewed and edited before it goes to an Account Executive. This is research about one company; for a whole market use **market-analyzer**, and for competitor and viability analysis of a product idea use **competitive-and-market-research**.

## Not for

Producing client-facing documents (that begins in `rs-scoping`: opportunity-packet, then brd-generator), market sizing, or competitor analysis. The email and LinkedIn drafts are reply options for review, not a campaign or proposal.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-research/prompts/company-research/current/company-research-v1.md`). Ask the user for any required inputs it lists
before starting.
