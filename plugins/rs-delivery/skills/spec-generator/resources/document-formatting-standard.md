# Document Formatting Standard

The single, canonical formatting rulebook for every **prose/document deliverable** the doc-gen chain
produces — **BRD, PRD**, and the written sections of the Technical Design and Estimation packets.
Its job: make every output **consistently structured and easy to scan**, so a reader never trips over
mixed punctuation, ragged bullets, or wall-of-text.

> Each generator embeds a compact "Output Formatting Standard" section that points here. When this
> file changes, update those embeds.

---

## 1. Document hierarchy

- `#` — document **title only** (one per document).
- `##` — **numbered top-level Sections** (e.g. `## 1. Executive Summary`).
- `###` — **Sub-sections**, numbered to their parent (e.g. `### 1.2 Platform`).
- `####` — reserved for repeated blocks (e.g. a feature block). **Max depth = H4.**
- Numbering is consistent and sequential: `1`, `1.1`, `1.1.1`.
- **Every section opens with one orienting sentence** (what the section covers) before any list or table.

## 2. Sentences & punctuation  *(the inconsistency this standard kills)*

- **One terminator rule:** every standalone point is a **complete sentence ending in a period.**
  Do **not** mix `,`, `;`, and `.` as list-item terminators — pick the sentence-and-period form.
- **Semicolons** only join two closely related clauses *inside* a sentence; never as a bullet terminator.
- **Headings: sentence case** (`## 2. Business objectives`, not `## 2. Business Objectives` or ALL CAPS),
  except defined acronyms (PRD, BRD, API, AWS).
- One space after a period. **Oxford comma** in lists of three or more.
- Numbers: spell out one–nine in prose; use figures for 10+, all measurements, money, and table cells.

## 3. Bullets & sub-bullets

- Use **bullets for any list of 3+ parallel items**; use **prose for narrative** (the BRD Product
  Narrative, the PRD POV) — never bullet a story.
- **Max two nesting levels** (bullet → sub-bullet). Anything deeper becomes a sub-section or a table.
- **Parallel structure** within a list: all items start with a verb, or all are noun phrases — not mixed.
- **Definitional bullets use a bold lead-in label, then an em dash, then the explanation:**
  `**Sponsor** — the budget owner who signs off on scope.`
- A sub-bullet must clarify or enumerate its parent. **No lone single sub-bullet.**
- **Terminal punctuation within a list is consistent:** full-sentence bullets end with a period;
  short label/fragment bullets (≤4 words or `Key: value`) take none. Don't mix the two styles in one list.

## 4. Tables

- Use a table for **repeating structured data** — 3+ rows sharing the same fields (stakeholders,
  feature rows, Section 10, rate cards, risk register, changelog).
- Every table has a **header row**; cells are **concise fragments**, never full paragraphs.
- **Never** use a table for narrative or for a one-off pair of values.

## 5. Emphasis & typography

- **Bold** for key terms, labels, and decisions. *Italics* sparingly, for definitions or asides.
  **No underline. No random bolding.**
- `Monospace` for tags, field names, file names, IDs, and codes — e.g. `FP-05`,
  `[CLIENT INPUT REQUIRED]`, `Section 10`, `IntuitioLabs - Estimation Template.xlsx`.
- `> Block quotes` only for callouts, criteria notes, or examples — not for body content.

## 6. Tags & placeholders

- Tags use the prompt's **defined vocabulary**, in **monospace**, in a **consistent format**:
  `[CLIENT INPUT REQUIRED: brief note]`, `DECISION NEEDED: ...`, `ASSUMPTION: ...`.
- Placeholders are in **square brackets** with a hint — `[client name]` — and are **never left as raw
  blanks** or empty cells.

## 7. Whitespace & rhythm

- One blank line between sections; no wall-of-text — **paragraphs cap at ~4–5 sentences**, then break.
- Lead every repeated block (feature, epic, stakeholder) with a **bold name line**.
- **Repeated blocks keep the same internal order** every time (e.g. every feature block lists
  Priority → POV → Implementation Detail → Technical Behavior in that order).

## 8. Self-check before output  *(run this, fix, then emit)*

- [ ] Punctuation uniform — no mixed `,` / `;` / `.` terminators; standalone points end in periods.
- [ ] Headings numbered, sentence case, hierarchy ≤ H4.
- [ ] Bullets parallel; nesting ≤ 2 levels; no lone sub-bullets; consistent terminal punctuation.
- [ ] Structured repeating data is in tables with header rows and concise cells.
- [ ] Bold/italics/monospace used per rule; no underline, no random bold.
- [ ] Tags and placeholders in the defined, consistent format; no raw blanks.
- [ ] Each section opens with an orienting sentence; paragraphs ≤ 4–5 sentences.
