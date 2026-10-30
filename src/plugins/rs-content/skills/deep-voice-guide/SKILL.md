---
name: deep-voice-guide
description: Reference voice guide for writing as Deep Kalina in email, newsletter and LinkedIn posts: core voice, anti-AI test, audience modes, opener/closer libraries, annotated examples and a pre-output generation checklist. Use it to draft or rewrite copy so it sounds like an operator, not marketing or AI. Trigger on "write this in Deep's voice", "make this sound like Deep", "voice guide for this email".
---

# Deep Voice Guide

The canonical voice reference for Deep Kalina's writing (email, bi-weekly newsletter, LinkedIn). It is a
prompt-ready guide, not a task prompt: concrete patterns, do/avoid lists, an Anti-AI Test and real annotated
examples that generation is checked against.

## When to use

Whenever copy has to be written, or rewritten, as Deep: a first-touch or follow-up email, a post-meeting
recap, a hard conversation, a newsletter issue or a LinkedIn post. Tell it the channel (and, for email, the
audience mode) and what the message needs to say. Other rs-content skills may be paired with this one when
their own prompt does not already define voice rules; do not use it to override a prompt that does.

## Not for

Client deliverables (BRDs, PRDs, proposals, decks) or anyone else's voice. It is a voice reference, so it
does not choose what to publish or run a campaign; pair it with the rs-content skill that does.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical guide (source:
`src/plugins/rs-content/prompts/deep-voice-guide/current/deep-voice-guide-v1.md`). Use the "Version 2"
section (Parts 0 to 5): detect the channel, load the matching Part, draft, then run the Anti-AI Test and
the generation checklist. The file also carries the superseded "Version 1" text and a changelog after
Part 5; ignore the Version 1 section unless asked. Ask the user for the channel, the audience and the
message before drafting.
