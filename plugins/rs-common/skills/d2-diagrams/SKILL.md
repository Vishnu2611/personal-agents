---
name: d2-diagrams
description: Write and render D2 diagrams (the D2 diagramming language / d2lang, d2.dev, Terrastruct's D2) to SVG or PNG image files. Use this skill whenever the user explicitly says "D2", "D2 diagram", "D2lang", or references a .d2 file. This skill uses the official @terrastruct/d2 WASM build via Node.js — no Go toolchain, no Graphviz, and no external network access required. Do NOT use this skill for Mermaid, Graphviz/DOT, PlantUML, or generic "draw me a diagram" requests unless D2 is explicitly named.
---

# D2 Diagrams

Write D2 source and render it to SVG/PNG using the bundled Node.js script. D2 is Terrastruct's declarative diagramming language (not related to Graphviz — it has its own layout engines: dagre, elk, tala).

## Workflow

1. **Write the D2 source** based on what the user wants (architecture diagram, flowchart, sequence-like flow, etc). Save it as a `.d2` file, e.g. `/home/claude/diagram.d2`. D2 syntax basics:
   - Nodes: `a`, `a.shape: cylinder`
   - Edges: `a -> b`, `a -> b: label`
   - Containers: `a.b.c` creates nested containment
   - Styling: `a.style.fill: "#f0f0f0"`
   - Full syntax reference: https://d2lang.com/tour/intro (fetch if you need details beyond common patterns)

2. **Render it** using the bundled script:
   ```bash
   node /mnt/skills/user/d2-diagrams/scripts/render.mjs /home/claude/diagram.d2 /mnt/user-data/outputs/diagram.png
   ```
   - Output extension determines format: `.svg` for SVG only, `.png` for PNG (also produces a matching `.svg` alongside it).
   - Optional flags: `--layout=elk` (alternative to default dagre), `--theme=<id>` (D2 theme ID), `--sketch` (hand-drawn style).
   - The script depends on `node_modules` already installed in the skill directory (`@terrastruct/d2` and `sharp`). If `node_modules` is missing, run `npm install` inside the skill's own directory first — do NOT run it from `/home/claude`.

3. **Present the result** to the user with `present_files` pointing at the output file(s) in `/mnt/user-data/outputs`.

## Notes

- No internet access is needed at render time — the WASM build is fully self-contained, so this works fine under restricted network egress.
- If rendering fails, the error is usually a D2 syntax issue (unclosed braces, bad shape name) — read the stderr output, it's a real D2 compiler error, and fix the `.d2` source rather than the script.
- For diagrams with many nodes, prefer `--layout=elk` if `dagre` produces messy crossings.
- Keep D2 source readable: group related nodes into containers rather than one flat list of edges.
