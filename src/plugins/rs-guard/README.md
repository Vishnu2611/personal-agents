# rs-guard

Claude Code plugin with no skills: hooks that enforce the Rightshift delivery gates. It has **no
plugin dependencies** on purpose: Claude Code turns a plugin off, hooks included, when a dependency is
missing, so the gates live here, where nothing can switch them off. `rs-delivery` depends on it.

## Install

```
/plugin marketplace add IntuitioLabsLLC/rightshift-managed-agents
/plugin install rs-guard@rightshift
```

## What it does

- **SessionStart** runs `hooks/bin/rs-doctor.cjs`: checks gstack (pinned commit in `hooks/pins.json`),
  `mattpocock-skills`, Bun ≥ 1.3.3, `git`, `gh` on macOS/Linux, and prints the exact fix for anything
  missing. It never installs anything on its own.
- **PreToolUse (Bash)** runs `hooks/pre-bash.cjs`, which denies:
  - dangerous git: force-push, push to `main`/`master`/origin's default branch, `reset --hard`,
    `clean -f`, `branch -D`, `checkout .`, `restore .`;
  - a non-draft `gh pr create` (or `gh pr ready`, which turns a draft into a reviewable PR) without commit-bound receipts (`.rs-receipts/<kind>/<HEAD sha>.json`):
    tests passed on every branch; on ticket branches also the prototype approved
    (`Feature Designs/*.md` whose `ticket:` / `tickets:` frontmatter lists the ticket) and QA with no failing P0. In a
    multi-repo project, `.rs-harness.json` `"role"` narrows these: `fe` keeps both, `be` drops the
    prototype, `infra` drops both. With a role, a ticket branch also needs a
    `specs/*/requirements.md` whose frontmatter lists the ticket and cites a `source:` URL;
  - a non-draft PR unless gstack `/review` finished a clean pass on exactly the current code (gstack's
    own `CURRENT` verdict from `gstack-review-read`, bound to a working-tree content fingerprint); every
    branch, so `/review` runs last, after QA is recorded;
  - `git push` and non-draft PRs while a required tool is missing.
  - the agent running the installer (`rs-doctor --install`, `rightshift-skills doctor --install`).

  Each check runs against the repository the command acts on: a `cd` earlier in the same command
  (outside a subshell) and `git -C` move it. A `cd` to a path only known at run time (`cd "$REPO"`,
  `cd -`) makes a gated PR or a push undecidable, so it is denied, as is `gh pr … --repo` naming
  anything but the checkout's own origin.
- **PreToolUse (Skill)** runs `hooks/pre-skill.cjs` and **UserPromptSubmit** runs
  `hooks/prompt-submit.cjs`: when `.rs-harness.json` lists `"required_mcp"` (e.g.
  `plugin:rs-delivery:notion`, the server `rs-delivery` ships), a planning skill
  (`kickoff`, `ticket-intake`, `spec-generator`, `feature-design-brief`, `/grill-with-docs`,
  `/to-spec`, `/to-tickets`) is denied while one of those servers is signed out, failing, pending
  approval or missing. Status comes from `claude mcp get <name>` (connected results cached 10 minutes
  in `.rs-receipts/mcp/`); unreadable status never blocks. SessionStart prints the same as a STOP note.
- `hooks/bin/rs-doctor.cjs --install` is for a human: it shows the plan, asks (or takes `--yes`),
  then puts gstack at the pinned commit (`git fetch` + `checkout` + `./setup --no-team`). It refuses a
  dirty checkout or a foreign directory, and only prints the commands for the other tools. The same
  doctor runs as `npx rightshift-skills doctor [--install]` once the npm package is published.
- `hooks/bin/rs-receipt.cjs` writes the receipts: `verify -- <test command>`,
  `qa --report <path> --p0-failed <n>`, `status`.

Ticket branches and `.rs-harness.json` `ticket_prefixes` are described in the project template's
`AGENTS.md` ("Enforced gates"). The guards stop agent mistakes; they are not a security boundary
against a determined user.

## Pins

Bump gstack deliberately by editing `hooks/pins.json` (gstack has no tags). Install it with
`./setup --no-team`: `--team` turns on gstack's hourly auto-upgrade, which would move it off the pin.
