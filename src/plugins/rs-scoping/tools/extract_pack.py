#!/usr/bin/env python3
"""Extract the Master Context Pack (§1–§17) from the live estimation prompt into a standalone
skill resource. Run from the repo root (the Makefile's `sync` target calls this)."""
from pathlib import Path

SRC = Path("src/plugins/rs-scoping/prompts/04-estimation-agent/current/estimation-generation-from-prd-v1.6.md")
OUT = Path("plugins/rs-scoping/skills/estimation-generator/resources/master-context-pack.md")

lines = SRC.read_text(encoding="utf-8").splitlines()
start = next(i for i, l in enumerate(lines) if "EMBEDDED CONTEXT — Master Context Pack" in l)
end = next(i for i, l in enumerate(lines) if "End of embedded Master Context Pack" in l)
header = (
    "---\n"
    'name: "Master Context Pack v1.0"\n'
    'source: "extracted from estimation-generation-from-prd-v1.6.md"\n'
    'note: "Rate VALUES are superseded by the Estimation Template Cost/Price Rate Card tabs (see §9.2)."\n'
    "---\n\n"
)
OUT.write_text(header + "\n".join(lines[start:end + 1]) + "\n", encoding="utf-8")
print(f"  extracted Master Context Pack ({end - start + 1} lines) -> {OUT}")
