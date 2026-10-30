---
name: chatbot-personality-rulebook
description: Defines a chatbot's voice and picks its personality (Professional, Friendly, Support, Technical Expert or Neutral), producing the verbatim personality prompt block to insert into the bot's system prompt. Takes the chatbot's audience and use case as input. Trigger on "pick a personality for this chatbot", "what voice should the bot have", "chatbot personality block for the system prompt".
---

# Chatbot Personality Rulebook

The IntuitioLabs source of truth for chatbot voice and personality. It fixes one voice (professional,
friendly, concise, 3-5 sentences by default), describes five selectable personalities with the use
cases each suits, and supplies a verbatim prompt block per personality to paste into a deployed
system prompt.

## When to use

Use when a chatbot needs its tone chosen or its `PERSONALITY` block written. The user picks one of the
five personalities (the prompt calls this Q8 in the Prompt Builder); the matching block goes into the
system prompt. This covers voice only. How the bot responds to frustration, refuses, escalates or
handles unknown answers is the separate `chatbot-behaviour-and-fallback` skill, which is its companion
and applies whichever personality is chosen. `chatbot-forge` builds and deploys the whole bot; its
system prompt lives in `config/system-prompt.md`, and this skill supplies the personality text for it.

## Not for

Building or deploying the chatbot (use `chatbot-forge`), and refusal, escalation and fallback rules
(use `chatbot-behaviour-and-fallback`). Not for client deliverables or published writing voice (see
rs-content).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-chatbot/prompts/chatbot-personality-rulebook/current/chatbot-personality-rulebook-v1.md`).
Ask the user for any required inputs it lists before starting.
