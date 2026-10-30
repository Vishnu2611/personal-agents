---
name: Speaking Engagement Pre-Event Email Campaign to Convert RSVPs to Attendees
notion_page_id: 36db19fdbedb804da1f4d79ae0bec1a9
notion_url: https://app.notion.com/36db19fdbedb804da1f4d79ae0bec1a9
version: ""
status: Not started
pulled_on: 2026-06-29
---

## Properties

- **Name:** Speaking Engagement Pre-Event Email Campaign to Convert RSVPs to Attendees
- **Benefit:** (empty)
- **Cost Estimate per Run:** (empty)
- **Description:** (empty)
- **Downstream:** (empty)
- **Inputs Required:** (empty)
- **Latest Version:** (empty)
- **Outputs Produced:** (empty)
- **Status:** Not started

**Reflection Criteria:**

The output is successful **if and only if**:
1. **One primary CTA per email.** No CTA stuffing within a single email. Secondary asks live below the fold, not as competing CTAs.
2. **Benefit-led subject lines.** Tell the recipient what they'll get or learn, not just that an event is happening. No vague claims ("don't miss," "exciting opportunity," "world-class").
3. **Presenter intro is human, not corporate.** 1–2 lines, credibility through a shipped outcome, not a title.
4. **Concrete agenda preview.** Names the talk, the case study, and the demo (if any). Not "a fireside chat on AI."
5. **Warm tone.** Plain-spoken, no urgency manipulation, no salesy or vague language ("best-in-class," "leverage," "transformational," "synergy," "circle back").
6. **Channel orchestration respected.** Email 1 → LinkedIn → Email 2 in that order, spaced so no two channels hit the same recipient on the same day.
7. **Send window respected.** Email 1 at T-5 to T-3 business days; Email 2 at T-2 to T-1 business days. Flag any override before proceeding.
8. **LinkedIn note is one line, ≤ ~280 characters, references the event, no pitch.** Personalized to first name where possible.
9. **Personalization variables explicit.** Every recipient-specific token in the templates is a clearly named variable, not an instruction to "personalize here."
10. **VIP path called out.** If operator flags target-account VIPs in the list, output produces a separate single-contact high-touch variant for both emails, not the bulk template.
11. **Email 1 and Email 2 are genuinely distinct.** Different primary CTAs, different angles, no recycled subject lines, no "Reminder: …" framing. Email 2 must carry value of its own — a teaser, a question, a logistics anchor — not just nudge the recipient back to Email 1.

---

## Content

### Phase 0: Intake
Ask the operator for the following. **Do not proceed if any starred (\*) field is missing.**
**Event**
- Event name, date, time, format (luncheon / panel / keynote / fireside / meetup)
- Venue or virtual link
- Host org and any host-provided RSVP confirmation link
- Existing host comms cadence (so we don't duplicate)
**The talk**
- Talk title and 1-line description
- Case study being featured (default: GP / HubbIT)
- Demo description, if any (what we'll show on screen)
- 2–3 takeaway lines — what the audience walks away with
- One **value teaser** for Email 2 — a stat, a question, or a "come ready with X" prompt
**Presenter(s) and sender**
- Lead presenter: name, role, 1-line credibility anchor (a shipped outcome, not a title)
- Co-presenter, if any: same fields
- Sender identity for this campaign (presenter / Deep / sales) — default: lead presenter sends
- Sender's calendar link
- Sender's LinkedIn profile URL (for the LinkedIn track)
**RSVP list**
- Paste or attach the list with fields: name, title, company, email, LinkedIn URL, attended-before Y/N (if known)
- VIP / target-account flag for any recipients who should get the high-touch single-contact path
**CTAs**
- Email 1 primary CTA — default: "confirm your RSVP"
- Email 2 primary CTA — default: "add to calendar" or "submit a question for Q&A" (must differ from Email 1)
**Schedule**
- Send windows — confirm Email 1 at T-5 to T-3 business days, Email 2 at T-2 to T-1 business days
- LinkedIn timing — default T-3 to T-2 (slots between the two emails)
If any starred field is missing → **stop and ask the operator.** Do not infer.

---

### Phase 1: List validation & segmentation
Before drafting:
1. **Hygiene check.** Flag missing emails, malformed addresses, obvious duplicates, internal RightShift addresses that shouldn't get the send.
2. **VIP segment.** Separate any operator-flagged VIPs into a high-touch list. These get the two-touch single-contact variant, not the bulk template.
3. **CRM cross-reference flag.** Note any recipients who likely overlap with existing CRM/Apollo records, so operator can dedupe before send.
4. **LinkedIn-only segment.** Identify recipients with a LinkedIn URL but no email — they get the LinkedIn track only.
5. **Output:** segmentation summary table (bulk send count / VIP single-contact count / LinkedIn-only count / dropped count + reasons).

---

### Phase 2: Draft the campaign
**A. Bulk Email 1 — Awareness (T-5 to T-3 business days)**
Produce:
- 3 subject line options (benefit-led, ≤ ~60 characters)
- 1 body template, ~120–160 words, with named variables
- Primary CTA: confirm RSVP (default) or operator-specified
Required body elements, in this order:
1. **Opener** — warm, 1 line, names the event naturally
2. **Presenter intro** — 1–2 lines, credibility through a shipped outcome
3. **What you'll learn** — 2–3 bullets, concrete (talk title + case study + demo)
4. **Primary CTA** — single ask, clear link or action
5. **Secondary** (optional, below fold) — add to calendar / calendar link
**B. Bulk Email 2 — Activation (T-2 to T-1 business days)**
Produce:
- 3 subject line options (different angle from Email 1 — must not start with "Reminder:" or "Don't forget")
- 1 body template, ~70–110 words, with named variables
- Primary CTA: must differ from Email 1 (default: "add to calendar" or "submit a question for Q&A")
Required body elements, in this order:
1. **Opener** — light, warm, refers to the event being close
2. **Value teaser** — the operator-provided stat, question, or "come ready with" prompt. This is the heart of the email and the reason it deserves to land in the inbox.
3. **Quick logistics anchor** — venue / virtual link / time, in 1–2 lines
4. **Primary CTA** — different from Email 1, single ask
5. **Soft close** — 1 line, no signature pitch
Email 2 must **not** feel like a nag. Operating principle: *if the recipient only ever opens Email 2 and not Email 1, they still get something useful.*
**Voice rules (apply to both emails):**
- First-person from presenter
- No salesy/vague language (see Reflection Criteria #5)
- Show expertise through specificity, not adjectives
- One CTA per body. Calendar/secondary links go in P.S. or below the signature
**C. VIP high-touch single-contact variants** (only if VIPs flagged)
Produce two personalized emails per VIP recipient, mirroring the bulk cadence:
*VIP Email 1:*
- Subject is personalized to recipient
- Opener references a specific reason this person was invited (their work, their company, a known connection)
- Same agenda preview as bulk, but tied to their context
- Primary CTA: "want to grab 15 min before or after the event?"
*VIP Email 2:*
- Lighter follow-up, ~60–90 words
- References Email 1 briefly without re-pitching
- One specific reason this talk should matter to them
- Primary CTA: same meeting ask, or a "what would be most useful for you to hear on Tuesday?" question
**D. LinkedIn connection request note**
Produce 2 variants, each ≤ ~280 characters, one line, no pitch:
- References the event by name
- States the presenter is speaking
- Light, no ask beyond connecting
Example shape: *"Hi {{first_name}} — saw you RSVP'd for {{event_name}} Tuesday. I'm presenting alongside [co-presenter] and figured we should connect ahead of it."*

---

### Phase 3: Reflection block (mandatory)
1. Generate the draft internally.
2. Critique against the 11 Reflection Criteria above. **Pay extra attention to #11 — that Email 1 and Email 2 are genuinely distinct.**
3. Identify the 2–3 weakest elements.
4. Revise those elements.
5. **Output the final version only.** Do not show the draft or the critique.

**Phase 4: Final output format**
# [Event Name] — Pre-Event Campaign
## Segmentation summary
<table header-row="true">
<tr>
<td>Segment</td>
<td>Count</td>
<td>Notes</td>
</tr>
<tr>
<td>Bulk email (both touches)</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>VIP single-contact (both touches)</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>LinkedIn-only</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>Dropped (bad email, dup, internal)</td>
<td>…</td>
<td>…</td>
</tr>
</table>
## Send schedule
<table header-row="true">
<tr>
<td>#</td>
<td>Channel</td>
<td>Audience</td>
<td>Send time</td>
<td>Primary CTA</td>
<td>Owner</td>
</tr>
<tr>
<td>1</td>
<td>Email 1 — Awareness</td>
<td>Bulk list</td>
<td>T-5 to T-3 business days</td>
<td>Confirm RSVP</td>
<td>…</td>
</tr>
<tr>
<td>2</td>
<td>LinkedIn requests</td>
<td>Non-connected recipients</td>
<td>T-3 to T-2</td>
<td>(connect only)</td>
<td>…</td>
</tr>
<tr>
<td>3</td>
<td>Email 2 — Activation</td>
<td>Bulk list</td>
<td>T-2 to T-1 business days</td>
<td>Add to calendar / submit Q</td>
<td>…</td>
</tr>
<tr>
<td>—</td>
<td>VIP Email 1</td>
<td>VIP list</td>
<td>T-5 to T-3 (or earlier)</td>
<td>15-min meet</td>
<td>…</td>
</tr>
<tr>
<td>—</td>
<td>VIP Email 2</td>
<td>VIP non-repliers</td>
<td>T-2 to T-1</td>
<td>Meet or "what's useful" Q</td>
<td>…</td>
</tr>
</table>
## A. Bulk Email 1 — Awareness
**Subject options:**
1. …
2. …
3. …
**Body:**<br>[template with {{variables}}]
## B. Bulk Email 2 — Activation
**Subject options:**
1. …
2. …
3. …
**Body:**<br>[template with {{variables}}]
## C. VIP single-contact variants
[one block per VIP, each with VIP Email 1 + VIP Email 2 subject + body]
## D. LinkedIn connection request — 2 variants
1. …
2. …
## Open questions for operator
- [unresolved inputs, assumptions, or send-list cleanups to confirm before launch]
