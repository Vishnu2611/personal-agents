#!/usr/bin/env node
'use strict';
// PreToolUse hook for Bash: run every rs-guard check over the command; deny listing every hit.
// Output: {"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny",...}} on
// stdout with exit 0 (https://code.claude.com/docs/en/hooks). No output = normal permission flow.
const { stepsOf } = require('./lib/shell.cjs');

const GUARDS = [
  require('./guards/dangerous-git.cjs'),
  require('./guards/verify-receipt.cjs'),
  require('./guards/prototype-gate.cjs'),
  require('./guards/qa-receipt.cjs'),
  require('./guards/spec-source.cjs'),
  require('./guards/review-gate.cjs'),
  require('./guards/dependencies.cjs'),
  require('./guards/installers.cjs'),
];

function decide(input) {
  if (!input || input.tool_name !== 'Bash') return null;
  const command = input.tool_input && input.tool_input.command;
  if (typeof command !== 'string' || !command.trim()) return null;
  const cwd = input.cwd || process.cwd();
  // steps: each command with the directory it runs in (after any `cd`); commands: just their argv.
  const steps = stepsOf(command, cwd);
  const ctx = { steps, commands: steps.map((s) => s.argv), rawCommand: command, cwd };
  const hits = [];
  for (const guard of GUARDS) {
    let reason;
    try {
      reason = guard.check(ctx);
    } catch (e) {
      // Guards only do work on commands they target, so failing closed here blocks only those.
      reason = `Blocked: rs-guard check '${guard.name}' failed (${e.message}). Ask the human.`;
    }
    if (reason) hits.push(`[rs-guard:${guard.name}] ${reason}`);
  }
  return hits.length ? hits.join('\n') : null;
}

function denial(reason) {
  return { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } };
}

if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => { raw += d; });
  process.stdin.on('end', () => {
    let input;
    try { input = JSON.parse(raw); } catch { return; }
    const reason = decide(input);
    if (reason) process.stdout.write(`${JSON.stringify(denial(reason))}\n`);
  });
}

module.exports = { decide, denial, GUARDS };
