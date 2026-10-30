---
name: ticket-intake
description: Pull one ticket (Linear, Jira, or Asana) via MCP into a normalized Ticket Brief that seeds the /grill-with-docs design interview. Trigger on "start on ticket ...", "pick up <ID>", or "work this issue".
---

# Ticket Intake

Turns one ticket into a **Ticket Brief** — a normalized markdown file the rest of
the pipeline (the `/grill-with-docs` interview, then `/to-spec`, then `rs-delivery:spec-generator`,
then `/implement` or `/implement-spec`) can start from without re-reading the ticketing
tool. `/to-spec` turns the agreed design into a spec on the tracker; that spec plus
this Ticket Brief together become spec-generator's Input P-alt, which produces the
`tasks.md` that `/implement` or `/implement-spec` builds from. This is the only stage in
the pipeline that talks to the ticketing system on the way in.

## Prerequisites

Needs a ticketing MCP server connected for whichever system is chosen at Step 1:

| System | Claude Code | claude.ai / Desktop | Managed Agents |
| --- | --- | --- | --- |
| **Linear** (default suggestion) | `claude mcp add --transport http linear-server https://mcp.linear.app/mcp` | Settings → Connectors → Linear (OAuth) | `mcp_toolset` for Linear, same shape as this repo's Notion toolset (`src/orchestrator/pipeline.yaml`) |
| **Jira** (Atlassian Rovo) | `claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp/authv2` | Settings → Connectors → Atlassian/Jira (OAuth) | `mcp_toolset` for Atlassian |
| **Asana** | `claude mcp add --transport http asana https://mcp.asana.com/v2/mcp` | Settings → Connectors → Asana (OAuth) | `mcp_toolset` for Asana |

If a tool call fails with an auth error, run that server's authentication flow once (look for an
`authenticate`/`complete_authentication` tool pair for it), then retry. Don't silently fall back to
asking the human to paste ticket text — only do that if no ticketing MCP is configured at all for the
chosen system, and say so explicitly.

## How to run

1. **Ask which ticketing system and which ticket, every time.** If `docs/agents/project-context.md`
   (or `docs/agents/issue-tracker.md`) names the project's tracker, suggest that one instead of the
   default and confirm it (`"Linear project Compass, ticket COM-14 — is that right?"`). Default *suggestion* is Linear
   (`"Linear, ticket <ID> — is that right?"`), but never assume silently, even if the last run used
   Linear. Linear, Jira, and Asana all have real adapters (see Prerequisites) — if the human names a
   system with no MCP connected yet, walk them through the matching connection step above rather than
   failing silently or falling back to Linear. If the human gives a ticket URL instead of an ID,
   extract the ID from it.
2. **Fetch the ticket** via the connected MCP for the chosen system — title, description, acceptance
   criteria (a labeled section or checklist, if present), labels, priority, project/epic, and any
   linked documents or ticket URLs. Field names differ per system (e.g. Jira's "Acceptance Criteria"
   custom field vs. Linear's description checklist vs. an Asana subtask list) — map whichever
   equivalent that system actually offers into the same brief shape in Step 4; don't leave a field
   blank just because the source system's structure differs from Linear's. If ToolSearch is needed to
   discover the exact tool names for the chosen system in this session, search for the system's name
   (`"linear"`, `"atlassian"`/`"jira"`, or `"asana"`).
   If the ticket has a **parent** (a child ticket for one repo of a larger feature), fetch the parent
   too: the agreed spec from `/to-spec` usually lives on the parent. Record both IDs.
3. **Gate — required fields present.** Title and description are required; stop and ask the human to
   fill the gap in the ticketing tool (or supply it directly) rather than inventing acceptance criteria
   that aren't in the ticket. Tag anything genuinely ambiguous as `TICKET GAP:` instead of guessing.
4. **Normalize and write the brief.** Save to `Ticket Briefs/<TICKET-ID>.md`: ticketing system, ticket
   ID + URL, title, description, acceptance criteria (as a checklist — convert prose criteria into
   discrete checkable items if the source only has prose), labels/priority/project, linked docs, and a
   `TICKET GAP:` section listing anything unresolved. When the ticket has a parent, add its ID, URL and
   spec. When `docs/agents/project-context.md` exists, add a **Project context** section linking the
   Notion pages that bear on this ticket (usually the PRD section for the feature and the technical
   design), read through the Notion MCP. Link them, don't paste them. One file per ticket; overwrite on re-run of the
   same ticket ID rather than accumulating duplicates. The system-specific source is recorded but the
   brief's shape is identical regardless of which system it came from — nothing downstream needs to
   know or care which ticketing tool was used.
5. **Hand off, don't orchestrate.** State the brief's path out loud, tell the human the next step is
   to type **`/grill-with-docs`** (the design interview, from the `mattpocock-skills` plugin), and
   stop. Only the human can start it; don't invoke it and don't recreate it with the `grilling` /
   `domain-modeling` skills.

## Inputs you need from the user

- **Required:** which ticketing system (confirm even when defaulting to Linear), and the ticket ID or
  URL.
- **Optional:** anything the ticket itself is missing (acceptance criteria, priority) if the human
  wants to supply it directly instead of editing the ticket.

## Output

`Ticket Briefs/<TICKET-ID>.md` — the normalized brief. Downstream, the `/grill-with-docs`
interview settles the design and `/to-spec` posts it to the tracker as a spec; the brief and that
spec together become `rs-delivery:spec-generator`'s
Input P-alt (single-feature branch) — producing the `requirements.md`/`design.md`/`tasks.md`
that implementation builds from. Later, `rs-delivery:ship-with-ticket` reads the same
ticket ID back out of this brief to link the PR.
