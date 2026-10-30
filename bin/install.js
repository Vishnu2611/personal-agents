#!/usr/bin/env node
/**
 * Install the RightShift rs-* skills into a Claude Code skills directory.
 *
 *   npx rightshift-skills            install into ./.claude/skills (current project)
 *   npx rightshift-skills --global   install into ~/.claude/skills (all projects)
 *   npx rightshift-skills doctor     check the tools the rs-guard gates require (gstack, Matt's skills, …)
 *   npx rightshift-skills doctor --install   put gstack at the pinned commit (asks first)
 *   npx rightshift-skills --help
 *
 * Copies each skill folder from this package's plugins/<name>/skills/ into the target, overwriting any
 * existing same-named skill. Idempotent. No postinstall hook by design — run this explicitly.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");

const args = process.argv.slice(2);
if (args[0] === "doctor") {
  // Delegate to rs-guard's doctor so both entry points give the same report and fixes.
  const doctor = path.join(__dirname, "..", "plugins", "rs-guard", "hooks", "bin", "rs-doctor.cjs");
  const r = require("child_process").spawnSync(process.execPath, [doctor, ...args.slice(1)], { stdio: "inherit" });
  process.exit(r.status === null ? 1 : r.status);
}
if (args.includes("--help") || args.includes("-h")) {
  console.log(
    [
      "Usage: rightshift-skills [--global]",
      "       rightshift-skills doctor [--install [--yes]]",
      "  (default)  install into ./.claude/skills (current project)",
      "  --global   install into ~/.claude/skills (all projects)",
      "  doctor     check the tools the rs-guard gates require; --install puts gstack at the pinned commit",
    ].join("\n")
  );
  process.exit(0);
}

const useGlobal = args.includes("--global");
const pkgPlugins = path.join(__dirname, "..", "plugins");
const targetBase = useGlobal ? os.homedir() : process.cwd();
const target = path.join(targetBase, ".claude", "skills");

if (!fs.existsSync(pkgPlugins)) {
  console.error(`error: plugins/ not found in package at ${pkgPlugins}`);
  process.exit(1);
}
fs.mkdirSync(target, { recursive: true });

let n = 0;
for (const p of fs.readdirSync(pkgPlugins, { withFileTypes: true })) {
  const skillsDir = path.join(pkgPlugins, p.name, "skills");
  if (!p.isDirectory() || !fs.existsSync(skillsDir)) continue;
  for (const d of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const from = path.join(skillsDir, d.name);
    if (!fs.existsSync(path.join(from, "SKILL.md"))) continue; // only real skills
    const to = path.join(target, d.name);
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true });
    console.log(`  installed ${d.name} (${p.name})`);
    n++;
  }
}
console.log(`\n${n} skill(s) installed into ${target}`);
