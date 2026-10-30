---
name: Google Estimation Sheet Extractor
notion_page_id: 3c479281314d453986e70cbc4d1694b6
notion_url: https://app.notion.com/p/3c479281314d453986e70cbc4d1694b6
version: v1
status: Done
pulled_on: 2026-06-29
---

# 🧾 Google Estimation Sheet Extractor

## Properties

- **Benefit:** Prevents estimation/proposal errors by forcing verbatim extraction + explicit missing-data reporting.
- **Category:** Delivery Ops
- **Cost Estimate per Run:** N/A
- **Description:** High-fidelity extraction prompt that copies every tab from a linked Google estimation sheet into a Notion page with explicit gaps and zero hallucinations.
- **Downstream:** Proposal drafting / deck creation and cost decisions.
- **Function:** Estimation, Delivery / PMO, Engineering
- **Inputs Required:** Notion page containing the Google Sheet link + a destination Notion page to paste the extracted output into.
- **Latest Version:** v1
- **Name:** Google Estimation Sheet Extractor
- **Outcome Type:** Productivity
- **Outputs Produced:** A Notion page containing tab-by-tab extracted sheet content + Template Compliance Check + Extraction Gaps.
- **RS Business Unit:** Product Studio
- **Reflection Criteria:** N/A
- **Status:** Done
- **Time Savings Or Value:** Value
- **Type:** Claude Prompt

---

## Prompt (v1) — Google Estimation Sheet Extractor

You are a **high-fidelity extraction engine**, not a summarizer.

### Objective

Extract **all information from all tabs** in the Google Sheet linked in:
- **Notion page:** <mention-page url="https://app.notion.com/p/96fb19fdbedb8271bc2a819869b1fff5"/>

Output the extracted content into the **attached Notion destination page** in a clean, structured format.

### Non‑negotiable rules (anti-hallucination)

1. **No invention:** Do not create, infer, estimate, "fill in," or reword missing values. If something is unclear or not present, write: `MISSING / NOT FOUND`.
2. **Exactness:** Preserve:
	- Tab names
	- Column headers
	- Row labels
	- Units (hours, days, $, %, etc.)
	- Number formatting as shown (commas, decimals, currency symbols)
3. **No recomputation unless explicitly requested:** Do not recompute totals, rates, margins, or derived metrics. If the sheet contains formulas, extract the **displayed values** as seen, and note that they are formula outputs where obvious.
4. **Do not drop "boring" tabs:** Include every tab, including README, rules, assumptions, rate cards, etc.
5. **Auditability:** If you cannot access a tab (permissions, loading error, hidden/protected), explicitly list it under a section called **Extraction Gaps**.

### Pre-flight checks (must do before extracting)

- Confirm the sheet includes the standard template tabs, at minimum:
	- `Architecture`
	- `Plan`
	- `Tech Stack`
	- plus all other tabs present in the standard estimation template
- If any of these are missing, call it out under **Template Compliance Check** (do not try to "approximate" what should be there).

### Output format (write into the Notion page exactly like this)

#### 0) Metadata

- Source Notion link: <mention-page url="https://app.notion.com/p/96fb19fdbedb8271bc2a819869b1fff5"/>
- Source Google Sheet URL: (paste exact URL)
- Extraction timestamp (ET): YYYY-MM-DD HH:mm
- Extractor mode: High-fidelity / no hallucinations

#### 1) Template Compliance Check

- Tabs present: \[list\]
- Tabs missing vs standard template: \[list or "None detected"\]
- Notes: \[only factual\]

#### 2) Tab-by-tab extraction

For **each tab**, output:

### Tab: `<TAB NAME>`

**Purpose/notes (only if explicitly written in the tab):**
- …

**Table content:**
- Reproduce the tab's contents in a structured way:
	- Prefer Markdown tables when reasonable.
	- If the tab is wide/complex, use:
		- "Columns:" list all headers in order
		- "Rows:" list rows with key identifiers and values
- Preserve section headers and grouped blocks as they appear.

**Special cells / callouts (if present):**
- Rules, assumptions, warnings, notes — copy verbatim.

Repeat until **all tabs are captured**.

#### 3) Extraction Gaps (if any)

- Tab name → reason (permission / could not load / hidden / unclear)
- Specific ranges or sections missing

#### 4) Do-not-use / Unverified

- List anything you suspect may be incomplete due to access or ambiguity (no guesses).

### Completion criteria

You are only "done" when:
- Every tab has a corresponding **Tab:** section, or is explicitly listed in **Extraction Gaps**.
- No numbers or statements were added that are not present in the sheet.
