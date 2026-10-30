# Test Strategy & Plan — Decora

## 0. Test plan metadata

| Field | Value |
| --- | --- |
| Product/Project name | Decora |
| Source PRD | Product Requirements Document — Decora, v6.0, 2026-07-17 *(internally approved through this pipeline's checkpoints; test fixture)* |
| Test Plan version | v1.0 |
| Date | 2026-07-17 |
| Owner/DRI | `[CLIENT INPUT REQUIRED: no QA lead named yet]` |
| Stakeholders | `[TEST DATA: J. Ashton (Sponsor), M. Reyes (Approver)]` |
| Intended uses | QA staffing, CI gating criteria, release sign-off, Test Case Generator input (test run only). |
| Decision Log destination | In-document only; no Notion hub configured for this test run. |

## 1. Test strategy overview

**Objectives:** "done, tested" for this release means every PRD Section 10 feature has met or exceeded its Section 2 depth-tier floor, every PRD acceptance criterion and edge case maps to at least one scenario, the one High-complexity feature (C.2.2) carries a dedicated scenario validating its named technical risk, and every NFR category and integration/data entity from PRD Sections 7 and 9 has a corresponding test-plan entry.

**Quality goals:** no client-facing deck should ever be exported or shared with silently missing content (ties to C.2.2's "failure surfaced, not dropped" acceptance criterion); no advisor should ever see another advisor's client or deck data (ties to the single-advisor-per-account rule); no AI-assisted edit should silently restructure a deck beyond what was requested (ties to B.2/C.3's guardrail risk).

**Scope in/out** *(mirrors PRD 5.1/5.2 — testing follows PRD scope, does not redefine it)*:
- **In scope:** all 14 Section 10 features across Epics A–D, per the PRD.
- **Out of scope:** advisor-authored template design, client-facing login, multi-advisor/org account structures, expiring live links — none of these exist in the PRD, so none are tested.

**Test-levels taxonomy** *(defined once, referenced by name throughout)*:
- **Unit** — isolated logic (e.g. schema validators, field-mapping functions).
- **Integration** — two or more components/services working together (e.g. logo upload → color extraction).
- **System** — a full feature exercised end-to-end within Decora, no external client perspective.
- **End-to-end (E2E)** — a full advisor journey across multiple features (e.g. add client → build deck → export).
- **Regression** — re-running previously passed scenarios to catch new breakage.
- **User Acceptance (UAT)** — client walkthrough validation, per PRD Section 5.3.
- **Exploratory** — unscripted, judgment-driven testing aimed at surfacing issues scripted cases miss.

## 2. Risk-based test prioritization model

| Technical Complexity | Minimum scenario floor | Required test levels | Automation default |
| --- | --- | --- | --- |
| **Low** | 2 — one happy-path (functional) + one negative/permission-check. | System + regression bucket. | Automate now. |
| **Med** | 4 — happy path, ≥1 PRD edge case, ≥1 negative/error path, ≥1 integration or data-boundary check. | System + Integration + regression; one exploratory pass optional. | Automate now for happy/negative; automate-later acceptable for edge cases if tooling is a gap. |
| **High** | 1 per acceptance criterion + 1 per edge case + 1 dedicated scenario validating the named `Technical Risk/Approach` + 1 exploratory charter. | Unit + Integration + System + E2E + a targeted NFR pass where relevant + Exploratory. | Mixed, stated per scenario; the risk-validation scenario is Manual-only until the approach is proven. |

Priority scheme: P0/P1/P2 inherited from each feature's PRD Priority, escalated only with a logged rationale.

## 3. Test environment & data strategy

- **Environments:** dev, staging, and a prod-like environment for pre-release UAT (per PRD 5.3's client walkthrough + UAT gate).
- **Test data classes:** synthetic client records and synthetic portfolio Excel files for functional/regression testing; no production-shaped or real client data should be used given the PRD's `[TEST DATA]` status and the sensitivity of portfolio/asset data noted in PRD Section 7. `ASSUMPTION:` synthetic-only test data is sufficient for this release, since no PII-handling requirement beyond the industry-standard baseline was specified.
- **Sandbox/mocking strategy:** the three Week-1-spike integrations (color-extraction service, AI/LLM generation service, PPTX generation library) need sandboxed or mocked responses for deterministic functional testing, with a separate live-integration pass to validate real behavior, since AI-generated output is inherently non-deterministic and can't be the basis of repeatable functional assertions.
- **Data refresh/reset cadence:** `ASSUMPTION:` test data resets per test cycle (nightly or per CI run) to avoid state leakage between advisor-scoped test accounts, given the hard single-advisor-isolation requirement.

## 4. Roles, personas & access-control test approach

**Advisor** *(sole role, per PRD Section 4)*

- **Authorized:** an advisor acting on their own client and deck records — create, read, update, delete within their own scope.
- **Unauthorized:** an advisor attempting to read, edit, or delete another advisor's client or deck record, by any means (direct URL/ID manipulation, API call, or UI).
- **Positive scenarios:** advisor performs standard CRUD on their own clients/decks and succeeds.
- **Negative scenarios:** advisor attempts to access another advisor's client/deck by ID and is denied at the data layer, not just hidden in the UI — the single highest-priority access-control check in this plan, since PRD Decision Log entry 5 makes it a hard, explicit product limitation.
- **Role-combination cases:** none — the PRD has only one role and no multi-advisor/org structure, so no cross-role scenarios apply.

## 5. Feature test plans

### Epic A — Client management

#### [A.1] — Client profile capture
`[Technical Complexity: Low]` · **Test objective:** verify an advisor can create, view, and keep a client record fully isolated from other advisors' records. · **Priority:** P0. · **Test levels:** System, Regression.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-001` | Advisor creates a client with valid name, email, phone, and org/individual flag; record saves and appears in the client list. | Functional | AC-1 | P0 | Automate now |
| `TS-FP05-002` | Advisor submits an invalid email format; system rejects with a clear message, record not saved. | Negative | AC-2 | P0 | Automate now |
| `TS-FP05-003` | Advisor submits an invalid phone format; system rejects with a clear message. | Negative | AC-2 | P1 | Automate now |
| `TS-FP05-004` | A client created by Advisor A is confirmed absent from Advisor B's client list (data-layer check). | Access-control | AC-3 | P0 | Automate now |
| `TS-FP05-005` | Advisor creates two clients with the same name under their own account; both save without conflict. | Edge | Edge-1 | P2 | Automate later |

**Test data:** two advisor test accounts, valid/invalid email and phone fixtures. **Environment:** staging, standard test DB. **Dependencies:** none.

#### [A.2] — Client logo upload
`[Technical Complexity: Low]` · **Test objective:** verify a client's logo uploads, stores, and is retrievable for downstream branding features. · **Priority:** P0. · **Test levels:** System, Regression.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-006` | Advisor uploads a valid PNG/JPG/SVG logo; it saves and displays on the client record. | Functional | AC-1 | P0 | Automate now |
| `TS-FP05-007` | Advisor uploads an oversized or unsupported file type; system rejects with a clear message. | Negative | AC-2 | P0 | Automate now |
| `TS-FP05-008` | Advisor re-uploads a new logo for the same client; the prior logo is replaced, not duplicated. | Functional | AC-3 | P1 | Automate now |
| `TS-FP05-009` | Advisor uploads a corrupted image file; system handles gracefully. | Edge | Edge-1 | P1 | Automate later |
| `TS-FP05-010` | A transparent-background PNG logo renders acceptably against a white template background. | Edge | Edge-2 | P2 | Manual-only |

**Test data:** valid PNG/JPG/SVG, oversized file, corrupted file, transparent-background PNG. **Environment:** staging, object storage sandbox. **Dependencies:** A.1.

#### [A.3] — Brand color palette extraction
`[Technical Complexity: Med]` · **Test objective:** verify the system derives a usable, editable brand palette from an uploaded logo, flagging low-contrast results instead of silently applying them. · **Priority:** P1. · **Test levels:** System, Integration, Regression; one exploratory pass.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP12-001` | Uploading a logo produces a stored primary/secondary color pair automatically. | Functional | AC-1 | P1 | Automate later |
| `TS-FP12-002` | Advisor manually edits an extracted color; the override persists across sessions. | Functional | AC-2 | P0 | Automate now |
| `TS-FP12-003` | A low-contrast extraction result is flagged for advisor review rather than silently applied. | Functional | AC-3 | P0 | Automate later |
| `TS-FP12-004` | A monochrome/single-color logo produces a reasonable fallback rather than an extraction failure. | Edge | Edge-1 | P1 | Manual-only |
| `TS-FP12-005` | A transparent or very low-resolution logo is handled without crashing extraction. | Edge/Integration | Edge-2 | P1 | Manual-only |

**Test data:** logos spanning normal, monochrome, transparent, low-resolution cases. **Environment:** staging with mocked extraction service, plus a live-service pass. **Dependencies:** A.2. **Assumption:** extraction-quality benchmarking is exploratory-only, since no accuracy target exists in the PRD.

#### [A.4] — Portfolio/asset data import
`[Technical Complexity: Med]` · **Test objective:** verify a correctly formatted portfolio Excel file parses and stores reliably, and a malformed file fails safely. · **Priority:** P0. · **Test levels:** System, Integration, Regression; one exploratory pass.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-011` | A correctly formatted portfolio file parses and stores successfully against the client. | Functional | AC-1 | P0 | Automate now |
| `TS-FP05-012` | A malformed file is rejected with a specific, actionable error, not a silent partial import. | Negative | AC-2 | P0 | Automate now |
| `TS-FP05-013` | Parsed portfolio data is retrievable by deck-building features for the correct client. | Integration | AC-3 | P0 | Automate now |
| `TS-FP05-014` | A file missing required columns is rejected, naming which columns are missing. | Edge | Edge-1 | P0 | Automate now |
| `TS-FP05-015` | A file with extra/unexpected columns is handled without corrupting expected data. | Edge | Edge-2 | P1 | Automate now |
| `TS-FP05-016` | An empty file upload is rejected cleanly. | Edge | Edge-3 | P1 | Automate now |
| `TS-FP05-017` | Re-uploading a portfolio file for the same client replaces prior data, not appends. | Edge | Edge-4 | P1 | Automate now |

**Test data:** valid portfolio setting board fixture, plus broken variants. `PRD GAP:` exact column schema still undefined — fixtures are placeholders. **Environment:** staging, file-upload sandbox. **Dependencies:** none.

### Epic B — Template-based deck creation

#### [B.1] — Template-based deck creation (white-labeling)
`[Technical Complexity: Med]` · **Test objective:** verify selecting a template and client produces a correctly populated, independent deck instance without altering the source template or other clients' decks. · **Priority:** P0. · **Test levels:** System, Integration, Regression; one exploratory pass.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-018` | Selecting a template and client produces a deck with correct name/logo/colors/data populated. | Functional | AC-1 | P0 | Automate now |
| `TS-FP05-019` | Editing one client's deck does not alter the source template or another client's deck. | Functional | AC-2 | P0 | Automate now |
| `TS-FP05-020` | A required data field with no portfolio data yet is flagged, not left blank silently. | Negative | AC-3 | P0 | Automate now |
| `TS-FP05-021` | Creating a deck for a client with no portfolio data degrades gracefully. | Edge | Edge-1 | P1 | Automate now |
| `TS-FP05-022` | Creating a deck for a client with no logo/palette falls back sensibly. | Edge | Edge-2 | P1 | Automate now |

**Test data:** clients with complete/missing branding/data, across all 5–6 templates. **Environment:** staging. **Dependencies:** A.1–A.4. Field-mapping correctness per template is exercised in the exploratory charter (Section 8), not one scripted row per template.

#### [B.2] — AI content editing (template decks)
`[Technical Complexity: Med]` · **Test objective:** verify AI-assisted edits are correctly scoped, previewed before saving, and never introduce structural changes outside the template. · **Priority:** P1. · **Test levels:** System, Integration, Regression; one exploratory pass.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP12-006` | An AI text-edit request updates only the targeted text. | Functional | AC-1 | P0 | Automate later |
| `TS-FP12-007` | A page-removal request removes exactly that page and no other content. | Functional | AC-2 | P0 | Automate later |
| `TS-FP12-008` | Advisor sees a preview of an AI-proposed edit before it's saved, and can decline it. | Functional | AC-3 | P0 | Automate now |
| `TS-FP12-009` | An AI edit request referencing a nonexistent page/field is rejected/handled cleanly. | Negative/Edge | Edge-1 | P0 | Manual-only |
| `TS-FP12-010` | Two conflicting AI edit requests in quick succession resolve deterministically. | Edge | Edge-2 | P1 | Manual-only |

**Test data:** a populated template deck with known text/pages. **Environment:** staging with mocked LLM, live-service pass for exploratory. **Dependencies:** B.1.

### Epic C — Custom AI-generated deck

#### [C.1] — Guided custom-deck parameters
`[Technical Complexity: Low]` · **Test objective:** verify the guided-question flow captures required parameters before generation and that they measurably influence the resulting draft. · **Priority:** P1. · **Test levels:** System, Regression.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-023` | Advisor cannot proceed to generation without answering required guided questions. | Negative | AC-1 | P0 | Automate now |
| `TS-FP05-024` | Guided answers are stored and retrievable alongside the resulting deck. | Functional | AC-2 | P1 | Automate now |
| `TS-FP05-025` | Answers visibly influence the generated output (e.g. requested page count matches). | Functional | AC-3 | P0 | Automate later |
| `TS-FP05-026` | Advisor enters an unreasonable page count; system rejects or clamps rather than passing it through. | Edge | Edge-1 | P1 | Automate now |
| `TS-FP05-027` | Advisor leaves the deck-purpose field ambiguous/very short; flow still allows proceeding. `SCENARIO ADDITION` | Edge | ASSUMPTION | P2 | Manual-only |

**Test data:** valid and boundary-case guided-parameter inputs. **Environment:** staging. **Dependencies:** none.

#### [C.2.1] — Prompt intake and structure planning
`[Technical Complexity: Med]` · **Test objective:** verify prompt and guided parameters combine into a stored, correctly structured outline before content generation begins. · **Priority:** P0. · **Test levels:** System, Integration, Regression; one exploratory pass.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP12-011` | Submitting a prompt and guided answers produces a stored outline. | Functional | AC-1 | P0 | Automate later |
| `TS-FP12-012` | Outline page count matches the guided page-count parameter. | Functional | AC-2 | P0 | Automate later |
| `TS-FP12-013` | The generated outline is retrievable by the next generation step. | Integration | AC-3 | P0 | Automate now |
| `TS-FP12-014` | A prompt implying more sections than the requested page count is reconciled per a defined rule. | Edge | Edge-1 | P0 | Manual-only — `DECISION NEEDED`, placeholder pending resolution. |
| `TS-FP12-015` | An extremely vague or single-word prompt still produces a usable outline. `SCENARIO ADDITION` | Edge | ASSUMPTION | P1 | Manual-only |

**Test data:** prompts from detailed to minimal, agreeing and conflicting guided parameters. **Environment:** staging with mocked LLM, live-service pass for exploratory. **Dependencies:** C.1.

#### [C.2.2] — AI content and layout generation engine
`[Technical Complexity: High]` · **Test objective:** verify every outlined section reliably receives generated, on-brand content, and that a generation failure on any section is surfaced rather than silently dropped — the PRD's own named core project risk. · **Priority:** P0. · **Test levels:** Unit, Integration, System, E2E, a targeted reliability pass, Exploratory.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP12-016` | Every section in a generated outline receives generated content, none left blank. | Functional | AC-1 | P0 | Automate later |
| `TS-FP12-017` | Rendered deck applies the client's brand colors automatically during generation. | Functional | AC-2 | P0 | Automate now |
| `TS-FP12-018` | A generation failure on any single section is surfaced to the advisor, not silently skipped. | Functional | AC-3 | P0 | Automate later |
| `TS-FP12-019` | An LLM generation timeout on a section is handled gracefully, never a hung request. | Edge | Edge-1 | P0 | Automate later |
| `TS-FP12-020` | A prompt requesting content the system can't reasonably generate fails informatively, not with fabricated content. | Edge | Edge-2 | P0 | Manual-only |
| `TS-FP12-021` | **Risk-validation:** across a representative sample of prompts, generated multi-section decks are reliably coherent and complete. | Risk-validation | Risk | P0 | Manual-only — mandatory release gate. |
| `TS-FP12-022` | **Exploratory charter:** adversarial, unusual, edge-of-scope prompts probe undiscovered failure modes. | Exploratory | N/A | P1 | Manual-only |

**Test data:** a broad prompt corpus, fault-injection harness. **Environment:** staging with mocked LLM for CI, mandatory live-service pass before release given this is the core project risk. **Dependencies:** C.2.1, A.3. Content-quality scoring stays exploratory judgment, not a scripted pass/fail.

#### [C.2.3] — Generated-draft branding finalization
`[Technical Complexity: Low]` · **Test objective:** verify a generated draft is branded with the client's logo and correctly flagged as a draft, not finished, deck. · **Priority:** P0. · **Test levels:** System, Regression.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-028` | A generated deck displays the client's logo. | Functional | AC-1 | P0 | Automate now |
| `TS-FP05-029` | A newly generated deck's status is set to draft, not finished. | Functional | AC-2 | P0 | Automate now |
| `TS-FP05-030` | Generating a deck for a client with no logo yet still completes without breaking the draft. | Edge | Edge-1 | P1 | Automate now |
| `TS-FP05-031` | Draft status cannot be bypassed — a fresh draft cannot be exported. `SCENARIO ADDITION` | Functional/Integration | ASSUMPTION | P0 | Automate now |
| `TS-FP05-032` | The client's confirmed name (not a placeholder) appears correctly on the generated draft. `SCENARIO ADDITION` | Edge | ASSUMPTION | P2 | Automate now |

**Test data:** clients with and without a logo. **Environment:** staging. **Dependencies:** A.2, C.2.2.

#### [C.3] — AI/manual draft refinement (custom decks)
`[Technical Complexity: Med]` · **Test objective:** verify an advisor can refine a generated draft via AI or manual edits and that finishing a deck requires an explicit, deliberate action. · **Priority:** P0. · **Test levels:** System, Integration, Regression; one exploratory pass.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP12-023` | Advisor applies an AI edit to a generated draft; the edit applies correctly. | Functional | AC-1 | P0 | Automate later |
| `TS-FP12-024` | Advisor manually edits generated content directly, without going through AI. | Functional | AC-2 | P0 | Automate now |
| `TS-FP12-025` | Marking a deck finished requires an explicit advisor action and updates its status accordingly. | Functional | AC-3 | P0 | Automate now |
| `TS-FP12-026` | Advisor attempts to finish a deck with an incomplete generation; system blocks or flags clearly. | Negative | Edge-1 | P0 | Automate now |
| `TS-FP12-027` | A recent AI or manual edit can be undone/reverted. `SCENARIO ADDITION` | Functional | ASSUMPTION | P1 | Automate now |

**Test data:** a generated draft with one deliberately failed section. **Environment:** staging, shared AI-editing mock with B.2. **Dependencies:** B.2, C.2.

### Epic D — Deck export and sharing

#### [D.1] — Export to PDF
`[Technical Complexity: Low]` · **Test objective:** verify a finished deck exports to a PDF matching its on-platform appearance, and draft decks cannot be exported. · **Priority:** P0. · **Test levels:** System, Regression.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-033` | Exporting a finished deck produces a PDF matching its on-platform appearance. | Functional | AC-1 | P0 | Automate now |
| `TS-FP05-034` | A draft (unfinished) deck cannot be exported. | Negative | AC-2 | P0 | Automate now |
| `TS-FP05-035` | Re-exporting after an edit produces an updated PDF, not a stale cached copy. | Functional | AC-3 | P1 | Automate now |
| `TS-FP05-036` | A deck with AI-generated visual elements renders consistently in the PDF export. | Edge | Edge-1 | P1 | Manual-only |
| `TS-FP05-037` | Exporting a maximum-length deck completes without truncation or timeout. `SCENARIO ADDITION` | Edge | ASSUMPTION | P2 | Automate later |

**Test data:** finished deck with charts, draft deck, maximum-length deck. **Environment:** staging, PDF rendering service. **Dependencies:** B.1 or C.3.

#### [D.2] — Export to PPTX
`[Technical Complexity: Med]` · **Test objective:** verify a finished deck exports to a genuinely editable PPTX file, with particular attention to chart fidelity. · **Priority:** P0. · **Test levels:** System, Integration, Regression; one exploratory pass.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-038` | Exported PPTX opens correctly in standard PowerPoint versions. | Functional | AC-1 | P0 | Automate later |
| `TS-FP05-039` | Text and images remain independently editable, not flattened. | Functional | AC-2 | P0 | Manual-only |
| `TS-FP05-040` | A draft deck cannot be exported to PPTX, matching the PDF export rule. | Negative | AC-3 | P0 | Automate now |
| `TS-FP05-041` | A complex AI-generated chart maps to a reasonable, editable PPTX shape. | Edge/Integration | Edge-1 | P0 | Manual-only — named technical risk. |
| `TS-FP05-042` | A text-only deck exports cleanly with correct formatting preserved. `SCENARIO ADDITION` | Edge | ASSUMPTION | P1 | Automate later |

**Test data:** finished deck with complex charts, text-only finished deck, draft deck. **Environment:** staging, PPTX generation library, PowerPoint instance. **Dependencies:** B.1 or C.3.

#### [D.3] — Live link sharing
`[Technical Complexity: Low]` · **Test objective:** verify a generated live link is a stable, non-expiring, unauthenticated public view that reflects the deck's current state. · **Priority:** P1. · **Test levels:** System, Regression.

| Scenario ID | Description | Type | Source | Priority | Automation candidacy |
|---|---|---|---|---|---|
| `TS-FP05-043` | Generating a live link produces a working, unauthenticated public URL. | Functional | AC-1 | P0 | Automate now |
| `TS-FP05-044` | The live link remains accessible and unchanged after an extended period. | Functional | AC-2 | P1 | Automate later |
| `TS-FP05-045` | Editing the deck after link generation updates what the live link displays. | Functional | AC-3 | P0 | Automate now |
| `TS-FP05-046` | Advisor deletes/un-finalizes a deck after its live link was shared; link behavior is defined and doesn't error ungracefully. | Edge | Edge-1 | P0 | Manual-only — `OPEN QUESTION`, placeholder pending resolution. |
| `TS-FP05-047` | A live link accessed with a slightly malformed/guessed URL does not expose another client's deck. `SCENARIO ADDITION` | Access-control/Edge | ASSUMPTION | P0 | Automate now |

**Test data:** finished deck with a generated link, deck deleted/unfinalized post-link. **Environment:** staging. **Dependencies:** B.1 or C.3.

## 6. Non-functional test plan

| NFR category | Test approach | Measurable target | Test level | Tooling | Owning discipline |
|---|---|---|---|---|---|
| Performance | Load standard pages and time to interactive; time AI generation steps end-to-end, including the required progress-state display. | `[TEST DATA]`: pages under 2s, AI generation under 30s/section with a visible progress indicator. | System, Performance/Load | Load-testing tool, manual timing for AI steps. | QA + BE |
| Security/Privacy | Verify encryption in transit/at rest; verify advisor-scoped access isolation at the data layer (ties to `TS-FP05-004`). | Industry-standard baseline; binary pass/fail. | System, Security | Security scan tooling, manual access attempts. | QA + BE |
| Compliance | No test approach defined. | `PRD GAP:` deferred to a later phase, no framework named. | N/A | N/A | N/A |
| Reliability | Fault-inject a failed AI generation section, confirm it's surfaced (reuses `TS-FP12-018`/`019`). | Qualitative — "never silently dropped"; no SLA figure. | Integration, System | Fault-injection harness. | QA + BE |
| Accessibility | No test approach defined. | `PRD GAP:` no standard specified. | N/A | N/A | N/A |
| Observability | Verify AI generation, export, and import failures are logged with troubleshooting detail. | Qualitative — no schema/retention target given. | Integration | Log inspection during fault-injection passes. | QA + BE |

## 7. Integration & data test plan

| Entity/Integration | Test approach | CRUD-by-role data checks | Migration test needs | Spike-validation scenario |
|---|---|---|---|---|
| Client | Verify CRUD respects advisor-scoping. | Advisor CRUDs own records only (`TS-FP05-001`, `004`). | None — net-new product. | N/A |
| Client branding | Verify branding ties to its client, flows into rendering. | Advisor creates/reads/updates own clients' branding only. | None. | N/A |
| Portfolio/asset data | Verify parsed data is scoped correctly and queryable. | Advisor CRUDs own clients' data only. | None. | N/A |
| Deck | Verify independence per client/creation, status transitions gate export/editing. | Advisor CRUDs own decks only. | None. | N/A |
| Deck generation outline | Verify correct linkage to its deck, consumed only by intended step. | System-internal. | None. | N/A |
| Live share link | Verify generation, non-expiry, current-state reflection. | Advisor creates/reads own decks' links; link itself public by design. | None. | N/A |
| Color-extraction service *(spike)* | Contract/sandbox-test in isolation; validate response shape and failure handling. | N/A | N/A | `TS-FP12-004`/`005`. |
| AI/LLM generation service *(spike)* | Contract/sandbox-test prompt-in/content-out; validate timeout/failure handling. | N/A | N/A | `TS-FP12-021`. |
| Object storage | Contract-test upload/retrieve. | Application-layer access must respect advisor-scoping. | N/A | N/A — no spike needed. |
| PDF rendering | Contract-test deck-to-PDF output against a known fixture. | N/A | N/A | N/A — no spike needed. |
| PPTX generation library *(spike)* | Contract-test deck-to-PPTX output, chart/visual fidelity. | N/A | N/A | `TS-FP05-041`. |

## 8. Test automation strategy

**Target pyramid mix:** roughly 55% System, 20% Integration, 10% Unit, 10% E2E/Regression composite, 5% Exploratory, skewed toward System/Integration given Decora's risk concentrates in AI-output correctness and data isolation.

**Tools/frameworks:** `[CLIENT INPUT REQUIRED: no existing test tooling/CI stack named]`.

**CI gating rules:** all P0 scenarios pass before merge to main; P1 scenarios pass before a release candidate is cut; the risk-validation scenario `TS-FP12-021` is a mandatory release gate (not merge gate), since it depends on the real AI service.

**Flaky-test policy:** quarantined within one cycle of being flagged, tracked separately, never silently skipped. AI-dependent live-service scenarios are the most likely candidates; mocked variants stay in the gating suite.

## 9. Regression strategy

- **Smoke suite:** all 37 P0 scenarios.
- **Full regression:** P0 + P1 = 64 scenarios.
- **Cadence:** smoke on every PR; full regression nightly and before every release candidate.
- **Forces a full regression run:** any change to C.2.2 (High complexity), any change touching the three Week-1-spike integrations, or any change to the single-advisor-isolation logic.
- **Suite-growth policy:** every newly confirmed P0/P1 scenario from a future `SCOPE ADDITION` is added to the regression bucket at confirmation time.

## 10. Test coverage matrix

*(Test Case Generator input — no test steps here.)*

| Scenario ID | Feature | Role/Portal | Epic | FP Block | PRD Source | Test Level(s) | Type | Priority | Technical Complexity | Automation Candidacy | Test Data Needs | Environment/Tooling | Dependencies | Notes for Test Case Generator |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TS-FP05-001 | A.1 Client profile capture | Advisor/Decora | A | FP-05 | AC-1 | Sys, Reg | Functional | P0 | Low | Automate now | valid client fields | staging | none | Standard create-and-verify flow. |
| TS-FP05-002 | A.1 Client profile capture | Advisor/Decora | A | FP-05 | AC-2 | Sys, Reg | Negative | P0 | Low | Automate now | invalid email fixture | staging | none | Assert specific error message. |
| TS-FP05-003 | A.1 Client profile capture | Advisor/Decora | A | FP-05 | AC-2 | Sys, Reg | Negative | P1 | Low | Automate now | invalid phone fixture | staging | none | Same pattern as TS-FP05-002. |
| TS-FP05-004 | A.1 Client profile capture | Advisor/Decora | A | FP-05 | AC-3 | Sys, Reg | Access-control | P0 | Low | Automate now | two advisor accounts | staging | none | Highest-priority isolation check platform-wide. |
| TS-FP05-005 | A.1 Client profile capture | Advisor/Decora | A | FP-05 | Edge-1 | Sys | Edge | P2 | Low | Automate later | duplicate client name | staging | none | Confirm no unique-name constraint. |
| TS-FP05-006 | A.2 Client logo upload | Advisor/Decora | A | FP-05 | AC-1 | Sys, Reg | Functional | P0 | Low | Automate now | PNG/JPG/SVG fixtures | staging, object storage sandbox | A.1 | Verify displayed logo matches uploaded file. |
| TS-FP05-007 | A.2 Client logo upload | Advisor/Decora | A | FP-05 | AC-2 | Sys, Reg | Negative | P0 | Low | Automate now | oversized/unsupported file | staging | A.1 | Assert rejection message. |
| TS-FP05-008 | A.2 Client logo upload | Advisor/Decora | A | FP-05 | AC-3 | Sys | Functional | P1 | Low | Automate now | second logo file | staging | A.1 | Confirm old file replaced, not duplicated. |
| TS-FP05-009 | A.2 Client logo upload | Advisor/Decora | A | FP-05 | Edge-1 | Sys | Edge | P1 | Low | Automate later | corrupted image | staging | A.1 | Should fail gracefully. |
| TS-FP05-010 | A.2 Client logo upload | Advisor/Decora | A | FP-05 | Edge-2 | Sys | Edge | P2 | Low | Manual-only | transparent PNG | staging | A.1 | Visual review against template backgrounds. |
| TS-FP12-001 | A.3 Brand color palette extraction | Advisor/Decora | A | FP-12 | AC-1 | Sys, Int | Functional | P1 | Med | Automate later | standard logo | staging, mocked extraction | A.2 | Mock extraction response for CI determinism. |
| TS-FP12-002 | A.3 Brand color palette extraction | Advisor/Decora | A | FP-12 | AC-2 | Sys, Reg | Functional | P0 | Med | Automate now | client with palette | staging | A.2 | No AI dependency — persistence check. |
| TS-FP12-003 | A.3 Brand color palette extraction | Advisor/Decora | A | FP-12 | AC-3 | Sys, Int | Functional | P0 | Med | Automate later | low-contrast fixture | staging, mocked extraction | A.2 | Needs controlled low-contrast logo. |
| TS-FP12-004 | A.3 Brand color palette extraction | Advisor/Decora | A | FP-12 | Edge-1 | Int, Exp | Edge | P1 | Med | Manual-only | monochrome logo | staging, live extraction service | A.2 | Blocked on Week-1 spike. |
| TS-FP12-005 | A.3 Brand color palette extraction | Advisor/Decora | A | FP-12 | Edge-2 | Int, Exp | Edge | P1 | Med | Manual-only | transparent/low-res logo | staging, live extraction service | A.2 | Same spike dependency. |
| TS-FP05-011 | A.4 Portfolio/asset data import | Advisor/Decora | A | FP-05 | AC-1 | Sys, Reg | Functional | P0 | Med | Automate now | valid portfolio file | staging | none | PRD GAP: fixture depends on final schema. |
| TS-FP05-012 | A.4 Portfolio/asset data import | Advisor/Decora | A | FP-05 | AC-2 | Sys, Reg | Negative | P0 | Med | Automate now | malformed file | staging | none | Assert specific, actionable error text. |
| TS-FP05-013 | A.4 Portfolio/asset data import | Advisor/Decora | A | FP-05 | AC-3 | Int, Reg | Integration | P0 | Med | Automate now | parsed data + downstream read | staging | none | Confirms data reaches B.1's mapping layer. |
| TS-FP05-014 | A.4 Portfolio/asset data import | Advisor/Decora | A | FP-05 | Edge-1 | Sys | Edge | P0 | Med | Automate now | file missing required columns | staging | none | Error must name missing columns. |
| TS-FP05-015 | A.4 Portfolio/asset data import | Advisor/Decora | A | FP-05 | Edge-2 | Sys | Edge | P1 | Med | Automate now | file with extra columns | staging | none | Verify no data corruption. |
| TS-FP05-016 | A.4 Portfolio/asset data import | Advisor/Decora | A | FP-05 | Edge-3 | Sys | Edge | P1 | Med | Automate now | empty file | staging | none | Clean rejection, no crash. |
| TS-FP05-017 | A.4 Portfolio/asset data import | Advisor/Decora | A | FP-05 | Edge-4 | Sys, Reg | Edge | P1 | Med | Automate now | two sequential uploads | staging | none | Confirm replace-not-append behavior. |
| TS-FP05-018 | B.1 Template-based deck creation | Advisor/Decora | B | FP-05 | AC-1 | Sys, Reg | Functional | P0 | Med | Automate now | full-branding client, all templates | staging | A.1–A.4 | One scripted case; rest covered in exploratory. |
| TS-FP05-019 | B.1 Template-based deck creation | Advisor/Decora | B | FP-05 | AC-2 | Sys, Int, Reg | Functional | P0 | Med | Automate now | two clients, same template | staging | A.1–A.4 | Data-isolation check across decks. |
| TS-FP05-020 | B.1 Template-based deck creation | Advisor/Decora | B | FP-05 | AC-3 | Sys | Negative | P0 | Med | Automate now | client missing required field | staging | A.1–A.4 | Assert flag, not blank field. |
| TS-FP05-021 | B.1 Template-based deck creation | Advisor/Decora | B | FP-05 | Edge-1 | Sys | Edge | P1 | Med | Automate now | client with no portfolio data | staging | A.1–A.4 | Should degrade gracefully. |
| TS-FP05-022 | B.1 Template-based deck creation | Advisor/Decora | B | FP-05 | Edge-2 | Sys | Edge | P1 | Med | Automate now | client with no logo/palette | staging | A.1–A.4 | Confirm sensible rendering fallback. |
| TS-FP12-006 | B.2 AI content editing (template decks) | Advisor/Decora | B | FP-12 | AC-1 | Sys, Int | Functional | P0 | Med | Automate later | populated template deck | staging, mocked LLM | B.1 | Needs LLM-output assertion tooling. |
| TS-FP12-007 | B.2 AI content editing (template decks) | Advisor/Decora | B | FP-12 | AC-2 | Sys, Int | Functional | P0 | Med | Automate later | populated template deck | staging, mocked LLM | B.1 | Assert only targeted page removed. |
| TS-FP12-008 | B.2 AI content editing (template decks) | Advisor/Decora | B | FP-12 | AC-3 | Sys | Functional | P0 | Med | Automate now | populated template deck | staging | B.1 | UI-only check. |
| TS-FP12-009 | B.2 AI content editing (template decks) | Advisor/Decora | B | FP-12 | Edge-1 | Int, Exp | Negative/Edge | P0 | Med | Manual-only | invalid page/field reference | staging, live LLM | B.1 | Core guardrail risk. |
| TS-FP12-010 | B.2 AI content editing (template decks) | Advisor/Decora | B | FP-12 | Edge-2 | Int, Exp | Edge | P1 | Med | Manual-only | two rapid edit requests | staging, live LLM | B.1 | Confirm deterministic conflict resolution. |
| TS-FP05-023 | C.1 Guided custom-deck parameters | Advisor/Decora | C | FP-05 | AC-1 | Sys, Reg | Negative | P0 | Low | Automate now | incomplete guided form | staging | none | Blocks progression until answered. |
| TS-FP05-024 | C.1 Guided custom-deck parameters | Advisor/Decora | C | FP-05 | AC-2 | Sys, Reg | Functional | P1 | Low | Automate now | completed guided form | staging | none | Retrievable alongside resulting deck. |
| TS-FP05-025 | C.1 Guided custom-deck parameters | Advisor/Decora | C | FP-05 | AC-3 | Int | Functional | P0 | Low | Automate later | guided answers + generated deck | staging, mocked generation | none | Depends on generation determinism. |
| TS-FP05-026 | C.1 Guided custom-deck parameters | Advisor/Decora | C | FP-05 | Edge-1 | Sys | Edge | P1 | Low | Automate now | zero/extreme page count | staging | none | Confirm reject-or-clamp. |
| TS-FP05-027 | C.1 Guided custom-deck parameters (SCENARIO ADDITION) | Advisor/Decora | C | FP-05 | ASSUMPTION | Sys, Exp | Edge | P2 | Low | Manual-only | ambiguous/short purpose text | staging | none | Confirms flow doesn't block on interpretation quality. |
| TS-FP12-011 | C.2.1 Prompt intake & structure planning | Advisor/Decora | C | FP-12 | AC-1 | Int | Functional | P0 | Med | Automate later | prompt + guided answers | staging, mocked LLM | C.1 | LLM-dependent outline generation. |
| TS-FP12-012 | C.2.1 Prompt intake & structure planning | Advisor/Decora | C | FP-12 | AC-2 | Int | Functional | P0 | Med | Automate later | prompt + specific page count | staging, mocked LLM | C.1 | Assert outline length matches parameter. |
| TS-FP12-013 | C.2.1 Prompt intake & structure planning | Advisor/Decora | C | FP-12 | AC-3 | Int, Reg | Integration | P0 | Med | Automate now | stored outline artifact | staging | C.1 | Storage/retrieval only. |
| TS-FP12-014 | C.2.1 Prompt intake & structure planning | Advisor/Decora | C | FP-12 | Edge-1 | Int, Exp | Edge | P0 | Med | Manual-only | contradictory prompt vs. parameters | staging, live LLM | C.1 | Blocked on DECISION NEEDED — placeholder. |
| TS-FP12-015 | C.2.1 Prompt intake & structure planning (SCENARIO ADDITION) | Advisor/Decora | C | FP-12 | ASSUMPTION | Exp | Edge | P1 | Med | Manual-only | minimal/vague prompt | staging, live LLM | C.1 | Exploratory judgment on outline usability. |
| TS-FP12-016 | C.2.2 AI content & layout generation engine | Advisor/Decora | C | FP-12 | AC-1 | Int | Functional | P0 | High | Automate later | outline + prompt | staging, mocked LLM | C.2.1 | Assert every outline section has content. |
| TS-FP12-017 | C.2.2 AI content & layout generation engine | Advisor/Decora | C | FP-12 | AC-2 | Sys, Reg | Functional | P0 | High | Automate now | generated content + client palette | staging | A.3 | Deterministic once content exists. |
| TS-FP12-018 | C.2.2 AI content & layout generation engine | Advisor/Decora | C | FP-12 | AC-3 | Int | Functional | P0 | High | Automate later | fault-injected section failure | staging, fault-injection harness | C.2.1 | Also Reliability NFR evidence. |
| TS-FP12-019 | C.2.2 AI content & layout generation engine | Advisor/Decora | C | FP-12 | Edge-1 | Int | Edge | P0 | High | Automate later | injected LLM timeout | staging, fault-injection harness | C.2.1 | Also Reliability NFR evidence. |
| TS-FP12-020 | C.2.2 AI content & layout generation engine | Advisor/Decora | C | FP-12 | Edge-2 | Exp | Edge | P0 | High | Manual-only | out-of-scope prompt (real-time data request) | staging, live LLM | C.2.1 | Content-quality judgment required. |
| TS-FP12-021 | C.2.2 AI content & layout generation engine | Advisor/Decora | C | FP-12 | Risk | Sys, E2E, Exp | Risk-validation | P0 | High | Manual-only | representative prompt sample | staging, live LLM service | C.2.1, A.3 | Mandatory release gate. |
| TS-FP12-022 | C.2.2 AI content & layout generation engine | Advisor/Decora | C | FP-12 | N/A | Exp | Exploratory | P1 | High | Manual-only | adversarial/unusual prompts | staging, live LLM | C.2.1 | Unscripted charter. |
| TS-FP05-028 | C.2.3 Generated-draft branding finalization | Advisor/Decora | C | FP-05 | AC-1 | Sys, Reg | Functional | P0 | Low | Automate now | client with logo | staging | A.2, C.2.2 | Confirm logo appears on generated deck. |
| TS-FP05-029 | C.2.3 Generated-draft branding finalization | Advisor/Decora | C | FP-05 | AC-2 | Sys, Reg | Functional | P0 | Low | Automate now | freshly generated deck | staging | C.2.2 | Status must read draft, not finished. |
| TS-FP05-030 | C.2.3 Generated-draft branding finalization | Advisor/Decora | C | FP-05 | Edge-1 | Sys | Edge | P1 | Low | Automate now | client with no logo | staging | A.2, C.2.2 | Generation should still complete. |
| TS-FP05-031 | C.2.3 Generated-draft branding finalization (SCENARIO ADDITION) | Advisor/Decora | C | FP-05 | ASSUMPTION | Int, Reg | Functional/Integration | P0 | Low | Automate now | fresh draft deck | staging | D.1, D.2 | Cross-checks export-gating logic. |
| TS-FP05-032 | C.2.3 Generated-draft branding finalization (SCENARIO ADDITION) | Advisor/Decora | C | FP-05 | ASSUMPTION | Sys | Edge | P2 | Low | Automate now | client with confirmed name | staging | C.2.2 | Verify real name, not placeholder text. |
| TS-FP12-023 | C.3 AI/manual draft refinement (custom decks) | Advisor/Decora | C | FP-12 | AC-1 | Int | Functional | P0 | Med | Automate later | generated draft | staging, mocked LLM (shared w/ B.2) | B.2, C.2 | Reuses B.2's editing surface. |
| TS-FP12-024 | C.3 AI/manual draft refinement (custom decks) | Advisor/Decora | C | FP-12 | AC-2 | Sys, Reg | Functional | P0 | Med | Automate now | generated draft | staging | C.2 | No AI dependency for manual path. |
| TS-FP12-025 | C.3 AI/manual draft refinement (custom decks) | Advisor/Decora | C | FP-12 | AC-3 | Sys, Reg | Functional | P0 | Med | Automate now | draft ready to finish | staging | C.2 | Explicit action required. |
| TS-FP12-026 | C.3 AI/manual draft refinement (custom decks) | Advisor/Decora | C | FP-12 | Edge-1 | Sys, Int | Negative | P0 | Med | Automate now | draft with deliberately failed section | staging | C.2.2 | Ties directly to C.2.2's failure-surfacing rule. |
| TS-FP12-027 | C.3 AI/manual draft refinement (custom decks) (SCENARIO ADDITION) | Advisor/Decora | C | FP-12 | ASSUMPTION | Sys | Functional | P1 | Med | Automate now | edited draft | staging | B.2, C.2 | Verify undo/revert of recent edit. |
| TS-FP05-033 | D.1 Export to PDF | Advisor/Decora | D | FP-05 | AC-1 | Sys, Reg | Functional | P0 | Low | Automate now | finished deck | staging, PDF service | B.1 or C.3 | Compare rendered PDF to on-platform view. |
| TS-FP05-034 | D.1 Export to PDF | Advisor/Decora | D | FP-05 | AC-2 | Sys, Reg | Negative | P0 | Low | Automate now | draft deck | staging | B.1 or C.3 | Export action must be blocked/hidden. |
| TS-FP05-035 | D.1 Export to PDF | Advisor/Decora | D | FP-05 | AC-3 | Sys | Functional | P1 | Low | Automate now | finished deck, edited then re-exported | staging | B.1 or C.3 | Confirm no stale cache. |
| TS-FP05-036 | D.1 Export to PDF | Advisor/Decora | D | FP-05 | Edge-1 | Exp | Edge | P1 | Low | Manual-only | deck with charts | staging | B.1 or C.3 | Visual consistency check. |
| TS-FP05-037 | D.1 Export to PDF (SCENARIO ADDITION) | Advisor/Decora | D | FP-05 | ASSUMPTION | Sys, Int | Edge | P2 | Low | Automate later | maximum-length deck | staging | B.1 or C.3 | Scale-boundary check. |
| TS-FP05-038 | D.2 Export to PPTX | Advisor/Decora | D | FP-05 | AC-1 | Sys, Int | Functional | P0 | Med | Automate later | finished deck | staging, PPTX library, PowerPoint instance | B.1 or C.3 | Needs PPTX-opening validation tooling. |
| TS-FP05-039 | D.2 Export to PPTX | Advisor/Decora | D | FP-05 | AC-2 | Exp | Functional | P0 | Med | Manual-only | finished deck | PowerPoint instance | B.1 or C.3 | Manual edit check inside PowerPoint. |
| TS-FP05-040 | D.2 Export to PPTX | Advisor/Decora | D | FP-05 | AC-3 | Sys, Reg | Negative | P0 | Med | Automate now | draft deck | staging | B.1 or C.3 | Same gating rule as PDF export. |
| TS-FP05-041 | D.2 Export to PPTX | Advisor/Decora | D | FP-05 | Edge-1 | Int, Exp | Edge/Integration | P0 | Med | Manual-only | complex chart deck | staging, PPTX library | B.1 or C.3 | Named technical risk — spike-validation. |
| TS-FP05-042 | D.2 Export to PPTX (SCENARIO ADDITION) | Advisor/Decora | D | FP-05 | ASSUMPTION | Sys | Edge | P1 | Med | Automate later | text-only deck | staging | B.1 or C.3 | Isolates text-only path from chart-risk path. |
| TS-FP05-043 | D.3 Live link sharing | Advisor/Decora | D | FP-05 | AC-1 | Sys, Reg | Functional | P0 | Low | Automate now | finished deck | staging | B.1 or C.3 | Confirm URL is reachable, unauthenticated. |
| TS-FP05-044 | D.3 Live link sharing | Advisor/Decora | D | FP-05 | AC-2 | Reg | Functional | P1 | Low | Automate later | generated link, extended wait | staging | B.1 or C.3 | Long-duration check, slower cadence. |
| TS-FP05-045 | D.3 Live link sharing | Advisor/Decora | D | FP-05 | AC-3 | Sys, Reg | Functional | P0 | Low | Automate now | link + subsequent deck edit | staging | B.1 or C.3 | Link must reflect latest saved state. |
| TS-FP05-046 | D.3 Live link sharing | Advisor/Decora | D | FP-05 | Edge-1 | Sys | Edge | P0 | Low | Manual-only | deck deleted/unfinalized post-link | staging | B.1 or C.3 | Blocked on OPEN QUESTION — placeholder. |
| TS-FP05-047 | D.3 Live link sharing (SCENARIO ADDITION) | Advisor/Decora | D | FP-05 | ASSUMPTION | Sys | Access-control/Edge | P0 | Low | Automate now | malformed/guessed URL | staging | B.1 or C.3 | Security-adjacent check for a public route. |

**Totals:** 74 scenarios. P0 = 37, P1 = 27, P2 = 10. Smoke suite = the 37 P0 rows; full regression = P0+P1 = 64 rows.

## 10b. PRD coverage cross-check

| PRD Feature (Section 10 row) | Test Scenario ID(s) | Status |
|---|---|---|
| A.1 | TS-FP05-001–005 | Covered |
| A.2 | TS-FP05-006–010 | Covered |
| A.3 | TS-FP12-001–005 | Covered |
| A.4 | TS-FP05-011–017 | Covered |
| B.1 | TS-FP05-018–022 | Covered |
| B.2 | TS-FP12-006–010 | Covered |
| C.1 | TS-FP05-023–027 | Covered |
| C.2.1 | TS-FP12-011–015 | Covered |
| C.2.2 | TS-FP12-016–022 | Covered |
| C.2.3 | TS-FP05-028–032 | Covered |
| C.3 | TS-FP12-023–027 | Covered |
| D.1 | TS-FP05-033–037 | Covered |
| D.2 | TS-FP05-038–042 | Covered |
| D.3 | TS-FP05-043–047 | Covered |

**Coverage: 14 of 14 PRD Section 10 features Covered, 0 orphans.**

## 11. Release / phase test plan

Single MVP release (no phased rollout per PRD Section 11); gates follow the dependency-ordered epics.

| Gate | Must pass | Sign-off criteria | Rollback trigger |
|---|---|---|---|
| Epic A complete (Foundation) | All P0 in TS-FP05-001–017, TS-FP12-001–005. | Client data isolation (TS-FP05-004) and portfolio import (TS-FP05-011–014) fully green. | Any failure of TS-FP05-004 — release-blocking at any stage. |
| Epic B complete (Template path) | All P0 in TS-FP05-018–022, TS-FP12-006–009. | Template creation and AI-editing guardrails (TS-FP12-009) verified. | Guardrail failure allowing structural changes beyond scope. |
| Epic C complete (Custom AI path) | All P0 in TS-FP05-023–032, TS-FP12-011–027, plus TS-FP12-021. | TS-FP12-021 must pass against the live AI service — the release's core go/no-go signal. | Systemic failure of TS-FP12-021 blocks release regardless of other gates. |
| Epic D complete (Export & sharing) | All P0 in TS-FP05-033–047. | Draft-gating (TS-FP05-034, 040) and PPTX fidelity risk (TS-FP05-041) verified. | Non-editable/flattened PPTX blocks release of that feature specifically. |
| Full release (UAT gate, per PRD 5.3) | All P0 + P1 (64 of 74), plus client walkthrough of each epic. | Client sign-off per PRD Section 5.3. | Any P0 regression discovered during UAT walkthrough. |

## 12. Risks, assumptions, decisions needed, open questions

**PRD GAP**
- Compliance NFR — no framework named, deferred to a later phase.
- Accessibility NFR — no standard specified.
- Exact portfolio setting board column schema — affects TS-FP05-011–017 fixture design.

**SCENARIO ADDITION (confirmed at Phase 2 checkpoint)**
- TS-FP05-027, TS-FP12-015, TS-FP05-031, TS-FP05-032, TS-FP12-027, TS-FP05-037, TS-FP05-042, TS-FP05-047.

**DECISION NEEDED**
- Conflict-resolution rule when a prompt contradicts guided parameters — blocks TS-FP12-014.
- Extraction method (clustering vs. LLM vision) — Week-1 spike, affects TS-FP12-004/005.

**OPEN QUESTION**
- Live-link behavior after the underlying deck is deleted/unfinalized — blocks TS-FP05-046.
- Final guided-question set beyond page count/purpose — may add scenarios to TS-FP05-023–027 once defined.

## 13. Handoff to Test Case Generator

The Test Case Generator takes each Section 10 row (one Test Scenario) and expands it into a full test case: preconditions, numbered steps, concrete test data values, and expected results with pass/fail criteria. This document defines **what** to test and **how rigorously** — it deliberately stops at the scenario level. Two scenarios (`TS-FP12-014`, `TS-FP05-046`) are flagged as not yet expandable until their underlying `DECISION NEEDED`/`OPEN QUESTION` items resolve.

---

## Decision Log — full table

| # | Date | Phase | Item/Question | Decision/Answer | Decided by | Source/Rationale | Affected sections |
|---|---|---|---|---|---|---|---|
| 1 | 2026-07-17 | 0 | Feature inventory & complexity groupings | Confirmed as drafted — 6 Low, 7 Med, 1 High. | Human | User confirmed. | Section 5 |
| 2 | 2026-07-17 | 0 | 7 PRD GAP features | Proceed with QA-judgment scenarios, tagged and flagged at checkpoint. | Human | User confirmed. | Section 5, 12 |
| 3 | 2026-07-17 | 0 | Depth-tier elevation | None requested. | Human | User confirmed. | Section 2 |
| 4 | 2026-07-17 | 2 | 7 PRD GAP features — depth parity | One SCENARIO ADDITION each to reach tier-appropriate coverage. | AI (provisional) | Per Decision Log entry 2. | Section 5 |
| 5 | 2026-07-17 | 2 | TS-FP12-014, TS-FP05-046 | Left as unscored placeholders pending PRD's own open items. | AI (provisional) | No product decision to script against yet. | Section 5, 12 |
| 6 | 2026-07-17 | 2 | C.2.2 scenario count | 7 scenarios per the High-tier formula. | AI (provisional) | Section 2 formula. | Section 5 |
| 7 | 2026-07-17 | 2 | Phase 2 checkpoint | All 14 blocks, including 8 SCENARIO ADDITION rows, approved. | Human | User confirmed. | Section 5 |
| 8 | 2026-07-17 | 3 | Compliance/Accessibility NFR | Left PRD GAP — no target exists in the PRD. | AI (provisional) | Matches PRD's own deferral. | Section 6, 12 |
| 9 | 2026-07-17 | 3 | Reliability NFR scenario reuse | TS-FP12-018/019 reused rather than duplicated. | AI (provisional) | Avoids redundant scenario IDs. | Section 5, 6 |
| 10 | 2026-07-17 | 3 | Phase 3 checkpoint | NFR/integration test plans approved as drafted. | Human | User proceeded to Phase 4. | Section 6, 7 |
| 11 | 2026-07-17 | 4 | Final checkpoint | Coverage 14/14, TS-FP12-021 confirmed as risk-validation and release gate, all gaps/additions routed, Decision Log confirmed complete. | Human | User approved final document. | All |
| 12 | 2026-07-17 | 4 | Notion publication | Declined — chat-only deliverable, consistent with the BRD and PRD. | Human | User requested downloadable document only. | N/A |
