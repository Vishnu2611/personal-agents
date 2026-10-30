# CLAUDE.md

This project follows [`AGENTS.md`](./AGENTS.md) — read that first. It covers how delivery works here,
what the pipeline's artifact folders mean, and the house rules (TDD, Conventional Commits, no invented
scope).

## Claude Code specifics

This repo is wired to the `rightshift` marketplace (`.claude/settings.json`). Once the plugins are
installed (see `README.md`), the relevant skills trigger automatically from conversation context —
you generally don't need to invoke them by name. If you do want to be explicit, the entry point is:

```
rs-delivery:kickoff
```

`/plugin` shows what's currently installed and enabled.

## Agent skills

See "Agent skills" in [`AGENTS.md`](./AGENTS.md) (issue tracker, triage labels, domain docs, in
`docs/agents/`). Re-running `/setup-matt-pocock-skills` updates this section in place.

## Required tools (rs-guard)

At session start `rs-guard` checks for gstack, Matt Pocock's skills, Bun, `git` and `gh`. If the
session context says **STOP: required tools … are missing**, tell the human, show them the printed
fix commands, and wait — do not run installers yourself. Until they are installed, `gh pr create`
and `git push` are denied; see "Enforced gates" in `AGENTS.md` for the receipts a PR needs.
