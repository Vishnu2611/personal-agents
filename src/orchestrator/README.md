# Orchestrator — run the doc-gen chain as one agent

Runs **BRD → PRD → Technical Design → Estimation** as a single pipeline, each stage backed by one of
the four skills in [`../../plugins/rs-scoping/skills/`](../../plugins/rs-scoping/skills/), with a human approval gate between stages and the
`.xlsx` carried through to the end.

## First, the correction on "a YAML file"

**platform.claude.com (Managed Agents) does NOT consume a declarative YAML agent file.** A hosted
agent there is created via the **Managed Agents API** (JSON, through the `anthropic` SDK, with a beta
header). YAML *frontmatter* is only used inside each `SKILL.md` and inside Claude Code `.claude/agents/*.md`
subagents — not as a platform agent manifest.

So `pipeline.yaml` here is **the orchestrator's own config** (model, stages, gates, skill→id map,
Notion). The runner reads it and translates it into the right API calls. It survives either path below.

## Two ways to run

### Path A — Claude Agent SDK *(simplest; runs the local skills in your process / Claude Code)*
No upload, no beta. The agent loads the skills from `../../plugins/rs-scoping/skills` and runs the stages.
```bash
pip install -r requirements.txt
# point the SDK at a tree containing .claude/skills, or symlink the skills in:
mkdir -p .claude && ln -s ../../../plugins/rs-scoping/skills .claude/skills
python run_pipeline_sdk.py --packet path/to/opportunity-packet.md
```
Best for local runs, testing, and Claude Code (which can also render the D2 diagrams).

### Path B — Managed Agents *(hosted on platform.claude.com; BETA)* — what you asked for
A hosted agent holding all four skills + the Notion MCP.

1. **Upload the skills** (not a YAML upload): push each folder under `../../plugins/rs-scoping/skills` to your workspace via
   the Console (Skills) or the `ant` CLI (folders under `../../plugins/rs-scoping/skills`), and paste the returned `skill_id`s into
   `pipeline.yaml → platform.skills`.
2. **Create the Notion vault** (OAuth credential) and put its id in `pipeline.yaml → notion.vault_id`.
3. **Provision** the agent + environment, then **run**:
   ```bash
   export ANTHROPIC_API_KEY=...
   pip install -r requirements.txt
   python provision_agent.py        # creates the agent + cloud environment, writes runs/agent.ids.json
   python run_pipeline.py --packet path/to/opportunity-packet.md
   ```

## How a run flows

```
opportunity-packet ─► [brd skill] ─► brd.md ──(gate)──► [prd skill] ─► prd.md
   ──(gate)──► [technical-design skill] ─► component-inventory.md + diagrams/*.d2
   ──(gate)──► [estimation skill] ─► estimation.xlsx ──(gate)──► done
```
Each stage's output is the next stage's input (`pipeline.yaml → stages[].inputs`). `human_gate: true`
pauses for review. The estimation stage's `.xlsx` is produced by the skill's `fill_template.py` inside
the container and pulled out via the **Files API**.

## Files
| File | Purpose |
|---|---|
| `pipeline.yaml` | The pipeline definition + platform/Notion config the runners read |
| `.mcp.json` | Notion MCP server (for the Agent SDK / Claude Code path) |
| `run_pipeline_sdk.py` | **Path A** — Agent SDK runner (local skills) |
| `provision_agent.py` | **Path B** — create the hosted agent + environment (Managed Agents) |
| `run_pipeline.py` | **Path B** — run the hosted agent: session → stages → Files API |
| `requirements.txt` | `claude-agent-sdk` (A) / `anthropic` (B) / `pyyaml` |

## Beta / verification notes
- **Managed Agents** and the **Files API** are **beta** — the runners set the headers from
  `pipeline.yaml` (`managed-agents-2026-04-01`, `files-api-2025-04-14`). Verify the exact header
  values, resource names (`client.beta.agents/environments/sessions/files`), tool type strings
  (`agent_toolset_20260401`), and event types against current docs before production.
- **`.xlsx` via Files API:** files created by skills/code execution are downloadable; very large or
  non-standard types may need the `container_upload` flow — see the Files API docs.
- **D2 rendering** needs the `d2` binary (Claude Code / a render step) — the sandbox emits `.d2`/SVG only.
- **Notion auth** is OAuth via a vault on the Managed Agents path; via the Settings → Connectors on
  claude.ai; via `.mcp.json` on Claude Code. Permissions are always enforced by Notion.
