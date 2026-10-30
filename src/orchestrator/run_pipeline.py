#!/usr/bin/env python3
"""Path B (2/2) — run the pipeline on the hosted Managed Agent (platform.claude.com, BETA).

Opens one session against the provisioned agent and runs the four stages sequentially, threading each
stage's text output into the next, pausing at each human gate, and downloading the estimation .xlsx at
the end via the Files API.

    python provision_agent.py        # once — creates the agent + environment
    python run_pipeline.py --packet path/to/opportunity-packet.md

CAVEAT: BETA surface. Verify client.beta.sessions.* and client.beta.files.* method names + event
types (user.message / agent.message / session.status_idle) against current docs before production.
"""
import argparse, json
from pathlib import Path
import yaml
from anthropic import Anthropic

HERE = Path(__file__).parent
CFG = yaml.safe_load((HERE / "pipeline.yaml").read_text())
BETA = CFG["platform"]["beta"]
FILES_BETA = CFG["platform"]["files_beta"]
IDS = json.loads((HERE / CFG["platform"]["ids_file"]).read_text())

client = Anthropic(default_headers={"anthropic-beta": f"{BETA},{FILES_BETA}"})


def parse_hub_url(text):
    """Pull the new hub page URL out of the bootstrap reply (last 'HUB_URL: ...' line)."""
    for line in reversed((text or "").splitlines()):
        line = line.strip()
        if line.upper().startswith("HUB_URL:"):
            return line.split(":", 1)[1].strip()
    return ""


def create_project_hub(session_id, template, packet_name):
    """Duplicate the template page via the Notion MCP and return the new page's URL ('' on failure)."""
    reply = stream_stage(
        session_id,
        "Use the Notion MCP server. Duplicate the Notion page at this URL to create a fresh project "
        f"hub for this run:\n{template}\n\n"
        f'Rename the new page to: "{packet_name} — Project Hub".\n'
        "Then reply with ONLY the new page's URL as the final line, prefixed exactly with 'HUB_URL: '. "
        "Do not write anything after that line.",
    )
    return parse_hub_url(reply)


def stream_stage(session_id, prompt):
    """Send one user message and collect the agent's reply text until the session goes idle."""
    text = ""
    with client.beta.sessions.events.stream(session_id) as stream:
        client.beta.sessions.events.send(
            session_id,
            events=[{"type": "user.message", "content": [{"type": "text", "text": prompt}]}],
        )
        for event in stream:
            if event.type == "agent.message":
                for block in getattr(event, "content", []):
                    text += getattr(block, "text", "")
            elif event.type == "session.status_idle":
                break
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--packet", required=True)
    ap.add_argument("--out", default=str(HERE / "runs"))
    args = ap.parse_args()
    outdir = Path(args.out); outdir.mkdir(parents=True, exist_ok=True)

    session = client.beta.sessions.create(
        agent=IDS["agent_id"],
        environment_id=IDS["environment_id"],
        vault_ids=[CFG["notion"]["vault_id"]] if not CFG["notion"]["vault_id"].startswith("<") else [],
    )
    sid = session.id
    print("Session:", sid)

    # Project hub: reuse an existing page if configured, otherwise duplicate the template to make a
    # fresh hub for this run. Becomes the write-back destination for each stage's output.
    notion = CFG["notion"]
    hub_url = (notion.get("project_hub") or "").strip()
    template = (notion.get("project_hub_template") or "").strip()
    if not hub_url and template and not template.startswith("<"):
        print("\n=== Bootstrap: creating project hub (duplicating template) ===")
        hub_url = create_project_hub(sid, template, Path(args.packet).stem)
        if hub_url:
            print(f"   -> project hub: {hub_url}")
        else:
            print("   [warn] could not parse the new hub URL from the agent reply; "
                  "write-back is disabled for this run.")

    artifacts = {"opportunity_packet": Path(args.packet).read_text()}

    for stage in CFG["stages"]:
        print(f"\n=== Stage: {stage['id']} ({stage['skill']}) ===")
        inputs = "\n\n".join(artifacts.get(k, f"[missing: {k}]") for k in stage["inputs"])
        prompt = (
            f"Use the `{stage['skill']}` skill and follow its SKILL.md exactly.\n\n"
            f"--- STAGE INPUT ---\n{inputs}"
        )
        if notion.get("write_back") and hub_url:
            prompt += (
                f"\n\n--- WRITE-BACK ---\nAfter producing the output, use the Notion MCP to add it as "
                f"a new sub-page titled '{stage['id']}' under the project hub at {hub_url}."
            )
        result = stream_stage(sid, prompt)
        out_name = stage.get("output", f"{stage['id']}.md")
        (outdir / out_name).write_text(result or "")
        artifacts[out_name] = result
        artifacts[stage["id"]] = result
        print(f"   -> {outdir / out_name}")

        # the estimation stage produces an .xlsx inside the container — pull it via the Files API
        if stage.get("produces_file"):
            try:
                files = client.beta.files.list()
                xlsx = next((f for f in files.data if f.filename.endswith(".xlsx")), None)
                if xlsx:
                    content = client.beta.files.download(xlsx.id)
                    dest = outdir / "estimation.xlsx"
                    with open(dest, "wb") as fh:
                        fh.write(content.read() if hasattr(content, "read") else content)
                    print(f"   -> downloaded {dest}")
            except Exception as e:
                print(f"   [files] could not auto-download the .xlsx ({e}); fetch it from the session output.")

        if stage.get("human_gate"):
            input(f"   [human gate] review {out_name}, then Enter to continue (Ctrl-C to stop)… ")

    print("\nPipeline complete. Artifacts in", outdir)


if __name__ == "__main__":
    main()
