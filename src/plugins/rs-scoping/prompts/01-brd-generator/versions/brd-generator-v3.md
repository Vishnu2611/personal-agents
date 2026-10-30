---
name: "BRD Generator v3 (formatting-standard upgrade)"
status: "Draft / improvement (layers on v2)"
supersedes: "v2 (current/brd-generator-v2.md)"
authored_on: 2026-06-29
change: "Adds the shared Document Formatting Standard so BRD output is consistently structured & scannable"
---

# BRD Generator v3 — formatting-standard upgrade

> **v3 changes vs v2 (formatting only — no change to scope, phases, or non-fabrication rules):**
> - Adds the shared **Output Formatting Standard** (one terminator rule, bullet/sub-bullet limits,
>   numbered sentence-case sections, tables for structured data, consistent emphasis + tags). This
>   kills the inconsistency where points ended sometimes with `,`, sometimes `;`, sometimes `.`.
> - Adds **Reflection Criterion 12 (Formatting consistency)** and a **Quality-Standards row**.
> - Everything else in v2 is unchanged.
>
> **How to apply:** v3 = the full BRD v2 prompt **plus** the three inserts below (a new section, one
> reflection criterion, one quality-standards row). Merge points are marked. *(Ask for the
> fully-assembled runnable v3 if you'd prefer a single file.)*

---

## INSERT 1 — new section *(place immediately before "## 📥 INPUTS YOU WILL RECEIVE")*

### 📑 OUTPUT FORMATTING STANDARD — applies to the whole document

Produce a cleanly structured, scannable document. *(Full rulebook: `standards/document-formatting-standard.md`.)*

- **Hierarchy:** `#` title · `##` numbered Sections · `###` Sub-sections (`1`, `1.1`) · `####` repeated blocks (max H4). Each section opens with one orienting sentence before any list or table.
- **Sentences & punctuation — be consistent:** every standalone point is a **complete sentence ending in a period**. Do **not** mix `,` / `;` / `.` as list-item terminators. Semicolons only join clauses inside a sentence. **Sentence-case** headings. Oxford comma.
- **Bullets:** bullets for 3+ parallel items, **prose for narrative** (the Product Narrative stays prose — never bulleted). **Max two nesting levels** (bullet → sub-bullet); deeper → a sub-section or table. Parallel structure (all verb-led or all noun-phrases). Definitional bullets use a **bold lead-in label** — then the explanation. No lone sub-bullets.
- **Tables** for repeating structured data (Stakeholders, Product Map feature rows, Assumptions & Risks register, Changelog) — header row, concise cells; never for narrative.
- **Emphasis:** **bold** key terms/labels; `monospace` for tags (`[CLIENT INPUT REQUIRED]`, `[NEEDS REVIEW]`); italics sparingly; no underline, no random bold.
- **Tags & placeholders:** the defined tag vocabulary, in monospace, consistent format; square-bracket placeholders, never raw blanks.
- **Whitespace:** blank line between sections; paragraphs ≤ 4–5 sentences; repeated blocks keep the same internal order every time.
- **Self-check before emitting:** punctuation uniform · bullets parallel & ≤ 2 levels · sections numbered/sentence-case · structured data in tables · consistent emphasis/tags.

---

## INSERT 2 — new reflection criterion *(append to the "🎯 REFLECTION CRITERIA" list as item 12; the list currently ends at 11)*

12. **Formatting consistency** — the document follows the Output Formatting Standard: uniform sentence-and-period punctuation (no mixed `,`/`;`/`.` terminators), parallel bullets nested ≤ 2 levels, numbered sentence-case sections/sub-sections, tables for repeating structured data, and consistent bold/`monospace`/tags. The Product Narrative stays prose. A reader scans it cleanly.

---

## INSERT 3 — new row in the "📋 QUALITY STANDARDS" table *(add before the final "Reflection" row)*

| Formatting | Follows the Output Formatting Standard — consistent sentence/period punctuation, bullets/sub-bullets ≤ 2 levels, numbered sentence-case sections, tables for structured data, consistent emphasis + tags. Narrative sections stay prose. |

---

*No other changes. All v2 phases, gates, non-fabrication and versioning rules carry forward verbatim.*
