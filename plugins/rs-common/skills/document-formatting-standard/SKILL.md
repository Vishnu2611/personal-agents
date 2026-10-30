---
name: document-formatting-standard
description: Applies the RightShift document formatting standard (heading hierarchy, sentence and punctuation rules, bullets, tables, emphasis, tags and placeholders, whitespace, and a self-check) to a prose document so it is consistently structured and easy to scan. Takes the document being written or revised as input. Trigger on "apply the formatting standard", "format this like our BRD/PRD", "clean up this document's structure".
---

# Document Formatting Standard

The canonical formatting rulebook for prose and document deliverables: BRD, PRD, and the written
sections of technical design and estimation packets. It covers H1-H4 hierarchy with numbered sections,
one-terminator punctuation and sentence-case headings, bullet and table rules, emphasis and monospace
conventions, tag and placeholder formats, whitespace rhythm, and a final self-check checklist.

## When to use

Use to write or revise a document that is not produced by one of the generator skills. Eight skills
already ship their own copy of this standard as a resource; this skill is for applying it to
everything else. Input: the document or draft to format.

## Not for

Generating a BRD, PRD or estimate (see rs-scoping), visual or brand design (see rs-design), or
rendering diagrams (use `d2-diagrams`). It governs structure and punctuation, not content.

## How to run

Read `resources/document-formatting-standard.md` and apply it to the document being produced. Run its
Section 8 self-check, fix any failures, then emit the document.
