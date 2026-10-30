---
name: repo-knowledge-base
description: Index a repo into manifest.yaml + write-back docs (Notion and/or an Obsidian vault) so the design interview and implementation start with real repo context. Trigger on "index this repo" or "build the knowledge base".
---

# Repo Knowledge Base

Builds a durable map of a repo — `manifest.yaml` plus a set of indexed docs — so
the `/grill-with-docs` design interview and `/implement` / `/implement-spec` start a ticket with real repo context
instead of re-discovering the codebase from scratch every time. Read-only against the target repo;
writes only `manifest.yaml` (in-repo) and, per the human's choice, Notion pages and/or Obsidian vault
files (out-of-repo).

Run this once per repo, then re-run whenever the structure drifts enough that `manifest.yaml` looks
stale — it is not re-run per ticket.

## Prerequisites

Only needed if Notion is the chosen backend (Obsidian needs no MCP — plain file writes):

- **Claude Code:** `claude mcp add --transport http notion https://mcp.notion.com/mcp`
- **claude.ai / Claude Desktop:** Settings → Connectors → Notion (OAuth)
- **Managed Agents:** an `mcp_toolset` entry for Notion, same shape as
  `src/orchestrator/pipeline.yaml`'s existing `notion:` block

## How to run

### Gate 0 — pick the backend, every time

Ask: **Notion, an Obsidian vault, or both?** Never default silently, even if a prior run in this repo
picked one. If Obsidian, ask for the vault's root directory path. If Notion, confirm the workspace/
parent page. Skip only the backend(s) not chosen — `manifest.yaml` itself is always written,
regardless of backend choice, since it's what downstream skills read directly from the repo.

### 1. Build `manifest.yaml`

Write to the target repo's root:

```yaml
repo: <name>
generated: <ISO date>              # today's date; ask the human if it can't otherwise be determined
source_commit: <short sha>
description: <one paragraph, inferred from README + package manifest>
tech_stack:
  languages: [...]
  frameworks: [...]
  package_manager: <npm|pip|...>
entry_points:
  - path: <file>
    purpose: <one line>
directories:
  - path: <dir>
    purpose: <one line>
    key_files: [...]
conventions:                       # only what's actually inferable — don't invent house style
  - <e.g. "tests colocated under __tests__/", "commits follow Conventional Commits">
pipelines:                          # other agent skills/plugins already in this repo, if any
  - name: <skill/plugin name>
    purpose: <one line>
```

Derive this from the repo itself — README(s), package manifest, top-level directory listing, any
existing docs/ or CONTRIBUTING — not from assumption. Where something can't be determined confidently,
omit the field rather than guessing; don't fabricate a tech-stack entry or a convention that isn't
actually evidenced.

### 2. Notion path (if chosen)

Reuse the duplicate-template-page pattern this repo's own orchestrator already uses
(`src/orchestrator/run_pipeline.py`'s `create_project_hub`): duplicate a repo-knowledge-base template
page via the Notion MCP, rename it to `"<repo name> — Knowledge Base"`, then create one child page per
`manifest.yaml` top-level section (Tech Stack, Entry Points, Directories, Conventions). If no template
page is configured, create a fresh top-level page instead of failing — ask once for a parent page/
workspace if none is known.

### 3. Obsidian path (if chosen)

No MCP required — an Obsidian vault is just a folder of markdown files. Under the given vault root:

```
<vault>/
└── <repo-name>/
    ├── Index.md              # manifest.yaml rendered as prose, links to every page below
    ├── Tech Stack.md
    ├── Entry Points.md
    ├── Directories.md
    └── Conventions.md
```

Every file gets YAML frontmatter (`tags: [repo-kb, <repo-name>]`) and uses `[[wikilinks]]` between
these pages (e.g. `Index.md` links `[[Tech Stack]]`, `[[Directories]]` links back to `[[Index]]`). Do
not invent Obsidian plugin-specific syntax (Dataview queries, canvas files) unless the human asks for
it — plain notes + wikilinks are the only thing guaranteed to render without extra setup.

### 4. Report back

State `manifest.yaml`'s path and, for each backend chosen, the resulting page URL or vault directory.
Don't invoke the design interview or any other skill from here — this is a standalone indexing step other
skills read from, not an orchestrator.

## Inputs you need from the user

- **Required:** which backend(s) — Notion, Obsidian, or both (Gate 0); for Obsidian, the vault root
  path; for Notion, the destination workspace/parent page (and template page URL, if reusing this
  repo's project-hub-template pattern).
- **Optional:** today's date, if it can't otherwise be determined, for `manifest.yaml`'s `generated`
  field.

## Output

`manifest.yaml` at the target repo's root (always), plus Notion pages and/or an Obsidian vault
subtree (per the chosen backend). Downstream, `ticket-intake`'s Ticket Brief and this file together
are what the `/grill-with-docs` design interview starts from.
