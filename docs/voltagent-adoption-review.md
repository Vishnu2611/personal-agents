# VoltAgent → RightShift Skills: Adoption Review

What to adopt from [`VoltAgent/awesome-claude-code-subagents`](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) into our existing skills, the improvement it brings, how it improves the output, and a concrete example.

> **Mechanism note:** VoltAgent files are *subagents*, not skills. There is no "sub-skill" nesting. The realistic move is to **borrow the concrete artifacts** (checklists, taxonomies, output formats) into each skill's `resources/` as a reference file the `SKILL.md` points to — cherry-picked, not wholesale. Pin a commit and keep the MIT attribution.

> **Honest signal — read the Priority column.** Most VoltAgent *role* agents (business-analyst, product-manager, qa-expert) are generic boilerplate (`Context Assessment → Discovery → Implementation → Excellence`) and add little. The *task* agent **`backlog-grooming`** is the standout with genuinely reusable content. Priorities below reflect that.

## Adoption table

| Our skill | Adopt from (VoltAgent) | Priority | Improvement it brings | How it improves the output | Concrete example |
|---|---|---|---|---|---|
| **brd-generator** | `business-analyst` | **Low–Med** | Metric-anchored objectives; explicit stakeholder + value framing | Borrow the "measurable business value" orientation: force every objective to carry a baseline → target metric instead of a prose goal | Objective "Improve onboarding" → **"Cut median time-to-first-value from 3 days to 4 hrs (−94%)"** with owner + measure |
| **prd-generator** | `product-manager`, `ux-researcher` | **Medium** | Prioritized, user-need-linked feature specs | Add a per-feature **priority (MoSCoW)** and **primary persona + user need** line; borrow acceptance-criteria discipline | Feature row gains `Priority: Must · Persona: Field tech · Need: works offline` — makes Section 10 complexity ratings defensible |
| **estimation-generator** | **`backlog-grooming`** | **HIGH** ⭐ | Consistent sizing rules + a pre-estimate readiness gate + auto-split of oversized items | Adopt its **Estimation Methods** (Fibonacci/T-shirt), **Definition-of-Ready** checklist as a gate, and the "13+ = break it down" splitting rule mapped to man-days | A 34-day "Payments" line is **flagged "too big → split: Card / Wallet / Refunds"** and blocked from sizing until acceptance criteria exist |
| **technical-design-generator** | `architect-reviewer`, `api-designer`, `database-optimizer` | **Medium–High** | Richer Component/Build Inventory → more accurate estimates | Add an **API-surface table** (method/path/auth/pagination/error model) and a **scalability + indexing** checklist to the inventory | Inventory gains an "API endpoints" table (8 rows) + "needs composite index on `orders(user_id, created_at)`" — surfaces build items estimation would have missed |
| **test-planner** | `qa-expert` | **Medium** | Broader coverage dimensions + explicit risk scoring | Expand the **Test Coverage Matrix** to include non-functional rows (performance, security, accessibility) and a per-feature **risk = H/M/L** column | Matrix for "Checkout" adds `Perf (H)`, `Security (H)`, `A11y (M)` rows instead of functional-only |
| **test-case-generator** | `test-automator`, `ui-ux-tester` | **Medium** | Better automate-vs-manual tagging; cleaner Gherkin | Add an **automation-suitability rule** per case (stable + data-driven → automate; exploratory/visual → manual) and Gherkin best-practice patterns | Case tagged **`Automate (data-driven, stable API)`** vs **`Manual (visual regression)`** — sharpens the Gherkin handoff |
| **prd-linear.md** *(in progress)* | `backlog-grooming`, `scrum-master`, `project-manager` | **Medium** | Issues meet Definition-of-Ready; cycle capacity respected | Gate each generated issue against the **DoR checklist** before creation; borrow velocity/cycle-pacing framing for scheduling | Before creating a Linear issue, verify `acceptance criteria + estimate + dependencies` present — else flag, don't create |
| **d2-diagrams** | — | **None** | No relevant subagent | n/a | n/a |

## Highest-leverage pick

**`backlog-grooming` → `estimation-generator`.** It's the one VoltAgent file with concrete, directly reusable content, and it maps onto the estimate work we just did (the estimation-scale caveat, sizing discipline). Two artifacts are worth lifting verbatim into `src/plugins/rs-scoping/skills/estimation-generator/resources/`:

1. **Definition-of-Ready checklist** — used as a *gate*: a feature can't be estimated until it has clear/testable acceptance criteria, resolved dependencies, and fits a sprint.
2. **"Too big → break it down" rule** — their "13+ points = epic, split it" becomes "> N man-days = split into sub-features before sizing," preventing giant unestimatable line items.

## How adoption works (per skill)

1. Create `src/plugins/<plugin>/skills/<skill>/resources/voltagent-<agent>.md` containing only the cherry-picked section(s).
2. Add attribution header: source repo, file path, MIT, pinned commit SHA.
3. Reference it from `SKILL.md` (e.g. "Apply the Definition-of-Ready gate in `resources/voltagent-backlog-grooming.md` before estimating").
4. Adapt wording to RightShift conventions (man-days, our template, Notion/Linear) — don't paste generic prose that dilutes the skill's specificity.

## Caveats

- Vendor-neutral by policy → **no Notion / Linear / xlsx** knowledge; you keep all integration specifics.
- Repo updates frequently → **pin a commit** when borrowing.
- Don't bulk-import — generic role prompts will **bloat context and blur** your tightly-scoped skills.
