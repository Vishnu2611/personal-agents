---
name: prd-to-linear-sprint-mapper
description: Turns an approved PRD into a phase-based Linear project plan, with milestones, 0.5-2 day issues carrying acceptance criteria and dependencies, and issues paced across cycles, without adding unscoped work. Takes the PRD plus team and cycle length as input. Trigger on "map this PRD to Linear", "create the Linear sprint plan", "break the PRD into tickets and cycles".
---

# PRD to Linear Sprint Mapper

Converts a PRD into a phase-based Linear project: milestones derived from execution phases, small
issues with acceptance criteria and explicit dependencies, and cycle pacing that avoids overloading
any cycle. The PRD is the single source of truth; nothing outside it is invented.

## When to use

Use once a PRD is approved and the work has been sold, and the team needs a sprint execution plan in
Linear. Needs: the approved PRD, the Linear team, and the cycle length or team capacity. Optional: an
existing Linear project and known dependencies.

The prompt file holds three versions, newest first. V3 is V1's rules plus a parent issue per feature
with one child issue per code repo (labels `repo:fe`, `repo:be`, `repo:infra`), the API contract as
its own first backend child, and a plan-approval checkpoint before anything is created. V2 is four
prompt variants (structured, PM/engineering lead, minimal, agile) written for a Notion "Linear PRD
Implementer" agent, using `{{PLACEHOLDERS}}` for project name, team and cycle duration. V1 is a
standalone detailed spec (0.5-2 day issues, acceptance criteria, P0/P1/P2 priority, dependencies,
cycle distribution), which matches the page description. V1 contains example values (Brand Merger
Project, Brand Merger Team, 7 weeks) that must be replaced with the real project, team and cycle
duration before use.

## Not for

Deciding what to build, writing the PRD, estimating it, or writing code. Features that are not in the
PRD do not get tickets. For the PRD itself, use the PRD generator in rs-scoping; for implementing the
features, see rs-delivery.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-project-management/prompts/prd-to-linear-sprint-mapper/current/prd-to-linear-sprint-mapper-v3.md`).
Ask the user for any required inputs it lists before starting. Use **V3** when the project has more
than one code repo (read the repos and roles from `docs/agents/project-context.md` when it exists, or
ask); otherwise default to the V1 spec. Use a V2 variant when the user is driving the Notion Linear PRD
Implementer agent or asks for that style. Do not use the page-properties block as instructions.
