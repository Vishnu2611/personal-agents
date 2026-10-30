// Renders a .d2 file to SVG (and optionally PNG) using the official
// @terrastruct/d2 WASM build. No Go toolchain or native binary needed.
//
// Usage:
//   node render.mjs <input.d2> <output.svg> [--layout=dagre|elk] [--theme=<id>] [--sketch]
//
// PNG output: if the output path ends in .png, this script renders SVG first
// then rasterizes it with sharp (falls back to leaving SVG only if sharp
// isn't available).

import { D2 } from "@terrastruct/d2";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

async function main() {
  const [inputPath, outputPath, ...flags] = process.argv.slice(2);

  if (!inputPath || !outputPath) {
    console.error("Usage: node render.mjs <input.d2> <output.svg|.png> [--layout=dagre|elk] [--theme=N] [--sketch]");
    process.exit(1);
  }

  const opts = {};
  for (const flag of flags) {
    if (flag === "--sketch") opts.sketch = true;
    else if (flag.startsWith("--layout=")) opts.layout = flag.split("=")[1];
    else if (flag.startsWith("--theme=")) opts.themeID = parseInt(flag.split("=")[1], 10);
  }

  const source = await readFile(inputPath, "utf-8");

  const d2 = new D2();
  const compileResult = await d2.compile(source, {
    layout: opts.layout || "dagre",
    sketch: !!opts.sketch,
  });

  const renderOpts = {};
  if (opts.themeID !== undefined) renderOpts.themeID = opts.themeID;
  if (opts.sketch) renderOpts.sketch = true;

  const svg = await d2.render(compileResult.diagram, renderOpts);

  const ext = path.extname(outputPath).toLowerCase();

  if (ext === ".png") {
    const svgPath = outputPath.replace(/\.png$/i, ".svg");
    await writeFile(svgPath, svg, "utf-8");
    try {
      const sharp = (await import("sharp")).default;
      const pngBuffer = await sharp(Buffer.from(svg), { density: 200 }).png().toBuffer();
      await writeFile(outputPath, pngBuffer);
      console.log(`Rendered SVG: ${svgPath}`);
      console.log(`Rendered PNG: ${outputPath}`);
    } catch (err) {
      console.log(`Rendered SVG: ${svgPath}`);
      console.log(`PNG conversion skipped (sharp not installed): ${err.message}`);
    }
  } else {
    await writeFile(outputPath, svg, "utf-8");
    console.log(`Rendered SVG: ${outputPath}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("D2 render failed:");
  console.error(err.message || err);
  process.exit(1);
});
