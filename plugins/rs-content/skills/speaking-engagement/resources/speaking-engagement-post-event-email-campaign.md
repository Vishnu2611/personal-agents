---
name: Speaking Engagement Post Event Email Campaign
notion_page_id: 36db19fdbedb80c6bd24c4391c720a99
notion_url: https://app.notion.com/36db19fdbedb80c6bd24c4391c720a99
version: ""
status: Not started
pulled_on: 2026-06-29
---

## Properties

- **Name:** Speaking Engagement Post Event Email Campaign
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
1. **Body copy not invented.** Email body copy is pulled from the canonical Email Templates page. The prompt does not rewrite the templates — it fills variables and tailors per-recipient `{{specific_insight}}` where applicable.
2. **All 3 touches produced.** Email 1 for all valid recipients, Email 2 for non-repliers, Email 3 for those still unconverted.
3. **Email 2 non-replier filter is explicit.** Output names the filter logic used and lists who was excluded and why (replied / booked meeting / opted out).
4. **Email 3 filter is inclusive of Email 1 + Email 2 non-engagers.** Re-includes people who never engaged at all, not just Email 2 non-repliers.
5. **`{{specific_insight}}` populated per recipient for Email 2.** No literal `{{specific_insight}}` token left in any final draft. Insight is concrete, tied to recipient's industry / company / role — not generic.
6. **All variables resolved per recipient.** No `{{first_name}}`, `{{event_name}}`, `{{event_short}}`, `{{deck_link}}`, `{{case_study_link}}`, `{{calendar_link}}`, `{{presenter_signature}}` left unfilled in any output draft.
7. **Voice preserved.** Templates' warm, hands-on, non-salesy voice is maintained through personalization. No introduced salesy or vague language ("best-in-class," "leverage," "transformational," "synergy").
8. **Send schedule honored.** Email 1 at T+1 to T+3 days; Email 2 at T+7 to T+10 days; Email 3 at T+14 to T+21 days. Flag any operator override before proceeding.
9. **Inbound triage queue produced.** Output includes a list of recipients who replied with intent — flagged for the 24h booking SLA from Phase 3.3 of the SOP.
10. **Newsletter handoff list produced.** Net-new attendees (those who attended the event and weren't already on the newsletter list) flagged for the monthly newsletter add — per Phase 3.2 of the SOP.

---

## Content

### Phase 0: Intake
Ask the operator for the following. **Do not proceed if any starred (\*) field is missing.**
**Campaign**
- Event Campaign page URL (Notion page containing the inline Contacts database)
- Event name and date
- Event short reference for natural prose (e.g., "last Tuesday's session")
- Email Templates source URL — **default:** [Email Templates for Post-Event Campaign](https://www.notion.so/36cb19fdbedb80c6b4c6e5bff536c367)
**Sender**
- Sender identity (presenter name, role)
- Presenter signature block (multi-line, as it should appear at the bottom of every email)
- Calendar link
**Assets**
- Deck link
- Case study link
- AI Gallery link (optional)
**Reply tracking**
- Source of reply / engagement data — how does the operator know who replied? (CRM/Apollo / email inbox / manual flag in Contacts db / other)
- What counts as "replied" — email reply only, or also calendar bookings + LinkedIn DMs?
**Touch being generated**
- Which touch is this run for — Email 1, Email 2, Email 3, or all three at once?
	- **Recommended pattern:** run separately per touch, so the non-replier filter uses fresh data
- For Email 2 + Email 3 runs only: confirm that reply data has been updated since the previous send
**Insight generation for Email 2**
- Delegate `{{specific_insight}}` to the v1.0 Event Follow-Up Email Generator Prompt? yes / no (**default: yes**)
- If no: operator provides insight per recipient inline, or the prompt generates from ICP + industry + company signals
**Phase 3 handoffs**
- Newsletter destination — where do net-new attendees get added? (Apollo list / mailing tool list URL / manual handoff)
- Inbound triage owner — who books the intro call within 24h of a high-intent reply?
If any starred field is missing → **stop and ask the operator.** Do not infer.

---

### Phase 1: Load + segment
1. **Fetch the contact list** from the Campaign page's inline Contacts database.
2. **Hygiene check.** Flag missing emails, malformed addresses, duplicates, internal RightShift addresses.
3. **Segment by event engagement** (if known):
	- Attended in person / virtually
	- RSVP'd but didn't attend
	- Net-new captured at event (off-list opt-ins)
4. **Apply engagement filter for this touch:**
	- **Email 1:** all valid recipients (attendees + RSVP-no-shows + net-new captures)
	- **Email 2:** Email 1 recipients **minus** anyone who replied with intent or booked a meeting
	- **Email 3:** Email 1 recipients **minus** anyone who replied to Email 1 OR Email 2 OR booked a meeting
5. **Output a segmentation summary** (who's getting this touch, who's excluded, why).

---

### Phase 2: Generate the requested touch(es)
For each recipient in the filtered list, fill the appropriate template from the Email Templates page.
**Email 1 — T+1 to T+3 days**
- Pick one of the 3 subject options from the templates page (default: option 1)
- Fill body with resolved variables:
	- `{{first_name}}` → recipient first name
	- `{{event_short}}` → operator-provided short reference
	- `{{deck_link}}` → operator-provided
	- `{{case_study_link}}` → operator-provided
	- `{{calendar_link}}` → operator-provided
	- `{{presenter_signature}}` → operator-provided
- Output: one full draft per recipient
**Email 2 — T+7 to T+10 days (non-repliers only)**
- Pick subject option from the templates page (default: option 1, with `{{event_name}}` and `{{recipient_company}}` resolved)
- For each recipient, resolve `{{specific_insight}}`:
	- **If delegated to v1.0 Event Follow-Up Email Generator Prompt** (default): call that prompt with the recipient's name, title, company, industry, ICP tag, and the event context. Take the generated insight (2–3 sentences) and substitute.
	- **If operator-provided:** use the operator's per-recipient insight block.
	- **If generating inline:** produce 2–3 sentences tied to the recipient's industry / company / a real RightShift project we've shipped that's relevant. No generic "AI is changing everything" framing.
- Fill remaining variables:
	- `{{first_name}}`, `{{event_short}}`, `{{recipient_company}}`, `{{calendar_link}}`, `{{presenter_signature}}`
- Output: one full draft per recipient
**Email 3 — T+14 to T+21 days (light-touch close)**
- Pick subject option from the templates page (default: option 1, with `{{event_name}}` resolved)
- Fill body with resolved variables:
	- `{{first_name}}`, `{{deck_link}}`, `{{case_study_link}}`, `{{event_name}}`, `{{calendar_link}}`, `{{presenter_signature}}`
- Output: one full draft per recipient

---

### Phase 3: Phase 3 handoffs
Two side-outputs the prompt produces alongside the email drafts:
**A. Inbound triage queue** (live throughout the campaign)
- Recipients who replied with intent at any point in the sequence
- Each row: name, company, what they said (1-line summary), suggested next action
- Flagged for the 24h booking SLA from SOP Phase 3.3
**B. Newsletter handoff list** (produced on Email 1 run)
- All net-new attendees (event opt-ins not already on the existing newsletter list)
- Each row: name, email, company, source flag ("captured at {{event_name}}")
- Ready to push to the operator-specified newsletter destination

---

### Phase 4: Reflection block (mandatory)
1. Generate the drafts internally.
2. Critique against the 10 Reflection Criteria above. Pay particular attention to:
	- Are any `{{variables}}` left unresolved in any draft?
	- Is the non-replier filter for Email 2 / Email 3 honest, or does it leak through people who should have been excluded?
	- Does each Email 2 `{{specific_insight}}` actually feel specific, or is it generic dressed up?
	- Has the template voice been preserved, or has personalization introduced salesy language?
3. Identify the 2–3 weakest drafts (or the weakest filter decision) and re-evaluate them specifically.
4. Revise.
5. **Output the final version only.** Do not show the draft or the critique.

**Phase 5: Final output format**
# [Event Name] — Post-Event Email Campaign · Touch [N]
## Segmentation summary
<table header-row="true">
<tr>
<td>Segment</td>
<td>Count</td>
<td>Notes</td>
</tr>
<tr>
<td>Recipients for this touch</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>Excluded — replied with intent</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>Excluded — booked meeting</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>Excluded — opted out / bounced</td>
<td>…</td>
<td>…</td>
</tr>
</table>
## Send schedule
<table header-row="true">
<tr>
<td>Touch</td>
<td>Send window</td>
<td>Recipients</td>
<td>Owner</td>
</tr>
<tr>
<td>Email 1</td>
<td>T+1 to T+3 days</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>Email 2</td>
<td>T+7 to T+10 days</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>Email 3</td>
<td>T+14 to T+21 days</td>
<td>…</td>
<td>…</td>
</tr>
</table>
## A. Email drafts — per recipient
[One block per recipient: subject + full body, ready to send]
### Recipient: [Name, Company]
**Subject:** …<br>**Body:**<br>…
[…]
## B. Inbound triage queue
<table header-row="true">
<tr>
<td>Name</td>
<td>Company</td>
<td>What they said</td>
<td>Suggested next action</td>
<td>Owner</td>
<td>Due (24h)</td>
</tr>
<tr>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
</tr>
</table>
## C. Newsletter handoff list (Email 1 run only)
<table header-row="true">
<tr>
<td>Name</td>
<td>Email</td>
<td>Company</td>
<td>Source</td>
</tr>
<tr>
<td>…</td>
<td>…</td>
<td>…</td>
<td>Captured at [Event Name]</td>
</tr>
</table>
## D. Open questions for operator
- [unresolved variables, filter ambiguities, recipients flagged for human review]
