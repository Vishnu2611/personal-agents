---
name: opportunity-packet
description: Build an Opportunity Packet (a Notion database plus an entry in the Opportunities index) from a meeting transcript and related email threads, with a scope description and flagged gaps and nothing invented. Trigger on "create an opportunity packet", "build the packet from this call and email thread", "set up the opportunity for <project>".
---

# Opportunity Packet

Creates a new Notion database for a prospect opportunity from a linked transcript and the confirmed
email threads, writes three rows (Transcript, Email summary, Estimation Scope Description), and adds
a packet-level entry in the master Opportunities index. It uses only what the transcript and emails
say, marks anything inferred, and checks with the user at each step.

## When to use

At the very start of the scoping chain, when you have a meeting transcript or notes page and the
related email threads for a prospect. The prompt lists the packet's downstream consumer as the PRD
Generator, and it is the raw input the **brd-generator** reads, so run it before **brd-generator**.
It needs: project name, packet owner, transcript page URL(s), email search keywords, and optionally
a parent page URL (default: the Opportunities wiki/index; never the Delivery area).

## Not for

Turning the packet into a BRD, PRD, technical design or estimate (use **brd-generator** and the
skills after it), and not for presenting or selling the result (that is rs-sales). It does not
research the prospect (rs-research) and it does not invent scope to fill gaps.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-scoping/prompts/opportunity-packet/current/create-opportunity-packet-v1.md`). Ask the
user for any required inputs it lists before starting.
