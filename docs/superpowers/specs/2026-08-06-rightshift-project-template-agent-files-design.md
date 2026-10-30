# Design: agent-orientation + supporting files for the `rightshift-project` template

Date: 2026-08-06
Status: Approved

## Context

`docs/templates/rightshift-project/` is the starter content for the org's GitHub template repo —
new client projects are created from it via "Use this template" (`docs/SOP.md` §3). Today it holds
only `README.md` (marketplace setup instructions) and `.claude/settings.json` (registers the
`rightshift` marketplace, pre-enables `rightshift-doc-gen`). No agent-orientation file, no
`.gitignore`, and `delivery-agent` — the actual ticket-to-PR pipeline a client project uses day to
day — is never mentioned.

## Goal

Give every project scaffolded from this template a working baseline: an agent reading the fresh repo
for the first time (Claude Code or another AGENTS.md-aware tool) knows what kind of project this is
and how delivery works here, without the human re-explaining it every time.

## Files

1. **`AGENTS.md`** (canonical, cross-tool orientation) — states this is a RightShift-delivered
   project; delivery runs through `delivery-agent:kickoff`, which branches **New application** (full
   BRD/PRD/Technical-Design/spec-generator process) vs **Single feature** (spec-generator
   Single-Feature Mode); both converge on TDD implementation off a `spec-generator`-produced
   `tasks.md`. Documents the artifact folders those skills create (`Ticket Briefs/`,
   `Design Guidelines/`, `Feature Designs/`, `Prototypes/`, `specs/`, `Execution Reports/`) so an
   agent recognizes them instead of re-deriving their purpose. States house rules: Conventional
   Commits, TDD via `superpowers:test-driven-development`, no implementation without an approved
   prototype (the hard gate `feature-prototype` enforces).
2. **`CLAUDE.md`** — thin pointer ("this project follows `AGENTS.md` — read that first") plus the one
   Claude-Code-specific fact AGENTS.md shouldn't carry: which slash commands/plugins are active here.
   Avoids two orientation files drifting out of sync — one substantive source, one thin pointer.
3. **`.gitignore`** — OS/editor/common-tooling baseline (`.DS_Store`, `node_modules/`, `.env`, IDE
   dirs). Stack is unknown at template time, so this is deliberately generic; framework-specific
   ignores get added once a project picks a stack (first thing `design-guidelines`/`prd-generator`
   would surface).
4. **`.claude/settings.json`** — add `"delivery-agent@rightshift": true` to `enabledPlugins`, next to
   the existing `rightshift-doc-gen@rightshift` entry.
5. **`README.md`** (the template's own) — add the `delivery-agent` install line alongside the existing
   `rightshift-doc-gen`/`chatbot-forge` ones, and a short pointer to `AGENTS.md`/`CLAUDE.md`.

## Explicitly out of scope

- `CONTRIBUTING.md` — would restate `AGENTS.md`; one file, not two, for a template this size.
- PR template — `delivery-agent:ship-with-ticket` already builds PR content programmatically (ticket
  link, status). A static template would just duplicate/drift from that.
- `LICENSE` — client's call per project, not the template's to assume.
- CI workflow YAML — stack is unknown at template time; a generic workflow would be guessing at a
  language/framework nothing here has chosen yet.

## Verification

- `.claude/settings.json` still parses as valid JSON and both plugins are listed.
- README's install section lists all three plugins consistently with what `settings.json` pre-enables.
- No stack-specific assumption baked into `AGENTS.md`/`.gitignore` (kept generic, matching the
  template's own "wire up, don't vendor" philosophy already established for the marketplace itself).
