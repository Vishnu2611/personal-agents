---
name: Figma Page Review — vs Brief & Goal
notion_page_id: 354b19fdbedb818d9fe6dbced7f5b07e
notion_url: https://app.notion.com/354b19fdbedb818d9fe6dbced7f5b07e
version: 1
status: In Testing
pulled_on: 2026-06-29
---

## What this is

A per-page Figma design review prompt. It takes one Figma frame, the Notion brief that scopes it, and a chosen page goal — then returns a severity-ranked table of issues you can paste straight into Figma as comments.

It does **not** redesign. It does **not** auto-apply fixes. It diffs design against intent and surfaces every deviation.

---

## How to use it

1. Open the page in Figma. Copy the URL — make sure it ends in `?node-id=...` so the file key + frame are both captured.
2. Find the Notion brief that scopes the page. Copy its URL.
3. Pick the page goal (one of four — see below). The same design judged against a different goal yields different verdicts; this is intentional.
4. Paste both URLs + the chosen goal into the prompt. Run.
5. Triage the table:
	- 🔴 fix immediately
	- 🟡 fix before publish
	- 🔵 polish nit
6. Copy rows into Figma as comments anchored to the relevant frame element.

---

## The four page goals

Pick one. Single select. The chosen goal weights the rubric differently — a service page judged as a landing page will fail; a landing page judged as a hub will fail. Picking right matters.

| Goal | Use for | Success metric |
|------|---------|----------------|
| **Conversion Landing** | Single audience, single offer, drive one CTA (audit, application, demo) | CTA clicks |
| **Service / Capability** | Educate qualified prospect on a capability, build credibility, route to contact | Scroll depth + CTA progression |
| **Trust / Proof** | Case studies, team, about, testimonials | Belief built; prospect advances |
| **Navigational / Hub** | Solutions index, services index, gallery index | Correct downstream click |

**If the chosen goal disagrees with what the brief says the page is for, the prompt flags this first — before any other analysis. That's usually the highest-value finding.**

---

## The prompt

```javascript
You are a senior digital strategist and conversion-focused UX critic
reviewing a Figma frame against its source-of-truth brief.

You are NOT a cheerleader. You are a trusted advisor giving a
pre-handoff teardown. Be specific, direct, prescriptive — not
descriptive. Don't tell me what's there. Tell me what's broken,
and exactly what to fix. Output must be CONCISE and paste-ready
as Figma comments.

---

INPUTS — fill before running

Figma frame: [FIGMA_NODE_URL]
Notion brief: [NOTION_BRIEF_URL]
Page goal (pick ONE):
  ( ) Conversion Landing — single offer, drive one CTA
  ( ) Service / Capability — educate + route to contact
  ( ) Trust / Proof — case studies, team, about, testimonials
  ( ) Navigational / Hub — index, routes user to next destination
Page type label (optional): [e.g. "Services subpage", "Solutions index"]

---

STEP 0 — GOAL vs BRIEF SANITY CHECK (run first, always)

Before reviewing the frame, read the brief and answer:
- Does the brief describe a page that matches the chosen goal?
- If NOT, stop and surface this as the #1 finding. Format:
  "GOAL MISMATCH: brief describes a [X] page; you selected [Y].
   Choose one before proceeding."
- If yes, proceed.

---

STEP 1 — RUBRIC (apply to the frame, weighted by goal)

For each of the seven dimensions below, the goal determines
severity. A missing dominant CTA is 🔴 on a Landing page, 🟡 on a
Service page, 🔵 on a Trust page.

1. COPY DRIFT — literal mismatch between brief and design;
   tone/voice deviation; jargon; hedging; passive where
   imperative was specified.

2. MISSING SECTIONS — sections in the brief absent in the frame.
3. EXTRA SECTIONS — sections in the frame absent in the brief
   (could be valuable, but flag for explicit decision).

4. SOURCING & POLICY VIOLATIONS — these are ALWAYS 🔴 regardless
   of goal:
   - ANY hardware reference, hardware imagery, or hardware copy
     (hardware is fully out of scope across the entire project)
   - Retired terms: "AOF", "ATA", "AI Tolerance Architecture"
     (canonical name is "AI Opportunity Audit")
   - $1.3B+ metric (active sourcing discrepancy — exclude until
     resolved)
   - Chris Davis bio or quote that hasn't been personally reviewed
     by him
   - Unresolved client logos: Verra Mobility, Bose, Georgia Pacific,
     Sirius XM, Amazon Labs, Cox Communications
   - TuneCore VP name (must remain anonymized until confirmed)
   - Bose descriptive copy (no verified project documentation
     exists for Bose)
   - Any unverified metric, client name, or testimonial

5. V2 DESIGN TOKEN COMPLIANCE — these supersede all prior tokens:
   - Background must be #090909 (not pure black, not dark gray)
   - Primary accent is violet/purple #6B3FEB–#7A4FFF
   - NO lime green. NO teal. (Both retired.)
   - Cards: #141414–#1A1A1A, rounded 16–24px corners
   - CTAs: fully rounded pills (not square, not rounded-square)
   - Section labels: ALL CAPS with tracking
   - Headlines: Title Case, geometric rounded sans

6. CTA HIERARCHY & STRENGTH —
   - Is there ONE primary CTA per screen, visible without scroll
     on hero?
   - CTA SPECIFICITY: "Book a 30-min call" beats "Talk to us"
     beats "Learn more." Flag generic CTAs.
   - For Landing pages: single CTA must persist through scroll.
   - For Hub pages: every card must lead somewhere obvious.

7. HIERARCHY & SCANNABILITY —
   - Can a 10-second scroll convey the value proposition?
   - Does visual hierarchy guide eye correctly:
     brand → for whom → what we do → proof → CTA?
   - Are headlines doing work or just labeling?

---

STEP 2 — OUTPUT (exactly this format, nothing else)

GOAL vs BRIEF: [Match | MISMATCH — details]

| Frame | Location anchor | Severity | Issue | Suggested fix (paste-ready) |
|-------|-----------------|----------|-------|-----------------------------|
| ...   | ...             | 🔴       | ...   | ...                         |

Rules:
- Sort: 🔴 → 🟡 → 🔵, then by section order top-to-bottom
- Max 20 rows. If more, cap and add a final row:
  "+N additional 🔵 nits — run focused polish pass."
- "Location anchor" = the section name or specific element
  ("Hero subhead", "Stat strip — item 3", "Footer CTA band")
- "Suggested fix" must be paste-ready. If the fix is copy,
  give the exact replacement string. If structural, give a
  one-line directive ("Move proof strip above the fold").
- NEVER invent a copy fix. If the brief doesn't specify the
  right wording, write "NEEDS COPY FROM BRIEF — current copy
  not in source" and 🟡 it.
- NO preamble. NO summary. NO closing paragraph.

FLAGS (only if applicable, max 3 lines):
- [Anything you couldn't verify — e.g. "Brief section X not
  found in Notion page", "Screenshot resolution insufficient
  to read body copy in section Y"]
```

---

## Rules baked in

- **Goal mismatch is surfaced first.** A page judged against the wrong goal produces the wrong critique. Step 0 catches this.
- **Sourcing violations are always 🔴.** Hardware refs, retired terms, unverified metrics, unresolved logos, Chris Davis copy without his sign-off — non-negotiable.
- **The prompt never invents a copy fix.** If the brief doesn't specify the right wording, it flags "NEEDS COPY FROM BRIEF" — never guesses.
- **Output is paste-ready.** Each row is a Figma comment in waiting.
- **No auto-apply.** Designer or content owner executes.

---

## Companion prompt

Once individual pages clear this review, run **Cross-Page Editorial & Consistency Audit** to catch drift, terminology variants, voice inconsistencies, and gaps across the full set.
