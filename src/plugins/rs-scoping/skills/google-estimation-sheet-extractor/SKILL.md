---
name: google-estimation-sheet-extractor
description: Copy every tab of a linked Google estimation sheet verbatim into a Notion page, with a template compliance check and explicit extraction gaps and no invented or recomputed values. Trigger on "extract the estimation sheet", "copy the Google sheet into Notion", "pull the estimate tabs for the proposal".
---

# Google Estimation Sheet Extractor

A high-fidelity extraction prompt, not a summariser. It reads all tabs of the Google Sheet linked
from a Notion page and writes them into a destination Notion page: metadata, a Template Compliance
Check (Architecture, Plan, Tech Stack and the other standard tabs), tab-by-tab content, Extraction
Gaps and a Do-not-use / Unverified list. Missing values are written as `MISSING / NOT FOUND`.

## When to use

Once an estimation exists as a Google Sheet (the step after **estimation-generator** in the chain), when its
contents must be captured exactly for proposal drafting, deck creation and cost decisions. It needs a
Notion page containing the Google Sheet link and a destination Notion page to write into.

## Not for

Creating or revising the estimate (use **estimation-generator**), summarising it for a user
audience (use **feature-pov-narrative**), or presenting and selling it (rs-sales). It never
recomputes totals or fills gaps.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-scoping/prompts/google-estimation-sheet-extractor/current/google-estimation-sheet-extractor-v1.md`).
Ask the user for any required inputs it lists before starting.
