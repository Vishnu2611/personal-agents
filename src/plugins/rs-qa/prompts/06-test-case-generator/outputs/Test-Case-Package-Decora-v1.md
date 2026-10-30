# Test Case Package — Decora

## 0. Test case package metadata

| Field | Value |
| --- | --- |
| Product/Project name | Decora |
| Source Test Plan | Test Strategy & Plan — Decora, v1.0, 2026-07-17 (internally approved through this pipeline's checkpoints; test fixture) |
| Test Case Package version | v1.0 |
| Date | 2026-07-17 |
| Owner/DRI | `[CLIENT INPUT REQUIRED: no QA lead named yet]` |
| Destination | None specified — package is ready for manual QA execution as-is. |
| Decision Log destination | In-document only; no Notion hub configured for this test run. |

## 1. Traceability overview

**Scenarios in:** 74 (Test Planner Section 10). **Test cases out:** 73 scenarios produce one `TC-*` block each (5 of them parameterized with a multi-row data table); 1 scenario (`TS-FP12-022`, the exploratory charter) produces no test case by design, per the Expansion Model's altitude rule — exploratory charters are unscripted. **Expansion ratio:** effectively 1:1, since no scenario required a split into multiple separately-numbered cases; five scenarios instead used one parameterized case with a data table. Two cases (`TC-C.2.1-FP12-014-01`, `TC-D.3-FP05-046-01`) are authored to the point their steps are knowable, then explicitly flagged where the expected result depends on a still-open product decision inherited from the Test Planner. **Zero scenarios could not be expanded at all.**

## 2. Test data conventions

- **Advisor accounts:** two seeded, non-production advisor accounts are used throughout to exercise isolation checks — `advisor.alpha@decoratest.io` and `advisor.beta@decoratest.io`, both with password `TestPass!2026` on staging.
- **Client fixtures:** an organization client, "Meridian Capital Advisors" (contact `dana.whitfield@example.com`, `+1-404-555-0142`), and an individual client, "Priya Natarajan" (`priya.n@example.com`, `+1-678-555-0199`), are the default fixtures unless a case specifies otherwise.
- **File fixtures:** logo files (`logo-valid.png`, `logo-valid.jpg`, `logo-valid.svg`, `logo-oversized.png` ~12MB, `logo-badtype.gif`, `logo-corrupted.png`, `logo-transparent.png`, `logo-monochrome.png`, `logo-lowres.png`) and portfolio files (`portfolio-valid.xlsx`, `portfolio-missing-columns.xlsx`, `portfolio-extra-columns.xlsx`, `portfolio-empty.xlsx`) are pre-staged, non-production, synthetic fixtures. `SCENARIO GAP` carried from the Test Plan: `portfolio-valid.xlsx`'s exact column layout is a placeholder pending the real portfolio setting board schema.
- **PII handling:** no real customer data is used anywhere in this package, consistent with the Test Plan's Section 3 assumption; all names, emails, and phone numbers above are synthetic.
- **Environment assumption:** all cases run against the `staging` environment unless a case names `live LLM service` or `live extraction service` explicitly, per the Test Plan's mocked-vs-live split.

**Reflection block**
1. Established one consistent set of fixtures (two advisors, two clients, a fixed file-fixture library) so every test case below references the same concrete data rather than inventing new placeholder values per case.
2. Critiqued against the twelve reflection criteria — confirmed no case below uses vague language like "a valid email"; every reference resolves to one of the fixtures declared here.
3. Weakest part: the portfolio file's column schema remains a placeholder, carried forward as a `SCENARIO GAP`, not resolved here since it depends on the still-outstanding real schema.
4. Revised: added the environment assumption line explicitly, since several cases below depend on knowing whether they run against mocked or live AI services without restating it every time.
5. Final version above.

**→ Human checkpoint (per skill; proceeding per your "confirm and create the final test case" instruction — treating Phase 0 and this Phase 1 frame as approved).** Full case authoring follows below.

## 3. Test cases

*Format: preconditions, test data, a steps table, postconditions, automation status, notes. Case IDs follow `TC-<Epic.Feature>-<FP-block>-<scenario-seq>-<case-seq>`, e.g. `TC-A.1-FP05-001-01` — the `A.1` is the feature from the Test Plan, `FP05` is the FP block (Core Domain vs. AI/RAG), and `001` is that scenario's running sequence number within its FP block, inherited unchanged from the Test Planner's own `TS-FP05-001` scenario ID.*

### Epic A — Client management

#### Test Case: `TC-A.1-FP05-001-01` — Create a client with valid details
- **Source scenario:** `TS-FP05-001` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** A.1 Client profile capture / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** logged in as `advisor.alpha@decoratest.io`; no existing client named "Meridian Capital Advisors" on this account.
- **Test data:** Name: `Meridian Capital Advisors`; Email: `dana.whitfield@example.com`; Phone: `+1-404-555-0142`; Type: Organization.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Navigate to Clients → Add Client. | — | Add Client form displays with Name, Email, Phone, Type fields. |
| 2 | Enter client details and select "Organization." | Name, Email, Phone as above | Fields accept input without validation errors. |
| 3 | Click Save. | — | Client record saves; advisor is returned to the client list. |
| 4 | Locate "Meridian Capital Advisors" in the client list. | — | Client appears with correct name and Organization tag. |

- **Postconditions / cleanup:** delete the client record after the test run, or reset via test data teardown.
- **Automation status:** To-automate (inherited: Automate now).
- **Notes:** none.

#### Test Case: `TC-A.1-FP05-002-01` — Reject invalid email on client creation
- **Source scenario:** `TS-FP05-002` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** A.1 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Negative / System, Regression.
- **Preconditions:** logged in as `advisor.alpha@decoratest.io`.
- **Test data:** Name: `Test Client Invalid`; Email: `dana.whitfield@@example`; Phone: `+1-404-555-0142`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Navigate to Clients → Add Client, enter name and phone. | Name, Phone as above | Fields accept input. |
| 2 | Enter the malformed email and click Save. | `dana.whitfield@@example` | Save is blocked; an inline error reading "Enter a valid email address" (or equivalent) displays. |
| 3 | Confirm no client record was created. | — | "Test Client Invalid" is absent from the client list. |

- **Postconditions / cleanup:** none — no record was created.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.1-FP05-003-01` — Reject invalid phone on client creation
- **Source scenario:** `TS-FP05-003` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** A.1 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P1 / Negative / System, Regression.
- **Preconditions:** logged in as `advisor.alpha@decoratest.io`.
- **Test data:** Name: `Test Client Invalid Phone`; Email: `valid.test@example.com`; Phone: `555-abcd`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Navigate to Clients → Add Client, enter name and email. | Name, Email as above | Fields accept input. |
| 2 | Enter the malformed phone and click Save. | `555-abcd` | Save is blocked; an inline error reading "Enter a valid phone number" (or equivalent) displays. |
| 3 | Confirm no client record was created. | — | "Test Client Invalid Phone" is absent from the client list. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** same pattern as `TC-A.1-FP05-002-01`; consider parameterizing together in the automated suite even though authored separately here.

#### Test Case: `TC-A.1-FP05-004-01` — Cross-advisor client isolation
- **Source scenario:** `TS-FP05-004` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** A.1 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Access-control / System, Regression.
- **Preconditions:** "Meridian Capital Advisors" exists under `advisor.alpha@decoratest.io` only.
- **Test data:** Advisor A: `advisor.alpha@decoratest.io`; Advisor B: `advisor.beta@decoratest.io`; target client: "Meridian Capital Advisors."

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Log in as `advisor.beta@decoratest.io`. | — | Advisor B's client list loads. |
| 2 | View the full client list. | — | "Meridian Capital Advisors" does not appear. |
| 3 | Attempt to load the client's detail page by directly editing the URL/ID to Advisor A's client record. | Advisor A's client record ID | Request is denied (403/404-equivalent), not silently rendered. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** highest-priority case in the package — verify denial happens at the API/data layer, not just that the UI hides the link.

#### Test Case: `TC-A.1-FP05-005-01` — Duplicate client name allowed under one advisor
- **Source scenario:** `TS-FP05-005` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** A.1 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P2 / Edge / System.
- **Preconditions:** logged in as `advisor.alpha@decoratest.io`; no client named "Duplicate Test Co" exists yet.
- **Test data:** Name: `Duplicate Test Co` (used twice, with distinct emails `dup1@example.com` / `dup2@example.com`).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Create a client named "Duplicate Test Co" with `dup1@example.com`. | — | Client saves successfully. |
| 2 | Create a second client, also named "Duplicate Test Co," with `dup2@example.com`. | — | Second client saves successfully; no uniqueness error blocks it. |
| 3 | View the client list. | — | Both "Duplicate Test Co" entries appear as distinct records. |

- **Postconditions / cleanup:** delete both test records.
- **Automation status:** Automate later (inherited).
- **Notes:** none.

#### Test Case: `TC-A.2-FP05-006-01` — Upload a valid client logo (parameterized by file type)
- **Source scenario:** `TS-FP05-006` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** A.2 Client logo upload / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** "Meridian Capital Advisors" exists under `advisor.alpha@decoratest.io` with no logo set.
- **Test data:**

| Row | File |
| --- | --- |
| 1 | `logo-valid.png` |
| 2 | `logo-valid.jpg` |
| 3 | `logo-valid.svg` |

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open "Meridian Capital Advisors" → Branding → Upload Logo. | — | File picker opens. |
| 2 | Select and upload the file for the current data row. | file per row | Upload succeeds; a spinner/progress indicator resolves without error. |
| 3 | View the client's branding panel. | — | The uploaded logo displays and matches the source file. |

- **Postconditions / cleanup:** remove the logo after each row to reset for the next.
- **Automation status:** To-automate.
- **Notes:** run all three rows in sequence against the same client record.

#### Test Case: `TC-A.2-FP05-007-01` — Reject oversized or unsupported logo file (parameterized)
- **Source scenario:** `TS-FP05-007` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** A.2 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Negative / System, Regression.
- **Preconditions:** "Meridian Capital Advisors" exists.
- **Test data:**

| Row | File | Reason |
| --- | --- | --- |
| 1 | `logo-oversized.png` (~12MB) | exceeds size limit |
| 2 | `logo-badtype.gif` | unsupported format |

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open the client's Branding → Upload Logo. | — | File picker opens. |
| 2 | Select and attempt to upload the file for the current row. | file per row | Upload is rejected with a clear message naming the reason (size or format). |
| 3 | Confirm the client's branding is unchanged. | — | No new logo is attached. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.2-FP05-008-01` — Re-uploading a logo replaces the prior one
- **Source scenario:** `TS-FP05-008` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** A.2 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P1 / Functional / System.
- **Preconditions:** "Meridian Capital Advisors" already has `logo-valid.png` attached.
- **Test data:** `logo-valid.jpg`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open Branding → Upload Logo and select `logo-valid.jpg`. | — | Upload succeeds. |
| 2 | View the branding panel. | — | Only `logo-valid.jpg` displays; `logo-valid.png` no longer appears. |
| 3 | Check storage/asset count for this client (via admin/API if available). | — | Exactly one logo asset exists for the client, not two. |

- **Postconditions / cleanup:** remove the logo.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.2-FP05-009-01` — Corrupted logo file handled gracefully
- **Source scenario:** `TS-FP05-009` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** A.2 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** "Meridian Capital Advisors" exists with no logo.
- **Test data:** `logo-corrupted.png` (truncated/invalid image bytes).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open Branding → Upload Logo and select `logo-corrupted.png`. | — | Upload attempt begins. |
| 2 | Observe the result. | — | Upload fails with a clear error; no partial/broken logo is saved; the page does not crash. |

- **Postconditions / cleanup:** none.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-A.2-FP05-010-01` — Transparent-background logo renders acceptably
- **Source scenario:** `TS-FP05-010` — PRD trace: Edge-2.
- **Feature / Role/Portal / Epic / FP Block:** A.2 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P2 / Edge / System.
- **Preconditions:** "Meridian Capital Advisors" exists with no logo.
- **Test data:** `logo-transparent.png`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `logo-transparent.png` to the client. | — | Upload succeeds. |
| 2 | View the logo against the branding panel's white background. | — | Logo is visually legible with no visible artifacting; QA judgment call recorded (pass/fail plus screenshot). |

- **Postconditions / cleanup:** remove the logo.
- **Automation status:** Manual-only.
- **Notes:** visual judgment case — capture a screenshot as evidence.

#### Test Case: `TC-A.3-FP12-001-01` — Automatic palette extraction on logo upload
- **Source scenario:** `TS-FP12-001` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** A.3 Brand color palette extraction / Advisor / A / FP-12.
- **Priority / Type / Test Level(s):** P1 / Functional / System, Integration.
- **Preconditions:** "Meridian Capital Advisors" exists with no logo or palette; color-extraction service mocked to return a deterministic response.
- **Test data:** `logo-valid.png`; mocked response: primary `#1B4F72`, secondary `#D4AC0D`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `logo-valid.png` to the client. | — | Upload succeeds. |
| 2 | Wait for palette extraction to complete. | — | Client's branding panel shows a stored primary and secondary color. |
| 3 | Confirm the stored values match the mocked response. | `#1B4F72` / `#D4AC0D` | Displayed swatches match exactly. |

- **Postconditions / cleanup:** remove logo/palette.
- **Automation status:** Automate later (blocked on mocking setup).
- **Notes:** none.

#### Test Case: `TC-A.3-FP12-002-01` — Manual palette override persists
- **Source scenario:** `TS-FP12-002` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** A.3 / Advisor / A / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** "Meridian Capital Advisors" has an extracted palette (primary `#1B4F72`, secondary `#D4AC0D`).
- **Test data:** new primary `#2E4053`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open Branding → edit primary color. | `#2E4053` | Color picker/field accepts the value. |
| 2 | Save. | — | Confirmation shown; panel now displays `#2E4053` as primary. |
| 3 | Log out and log back in as `advisor.alpha@decoratest.io`; reopen the client. | — | Primary color still reads `#2E4053`. |

- **Postconditions / cleanup:** reset palette.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.3-FP12-003-01` — Low-contrast extraction flagged, not silently applied
- **Source scenario:** `TS-FP12-003` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** A.3 / Advisor / A / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Integration.
- **Preconditions:** color-extraction service mocked to return a low-contrast pair (`#FFFFFF` / `#F5F5F5`).
- **Test data:** `logo-valid.png` with the above mocked response.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload the logo and trigger extraction. | — | Extraction completes. |
| 2 | View the branding panel. | — | A visible low-contrast warning/flag is shown next to the palette, and the palette is not silently applied as the client's active brand colors without advisor acknowledgment. |

- **Postconditions / cleanup:** reset palette.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-A.3-FP12-004-01` — Monochrome logo fallback
- **Source scenario:** `TS-FP12-004` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** A.3 / Advisor / A / FP-12.
- **Priority / Type / Test Level(s):** P1 / Edge / Integration, Exploratory.
- **Preconditions:** live extraction service (Week-1 spike dependent); "Meridian Capital Advisors" has no logo/palette.
- **Test data:** `logo-monochrome.png` (single-color logo).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `logo-monochrome.png`. | — | Upload succeeds. |
| 2 | Observe extraction result. | — | A reasonable primary/secondary pair is returned (e.g. a tint/shade fallback), not an extraction failure or blank palette. |

- **Postconditions / cleanup:** reset palette.
- **Automation status:** Manual-only.
- **Notes:** blocked on the extraction-method Week-1 spike; re-verify once that decision lands.

#### Test Case: `TC-A.3-FP12-005-01` — Transparent or low-resolution logo handled
- **Source scenario:** `TS-FP12-005` — PRD trace: Edge-2.
- **Feature / Role/Portal / Epic / FP Block:** A.3 / Advisor / A / FP-12.
- **Priority / Type / Test Level(s):** P1 / Edge/Integration / Integration, Exploratory.
- **Preconditions:** live extraction service.
- **Test data:** `logo-transparent.png`, `logo-lowres.png` (run both).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `logo-transparent.png`, trigger extraction. | — | Extraction completes without crashing; returns a usable palette. |
| 2 | Repeat with `logo-lowres.png`. | — | Same — no crash, usable palette returned. |

- **Postconditions / cleanup:** reset palette between runs.
- **Automation status:** Manual-only.
- **Notes:** same spike dependency as `TC-A.3-FP12-004-01`.

#### Test Case: `TC-A.4-FP05-011-01` — Valid portfolio file imports successfully
- **Source scenario:** `TS-FP05-011` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** A.4 Portfolio/asset data import / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** "Priya Natarajan" exists with no portfolio data.
- **Test data:** `portfolio-valid.xlsx`. `SCENARIO GAP:` exact column schema is a placeholder pending the real portfolio setting board schema.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open the client → Portfolio Data → Upload. | — | File picker opens. |
| 2 | Select and upload `portfolio-valid.xlsx`. | — | Upload processes and confirms success. |
| 3 | View the client's stored portfolio data. | — | Parsed rows match the source file's row count and key values. |

- **Postconditions / cleanup:** remove imported data.
- **Automation status:** To-automate.
- **Notes:** fixture will need updating once the real schema is confirmed.

#### Test Case: `TC-A.4-FP05-012-01` — Malformed portfolio file rejected with a specific error
- **Source scenario:** `TS-FP05-012` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** A.4 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Negative / System, Regression.
- **Preconditions:** "Priya Natarajan" exists.
- **Test data:** a deliberately malformed file (wrong file type, e.g. `portfolio.txt` renamed to `.xlsx`).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload the malformed file. | — | Upload is rejected. |
| 2 | Read the error message. | — | Message is specific and actionable (e.g. names the file as unreadable/wrong format), not a generic failure. |
| 3 | Confirm no partial data was saved. | — | Client's portfolio data remains empty. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.4-FP05-013-01` — Parsed portfolio data is retrievable downstream
- **Source scenario:** `TS-FP05-013` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** A.4 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Integration / Integration, Regression.
- **Preconditions:** "Priya Natarajan" has `portfolio-valid.xlsx` imported.
- **Test data:** n/a — reuses imported data.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Begin creating a template-based deck for "Priya Natarajan" (see B.1). | — | Deck creation flow starts. |
| 2 | Reach a data-driven section of the template. | — | Section is populated with values matching the imported portfolio file. |

- **Postconditions / cleanup:** discard the test deck.
- **Automation status:** To-automate.
- **Notes:** depends on B.1 being functional; run after `TC-B.1-FP05-018-01`.

#### Test Case: `TC-A.4-FP05-014-01` — File missing required columns rejected by name
- **Source scenario:** `TS-FP05-014` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** A.4 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P0 / Edge / System.
- **Preconditions:** "Priya Natarajan" exists.
- **Test data:** `portfolio-missing-columns.xlsx` (missing the required "Asset Value" column).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `portfolio-missing-columns.xlsx`. | — | Upload is rejected. |
| 2 | Read the error message. | — | Error names "Asset Value" (or the specific missing column) explicitly. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.4-FP05-015-01` — File with extra columns handled without corruption
- **Source scenario:** `TS-FP05-015` — PRD trace: Edge-2.
- **Feature / Role/Portal / Epic / FP Block:** A.4 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** "Priya Natarajan" exists with no portfolio data.
- **Test data:** `portfolio-extra-columns.xlsx` (all required columns present, plus an unexpected "Notes" column).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `portfolio-extra-columns.xlsx`. | — | Upload succeeds. |
| 2 | View the stored portfolio data. | — | All required-column values are correctly stored; the extra column is ignored, not causing corrupted or shifted data. |

- **Postconditions / cleanup:** remove imported data.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.4-FP05-016-01` — Empty portfolio file rejected cleanly
- **Source scenario:** `TS-FP05-016` — PRD trace: Edge-3.
- **Feature / Role/Portal / Epic / FP Block:** A.4 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** "Priya Natarajan" exists.
- **Test data:** `portfolio-empty.xlsx` (valid headers, zero data rows).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `portfolio-empty.xlsx`. | — | Upload is rejected (or accepted with an explicit "no data rows" notice, per implementation) — not a silent no-op. |
| 2 | Confirm no crash occurred. | — | Page remains responsive; error/notice is clear. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-A.4-FP05-017-01` — Re-uploading portfolio data replaces prior data
- **Source scenario:** `TS-FP05-017` — PRD trace: Edge-4.
- **Feature / Role/Portal / Epic / FP Block:** A.4 / Advisor / A / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System, Regression.
- **Preconditions:** "Priya Natarajan" already has `portfolio-valid.xlsx` imported.
- **Test data:** a second valid file, `portfolio-valid-v2.xlsx`, with different values.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Upload `portfolio-valid-v2.xlsx`. | — | Upload succeeds. |
| 2 | View the stored portfolio data. | — | Data matches `portfolio-valid-v2.xlsx` only; no rows from the original file remain. |

- **Postconditions / cleanup:** remove imported data.
- **Automation status:** To-automate.
- **Notes:** none.

### Epic B — Template-based deck creation

#### Test Case: `TC-B.1-FP05-018-01` — Template + client produces a populated deck
- **Source scenario:** `TS-FP05-018` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** B.1 Template-based deck creation / Advisor / B / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** "Priya Natarajan" has a logo, palette, and imported portfolio data.
- **Test data:** Template: "Quarterly Portfolio Review" (representative template).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Navigate to Decks → New Deck → select "Priya Natarajan" → select template. | — | Deck creation begins. |
| 2 | Wait for generation to complete. | — | Deck opens showing client name, logo, brand colors, and portfolio figures correctly populated. |

- **Postconditions / cleanup:** discard the test deck.
- **Automation status:** To-automate.
- **Notes:** exploratory pass (Section 8 of the Test Plan) covers the remaining 4–5 templates.

#### Test Case: `TC-B.1-FP05-019-01` — Deck creation is isolated per client
- **Source scenario:** `TS-FP05-019` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** B.1 / Advisor / B / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Integration, Regression.
- **Preconditions:** "Meridian Capital Advisors" and "Priya Natarajan" both have complete branding/data.
- **Test data:** same template for both clients.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Create a deck for "Meridian Capital Advisors" from the template; edit its title text. | — | Deck A saves with the edit. |
| 2 | Create a second deck for "Priya Natarajan" from the same template. | — | Deck B is created fresh, without Deck A's edit. |
| 3 | Reopen the source template. | — | Template itself shows no edits from either deck. |

- **Postconditions / cleanup:** discard both test decks.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-B.1-FP05-020-01` — Missing required data field is flagged
- **Source scenario:** `TS-FP05-020` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** B.1 / Advisor / B / FP-05.
- **Priority / Type / Test Level(s):** P0 / Negative / System.
- **Preconditions:** a client exists with branding but a portfolio file missing one field the template requires.
- **Test data:** client "Test Gap Co" with `portfolio-missing-columns.xlsx` imported.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Create a deck for "Test Gap Co" from the template. | — | Deck generates. |
| 2 | View the section relying on the missing field. | — | Section shows a visible flag/placeholder ("data missing"), not a blank or fabricated value. |

- **Postconditions / cleanup:** discard the test deck and client.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-B.1-FP05-021-01` — Deck creation with no portfolio data degrades gracefully
- **Source scenario:** `TS-FP05-021` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** B.1 / Advisor / B / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** client "Test No Data Co" exists with logo/palette but no portfolio import.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Create a deck for "Test No Data Co" from the template. | — | Deck still generates without a hard failure. |
| 2 | View data-driven sections. | — | Sections show a clear "no data" state rather than errors or blank crashes. |

- **Postconditions / cleanup:** discard test deck/client.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-B.1-FP05-022-01` — Deck creation with no logo/palette falls back sensibly
- **Source scenario:** `TS-FP05-022` — PRD trace: Edge-2.
- **Feature / Role/Portal / Epic / FP Block:** B.1 / Advisor / B / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** client "Test No Brand Co" exists with portfolio data but no logo/palette.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Create a deck for "Test No Brand Co" from the template. | — | Deck generates. |
| 2 | View the deck's branding elements. | — | A default/neutral branding treatment is applied, not a broken layout or missing logo placeholder error. |

- **Postconditions / cleanup:** discard test deck/client.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-B.2-FP12-006-01` — AI text-edit updates only the targeted text
- **Source scenario:** `TS-FP12-006` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** B.2 AI content editing (template decks) / Advisor / B / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Integration.
- **Preconditions:** a populated template deck exists (from `TC-B.1-FP05-018-01`) with known text "Q3 Portfolio Summary" on page 1.
- **Test data:** AI prompt: `"Change the title on page 1 to 'Q4 Portfolio Summary'."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open the deck editor's AI edit panel and submit the prompt. | prompt as above | AI proposes an edit changing only that title text. |
| 2 | Accept the proposed edit. | — | Page 1 title now reads "Q4 Portfolio Summary"; all other text and pages are unchanged. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Automate later (blocked on LLM mocking setup).
- **Notes:** none.

#### Test Case: `TC-B.2-FP12-007-01` — AI page removal removes exactly the targeted page
- **Source scenario:** `TS-FP12-007` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** B.2 / Advisor / B / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Integration.
- **Preconditions:** a populated template deck with 5 known pages.
- **Test data:** AI prompt: `"Remove page 3."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the prompt in the AI edit panel and accept the proposal. | prompt as above | Deck now has 4 pages; the original page 3 content is gone; pages 1, 2, 4, 5 (renumbered 1–4) are unchanged. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-B.2-FP12-008-01` — Advisor sees a preview before an AI edit saves
- **Source scenario:** `TS-FP12-008` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** B.2 / Advisor / B / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System.
- **Preconditions:** a populated template deck.
- **Test data:** AI prompt: `"Change the subtitle to 'Prepared for review.'"`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the prompt. | — | A preview of the proposed change displays, distinct from the saved deck state. |
| 2 | Decline the proposed edit instead of accepting it. | — | Deck reverts to its prior state; no change is saved. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-B.2-FP12-009-01` — Invalid AI edit target is rejected cleanly
- **Source scenario:** `TS-FP12-009` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** B.2 / Advisor / B / FP-12.
- **Priority / Type / Test Level(s):** P0 / Negative/Edge / Integration, Exploratory.
- **Preconditions:** a populated template deck with 5 pages; live LLM service.
- **Test data:** AI prompt: `"Remove page 9."` (deck only has 5 pages).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the prompt. | — | System does not attempt to apply a change to a nonexistent page. |
| 2 | Read the response. | — | A clear message states the page doesn't exist; no other part of the deck is altered. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Manual-only.
- **Notes:** this is the feature's core guardrail risk — run against the live LLM, not a mock.

#### Test Case: `TC-B.2-FP12-010-01` — Conflicting rapid edit requests resolve deterministically
- **Source scenario:** `TS-FP12-010` — PRD trace: Edge-2.
- **Feature / Role/Portal / Epic / FP Block:** B.2 / Advisor / B / FP-12.
- **Priority / Type / Test Level(s):** P1 / Edge / Integration, Exploratory.
- **Preconditions:** a populated template deck; live LLM service.
- **Test data:** Prompt 1: `"Change the title to 'Version A'."` Prompt 2 (submitted within 1–2 seconds of Prompt 1): `"Change the title to 'Version B'."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit Prompt 1, then immediately submit Prompt 2 before Prompt 1's preview resolves. | both prompts | System either applies them in a defined order (e.g. last-write-wins) or surfaces a conflict message — the deck does not end up in a corrupted/partial state. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Manual-only.
- **Notes:** record which resolution behavior is observed for the Decision Log.

### Epic C — Custom AI-generated deck

#### Test Case: `TC-C.1-FP05-023-01` — Guided questions are required before generation
- **Source scenario:** `TS-FP05-023` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** C.1 Guided custom-deck parameters / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P0 / Negative / System, Regression.
- **Preconditions:** logged in as `advisor.alpha@decoratest.io`, starting a new custom deck for "Priya Natarajan."
- **Test data:** leave page-count field blank.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Start a custom deck; leave the guided page-count question unanswered; attempt to proceed to the prompt step. | — | Progression is blocked; a validation message indicates the field is required. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.1-FP05-024-01` — Guided answers are stored and retrievable with the deck
- **Source scenario:** `TS-FP05-024` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** C.1 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P1 / Functional / System, Regression.
- **Preconditions:** starting a new custom deck for "Priya Natarajan."
- **Test data:** page count: `5`; purpose: `"Quarterly client review."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Complete the guided questions with the data above and proceed. | — | Flow advances to prompt entry. |
| 2 | Complete deck generation, then reopen the resulting deck's details/metadata. | — | Page count `5` and purpose `"Quarterly client review."` are both visible/stored against the deck. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.1-FP05-025-01` — Guided answers measurably influence generated output
- **Source scenario:** `TS-FP05-025` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** C.1 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / Integration.
- **Preconditions:** mocked generation service.
- **Test data:** page count: `4`; prompt: `"A brief portfolio overview."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Complete guided questions and prompt, generate the deck. | data above | Generation completes. |
| 2 | Count the resulting deck's pages. | — | Deck has exactly 4 pages, matching the requested page count. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-C.1-FP05-026-01` — Unreasonable page count is rejected or clamped (parameterized)
- **Source scenario:** `TS-FP05-026` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** C.1 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** starting a new custom deck.
- **Test data:**

| Row | Page count entered |
| --- | --- |
| 1 | `0` |
| 2 | `500` |

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Enter the page count for the current row and attempt to proceed. | value per row | System either rejects the value with a validation message or clamps it to a defined min/max — it never silently passes an unreasonable value through to generation. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** confirm which behavior (reject vs. clamp) is actually implemented and record it.

#### Test Case: `TC-C.1-FP05-027-01` — Ambiguous purpose text does not block the flow
- **Source scenario:** `TS-FP05-027` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** C.1 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P2 / Edge / System, Exploratory.
- **Preconditions:** starting a new custom deck.
- **Test data:** purpose: `"stuff"`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Enter `"stuff"` as the purpose and proceed. | — | Flow proceeds without blocking on the low-quality input; generation is still attempted. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Manual-only.
- **Notes:** none.

#### Test Case: `TC-C.2.1-FP12-011-01` — Prompt and guided answers produce a stored outline
- **Source scenario:** `TS-FP12-011` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** C.2.1 Prompt intake & structure planning / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / Integration.
- **Preconditions:** mocked LLM outline service.
- **Test data:** page count `4`; prompt: `"A portfolio review for a conservative-growth client, covering performance, risk, and outlook."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the guided answers and prompt. | data above | Outline generation runs. |
| 2 | Inspect the stored outline (via deck detail/debug view). | — | A page-by-page outline exists with 4 sections, plausibly matching the prompt's themes (performance, risk, outlook). |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-C.2.1-FP12-012-01` — Outline page count matches the guided parameter
- **Source scenario:** `TS-FP12-012` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** C.2.1 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / Integration.
- **Preconditions:** mocked LLM outline service.
- **Test data:** page count `7`; any valid prompt.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit guided answers with page count `7` and any prompt. | — | Outline generates. |
| 2 | Count outline sections. | — | Exactly 7 sections. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-C.2.1-FP12-013-01` — Generated outline is retrievable by the next generation step
- **Source scenario:** `TS-FP12-013` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** C.2.1 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Integration / Integration, Regression.
- **Preconditions:** an outline has been generated (from `TC-C.2.1-FP12-011-01`).
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Proceed to content generation for the same deck. | — | Content generation reads and uses the previously stored outline (verified via matching section count/titles), not a freshly re-planned one. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.2.1-FP12-014-01` — Contradictory prompt vs. guided page count *(partial — blocked)*
- **Source scenario:** `TS-FP12-014` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** C.2.1 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Edge / Integration, Exploratory.
- **Preconditions:** live LLM service.
- **Test data:** page count `3`; prompt: `"Cover performance, risk, outlook, fees, and a five-year projection"` (implies more sections than 3 pages allows).

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the contradictory guided answer/prompt pair. | data above | Outline generation runs. |
| 2 | Inspect the resulting outline. | — | `DECISION NEEDED:` expected result is not yet defined — the Test Planner's `DECISION NEEDED:` conflict-resolution rule is still unresolved. Record actual observed behavior (e.g. does it honor the page count and drop content, or expand beyond 3 pages?) as evidence for that decision, rather than a pass/fail. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Manual-only.
- **Notes:** **not executable as pass/fail yet** — treat this run as an information-gathering pass to inform the still-open product decision, then re-author this case once resolved.

#### Test Case: `TC-C.2.1-FP12-015-01` — Minimal/vague prompt still produces a usable outline
- **Source scenario:** `TS-FP12-015` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** C.2.1 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P1 / Edge / Exploratory.
- **Preconditions:** live LLM service.
- **Test data:** page count `3`; prompt: `"portfolio"`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the minimal prompt with the guided answers. | data above | Outline still generates 3 sections with plausible, non-empty titles — not an error or blank outline. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Manual-only.
- **Notes:** exploratory judgment on usability quality; record examples.

#### Test Case: `TC-C.2.2-FP12-016-01` — Every outlined section receives generated content
- **Source scenario:** `TS-FP12-016` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** C.2.2 AI content & layout generation engine / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / Integration.
- **Preconditions:** an outline exists (mocked LLM content service).
- **Test data:** 4-section outline from `TC-C.2.1-FP12-011-01`.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Trigger content generation for the outlined deck. | — | Generation completes. |
| 2 | Inspect each of the 4 sections. | — | Every section has non-empty generated content; none are blank. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-C.2.2-FP12-017-01` — Generated deck applies client brand colors automatically
- **Source scenario:** `TS-FP12-017` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** C.2.2 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** "Priya Natarajan" has a stored palette (primary `#1B4F72`); an outline/content exist.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Complete generation for the client's custom deck. | — | Deck renders. |
| 2 | Inspect the deck's color scheme. | — | Primary color `#1B4F72` is applied to the expected brand elements (e.g. headers/accents). |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.2.2-FP12-018-01` — Section generation failure is surfaced, not dropped
- **Source scenario:** `TS-FP12-018` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** C.2.2 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / Integration.
- **Preconditions:** fault-injection harness configured to fail generation on section 3 of a 4-section outline.
- **Test data:** injected failure on section 3.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Trigger generation with the injected failure active. | — | Generation completes for sections 1, 2, 4. |
| 2 | Inspect section 3 and the overall deck/draft status. | — | Section 3 is visibly flagged as failed/incomplete to the advisor; it is not silently left blank or skipped without notice. |

- **Postconditions / cleanup:** discard the deck; reset fault injection.
- **Automation status:** Automate later.
- **Notes:** this evidence also serves the Reliability NFR check (Test Plan Section 6).

#### Test Case: `TC-C.2.2-FP12-019-01` — Generation timeout is handled gracefully
- **Source scenario:** `TS-FP12-019` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** C.2.2 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Edge / Integration.
- **Preconditions:** fault-injection harness configured to simulate an LLM timeout on one section.
- **Test data:** injected timeout, section 2.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Trigger generation with the injected timeout active. | — | System does not hang indefinitely. |
| 2 | Observe the outcome. | — | A retry, timeout error state, or partial-save occurs within a bounded time; the advisor is informed, not left on an infinite spinner. |

- **Postconditions / cleanup:** discard the deck; reset fault injection.
- **Automation status:** Automate later.
- **Notes:** also serves the Reliability NFR check.

#### Test Case: `TC-C.2.2-FP12-020-01` — Out-of-scope content request fails informatively
- **Source scenario:** `TS-FP12-020` — PRD trace: Edge-2.
- **Feature / Role/Portal / Epic / FP Block:** C.2.2 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Edge / Exploratory.
- **Preconditions:** live LLM service.
- **Test data:** prompt: `"Include today's live S&P 500 closing price in the deck."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the out-of-scope prompt and generate. | — | Generation completes (or fails informatively). |
| 2 | Inspect the relevant section's content. | — | The system does not fabricate a plausible-looking but false real-time figure; it either omits the request or states it cannot provide live data. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Manual-only.
- **Notes:** content-quality judgment call; document the actual generated text as evidence.

#### Test Case: `TC-C.2.2-FP12-021-01` — Risk-validation: multi-section generation reliability (parameterized prompt sample)
- **Source scenario:** `TS-FP12-021` — PRD trace: Risk.
- **Feature / Role/Portal / Epic / FP Block:** C.2.2 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Risk-validation / System, E2E, Exploratory.
- **Preconditions:** live LLM generation service (not mocked) — this is the release-gating case.
- **Test data:**

| Row | Prompt | Page count |
| --- | --- | --- |
| 1 | "A portfolio review for a conservative-growth client, covering performance, risk, and outlook." | 4 |
| 2 | "A retirement-planning summary emphasizing long-term stability." | 5 |
| 3 | "A brief quarterly check-in with no specific focus." | 3 |
| 4 | "An aggressive-growth portfolio pitch highlighting recent wins." | 6 |
| 5 | "A year-end summary comparing performance against a benchmark index." | 5 |

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | For each row, complete the guided flow and generate a deck against the live service. | prompt + page count per row | Each deck completes generation without a hard failure. |
| 2 | Review each deck's sections for coherence and completeness. | — | Every section across all 5 decks has complete, on-topic, non-repetitive content; no deck has more than one flagged/failed section. |
| 3 | Tally the pass rate across the 5-row sample. | — | Recorded as evidence for the release-gate decision (Test Plan Section 11) — a QA judgment call on whether the sample demonstrates acceptable reliability, not a single boolean pass/fail. |

- **Postconditions / cleanup:** discard all 5 test decks.
- **Automation status:** Manual-only — mandatory release gate; do not automate until the underlying approach is proven per the Test Plan's Section 2 High-tier rule.
- **Notes:** this is the single most important case in the package; the sample size (5) is a QA judgment call — expand if early results are borderline.

*(`TS-FP12-022`, the exploratory charter, produces no test case — see Section 7.)*

#### Test Case: `TC-C.2.3-FP05-028-01` — Generated draft displays the client's logo
- **Source scenario:** `TS-FP05-028` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** C.2.3 Generated-draft branding finalization / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** "Priya Natarajan" has a logo set; a custom deck is generated for her.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open the generated draft deck. | — | Client's logo appears on the deck (e.g. title page/header). |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.2.3-FP05-029-01` — Newly generated deck status is draft, not finished
- **Source scenario:** `TS-FP05-029` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** C.2.3 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** a custom deck has just completed generation.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | View the deck's status indicator. | — | Status reads "Draft," not "Finished." |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.2.3-FP05-030-01` — Generation completes even with no client logo
- **Source scenario:** `TS-FP05-030` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** C.2.3 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** client "Test No Logo Co" exists with no logo uploaded.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Generate a custom deck for "Test No Logo Co." | — | Generation completes without failure; deck shows a default/blank branding treatment instead of erroring. |

- **Postconditions / cleanup:** discard deck/client.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.2.3-FP05-031-01` — Draft status blocks export
- **Source scenario:** `TS-FP05-031` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** C.2.3 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional/Integration / Integration, Regression.
- **Preconditions:** a freshly generated draft deck exists.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Attempt to export the draft deck to PDF or PPTX. | — | Export option is disabled/hidden, or the action is rejected with a message that the deck must be finished first. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** cross-checks D.1/D.2's gating logic — run alongside `TC-D.1-FP05-034-01`/`TC-D.2-FP05-040-01`.

#### Test Case: `TC-C.2.3-FP05-032-01` — Confirmed client name appears on the generated draft
- **Source scenario:** `TS-FP05-032` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** C.2.3 / Advisor / C / FP-05.
- **Priority / Type / Test Level(s):** P2 / Edge / System.
- **Preconditions:** "Priya Natarajan" has a generated draft deck.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Open the draft deck. | — | "Priya Natarajan" (the real confirmed name) appears where a client name is shown — not a placeholder like "[Client Name]." |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.3-FP12-023-01` — AI edit applies correctly to a generated draft
- **Source scenario:** `TS-FP12-023` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** C.3 AI/manual draft refinement (custom decks) / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / Integration.
- **Preconditions:** a generated draft deck exists; mocked LLM (shared with B.2).
- **Test data:** AI prompt: `"Change the closing section's tone to more formal."`

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Submit the prompt via the deck editor's AI panel and accept. | — | The closing section's text updates accordingly; other sections unchanged. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** Automate later.
- **Notes:** reuses B.2's editing surface/mocks.

#### Test Case: `TC-C.3-FP12-024-01` — Manual edit applies to generated content
- **Source scenario:** `TS-FP12-024` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** C.3 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** a generated draft deck exists.
- **Test data:** manual text change on page 2: replace "Overview" with "Executive Summary."

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Click into page 2's heading and manually edit the text. | "Executive Summary" | Text updates immediately, with no AI call involved. |
| 2 | Save/exit the editor and reopen. | — | Change persists. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.3-FP12-025-01` — Marking a deck finished requires an explicit action
- **Source scenario:** `TS-FP12-025` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** C.3 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** a generated draft deck with no incomplete sections.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Click the "Mark as Finished" (or equivalent) action. | — | A confirmation is required (e.g. a confirm dialog), then status updates to "Finished." |
| 2 | Navigate away and back to the deck. | — | Status remains "Finished." |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-C.3-FP12-026-01` — Cannot finish a deck with an incomplete generated section
- **Source scenario:** `TS-FP12-026` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** C.3 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P0 / Negative / System, Integration.
- **Preconditions:** a draft deck with one section deliberately left in a failed/incomplete state (from `TC-C.2.2-FP12-018-01`'s fault injection).
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Attempt to mark the deck as finished while section 3 is still flagged failed. | — | Action is blocked, or a clear warning is shown requiring the advisor to resolve the failed section first. |

- **Postconditions / cleanup:** discard the deck; reset fault injection.
- **Automation status:** To-automate.
- **Notes:** ties directly to `TC-C.2.2-FP12-018-01`'s failure-surfacing behavior.

#### Test Case: `TC-C.3-FP12-027-01` — Recent edit can be undone
- **Source scenario:** `TS-FP12-027` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** C.3 / Advisor / C / FP-12.
- **Priority / Type / Test Level(s):** P1 / Functional / System.
- **Preconditions:** a draft deck with a recent manual edit (from `TC-C.3-FP12-024-01`).
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Click Undo (or equivalent) immediately after the edit. | — | Page 2's heading reverts to "Overview." |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** none.

### Epic D — Deck export and sharing

#### Test Case: `TC-D.1-FP05-033-01` — Exported PDF matches the on-platform deck
- **Source scenario:** `TS-FP05-033` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** D.1 Export to PDF / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** a finished deck exists.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Click Export → PDF. | — | PDF downloads. |
| 2 | Compare the PDF page-by-page against the on-platform deck view. | — | Content, layout, and branding match. |

- **Postconditions / cleanup:** delete downloaded file.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-D.1-FP05-034-01` — Draft deck cannot be exported to PDF
- **Source scenario:** `TS-FP05-034` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** D.1 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Negative / System, Regression.
- **Preconditions:** a draft (unfinished) deck exists.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Attempt to access Export → PDF for the draft deck. | — | Option is disabled/hidden, or the action is rejected with a "finish the deck first" message. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** run alongside `TC-C.2.3-FP05-031-01`.

#### Test Case: `TC-D.1-FP05-035-01` — Re-export after edit produces an updated PDF
- **Source scenario:** `TS-FP05-035` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** D.1 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P1 / Functional / System.
- **Preconditions:** a finished deck has already been exported once.
- **Test data:** edit: change the deck's title text, then re-finish.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Edit the finished deck's title, re-finish it. | new title | Deck saves with the new title. |
| 2 | Export to PDF again. | — | New PDF reflects the updated title, not the original cached version. |

- **Postconditions / cleanup:** delete downloaded files.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-D.1-FP05-036-01` — Chart rendering is visually consistent in PDF export
- **Source scenario:** `TS-FP05-036` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** D.1 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / Exploratory.
- **Preconditions:** a finished deck containing an AI-generated chart exists.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Export to PDF and open the exported file. | — | Chart renders legibly and matches the on-platform appearance (colors, labels, proportions). |

- **Postconditions / cleanup:** delete downloaded file.
- **Automation status:** Manual-only.
- **Notes:** visual judgment case; capture screenshots as evidence.

#### Test Case: `TC-D.1-FP05-037-01` — Maximum-length deck exports without truncation or timeout
- **Source scenario:** `TS-FP05-037` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** D.1 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P2 / Edge / System, Integration.
- **Preconditions:** a finished deck at the platform's maximum supported page count.
- **Test data:** n/a — use the max page-count boundary confirmed for the platform.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Export the maximum-length deck to PDF. | — | Export completes within a reasonable time; all pages are present in the output, none truncated. |

- **Postconditions / cleanup:** delete downloaded file.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-D.2-FP05-038-01` — Exported PPTX opens correctly in PowerPoint
- **Source scenario:** `TS-FP05-038` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** D.2 Export to PPTX / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Integration.
- **Preconditions:** a finished deck exists.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Export to PPTX and open the file in a standard PowerPoint version. | — | File opens without a corruption warning or repair prompt. |

- **Postconditions / cleanup:** delete downloaded file.
- **Automation status:** Automate later.
- **Notes:** none.

#### Test Case: `TC-D.2-FP05-039-01` — PPTX text and images remain independently editable
- **Source scenario:** `TS-FP05-039` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** D.2 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / Exploratory.
- **Preconditions:** the exported PPTX from `TC-D.2-FP05-038-01` is open in PowerPoint.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Click into a text box and edit its content. | sample edit | Text box is independently editable; edit applies without affecting other elements. |
| 2 | Click an image element and attempt to move/resize it. | — | Image is independently selectable and manipulable, not flattened into the slide background. |

- **Postconditions / cleanup:** discard the edited file.
- **Automation status:** Manual-only.
- **Notes:** none.

#### Test Case: `TC-D.2-FP05-040-01` — Draft deck cannot be exported to PPTX
- **Source scenario:** `TS-FP05-040` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** D.2 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Negative / System, Regression.
- **Preconditions:** a draft (unfinished) deck exists.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Attempt Export → PPTX on the draft deck. | — | Option disabled/hidden, or rejected with a "finish the deck first" message. |

- **Postconditions / cleanup:** discard the deck.
- **Automation status:** To-automate.
- **Notes:** matches `TC-D.1-FP05-034-01`'s gating rule for PDF.

#### Test Case: `TC-D.2-FP05-041-01` — Complex chart maps to an editable PPTX shape
- **Source scenario:** `TS-FP05-041` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** D.2 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Edge/Integration / Integration, Exploratory.
- **Preconditions:** a finished deck containing a complex AI-generated chart (e.g. a multi-series line chart).
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Export to PPTX and open in PowerPoint. | — | The chart appears as an editable native shape/chart object (or an acceptable fallback), not a broken or flattened image. |

- **Postconditions / cleanup:** discard the file.
- **Automation status:** Manual-only.
- **Notes:** this is the feature's named technical risk — document the actual fallback behavior observed.

#### Test Case: `TC-D.2-FP05-042-01` — Text-only deck exports cleanly
- **Source scenario:** `TS-FP05-042` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** D.2 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P1 / Edge / System.
- **Preconditions:** a finished deck with no charts, text content only.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Export to PPTX and open. | — | Text formatting (fonts, sizes, colors) is preserved correctly, with no chart-fallback logic interfering. |

- **Postconditions / cleanup:** discard the file.
- **Automation status:** Automate later.
- **Notes:** isolates the text-only path from the higher-risk chart path.

#### Test Case: `TC-D.3-FP05-043-01` — Live link generation produces a working public URL
- **Source scenario:** `TS-FP05-043` — PRD trace: AC-1.
- **Feature / Role/Portal / Epic / FP Block:** D.3 Live link sharing / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** a finished deck exists.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Click Generate Live Link. | — | A URL is produced. |
| 2 | Open the URL in a fresh, unauthenticated browser session (no login). | — | The deck renders read-only, without requiring sign-in. |

- **Postconditions / cleanup:** none — link left active for follow-on cases.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-D.3-FP05-044-01` — Live link persists over an extended period
- **Source scenario:** `TS-FP05-044` — PRD trace: AC-2.
- **Feature / Role/Portal / Epic / FP Block:** D.3 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P1 / Functional / Regression.
- **Preconditions:** a live link exists (from `TC-D.3-FP05-043-01`).
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Wait a defined interval (e.g. 30 days, run on a slow regression cadence per Test Plan Section 9), then revisit the URL. | — | Link remains accessible and functional. |

- **Postconditions / cleanup:** none.
- **Automation status:** Automate later — long-duration, low-frequency check.
- **Notes:** schedule on the slow cadence, not per-PR.

#### Test Case: `TC-D.3-FP05-045-01` — Live link reflects the deck's latest edit
- **Source scenario:** `TS-FP05-045` — PRD trace: AC-3.
- **Feature / Role/Portal / Epic / FP Block:** D.3 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Functional / System, Regression.
- **Preconditions:** a live link exists for a finished deck.
- **Test data:** edit: change the deck's title, re-finish.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Edit and re-finish the deck's title. | new title | Deck saves. |
| 2 | Reload the existing live link (same URL, no regeneration). | — | The updated title displays at the link. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** none.

#### Test Case: `TC-D.3-FP05-046-01` — Deck deletion after link sharing *(partial — blocked)*
- **Source scenario:** `TS-FP05-046` — PRD trace: Edge-1.
- **Feature / Role/Portal / Epic / FP Block:** D.3 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Edge / System.
- **Preconditions:** a live link exists for a finished deck.
- **Test data:** n/a.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Delete (or un-finalize, if that action exists) the underlying deck. | — | Delete/un-finalize action completes. |
| 2 | Revisit the previously shared live link. | — | `OPEN QUESTION:` expected result is not yet defined — the Test Planner's `OPEN QUESTION:` on post-deletion link behavior is unresolved. Record actual observed behavior (error page, "deck no longer available" message, or a crash) as evidence, rather than a pass/fail. |

- **Postconditions / cleanup:** none.
- **Automation status:** Manual-only.
- **Notes:** **not executable as pass/fail yet** — the one hard requirement regardless of outcome is that it must not error ungracefully (e.g. a raw stack trace); confirm that much even without the full product decision.

#### Test Case: `TC-D.3-FP05-047-01` — Malformed/guessed live-link URL does not expose another client's deck
- **Source scenario:** `TS-FP05-047` (`SCENARIO ADDITION`) — PRD trace: `ASSUMPTION`.
- **Feature / Role/Portal / Epic / FP Block:** D.3 / Advisor / D / FP-05.
- **Priority / Type / Test Level(s):** P0 / Access-control/Edge / System.
- **Preconditions:** a live link exists for "Priya Natarajan"'s deck; a second, unrelated finished deck exists for "Meridian Capital Advisors."
- **Test data:** the valid link with its final path segment altered by one character.

| Step # | Action | Test Data | Expected Result |
| --- | --- | --- | --- |
| 1 | Take the valid live link and modify one character of its unique identifier. | altered URL | URL returns a not-found/invalid-link response. |
| 2 | Confirm it does not accidentally resolve to "Meridian Capital Advisors"'s deck or any other deck. | — | No other client's deck is exposed. |

- **Postconditions / cleanup:** none.
- **Automation status:** To-automate.
- **Notes:** security-adjacent check for a public, unauthenticated route.

## 4. Automation artifacts

Gherkin scenarios are provided only for cases inherited as **Automate now**. Automate-later cases carry a one-line blocker note instead (shown inline in Section 3 above, under "Automation status"); Manual-only cases get nothing here by design.

```gherkin
Feature: Client profile capture

  # TS-FP05-001 / TC-A.1-FP05-001-01
  Scenario: Advisor creates a client with valid details
    Given the advisor is logged in with no existing client named "Meridian Capital Advisors"
    When the advisor submits a new client with valid name, email, phone, and type "Organization"
    Then the client record is saved and appears in the client list

  # TS-FP05-002 / TC-A.1-FP05-002-01
  Scenario: Invalid email is rejected on client creation
    Given the advisor is on the Add Client form
    When the advisor enters an invalid email and clicks Save
    Then the save is blocked and a validation error is shown

  # TS-FP05-003 / TC-A.1-FP05-003-01
  Scenario: Invalid phone is rejected on client creation
    Given the advisor is on the Add Client form
    When the advisor enters an invalid phone number and clicks Save
    Then the save is blocked and a validation error is shown

  # TS-FP05-004 / TC-A.1-FP05-004-01
  Scenario: Advisor cannot access another advisor's client
    Given "Meridian Capital Advisors" exists only under advisor A's account
    When advisor B attempts to load that client's detail page directly by ID
    Then the request is denied
```

```gherkin
Feature: Client logo upload

  # TS-FP05-006 / TC-A.2-FP05-006-01
  Scenario Outline: Advisor uploads a valid logo file
    Given a client with no logo set
    When the advisor uploads a "<file>"
    Then the logo displays on the client's branding panel

    Examples:
      | file            |
      | logo-valid.png  |
      | logo-valid.jpg  |
      | logo-valid.svg  |

  # TS-FP05-007 / TC-A.2-FP05-007-01
  Scenario Outline: Advisor uploads an invalid logo file
    Given a client with no logo set
    When the advisor attempts to upload "<file>"
    Then the upload is rejected with a clear reason

    Examples:
      | file                |
      | logo-oversized.png  |
      | logo-badtype.gif    |

  # TS-FP05-008 / TC-A.2-FP05-008-01
  Scenario: Re-uploading a logo replaces the prior one
    Given a client already has a logo attached
    When the advisor uploads a new logo
    Then only the new logo is displayed and stored
```

```gherkin
Feature: Brand color palette extraction

  # TS-FP12-002 / TC-A.3-FP12-002-01
  Scenario: Manual palette override persists
    Given a client has an extracted palette
    When the advisor manually edits the primary color and saves
    Then the new color persists across sessions
```

```gherkin
Feature: Portfolio/asset data import

  # TS-FP05-011 / TC-A.4-FP05-011-01
  Scenario: Valid portfolio file imports successfully
    Given a client with no portfolio data
    When the advisor uploads a correctly formatted portfolio file
    Then the parsed data is stored against the client

  # TS-FP05-012 / TC-A.4-FP05-012-01
  Scenario: Malformed portfolio file is rejected
    Given a client with no portfolio data
    When the advisor uploads a malformed file
    Then the upload is rejected with a specific error and no data is saved

  # TS-FP05-013 / TC-A.4-FP05-013-01
  Scenario: Parsed portfolio data is available to deck creation
    Given a client has imported portfolio data
    When the advisor begins creating a template-based deck for that client
    Then the deck's data-driven sections reflect the imported values

  # TS-FP05-014 / TC-A.4-FP05-014-01
  Scenario: File missing required columns is rejected by name
    Given a client with no portfolio data
    When the advisor uploads a file missing a required column
    Then the error names the specific missing column

  # TS-FP05-015 / TC-A.4-FP05-015-01
  Scenario: File with extra columns imports without corruption
    Given a client with no portfolio data
    When the advisor uploads a file with all required columns plus an extra column
    Then all required data imports correctly and the extra column is ignored

  # TS-FP05-016 / TC-A.4-FP05-016-01
  Scenario: Empty portfolio file is rejected cleanly
    Given a client with no portfolio data
    When the advisor uploads a file with valid headers and no data rows
    Then the system responds with a clear rejection or notice, not a silent no-op

  # TS-FP05-017 / TC-A.4-FP05-017-01
  Scenario: Re-uploading portfolio data replaces prior data
    Given a client already has portfolio data imported
    When the advisor uploads a new valid portfolio file
    Then only the new file's data is stored
```

```gherkin
Feature: Template-based deck creation

  # TS-FP05-018 / TC-B.1-FP05-018-01
  Scenario: Template and client selection produces a populated deck
    Given a client has complete branding and portfolio data
    When the advisor creates a deck from a prebuilt template for that client
    Then the deck is populated with the client's name, logo, colors, and data

  # TS-FP05-019 / TC-B.1-FP05-019-01
  Scenario: Deck creation is isolated per client
    Given two clients with complete branding and data
    When the advisor creates and edits a deck for the first client from a template
    Then the source template and the second client's deck remain unaffected

  # TS-FP05-020 / TC-B.1-FP05-020-01
  Scenario: Missing required data field is flagged
    Given a client with branding but a portfolio file missing a required field
    When the advisor creates a deck from a template
    Then the affected section is visibly flagged rather than left blank

  # TS-FP05-021 / TC-B.1-FP05-021-01
  Scenario: Deck creation with no portfolio data degrades gracefully
    Given a client with branding but no portfolio data
    When the advisor creates a deck from a template
    Then the deck generates with a clear "no data" state in data-driven sections

  # TS-FP05-022 / TC-B.1-FP05-022-01
  Scenario: Deck creation with no branding falls back sensibly
    Given a client with portfolio data but no logo or palette
    When the advisor creates a deck from a template
    Then the deck generates with default branding rather than an error
```

```gherkin
Feature: AI content editing (template decks)

  # TS-FP12-008 / TC-B.2-FP12-008-01
  Scenario: Advisor previews an AI edit before it saves
    Given a populated template deck
    When the advisor submits an AI edit prompt
    Then a preview is shown before any change is saved
    And declining the preview leaves the deck unchanged
```

```gherkin
Feature: Guided custom-deck parameters

  # TS-FP05-023 / TC-C.1-FP05-023-01
  Scenario: Guided questions are required before generation
    Given the advisor is starting a new custom deck
    When the advisor leaves the required guided questions unanswered
    Then progression to the prompt step is blocked

  # TS-FP05-024 / TC-C.1-FP05-024-01
  Scenario: Guided answers are stored with the resulting deck
    Given the advisor completes the guided questions and generates a deck
    When the advisor reopens the deck's details
    Then the guided answers are visible and correct

  # TS-FP05-026 / TC-C.1-FP05-026-01
  Scenario Outline: Unreasonable page count is rejected or clamped
    Given the advisor is starting a new custom deck
    When the advisor enters "<count>" as the page count
    Then the system rejects or clamps the value rather than passing it through unchecked

    Examples:
      | count |
      | 0     |
      | 500   |
```

```gherkin
Feature: Prompt intake and structure planning

  # TS-FP12-013 / TC-C.2.1-FP12-013-01
  Scenario: Generated outline is retrievable by content generation
    Given an outline has been generated for a custom deck
    When content generation begins for the same deck
    Then it uses the previously stored outline
```

```gherkin
Feature: AI content and layout generation engine

  # TS-FP12-017 / TC-C.2.2-FP12-017-01
  Scenario: Generated deck applies client brand colors automatically
    Given a client has a stored brand palette
    When a custom deck is generated for that client
    Then the deck's brand elements use the stored primary color
```

```gherkin
Feature: Generated-draft branding finalization

  # TS-FP05-028 / TC-C.2.3-FP05-028-01
  Scenario: Generated draft displays the client's logo
    Given a client has a logo set
    When a custom deck is generated for that client
    Then the client's logo appears on the deck

  # TS-FP05-029 / TC-C.2.3-FP05-029-01
  Scenario: Newly generated deck is marked draft
    Given a custom deck has just completed generation
    Then its status reads "Draft"

  # TS-FP05-030 / TC-C.2.3-FP05-030-01
  Scenario: Generation completes even with no client logo
    Given a client with no logo uploaded
    When a custom deck is generated for that client
    Then generation completes with default branding

  # TS-FP05-031 / TC-C.2.3-FP05-031-01
  Scenario: Draft status blocks export
    Given a freshly generated draft deck
    When the advisor attempts to export it
    Then the export is blocked with a message that the deck must be finished first

  # TS-FP05-032 / TC-C.2.3-FP05-032-01
  Scenario: Confirmed client name appears on the generated draft
    Given a client with a confirmed name
    When a custom deck is generated for that client
    Then the real client name appears, not a placeholder
```

```gherkin
Feature: AI/manual draft refinement (custom decks)

  # TS-FP12-024 / TC-C.3-FP12-024-01
  Scenario: Manual edit applies to generated content
    Given a generated draft deck
    When the advisor manually edits a section's text
    Then the change persists without any AI call

  # TS-FP12-025 / TC-C.3-FP12-025-01
  Scenario: Marking a deck finished requires an explicit action
    Given a generated draft deck with no incomplete sections
    When the advisor marks the deck as finished
    Then its status updates to "Finished" and persists

  # TS-FP12-026 / TC-C.3-FP12-026-01
  Scenario: Cannot finish a deck with an incomplete section
    Given a draft deck with one section flagged as failed
    When the advisor attempts to mark the deck as finished
    Then the action is blocked or clearly warns the advisor first

  # TS-FP12-027 / TC-C.3-FP12-027-01
  Scenario: A recent edit can be undone
    Given a draft deck with a recent manual edit
    When the advisor clicks Undo
    Then the edit is reverted
```

```gherkin
Feature: Export to PDF

  # TS-FP05-033 / TC-D.1-FP05-033-01
  Scenario: Exported PDF matches the on-platform deck
    Given a finished deck
    When the advisor exports it to PDF
    Then the PDF content and layout match the on-platform view

  # TS-FP05-034 / TC-D.1-FP05-034-01
  Scenario: Draft deck cannot be exported to PDF
    Given a draft deck
    When the advisor attempts to export it to PDF
    Then the export is blocked

  # TS-FP05-035 / TC-D.1-FP05-035-01
  Scenario: Re-export after edit produces an updated PDF
    Given a finished deck has already been exported once
    When the advisor edits and re-finishes the deck, then exports again
    Then the new PDF reflects the update
```

```gherkin
Feature: Export to PPTX

  # TS-FP05-040 / TC-D.2-FP05-040-01
  Scenario: Draft deck cannot be exported to PPTX
    Given a draft deck
    When the advisor attempts to export it to PPTX
    Then the export is blocked
```

```gherkin
Feature: Live link sharing

  # TS-FP05-043 / TC-D.3-FP05-043-01
  Scenario: Live link generation produces a working public URL
    Given a finished deck
    When the advisor generates a live link
    Then the link is reachable without authentication and shows the deck

  # TS-FP05-045 / TC-D.3-FP05-045-01
  Scenario: Live link reflects the deck's latest edit
    Given a finished deck has an active live link
    When the advisor edits and re-finishes the deck
    Then the existing live link shows the updated content

  # TS-FP05-047 / TC-D.3-FP05-047-01
  Scenario: Malformed live-link URL does not expose another deck
    Given a valid live link exists for one client's deck
    When a visitor requests a URL with one character altered
    Then no deck is exposed and a not-found response is returned
```

**Reflection block**
1. Produced a Gherkin scenario for every case inherited as Automate now, grouped by feature, and confirmed no Gherkin was invented for any Automate-later or Manual-only case.
2. Critiqued against the twelve reflection criteria — cross-checked each Gherkin block against its manual case's Given/When/Then to confirm they describe the same test, not a redundant reinterpretation.
3. Weakest part: a few Automate-now scenarios with data-table cases (`TS-FP05-006`, `TS-FP05-007`, `TS-FP05-026`) are expressed as `Scenario Outline` with `Examples` tables rather than one flat scenario each — this is the correct Gherkin idiom for parameterized cases, but worth confirming it matches your automation framework's conventions.
4. Revised: grouped Gherkin by `Feature:` block matching the product feature, not scenario ID, so the file reads naturally if handed to an automation engineer as-is.
5. Final version above.

**→ Human checkpoint (proceeding per your instruction to confirm and produce the final package).**

## 5. Traceability matrix

One row per test case, with an execution-status placeholder.

| Test Case ID | Source Scenario | Feature | Test Level | Type | Priority | Automation Status | Preconditions Summary | Expected Result Summary | Execution Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-A.1-FP05-001-01 | TS-FP05-001 | A.1 Client profile capture | Sys, Reg | Functional | P0 | To-automate | Advisor logged in, no existing client | Client saves and appears in list | Not Run |
| TC-A.1-FP05-002-01 | TS-FP05-002 | A.1 | Sys, Reg | Negative | P0 | To-automate | Advisor logged in | Invalid email rejected | Not Run |
| TC-A.1-FP05-003-01 | TS-FP05-003 | A.1 | Sys, Reg | Negative | P1 | To-automate | Advisor logged in | Invalid phone rejected | Not Run |
| TC-A.1-FP05-004-01 | TS-FP05-004 | A.1 | Sys, Reg | Access-control | P0 | To-automate | Client under advisor A only | Advisor B denied access | Not Run |
| TC-A.1-FP05-005-01 | TS-FP05-005 | A.1 | Sys | Edge | P2 | Automate later | Advisor logged in | Duplicate names both save | Not Run |
| TC-A.2-FP05-006-01 | TS-FP05-006 | A.2 Client logo upload | Sys, Reg | Functional | P0 | To-automate | Client, no logo | Each file type uploads and displays | Not Run |
| TC-A.2-FP05-007-01 | TS-FP05-007 | A.2 | Sys, Reg | Negative | P0 | To-automate | Client exists | Oversized/unsupported rejected | Not Run |
| TC-A.2-FP05-008-01 | TS-FP05-008 | A.2 | Sys | Functional | P1 | To-automate | Client has a logo | Re-upload replaces prior logo | Not Run |
| TC-A.2-FP05-009-01 | TS-FP05-009 | A.2 | Sys | Edge | P1 | Automate later | Client, no logo | Corrupted file fails gracefully | Not Run |
| TC-A.2-FP05-010-01 | TS-FP05-010 | A.2 | Sys | Edge | P2 | Manual-only | Client, no logo | Transparent PNG renders acceptably | Not Run |
| TC-A.3-FP12-001-01 | TS-FP12-001 | A.3 Brand color palette extraction | Sys, Int | Functional | P1 | Automate later | Client, no logo/palette, mocked extraction | Palette pair stored | Not Run |
| TC-A.3-FP12-002-01 | TS-FP12-002 | A.3 | Sys, Reg | Functional | P0 | To-automate | Client has extracted palette | Manual override persists | Not Run |
| TC-A.3-FP12-003-01 | TS-FP12-003 | A.3 | Sys, Int | Functional | P0 | Automate later | Mocked low-contrast response | Low-contrast flagged | Not Run |
| TC-A.3-FP12-004-01 | TS-FP12-004 | A.3 | Int, Exp | Edge | P1 | Manual-only | Live extraction service | Monochrome fallback returned | Not Run |
| TC-A.3-FP12-005-01 | TS-FP12-005 | A.3 | Int, Exp | Edge | P1 | Manual-only | Live extraction service | Transparent/low-res handled | Not Run |
| TC-A.4-FP05-011-01 | TS-FP05-011 | A.4 Portfolio/asset data import | Sys, Reg | Functional | P0 | To-automate | Client, no data | Valid file imports | Not Run |
| TC-A.4-FP05-012-01 | TS-FP05-012 | A.4 | Sys, Reg | Negative | P0 | To-automate | Client exists | Malformed file rejected | Not Run |
| TC-A.4-FP05-013-01 | TS-FP05-013 | A.4 | Int, Reg | Integration | P0 | To-automate | Data imported | Data reaches deck creation | Not Run |
| TC-A.4-FP05-014-01 | TS-FP05-014 | A.4 | Sys | Edge | P0 | To-automate | Client exists | Missing columns named in error | Not Run |
| TC-A.4-FP05-015-01 | TS-FP05-015 | A.4 | Sys | Edge | P1 | To-automate | Client, no data | Extra columns don't corrupt import | Not Run |
| TC-A.4-FP05-016-01 | TS-FP05-016 | A.4 | Sys | Edge | P1 | To-automate | Client exists | Empty file rejected cleanly | Not Run |
| TC-A.4-FP05-017-01 | TS-FP05-017 | A.4 | Sys, Reg | Edge | P1 | To-automate | Client has data | Re-upload replaces prior data | Not Run |
| TC-B.1-FP05-018-01 | TS-FP05-018 | B.1 Template-based deck creation | Sys, Reg | Functional | P0 | To-automate | Client fully branded/data | Deck populated correctly | Not Run |
| TC-B.1-FP05-019-01 | TS-FP05-019 | B.1 | Sys, Int, Reg | Functional | P0 | To-automate | Two clients fully set up | Deck isolation confirmed | Not Run |
| TC-B.1-FP05-020-01 | TS-FP05-020 | B.1 | Sys | Negative | P0 | To-automate | Client missing a field | Missing field flagged | Not Run |
| TC-B.1-FP05-021-01 | TS-FP05-021 | B.1 | Sys | Edge | P1 | To-automate | Client, no portfolio data | Degrades gracefully | Not Run |
| TC-B.1-FP05-022-01 | TS-FP05-022 | B.1 | Sys | Edge | P1 | To-automate | Client, no branding | Sensible fallback | Not Run |
| TC-B.2-FP12-006-01 | TS-FP12-006 | B.2 AI content editing (template decks) | Sys, Int | Functional | P0 | Automate later | Populated template deck | Only targeted text updates | Not Run |
| TC-B.2-FP12-007-01 | TS-FP12-007 | B.2 | Sys, Int | Functional | P0 | Automate later | Deck with 5 known pages | Exactly targeted page removed | Not Run |
| TC-B.2-FP12-008-01 | TS-FP12-008 | B.2 | Sys | Functional | P0 | To-automate | Populated template deck | Preview shown before save | Not Run |
| TC-B.2-FP12-009-01 | TS-FP12-009 | B.2 | Int, Exp | Negative/Edge | P0 | Manual-only | Live LLM, deck with 5 pages | Invalid target rejected cleanly | Not Run |
| TC-B.2-FP12-010-01 | TS-FP12-010 | B.2 | Int, Exp | Edge | P1 | Manual-only | Live LLM | Conflicting edits resolve deterministically | Not Run |
| TC-C.1-FP05-023-01 | TS-FP05-023 | C.1 Guided custom-deck parameters | Sys, Reg | Negative | P0 | To-automate | New custom deck started | Progression blocked until answered | Not Run |
| TC-C.1-FP05-024-01 | TS-FP05-024 | C.1 | Sys, Reg | Functional | P1 | To-automate | New custom deck started | Answers stored/retrievable | Not Run |
| TC-C.1-FP05-025-01 | TS-FP05-025 | C.1 | Int | Functional | P0 | Automate later | Mocked generation | Output matches page count | Not Run |
| TC-C.1-FP05-026-01 | TS-FP05-026 | C.1 | Sys | Edge | P1 | To-automate | New custom deck started | Unreasonable count rejected/clamped | Not Run |
| TC-C.1-FP05-027-01 | TS-FP05-027 | C.1 | Sys, Exp | Edge | P2 | Manual-only | New custom deck started | Ambiguous purpose doesn't block | Not Run |
| TC-C.2.1-FP12-011-01 | TS-FP12-011 | C.2.1 Prompt intake & structure planning | Int | Functional | P0 | Automate later | Mocked outline service | Outline stored | Not Run |
| TC-C.2.1-FP12-012-01 | TS-FP12-012 | C.2.1 | Int | Functional | P0 | Automate later | Mocked outline service | Outline count matches param | Not Run |
| TC-C.2.1-FP12-013-01 | TS-FP12-013 | C.2.1 | Int, Reg | Integration | P0 | To-automate | Outline generated | Retrievable by next step | Not Run |
| TC-C.2.1-FP12-014-01 | TS-FP12-014 | C.2.1 | Int, Exp | Edge | P0 | Manual-only | Live LLM | **Blocked — DECISION NEEDED** | Not Run |
| TC-C.2.1-FP12-015-01 | TS-FP12-015 | C.2.1 | Exp | Edge | P1 | Manual-only | Live LLM | Vague prompt still usable | Not Run |
| TC-C.2.2-FP12-016-01 | TS-FP12-016 | C.2.2 AI content & layout generation engine | Int | Functional | P0 | Automate later | Outline exists, mocked | Every section has content | Not Run |
| TC-C.2.2-FP12-017-01 | TS-FP12-017 | C.2.2 | Sys, Reg | Functional | P0 | To-automate | Client has palette | Brand colors auto-applied | Not Run |
| TC-C.2.2-FP12-018-01 | TS-FP12-018 | C.2.2 | Int | Functional | P0 | Automate later | Fault-injected failure | Failure surfaced, not dropped | Not Run |
| TC-C.2.2-FP12-019-01 | TS-FP12-019 | C.2.2 | Int | Edge | P0 | Automate later | Fault-injected timeout | Handled gracefully | Not Run |
| TC-C.2.2-FP12-020-01 | TS-FP12-020 | C.2.2 | Exp | Edge | P0 | Manual-only | Live LLM | Fails informatively, no fabrication | Not Run |
| TC-C.2.2-FP12-021-01 | TS-FP12-021 | C.2.2 | Sys, E2E, Exp | Risk-validation | P0 | Manual-only | Live LLM — release gate | Reliable across 5-prompt sample | Not Run |
| TC-C.2.3-FP05-028-01 | TS-FP05-028 | C.2.3 Generated-draft branding finalization | Sys, Reg | Functional | P0 | To-automate | Client has logo | Logo appears on draft | Not Run |
| TC-C.2.3-FP05-029-01 | TS-FP05-029 | C.2.3 | Sys, Reg | Functional | P0 | To-automate | Deck just generated | Status is Draft | Not Run |
| TC-C.2.3-FP05-030-01 | TS-FP05-030 | C.2.3 | Sys | Edge | P1 | To-automate | Client, no logo | Generation still completes | Not Run |
| TC-C.2.3-FP05-031-01 | TS-FP05-031 | C.2.3 | Int, Reg | Functional/Integration | P0 | To-automate | Fresh draft deck | Export blocked on draft | Not Run |
| TC-C.2.3-FP05-032-01 | TS-FP05-032 | C.2.3 | Sys | Edge | P2 | To-automate | Client, confirmed name | Real name shown, not placeholder | Not Run |
| TC-C.3-FP12-023-01 | TS-FP12-023 | C.3 AI/manual draft refinement (custom decks) | Int | Functional | P0 | Automate later | Generated draft, mocked LLM | AI edit applies correctly | Not Run |
| TC-C.3-FP12-024-01 | TS-FP12-024 | C.3 | Sys, Reg | Functional | P0 | To-automate | Generated draft | Manual edit applies | Not Run |
| TC-C.3-FP12-025-01 | TS-FP12-025 | C.3 | Sys, Reg | Functional | P0 | To-automate | Draft, no incomplete sections | Explicit finish action required | Not Run |
| TC-C.3-FP12-026-01 | TS-FP12-026 | C.3 | Sys, Int | Negative | P0 | To-automate | Draft with failed section | Finish blocked/warned | Not Run |
| TC-C.3-FP12-027-01 | TS-FP12-027 | C.3 | Sys | Functional | P1 | To-automate | Draft with recent edit | Undo reverts edit | Not Run |
| TC-D.1-FP05-033-01 | TS-FP05-033 | D.1 Export to PDF | Sys, Reg | Functional | P0 | To-automate | Finished deck | PDF matches on-platform view | Not Run |
| TC-D.1-FP05-034-01 | TS-FP05-034 | D.1 | Sys, Reg | Negative | P0 | To-automate | Draft deck | Export blocked | Not Run |
| TC-D.1-FP05-035-01 | TS-FP05-035 | D.1 | Sys | Functional | P1 | To-automate | Finished, already exported | Re-export is fresh | Not Run |
| TC-D.1-FP05-036-01 | TS-FP05-036 | D.1 | Exp | Edge | P1 | Manual-only | Finished deck with chart | Chart renders consistently | Not Run |
| TC-D.1-FP05-037-01 | TS-FP05-037 | D.1 | Sys, Int | Edge | P2 | Automate later | Max-length finished deck | Exports without truncation | Not Run |
| TC-D.2-FP05-038-01 | TS-FP05-038 | D.2 Export to PPTX | Sys, Int | Functional | P0 | Automate later | Finished deck | PPTX opens correctly | Not Run |
| TC-D.2-FP05-039-01 | TS-FP05-039 | D.2 | Exp | Functional | P0 | Manual-only | Exported PPTX open | Elements independently editable | Not Run |
| TC-D.2-FP05-040-01 | TS-FP05-040 | D.2 | Sys, Reg | Negative | P0 | To-automate | Draft deck | Export blocked | Not Run |
| TC-D.2-FP05-041-01 | TS-FP05-041 | D.2 | Int, Exp | Edge/Integration | P0 | Manual-only | Deck with complex chart | Chart maps to editable shape | Not Run |
| TC-D.2-FP05-042-01 | TS-FP05-042 | D.2 | Sys | Edge | P1 | Automate later | Text-only finished deck | Text formatting preserved | Not Run |
| TC-D.3-FP05-043-01 | TS-FP05-043 | D.3 Live link sharing | Sys, Reg | Functional | P0 | To-automate | Finished deck | Public URL works unauthenticated | Not Run |
| TC-D.3-FP05-044-01 | TS-FP05-044 | D.3 | Reg | Functional | P1 | Automate later | Live link exists | Link persists over time | Not Run |
| TC-D.3-FP05-045-01 | TS-FP05-045 | D.3 | Sys, Reg | Functional | P0 | To-automate | Live link exists | Reflects latest edit | Not Run |
| TC-D.3-FP05-046-01 | TS-FP05-046 | D.3 | Sys | Edge | P0 | Manual-only | Live link exists | **Blocked — OPEN QUESTION** | Not Run |
| TC-D.3-FP05-047-01 | TS-FP05-047 | D.3 | Sys | Access-control/Edge | P0 | To-automate | Live link exists | Malformed URL exposes nothing | Not Run |

## 6. Coverage cross-check

| Scenario ID (Test Planner) | Test Case ID(s) | Status |
| --- | --- | --- |
| TS-FP05-001 | TC-A.1-FP05-001-01 | Covered |
| TS-FP05-002 | TC-A.1-FP05-002-01 | Covered |
| TS-FP05-003 | TC-A.1-FP05-003-01 | Covered |
| TS-FP05-004 | TC-A.1-FP05-004-01 | Covered |
| TS-FP05-005 | TC-A.1-FP05-005-01 | Covered |
| TS-FP05-006 | TC-A.2-FP05-006-01 | Covered |
| TS-FP05-007 | TC-A.2-FP05-007-01 | Covered |
| TS-FP05-008 | TC-A.2-FP05-008-01 | Covered |
| TS-FP05-009 | TC-A.2-FP05-009-01 | Covered |
| TS-FP05-010 | TC-A.2-FP05-010-01 | Covered |
| TS-FP12-001 | TC-A.3-FP12-001-01 | Covered |
| TS-FP12-002 | TC-A.3-FP12-002-01 | Covered |
| TS-FP12-003 | TC-A.3-FP12-003-01 | Covered |
| TS-FP12-004 | TC-A.3-FP12-004-01 | Covered |
| TS-FP12-005 | TC-A.3-FP12-005-01 | Covered |
| TS-FP05-011 | TC-A.4-FP05-011-01 | Covered |
| TS-FP05-012 | TC-A.4-FP05-012-01 | Covered |
| TS-FP05-013 | TC-A.4-FP05-013-01 | Covered |
| TS-FP05-014 | TC-A.4-FP05-014-01 | Covered |
| TS-FP05-015 | TC-A.4-FP05-015-01 | Covered |
| TS-FP05-016 | TC-A.4-FP05-016-01 | Covered |
| TS-FP05-017 | TC-A.4-FP05-017-01 | Covered |
| TS-FP05-018 | TC-B.1-FP05-018-01 | Covered |
| TS-FP05-019 | TC-B.1-FP05-019-01 | Covered |
| TS-FP05-020 | TC-B.1-FP05-020-01 | Covered |
| TS-FP05-021 | TC-B.1-FP05-021-01 | Covered |
| TS-FP05-022 | TC-B.1-FP05-022-01 | Covered |
| TS-FP12-006 | TC-B.2-FP12-006-01 | Covered |
| TS-FP12-007 | TC-B.2-FP12-007-01 | Covered |
| TS-FP12-008 | TC-B.2-FP12-008-01 | Covered |
| TS-FP12-009 | TC-B.2-FP12-009-01 | Covered |
| TS-FP12-010 | TC-B.2-FP12-010-01 | Covered |
| TS-FP05-023 | TC-C.1-FP05-023-01 | Covered |
| TS-FP05-024 | TC-C.1-FP05-024-01 | Covered |
| TS-FP05-025 | TC-C.1-FP05-025-01 | Covered |
| TS-FP05-026 | TC-C.1-FP05-026-01 | Covered |
| TS-FP05-027 | TC-C.1-FP05-027-01 | Covered |
| TS-FP12-011 | TC-C.2.1-FP12-011-01 | Covered |
| TS-FP12-012 | TC-C.2.1-FP12-012-01 | Covered |
| TS-FP12-013 | TC-C.2.1-FP12-013-01 | Covered |
| TS-FP12-014 | TC-C.2.1-FP12-014-01 | Covered *(partial — pending DECISION NEEDED)* |
| TS-FP12-015 | TC-C.2.1-FP12-015-01 | Covered |
| TS-FP12-016 | TC-C.2.2-FP12-016-01 | Covered |
| TS-FP12-017 | TC-C.2.2-FP12-017-01 | Covered |
| TS-FP12-018 | TC-C.2.2-FP12-018-01 | Covered |
| TS-FP12-019 | TC-C.2.2-FP12-019-01 | Covered |
| TS-FP12-020 | TC-C.2.2-FP12-020-01 | Covered |
| TS-FP12-021 | TC-C.2.2-FP12-021-01 | Covered |
| TS-FP12-022 | — | **No case by design** — exploratory charter, unscripted per the Expansion Model's altitude rule. |
| TS-FP05-028 | TC-C.2.3-FP05-028-01 | Covered |
| TS-FP05-029 | TC-C.2.3-FP05-029-01 | Covered |
| TS-FP05-030 | TC-C.2.3-FP05-030-01 | Covered |
| TS-FP05-031 | TC-C.2.3-FP05-031-01 | Covered |
| TS-FP05-032 | TC-C.2.3-FP05-032-01 | Covered |
| TS-FP12-023 | TC-C.3-FP12-023-01 | Covered |
| TS-FP12-024 | TC-C.3-FP12-024-01 | Covered |
| TS-FP12-025 | TC-C.3-FP12-025-01 | Covered |
| TS-FP12-026 | TC-C.3-FP12-026-01 | Covered |
| TS-FP12-027 | TC-C.3-FP12-027-01 | Covered |
| TS-FP05-033 | TC-D.1-FP05-033-01 | Covered |
| TS-FP05-034 | TC-D.1-FP05-034-01 | Covered |
| TS-FP05-035 | TC-D.1-FP05-035-01 | Covered |
| TS-FP05-036 | TC-D.1-FP05-036-01 | Covered |
| TS-FP05-037 | TC-D.1-FP05-037-01 | Covered |
| TS-FP05-038 | TC-D.2-FP05-038-01 | Covered |
| TS-FP05-039 | TC-D.2-FP05-039-01 | Covered |
| TS-FP05-040 | TC-D.2-FP05-040-01 | Covered |
| TS-FP05-041 | TC-D.2-FP05-041-01 | Covered |
| TS-FP05-042 | TC-D.2-FP05-042-01 | Covered |
| TS-FP05-043 | TC-D.3-FP05-043-01 | Covered |
| TS-FP05-044 | TC-D.3-FP05-044-01 | Covered |
| TS-FP05-045 | TC-D.3-FP05-045-01 | Covered |
| TS-FP05-046 | TC-D.3-FP05-046-01 | Covered *(partial — pending OPEN QUESTION)* |
| TS-FP05-047 | TC-D.3-FP05-047-01 | Covered |

**74 of 74 scenarios accounted for: 73 Covered by a test case, 1 (`TS-FP12-022`) intentionally uncased as an exploratory charter. Zero orphans.**

## 7. Risks, assumptions, open questions

**SCENARIO GAP** (carried, not newly introduced)
- `TS-FP05-011`'s test data depends on the still-undefined portfolio setting board column schema; `TC-A.4-FP05-011-01`'s fixture is a placeholder.

**DECISION NEEDED**
- `TC-C.2.1-FP12-014-01` cannot be scored pass/fail until the prompt/guided-parameter conflict-resolution rule is defined. Run as an information-gathering pass in the meantime.

**OPEN QUESTION**
- `TC-D.3-FP05-046-01` cannot be scored pass/fail until live-link-post-deletion behavior is defined. The one enforceable expectation regardless — no ungraceful error — should still be checked now.

**CASE ADDITION** (surfaced during authoring, confirmed via your instruction to proceed)
- `TC-C.2.2-FP12-021-01` uses a 5-row prompt sample as one parameterized case rather than 5 separate cases, treating the risk-validation scenario's "representative sample" language as a single data-driven exercise with a QA-judgment pass-rate call, not a strict per-row pass/fail.
- `TS-FP12-022` (exploratory charter) intentionally produced no test case, per the Expansion Model.

## 8. Handoff / import notes

No test management tool destination was specified for this run. This package is ready for manual QA execution as-is: Section 3's test case blocks can be executed directly by a QA engineer, Section 4's Gherkin scenarios are ready to hand to an automation engineer for step-definition implementation (not written here, per the altitude rule), and Section 5's traceability matrix can be imported into a tool like TestRail/Xray/Zephyr once a schema mapping is provided — column headers in Section 5 are already close to those tools' native fields (ID, Title/Summary via Test Case ID, Priority, Automation Status) to ease a future import.

---

## Decision Log — full table

| # | Date | Phase | Item/Question | Decision/Answer | Decided by | Source/Rationale | Affected sections |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-07-17 | 0 | Scope of this run | Expand all 74 scenarios (full package), not a subset. | Human | User selected "All 74 scenarios" when asked. | All |
| 2 | 2026-07-17 | 0 | `TS-FP12-021` expansion approach | One parameterized case with a 5-row representative prompt sample, not multiple separately-numbered cases. | AI (provisional), proceeded per user's "confirm and create" instruction | Matches the scenario's own "representative sample" framing in the Test Plan. | Section 3 |
| 3 | 2026-07-17 | 0 | `TS-FP12-022` (exploratory charter) treatment | No test case authored — documented as a charter note only, per the Expansion Model's altitude rule. | AI (provisional), proceeded per user's instruction | Exploratory charters are unscripted by definition. | Section 3, 6 |
| 4 | 2026-07-17 | 0 | `TS-FP12-014`, `TS-FP05-046` inherited blockers | Authored to the point their steps are knowable; final expected result left explicitly open pending the Test Planner's own unresolved `DECISION NEEDED`/`OPEN QUESTION`. | AI (provisional), proceeded per user's instruction | Consistent with how the Test Planner itself flagged these as placeholders. | Section 3, 7 |
| 5 | 2026-07-17 | 0 | `TS-FP05-014`/`015`/`016` malformed-import family | Kept as three separate cases (different preconditions/data shapes), not one parameterized case. | AI (provisional), proceeded per user's instruction | Each represents a structurally different malformed-file mode per the Expansion Model's different-preconditions rule. | Section 3 |
| 6 | 2026-07-17 | — | Feature numbering convention | All feature references in this package use epic + number only (e.g. `A.1`, `C.2.2`), consistent with the correction applied to the Test Strategy & Plan. | Human | User's prior review comment on the Test Plan, carried forward for consistency. | All |
| 7 | 2026-07-17 | 4 | Phasing | Given the user's explicit "confirm and create the final test case" instruction, Phases 1–4 were compiled directly into this final package rather than shown as separate gated checkpoints, consistent with how the BRD, PRD, and Test Plan were finalized earlier in this session. | Human | User requested the final document directly. | All |
| 8 | 2026-07-17 | 4 | Notion / test management tool | No destination specified; package delivered as a chat-only downloadable document, consistent with the BRD, PRD, and Test Plan. | Human | User pattern throughout this session. | Section 8 |
