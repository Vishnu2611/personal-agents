# Issue tracker: the project's ticketing system (Linear, Jira or Asana)

Issues and specs for this project live in the same ticketing system `rs-delivery:ticket-intake` reads
tickets from. Use that system's MCP server (the `rs-delivery` plugin ships connections for all three:
`linear-server`, `atlassian`, `asana`; see `ticket-intake`'s SKILL.md for setup and authentication).

**This project:** <Linear | Jira | Asana>, team/project `<KEY or name>`. ← fill in once per project.

## Conventions

- **Where:** the team/project above. A spec or ticket created for an existing ticket goes in that
  ticket's team/project and links back to it (Linear: related/sub-issue; Jira: "relates to" link or
  sub-task; Asana: subtask or a link in the description).
- **Labels:** use the label strings in `triage-labels.md`. If the label does not exist yet, create it
  once in the tracker rather than skipping it.
- **Body:** markdown. Keep the spec's own headings; do not paste code or file paths into a spec.
- **Tickets with dependencies:** use the tracker's native blocking relation (Linear "blocked by",
  Jira "is blocked by", Asana dependencies). Fall back to a `Blocked by: <ID>, <ID>` line at the top of
  the body only where the tracker has none.

## Tickets for an rs-delivery feature (`/to-tickets`)

When `/to-tickets` runs on a feature that has `specs/<feature-slug>/tasks.md` (from
`rs-delivery:spec-generator`), the tickets **group those tasks**; they do not re-plan the work:

- Every `tasks.md` task belongs to exactly one ticket. Each ticket body lists the task numbers it
  covers (e.g. `Tasks: 1–3`) and the test seams those tasks use, from `design.md`'s `## Test seams`.
- A ticket is still a tracer-bullet vertical slice, sized for one agent session. Blocking links follow
  the task order: a ticket is blocked by the tickets holding the tasks it builds on.
- Context pointers, not copies: the ticket names `specs/<feature-slug>/` and the parent `/to-spec`
  issue. A ticket that touches UI also names `Feature Designs/<feature-slug>.md` and
  `Design Guidelines/design-system.md` **and** quotes, inline, the `## Design` subsection and tokens
  and the `## Accessibility` requirements for its slice.
- Implementers build each ticket's tasks in order with `tdd`, at those seams only.

## When a skill says "publish to the issue tracker"

Create an issue in the team/project above via the MCP server, linked to the originating ticket if
there is one (its ID is in `Ticket Briefs/<ID>.md`), with the labels the skill asks for. Report the
new issue's ID and URL. `rs-delivery:spec-generator` reads a `/to-spec` spec from there.

## When a skill says "fetch the relevant ticket"

Read the issue via the MCP server: title, description, labels, links, and comments. The human
normally gives the ID or URL. Prefer an existing `Ticket Briefs/<ID>.md` when one is present and
current.

## Wayfinding operations

Used by `/wayfinder`. The **map** is one parent issue; **child** tickets are its sub-issues
(Linear sub-issues, Jira sub-tasks or child issues, Asana subtasks).

- **Map**: a parent issue labelled `wayfinder:map` holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: a sub-issue of the map, labelled `wayfinder:<type>`
  (`research`/`prototype`/`grilling`/`task`).
- **Blocking**: the tracker's native blocking relation, as above.
- **Frontier**: open children of the map with no open blocker and no assignee; first in map order wins.
- **Claim**: assign the ticket to the driving developer before any other write.
- **Resolve**: comment the answer, close the ticket, then append a context pointer (gist + link) to
  the map's Decisions-so-far.
