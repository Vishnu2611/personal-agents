# IntuitioLabs Estimation Template — SOP

Markdown mirror of the **SOP** tab inside `IntuitioLabs - Estimation Template.xlsx`. This
workbook turns a feature list into an **internal cost + client price + margin**, backed by a
week-by-week resource plan. Read this before editing any tab.

> Genericised from `Mocha MVP - Estimation.xlsx`. All formulas, both rate cards, formatting,
> the role dropdown, and freeze panes are preserved. Project inputs are blanked, with **one
> sample feature row** kept in `Development` (row 6). The original Mocha workbook is retained as
> the worked example.

## Workbook tabs (in order)

`README` · **`SOP`** · `Design` · `Development` · `Plan` · `Estimation-Detail` ·
`Estimation-Summary` · `Cost Rate Card` · `Price Rate Card` · `Assumptions`

## 1. Golden rules

- **Copy the template per project** — never estimate inside the master.
- **Colour convention:** blue font = a cell you fill (manual input); black = calculated (holds a
  formula — don't overwrite).
- Don't change fonts, colours, column order, or structure. All tabs stay formatted identically.
- **Units:** 1 man-day = 8 hours. Estimate in man-days; the sheet converts to hours/cost/price.
- **Cost** = what IntuitioLabs spends (internal). **Price** = what the client pays.
  **Margin = (Price − Cost) ÷ Price.**
- Rate cards are studio-locked — change a rate only with Deep's approval.

## 2. Fill order

| Step | Tab | What you do |
|---|---|---|
| 1 | Cost / Price Rate Card | Confirm rates are current (Price col D auto-uses the latest dated column). |
| 2 | Development | List every feature + client-facing description; enter man-days for FE (H), BE (I), AI (J). QA auto-calcs. |
| 3 | Design | Design team enters Wireframing / UI Desktop / UI Responsive man-days per feature. |
| 4 | Plan | Translate estimates into staffing: FTE per role per week (Discovery/Design/Development). The engine. |
| 5 | Estimation-Detail | Mostly automatic; fill the few blue design + other-bucket lines. |
| 6 | Estimation-Summary | Set durations, buffer %, complexity quote summary; build client commercial options. |

## 3. How to write a feature description (Development column E)

Column E is **shared with the client** — write it for them, not for engineers. No internal jargon,
no hour numbers, no team names.

**One feature = one row.** If a feature has distinct sub-capabilities that you size separately
(e.g. Office Hours → Queue / Post Question / Video Call), split it into separate rows.

**Format (MANDATORY — a single-line description fails review):**
- Lead with **2–4 user-perspective bullets**: `• Ability for a <role> to <do X>.` Cover the key
  actions and states the feature includes — the reviewer must be able to see what the hours map to.
- End with **exactly one `• Technical -` line** naming the implementation approach (stack, services,
  integrations). This is the part engineers size against.
- Keep it scannable — 3–5 bullets total (2–4 user bullets + the Technical line).

**Worked example (the "Login" feature):**
```
• The Login feature allows users to securely access their accounts.
• Ability to route the user to the relevant home (member, employer, admin) by role.
• Technical - Cognito auth, session/JWT, route-guard middleware.
```

## 4. How to estimate each line item

Estimate in **man-days (1 MD = 8h)** = focused build effort for one competent engineer. Deeper
benchmark tables live in the Master Context Pack inside the estimation prompt; the working rules:

**Per-role man-days (Development H / I / J / L–O):**
- **FE / BE / AI** — size each feature against the discipline-mix band for the project archetype
  (web greenfield ≈ FE 30–40% / BE 30–40% of dev). Rough anchors: simple CRUD screen ≈ 1–2 MD/role;
  multi-step workflow ≈ 3–4 MD; AI/integration features carry AI days.
- **HARD CAP — no role cell may exceed 5 MD.** This is a contract document: tasks must be granular
  and well defined. If a role needs more than 5 MD, split the feature into smaller, well-defined
  rows. **Exactly 5 MD is allowed only on a row explicitly tagged `spike`** — a genuine technical
  unknown that needs discovery to settle the solution approach (an actual engineering problem, NOT
  a framework / vendor / 3rd-party-platform choice).
- **Tag complexity drivers** that inflate effort and give them their own rows or extra days:
  realtime/WebSocket, video/streaming, voice-or-video calling, maps/geofencing, scoring engines,
  multi-tenant, document parsing, payments (multi-rail = ×1.3 on BE+QA), agent tool-calling.
- **QA (K)** — leave blank; the formula sets it to 30% of (FE+BE+AI).
- **DevOps / Analyst / PM / Architect (L–O)** — add only where the feature needs them. Most feature
  rows = 0; infra/setup/cutover carry DevOps; reporting/data carry Analyst.

**Design man-days (Design sheet):** Wireframing + UI Desktop + UI Responsive per feature/grouping.
Keep total design within the band: 0% backend/migration · 5–10% light/V2 · 18–25% greenfield ·
25–35% design-led.

**Overhead rows (Development 84–91)** — size to the week plan; keep total **"Other" within the
size-tier band** (≤350h: 12–15% · 700–1,500h: 8–12% · ≥2,500h: 5–7%):

| Line | Sizing rule |
|---|---|
| PM | 35–55% of Other (≈3h/wk small, ≈6h/wk mid) |
| Internal Calls | 15–20% of Other |
| Client Calls | 5–15% of Other |
| Dev Estimation | 10–20% of Other |
| KT / Handover | 1–3% of Other |
| DevOps | 1–4% of dev hours; bookended (Week 1 + final week). **Must be > 0 man-days in Development** on any build — never left empty while the Plan staffs DevOps |
| Buffer | **the reconciliation filler**: after staffing the Plan, set per-role Buffer man-days (row 84, one cell per role column) so each role's Development hours exactly equal its Plan hours (see §4a). Never used to silently absorb scope |
| UAT | per the test plan (e.g. ~3 weeks for data-validation scope) |

**Sanity checks before pricing:** QA ≥ ~10% of dev · DevOps present (≥1%) and > 0 MD in Development ·
ML staffed if any AI feature · design % in band · margin in band · Plan = Development hours per role.

## 4a. Plan staffing rules (Plan tab)

The Plan is the engine — these rules are hard requirements, checked by `scripts/validate_estimate.py`:

1. **Derive the weeks from the work, not from the template.** Duration = total man-days ÷ realistic
   team capacity, sanity-checked against the §4.4 duration/team-peak bands in the Master Context
   Pack (200–400h → 3–4 wks · 400–800h → 5–6 · 800–1,500h → 7–10 · 1,500–2,500h → 10–13 ·
   2,500–3,500h → 13–18 · 3,500h+ → 18–26+). The template's 12 development / 7 design / 7 discovery
   week columns are a **maximum canvas, not a plan** — leave unused week columns at 0. The
   Estimation-Summary durations must equal the number of staffed weeks per phase.
2. **FTE increments.** Every allocation must be a multiple of **0.5** (0.5, 1, 1.5, 2, 2.5 …).
   Exceptions: **PM is always 0.2**; **Architect may only be 0.2, 0.25, 0.5, 0.75 or 1**.
3. **Be realistic.** Team peak must sit inside the §4.4 band for the hour total — you cannot assign
   10 people and finish in a week. Respect sequencing: Foundation → Auth → core → integration
   spikes Week 1 → cutover last; QA ramps in the back half; DevOps bookended.
4. **Plan hours = Development hours, exactly, per role.** Staff the Plan so each role's hours
   (FTE × 40, summed over weeks) are ≥ that role's Development man-days × 8; then write the
   difference into the per-role **Buffer** cells (Development row 84) so the two sides match
   exactly. Buffer man-days may be fractional (e.g. 1.25 MD when Architect is staffed at 0.25
   FTE) — exactness matters more than round numbers. (Analyst is exempt — it has no Plan row and
   flows from man-days directly.)

**Worked example (sizing "Login"):** FE 1.5 + BE 1.0 + AI 0 → QA auto = `ROUND((1.5+1.0)×30%,0)` = 1
→ feature total 3.5 MD. No DevOps/Analyst/Architect on a standard auth screen.

## 5. The calculation chain

```
Development (man-days/feature)  ─┐
Design (man-days/feature) ───────┤ inform staffing decisions
                                 ▼
Plan  ── FTE/role/week ──► Hours (= FTE × 40) ──► Cost (× Cost Rate Card)
                                            └────► Price (× Price Rate Card)
                                 │
                                 ▼  (role totals, col Q)
Estimation-Detail  ── Discovery + Design + Development + Other ──► hours / cost / price
                                 │
                                 ▼
Estimation-Summary ── phase roll-up + buffer + discounts ──► Client price, Margin %, Options
```

## 6. Tab-by-tab — inputs, outputs, key formulas

### Cost Rate Card (internal $/hr)
- **You enter:** internal hourly cost per role (col D). Architect $35, Engineer $28, Lead $30, ML/AI $35, Analyst $40, Designer tiers $33 / $24 / $15.
- **Used by:** every Cost formula in Plan and Estimation-Detail (`hours × rate`).

### Price Rate Card (client $/hr)
- **You enter:** client rate in dated columns (H = 06/08/2023, I = 10/29/2024). Add a new dated column when rates change.
- **Key formula:** col D (active price) = the latest dated column, e.g. `D6 = I6`. Keeps every Price formula on the newest rate.

### Development (feature inventory + per-role man-days) — *client-facing*
- **You enter (blue):** Feature (D), user-perspective description (E — see §3), User Role (F — dropdown Member/Employer/Admin/Other), man-days FE (H) / BE (I) / AI (J); DevOps/Analyst/PM/Architect (L–O) where relevant.
- **Auto:** QA (K) = `ROUND( SUM(FE, BE, AI) × 30% , 0 )` → **QA sized at 30% of build effort**, whole man-days.
- **Auto:** Row 92 = per-role column sums (total man-days). Col P = total effort. Row 93 = row 92 − UAT line (row 85).
- **Rows 84–91 (Buffer, UAT, DevOps, PM, Architect, Internal/Client calls, KT) are part of the template** — standing overhead lines. Their value cells are **blue inputs**: enter man-days sized to the week plan (see §4). Keep the labels; fill the hours.
- **Colour coding:** input cells (feature text, role, and all man-day columns incl. the bottom overhead rows) are **blue**; calculated cells (QA col K, Total col P, totals rows 92–93) are **black**.

### Design (internal design estimate)
- **You enter (blue):** feature/grouping, description, man-days for Wireframing (D) / UI Desktop (E) / UI Responsive (F). Input area = rows 6–38 (one sample row pre-filled at row 6).
- **Auto (black):** Total column G per row = `SUM(D:F)`. Row 39 = column totals over the full table (rows 6–38); `G39` = grand total man-days.
- **Feeds:** Estimation-Detail Wireframing hours = `Design!D39 × 8` (the wireframing column total × 8h/man-day).

### Plan (weekly resource → hours → cost → price **engine**)
- **Config:** `C7` = hours per week = 40.
- **You enter (blue):** FTE per role per week in each Resource Plan block. 1.0 = full-time, 0.5 = half. Use the feature man-days to decide staffing, per the §4a rules (0.5 increments; PM 0.2; Architect 0.2/0.25/0.5/0.75/1; weeks derived from the work; plan = development hours per role).
- **Hours (auto):** `hours = FTE × hours/week`. e.g. `D53 = D26 × $C$7`. Col Q = total hours/role across weeks (Q57 = total Backend hours).
- **Cost (auto):** weekly cost = role hours × Cost Rate Card rate (e.g. Backend `Q87`).
- **Price (auto):** weekly price = role hours × Price Rate Card rate (AI uses niche-skill price `I14`).
- **Feeds:** Estimation-Detail reads role totals from col Q (Q53 Architect, Q55 React, Q56 AI, Q57 Backend, Q58 QA, Q59 DevOps).

### Estimation-Detail (consolidated hours / cost / price by bucket)
- **Discovery:** hours from Plan discovery rows; cost from `Plan!D72`.
- **Design hours:** Wireframing `D11 = Design!D39 × 8`; other design lines are blue manual hours. Row 19 totals.
- **Design cost/price:** `hours × MAX(designer tier rates)` (cost uses Designer-Lead tier; price uses designer price tier).
- **Development:** hours from Plan col Q; cost/price = hours × rate (Backend cost pulled directly from `Plan!Q87`).
- **Other bucket:** PM, Internal/Client Calls, Dev/Design Estimation — `hours × rate`; blue cells = the few you enter.

### Estimation-Summary (executive roll-up + client commercials)
- **Phase totals (auto):** Hours/Cost/Price per bucket summed from Estimation-Detail. Rows 13/21/30 = grand totals.
- **Buffer:** `J20` = buffer % (template default **6%**) — a markup folded into client price.
- **Margin (auto):** `(Price − Cost) ÷ Price`. Options block: `(You Pay − Our cost) ÷ You Pay`.
- **Quote Summary (blue):** High/Medium/Low complexity — count, hours, cost, price per band; share % (col N) auto.
- **Options (blue):** 1–3 client pricing scenarios — List Price, Credits, Discount → You Pay; Our Cost; Margin $ / %.

## 7. Pre-send validation checklist

- Summary total hours = Discovery + Design + Development + Other (no orphans).
- Margin ≥ studio floor (~50%); below 50% needs written architect + Deep sign-off.
- QA ≈ ≥10% of dev; DevOps present (≥1%) and > 0 MD in Development; ML/AI staffed if any AI feature.
- Every Development feature description follows the §3 format (2–4 user bullets + one `• Technical -` line).
- No role cell > 5 MD; every 5-MD cell is a tagged `spike` row (§4 hard cap).
- Plan hours = Development hours per role (Buffer row 84 is the balancing line) — §4a.
- FTE increments valid (0.5 steps; PM 0.2; Architect 0.2/0.25/0.5/0.75/1) — §4a.
- Duration and team peak inside the §4.4 band for total hours; Summary durations = staffed weeks.
- Rate-card date current (refresh quarterly).
- No `#REF!` / `#DIV/0!`; currency consistent (USD).
- `scripts/validate_estimate.py` (in the estimation-generator skill) runs green on the workbook.

## 8. Formula notes

The inherited Mocha formula bugs were **repaired in this master on 2026-07-03** — Estimation-Detail
PM hours now read the Plan PM row (`=Plan!Q54`); Plan Discovery hours no longer multiply by the
Week# value; Discovery totals include week 1; the Plan "Price for Development" DevOps row (103) now
uses the Price Rate Card for all 12 weeks. Do not re-introduce them from old project copies.

Still true by design:

- **Development man-days do NOT auto-flow** into Estimation-Detail development hours — those come
  from the Plan weekly FTE. Staff the Plan from the man-days, then close the gap with per-role
  Buffer man-days so the two sides match exactly (§4a rule 4; checked by `validate_estimate.py`).
