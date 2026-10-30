---
name: feature-design-brief
description: Use when a feature has an approved spec but no written-down flow, look, or reachability yet — within rs-delivery's branches, after rs-delivery:spec-generator produces that feature's requirements.md/design.md and before /implement or /implement-spec builds its tasks.md; used standalone outside rs-delivery's branches, after /to-spec produces a spec. Trigger on "design this feature", "spec this out visually", "where should this live in the UI", or automatically once a feature's spec is approved and it touches any UI.
---

# Feature Design Brief

One brief per feature, produced after spec and before implementation. Closes
the gap where a feature gets built from prose acceptance criteria alone, with
its look, its flow, and where a user actually finds it left implicit until
someone notices in review. Skip only for features with zero UI surface
(pure backend/API/data work) — say so explicitly rather than silently
producing an empty brief.

This brief alone does not clear a feature for implementation — Step 4 below
hands off to `rs-delivery:feature-prototype`, a hard gate that requires the
human to accept a clickable prototype before any implementation starts.

**Altitude rule:** doesn't decide the final visual polish alone — grounds every
decision in `Design Guidelines/design-system.md` (run `rs-delivery:design-guidelines`
first if that file doesn't exist yet) and in real reference examples, and
flags anything genuinely undecided as `DECISION NEEDED:` rather than guessing.

## Prerequisites

- `Design Guidelines/design-system.md` must exist. If missing, stop and run
  `rs-delivery:design-guidelines` first — don't invent tokens ad hoc for
  one feature.
- An approved spec for this feature — within rs-delivery's branches, that
  feature's `requirements.md` + `design.md` from `rs-delivery:spec-generator`;
  used standalone outside rs-delivery's branches, the approved `/to-spec`
  spec for this feature (from the `/grill-with-docs` interview) instead.
- `frontend-design` skill, and whichever Vercel skills fit the stack
  (`vercel:react-best-practices`, `vercel:nextjs`, `vercel:shadcn`) — the
  Visual-Design hat below loads these. If the Bencium UX Designer plugin is
  installed, the Visual-Design hat uses it too; otherwise it applies the same
  discipline manually (ask before deciding, don't default silently).

## How to run

### 1. Put on three hats — fan out, don't do it serially

Dispatch three subagents in parallel, each scoped to one concern. **Paste**
the spec section text and `design-system.md`'s contents into each hat's
prompt — not just their file paths — since these are separate subagents with
no guaranteed shared filesystem context, and re-discovery risks drift between
hats.

- **Flow hat.** Map the feature's user flow and state transitions (entry →
  happy path → edge/error states → exit). Output: a Mermaid flowchart plus one
  line per state on what triggers the transition.
- **Visual-Design hat.** Load `frontend-design` + the applicable Vercel
  skills (and Bencium, if installed). WebSearch/WebFetch 1-2 real, live
  products with a comparable UI pattern to this feature (not the whole app —
  just this feature's shape, e.g. "inline comment threads," "empty-state for
  a first-run dashboard"); cite what's borrowed from each. Describe layout and
  component composition per state (empty/loading/populated/error), using
  `design-system.md`'s actual tokens (palette, type scale, spacing,
  component library) — never a token that isn't in that file. Flag anything
  the design system doesn't cover as `DECISION NEEDED:`.
- **Accessibility & IA hat.** Two things, not one: (a) *entry points* — every
  place in the product this feature is reachable from (nav item, route,
  triggering button/menu, deep link, empty-state CTA elsewhere) — a feature
  with no listed entry point is a bug in this brief, not an implementation
  detail to figure out later; (b) *accessibility* against the WCAG level set
  in `design-system.md` (default AA) — keyboard reachability and focus order,
  ARIA roles/labels, color-contrast check against the cited palette,
  screen-reader-facing copy for non-text states (loading, error, empty).

### 2. Synthesize into one brief

Merge the three hats' output into `Feature Designs/<feature-slug>.md`
(`<feature-slug>` = the feature name, kebab-cased). If two hats raise
overlapping or duplicate `DECISION NEEDED:` items, merge them into one entry
under the shared section below rather than listing both. If a hat's finding
is about the design system itself rather than this one feature (e.g. a token
that fails contrast wherever it's used, not just here), keep it in this
brief's `DECISION NEEDED:` **and** call it out separately in your report-back
as a candidate fix for `Design Guidelines/design-system.md` — don't let a
system-level defect get buried in one feature's file where the next feature
will rediscover it from scratch.

```markdown
---
ticket: <tracker ticket ID, e.g. RS-142>
# or, when one feature spans several tickets (a parent and its frontend child tickets):
# tickets: [COM-12, COM-15, COM-16]
---
# <Feature name>

Spec: <link/path to the approved spec section>
Design system: Design Guidelines/design-system.md

## Flow
<Mermaid flowchart + state notes>

## Design
<per-state layout/composition, tokens used, reference examples cited>

## Entry points
<every place in the UI this is reachable from>

## Accessibility
<WCAG level, keyboard/ARIA/contrast/screen-reader notes>

## DECISION NEEDED
<anything genuinely unresolved, or empty>
```

One file per feature; overwrite on re-run of the same feature slug rather than
accumulating duplicates — same convention as `Ticket Briefs/`.

The `ticket:` (or `tickets:`) frontmatter is required: the rs-guard PR hook maps a branch
whose name carries a ticket ID (e.g. `feat/RS-142-checkin`) to the brief that
lists it and refuses a non-draft `gh pr create` until its
`## Prototype Approval` shows `Verdict: APPROVED`. Take the ID from the
feature's `Ticket Briefs/` file; if there is none, ask the human for it —
don't invent one. In a multi-repo project, list the parent ticket and every
frontend child ticket that builds this feature, and add new child IDs when a
ticket is split. If the feature's prototype was already approved before
delivery (e.g. the PO's prototype signed off by the client), say so here and
link it under `Spec:`; `feature-prototype` step 0 records that approval
instead of building a new one.

### 3. Human checkpoint

*"Flow, design, entry points, and accessibility are all specified for
`<feature>`. Anything under DECISION NEEDED to resolve before implementation
starts?"* Every `DECISION NEEDED:` item needs an explicit human ruling before
handoff — either resolved, or explicitly accepted as a known risk to carry
into implementation (record which, inline, next to the item). Don't hand off
with an item the human never actually responded to.

### 4. Prototype gate — required before implementation

**Hard gate, not optional.** Once Step 3's `DECISION NEEDED:` items are
resolved, run `rs-delivery:feature-prototype` next — it builds a clickable
local prototype (static HTML file or Claude Artifact) of this feature from
this brief and gets the human's explicit accept/reject verdict, then records
it as a `## Prototype Approval` section in this same `Feature
Designs/<feature-slug>.md` file. Do not proceed to Step 5, and do not suggest
`/implement` or `/to-tickets` for this feature, until that section
shows `APPROVED`. A brief with no `## Prototype Approval` section is not
ready for implementation, no matter how settled Steps 1–3 look.

### 5. Hand off to implementation — explicitly, not by assumption

Once `## Prototype Approval` shows `APPROVED` (Step 4), implementation for
this feature is started **by the human**, with one of Matt Pocock's
`mattpocock-skills` commands — only the human can start them, so state the
choice and the exact command, then stop. Don't write feature code from this
skill's context, and don't start or recreate those commands yourself.

- **Small feature — one vertical slice** (everything in `tasks.md` is one
  end-to-end path a single agent session can finish): the human types
  **`/implement specs/<feature-slug>/`**. The agent works through `tasks.md`
  in order, each task with `mattpocock-skills:tdd` at the seams in
  `design.md`, then reviews and commits.
- **Bigger feature — several slices that could be built in parallel:** the
  human types **`/to-tickets specs/<feature-slug>/`**, which groups the
  `tasks.md` tasks into tracer-bullet tickets with blocking links on the
  tracker (the rules for that grouping are in `docs/agents/issue-tracker.md`),
  then **`/implement-spec <spec issue>`**, which builds the frontier of
  unblocked tickets in parallel on one integration branch and opens a draft
  PR.

Recommend one of the two from the shape of `tasks.md`, but the human decides. After the build, the
order to a PR is: gstack `/ship --no-pr` → `rs-delivery:qa-verify-report` → gstack `/review` →
`rs-receipt verify` → `rs-delivery:ship-with-ticket`.
The task breakdown is never re-derived: it **is** this feature's `tasks.md`,
produced by `rs-delivery:spec-generator` earlier in the branch, and every
ticket names the task numbers it covers.

For every task or ticket that touches this feature's UI, the implementer must
get, inline (not just as a file path to go look up): the brief's and
`design-system.md`'s paths, the specific `## Design` subsection and tokens
relevant to that slice, and the specific `## Accessibility` requirements that
apply to it. A ticket carrying only a path is exactly the "silently re-derive
it" failure this skill exists to prevent; `docs/agents/issue-tracker.md` makes
this part of every UI ticket's body.

## Inputs you need from the user

- **Required:** the approved spec section this brief is for.
- **Optional:** any reference products the human already has in mind (used
  instead of the Visual-Design hat's own search); resolution on any
  `DECISION NEEDED:` item before implementation starts.

## Output

`Feature Designs/<feature-slug>.md` — flow, design, entry points, and
accessibility for one feature, plus (once `feature-prototype` completes) a
`## Prototype Approval` section. Downstream, every implementation task for
and ticket for this feature carries this file's path (and `design-system.md`'s)
so implementation and QA verification both work from the same stated intent
instead of re-deriving it — and implementation does not start at all until
that section reads `APPROVED`.
