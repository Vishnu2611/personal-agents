## 9. Day 6 — Capstone (110 min)

### The premise

> **Halvorsen Air** — family-owned HVAC company, 200 technicians, six metros in the Southeast. Residential service and replacement.
>
> "We want a high-converting quote app. Our techs write quotes on-site, but homeowners don't approve them. The app looks dated and customers don't trust it. Build us something that converts."
>
> **Appetite: 6 weeks, 2 engineers, 1 designer. Fixed.**

### Evidence pack, supplied in full

- Same-day approval rate: 22%. Approval within 30 days: 41%.
- Average time between the tech leaving and the homeowner opening the quote PDF: 4.5 hours.
- Quote today: three price tiers labelled Good / Better / Best, no explanation of the difference, no photos, emailed as a PDF after the tech leaves.
- Homeowner survey, 6 verbatims. Themes: didn't understand what was broken; wanted to ask a spouse; suspected being upsold; couldn't tell urgent from optional; $9,400 with no breakdown; "I wanted a second opinion and never got around to it."
- Technician interviews, 4 notes. Themes: techs explain everything verbally at the house and none of it is written down; techs feel awkward asking for a decision on the spot; the best-closing tech takes photos on his own phone and texts them.
- Finance: 71% of approved jobs over $5,000 used third-party financing. Financing is applied for by phone, after approval.

### The pre-written feature list

1. Redesign the quote PDF with updated branding
2. Good/Better/Best three-tier pricing, kept as-is
3. In-app financing pre-qualification
4. Push notification to the homeowner every 24 hours until they decide
5. Photo capture of the failing part, attached to the quote
6. Technician leaderboard ranking close rates
7. E-signature approval on the tech's tablet before they leave
8. AI chatbot to answer homeowner questions about the quote

*Internal note, not shown to the lead:* 3, 5 and 7 are well-founded. 1 and 8 rest on nothing. 4 and 6 are harmful — 4 applies pressure to a high-anxiety purchase, and 6 pushes technicians toward overselling at a company whose stated problem is trust. 2 is founded but incomplete: the tiers aren't the issue, the missing explanation is.

### Deliverables (110 min)

| # | Deliverable | Time |
|---|---|---|
| 1 | Outcome brief and behaviour change | 10 |
| 2 | Why-ledger across all 8 items, root and confidence | 20 |
| 3 | Add 2 features, each with an evidence chain to a specific line in the pack | 15 |
| 4 | Cut 2 features, each with the accepted risk stated | 10 |
| 5 | Flow and failure table for the thin slice | 15 |
| 6 | Copy pass on the three highest-stakes strings | 10 |
| 7 | Build the thin slice in Claude Code. Spec-only rule applies | 25 |
| 8 | One-page handoff and a 5-minute walkthrough script | 5 |

### Capstone rubric (200 pts)

| Criterion | Pts | Notes |
|---|---|---|
| Evidence chains on additions | 40 | Each addition cites a specific line in the pack. "Users would like it" scores 0 for that item |
| Trade-off reasoning | 30 | Adds and cuts balance against the fixed appetite; the trade is named |
| Risk statement on cuts | 20 | What breaks if the cut is wrong |
| Caught the harmful items | 25 | Items 4 and 6 identified as harmful with the mechanism named, not just "annoying" |
| Caught the unfounded items | 15 | Items 1 and 8 |
| Diagnosis quality | 20 | Recognizes the problem is trust and comprehension at the moment of decision, not aesthetics |
| Flow and failure coverage | 15 | Includes the co-decision-maker and the financing branch |
| Copy quality | 15 | The three strings carry the trust load; plain, non-pressuring |
| Thin slice buildable and spec-only | 20 | Runs; implements only what the spec says. Each undocumented decision: −5 |

**Pass: 140/200. Distinction: 175/200.**

The highest-value finding available, if a lead gets there: the best-closing tech already solved this with photos and a text message. Most of the product is making that one behaviour standard.

---

**CONFIDENTIAL — RightShift. Internal use only.**
---

## Rules to reveal (only after the capstone is graded)

Give the lead the full RightShift Product Rules document at this point, and walk them through section 3 in particular:

- Present two costed options, then give your recommendation and label it as yours.
- Recommend against the bigger sale when the client isn't ready.
- Tie the rebuild trigger to a business number.
- Document the path you're not taking.
- Every addition brings complexity.

Then sections 9 and 10, which are what they carry into a live account next week.
