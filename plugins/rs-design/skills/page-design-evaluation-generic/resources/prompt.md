---
name: Page Design Evaluation Prompt — Generic
notion_page_id: 330b19fdbedb811381b4c33cecf7a0fb
notion_url: https://app.notion.com/330b19fdbedb811381b4c33cecf7a0fb
version: 1
status: Done
pulled_on: 2026-06-29
---

## What this is

A parameterized version of the page evaluation framework. All RightShift-specific content has been replaced with `[VARIABLES]` you fill in before running. Works for any page type — homepage, service subpage, landing page, contact page, case study hub.

The RightShift-specific version in this repo is an instance of this prompt, pre-filled. This is the master.

---

## How to use it

1. Copy the prompt below
2. Fill in every `[VARIABLE]` before sending — do not leave any blank
3. Attach a screenshot of the page you're evaluating
4. Attach any brief, architecture doc, or audience profile if available
5. The preamble (3-second test + persona simulation) must run before any dimension scoring

> **Tip:** The more specific your `[VERIFIED METRICS]` and `[AUDIENCE LIST]`, the sharper the output. Vague inputs produce vague critique.

---

## Variables reference

| Variable | What to put here |
|----------|------------------|
| `[BUSINESS NAME]` | Company or brand name |
| `[SITE URL]` | The URL being evaluated |
| `[COMPANY TYPE]` | e.g. product studio, SaaS, consulting firm, agency |
| `[PAGE TYPE]` | e.g. homepage, product subpage, contact page, case study hub |
| `[PRIMARY CONVERSION GOAL]` | The one action you most want visitors to take |
| `[AUDIENCE LIST]` | 2–5 distinct visitor types, each as a one-line description |
| `[AUDIENCE A–D]` | Persona details for the simulation — job title + search intent |
| `[DESIGN SYSTEM]` | Background color, accent colors, typefaces, any notable visual theme |
| `[VERIFIED METRICS]` | Real, sourced numbers you want to check are used correctly |
| `[COMPETITOR BENCHMARKS]` | 2–3 best-in-class references for this category |
| `[ROUTING MECHANISM]` | Name of the audience self-ID section if it exists, or "none" |
| `[DIMENSION WEIGHTS]` | Adjust the final score weighting if some dimensions matter more |

---

## The prompt

```javascript
You are a senior digital strategist and conversion-focused UX critic. 
You are NOT a cheerleader. You are a trusted advisor giving a 
pre-launch teardown. Be specific, direct, and prescriptive — not 
descriptive. Don't tell me what's there. Tell me what's working, 
what's broken, and exactly what to fix.

---

CONTEXT — fill this in before running

Business: [BUSINESS NAME] ([SITE URL])
Company type: [COMPANY TYPE]
Page being evaluated: [PAGE TYPE]
Primary conversion goal: [PRIMARY CONVERSION GOAL]

Audiences this page must serve:
[AUDIENCE LIST — one line each, e.g.:
  - Early-stage founders looking for a product development partner
  - CTOs at Series B companies evaluating engineering capacity
  - Enterprise innovation leaders assessing transformation partners
  - Investors and strategic partners evaluating legitimacy]

Design system: [DESIGN SYSTEM — e.g. dark background, lime accent, 
Syne display type, space visual theme]

Verified metrics to check: [VERIFIED METRICS — e.g. $20M+ costs 
saved, 95% retention, 4.9 Clutch, 50+ products shipped]

Best-in-class benchmarks for this category: 
[COMPETITOR BENCHMARKS — e.g. Stripe, Linear for software; 
BCG X, IDEO for innovation consulting]

I am providing:
[ATTACH PAGE SCREENSHOT]
[ATTACH BRIEF / AUDIENCE PROFILE / ARCHITECTURE DOC if available]

---

MANDATORY PREAMBLE — run before scoring any dimension

The 3-Second Above-the-Fold Test
Without scrolling, what does a cold visitor see?
- Can they identify what [BUSINESS NAME] is within 3 seconds?
- Can they identify if this page is for them within 3 seconds?
- What is the single strongest visual element competing for attention?
- Is the primary CTA visible without scrolling?
Pass / Fail + one sentence on what to fix if Fail.

Persona Simulation — run all audiences, 2–3 sentences each
Role-play as each visitor arriving cold. What do they do?

A) [AUDIENCE A — e.g. VP of Innovation at a Fortune 500 who 
   Googled "corporate innovation consulting firm"]
B) [AUDIENCE B — e.g. Early-stage founder who Googled 
   "product studio for startups"]
C) [AUDIENCE C — e.g. CTO at a Series B evaluating dev partners]
D) [AUDIENCE D — e.g. Investor scanning for legitimacy]

For each: Stay / Bounce / Confused — and one sentence on why.

---

SCORING RUBRIC — use these anchors, not intuition

9–10 = Best-in-class for this category 
       (reference: [COMPETITOR BENCHMARKS])
7–8  = Solid, above average, clearly intentional — minor gaps only
5–6  = Functional but generic — could be any [COMPANY TYPE]
3–4  = Actively hurting conversion — visitors likely confused
1–2  = Broken — core promise not communicated at all

---

DIMENSION 1 — Messaging, Copy & Section-by-Section Audit

Macro:
- Does the hero communicate what [BUSINESS NAME] is, who it's for, 
  and why it's different — within one read?
- Does copy speak in visitor outcomes or in internal language?
- Flag any claim that is vague or interchangeable with any 
  competitor ("we move fast," "end-to-end partner," etc.)

Per-section audit — for each visible section, answer:
  Does the headline do work or just label?
  Does the body copy earn its space or repeat the headline?
  Is the CTA specific enough to motivate a click?

SCORE: 1–10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 specific, actionable bullets
TOP FIX: single highest-leverage change

---

DIMENSION 2 — Audience Routing & Self-Identification

- Is there a visible mechanism for visitors to self-identify?
  If NO: flag as a critical structural gap — explain what is 
  missing and where it should appear. Do not just score it low.
- If YES: does [ROUTING MECHANISM] appear early enough? Are 
  labels in the visitor's own language, not internal jargon?
- Is there any point where a qualified visitor might feel 
  "this isn't for me" and leave before finding the right section?
- After routing, is the path to each destination clear?

SCORE: 1–10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

DIMENSION 3 — Design, Visual Hierarchy & Audience Tension

Hierarchy:
- Does the visual hierarchy guide the eye correctly: 
  brand → who it's for → what we do → proof → CTA?
- Is the accent color ([DESIGN SYSTEM accent]) used with 
  intentional discipline or scattered?
- Rate scannability: can a visitor grasp the full value 
  proposition in a 10-second scroll?

Audience tension test — answer this explicitly:
- This page must serve [AUDIENCE LIST]. Do the design 
  choices — imagery, density, tone, visual theme — work 
  equally well for all of them, or do they optimize for 
  one at the expense of others?
- What would need to change for the underserved audience 
  to feel as at-home as the primary audience?

SCORE: 1–10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

DIMENSION 4 — Trust & Credibility Signals

- Are client logos visible prominently and early enough?
- Do testimonials include full name, title, and company — 
  or is attribution too vague to be credible?
- Are [VERIFIED METRICS] displayed with enough context to 
  feel earned rather than inflated?
  FALSE PRECISION CHECK: do any large headline numbers 
  (revenue figures, impact claims) feel unsubstantiated 
  without supporting context?
- Are certifications, awards, or third-party validation 
  signals present and legible?

SCORE: 1–10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

DIMENSION 5 — Navigation Clarity

- Does the nav make sense to a first-time visitor who 
  doesn't know the internal program or product names?
- Are nav labels in visitor language (outcomes, roles) 
  or internal language (team names, product codenames)?
- On mobile: is the nav usable or does it collapse into 
  a hamburger that buries key destinations?
- Does the nav match what the page itself promises?

SCORE: 1–10
WHAT'S WORKING: max 2 bullets
WHAT'S BROKEN: max 3 bullets
TOP FIX: single change

---

DIMENSION 6 — Conversion Architecture

- Is there a clear primary CTA that persists through scroll?
- CTA SPECIFICITY TEST: is the CTA text specific enough 
  to motivate action — or generic enough to be invisible? 
  ("Book a 30-min call" vs. "Learn more" vs. "Let's talk")
- Are there secondary CTAs at natural exit points?
- Does the page end with a strong close or fade into footer?
- What is the single most likely reason a qualified visitor 
  leaves [PAGE TYPE] without taking action?

SCORE: 1–10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

FINAL OUTPUT

OVERALL SCORE: weighted average
[DIMENSION WEIGHTS — default: D1: 25%, D2: 20%, D3: 20%, 
D4: 15%, D5: 10%, D6: 10%]

TOP 3 PRIORITIES: three changes ordered by impact.

ONE THING TO PRESERVE: what is genuinely working and 
must not be touched.

PRIMARY AUDIENCE READINESS VERDICT: one paragraph. 
Can this page, as-is, convert [the most important / 
hardest-to-convince audience from your AUDIENCE LIST]? 
What is the gap?
```

---

## Instances of this prompt

- **Homepage Evaluation Prompt — RightShift** — pre-filled for [rightshift.co](http://rightshift.co) homepage, four-audience routing, dark editorial design system, enterprise/startup tension test
