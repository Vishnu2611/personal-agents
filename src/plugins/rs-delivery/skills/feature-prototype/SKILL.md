---
name: feature-prototype
description: HARD GATE — after a feature-design-brief is approved and before any implementation starts, build a clickable local prototype (static HTML file or Claude Artifact) of the feature and get the human's explicit accept/reject verdict. No implementation (/implement, /implement-spec) may start for this feature until this skill records APPROVED. Trigger on "prototype this feature", "show me a mockup I can click through", or automatically once a feature-design-brief's human checkpoint (Step 3) is resolved.
---

# Feature Prototype

Sits between an approved `Feature Designs/<slug>.md` brief and implementation.
A written brief — flow diagram, per-state prose, tokens cited — can still hide
a flow that doesn't feel right once it's actually on screen and clickable.
This skill closes that gap with a throwaway, static prototype the human can
click through, and makes their acceptance of it a hard gate: **implementation
does not start for a feature until this skill has recorded an APPROVED
verdict for it.**

**Altitude rule:** this is a disposable visual/interaction check, not a first
draft of the real implementation — no state management library, no real API
calls, no build step, no auth, no persistence beyond in-memory JS. Fake data
only. If it would take longer to build than the real feature, it's over-built
— strip it back to what's needed to see and click through every state in the
brief.

## Prerequisites

- `Feature Designs/<feature-slug>.md` (from `rs-delivery:feature-design-brief`)
  must exist and have been through its Step 3 human checkpoint — every
  `DECISION NEEDED:` item resolved or explicitly accepted as a carried risk.
  If the brief doesn't exist yet, stop and run `feature-design-brief` first —
  don't prototype from an unapproved brief.
- `Design Guidelines/design-system.md`, for tokens (palette, type, spacing) so
  the prototype reads like the real product rather than a generic wireframe.

## How to run

### 0. Reuse an earlier approved prototype, if there is one

On client projects the Product Owners often build clickable prototypes from the PRD before delivery
starts, and the client approves them (the `rs-prototype` plugin's generators, then a design pass in
Figma). If this feature was already prototyped and approved that way, don't build it again. Instead:

1. **Find the evidence.** Ask the human for the link to the approved prototype (or Figma frame) and to
   the approval itself — an email, a Notion comment, meeting notes, a recorded sign-off. No evidence
   link, no reuse: go to step 1 and build.
2. **Check coverage.** Compare the brief's `## Flow` and `## Design` states with what the earlier
   prototype shows. List the states it covers and the ones it doesn't (states added in the brief, edge
   or error states the prototype skipped).
3. **Confirm with the human.** *"`<feature>` was approved as `<link>` by `<who>` on `<date>`
   (`<evidence link>`). It covers: <states>. It does not cover: <states>. Record that approval for
   the covered states?"* Only an explicit yes counts.
4. **Uncovered states still need this gate.** If any state is uncovered, build a prototype of just
   those states (steps 1–3) and get it accepted too. The earlier approval alone never clears a brief
   with uncovered states.
5. **Record it** in step 4's format with the extra lines:

   ```markdown
   ## Prototype Approval
   Prototype: <link to the earlier approved prototype or Figma frame>
   Verdict: APPROVED
   Approved: <date of the original approval>
   Approved by: <name and role, e.g. Steve (client)>
   Evidence: <link to the sign-off>
   Scope: earlier approval covers <states>; <"all states in this brief" or "remaining states approved via <new prototype link> on <date>">
   ```

### 1. Pick the surface

Prefer a **Claude Artifact** when the Artifact tool is available in this
session (claude.ai, Claude Desktop, Claude Code with Artifacts enabled) — the
human can open and click through it immediately with nothing to check out
locally. If Artifacts aren't available in this session, write a single
self-contained static HTML file (inline CSS/JS, no external build step or
network calls) to `Prototypes/<feature-slug>.html` at the target repo's root
(create the folder if needed). State out loud which surface was used and why.

### 2. Build every state from the brief

Read `Feature Designs/<feature-slug>.md`'s `## Flow` and `## Design` sections
and render every state it describes — happy path, edge/error states,
empty/loading — as views the human can switch between inside the one file or
artifact (tabs, buttons, or a simple state switcher; whatever's simplest).
Use `design-system.md`'s actual tokens (palette, type scale, spacing,
component shapes) so it visually resembles the real product. Fake data only —
hardcoded or a small in-memory JS array, never a real backend call.

Anything still tagged `DECISION NEEDED:` in the brief must stay visible *in
the prototype itself* (a small inline badge/callout on the affected state) —
don't silently resolve it just because a concrete choice was needed to render
something on screen.

### 3. Hard gate — explicit human acceptance, every round

Present the prototype (artifact URL, or the file's path with instructions to
open it in a browser) and ask literally:

*"Here's the clickable prototype for `<feature>` — `<artifact URL or file
path>`. Walk through every state and tell me: **accept as-is**, **accept with
changes** (list them), or **reject and revise**. I will not start
implementation on this feature until you accept it."*

Do not treat silence, a vague "looks fine," or your own judgment that it's
good enough as acceptance. If changes are requested, revise the same
file/artifact in place (redeploy to the same URL, don't mint a new one) and
ask again — a partial or conditional approval does not clear the gate; every
requested change must be applied and re-confirmed before moving on.

### 4. Record the verdict

Once accepted, append to `Feature Designs/<feature-slug>.md`:

```markdown
## Prototype Approval
Prototype: <artifact URL, or Prototypes/<feature-slug>.html>
Verdict: APPROVED
Approved: <date>
```

This section is what Step 5 of `feature-design-brief` (and the
`rs-guard` PR hook) checks for before implementation for this feature
starts or ships. Never write `APPROVED`
without the explicit verdict from Step 3 above — this is the one line
standing between "looks good" in conversation and implementation actually
starting.

### 5. Hand off — explicitly, not by assumption

State that `<feature>` is now clear for implementation and that
`feature-design-brief`'s Step 5 hand-off can proceed: the human types
`/implement specs/<feature-slug>/` (one slice) or `/to-tickets` then
`/implement-spec` (several slices). Those are human-typed `mattpocock-skills`
commands — don't start them yourself, same convention as
`feature-design-brief`'s own hand-off.

## Inputs you need from the user

- **Required:** an explicit accept / accept-with-changes / reject verdict on
  the prototype, every round — no default, no inferred approval. When reusing an
  earlier approval (step 0): the evidence link and an explicit yes to record it.
- **Optional:** a preferred surface (Artifact vs. static HTML) if not already
  obvious from the running client; specific changes during a revise round.

## Output

`Prototypes/<feature-slug>.html` (static-HTML path) or a Claude Artifact URL
(Artifact path), plus an updated `Feature Designs/<feature-slug>.md` carrying
a `## Prototype Approval` section with an `APPROVED` verdict. Downstream,
implementation for this feature (`/implement`, `/to-tickets`,
`/implement-spec`) must confirm that section shows `APPROVED` before starting — a brief with no Prototype
Approval section, or one still short of `APPROVED`, blocks implementation.
