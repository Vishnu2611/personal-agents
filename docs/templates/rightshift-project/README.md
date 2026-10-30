# RightShift skills — setup

This repo is wired to the **RightShift skills marketplace**. The skills (BRD → PRD → Technical Design
→ Estimation, the QA track, spec generation, diagram rendering, and the chatbot builder) ship as job-named `rs-*` plugins and are **not**
copied into this repo — they're pulled from the marketplace, so you always get the maintained version.

`.claude/settings.json` already registers the marketplace and pre-enables the main plugin. You just
install it once, then update when you want a newer version.

---

## First-time setup

**1. Open this project in Claude Code and trust the folder** when prompted. That registers the
`rightshift` marketplace automatically (from `.claude/settings.json`).

**2. Install the plugins:**

```
/plugin install rs-delivery@rightshift
/plugin install rs-scoping@rightshift
/plugin install rs-qa@rightshift
/plugin install rs-common@rightshift
/plugin install rs-guard@rightshift
```

`rs-delivery` is the ticket-to-PR pipeline — the day-to-day driver for a client project (pulls a
ticket, indexes the repo, runs the design interview, plans/TDD-implements each feature, QA-verifies,
ships a PR). Installing it also pulls in its dependencies, including Matt Pocock's `mattpocock-skills`
(`/grill-with-docs`, `/to-spec`).
`rs-scoping` is the doc chain it composes (opportunity packet, BRD, PRD, Technical Design, estimate),
`rs-qa` runs the test strategy and Playwright verification, `rs-common` holds the shared D2 and
formatting utilities, and `rs-guard` holds the hooks that enforce the delivery gates (see `AGENTS.md`). Installing `rs-scoping` standalone is also fine if you only need the docs, not
the full delivery loop. Anyone previously on `rightshift-doc-gen`, `delivery-agent` or `chatbot-forge`:
the marketplace renames them to `rs-scoping`, `rs-delivery` and `rs-chatbot`; install the new names
once (see the main repo's `docs/DEPLOYMENT.md`, *Migrating from the old plugins*).

**3. Set up this repo (once):** run

```
node scripts/rs-setup.mjs
```

It asks for the repo's role, the ticket prefix, the tracker and the project's Notion pages, then
writes `.rs-harness.json` and `docs/agents/project-context.md`:

- **single:** one repo holds the whole product (the default). Notion is optional.
- **fe / be / infra:** one repo of a project split across frontend, backend and infra repos. Run the
  script in each repo with the same Notion links and ticket prefix. The gates then follow the role
  (see "Repo roles" in `AGENTS.md`), and the script prints the GitHub permissions to set: each
  developer writes only to their own repo, `main` is protected, and a `CODEOWNERS` file names the
  repo's owners.

Then edit `docs/agents/issue-tracker.md` (tracker team/project) so `/to-spec` and `/to-tickets` publish
to the right place, and commit `.rs-harness.json` and `docs/agents/`.

**4. Sign in to the MCP servers (once per machine):** run `/mcp` and sign in to the Notion and tracker
servers that `rs-delivery` provides. While they are signed out, the planning skills are blocked and
the session opens with a STOP note; coding, tests and PRs still work.

Optionally add the chatbot builder:

```
/plugin install rs-chatbot@rightshift
```

That's it — the skills are now available (type `/` to see them, or just ask e.g. "create a BRD", or
start with `rs-delivery:kickoff`). See [`AGENTS.md`](./AGENTS.md) for how the delivery pipeline
works in this repo, and [`CLAUDE.md`](./CLAUDE.md) for Claude-Code-specific notes.

<details>
<summary>If the marketplace didn't register automatically</summary>

Add it by hand, then install as above:

```
/plugin marketplace add IntuitioLabsLLC/rightshift-managed-agents
```
</details>

---

## Updating the plugins

This repo is pinned to the **`v4` moving tag**, so it tracks the latest **4.x** release (new features
and fixes), and a breaking `v5` never lands on its own. `v4` is the first release of the AI code
harness: Matt Pocock's skills plus gstack replace `superpowers`, and `rs-guard` enforces the delivery
gates. A project still on `v3` keeps the Superpowers-based pipeline until it moves its pin.
To pull the newest 4.x:

```
/plugin marketplace update rightshift          # refresh the catalog to the latest v4.x
/plugin install rs-scoping@rightshift --upgrade # update an installed plugin (repeat per plugin)
/reload-plugins                                 # apply now, without restarting
```

(Update each other installed plugin, e.g. `rs-delivery@rightshift`, the same way. Shell equivalent:
`claude plugin update <plugin>@rightshift`.) A release only reaches you if its version changed.

**Want updates to arrive on their own?** Enable auto-update for this marketplace: run `/plugin` →
**Marketplaces** → select `rightshift` → **enable auto-update**. Claude Code then checks in the
background and prompts you to reload when a new 4.x is out.

**Check what you're on:** `claude plugin list` (or `/plugin`) shows installed plugins and versions.

> CLI equivalents exist for all of the above: `claude plugin install …`, `claude plugin marketplace
> update …`, `claude plugin update …`, `claude plugin list`.

---

## Notes

- **Pinning:** the version lives in `.claude/settings.json` → `extraKnownMarketplaces.rightshift.source.ref`.
  Leave it at `v4` for auto within-major updates, or set an exact tag (e.g. `v4.0.0`) to freeze this
  repo to one version. Moving to a future **major** (`v5`) is a deliberate edit of that `ref`.
- **Prereqs for `rs-chatbot`:** it defers to a couple of external plugins — see its own README once
  installed.

---

<sub>**Maintainers:** this folder is the starter content for the GitHub template repo. Copy its
contents to the template repo root, mark it a **Template repository** (Settings → General), and set it
as the org's suggested template. New projects created with **"Use this template"** inherit this
`.claude/settings.json`.</sub>
