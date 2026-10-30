---
name: Speaking Engagement RSVP & Event Attendee Contact List Enrichment
notion_page_id: 36db19fdbedb80999d97e9f6585c791c
notion_url: https://app.notion.com/36db19fdbedb80999d97e9f6585c791c
version: ""
status: Not started
pulled_on: 2026-06-29
---

## Properties

- **Name:** Speaking Engagement RSVP & Event Attendee Contact List Enrichment
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
1. **Source of truth respected.** ICP definitions come **only** from the supplied ICP Profile source. No invented categories, no merging similar-sounding ICPs, no inference from general knowledge.
2. **Every contact gets an action.** Every row gets either an ICP tag or a flag (needs review / no fit / missing data). No row is silently skipped.
3. **One ICP per contact by default.** Multi-tag only if operator opts in at intake, or if a contact clearly straddles two ICPs (in which case both are listed with separate confidence scores).
4. **Confidence score is honest.**
    ◦ **High** = title + company + industry all align with the ICP definition
    ◦ **Medium** = 2 of 3 align
    ◦ **Low** = 1 of 3 aligns or signal is weak
    ◦ Anything below the configured threshold (default: high) routes to needs-review, not auto-tag.
5. **Reasoning per row.** One sentence citing the specific signal that drove the match (e.g., "VP Innovation at Fortune 500 industrial — matches Enterprise Innovation Leader ICP on title + industry").
6. **Missing data surfaced, not guessed.** If title, company, or industry is missing, flag — don't infer from name or email domain.
7. **Edge cases routed correctly.** Ambiguous contacts (e.g., "Director" at an unknown LLC) → needs-review with a recommendation, never auto-tagged.
8. **Segmentation summary produced.** Aggregate counts per ICP + needs-review + no-fit, with percentages.
9. **Notion write-back instructions are explicit.** Output specifies the target property name and exact value per row, but the prompt itself never writes to Notion.
10. **No fabrication.** Don't invent titles, companies, industries, or signals. Use only what's in the contact row + what's in the ICP Profile source.

---

## Content

### Phase 0: Intake
Ask the operator for the following. **Do not proceed if any starred (\*) field is missing.**
**Sources**
- Notion database URL containing the contact list (typically the inline Contacts db on a Campaign page)
- ICP Profile source URL — the canonical source of truth. Can be a Notion page, a public URL, or a list of URLs (e.g., the 5 rightshift.co landing pages)
- Property name on each contact row where the ICP tag should be written (e.g., "ICP" — and whether it's select or multi-select)
**Campaign context**
- Campaign / event name this enrichment is for (gets attached to the audit trail)
- Intended ICP focus for this campaign, if any — used to prioritize but never to override an honest match
**Configuration**
- Multi-tag allowed? yes / no — default: no
- Confidence threshold for auto-tag: medium / high — default: high
- Should "no-fit" contacts be flagged for removal from the campaign? yes / no — default: yes
If any starred field is missing → **stop and ask the operator.** Do not infer.

---

### Phase 1: Load + parse
1. **Fetch the ICP Profile source.** Extract each ICP with:
	- ICP name
	- Target titles / roles
	- Target industries / verticals
	- Target company size or stage
	- Key buying signals or pains (if defined)
2. **Fetch the contact list.** Extract each contact's:
	- Name, title, company, industry (if present)
	- LinkedIn URL, email
	- Any free-text notes
3. **Output an ICP Definitions Snapshot** — the operator can sanity-check that the prompt parsed the source correctly before tagging starts. If the snapshot looks wrong, stop and ask the operator.

---

### Phase 2: Tag each contact
For each contact:
1. Match the contact against each ICP definition on title, company, industry, and any other available signals.
2. Score the match: high / medium / low / no-fit.
3. Apply the highest-confidence match if it meets the configured threshold. Otherwise route to needs-review.
4. Write the per-row record:
`{<br>  name: …,<br>  title: …,<br>  company: …,<br>  industry: …,<br>  suggested_ICP: …,<br>  confidence: high | medium | low,<br>  reasoning: "<one sentence citing the specific signal>",<br>  action: AUTO-TAG | NEEDS-REVIEW | NO-FIT,<br>  missing_data: [list of missing fields, if any]<br>}`

---

### Phase 3: Reflection block (mandatory)
1. Generate the enrichment draft internally.
2. Critique against the 10 Reflection Criteria above. Pay particular attention to:
	- Are any contacts being silently dropped?
	- Are any ICPs being invented or merged from similar-sounding ones?
	- Are confidence scores honest, or biased toward auto-tagging?
3. Identify the 2–3 weakest matches and re-evaluate them specifically.
4. Revise.
5. **Output the final enriched list only.** Do not show the draft or the critique.

**Phase 4: Final output format**
# [Campaign Name] — Contact List ICP Enrichment
## A. Segmentation summary
<table header-row="true">
<tr>
<td>ICP</td>
<td>Count</td>
<td>% of total</td>
</tr>
<tr>
<td>…</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>Needs review</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>No fit</td>
<td>…</td>
<td>…</td>
</tr>
<tr>
<td>**Total**</td>
<td>…</td>
<td>100%</td>
</tr>
</table>
## B. Enriched list
<table header-row="true">
<tr>
<td>Name</td>
<td>Title</td>
<td>Company</td>
<td>Suggested ICP</td>
<td>Confidence</td>
<td>Reasoning</td>
<td>Action</td>
</tr>
<tr>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
</tr>
</table>
## C. Needs-review queue
<table header-row="true">
<tr>
<td>Name</td>
<td>Title</td>
<td>Company</td>
<td>Why flagged</td>
<td>Recommendation</td>
</tr>
<tr>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
</tr>
</table>
## D. ICP Definitions Snapshot (audit trail)
<table header-row="true">
<tr>
<td>ICP</td>
<td>Target titles</td>
<td>Target industries</td>
<td>Key signals</td>
</tr>
<tr>
<td>…</td>
<td>…</td>
<td>…</td>
<td>…</td>
</tr>
</table>
## E. Notion write-back instructions
- **Target database:** [URL from intake]
- **Target property:** [name from intake]
- **Auto-tag rows:** N rows ready to write — only the rows where Action = AUTO-TAG
- **Skipped:** M rows in needs-review queue (do not write until operator resolves)
- **Suggested next step:** operator reviews Section C, resolves flagged rows manually, then a separate write-back action updates Notion
## F. Open questions for operator
- [unresolved ambiguities, parser issues, or source-of-truth questions]
