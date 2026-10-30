#!/usr/bin/env node
'use strict';
// PreToolUse hook for the Skill tool: deny a planning skill (lib/mcp.cjs PLANNING) while an MCP
// server the project requires (.rs-harness.json "required_mcp") is signed out or broken.
const { planningDenial, isPlanningSkill } = require('./lib/mcp.cjs');
const { repoRoot } = require('./lib/git.cjs');
const { denial } = require('./pre-bash.cjs');

async function decide(input) {
  if (!input || input.tool_name !== 'Skill') return null;
  const skill = input.tool_input && input.tool_input.skill;
  if (!isPlanningSkill(skill)) return null;
  const root = repoRoot(input.cwd || process.cwd());
  return root ? planningDenial(root, skill) : null;
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => { raw += d; });
process.stdin.on('end', async () => {
  let input;
  try { input = JSON.parse(raw); } catch { return; }
  const reason = await decide(input);
  if (reason) process.stdout.write(`${JSON.stringify(denial(`[rs-guard:mcp] ${reason}`))}\n`);
});
