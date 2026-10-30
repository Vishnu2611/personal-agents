---
name: kickoff
description: Entry point for rs-delivery — asks New application or Single feature, then states and hands off to the matching pipeline. Trigger on "start a new project", "build a new app", "start delivery", or automatically at the first ticket/feature request in a session with no branch chosen yet.
---

# Kickoff

The one place `rs-delivery` picks a branch before any other skill runs. Every other skill in this
plugin assumes the branch is already known; this skill is what decides it, states the matching
pipeline out loud, and hands off to the branch's first real stage — it does not execute the pipeline
itself.

## How to run

### 0. Load the project context

If `docs/agents/project-context.md` exists, read it, then fetch the pages it links through the Notion
MCP (at least the project home and the approved PRD). They tell you what is already decided and where
the project stands. If the Notion MCP isn't connected, tell the human to connect and sign in (`/mcp`),
and stop: don't plan from memory. If the file doesn't exist, the repo is the whole context; carry on.

If `.rs-harness.json` names a `role` (`fe`, `be` or `infra`), this repo is one part of a multi-repo
project. The BRD, PRD and Technical Design are written once in Notion for the whole project, not per
repo, so this repo's work starts at `spec-generator` for its own slice (step 2 below is already done,
in Notion), or at the ticket for a change request (step 3). Say which, and name the repo's role.

### 1. Pick the branch — ask if not already obvious

Two branches, chosen once per project/ticket, never assumed silently:

- **New application** — a new app or a substantial new surface within an existing one, needing its
  own business case, product spec, and architecture before any feature is designed or built.
- **Single feature** — one feature or ticket-sized change against an existing, already-understood
  app. No new BRD/PRD/Technical Design.

If the human's request already makes this obvious ("build me a new SaaS app for X" vs "add a filter
to the dashboard"), state which branch and confirm rather than asking from scratch — but always state
it; never silently assume the lighter branch just because no ticket was named.

### 2. New application branch

```
Repo Knowledge Base + Design Guidelines (once, if not already run)
        │
        ▼
rs-scoping:brd-generator               (optional — business case)
        │
        ▼
rs-scoping:prd-generator               (required — product spec)
        │
        ▼
rs-scoping:technical-design-generator  (architecture + component inventory)
        │
        ▼
rs-delivery:spec-generator             (Phased mode, all features, Input P = the approved PRD)
        │
        ▼
Human review of the full specs/ package
        │
        ▼
per feature: feature-design-brief → [feature-prototype gate] → /implement, or /to-tickets → /implement-spec
        │
        ▼
qa-verify-report → ship-with-ticket
```

State this pipeline, confirm `Design Guidelines/design-system.md` and `manifest.yaml` exist or need
producing first (top of the diagram), then hand off to `rs-scoping:brd-generator` (if the
human wants a business case first) or straight to `rs-scoping:prd-generator`.

### 3. Single feature branch

```
ticket-intake                    (optional — may start from a direct ask instead)
        │
        ▼
/grill-with-docs                 (human types it — design interview; updates GLOSSARY.md / docs/adr/)
        │
        ▼
/to-spec                         (human types it — posts the agreed spec to the issue tracker)
        │
        ▼
rs-delivery:spec-generator             (Single-Feature Mode, Input P-alt = Ticket Brief +
                                        the /to-spec spec — no PRD)
        │
        ▼
feature-design-brief → [feature-prototype gate] → /implement, or /to-tickets → /implement-spec
        │
        ▼
qa-verify-report → ship-with-ticket
```

State this pipeline, then hand off to `ticket-intake` (if the work starts from a ticket), or — if the
human is describing the feature directly — tell them to type **`/grill-with-docs`** to start the design
interview. `/grill-with-docs` and `/to-spec` (both from the `mattpocock-skills` plugin) can only be
started by the human: don't invoke them, and don't recreate them by calling the `grilling` /
`domain-modeling` skills yourself. Starting a phase is the human's call.

### 4. What doesn't change between branches

Both branches converge on the same shape from `feature-design-brief` onward — the same Prototype Gate,
the same TDD implementation off a `tasks.md` produced by `rs-delivery:spec-generator`, the same
`qa-verify-report` and `ship-with-ticket`. The branch only changes what runs *before* `spec-generator`:
a full BRD/PRD/Technical-Design process for a new application, or nothing but a Ticket Brief, a
`/grill-with-docs` interview and its `/to-spec` spec for a single feature. Implementation never starts from an ad-hoc plan
in either branch — always from `spec-generator`'s TDD-formatted `tasks.md`.

### 5. Hand off, don't orchestrate

State the chosen branch and its first stage's name out loud, then stop — don't invoke the next skill
silently and don't try to run the whole pipeline from inside this one skill. Same convention every
other `rs-delivery` skill already follows.

## Inputs you need from the user

- **Read, not asked:** `docs/agents/project-context.md` and the Notion pages it links, when present.
- **Required:** New application vs Single feature (Step 1) — confirm even when it looks obvious from
  the request.
- **Optional:** whether to run `brd-generator` for a new application (defaults to asking, not skipping
  silently); whether the work starts from a ticket.

## Output

No file of its own — states the chosen branch and hands off to that branch's first stage
(`rs-scoping:brd-generator` / `:prd-generator`, or `ticket-intake` / the human typing `/grill-with-docs`).
