#!/usr/bin/env python3
"""Path A — run the doc-gen pipeline with the Claude Agent SDK (runs the LOCAL skills in your process).

This is the simplest path: no upload, no Managed Agents beta. The agent reads the skills from
<repo root>/.claude/skills (installed by `make install-claude-code`; setting_sources=["project"]), runs each stage, and you approve at each human gate.
Good for local use and Claude Code. For the hosted platform.claude.com agent, use provision_agent.py
+ run_pipeline.py (Path B) instead.

    pip install claude-agent-sdk pyyaml
    python run_pipeline_sdk.py --packet path/to/opportunity-packet.md

CAVEAT: the Agent SDK surface evolves. Verify `query` / `ClaudeAgentOptions` argument names against
your installed `claude-agent-sdk` version (docs: https://code.claude.com/docs/en/agent-sdk).
"""
import argparse, asyncio, os
from pathlib import Path
import yaml

try:
    from claude_agent_sdk import query, ClaudeAgentOptions
except ImportError:
    raise SystemExit("pip install claude-agent-sdk  (Python 3.10+)")

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[1]  # this script lives at <repo>/src/orchestrator/
CFG = yaml.safe_load((HERE / "pipeline.yaml").read_text())


async def run_stage(stage, input_text, skills_dir, model):
    """Run one stage by asking the agent to use that stage's skill on the input."""
    skill = stage["skill"]
    prompt = (
        f"Use the `{skill}` skill. Follow its SKILL.md and resources exactly, including every gated "
        f"phase and the reflection blocks.\n\n--- STAGE INPUT ---\n{input_text}"
    )
    options = ClaudeAgentOptions(
        model=model,
        # Expose the tools the skills need (Read/Write resources, Bash for the estimation fill script).
        # The SDK auto-discovers skills under the project's .claude/skills, so run from the repo root,
        # where `make install-claude-code` (prerequisite of `make run-sdk`) installs them. skills_dir
        # (pipeline.yaml) only documents the generated source; it is not used as the cwd.
        allowed_tools=["Read", "Write", "Bash", "Glob", "Grep"],
        setting_sources=["project"],
        cwd=str(REPO_ROOT),
    )
    out = ""
    async for message in query(prompt=prompt, options=options):
        if hasattr(message, "result") and message.result:
            out = message.result
    return out


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--packet", required=True, help="path to the Opportunity Packet (.md/.txt)")
    ap.add_argument("--out", default=str(HERE / "runs"))
    args = ap.parse_args()

    skills_dir = (HERE / CFG.get("skills_dir", "../../plugins/rs-scoping/skills")).resolve()
    model = CFG.get("model", "claude-opus-4-8")
    outdir = Path(args.out); outdir.mkdir(parents=True, exist_ok=True)

    artifacts = {"opportunity_packet": Path(args.packet).read_text()}

    for stage in CFG["stages"]:
        print(f"\n=== Stage: {stage['id']} ({stage['skill']}) — {stage.get('summary','')} ===")
        # assemble inputs declared in pipeline.yaml
        parts = []
        for key in stage["inputs"]:
            parts.append(artifacts.get(key) or artifacts.get(key.replace(".md", "")) or f"[missing input: {key}]")
        result = await run_stage(stage, "\n\n".join(parts), skills_dir, model)

        out_name = stage.get("output", f"{stage['id']}.md")
        (outdir / out_name).write_text(result or "")
        artifacts[out_name] = result
        # alias bare keys (e.g. component-inventory.md) so later stages can reference them
        artifacts[stage["id"]] = result
        print(f"   -> wrote {outdir / out_name}")

        if stage.get("human_gate"):
            input(f"   [human gate] review {out_name}, then press Enter to continue (Ctrl-C to stop)… ")

    print("\nPipeline complete. Artifacts in", outdir)


if __name__ == "__main__":
    asyncio.run(main())
