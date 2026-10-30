#!/usr/bin/env python3
"""Path B (1/2) — provision the hosted agent on platform.claude.com (Managed Agents, BETA).

Creates ONE agent that holds all four skills + the Notion MCP server, plus a cloud environment, and
writes their IDs to runs/agent.ids.json for run_pipeline.py.

PREREQUISITES (do these first — they are NOT a YAML upload):
  1. Upload each skill folder under ../../plugins/rs-scoping/skills to your workspace (Console → Skills, or the `ant` CLI),
     and paste the returned skill_id values into pipeline.yaml -> platform.skills.
  2. Create a vault holding the Notion OAuth credential and put its id in pipeline.yaml -> notion.vault_id.
     e.g.  ant beta:vaults create --name notion-auth --credential '{type: mcp_oauth, mcp_server_url: "https://mcp.notion.com/mcp", ...}'
  3. export ANTHROPIC_API_KEY=...

    pip install anthropic pyyaml
    python provision_agent.py

CAVEAT: Managed Agents is BETA — verify resource/method names (client.beta.agents.create,
client.beta.environments.create), the tool type strings ("agent_toolset_20260401"), and the beta
header against current docs: https://platform.claude.com/docs/en/managed-agents/overview
"""
import json
from pathlib import Path
import yaml
from anthropic import Anthropic

HERE = Path(__file__).parent
CFG = yaml.safe_load((HERE / "pipeline.yaml").read_text())
BETA = CFG["platform"]["beta"]

client = Anthropic(default_headers={"anthropic-beta": BETA})


def build_skills():
    skills = []
    for folder, sid in CFG["platform"]["skills"].items():
        if not sid or sid.startswith("<"):
            raise SystemExit(f"Skill '{folder}' has no skill_id in pipeline.yaml — upload it first.")
        skills.append({"type": "custom", "skill_id": sid, "version": "latest"})
    # the estimation skill also benefits from the pre-built xlsx skill:
    skills.append({"type": "anthropic", "skill_id": "xlsx"})
    return skills


def main():
    notion = CFG["notion"]
    agent = client.beta.agents.create(
        name=CFG["name"],
        model=CFG["model"],
        system=(
            "You orchestrate the IntuitioLabs doc-gen pipeline: BRD -> PRD -> Technical Design -> "
            "Estimation. For each stage use the matching skill and follow its SKILL.md exactly, "
            "including the gated phases and reflection blocks. Thread each stage's output into the "
            "next. Read inputs from and write approved outputs to Notion when asked."
        ),
        tools=[
            {"type": "agent_toolset_20260401"},                       # Bash/Read/Write/etc.
            {"type": "mcp_toolset", "mcp_server_name": "notion"},     # must match the server name below
        ],
        skills=build_skills(),
        mcp_servers=[
            {"type": "url", "name": "notion", "url": notion["mcp_url"]},
        ],
    )

    env = client.beta.environments.create(
        name=f"{CFG['name']}-env",
        config={
            "type": CFG["platform"]["environment"]["type"],
            "networking": {"type": CFG["platform"]["environment"]["networking"]},
        },
    )

    ids = {"agent_id": agent.id, "environment_id": env.id}
    ids_path = HERE / CFG["platform"]["ids_file"]
    ids_path.parent.mkdir(parents=True, exist_ok=True)
    ids_path.write_text(json.dumps(ids, indent=2))
    print("Provisioned:")
    print(json.dumps(ids, indent=2))
    print(f"  -> wrote {ids_path}")


if __name__ == "__main__":
    main()
