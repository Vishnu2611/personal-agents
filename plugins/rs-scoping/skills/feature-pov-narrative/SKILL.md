---
name: feature-pov-narrative
description: Turn a pasted feature estimation sheet into a plain-English user-perspective narrative (what the product is, who the typical user is, a non-technical walkthrough of each feature). Trigger on "write the user POV narrative", "explain this estimate in plain English", "feature walkthrough for the proposal".
---

# Feature POV Narrative

Reads a feature estimation sheet and writes a conversational, jargon-free explanation of what the
product is, who uses it, and what the user does and experiences in each feature, skipping
infrastructure items such as DevOps, buffer days and internal calls.

## When to use

After the **estimation-generator** has produced the feature estimation sheet: paste the sheet (the
feature/estimate list, plus any target user or persona context) and run this to get the narrative
for the estimation deck or proposal insert. Its listed downstream is Gamma platform proposal
generation.

## Not for

Producing or changing the estimate itself (use **estimation-generator**), and not for building the
proposal or deck (that is rs-sales). It narrates the sheet it is given and does not add scope.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-scoping/prompts/feature-pov-narrative/current/feature-pov-narrative-v1.md`). Ask the
user for any required inputs it lists before starting.
