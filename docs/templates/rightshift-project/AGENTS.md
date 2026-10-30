# AGENTS.md

This is a **RightShift-delivered project**. Delivery runs through the `rs-delivery` Claude Code
plugin (marketplace: `rightshift`), which itself composes `mattpocock-skills` (design interview, specs,
tickets, TDD build, code review, PR body), gstack (`/ship`, `/review` — a required tool, see below) and
`rs-scoping` (BRD / PRD / Technical Design / estimation); spec
generation (`spec-generator`) lives in `rs-delivery` itself. `rs-qa` and `rs-common` are installed
alongside. Read this file before starting any work here — it tells you which process to follow and
where to find things other agents (or the human) have already produced.

## Starting work

Invoke `rs-delivery:kickoff` first. It asks one question — **New application** or **Single
feature** — and states the matching pipeline:

- **New application** (a new app, or a substantial new surface in this one): Repo Knowledge Base +
  Design Guidelines (once) → BRD (optional) → PRD → Technical Design → `spec-generator` (all
  in-scope features) → human review of the full `specs/` package → per feature: design brief →
  prototype gate → implement → QA verify → ship.
- **Single feature** (one ticket-sized change): Ticket Intake (optional) → **`/grill-with-docs`**
  (design interview) → **`/to-spec`** (spec posted to the tracker) → `spec-generator` Single-Feature
  Mode (no PRD needed) → design brief → prototype gate → implement →
  QA verify → ship.

Both branches converge on the same tail: implementation **always** builds from a
`spec-generator`-produced `tasks.md` — never from an ad-hoc plan. The human starts it: `/implement
specs/<feature>/` for a one-slice feature, or `/to-tickets` then `/implement-spec` to build several
slices in parallel from tracker tickets that group those tasks. Every task in `tasks.md` is one
vertical slice, RED → GREEN at a test seam agreed in the feature's `design.md`
(`mattpocock-skills:tdd`). No feature is implemented
without a human-approved clickable prototype first (`feature-prototype` — a hard gate, not optional).

## Artifact folders you'll encounter

These are written by the pipeline as work progresses. Read them instead of re-deriving their content;
they're the seed of what downstream skills build from.

| Folder | Written by | Contents |
|---|---|---|
| `manifest.yaml` | `repo-knowledge-base` | Repo map — tech stack, entry points, conventions. Run once per repo. |
| `Design Guidelines/` | `design-guidelines` | `design-system.md` — palette, type, spacing, components. Every UI decision cites this, never invents a token ad hoc. |
| `Ticket Briefs/` | `ticket-intake` | One normalized brief per ticket (Linear/Jira/Asana), the seed for the `/grill-with-docs` interview. |
| `GLOSSARY.md`, `docs/adr/` | `/grill-with-docs` (`domain-modeling`) | The project's domain language and its hard-to-reverse decisions. Use the glossary's terms; created lazily, so absent is fine. |
| `docs/agents/` | this template (Matt's setup, pre-filled) | Where `/to-spec`, `/to-tickets` and friends publish (`issue-tracker.md`), triage labels, how to read the domain docs, and where the project's Notion context lives (`project-context.md`). |
| `specs/` | `rs-delivery:spec-generator` | Per-feature `requirements.md` (EARS) / `design.md` / `tasks.md` (TDD), plus a project rollup `README.md`. |
| `Feature Designs/` | `feature-design-brief` | Flow, visual design, entry points, accessibility per feature — plus a `## Prototype Approval` section once the gate clears. |
| `Prototypes/` | `feature-prototype` | Clickable static-HTML prototypes (or Claude Artifacts) — disposable, not shipped code. |
| `Execution Reports/` | `qa-verify-report` | Live QA verdicts (Pass/Fail/Blocked) against a feature's acceptance criteria, run via Playwright MCP (browser mode) or HTTP calls against the API contract (API mode, backend repos). |

## House rules

- **Conventional Commits.** `feat:`, `fix:`, `docs:`, etc. — enforced once `npm install` has run (see
  the main README, if this project uses one).
- **TDD, no exceptions.** Every implementation task is RED → GREEN: one failing test at an agreed
  seam, then only the code that makes it pass. If you're about to write production code with no
  failing test behind it, stop. Test behaviour through the agreed seams only (never internals; mock
  only at system boundaries), and never write a test at a seam the human hasn't confirmed. Clean-up
  and refactoring happen at code review, not inside the loop.
- **Diagnose before fixing.** When something is broken, throwing, failing or slow, use
  `mattpocock-skills:diagnosing-bugs`: get a deterministic failing signal first, then hypotheses, then
  the fix with a regression test. No fixes by guesswork.
- **No invented scope.** Every skill in this pipeline transforms an approved source (a PRD, a Ticket
  Brief, a `/to-spec` spec) — it doesn't add requirements the human didn't approve. Anything
  genuinely undecided gets tagged (`DECISION NEEDED:`, `PRD GAP:`) and raised, not guessed.
- **Human gates are real gates.** A prototype without an explicit accept, or a QA report with a
  failing P0, blocks shipping — don't route around either.

## Agent skills

Matt Pocock's skills (`mattpocock-skills`) read this section. `/grill-with-docs`, `/to-spec`,
`/to-tickets` and the other phase-starting skills are typed by the human; agents never start them,
and never recreate them by calling `grilling` / `domain-modeling` directly.

### Issue tracker

The project's Linear, Jira or Asana, through the same MCP connection as `rs-delivery:ticket-intake`.
See `docs/agents/issue-tracker.md` (fill in the tracker and team/project once).

### Triage labels

Matt's defaults (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See
`docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Project context (Notion)

When `docs/agents/project-context.md` exists, the project's shared context (PRD, technical design,
project-wide glossary and decisions) lives in Notion. Read the pages it links, through the Notion MCP,
before planning, specifying or designing work, and treat them as the source of truth. Don't copy their
content into this repo; cite the page instead. If the Notion MCP is unavailable, say so and stop rather
than working from memory (`rs-guard` blocks the planning skills while it is signed out, when
`.rs-harness.json` lists it in `required_mcp`).

## Enforced gates (rs-guard hooks)

The house rules above are also enforced by hooks in the `rs-guard` plugin (installed with `rs-delivery`), so they hold even when a step is
forgotten. Each gate reads a **receipt** in `.rs-receipts/` (gitignored) bound to the current commit
SHA, so any new commit means the check must be re-run.

| Action | Denied unless |
|---|---|
| `gh pr create` (any non-draft PR), `gh pr ready` | `rs-receipt verify -- <test command>` passed on the current commit and no tracked file is modified |
| `gh pr create` / `gh pr ready` on a **ticket branch** | the `Feature Designs/*.md` brief whose `ticket:` (or `tickets:` list) frontmatter names the ticket has `## Prototype Approval` → `Verdict: APPROVED` |
| `gh pr create` / `gh pr ready` on a **ticket branch** | `rs-receipt qa --report <Execution Reports file> --p0-failed 0` was recorded on the current commit |
| `git push --force`, push to `main`/`master`, `reset --hard`, `clean -f`, `branch -D`, `checkout .`, `restore .` | never — ask the human to run it |
| `gh pr create`, `gh pr ready` (any branch) | gstack `/review` finished a clean pass (no open findings) on exactly the current code — gstack's own `CURRENT` verdict |
| `gh pr create`, `gh pr ready`, `git push` | the required tools below are installed |

Draft PRs (`gh pr create --draft`, as `/implement-spec` opens) skip the receipt gates, so work can be shared
early; marking one ready (`gh pr ready`) is gated like opening a non-draft PR.

The gates check the repository a command acts on, following a `cd` earlier in the same command. Run
`gh pr create` and `git push` from inside the repository they are for: a `cd` to a path only known at
run time (`cd "$REPO" && …`), or `--repo` naming another repository, is denied.

**Ticket branches.** A branch is a ticket branch when its name carries a ticket ID, e.g.
`feat/RS-142-checkin`. List the tracker's prefixes in `.rs-harness.json` at the repo root so
lowercase names (Linear's default, `vishnu/rs-142-checkin`) are recognised too:

```json
{ "ticket_prefixes": ["RS"] }
```

Without that file only uppercase IDs count. Branches with no ticket ID (chores, dependency bumps)
need only the verify receipt.

**Repo roles (multi-repo projects).** When a project is split into frontend, backend and infra repos,
each repo names its role in the same file, and the ticket-branch gates follow it:

```json
{ "role": "be", "ticket_prefixes": ["COM"] }
```

| `role` | Prototype approval | QA receipt |
|---|---|---|
| *(none: single repo)* | yes | yes |
| `fe` | yes | yes (browser QA) |
| `be` | no | yes (API QA) |
| `infra` | no | no (put the plan output in the PR) |

With a role, a ticket branch also needs a spec: some `specs/*/requirements.md` whose frontmatter lists
the ticket in `tickets:` and cites the approved source it was written from (`source:` URL, written by
`spec-generator`). When you split a ticket further, add the new ID to that spec's `tickets:`.

The verify receipt and the gstack `/review` gate apply to every role. An unknown role denies every
PR until it is fixed. `rs-receipt status` prints the role and what its ticket branches need.

**MCP servers for planning.** When project context lives in Notion and tickets in a tracker, list the
servers in the same file. `rs-delivery` ships the Notion, Linear, Jira and Asana servers, so a project
needs no `.mcp.json` of its own (`node scripts/rs-setup.mjs` writes this for you):

```json
{ "role": "be", "ticket_prefixes": ["COM"], "required_mcp": ["plugin:rs-delivery:notion", "plugin:rs-delivery:linear-server"] }
```

While any of them is signed out, failing or not yet approved, the planning skills (`kickoff`,
`ticket-intake`, `spec-generator`, `feature-design-brief`, `/grill-with-docs`, `/to-spec`,
`/to-tickets`) are blocked, whether an agent starts them or a human types them, and the session opens
with a STOP note naming the fix. Coding, tests and PRs keep working. Once per machine, run `/mcp` and
sign in to the Notion and tracker servers with your own account; your Notion permissions decide what
the agent can read. A server whose state can't be read is never blocked on. Don't also add personal
Notion or tracker connectors for client work: the same tools would appear twice.

**Order before a PR:** implement (Matt's `code-review` runs at the end of `/implement` and
`/implement-spec`) → **gstack `/ship --no-pr`** (merges the base branch, tests, reviews and fixes,
bumps `VERSION`/`CHANGELOG` only where those files already exist — answer *Skip* if it offers to
create `TODOS.md` — and pushes; no PR) → QA report committed → `rs-receipt qa …` → **gstack `/review`**
→ `rs-receipt verify -- <tests>` → `rs-delivery:ship-with-ticket` opens the PR. Chores (no ticket) skip
the QA steps. `/review` goes last because its verdict is bound to
the exact working-tree content: any later change, even a new report file, makes it stale. If `/review`
fixes code, re-run QA and the receipts on the fixed code. The full `node …/rs-receipt.cjs` command is printed at session
start and in every denial. `rs-receipt status` shows what is recorded for the current commit.

## Required tools

The harness requires **gstack** (pinned commit), **Matt Pocock's skills** (`mattpocock-skills`),
**Bun ≥ 1.3.3**, `git` and `gh`, on macOS or Linux (Windows: use WSL). A session-start check
(`rs-doctor`) reports anything missing with the exact install command. While something is missing,
only `gh pr create` and `git push` are blocked; everything else works. Installing runs third-party
code, so a human runs those commands — agents never install them. A human can also run
`rs-doctor --install` (path printed at session start), which puts gstack at the pinned commit after
asking; the hooks deny it to the agent. The first gstack skill run asks a one-off privacy question
about artifacts sync: answer **off**, so nothing about client work leaves the machine (gstack's
telemetry is off by default too). Do **not** run
`gstack-team-init required` in this repo: its hook blocks every skill when gstack is missing.

## Setup

See `README.md` for installing the `rs-delivery`, `rs-scoping`, `rs-qa` and `rs-common` plugins from the
`rightshift` marketplace. Claude Code users: see `CLAUDE.md` too.
