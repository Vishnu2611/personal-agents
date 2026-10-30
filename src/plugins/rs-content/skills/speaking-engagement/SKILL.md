---
name: speaking-engagement
description: Four-phase speaking-engagement campaign kit: speaker pitch-deck outline with proof-point validation, pre-event email campaign to convert RSVPs, RSVP/attendee contact-list ICP enrichment, and post-event email campaign. Each phase has its own prompt. Trigger on "prep a speaking engagement deck", "pre-event emails for our RSVPs", "post-event follow-up emails".
---

# Speaking Engagement

Four separate prompts covering a talk end to end: build the deck outline, email RSVPs before the event, tag
and enrich the contact list by ICP, then follow up after the event. Each is gated with an intake, a
mandatory reflection block and a fixed output format.

## When to use

When RightShift is giving or hosting a talk or event and needs one of the campaign phases. Run one phase at
a time; each states its own inputs (event, audience, presenters, RSVP list, ICP profile, templates, links).

## Not for

Client deliverables. It is not a general outreach skill (outbound campaigns live in rs-sales) and does not
write the underlying case study (see case-study-and-testimonial-generator).

## How to run

Ask which phase the user needs, then read only that file from `resources/` and follow it exactly. Do not
read the other phase files. Ask for the inputs its intake lists before starting.

| Phase | Resource file |
|---|---|
| Pitch deck (proof-point validation, deck outline) | `resources/speaking-engagement-pitch-deck-generator-phase1.md` |
| Pre-event email campaign (convert RSVPs to attendees) | `resources/speaking-engagement-pre-event-email-campaign.md` |
| RSVP and attendee contact enrichment (ICP tagging) | `resources/speaking-engagement-rsvp-contact-enrichment.md` |
| Post-event email campaign | `resources/speaking-engagement-post-event-email-campaign.md` |

Sources live in `src/plugins/rs-content/prompts/speaking-engagement/current/`. Each file starts with a
Notion "Properties" block of mostly empty fields; ignore it. The pitch-deck prompt cites a GP/HubbIT case as
its canonical example; use it only as an example and replace it with the user's own case and proof points.
