---
name: Cross-Page Editorial & Consistency Audit
notion_page_id: 354b19fdbedb81ae9baed2caf07bb878
notion_url: https://app.notion.com/354b19fdbedb81ae9baed2caf07bb878
version: 1
status: In Testing
pulled_on: 2026-06-29
---

## What this is

A multi-page editorial audit. While the per-page Figma Page Review compares a single design to its brief, this prompt compares pages **to each other** — catching the inconsistencies, terminology drift, and gaps that only become visible when you look across the set.

Run it at milestones — pre-launch, post-launch, quarterly — not constantly.

---

## How to use it

1. Collect Figma node URLs for every page in scope (homepage, all service subpages, AI gallery, contact, etc.). Or use a single section URL that contains all of them.
2. Have your canonical reference ready — voice guide, V2 design token list, retired terms list. The audit needs a yardstick.
3. Paste URLs + reference into the prompt. Run.
4. Triage:
	- 🔴 errors — fix immediately, no decision needed
	- 🟡 inconsistencies / gaps — pick a canonical, then batch-fix
	- 🟢 voice drift — judgment call; accept or reject
5. After decisions are made, run targeted copy updates page-by-page.

---

## What it catches

Four buckets, merged into one severity-sorted table:

| Bucket | Examples |
|--------|----------|
| **Errors** (🔴) | Grammar, spelling, punctuation, typos. Client name misspellings. Number/date inconsistencies (50+ products on one page, 60+ on another). Capitalization of proper nouns (RightShift, IntuitioLabs, Product Studio). Sourcing violations (hardware refs, retired terms, $1.3B). |
| **Inconsistencies** (🟡) | CTA phrasing variants ("Book a call" vs "Talk to us" vs "Get in touch"). Stat formatting ($1.3B+ vs 1.3 billion vs 1.3B). Section label casing (ALL CAPS vs Title Case). Terminology variants (Product Studio vs studio). POV shifts (we / you / they). Headline grammar. |
| **Gaps** (🟡) | Page X has testimonials, page Y doesn't. Proof strip present on some pages, missing on others. Footer/nav element inconsistent. CTA missing entirely on a page that should have one. Required disclaimers, attribution missing. |
| **Voice drift** (🟢) | Hedging, jargon, corporate filler. Descriptive where imperative was specified. Sentence-length distribution mismatches between pages. |

---

## The prompt

```javascript
You are a senior editorial director and brand voice steward
auditing a set of Figma frames for cross-page consistency, errors,
gaps, and voice drift.

You are NOT reviewing each page in isolation — you are looking
for patterns, drift, and conflicts ACROSS pages. Output must be
CONCISE: one table, severity-ranked, max 25 rows.

---

INPUTS — fill before running

Pages in scope:
[FIGMA_NODE_URL_1 — page name]
[FIGMA_NODE_URL_2 — page name]
[FIGMA_NODE_URL_3 — page name]
... (add as many as needed)

Canonical references:
- Brand voice guide: [URL or "see project knowledge"]
- V2 design tokens: #090909 bg, violet/purple #6B3FEB–#7A4FFF
  accent, NO lime, NO teal, pill CTAs, ALL CAPS section labels,
  Title Case headlines
- Retired terms (must NOT appear): "AOF", "ATA",
  "AI Tolerance Architecture". Canonical: "AI Opportunity Audit"
- Out of scope (must NOT appear): hardware (any reference)
- Held metrics (exclude until resolved): "$1.3B+" client value
- Approved testimonials: Erika Rodwell (Verra Mobility),
  Kristina Frantz (Ikonik Golf), anonymized VP of Technology
  (TuneCore — name still anonymized)
- Unresolved client logos (must NOT appear in logo strips):
  Verra Mobility, Bose, Georgia Pacific, Sirius XM,
  Amazon Labs, Cox Communications

Scope filter (optional): [e.g. "hero sections only",
"all service subpages"]

---

METHODOLOGY

1. Read every page in scope. Catalog: hero copy, all CTAs,
   section labels, stats, terminology, client names,
   testimonials, footer copy.

2. For each of the four buckets below, surface findings.
   Do NOT pick canonicals for inconsistencies — list variants
   with frequency and let the user decide.

3. ERRORS (🔴) — objectively wrong:
   - Grammar, spelling, punctuation, broken syntax
   - Number/date inconsistencies across pages
   - Misspelled proper nouns (client names, brand names)
   - Sourcing violations: hardware references, retired terms,
     unverified metrics, unresolved logos, Chris Davis bio/quote
     without his review

4. INCONSISTENCIES (🟡) — varies across pages, no single right
   answer until user picks one:
   - CTA phrasing variants — list each variant + which pages
   - Stat formatting variants
   - Section label casing variants
   - Terminology variants (e.g. "Product Studio" vs "studio")
   - POV shifts (we / you / they)
   - Headline grammar style (Title Case vs sentence case)

5. GAPS (🟡) — element present on some pages, missing on others:
   - Testimonial sections
   - Proof strips / logo strips
   - Footer or nav elements
   - CTAs (where the page type should have one)
   - Required disclaimers, source notes, attribution

6. VOICE DRIFT (🟢) — qualitative, page reads off-brand:
   - Hedging, jargon, corporate filler
   - Descriptive where imperative was specified
   - Sentence-length / density mismatches between pages
   - Specific suggested rewrite — paste-ready

---

OUTPUT (exactly this format, nothing else)

| Severity | Type | Page(s) | Issue | Fix / Decision needed |
|----------|------|---------|-------|----------------------|
| 🔴 | Error | [page] | [specific issue] | [exact fix] |
| 🔴 | Error | [page] | ... | ... |
| 🟡 | Inconsistency | [list pages w/ variants] | [pattern: variants seen + frequency] | Pick canonical |
| 🟡 | Gap | [pages missing element] | [element absent that exists on N other pages] | Add or accept |
| 🟢 | Voice | [page] | [section: current copy] | [suggested rewrite] |

Rules:
- Sort: 🔴 → 🟡 → 🟢, then by frequency within each band
- Max 25 rows. If more, cap and add a final row:
  "+N additional findings — run focused pass on [bucket]"
- For ERRORS: show exact string and exact fix — paste-ready
- For INCONSISTENCIES: show all variants with frequency
  (e.g. "\"Book a call\" 4× / \"Talk to us\" 1× / \"Get in
  touch\" 1×"). Do NOT pick canonical. Action column reads
  "Pick canonical".
- For GAPS: show element + which pages have it + which don't.
  Action reads "Add or accept".
- For VOICE DRIFT: show page, section, current copy, suggested
  rewrite. User accepts or rejects.
- NO preamble. NO summary. NO closing paragraph.

FLAGS (only if applicable, max 2 lines):
- [Anything you couldn't verify — e.g. "Could not access
  page 4 — frame requires login", "Voice guide URL returned
  blank — audited against memory of past chats"]
```

---

## Rules baked in

- **Errors get fixed, not debated.** Exact string + exact fix. No decision needed.
- **Inconsistencies require a human.** The prompt lists variants with frequency; it never picks the canonical. That's the user's call.
- **Gaps require a decision.** Sometimes the gap is intentional (a hub page doesn't need a testimonial). The prompt surfaces; user decides add or accept.
- **Voice drift is judgment territory.** Suggested rewrites only — accept or reject.
- **Output is one table, max 25 rows, sorted red → yellow → green.** Scan in under a minute.

---

## Workflow

1. Run **Figma Page Review** on each page individually until they all clear.
2. Run **this prompt** across the full set.
3. Decide canonicals for the 🟡 inconsistencies.
4. Triage 🟡 gaps — add or accept each.
5. Accept or reject 🟢 voice rewrites.
6. Apply batch updates page-by-page in Figma.
7. Re-run this prompt as final pre-launch editorial gate.
