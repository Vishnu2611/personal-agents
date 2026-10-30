# SOP — Distributing & Consuming the RightShift Plugins

Standard operating procedure for shipping the twelve `rs-*` plugins to other repos through **two channels**
(Claude Code **plugins** from one marketplace and an **npm package**) and for adopting them downstream.

This is the governance layer on top of the build docs:
- [`README.md`](../README.md) — the twelve-plugin table (what each plugin is for, and its skills).
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — how to deploy to each surface (Claude Code, claude.ai, Managed Agents, SDK), the *Updating a skill* flow, the version-pin warning and the migration from the old plugin names.
- [`PIPELINE.md`](./PIPELINE.md) — the full generator chain.
- `Makefile` — every build step (`make help`).

Repo: `github.com/IntuitioLabsLLC/rightshift-managed-agents`.

---

## The one rule everything else protects

**One source of truth → one synced build → one version → two channels.**

```
src/plugins/<plugin>/      ──make sync──▶  plugins/  ──▶  ┌─ plugins (marketplace)
(skills/, prompts/,                        (artifact)     └─ npm package
 sync.json) + src/standards/                                   (same version, same commit)
```

- Edits happen **only** under `src/plugins/<plugin>/` (and `src/standards/`, which `sync.json` copies
  into the plugins that need it). The plugin names are listed once, in the Makefile's `PLUGINS`.
- `plugins/<plugin>/` is a **generated mirror** — never hand-edit it. `make sync` overwrites it and
  refuses to run over uncommitted `plugins/` edits unless `FORCE=1`.
- Every plugin is self-contained: its own `.claude-plugin/plugin.json` and `skills/`. The repo root is
  **not** a plugin; `.claude-plugin/marketplace.json` has one entry per plugin, with `source`
  `./plugins/<name>`.
- Both the plugins and the npm package are published from the **same synced `plugins/` at the same
  git tag**. Plugin `vX.Y.Z` and npm `vX.Y.Z` must be byte-identical skill folders.

If you remember nothing else: two channels double the chance of drift, so they always ship from one
tagged build.

---

## 1. Maintainers — release SOP

Run this whenever a prompt, standard, or template changes.

1. **Edit the canonical source** (`src/plugins/<plugin>/…` or `src/standards/…`) on a branch. Open a PR.
2. **Prompt changes require a human approver** — a wording change alters every downstream doc.
3. **Sync + verify locally:**
   ```bash
   make sync        # regenerates plugins/<plugin>/ from src/plugins/, extracts the context pack
   make verify      # every plugin, skill and the marketplace well-formed + fill-script smoke test
   make test        # unit tests for the sync/verify tooling
   ```
   `make verify` must be green. It walks every plugin's `skills/`, checks each plugin has a manifest and that
   the marketplace entries match. (Note: the QA/spec stages — `test-planner`, `test-case-generator`, `test-executor`, `spec-generator` — are
   verified but still **not** wired into `src/orchestrator/pipeline.yaml`, which models only the
   four-stage estimation chain; add them there before relying on unattended pipeline runs.)
4. **Commit using Conventional Commits.** The `commit-msg` husky hook (commitlint) rejects anything
   that isn't `type(scope): summary`. The type drives the version bump in the next step — so the
   message *is* the changelog. Common types here: `feat`, `fix`, `prompt` (a skill/prompt content
   change), `docs`, `refactor`, `build`, `chore`. Breaking changes: add a `!` (`feat!: …`) or a
   `BREAKING CHANGE:` footer.
5. **Cut ONE version for the whole bundle** — never bump by hand:
   ```bash
   npm run release:dry   # preview the bump + CHANGELOG, no writes
   npm run release       # commit-and-tag-version: derives semver from commits, updates
                         # package.json + CHANGELOG.md, commits, tags vX.Y.Z
   git push --follow-tags origin main
   ```
   Conventional Commits → semver mapping: `fix` → **patch**, `feat` → **minor**, `!`/`BREAKING CHANGE`
   → **major**. `package.json` `version` is the **single source of truth**; `.versionrc.json` also bumps
   every `src/plugins/*/.claude-plugin/plugin.json` (and its generated `plugins/` copy) and
   `.claude-plugin/marketplace.json` (metadata.version) in lockstep. Each `plugin.json` pins an explicit
   `version`, so **nothing reaches users unless the version changes** (see
   [`DEPLOYMENT.md`](./DEPLOYMENT.md#the-version-pin)).
   Then **advance the moving major tag** so `v3`-pinned consumers pick up the release:
   ```bash
   git tag -f v3 vX.Y.Z^{} && git push -f origin v3   # v3 → newest 3.x; use v4 after the next major bump
   ```
6. **Publish both channels from that tag:**
   - **Plugins** — push the `main` branch (the marketplace *is* this repo). Consumers pick up the new
     version via auto-update, `/plugin marketplace update rightshift`, or
     `claude plugin update <plugin>@rightshift`. `.claude-plugin/marketplace.json` + `plugins/` are
     what's read.
   - **npm** — `npm publish` (tarball is scoped to `plugins/ + bin/` via the `files` field).

   **One-time go-live gates (until these are done, publishing is intentionally blocked):**
   1. Create/claim the **`@rightshift` npm org** (or point `publishConfig.registry` at a private registry).
   2. Flip `"private": true` → remove it (or `false`) in `package.json`.
   3. For a **public** package, publish with `--access public` (currently `publishConfig.access` is
      `restricted`). For a **public plugin marketplace**, the repo itself must be public — otherwise
      consumers need git access to `/plugin marketplace add` it.

**Never** publish from a working tree with uncommitted `plugins/` edits, and never publish the two
channels from different commits. Because releases are tag-driven off the merged history, the tag is
guaranteed to match what CI verified.

---

## 2. Consumers — adoption SOP (per repo)

**Pick the channel by what the repo already is:**

| Consumer repo                     | Channel     | Why                                                    |
| --------------------------------- | ----------- | ------------------------------------------------------ |
| Claude Code / interactive dev     | **Plugin**  | Native skill discovery; updates via the plugin manager |
| JS/TS toolchain, or CI-only       | **npm**     | Rides the existing `npm install`; no Claude Code assumed |
| Non-Claude-Code but needs files   | **npm**     | Just needs the skill files on disk                     |

Default to the **plugin** unless there's a reason for npm.

**Steps for a new/existing repo:**
1. Add the skills via the chosen channel:
   - Plugins: `/plugin marketplace add IntuitioLabsLLC/rightshift-managed-agents` then
     `/plugin install <plugin>@rightshift` for each plugin the repo needs (see the table in the
     [README](../README.md#plugins); e.g. `rs-scoping`, `rs-delivery`, `rs-qa`, `rs-common`).
   - npm: `npm i -D @rightshift/skills && npx rightshift-skills` (add `--global` to install into
     `~/.claude/skills`).
2. **Pin the version.** No floating `latest` — pin the plugin version / an npm semver range so an
   upstream release can't silently change your outputs mid-project.
3. **Commit the reference, not copies.** Commit the plugin manifest entry / the `package.json` dep —
   do **not** check copied skill folders into the consumer repo. Copies go stale; references update.
4. **Upgrade deliberately.** Bump the pin when you choose to. Read the `CHANGELOG.md`; treat a major
   bump as a reviewed change.

---

## 3. Org admins — standing-rule SOP (every new repo)

GitHub has no native "auto-inject files into every new repo." Achieve the standing rule with a
template plus, optionally, creation-time automation:

1. **Template repository.** Maintain a template repo whose `.claude/settings.json` **references** the
   marketplace (it does not copy the skills). Ready-to-copy starter content lives in
   [`docs/templates/rightshift-project/`](./templates/rightshift-project/). New repos created with
   **"Use this template"** start wired up. Set it as the org's suggested template.

   ```json
   {
     "extraKnownMarketplaces": {
       "rightshift": {
         "source": { "source": "github", "repo": "IntuitioLabsLLC/rightshift-managed-agents", "ref": "v3" }
       }
     },
     "enabledPlugins": {
       "rs-scoping@rightshift": true,
       "rs-delivery@rightshift": true,
       "rs-qa@rightshift": true,
       "rs-common@rightshift": true
     }
   }
   ```
   - **Pin `ref` to a tag, never `main`.** Two choices:
     - **`v3` (moving major tag, default)** — consumers auto-pick up patches/minors within major 3 on
       a marketplace refresh; a **breaking** `v4` never auto-lands. Best balance of freshness + safety.
       `v3` is the first release with the `rs-*` plugins and the `renames` map; a project still on `v2`
       keeps the old plugins until it moves its pin.
     - **`v3.0.0` (exact tag)** — fully frozen; moves only when a human bumps the pin. Use for
       maximum reproducibility (e.g. a release you must be able to reproduce byte-for-byte).
   - The maintainer advances `v3` on each 3.x release (see §1 step 5), so `v3` consumers get it without
     editing their pin. Auto-update is **off by default** for third-party marketplaces, so a consumer
     still needs it enabled, or to run `/plugin marketplace update` — but no pin edit.
   - References (does not copy) the bundle, so an advanced tag flows the update without re-vendoring files.
   - Not fully zero-touch: opening the repo registers the marketplace on folder-trust; each dev still
     runs `claude plugin install rs-scoping@rightshift` (and the other enabled plugins) once (the `enabledPlugins` caveat).
2. **Creation-time automation (true zero-touch).** For automatic-on-every-repo, run an org **GitHub
   App** subscribed to the repository-creation event (or a scheduled org workflow) that applies the
   template reference / opens a bootstrap PR. This is the only way to get every repo without a human
   choosing the template.
3. **Not the `.github` repo.** The org `.github` default-files mechanism only covers community-health
   files (issue templates, CODEOWNERS, …), **not** arbitrary skill folders — it can't carry skills.

Keep the template's pin current as part of the release SOP (bump it when you cut a major).

---

## Local setup (every contributor, once per clone)

```bash
npm install     # installs the dev tooling AND activates the husky git hooks (prepare script)
```

Until `npm install` has run, the hooks are inactive — git can't enforce anything on a clone that
skipped it. After it runs, every commit is gated by:

| Hook | Enforces |
| --- | --- |
| `commit-msg` | Conventional Commits format (commitlint, `@commitlint/config-conventional` plus the project's `prompt` type). Bad message → commit rejected. |
| `pre-commit` | `make verify` — plugin/skill well-formedness + estimation fill-script smoke test. Broken skills → commit rejected. |

Bypass only in a real emergency with `git commit --no-verify` (and fix it forward). CI must re-run
`make verify` so `--no-verify` can't sneak a broken skill onto `main`.

## Ownership & guardrails

- **Owner:** one team owns this repo and approves all canonical-source changes.
- **CI gate:** `make verify` (+ the plugin/npm build) runs on every PR; publishing happens **only
  from a tag**, never from `main` directly.
- **Drift check:** CI should fail if `plugins/` differs from a fresh `make sync` of the canonical
  sources — that catches hand-edits to the generated mirror.
- **Deprecation:** announce removed/renamed skills or plugins as a **major** bump with a CHANGELOG note (and a `renames` entry in `marketplace.json` for a renamed plugin);
  consumers are pinned, so they upgrade on their schedule.
