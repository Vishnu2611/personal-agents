---
name: "Master Context Pack v1.0"
source: "extracted from estimation-generation-from-prd-v1.6.md"
note: "Rate VALUES are superseded by the Estimation Template Cost/Price Rate Card tabs (see §9.2)."
---

# 📎 EMBEDDED CONTEXT — Master Context Pack v1.0
> The following is the studio's authoritative estimation knowledge base. All taxonomy, benchmarks, overhead rules, pricing logic, anti-patterns, and schema rules used by the Phases above are defined here. **Cite section numbers** (e.g. §3.1, §9.4, §15) when applying these rules.
---
## 1. Purpose
This pack is reusable context for an Estimation Agent that helps size new IntuitioLabs / RightShift Product Studio engagements. It encodes the studio's recurring estimation patterns — feature blocks, discipline mix, overhead structure, assumption defaults, pricing logic, sequencing rules, risk shapes, and known anti-patterns — distilled from \~38 historical projects.
It is **not a rate card**, **not a quote**, and **not a project plan**. It is the model an estimator brings to a new opportunity packet before any line item is written.
## 2. Source Coverage
- Source: Notion data source `bcacdbf8-05b7-49a0-9432-e7fbc47f9b23` (Estimation Library).
- Unique projects: \~38 (after duplicate resolution).
- Project types covered: Web, Mobile, Hybrid, Backend, ML/AI, Maintenance.
- Size spread: \$9.4K / 3-4 wks → \$412K / 26 wks.
- Currency: USD (overwhelming majority); INR and Other in schema but unobserved.
- Rate card: dated 10/29/2024 — stale-time-decaying.
## 3. Feature Taxonomy
Twelve canonical feature blocks. Every estimate draws from this list. Most projects use 6–10.
- **FP-01** Foundation & Setup (repo, envs, CI, DB migrations, IaC, containerisation) — always.
- **FP-02** Authentication & Identity (signup/login/OTP/forgot/RBAC/SSO/KYC/2FA) — almost always.
- **FP-03** Onboarding & First-Run (splash, intro, T&C, role selection, walkthrough, verification) — when users register.
- **FP-04** Role-Specific Home / Dashboards (one per persona) — when multi-role.
- **FP-05** Core Domain Workflow (the project-specific verb) — always, largest block. See §3.1 sub-library.
- **FP-06** Admin / Moderator Surface (Django Admin OR custom React.js Web Admin) — when admin role exists.
- **FP-07** Notifications & Comms (push / SMS / email / in-app inbox) — when user-facing.
- **FP-08** Payments (Plaid / CheckBook ACH / Stripe / Stripe Connect / PayPal Payouts / Payoneer read) — fintech, SaaS billing, marketplaces. **Multi-rail clustering: when 3+ rails appear inside a single epic OR are functionally coupled (one settles, one disburses, one reconciles), tag the §3.1 "Multi-rail payment cluster" sub-driver for the non-linear sizing rule.**
- **FP-09** External Integrations (LMS, HRIS, EHR, support, certification APIs, social, vertical APIs) — most projects.
- **FP-10** Reporting / Analytics / Audit (structured export V1; live dashboards V2) — most projects.
- **FP-11** Help / Support / Feedback (FAQ, tickets, thumbs feedback) — most projects.
- **FP-12** AI / RAG Capability Pack (KB → chunking → embeddings → vector store → retrieval → orchestrator → audit) — AI projects only. **When the orchestrator invokes external tools/endpoints in-flow per conversation (not just retrieval), also tag the §3.1 "Agent runtime / tool-calling" sub-driver — it is distinct from disposition decision logic and from scheduled batch agents.**
### 3.1 Complexity-Driver Sub-Library (inside FP-05)
Recurring high-effort sub-patterns. Each materially expands FP-05's size and must be flagged separately. **Tagging discipline:** a sub-driver is tagged only when the PRD evidence satisfies the "Applies when" criterion. If "Does NOT apply when" criteria are present in the PRD, do NOT tag the driver — even if a related keyword appears.
<table header-row="true">
<tr>
<td>Sub-driver</td>
<td>Observed in</td>
<td>Applies when</td>
<td>Does NOT apply when</td>
<td>Sizing signal</td>
</tr>
<tr>
<td>Realtime / WebSocket messaging</td>
<td>Mocha (XL/16 SP), ServiceExchange, Swishvo, Accuhealth, CollabRE H1</td>
<td>PRD names a persistent connection (WebSocket/SSE/pub-sub) for live messaging, presence, or push-to-screen updates between users</td>
<td>PRD only describes async ticket replies, email/SMS notifications, or RAG chatbot replies (request/response, not push)</td>
<td>Treat as separate epic; add 1–2 weeks of BE + FE; budget Sendbird/Pusher SDK licensing as client-owned</td>
</tr>
<tr>
<td>Video / VOD / live streaming</td>
<td>SuvTV (Vimeo HLS/DASH), BallinAI, Swishvo, AllSafe</td>
<td>PRD names video upload, playback, transcoding, HLS/DASH/MP4 hosting, or live streaming</td>
<td>PRD names only screenshots, images, or static media uploads</td>
<td>Add BE storage planning + bandwidth cost note; SDK licensing is client's</td>
</tr>
<tr>
<td>Voice / video calling sessions</td>
<td>Greater Change (teletherapy), Swishvo (SendBird), AllSafe (Twilio Video)</td>
<td>PRD names live audio/video session between two or more users (telehealth, vendor-to-customer call, peer-to-peer call)</td>
<td>PRD only names video playback, voice notes, or recorded media</td>
<td>Session-token architecture; HIPAA implications in healthcare contexts</td>
</tr>
<tr>
<td>Maps / Geofencing / GPS</td>
<td>AllSafe (Live Map + Geofencing Engine), Address Me, SuvTV (BLE), Stufinder</td>
<td>PRD names map display, geofence triggers, GPS tracking, location-based search, or BLE proximity</td>
<td>PRD only names a postal address field in a profile or shipping form</td>
<td>Standalone epic; Geofencing Engine is its own feature line</td>
</tr>
<tr>
<td>Sustainability / scoring / weighted-index engines</td>
<td>Nuriy (sustainability scoring), CollabRE (H-Index, H-Score, Collab Quotient)</td>
<td>PRD names a multi-factor weighted score with admin-configurable weights AND data ingestion from supplier/source records</td>
<td>PRD names only a flat rating field (e.g., 1-5 stars) or a single-source score</td>
<td>BE-heavy; weights configurable; needs data ingestion pipeline</td>
</tr>
<tr>
<td>Loyalty / tiering / rewards</td>
<td>SuvTV (4-tier card-linked), Globkin (token rewards)</td>
<td>PRD names earning rules, tier thresholds, and redemption mechanics, typically with card-linking or token integration</td>
<td>PRD names only a referral credit count without tiers or earning rules</td>
<td>Often Fidel/Marqeta-class card-linking</td>
</tr>
<tr>
<td>Multi-tenant / multi-org segmentation</td>
<td>Culture Road 1.5 (org SSO), Mocha, CollabRE</td>
<td>PRD names data isolation between organizations/tenants, org-level RBAC, org SSO, or per-org branding</td>
<td>PRD names only per-user data scoping or single-tenant vendor-customer-admin tri-role structure</td>
<td>Adds RBAC complexity; data scoping at API and UI</td>
</tr>
<tr>
<td>CMS-lite / content moderation queues</td>
<td>AllSafe (Teacher Resources, Annual Map Upload), CollabRE H3 Notice Board</td>
<td>PRD names a moderation queue with approve/reject states on user-submitted content OR an ops-facing rich-text editor for FAQ/policy updates</td>
<td>PRD names only Django admin defaults or a static FAQ list</td>
<td>Often punted to Django admin; custom CMS triggers change order</td>
</tr>
<tr>
<td>Document / file upload + parsing</td>
<td>Blended (decree upload), Nuriy (KYC docs), AllSafe (annual maps)</td>
<td>PRD names a document upload flow with downstream parsing, moderator review, or structured field extraction</td>
<td>PRD names only a profile photo upload or product image upload (no parsing, no review queue)</td>
<td>Object storage + scanning + admin review queue</td>
</tr>
<tr>
<td>Multi-site / multi-brand build</td>
<td>AIT Drupal (\~1,064h + \~1,308h = \~2,372h across two sites)</td>
<td>PRD names ≥ 2 distinct sites/brands sharing some core but with separate UIs/content</td>
<td>PRD names a single site with multiple sections or pages</td>
<td>Sum per-site hours; design assumed provided per site</td>
</tr>
<tr>
<td>Scheduled / on-demand agent runs</td>
<td>CollabRE (People Agent re-run, University Agent @ \~\$1,600/run), ATL Eco System (4 AI agents)</td>
<td>PRD names an LLM/agent triggered on a schedule or on-demand against external data sources, with per-run COGS</td>
<td>PRD names a real-time chatbot or RAG flow with per-conversation pricing (no scheduled batch agent)</td>
<td>Cost-per-run is a COGS item, not engineering effort</td>
</tr>
<tr>
<td>Agent runtime / tool-calling</td>
<td>TuneCore Chatbot (D1–D7 dispositions routing to Studio API + Zendesk + RAG endpoints), CollabRE H1 (Linear orchestrator)</td>
<td>PRD names an in-flow orchestrator/router that selects and invokes multiple endpoints or tools based on user-input intent classification, per-conversation (not scheduled, not batch). Typically paired with FP-12.</td>
<td>PRD names only a scheduled/batch agent (separate row above) OR a single deterministic API call without intent-routing OR a RAG-only retrieval flow without tool invocation</td>
<td>Tag separately from FP-12 and from "disposition orchestration" (which is the decision logic). Agent runtime covers tool invocation + result handling + fallback routing. **Sizing: when PRD itemizes per-epic / per-disposition ML and QA hours (as in TuneCore Chatbot §10), use the PRD itemization directly. Apply the 0.5–1 ML man-day per tool + 0.5 QA man-day per tool path reference only when PRD does not provide per-tool breakdown and the agent must size from scratch.**</td>
</tr>
<tr>
<td>Brownfield defect remediation</td>
<td>Nuriy (21 features + defect list), Stufinder, Okkanti, Tmro</td>
<td>PRD §6 or §12 contains an explicit defect list against an existing MVP, with named bugs to fix</td>
<td>PRD is greenfield (no prior MVP) OR is a clean post-MVP backlog (features only, no defect list)</td>
<td>Per-defect hour stamps; admin scope often Figma-only — flag risk (A4)</td>
</tr>
<tr>
<td>Multi-rail payment cluster</td>
<td>Blended (Plaid + Stripe + CheckBook ACH in E3 / E5), Nuriy (Stripe Connect + PayPal Payouts + ACH/wire in E6)</td>
<td>PRD names ≥3 payment/financial rails clustered in a single epic OR functionally coupled across adjacent epics (settle / disburse / reconcile). **Plaid-class read-only bank linking counts toward the rail count when paired with a downstream money-movement rail it directly enables (Plaid → CheckBook ACH chain is one such pairing).**</td>
<td>PRD names ≤2 rails OR rails are isolated across separate epics with no cross-rail flow OR Plaid-class linking exists alone without downstream money movement</td>
<td>**Apply a 1.3× multiplier to the linear sum of BE + QA hours across the cluster epics** (FE unchanged — cross-rail testing burden is BE/QA-side: idempotency, reconciliation, error paths, webhook handling, dispute flows). **Formula: identify the cluster as the set of epics containing the coupled rails; sum BE + QA hours across all cluster epics; multiply that sum by 1.3; FE hours unchanged.** Document the multiplier + the rails it covers in Phase 1 sizing notes.</td>
</tr>
</table>
## 4. Effort Benchmark Patterns
### 4.1 Discipline mix as % of Development hours (directional)
<table header-row="true">
<tr>
<td>Archetype</td>
<td>Arch</td>
<td>FE</td>
<td>Mobile</td>
<td>BE</td>
<td>QA</td>
<td>DevOps</td>
<td>ML</td>
<td>Analyst</td>
</tr>
<tr>
<td>Mobile-only</td>
<td>4–6</td>
<td>—</td>
<td>40–50</td>
<td>30–35</td>
<td>15–20</td>
<td>1–3</td>
<td>0</td>
<td>0–5</td>
</tr>
<tr>
<td>Web-only greenfield</td>
<td>4–8</td>
<td>30–40</td>
<td>—</td>
<td>30–40</td>
<td>15–20</td>
<td>2–4</td>
<td>0</td>
<td>0–5</td>
</tr>
<tr>
<td>Hybrid (Web + Mobile)</td>
<td>3–5</td>
<td>15–20</td>
<td>20–30</td>
<td>35–45</td>
<td>15–20</td>
<td>1–3</td>
<td>0</td>
<td>0–5</td>
</tr>
<tr>
<td>Backend / Migration</td>
<td>7–10</td>
<td>5–10</td>
<td>0</td>
<td>50–60</td>
<td>10–15</td>
<td>2–4</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>AI / RAG</td>
<td>5–7</td>
<td>25–30</td>
<td>0</td>
<td>35–45</td>
<td>10–15</td>
<td>1–3</td>
<td>10–15</td>
<td>3–6</td>
</tr>
<tr>
<td>Maintenance / Brownfield</td>
<td>0–3</td>
<td>varies</td>
<td>varies</td>
<td>varies</td>
<td>20–25</td>
<td>0–2</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>**Consulting / Documentation / Audit**</td>
<td>**4–8**</td>
<td>**varies (audit-targets)**</td>
<td>**varies (audit-targets)**</td>
<td>**varies (audit-targets)**</td>
<td>**0**</td>
<td>**5–10**</td>
<td>**0**</td>
<td>**35–50 (BA-led)**</td>
</tr>
</table>
### 4.2 Design as % of total project hours
<table header-row="true">
<tr>
<td>Pattern</td>
<td>Design %</td>
<td>When</td>
</tr>
<tr>
<td>Design-provided / none</td>
<td>0%</td>
<td>Migration, backend-only, brownfield extension</td>
</tr>
<tr>
<td>Light design (delta)</td>
<td>5–10%</td>
<td>Backlog, V2 polish, scope extensions</td>
</tr>
<tr>
<td>Standard greenfield</td>
<td>18–25%</td>
<td>New product MVP with design system</td>
</tr>
<tr>
<td>Design-led</td>
<td>25–35%</td>
<td>Brand-heavy, consumer-facing, Aequus-class healthcare</td>
</tr>
</table>
**Design-day base → Design-bucket conversion rule (v1.4):** when the PRD names a raw design-day base only (e.g., "Wireframing 2.5d + UI Design 3.5d = 6 days"), do NOT use the named base as the Design bucket total. The named base covers only wireframing + UI design execution. The full Design bucket also includes Hi-Fi prototyping, Edits-after-Review, and Design Control. **Apply a 1.5× multiplier to the named raw design-day base** to land the full Design bucket. If the PRD already itemizes Design components separately (UI/UX, Hi-Fi proto, Edits, Design Control), use the itemized sum directly and skip the multiplier.
**Design Discovery placement:** if the PRD also names a separate Design Discovery line, the 1.5× multiplier covers the Design bucket only. **Design Discovery is sized separately into the Discovery bucket per §4.2 and is NOT covered by the multiplier.** Conceptually: `(raw design-day base) × 1.5 → Design bucket`. Any Design Discovery hours live in the Discovery bucket, sized separately.
Cite which path (multiplier vs. itemized) was used in Phase 1 sizing notes.
### 4.3 "Other" overhead bucket as % of total
<table header-row="true">
<tr>
<td>Project size</td>
<td>Other %</td>
</tr>
<tr>
<td>≤ 350h / ≤ 4 wks</td>
<td>12–15</td>
</tr>
<tr>
<td>700–1,500h</td>
<td>8–12</td>
</tr>
<tr>
<td>≥ 2,500h</td>
<td>5–7</td>
</tr>
</table>
### 4.4 Duration vs total hours
<table header-row="true">
<tr>
<td>Total hours</td>
<td>Duration</td>
<td>Team peak</td>
</tr>
<tr>
<td>200–400</td>
<td>3–4 wks</td>
<td>4–6 fractional</td>
</tr>
<tr>
<td>400–800</td>
<td>5–6 wks</td>
<td>6–8</td>
</tr>
<tr>
<td>800–1,500</td>
<td>7–10 wks</td>
<td>8–10</td>
</tr>
<tr>
<td>1,500–2,500</td>
<td>10–13 wks</td>
<td>10–13</td>
</tr>
<tr>
<td>2,500–3,500</td>
<td>13–18 wks</td>
<td>13–15</td>
</tr>
<tr>
<td>3,500+</td>
<td>18–26+ wks</td>
<td>FTE recommended</td>
</tr>
</table>
## 5. Workstream Mapping Rules
<table header-row="true">
<tr>
<td>Work pattern</td>
<td>Belongs to</td>
</tr>
<tr>
<td>Repo / env / CI / IaC / containerisation</td>
<td>DevOps lead + BE support</td>
</tr>
<tr>
<td>DB schema, migrations, queries, indexing</td>
<td>BE lead + Architect review</td>
</tr>
<tr>
<td>API endpoints, business logic, integrations</td>
<td>BE primary</td>
</tr>
<tr>
<td>RBAC at API layer</td>
<td>BE + Architect</td>
</tr>
<tr>
<td>RBAC at UI layer</td>
<td>FE / Mobile</td>
</tr>
<tr>
<td>Auth flows (signup, login, OTP, 2FA)</td>
<td>FE / Mobile + BE</td>
</tr>
<tr>
<td>SSO / OIDC / SAML configuration</td>
<td>Architect spike → BE build</td>
</tr>
<tr>
<td>KYC vendor (Sumsub-class)</td>
<td>BE + FE/Mobile + Architect spike</td>
</tr>
<tr>
<td>Push notifications</td>
<td>Mobile + BE + DevOps (FCM/APNs)</td>
</tr>
<tr>
<td>SMS / Email</td>
<td>BE + DevOps</td>
</tr>
<tr>
<td>React Native screens</td>
<td>Mobile primary</td>
</tr>
<tr>
<td>React.js / Next.js screens</td>
<td>FE primary</td>
</tr>
<tr>
<td>Web Admin (React.js custom)</td>
<td>FE primary + BE</td>
</tr>
<tr>
<td>Django Admin (defaults)</td>
<td>BE only</td>
</tr>
<tr>
<td>Visual design (wireframe → UI → Hi-Fi)</td>
<td>Designer Lead + Designer + Designer Asst</td>
</tr>
<tr>
<td>Design system / component library</td>
<td>Designer Lead + FE consult</td>
</tr>
<tr>
<td>Vector store / embeddings / RAG</td>
<td>ML/AI Engineer + BE</td>
</tr>
<tr>
<td>Orchestrator / LLM routing / NLP</td>
<td>ML/AI Engineer + Architect</td>
</tr>
<tr>
<td>Realtime / WebSocket / pub-sub</td>
<td>BE + DevOps (infra) + FE/Mobile</td>
</tr>
<tr>
<td>Video SDK (Twilio Video / Agora / SendBird)</td>
<td>Architect spike + BE + Mobile/FE</td>
</tr>
<tr>
<td>Geofencing / Maps</td>
<td>Mobile + BE (geo logic)</td>
</tr>
<tr>
<td>Vendor-specific API spike (Plaid, Stripe, EPIC, Workday)</td>
<td>Architect Week 1</td>
</tr>
<tr>
<td>Test plan / regression / E2E / functional QA</td>
<td>QA</td>
</tr>
<tr>
<td>Performance / load testing</td>
<td>QA + DevOps + Architect — **scoped separately**</td>
</tr>
<tr>
<td>Audit log / structured export</td>
<td>BE + Analyst</td>
</tr>
<tr>
<td>Compliance posture (HIPAA/FERPA/CJIS/SOC2)</td>
<td>Architect — alignment only, never certification</td>
</tr>
<tr>
<td>App store submission</td>
<td>Mobile + PM</td>
</tr>
<tr>
<td>Cutover / migration / production launch</td>
<td>DevOps + BE + Architect</td>
</tr>
<tr>
<td>KT / Handover docs</td>
<td>Architect + PM</td>
</tr>
<tr>
<td>Client status calls</td>
<td>PM</td>
</tr>
<tr>
<td>Internal sprint planning / backlog grooming</td>
<td>PM + Architect</td>
</tr>
<tr>
<td>Estimation of new scope / change orders</td>
<td>PM + Architect (Dev Estimation) + Designer Lead (Design Estimation)</td>
</tr>
</table>
## 6. Standard Assumptions
Apply as defaults in every output. Override only if PRD overrides.
**Commercial:** Currency USD; contract type DECISION NEEDED; rate card locked at proposal date; 5-business-day review window with deemed acceptance.
**Delivery:** 1 dev day = 8h; three environments (dev/staging/prod); functional QA only (perf/load separate); 2-wk hypercare as separate line; ongoing maintenance is a separate monthly commercial.
**Scope (out unless added):** English-only; mobile out unless type = Mobile/Hybrid; web out unless type = Web/Hybrid; 3rd-party SDK fees client's; certification client's (we deliver architecture-aligned); historical data migration not included; marketing site not included; content authoring not included; tablet-responsive not included; branding client-provided; CMS depth = admin defaults; reporting depth = structured export; live chat out unless explicitly scoped.
**Technical:** AWS default; PostgreSQL default; QA on staging = acceptance gate; WCAG 2.1 AA default.
## 7. Overhead Rules
### 7.1 "Other" bucket sub-mix (always itemized)
**Cap rule:** the sum of all Other-bucket lines below must fall within the §4.3 % band for the project's hour-tier (≤350h → 12–15%; 700–1,500h → 8–12%; ≥2,500h → 5–7%). If the sum exceeds the upper bound, re-allocate inside this bucket (typically trim PM, internal calls, or buffer) before pricing. The cap is a hard rule, not a guideline.
<table header-row="true">
<tr>
<td>Line</td>
<td>Always?</td>
<td>Sizing</td>
</tr>
<tr>
<td>PM</td>
<td>Yes</td>
<td>35–55% of Other; \~3h/wk small, \~6h/wk mid, FTE large</td>
</tr>
<tr>
<td>Internal Calls</td>
<td>Yes</td>
<td>15–20% of Other</td>
</tr>
<tr>
<td>Client Calls</td>
<td>Yes</td>
<td>5–15% of Other</td>
</tr>
<tr>
<td>Design Internal Calls</td>
<td>If Design \> 0</td>
<td>Mirror of internal calls</td>
</tr>
<tr>
<td>Design Client Calls</td>
<td>If Design \> 0</td>
<td>Mirror of client calls</td>
</tr>
<tr>
<td>Dev Estimation</td>
<td>Yes</td>
<td>10–20% of Other</td>
</tr>
<tr>
<td>Design Estimation</td>
<td>If Design \> 0</td>
<td>Mirror for design</td>
</tr>
<tr>
<td>Architect oversight</td>
<td>Yes</td>
<td>Separately budgeted; 3–88h scaling</td>
</tr>
<tr>
<td>DevOps</td>
<td>Yes</td>
<td>1–4% of dev hours; bookended</td>
</tr>
<tr>
<td>Buffer</td>
<td>Yes</td>
<td>**TWO PRIMITIVES — choose one per §7.2 / Phase 2 Step 3:** **(a) PERCENTAGE BUFFER:** 2–10% of dev hours, explicit named line in Other; use when commercial structure is hour-based; default 0% (see §7.2 trigger discipline). **(b) FIXED-DOLLAR MARKUP:** above-subtotals dollar amount (e.g., Money Mate \$25,600); use when client wants fixed price floor with bounded scope; markup added at price level after the 4-bucket sum, **NOT absorbed into Other**.</td>
</tr>
<tr>
<td>KT / Handover</td>
<td>Yes</td>
<td>1–3% of Other; 0.5h–8h</td>
</tr>
</table>
**Trigger discipline for §7.1.b (CRITICAL — fixed-dollar primitive).** Apply §7.1.b ONLY when the PRD prose contains an explicit fixed-floor signal — examples: "agreed price floor", "fixed-dollar buffer", "\$X above estimated cost", or an explicitly named fixed-dollar markup figure — OR the caller specifies a fixed-dollar markup via Optional Commercial Override. Otherwise default to §7.1.a (percentage buffer, which itself defaults to 0% per §7.2). When the signal is ambiguous, surface as DECISION NEEDED — do not silently choose. Mis-firing §7.1.b on a Mobile extension or any project without an explicit fixed-floor signal is a §15 anti-pattern class error.
### 7.2 Pricing markups and discounts (observed)
<table header-row="true">
<tr>
<td>Adjustment</td>
<td>Observed values</td>
<td>When</td>
</tr>
<tr>
<td>Buffer markup</td>
<td>**DEFAULT 0%**</td>
<td>Apply non-zero ONLY when ONE of these triggers fires: **(a)** Optional Commercial Override specifies non-zero buffer, OR **(b)** PRD prose contains explicit buffer-application signal (e.g., "client agreed to risk buffer", "add X% for vendor uncertainty"), OR **(c)** scope satisfies ALL of: (i) ≥4 external vendor integrations, (ii) realtime/video/payments combination, (iii) compliance/regulatory posture — surface as DECISION NEEDED with recommendation, do NOT auto-apply. Historical precedent (Mocha 10%, TuneCore Chatbot 10%, Greater Change 12%) is reference only — do NOT apply by precedent alone. Each application must cite (a), (b), or (c).</td>
</tr>
<tr>
<td>Fixed-dollar above-subtotals markup</td>
<td>\$25,600 (Money Mate 2025 anchor)</td>
<td>Mobile extensions / bounded scope where client wants a fixed floor — applied after the base 4-bucket sum per §7.1.b. Trigger discipline per §7.1: explicit PRD fixed-floor signal OR caller Override required; otherwise default to §7.1.a.</td>
</tr>
<tr>
<td>Friends discount</td>
<td>4% (TuneCore Chatbot), 5% (SuvTV), 6% (Address Me)</td>
<td>Repeat or relationship clients</td>
</tr>
<tr>
<td>Healthcare / volume</td>
<td>8% (Aequus 1), 15% (Aequus 2)</td>
<td>Healthcare deals, anchor accounts</td>
</tr>
<tr>
<td>Equity discount</td>
<td>19% (Blended)</td>
<td>Deal includes SAFE / equity</td>
</tr>
<tr>
<td>2-week hypercare</td>
<td>Separate line (\~\$8K–\$10K)</td>
<td>Standard at launch</td>
</tr>
<tr>
<td>Monthly maintenance</td>
<td>Recurring line (\~\$8K–\$20K/mo)</td>
<td>Standalone commercial</td>
</tr>
</table>
**Order of operations:** base price × (1 + buffer markup) − discount = quoted price.
## 8. Team Planning Rules
### 8.1 Standard team compositions
<table header-row="true">
<tr>
<td>Archetype</td>
<td>Team (fractional unless noted)</td>
</tr>
<tr>
<td>Small backend / migration (≤350h)</td>
<td>1 Architect, 1 BE lead, 1 FE light, 1 QA light, 1 DevOps spike, 1 PM light</td>
</tr>
<tr>
<td>Small maintenance / bug-fix (≤300h)</td>
<td>1 BE, 1 QA, 1 PM</td>
</tr>
<tr>
<td>Small brownfield remediation (\~700–1,200h)</td>
<td>Add 1 Security/Architect spike to standard</td>
</tr>
<tr>
<td>**Consulting / Documentation / Audit (≤700h)**</td>
<td>**1 Architect, 1 PM, 1 BA lead (35–50% of dev hours), 1 per-stack engineer per audit target (light, audit-only), 1 DevOps (access + CI/CD audit). No QA discipline. No Designer. Use Cast Iorn (Vue.js + Laravel + Go audit) as anchor.**</td>
</tr>
<tr>
<td>Standard mobile MVP (\~1,000–1,500h)</td>
<td>1 Architect, 1 PM, 1 RN dev, 1 BE dev, 1 QA, 1 DevOps, 1 Analyst, 1 Designer Lead + 1 Designer + 1 Asst</td>
</tr>
<tr>
<td>Standard hybrid MVP (\~2,500–3,500h)</td>
<td>1 Architect, 1 PM, 1 Mobile lead + 1 dev, 1 FE lead + 1 dev, 1 BE lead + 2 dev, 1 QA lead + 1 QA, 1 DevOps, 1 Designer Lead + 1 Designer + 1 Asst</td>
</tr>
<tr>
<td>Large platform backlog (FTE-quarter)</td>
<td>Architect 0.3, PM 0.2, FE 0.5, BE 1.5, QA 0.5; ML 0 unless explicit</td>
</tr>
<tr>
<td>AI / RAG bot</td>
<td>1 Architect, 1 PM, 1 FE (widget), 1 BE (orchestrator), 1 AI/ML, 1 QA, 1 DevOps, 1 Designer</td>
</tr>
<tr>
<td>Healthcare / regulated</td>
<td>Standard + dedicated compliance/security architect line (+\~10%)</td>
</tr>
<tr>
<td>Multi-site Drupal / multi-brand</td>
<td>Per-site team duplicated; design assumed provided; sites parallel after foundation</td>
</tr>
</table>
### 8.2 Universal staffing rules
1. **Architect, PM, QA always present** — except in the Consulting / Documentation / Audit archetype, which has QA = 0 by design (deliverable is documentation, not code).
2. DevOps always present; flag if \< 1% of dev hours.
3. Designer Lead present whenever Design \> 0.
4. Lead premiums apply.
5. ML Engineer its own line; flag DECISION NEEDED if AI scope but ML = 0 (A13).
6. Architect and PM continuous, not phased.
7. QA ramps in back half (0.5 → 1.5 FTE from W6+ on 8-wk projects).
8. DevOps bookended (W1 + last wk).
## 9. Cost and Pricing Logic
### 9.1 Pricing build (structure)
```plain text
For each feature row:
    hours[role] × internal_rate[role] → internal_cost[row, role]
    hours[role] × client_rate[role]   → client_price[row, role]
Σ rows                                  → base internal cost, base client price
Base client price × (1 + buffer_pct)         → pre-discount price  // §7.1.a percentage buffer (default 0%)
        — OR —
Base client price + markup_dollars            → pre-discount price  // §7.1.b fixed-dollar above-subtotals markup (e.g., Money Mate $25,600); only when explicit fixed-floor signal or caller Override
Pre-discount price × (1 − discount)     → quoted client price
Quoted price + optional support lines   → total commercial offer
Margin = (quoted price − internal cost) / quoted price
```
### 9.2 Rate-card structure (Oct 2024 reference)
- Internal cost: Architect/PM \$35; Engineer (FE/BE/QA/DevOps) \$28; Lead \$30; Analyst \$40; Designer Lead \$33; Designer \$24; Designer Asst \$15.
- Client price: Architect/PM \$75; Engineer \$68; Lead \$70; Analyst \$70; Designer \$85.
- **ML/AI Engineer: internal \$50 / client \$85** (per Oct 2024 reference; CollabRE Backlog used a blended \$85 figure for the FTE-quarter model).
- Lead premiums; discipline parity (Architect = PM; FE = BE = QA = DevOps at engineer tier).
### 9.3 Alternative pricing model — FTE-quarter
For backlogs ≥ 20 weeks with rolling priorities (CollabRE Backlog).
- Blended rates: Dev \$65, ML \$85, PM/Arch \$70 (illustrative, Oct 2024).
- FTE allocation × quarterly hours × blended rate = quarterly cost.
- Lower margin (\~50%) but predictable burn.
### 9.4 Margin guardrails (observed, narrowed)
<table header-row="true">
<tr>
<td>Project shape</td>
<td>Margin range</td>
<td>Median</td>
</tr>
<tr>
<td>Small predictable (≤ 4 wks, no discount)</td>
<td>57.6%–58.9%</td>
<td>58.5%</td>
</tr>
<tr>
<td>**Consulting / Documentation / Audit (no QA, BA-led, design = 0)**</td>
<td>**55%–60%** (pure audit); **57.5%–60%** (with bounded build adjunct)</td>
<td>**\~56.5% — Cast Iorn anchor recalibrated on orphan-adjusted basis (the original 58.2% reflected a 100h marketing-site adjunct that the PRD itself flagged as a possible template residual). Apply the 55–60% band when scope is pure documentation/audit; apply 57.5–60% when scope includes a bounded build adjunct like a marketing-site line item. No Phase 2 buffer typically applied since deliverables are bounded.**</td>
</tr>
<tr>
<td>Mid-size greenfield MVP (no discount)</td>
<td>53%–56%</td>
<td>\~55%</td>
</tr>
<tr>
<td>Mid-size with moderate discount (4–8%)</td>
<td>51%–54%</td>
<td>\~52%</td>
</tr>
<tr>
<td>Mid-size with deep discount (15–19%)</td>
<td>\~50%–51%</td>
<td>\~50.5%</td>
</tr>
<tr>
<td>Large multi-quarter / FTE</td>
<td>\~50% target</td>
<td>—</td>
</tr>
<tr>
<td>**Fixed-dollar markup above subtotals (§7.1.b)**</td>
<td>**60–75% normalized**</td>
<td>**Money Mate anchor (post-markup 70.0%). A14 critical-gate widens to ±5pp around this band ONLY when the fixed-dollar markup primitive is in use (per §7.1.b trigger). Does NOT apply to projects on §7.1.a percentage buffer.**</td>
</tr>
<tr>
<td>Maintenance / monthly recurring</td>
<td>Different model</td>
<td>—</td>
</tr>
</table>
**Margin floor for non-strategic deals: 50%.** Below 50% requires written architect + Deep sign-off (A14).
## 10. Historical Examples Map
Anchor projects (incomplete — see §12 known gaps).
<table header-row="true">
<tr>
<td>Project</td>
<td>Type</td>
<td>Size</td>
<td>Reference for</td>
</tr>
<tr>
<td>AllSafe App</td>
<td>Hybrid</td>
<td>3,275h / 13 wks / \$236K</td>
<td>Large hybrid MVPs, compliance, multi-role RBAC</td>
</tr>
<tr>
<td>Blended</td>
<td>Mobile (RN + Django admin)</td>
<td>1,366h / 9 wks / \$84K</td>
<td>Standard mobile MVP, Plaid + Stripe, equity-discount</td>
</tr>
<tr>
<td>CollabRE Backlog</td>
<td>Web</td>
<td>2,943h / 26 wks / \$412K</td>
<td>FTE-quarter pricing, story-point sizing</td>
</tr>
<tr>
<td>Tunecore (LMS Migration)</td>
<td>Backend</td>
<td>346h / 4 wks / \$24K</td>
<td>Small backend migration</td>
</tr>
<tr>
<td>TuneCore Chatbot</td>
<td>Web + AI</td>
<td>1,095h / 8 wks / \$80K</td>
<td>AI/RAG builds, disposition orchestrator, 10% buffer + 4% discount</td>
</tr>
<tr>
<td>Nuriy</td>
<td>Web (brownfield)</td>
<td>1,099h / 10 wks / \$75K</td>
<td>Brownfield defect remediation, marketplace KYC + payouts + subs</td>
</tr>
<tr>
<td>SuvTV</td>
<td>Mobile + AI</td>
<td>16 wks / \$356K base</td>
<td>Mobile-heavy with Claude API, video, loyalty, 5% friends discount</td>
</tr>
<tr>
<td>Greater Change (teletherapy)</td>
<td>Web</td>
<td>\$250K / 53% margin</td>
<td>Healthcare teletherapy, 12% buffer markup, HL7/FHIR</td>
</tr>
<tr>
<td>Greater Change (AI After-Hours)</td>
<td>Web + AI</td>
<td>Distinct scope</td>
<td>AI-only assistant on top of teletherapy</td>
</tr>
<tr>
<td>Mocha Technologies</td>
<td>Hybrid</td>
<td>16 wks / \$241K</td>
<td>Largest multi-product platform, 10% buffer + 0% friends, monthly maintenance</td>
</tr>
<tr>
<td>ServiceExchange</td>
<td>Hybrid</td>
<td>18 wks / \$140K</td>
<td>Two-sided marketplace with realtime messaging</td>
</tr>
<tr>
<td>Cast Iorn</td>
<td>Web</td>
<td>6 wks / \$43K / 58.2%</td>
<td>Small predictable web, top of margin range</td>
</tr>
<tr>
<td>Snow Family Co.</td>
<td>Web</td>
<td>332h / 5 wks / \$23K / 57.6%</td>
<td>Small marketing site, no e-commerce</td>
</tr>
<tr>
<td>Aequus HQ Phase 1</td>
<td>Web</td>
<td>\$153K / 51.3% post-8%</td>
<td>Design-led greenfield with EHR + Vertex AI</td>
</tr>
<tr>
<td>Aequus HQ Phase 2</td>
<td>Web</td>
<td>\$82K / 15% discount</td>
<td>Phase-2 healthcare expansion; deepest discount</td>
</tr>
<tr>
<td>Money Mate</td>
<td>Mobile</td>
<td>8 wks / \~\$94K</td>
<td>Mobile extension of existing web, assumed-design-parity</td>
</tr>
<tr>
<td>Evental (Bug Fix + MVP) vs (Rebuild)</td>
<td>Web</td>
<td>7 wks / \$98K vs 10 wks / \$145K</td>
<td>Rebuild-vs-extend framing</td>
</tr>
<tr>
<td>ConfettiJar</td>
<td>Web</td>
<td>598h / \$42K / 52.7%</td>
<td>Shopify + Claude API, FTE-week phased</td>
</tr>
<tr>
<td>ATL Eco System Map</td>
<td>Web</td>
<td>\$74K / 53.6%</td>
<td>Multi-agent AI harvesting (4 agents)</td>
</tr>
<tr>
<td>Okkanti</td>
<td>Web (WordPress)</td>
<td>4 wks</td>
<td>Small WordPress maintenance</td>
</tr>
<tr>
<td>Stufinder</td>
<td>Mobile</td>
<td>\$89K base</td>
<td>Bug-fix + features on live apps; Sendbird tier risk</td>
</tr>
<tr>
<td>GreenTree Legal</td>
<td>Web</td>
<td>8 wks</td>
<td>Anti-pattern reference — rate card inconsistency</td>
</tr>
<tr>
<td>TriData</td>
<td>Web</td>
<td>324h / \$9.4K</td>
<td>Anti-pattern reference — #REF! sheet errors</td>
</tr>
<tr>
<td>AIT Drupal</td>
<td>Web (multi-site)</td>
<td>2,372h / 8 wks</td>
<td>Multi-site Drupal pattern</td>
</tr>
<tr>
<td>Milestone Mate</td>
<td>Web</td>
<td>1,528h / 9 wks / \$109K</td>
<td>Django + REST + Webflow marketing</td>
</tr>
<tr>
<td>WTM (MVP Build) vs (Pre-MVP)</td>
<td>Web</td>
<td>6 wks / \$90K (58.9%) vs 4 wks / \$19K (58.3%)</td>
<td>Phased commercial; small predictable band</td>
</tr>
</table>
## 11. Decision Rules
### 11.1 Project shape → estimation approach
<table header-row="true">
<tr>
<td>If shape is…</td>
<td>…then use…</td>
</tr>
<tr>
<td>New MVP, ≤ 3,500h, single release</td>
<td>Feature-hour pricing with 4-bucket model</td>
</tr>
<tr>
<td>Post-MVP backlog, ≥ 20 wks, rolling priorities</td>
<td>FTE-quarter pricing (CollabRE pattern)</td>
</tr>
<tr>
<td>Migration / integration only, ≤ 500h</td>
<td>Backend archetype; minimal Design; explicit cutover phase</td>
</tr>
<tr>
<td>Maintenance / bug-fix, recurring</td>
<td>Monthly retainer; QA-heavy mix</td>
</tr>
<tr>
<td>**Consulting / Documentation / Audit (no build, deliverable = written artifacts)**</td>
<td>**Consulting archetype (§4.1, §8.1, §9.4). Fit signals (need ≥3): project type = "Other"; QA = 0 hrs in source; Design = 0 hrs in source; BA hours ≥ 30% of dev; deliverables list contains "documentation," "audit," "review," "assessment," "playbook," or "recommendations"; no implementation work in scope. Anchor: Cast Iorn (Vue + Laravel + Go audit, 605h, 6 wks, \$42,977, 58.2% margin as-reported; \~57.0% on the 505h orphan-adjusted core scope without the 100h marketing-site line). Margin band 55–60% on pure audit scope; 57.5–60% when scope includes a bounded build adjunct like a marketing-site line item.**</td>
</tr>
<tr>
<td>AI / RAG bot</td>
<td>Add ML Engineer line; explicit RAG epic</td>
</tr>
<tr>
<td>Web + Mobile in one engagement</td>
<td>Hybrid archetype; \~25% Design; 13+ team peak</td>
</tr>
<tr>
<td>Mobile extension of existing web</td>
<td>Mobile archetype with "assumed design parity" assumption</td>
</tr>
<tr>
<td>Healthcare / fintech / edtech / safety</td>
<td>Compliance-alignment line; certification out; 8–15% discount possible</td>
</tr>
<tr>
<td>Brownfield refactor</td>
<td>Cap rework hours per screen; refactor beyond cap = change order</td>
</tr>
<tr>
<td>Brownfield defect remediation</td>
<td>Per-defect sizing; Super Admin often Figma-only — flag risk</td>
</tr>
<tr>
<td>Multi-site / multi-brand</td>
<td>Per-site team; design assumed; parallel after foundation</td>
</tr>
<tr>
<td>Marketing site only</td>
<td>Standalone — doesn't bundle with platform engagements</td>
</tr>
<tr>
<td>**No archetype satisfies ≥3 fit signals**</td>
<td>**DO NOT pick the closest archetype. Surface as DECISION NEEDED in Phase 0 and stop. The user must clarify scope shape before sizing proceeds.**</td>
</tr>
</table>
### 11.2 Missing information → required clarification
Ask about: client legal entity (before contract); contract type (before pricing); rate card version (if \> 6 mo old); discount type (if justified); auth mechanism (before sizing E2); cloud provider; hosting ownership; compliance posture; external vendor access per integration; source of design; post-launch support; accessibility target; Phase 2 commitments; margin floor.
### 11.3 Estimation red flags
- Margin \< 50% on non-strategic deal (A14).
- ML/AI in scope, no ML Engineer (A13).
- DevOps \< 1% of dev hours.
- Buffer \< 5% on project with \> 3 external integrations.
- Design = 0 on consumer-facing greenfield.
- QA \< 10% of dev hours.
- 26 wks priced via feature-hour (should be FTE-quarter).
- Single FACT claim with no source.
- #REF! errors in sheet (A10).
- Admin scope from Figma only (A4).
- Realtime/WebSocket messaging not its own epic.
## 12. Known Gaps and Conflicts
- Google Sheets unreadable via the Drive connector — numeric validation against sheets not performed; PRDs are the trusted source.
- Project enumeration uncertain — semantic search returned \~38 unique; actual count may be higher.
- Discipline-mix % is N=6 — directional, not statistical.
- Duplicate PRDs: Nuriy ×2 same project; Okkanti ×2 likely same; Greater Change ×2 distinct scopes (teletherapy + AI After-Hours).
- GreenTree Legal: rate card inconsistency (\$28 vs \$60 Arch/PM/Analyst).
- TriData: #REF! errors in sheet rollup; PRD has cleaner mini-summary numbers.
- CollabRE: ML Engineer = 0 despite F1/F2 NLP/Smart-Match needing one (A13).
- `Total cost` property is mislabeled — actually carries CLIENT PRICE.
- Rate cards from 10/29/2024 — refresh quarterly.
- Vendor cost notes (e.g. CollabRE \$1,600/run) age fast.
- No pure Data / Other / INR project sampled.
## 13. Human Review Checklist
Before quote: client entity confirmed; contract type chosen; rate card version applicable; discount confirmed; pricing model chosen; margin floor confirmed; post-launch support model; source of design; mobile/web boundary; languages; compliance posture; data migration in/out; marketing site in/out; perf/load testing in/out; live chat in/out; vendor access per integration; auth mechanism; cloud provider; hosting ownership; accessibility target; DB engine; ML staffing if AI scope; buffer ≥ 5% if ≥ 3 integrations; DevOps ≥ 1%; QA ≥ 10%; no #REF! errors; admin scope not Figma-only; realtime messaging sized as own epic; archetype fit; margin band fit; Architect/PM/QA all present; "Other" itemized; sequencing constraints respected.
## 14. Edge-Case Validation Scenarios
Reference scenarios the agent should be able to reason through using only this pack:
1. **Margin floor breach** — projected 47%; what three steps before quote and what's the only legitimate sub-50% reason.
2. **Sheet vs PRD conflict** — #REF! in sheet, clean numbers in PRD's mini-summary; which to trust (TriData precedent).
3. **Ambiguous realtime ask** — three things to confirm before sizing realtime chat; which §3.1 sub-driver.
4. **Discount math** — base \$200K + 10% buffer + 15% healthcare discount = quoted price; show order of operations.
5. **Pricing-model decision** — 22-wk post-MVP backlog with rolling priorities; which model and which anchor project.
6. **Anti-pattern detection** — Buffer = 0% with Stripe Connect + PayPal + ACH + Fairtrade Gold; name three §15 anti-patterns triggered.
7. **Spike triage** — KYC + sustainability certs + ACH payouts; name three Week-1 spikes and which discipline owns each.
8. **Property confusion** — Notion row shows Total cost \$236,687 and Internal cost \$104,775; compute margin and explain schema quirk.
9. **Scope expansion vs change order** — \$24K LMS migration becomes "while-you're-at-it" admin redesign; which §15 rule governs buffer absorption vs change order.
10. **Sequencing under block** — Auth blocked by client SSO config delay; four categories that can proceed and one that absolutely cannot.
## 15. Anti-Pattern / Lessons-Learned Library
<table header-row="true">
<tr>
<td>Code</td>
<td>Anti-Pattern</td>
<td>Observed in</td>
<td>Mitigation</td>
</tr>
<tr>
<td>A1</td>
<td>Buffer absorbing scope expansion</td>
<td>Greater Change explicit warning</td>
<td>Buffer = in-scope risk only; new scope = change order</td>
</tr>
<tr>
<td>A2</td>
<td>Soft caps on rework</td>
<td>Evental Bug Fix: "Hard 53-hr cap + change-order gate"</td>
<td>Explicit per-screen / per-feature rework caps</td>
</tr>
<tr>
<td>A3</td>
<td>Multiple sheet variants for one scope</td>
<td>Tmro R9: "lock authoritative scope at kickoff"</td>
<td>Lock one authoritative scope at kickoff; archive others</td>
</tr>
<tr>
<td>A4</td>
<td>Admin surface estimated from Figma only</td>
<td>Nuriy explicit risk</td>
<td>Request admin access W1; reserve change-order capacity</td>
</tr>
<tr>
<td>A5</td>
<td>Conditional-on-API-availability scope</td>
<td>Nuriy (Fairtrade, RJC), TuneCore Chatbot (D5/D6/D7)</td>
<td>Spike W1; explicit fallback budget</td>
</tr>
<tr>
<td>A6</td>
<td>Vendor tier cost overrun at scale</td>
<td>Stufinder (Sendbird tier)</td>
<td>Cost model includes production tier; flag as COGS</td>
</tr>
<tr>
<td>A7</td>
<td>Auth / verification URL-bypass</td>
<td>Nuriy ("vendors bypass verification by changing URLs")</td>
<td>Server-side gating always</td>
</tr>
<tr>
<td>A8</td>
<td>Live chat dropped late in scope</td>
<td>Nuriy, Okkanti, multiple</td>
<td>Confirm in/out at proposal; default OUT</td>
</tr>
<tr>
<td>A9</td>
<td>Wrong cost rate card cited</td>
<td>GreenTree Legal (\$28 vs \$60 confusion)</td>
<td>Single rate-card-version line in §0; cite by date</td>
</tr>
<tr>
<td>A10</td>
<td>#REF! errors in sheet rollup</td>
<td>TriData explicit</td>
<td>PRD review must surface; sheet hygiene audit pre-client</td>
</tr>
<tr>
<td>A11</td>
<td>Filter UX complexity scope creep</td>
<td>ATL Eco System Map ("lock filter facets in Discovery")</td>
<td>Lock facets at end of Discovery; additions = change order</td>
</tr>
<tr>
<td>A12</td>
<td>CRM integration insufficient time</td>
<td>TriData ("2 days may be insufficient")</td>
<td>Confirm specific CRM + custom mappings before sizing</td>
</tr>
<tr>
<td>A13</td>
<td>ML/AI features in scope, no ML Engineer allocated</td>
<td>CollabRE explicit</td>
<td>Auto-flag DECISION NEEDED if AI scope but ML = 0</td>
</tr>
<tr>
<td>A14</td>
<td>Margin below 50% on non-strategic deal</td>
<td>Implicit across discounted deals</td>
<td>Below 50% requires written architect + Deep sign-off</td>
</tr>
<tr>
<td>A15</td>
<td>Audit findings → scope creep into remediation</td>
<td>Cast Iorn ("Subjectivity in findings; scope creep into remediation")</td>
<td>Audit and remediation are separate engagements</td>
</tr>
<tr>
<td>A16</td>
<td>Branding-out-of-scope drift</td>
<td>Empower MS</td>
<td>Explicit branding-out boilerplate in §5.2</td>
</tr>
<tr>
<td>A17</td>
<td>Auto-detection false positives</td>
<td>Money Mate R3</td>
<td>Always pair auto-detection with user re-categorization + monitoring</td>
</tr>
</table>
## 16. Notion Schema Notes
<table header-row="true">
<tr>
<td>Property</td>
<td>Type</td>
<td>Quirk</td>
</tr>
<tr>
<td>Project name</td>
<td>title</td>
<td>—</td>
</tr>
<tr>
<td>Project type</td>
<td>select</td>
<td>Web/Mobile/ML/Data/Backend/Hybrid/Other. **No "AI" type** — AI projects are Web or Hybrid.</td>
</tr>
<tr>
<td>Year</td>
<td>number</td>
<td>—</td>
</tr>
<tr>
<td>Currency</td>
<td>select</td>
<td>USD / INR / Other. INR + Other unobserved.</td>
</tr>
<tr>
<td>Duration (weeks)</td>
<td>number</td>
<td>—</td>
</tr>
<tr>
<td>Number of features</td>
<td>integer</td>
<td>—</td>
</tr>
<tr>
<td>Total hours</td>
<td>number</td>
<td>—</td>
</tr>
<tr>
<td>Internal cost</td>
<td>number</td>
<td>Studio cost basis</td>
</tr>
<tr>
<td>**Total cost**</td>
<td>number</td>
<td>**MISLABELED — actually CLIENT PRICE, not cost.** Always interpret as price.</td>
</tr>
<tr>
<td>Margin</td>
<td>percent</td>
<td>(Total cost − Internal cost) / Total cost</td>
</tr>
<tr>
<td>Key features (list)</td>
<td>text</td>
<td>Newline-separated bullets in `<br>` tags</td>
</tr>
<tr>
<td>Summary (2-3 lines)</td>
<td>text</td>
<td>—</td>
</tr>
<tr>
<td>Tech stack used</td>
<td>multi-select</td>
<td>React, Next.js, Node.js, Python, Django, FastAPI, Flutter, RN, iOS, Android, PostgreSQL, MongoDB, AWS, GCP, Azure, Other. **Drupal is "Other".**</td>
</tr>
<tr>
<td>PRD link</td>
<td>URL</td>
<td>Points to child PRD page</td>
</tr>
<tr>
<td>Source Google Sheet</td>
<td>URL</td>
<td>Points to original sheet</td>
</tr>
</table>
Data source: `collection://bcacdbf8-05b7-49a0-9432-e7fbc47f9b23`. Row IDs start with `367b19fd-bedb-…`; child PRD page IDs start with `368b19fd-bedb-…`.
## 17. Refresh Cadence
<table header-row="true">
<tr>
<td>Component</td>
<td>Cadence</td>
</tr>
<tr>
<td>Rate cards</td>
<td>Quarterly review; refresh on update</td>
</tr>
<tr>
<td>Vendor integration cost notes</td>
<td>Quarterly</td>
</tr>
<tr>
<td>Anti-pattern library</td>
<td>Monthly; after every project closeout</td>
</tr>
<tr>
<td>Discipline-mix ranges</td>
<td>After every 5 new project closeouts</td>
</tr>
<tr>
<td>Discount and buffer markup ranges</td>
<td>After every new discount-tier deal</td>
</tr>
<tr>
<td>Feature taxonomy</td>
<td>Annual full re-extraction</td>
</tr>
<tr>
<td>Historical examples map</td>
<td>Quarterly</td>
</tr>
<tr>
<td>Notion schema notes</td>
<td>Immediately on detection</td>
</tr>
</table>
Owner: architect closing the most estimates in the quarter. v2.0 rewrite trigger: library exceeds \~75 projects.
---
*End of embedded Master Context Pack v1.0.*
