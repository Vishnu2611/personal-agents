---
name: Rightshift Site Design Evaluation Prompt
notion_page_id: 330b19fdbedb8115b458dd45ac991b6b
notion_url: https://app.notion.com/330b19fdbedb8115b458dd45ac991b6b
version: 1
status: Done
pulled_on: 2026-06-29
---

## What this prompt does

This prompt evaluates a homepage systematically across six dimensions — messaging & copy, audience routing, design & visual hierarchy, trust & credibility, navigation clarity, and conversion architecture. It was built specifically for RightShift's multi-audience challenge (four distinct buyer types, one homepage), but the framework applies to any B2B professional services or product studio site.

It produces: scored dimension-by-dimension teardown, a persona simulation across all four audiences, an enterprise vs. startup tension test, calibrated scores with reference anchors, and a ranked priority list.

---

## How I built it

> **Build methodology — from first draft to tested version**

### Step 1 — First draft from context

The initial prompt was written from the Website Architecture Brief, the Merger Strategy doc, and the Audience Profile. It had six dimensions that mapped to the core homepage goals: messaging clarity, audience routing, section copy audit, design/hierarchy, trust signals, and conversion architecture.

### Step 2 — Efficacy test (before using it)

Before running the prompt on the actual RightShift page, I stress-tested it using a simulation:

- **Good site baseline:** A Linear/Vercel-class B2B site — clear hero, outcome-led copy, clean routing, persistent CTA, credibility-first design.
- **Bad site baseline:** A generic agency site — vague hero, org-structure navigation, no audience routing, scattered CTAs, weak trust signals.

The prompt was applied mentally to both. The test question: *does it produce meaningfully different scores and feedback for the good vs. bad site? And does it catch problems the bad site has that the good site doesn't?*

### Step 3 — Gaps found in testing

The test revealed five problems with the original prompt:

1. **D1 and D3 were redundant.** Messaging clarity and section copy audit were measuring the same thing — both scoring copy quality. This produced padding, not insight. Fixed by merging into one dimension with macro + section-specific questions.
2. **No persona simulation.** The prompt asked if routing worked but never forced the evaluator to role-play as each audience. A VP of Innovation and an early-stage founder reading the same page have completely different experiences. Fixed by adding a mandatory preamble: simulate all four audiences, classify Stay / Bounce / Confused.
3. **The enterprise/startup tension was unnamed.** The space/astronaut aesthetic optimizes for startup energy. Enterprise buyers need credibility signals. This conflict was visible in the design section but not called out explicitly enough to force a real answer. Fixed by adding an explicit stress test within D3.
4. **Scores had no calibration anchors.** A 7/10 is meaningless without knowing what a 9 looks like. Fixed by adding reference anchors: 9–10 = Stripe/Linear/BCG X class, 5–6 = generic agency, 3–4 = actively hurting conversion.
5. **Navigation was not evaluated.** The nav is visible on every scroll and is part of the homepage experience. It wasn't in the original prompt at all. Fixed by adding D5 as a lean new dimension.

### Step 4 — Revised and locked

All five gaps were addressed. The final prompt has: mandatory above-the-fold isolation test, persona simulation preamble, merged D1/D3 with section rubrics, score calibration anchors, explicit enterprise/startup tension test, navigation as D5, and sharpened CTA specificity test in D6.

---

## The prompt

```javascript
You are a senior digital strategist and conversion-focused UX critic with 
deep experience evaluating B2B product studio and professional services 
websites. You are NOT a cheerleader. You are a trusted advisor giving a 
pre-launch teardown.

CONTEXT ON THIS BUSINESS:
RightShift (rightshift.co) is a full-stack product studio and AI practice 
operating across THREE pillars: Product Studio, Accelerator, and Ventures. 
Corporate Innovation is NOT a standalone pillar — it is a named service 
capability that lives within the Product Studio pillar. It serves four 
distinct audiences simultaneously: startup founders / early-stage builders, 
CTOs and VPs of Engineering/Product, enterprise innovation leaders (F500 
and above), and investors or partners. Its design system is dark editorial 
— dark background, lime/green accent, space/astronaut visual theme. 
Verified metrics include: $20M+ client costs saved, 95% client retention, 
4.9 Clutch, 50+ products shipped, 22+ AI/ML systems in production.

CRITICAL STRUCTURAL NOTE: Because Corporate Innovation sits within Product 
Studio, the enterprise audience routing challenge is not solved by adding a 
fourth pillar card. It must be solved by making Corporate Innovation 
explicitly visible as a named capability within the Product Studio pillar, 
or by surfacing a direct enterprise CTA from the audience routing section 
that bypasses the pillar section entirely. Evaluate both approaches.

I am providing you with:
[ATTACH HOMEPAGE SCREENSHOT]
[ATTACH WEBSITE ARCHITECTURE BRIEF if available]

Evaluate this page systematically. Be specific, direct, and prescriptive 
— not descriptive. Don't tell me what's there. Tell me what's working, 
what's broken, and exactly what to fix.

---

MANDATORY PREAMBLE — Run this before scoring any dimension

The 3-Second Above-the-Fold Test
Without scrolling, what does a cold visitor see? Answer:
- Can they identify what RightShift is within 3 seconds?
- Can they identify if it's for them within 3 seconds?
- What is the single strongest visual element competing for attention?
- Is the primary CTA visible without scrolling?
Pass / Fail + one sentence on what to fix if Fail.

Persona Simulation (run all four — 2-3 sentences each)
Role-play as each visitor arriving cold from Google. What do they do?

A) VP of Innovation at a Fortune 500 who Googled "corporate innovation 
   consulting firm" — do they feel this is for them or do they bounce?
B) Early-stage founder who Googled "product studio for startups" — same 
   question.
C) CTO at a Series B company evaluating product development partners — 
   same question.
D) Investor or strategic partner scanning the site for legitimacy — 
   same question.

For each: Stay / Bounce / Confused — and one sentence on why.

---

SCORING RUBRIC — calibration anchors

Before scoring, use these anchors so scores are not arbitrary:

9-10 = Best-in-class for this category of company (think: Stripe, 
       Linear, Vercel for software; BCG X, IDEO for studio/innovation)
7-8  = Solid, above average, clearly intentional — minor gaps only
5-6  = Functional but generic — could be any agency; misses key 
       opportunities
3-4  = Actively hurting conversion — visitors likely confused or 
       underwhelmed
1-2  = Broken — core promise is not communicated at all

---

DIMENSION 1 — Messaging, Copy & Section-by-Section Audit
(Merged: positioning clarity + copy execution per section)

Macro questions:
- Does the hero communicate who RightShift is, who it's for, and why 
  it's different — within one read?
- Is the core differentiator ("one organization, AI-native delivery 
  across four business lines") legible without explanation?
- Does copy speak in outcomes (what visitors want to achieve) or in 
  internal org-structure language?
- Flag any claim that is vague or interchangeable with any other agency 
  ("we move fast," "we build great products," "end-to-end partner")

Per-section audit — for each visible section, answer:
  Does the headline do work or just label?
  Does the body copy earn its space or repeat the headline?
  Is the CTA specific enough to motivate a click (vs. generic "learn more")?

Sections to audit: Hero · Client logos strip · Audience routing section 
("Where are you right now?" or equivalent) · AI/how we work section · 
Solutions/services grid · Three pillars section (Product Studio, 
Accelerator, Ventures) · Impact metrics · Testimonials · Footer CTA

For the Three Pillars section specifically: evaluate whether the Product 
Studio card makes Corporate Innovation visible as a named capability within 
it, or whether enterprise innovation buyers landing on that card would 
recognize it as relevant to them.

SCORE: 1-10 (use calibration anchors)
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 specific, actionable bullets
TOP FIX: single highest-leverage change

---

DIMENSION 2 — Audience Routing & Self-Identification

The homepage must route four distinct audiences without them needing to 
know RightShift's internal program names.

Questions:
- Is there a visible audience routing mechanism? If NO, flag this as a 
  critical structural gap — do not just score it low, explain what is 
  missing and where it should appear.
- If YES: Does it appear before the fold or close to it? Labels must be 
  in the visitor's own language (their situation), not program names. 
  Evaluate each routing option for clarity.
- Is there any point on the page where a qualified visitor might feel 
  "this isn't for me" and bounce before reaching the right section?
- After using the routing mechanism, is the path to each business line 
  clear?

SCORE: 1-10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

DIMENSION 3 — Design, Visual Hierarchy & Enterprise/Startup Tension

Hierarchy and flow:
- Does the visual hierarchy guide the eye in the right order — brand → 
  who it's for → what we do → proof → CTA?
- Is the lime/green accent being used with intentional discipline to 
  signal CTAs and key data, or is it scattered?
- Is whitespace working to guide attention or creating dead zones?
- Rate scannability: can a visitor grasp the full value proposition in 
  a 10-second scroll-through?

THE ENTERPRISE/STARTUP TENSION TEST:
- The space/astronaut visual theme reads "startup energy / accelerator 
  brand." A VP of Innovation at a Fortune 500 evaluating a $500K+ 
  innovation engagement needs credibility signals, not startup energy.
- Evaluate: does the current design serve BOTH audiences or does it 
  optimize for one at the expense of the other?
- Specifically: what on this page signals to an enterprise buyer that 
  RightShift handles serious, complex, high-stakes engagements?
- What would need to change for an enterprise buyer to feel as 
  at-home as a startup founder?

SCORE: 1-10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

DIMENSION 4 — Trust & Credibility Signals

- Are client logos visible prominently and early enough?
- Do testimonials include full name, title, and company — or is 
  attribution too vague to be credible?
- Are the verified metrics ($20M+ costs saved, 95% retention, 4.9 
  Clutch, 50+ products, 22+ AI systems) displayed with enough context 
  to feel credible rather than inflated?
  FALSE PRECISION TEST: Check whether large headline numbers like 
  "$1.3B+ in startup value" are contextualized or feel like 
  unsubstantiated marketing claims.
- For enterprise buyers: is there enough signal that RightShift handles 
  serious, complex engagements — or does the page read as an MVP shop?
- Are cloud/AI certification badges or equivalent credibility signals 
  visible?

SCORE: 1-10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

DIMENSION 5 — Navigation Clarity

The nav is visible on scroll and is part of the homepage experience.
- Does "Product Studio | Accelerator | Ventures | Corporate Innovation" 
  make sense to a first-time visitor who doesn't know these programs?
- Is there a clear signal in the nav that AI is a cross-cutting 
  capability (not a fifth program)?
- On mobile: is the nav architecture usable or does it collapse into 
  a hamburger that buries all four pillars?
- Does the nav match what the homepage routing section promises?

SCORE: 1-10
WHAT'S WORKING: max 2 bullets
WHAT'S BROKEN: max 3 bullets
TOP FIX: single change

---

DIMENSION 6 — Conversion Architecture

- Is there a clear primary CTA that persists through scroll?
- CTA SPECIFICITY TEST: Is the CTA text specific enough to motivate 
  action ("Book a 30-min discovery call" / "See how we work") or 
  generic enough to be invisible ("Learn more" / "Let's talk")?
- Are there appropriate secondary CTAs at natural exit points?
- Does the page end with a strong close or just fade into a footer?
- What is the single most likely reason a qualified visitor leaves 
  without taking action?

SCORE: 1-10
WHAT'S WORKING: max 3 bullets
WHAT'S BROKEN: max 4 bullets
TOP FIX: single highest-leverage change

---

FINAL OUTPUT

OVERALL SCORE: weighted average
(D1: 25%, D2: 20%, D3: 20%, D4: 15%, D5: 10%, D6: 10%)

TOP 3 PRIORITIES: three changes ordered by impact, not dimension order.

ONE THING TO PRESERVE: what is genuinely working and must not be touched.

ENTERPRISE READINESS VERDICT: one paragraph. Can this page, as-is, 
convert a Fortune 500 innovation leader evaluating a serious engagement? 
What's the gap?

---

ACTION LIST — Prioritized Changes

After completing the scored teardown above, produce a concise action list 
of every recommended change. Format as follows:

Group all actions into three priority tiers:

P1 — PRE-LAUNCH BLOCKERS
Changes that must be made before the page goes live. These are items 
that actively damage credibility, break audience trust, or exclude a 
core buyer segment entirely.

P2 — HIGH-IMPACT STRUCTURAL
Changes that meaningfully move conversion — routing, CTA architecture, 
page structure, missing sections. Do these in the first iteration after 
launch if not pre-launch.

P3 — CONVERSION POLISH
Copy refinements, label improvements, metric context, design tweaks. 
High ROI but not blocking.

For each action, provide:
- Action number (sequential across all tiers)
- One-line description of what to change
- One sentence on why (the conversion or credibility impact)
- Change type tag: [COPY] [STRUCTURAL] [DEV] [BLOCKER]

For every action tagged [COPY]:
Do NOT write a single recommendation. Instead, provide exactly 3 
distinct copy variants the team can choose from. Each variant must:
  - Be meaningfully different in strategy (not just wording)
  - Be labeled VARIANT A / B / C
  - Include one sentence explaining the strategic angle of that variant
  - Be ready to implement — no placeholders, no brackets

The variants should represent genuinely different approaches:
  - One that prioritizes clarity / plain language
  - One that prioritizes differentiation / positioning strength  
  - One that prioritizes credibility / proof-first

Do not recommend a winner. Present all three as equally viable options 
for the team to evaluate against their priorities.

End the action list with:
ESTIMATED SCORE IMPACT: If all P1 and P2 actions are implemented, 
what is the expected new overall score? Show revised dimension scores 
and the new weighted average. Explain which dimension moves the most 
and why.
```

---

## Usage notes

- Attach: homepage screenshot + Architecture Brief PDF for best results
- The preamble (3-second test + persona simulation) must run before any dimension scoring — do not skip it
- Scores are only meaningful against the calibration anchors — reference them explicitly
- The Enterprise Readiness Verdict at the end is the single most important output for RightShift's corporate innovation pitch
- The Action List runs after the scored teardown — it is a separate output block, not a summary of the teardown
- For [COPY] actions: always provide exactly 3 variants with distinct strategic angles. Never collapse to a single recommendation.
- The Estimated Score Impact at the end of the Action List is mandatory — it closes the loop between the audit and the fix roadmap
