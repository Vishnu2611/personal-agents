---
name: contract-creator
description: Draft a tailored first-draft contract (SOW, MSA, NDA or similar) as a Word document from deal inputs and IntuitioLabs precedent contracts, with a sourced commercial-terms table, rate-card approval and a clause-by-clause plan before drafting. Trigger on "draft a contract", "create a SOW for this deal", "contract for this client".
---

# Contract Creator

A standardised contract-drafting prompt (v2): acts as counsel for IntuitioLabs, never invents commercial terms or legal clauses, cites the source of every clause, and gates drafting behind an intake, a commercial-terms table, rate-card approval and an approved drafting plan before producing the `.docx` and cover notes.

## When to use

When a deal needs a first-draft agreement. The prompt asks for client and entity, project, source inputs (Notion link, deck, emails, transcripts), existing/new client, MSA status, engagement model and risk level. It was written for a Claude.ai project: it expects `/mnt/skills`, `/mnt/user-data/outputs` and `present_files`, and a knowledge base of precedent contract PDFs (MSA, SOW1, SOW2, Fixed-Bid, TC Extension) that this plugin does not ship. The user must supply those precedent documents, and the output location must be adapted to the current environment. The past-client rate cards and defaults listed in it are reference examples only, shown for approval, never applied without the user's explicit approval. Output is a draft for counsel review, not final legal advice.

## Not for

Producing the scope or estimate that feeds the contract — use `rs-scoping`. Not for the proposal or pitch decks (see the deck skills in this plugin). Not for reviewing client communications — see `rs-content`.

## How to run

Read `resources/prompt.md`. Use only the text between `---BEGIN PROMPT---` and `---END PROMPT---` as the prompt and follow it exactly; ignore the Notion property header, the "paste the entire block into a new Claude chat" preamble, and the trailing "Changelog vs v1" section. Source: `src/plugins/rs-sales/prompts/contract-creator/current/contract-creator-v1.md`. Start with the Step 1 intake questions and ask the user to supply the precedent contracts if they are not available.
