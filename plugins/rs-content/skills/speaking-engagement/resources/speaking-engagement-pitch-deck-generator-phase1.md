---
name: "Speaking Engagement Pitch Deck Generator — Phase 1: Proof-point validation"
notion_page_id: 36db19fdbedb80a89af0f94763a7e666
notion_url: https://app.notion.com/36db19fdbedb80a89af0f94763a7e666
version: ""
status: Not started
pulled_on: 2026-06-29
---

## Properties

- **Name:** Speaking Engagement Pitch Deck GeneratorPhase 1: Proof-point validation
- **Benefit:** `@user (user://8c49ec51-ee5a-4c6b-ae70-d4320b7b1b2b)` update all of these fields for 4 new prompts you inserted.
- **Cost Estimate per Run:** (empty)
- **Description:** (empty)
- **Downstream:** (empty)
- **Inputs Required:** (empty)
- **Latest Version:** (empty)
- **Outputs Produced:** (empty)
- **Status:** Not started

**Reflection Criteria:**

The output is successful **if and only if**:
1. **Structure adherence.** All 6 sections present, in order: speaker bios → story arc → case study → demo → operating principles → Q&A invitation.
2. **Sourced proof points.** Every number, percentage, dollar figure, or named outcome is traceable to a specific source. Zero fabricated stats.
3. **Concrete story arc.** Problem is a specific question someone actually asked. Discovery is a specific moment. Solution is something that actually shipped.
4. **Audience-fit case study.** Case study is tied to the event audience's ICP and pain — not dropped in as a default.
5. **Actionable principles.** Operating principles are framed as things the audience can apply Monday morning, not abstract philosophy.
6. **Intentional Q&A setup.** Includes 2–3 priming prompts the presenter can drop if the room is quiet.
7. **Named demo plan.** Demo specifies what gets shown, who runs it, and the backup plan if live demo fails.
8. **Co-presenter alignment.** If co-presented, slide ownership, intro lines, and handoffs are explicit.
9. **Voice.** Hands-on, plain-spoken, specific. No salesy or vague language ("best-in-class," "world-class," "leverage," "transformational," "synergy").
10. **Time-fit density.** Slide count and content density match the time slot. Rough guide: 1 slide per 1.5–2 minutes of talk time.
If any criterion fails on draft, revise that section before final output.

---

## Content

### Phase 0: Intake
Ask the operator for the following. **Do not proceed if any starred (\*) field is missing.**
**Event**
- Event name and date
- Format (luncheon / panel / keynote / fireside / meetup)
- Total time slot in minutes (talk + Q&A)
- Host organization and any topic prompt they gave
**Audience**
- Audience profile (titles, industries, expected size)
- Which RightShift ICP(s) overlap
- Specific audience pain to address — one sentence
**Presenter(s)**
- Lead presenter: name, role, bio link, top 2–3 credibility anchors
- Co-presenter scenario (sole / paired / panel) — if paired/panel, repeat the above per presenter
- Speaking time split if shared
**Content anchors**
- Case study to anchor on (default: GP / HubbIT; swap if pitched to a non-fit industry)
- Available collateral: existing decks, case studies, AI Gallery entries — paste links
- Demo capability for this event: live / recorded / none — and what specifically gets demoed
**Outcome**
- Desired post-event CTA (book a call / newsletter signup / specific service ask)
If any starred field is missing → **stop and ask the operator.** Do not infer.

---

### Phase 1: Proof-point validation
**The rule:** Every number on a slide must be one-sentence sourceable.
**Canonical examples** from the GP/HubbIT case in the [reference deck](https://www.notion.so/364b19fdbedb808e87c2ea652d80687e) — these are the shape of a properly sourced claim:
<table header-row="true">
<tr>
<td>Claim</td>
<td>Source</td>
</tr>
<tr>
<td>\$1M+ delivered to suppliers in first 18 months</td>
<td>GP/HubbIT case, reference deck</td>
</tr>
<tr>
<td>14M+ pounds diverted from landfills</td>
<td>GP/HubbIT case, reference deck</td>
</tr>
<tr>
<td>Gold Stevie 2025 American Business Awards</td>
<td>Public press / Stevie Awards</td>
</tr>
<tr>
<td>100K+ tons handled per week across 50+ years of GP Recycling</td>
<td>GP Recycling, reference deck</td>
</tr>
</table>
Before writing any slide content:
1. List every number, percentage, dollar figure, or named outcome that might appear on a slide.
2. For each, identify the source. Acceptable sources:
	- Existing case studies in Notion
	- Public press / awards (e.g., Stevie Awards)
	- AI Gallery entries
	- Notes from prior decks where the source is documented
3. Output a **proof-point ledger**: claim → source → confidence (high / medium / low).
4. Any low-confidence claim → flag for operator confirmation or drop from the deck.
This ledger ships with the final output as Appendix A.

---

### Phase 2: Draft the six sections
For each section, produce: working slide title(s), 2–4 bullets per slide, speaker notes (1–2 sentences per slide).
**Section 1 — Speaker bios + credibility anchors** (1–2 slides)
- Lead with what they've shipped, not what they've titled.
- 2–3 credibility anchors per presenter, each tied to a concrete outcome.
**Section 2 — Story-driven arc: problem → discovery → solution** (3–4 slides)
- Problem: a specific question someone actually asked (reference: *"Can I buy your trash?"* from the GP story).
- Discovery: the moment something clicked.
- Solution: what we built, what shipped, who used it.
**Section 3 — Real-world case study + proof points** (2–3 slides)
- Concrete story tied to the audience's ICP.
- 3–5 citeable proof points pulled from the Phase 1 ledger.
- Explicit "so what for this audience" line.
**Section 4 — Demo: live or recorded** (1–2 slides + the demo itself)
- Specify what's shown, who drives, what the audience sees change on screen.
- Backup plan if live demo fails.
**Section 5 — Operating principles / takeaways** (1–2 slides)
- 3–5 principles, each phrased as a Monday-morning action.
**Section 6 — Q&A invitation** (1 slide)
- 2–3 priming prompts the presenter can drop if the room is quiet.

---

### Phase 3: Reflection block (mandatory)
1. Generate the draft internally.
2. Critique against the 10 Reflection Criteria above.
3. Identify the 2–3 weakest sections.
4. Revise those sections.
5. **Output the final version only.** Do not show the draft or the critique.

**Phase 4: Final output format**
# [Event Name] — Deck Outline
## Logistics
- Date, format, time slot, presenter(s)
## Section 1: Bios
[slides + bullets + speaker notes]
## Section 2: Story Arc
[slides + bullets + speaker notes]
## Section 3: Case Study + Proof Points
[slides + bullets + speaker notes]
## Section 4: Demo
[demo plan + backup]
## Section 5: Operating Principles
[3–5 Monday-morning principles]
## Section 6: Q&A Invitation
[priming prompts]

---

## Appendix A — Proof-point ledger
<table header-row="true">
<tr>
<td>Claim</td>
<td>Source</td>
<td>Confidence</td>
</tr>
<tr>
<td>...</td>
<td>...</td>
<td>...</td>
</tr>
</table>
## Appendix B — Co-presenter alignment gate (REQUIRED if co-presented)
> **Deck is not locked until all four are confirmed with the co-presenter.**
- [ ] Speaking time per person — [X min / Y min]
- [ ] Slide ownership — [which slides each presenter drives]
- [ ] Intro and handoff lines — [scripted or bulleted]
- [ ] Demo owner + backup plan if live demo fails — [who runs it, what we fall back to]
## Open questions for operator
- [any unresolved input or assumption to flag]
