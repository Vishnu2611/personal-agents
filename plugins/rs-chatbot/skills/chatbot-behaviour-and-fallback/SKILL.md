---
name: chatbot-behaviour-and-fallback
description: Specifies how every chatbot behaves, covering non-negotiable rules, signal-based response logic, formatting, hard and soft refusals, escalation triggers, an edge-case table and an optional RAG retrieval block, to include in the bot's system prompt. Applies regardless of personality. Trigger on "chatbot fallback rules", "what should the bot do when it doesn't know", "define chatbot escalation and refusal behaviour".
---

# Chatbot Behaviour and Fallback

The IntuitioLabs ruleset for how a chatbot behaves, independent of its voice. It has seven parts:
non-negotiable rules (answer first, never hallucinate, say so when unknown, no filler), response
adaptation by user signals, formatting rules, hard and soft refusal patterns, escalation triggers, an
edge-case reference table, and a RAG add-on block for bots with a retrieval knowledge base.

## When to use

Use when specifying or reviewing a chatbot's behaviour, refusals, escalation and "I don't know"
handling. The rules apply universally, whichever personality is chosen. Append the Part 7 RAG block
only when the bot uses a retrieval-augmented knowledge base. Escalation patterns contain
`[escalation contact]` and `[resource]` placeholders the user must fill in. This is the companion to
`chatbot-personality-rulebook` (voice). `chatbot-forge` builds the bot and enforces a refusal clause
tested in its grounding phase; this skill supplies the wider behaviour rules for the system prompt.

## Not for

Choosing the bot's voice or personality (use `chatbot-personality-rulebook`), building, grounding or
deploying the bot (use `chatbot-forge`), or writing the knowledge base.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-chatbot/prompts/chatbot-behaviour-and-fallback/current/chatbot-behaviour-and-fallback-v1.md`).
Ask the user for any required inputs it lists before starting.
