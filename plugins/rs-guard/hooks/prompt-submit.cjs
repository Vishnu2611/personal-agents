#!/usr/bin/env node
'use strict';
// UserPromptSubmit hook: block a typed planning command (`/grill-with-docs`, `/rs-delivery:kickoff`, …)
// while an MCP server the project requires is signed out or broken. Skills the agent starts itself are
// checked by pre-skill.cjs.
const { planningDenial, isPlanningSkill } = require('./lib/mcp.cjs');
const { repoRoot } = require('./lib/git.cjs');

async function decide(input) {
  const m = String((input && input.prompt) || '').match(/^\s*\/([\w.:-]+)/);
  if (!m || !isPlanningSkill(m[1])) return null;
  const root = repoRoot(input.cwd || process.cwd());
  return root ? planningDenial(root, `/${m[1]}`) : null;
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => { raw += d; });
process.stdin.on('end', async () => {
  let input;
  try { input = JSON.parse(raw); } catch { return; }
  const reason = await decide(input);
  if (reason) process.stdout.write(`${JSON.stringify({ decision: 'block', reason: `[rs-guard:mcp] ${reason}` })}\n`);
});
