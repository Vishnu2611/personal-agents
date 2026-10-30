---
name: PRD → Linear Sprint Mapper
notion_page_id: 978c3737b62a48c2ab3da12ad3ade6a3
notion_url: https://app.notion.com/978c3737b62a48c2ab3da12ad3ade6a3
version: 3
status: In Testing
pulled_on: 2026-06-29
---

# 🗺️ PRD → Linear Sprint Mapper

> Page properties (from Notion):
> - **Benefit:** 2 people 2 weeks working 8 hours a day to create sprint execution plan from prd. Now its 2 people 2 days 8 hours a day.
> - **Category:** Delivery Ops
> - **Cost Estimate per Run:**
>   - Estimate: $0.48
>   - Model: Claude Sonnet 4.5
>   - Pricing assumption: $3/M input tokens, $15/M output tokens
>   - Token band: Heavy
>   - Token estimate: ~60k in / 20k out
> - **Description:** Converts a PRD into a phase-based Linear project plan with 0.5–2 day issues, acceptance criteria, dependencies, and cycle pacing—without adding unscoped work.
> - **Downstream:** Terminal — hands off to Linear / delivery execution
> - **Function:** Delivery / PMO, Engineering, Product
> - **Inputs Required:**
>   - Approved PRD
>   - Team capacity / cycle length
>   - Optional: existing Linear project, known dependencies
> - **Latest Version:** 3
> - **Name:** PRD → Linear Sprint Mapper
> - **Outcome Type:** Productivity
> - **Outputs Produced:**
>   - Phase-based Linear project plan
>   - 0.5-2 day issues with acceptance criteria and dependencies
>   - Destination: Linear project (created/updated)
> - **RS Business Unit:** Product Studio
> - **Status:** In Testing
> - **Time Savings Or Value:** Time Savings
> - **Type:** Notion Agent
> - **Upstream:** https://app.notion.com/p/13fafadaa12e4c7dba3cf053dfde2696

---

# V3.0

> V3 = V1's rules (milestones, 0.5–2 day issues, acceptance criteria, P0/P1/P2, dependencies, cycle
> pacing, no invented scope) plus a **parent + one-child-per-repo** ticket shape for projects split
> into frontend, backend and infra repos. Use it whenever the project has more than one code repo.

Read the approved PRD (and the Technical Design, when supplied) and create a structured Linear
project whose tickets match how the code is split across repos.

**Project Name:** [project]
**Team:** [Linear team]
**Ticket prefix:** [e.g. COM]
**Cycle Duration:** [weeks]
**Repos and roles:** [e.g. compass-fe (fe), compass-be (be), compass-infra (infra) — from
`docs/agents/project-context.md` when present]

## Ticket shape

For every PRD feature:

1. **One parent issue** — `Feature: <PRD feature name>`. Label `feature`. Description: link to the
   PRD feature block (Notion URL), the feature's acceptance criteria as listed in the PRD, and the
   list of its child issues. The parent carries no implementation work; it closes when every child is
   done. Later, `/to-spec` may post the agreed spec on it.
2. **Child issues, per repo that has work for the feature** — created as sub-issues of the parent.
   Each child:
   - is labelled with exactly one of `repo:fe`, `repo:be`, `repo:infra`, plus `feature`/`bug`/`chore`;
   - is titled `[fe] …`, `[be] …` or `[infra] …`, with one clear outcome;
   - is 0.5–2 days of work — split a repo's part into several children (all with that repo's label)
     when it is bigger;
   - lists only the acceptance criteria that repo makes true, and names the sibling children that
     cover the rest;
   - ends with the branch name to use: `feat/<ID>-<short-slug>`.
3. **API contract first.** When a feature adds or changes an API, the first `repo:be` child is
   `[be] Update API contract: <feature>` (the contract file, not the implementation). `repo:fe`
   children depend on that contract child, **not** on the backend implementation, so frontend and
   backend build in parallel against the agreed contract.
4. **Infra before use.** A `repo:infra` child that creates something other repos need (a table, a
   bucket, a queue, a secret) blocks the children that use it.

Work that belongs to no single repo (design, content, release QA, client UAT) gets no `repo:` label;
tag it by function (`Design`, `Content`, `QA`) as in V1's Ownership Hinting.

## Milestones, dependencies, cycles

As V1: milestones from delivery phases, explicit dependencies (including the contract and infra rules
above), cycles balanced by dependency order, milestone sequence and effort, never overloaded. Merge
order within a feature is infra → backend → frontend; reflect it in the dependencies.

## Before creating anything

Present the plan for approval first: the milestone list, then per feature the parent with its
children (repo label, title, estimate, dependencies), then the cycle allocation. Create or update the
Linear project only after the human approves. Use the PRD as the single source of truth; do not invent
features, and tag anything missing as `PRD GAP:` instead of guessing.

---

# V2.0

> *This document outlines how to automate the conversion of Notion PRDs into Linear tasks using a custom agent. Install the Linear PRD Implementer from the Notion agent section by searching for it and setting it up. In the agent settings, connect your Linear account and grant access to the relevant PRD page with appropriate permissions. Once configured, use any of the prompts provided below based on your use case to trigger the automation. Upon execution, the Notion agent will create well-structured tasks in Linear, including milestones, descriptions, and acceptance criteria if available. This ensures a streamlined and consistent workflow from PRD to execution.*

## **Structured & Explicit**

**A detailed, structured prompt for creating a Linear project with logical milestones, granular issues, and strict cycle planning rules to prevent overloading.**

```javascript
@Linear PRD Implementer
Read this Notion PRD and create a fully structured Linear project with the following instructions:

Project Name: {{PROJECT NAME}} 
Team: {{Linear TEAM NAME}}

Milestones: Extract logical milestones from the PRD (e.g., Design Complete, Backend Ready, QA Sign-off, Launch). Create each as a named milestone in Linear with associated issues grouped beneath it.


Cycles: Split all issues across cycles of {{CYCLE DURATION}} weeks each. Assign issues to cycles based on milestone order and estimated effort - earlier milestones go into earlier cycles.


Issues: For each milestone, break down the work into granular, actionable issues with clear titles, descriptions, labels (feature/bug/chore), and priority.


Cycle Planning Rule: Do not overload any single cycle. If a milestone spans more than  {{CYCLE DURATION}}  weeks of work, split it across consecutive cycles.
Use the PRD content above as the single source of truth.

Cycles have already been created for the team, please use them to organize tasks by adding or updating them accordingly.
```

---

## **PM/Engineering Lead Tone (Detailed)**

#### A highly detailed prompt for creating a production-ready Linear project, focusing on identifying 3–5 key delivery milestones, strict dependency management, and conservative capacity planning (70–80%).

```javascript
@Linear PRD Implementer
Transform this Notion PRD into a production-ready Linear project. Follow these exact specifications:
Project Setup
- Project Name: {{PROJECT NAME}} 
- Assigned Team: {{Linear TEAM NAME}}

Milestone Structure
- Parse the PRD and identify 3–5 key delivery milestones
- Name them clearly (e.g., "M1: Discovery & Design", "M2: Core Backend", "M3: Frontend Integration", "M4: QA & Hardening", "M5: Launch")
- Attach relevant issues to each milestone

Cycle Planning
- Each cycle = {{CYCLE DURATION}} weeks
- Assign issues to cycles in priority + dependency order
- Aim for 70–80% capacity per cycle (leave buffer for unplanned work)
- Issues that depend on earlier work must not be scheduled before their dependencies

Cycles have already been created for the team, please use them to organize tasks by adding or updating them accordingly.

Issue Quality
- Each issue should have: title, description, label, priority (High/Medium/Low), and milestone assignment
- Epics or large tasks should be broken into different task
Treat this PRD as the complete spec. Do not invent features not mentioned in the document.

```

---

## **Minimal & Fast (for quick iteration)**

#### A concise and fast-iteration prompt for creating a Linear project, focusing on balancing workload (no more than ~8–10 issues per cycle unless small), concise issue descriptions

```javascript
@Linear PRD Implementer

From this PRD, create a Linear project:
- Name: {{PROJECT_NAME}}
- Team: {{TEAM_NAME}}
- Create milestones based on the phases/features described in the PRD
- Create issues for each milestone with clear titles, labels, and priorities
- Spread issues across {{CYCLE_DURATION}}-week cycles in logical order (respect dependencies). Add or update tasks to classify cycles accordingly.
- Balance workload — no more than ~8–10 issues per cycle unless they are small tasks
Keep issue descriptions concise but actionable. Flag any ambiguous requirements from the PRD as "Needs Clarification" issues.
Cycles have already been created for the team, please use them to organize tasks by adding or updating them accordingly.
```

---

## **Agile Planning Prompt**

An Agile-focused prompt that instructs the agent to act as a delivery agent, emphasizing the derivation of Epics/user stories, estimation, ensuring cycles have clear goals, and adding acceptance criteria and PRD references to all tasks.

```javascript
@Linear PRD Implementer
You are an Agile delivery agent.

Context:
- PRD: {{PRD_URL}}
- Project: {{PROJECT_NAME}}
- Team: {{TEAM_NAME}}
- Cycle Duration: {{CYCLE_DURATION}} (default 2 weeks)

Steps:
- Create a Linear project "{{PROJECT_NAME}}" under "{{TEAM_NAME}}".
- Derive Epics (Milestones) from the PRD.
- Break Epics into user stories / tasks.
- Estimate and distribute tasks into cycles of {{CYCLE_DURATION}}.
- Add or update tasks to classify cycles accordingly.
- Ensure each cycle:
- Has clear goals
- Contains cohesive work
- Respects dependencies
- Add acceptance criteria for each task.
- Include PRD reference in all tasks.

Rules:
- No vague tasks
- No oversized tasks
- Maintain cycle continuity

Deliverable:
A cycle-wise planned Linear project with milestones and well-defined tasks.
Cycles have already been created for the team, please use them to organize tasks by adding or updating them accordingly.
```

Note:
If any step is missing, please prompt again with specific details on what is needed. The agent will continue from the previous flow.

---

# V1.0

Read this PRD and create a fully structured Linear project.

**Project Name:** [Brand Merger Project]
**Team:** [Brand Merger Team]
**Cycle Duration:** [7 weeks]

## Milestones

Derive milestones based on execution phases, not just sections.
Use logical delivery stages such as:

- Infrastructure Ready
- Design Complete
- CMS & Migration Complete
- Core Pages Built
- QA & SEO Complete
- Launch

Each milestone must contain only related issues.

## Issues

Break work into granular issues with the following rules:

- Each issue should represent 0.5–2 days of work
- One clear outcome per issue
- No vague tasks (e.g., "build homepage" is invalid)

Each issue must include:

- Title
- Description (clear scope)
- Acceptance Criteria (Definition of Done)
- Labels: feature / bug / chore
- Priority: P0 (blocker), P1 (core), P2 (secondary)

## Dependencies

Explicitly define dependencies between issues where relevant.
Example:

- "Build homepage" depends on "Define homepage routing"

## Cycles

Distribute issues across cycles based on:

- Dependency order
- Milestone sequence
- Effort balance

Do NOT overload cycles.
If a milestone exceeds one cycle, split it logically.

## Ownership Hinting (Optional)

Tag issues by function:

- Design
- Development
- Content
- SEO

Use the PRD as the single source of truth.
Do not invent features not present in the document.
