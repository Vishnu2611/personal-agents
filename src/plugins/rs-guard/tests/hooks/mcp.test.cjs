'use strict';
// MCP sign-in checks: planning skills (agent-started via the Skill tool, or typed as /commands) are
// blocked while a server listed in .rs-harness.json "required_mcp" is signed out. `claude mcp get` is
// stubbed through RS_CLAUDE_BIN; RS_TEST_MCP maps server name -> the Status text it prints.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { HOOKS, tempRepo, runHook, healthyEnv, denied } = require('./helpers.cjs');

const stubDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-claude-'));
process.on('exit', () => fs.rmSync(stubDir, { recursive: true, force: true }));
const STUB = path.join(stubDir, 'claude');
fs.writeFileSync(STUB, [
  '#!/usr/bin/env node',
  "const name = process.argv[4]; const m = JSON.parse(process.env.RS_TEST_MCP || '{}');",
  "require('fs').appendFileSync(process.env.RS_TEST_CALLS, name + '\\n');",
  "if (!(name in m)) { console.log(`No MCP server found with name: ${name}`); process.exit(1); }",
  "if (m[name] === 'garbled') console.log('???'); else console.log(`${name}:\\n  Status: ${m[name]}\\n  Type: http`);",
].join('\n'), { mode: 0o755 });

function project(t, required = ['notion', 'linear']) {
  const dir = tempRepo(t);
  fs.writeFileSync(path.join(dir, '.rs-harness.json'), JSON.stringify({ role: 'be', required_mcp: required }));
  return dir;
}

function env(t, states) {
  const calls = path.join(stubDir, `calls-${Math.random().toString(36).slice(2)}`);
  fs.writeFileSync(calls, '');
  return { RS_CLAUDE_BIN: STUB, RS_TEST_MCP: JSON.stringify(states), RS_TEST_CALLS: calls, callsFile: calls };
}
const calls = (e) => fs.readFileSync(e.callsFile, 'utf8').split('\n').filter(Boolean);

const skill = (cwd, name, e) => runHook('pre-skill.cjs',
  { hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: name }, cwd }, e);
const prompt = (cwd, text, e) => runHook('prompt-submit.cjs', { hook_event_name: 'UserPromptSubmit', prompt: text, cwd }, e);
const reason = (r) => r.json.hookSpecificOutput.permissionDecisionReason;

function sessionStart(cwd, e) {
  const r = spawnSync('node', [path.join(HOOKS, 'bin', 'rs-doctor.cjs'), '--session-start'],
    { input: JSON.stringify({ cwd }), encoding: 'utf8', env: { ...process.env, ...healthyEnv(), ...e } });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout).hookSpecificOutput.additionalContext;
}

const OK = { notion: '✔ Connected', linear: '✔ Connected' };
const SIGNED_OUT = { notion: '! Needs authentication', linear: '✔ Connected' };

test('a planning skill runs when every required server is connected', (t) => {
  const dir = project(t);
  const e = env(t, OK);
  assert.equal(skill(dir, 'rs-delivery:spec-generator', e).stdout, '');
  assert.deepEqual(calls(e).sort(), ['linear', 'notion']);
});

test('a planning skill is denied while a required server needs sign-in', (t) => {
  const dir = project(t);
  const r = skill(dir, 'rs-delivery:spec-generator', env(t, SIGNED_OUT));
  assert.ok(denied(r));
  assert.match(reason(r), /\[rs-guard:mcp\] Blocked: `rs-delivery:spec-generator` reads project context through MCP/);
  assert.match(reason(r), /- notion needs sign-in: run `\/mcp`/);
  assert.doesNotMatch(reason(r), /- linear/);
});

test('missing, failed and pending servers block; unknown output does not', (t) => {
  const dir = project(t, ['notion', 'linear', 'jira']);
  const r = skill(dir, 'kickoff', env(t, { notion: '✗ Failed to connect', linear: '⏸ Pending approval' }));
  assert.match(reason(r), /- notion failed to connect/);
  assert.match(reason(r), /- linear is waiting for approval/);
  assert.match(reason(r), /- jira is not configured: add it to `\.mcp\.json`/);
  assert.equal(skill(project(t, ['notion']), 'kickoff', env(t, { notion: 'garbled' })).stdout, '');
});

test('a missing plugin server points at /plugin, not .mcp.json', (t) => {
  const dir = project(t, ['plugin:rs-delivery:notion']);
  const r = skill(dir, 'rs-delivery:kickoff', env(t, {}));
  assert.match(reason(r), /- plugin:rs-delivery:notion is not available: install and enable the plugin/);
  assert.equal(skill(project(t, ['plugin:rs-delivery:notion']), 'rs-delivery:kickoff',
    env(t, { 'plugin:rs-delivery:notion': '✔ Connected' })).stdout, '');
});

test('non-planning skills and projects without required_mcp are never checked', (t) => {
  const e = env(t, SIGNED_OUT);
  assert.equal(skill(project(t), 'mattpocock-skills:tdd', e).stdout, '');
  assert.equal(skill(project(t), 'other-plugin:kickoff', e).stdout, '');
  assert.equal(skill(tempRepo(t), 'rs-delivery:kickoff', e).stdout, '');
  assert.deepEqual(calls(e), []);
});

test('a connected result is cached; a signed-out one is checked again', (t) => {
  const dir = project(t, ['notion']);
  const e1 = env(t, { notion: '✔ Connected' });
  skill(dir, 'rs-delivery:kickoff', e1);
  const e2 = env(t, { notion: '! Needs authentication' });
  assert.equal(skill(dir, 'rs-delivery:kickoff', e2).stdout, '');
  assert.deepEqual(calls(e2), []);
  const other = project(t, ['notion']);
  const e3 = env(t, { notion: '! Needs authentication' });
  skill(other, 'rs-delivery:kickoff', e3);
  skill(other, 'rs-delivery:kickoff', e3);
  assert.deepEqual(calls(e3), ['notion', 'notion']);
});

test('a typed planning command is blocked; other prompts pass', (t) => {
  const dir = project(t);
  const e = env(t, SIGNED_OUT);
  for (const text of ['/grill-with-docs', '/mattpocock-skills:to-spec COM-12', '  /rs-delivery:ticket-intake COM-12']) {
    const r = prompt(dir, text, e);
    assert.equal(r.json && r.json.decision, 'block', text);
    assert.match(r.json.reason, /\[rs-guard:mcp\] Blocked: `\/[\w:-]+` reads project context/);
  }
  assert.equal(prompt(dir, '/implement specs/report', e).stdout, '');
  assert.equal(prompt(dir, 'please run /to-spec later', e).stdout, '');
});

test('session start warns about signed-out servers', (t) => {
  const dir = project(t);
  const ctx = sessionStart(dir, env(t, SIGNED_OUT));
  assert.match(ctx, /STOP: MCP servers this project needs for planning are not available/);
  assert.match(ctx, /- notion needs sign-in/);
  assert.doesNotMatch(sessionStart(project(t), env(t, OK)), /MCP/);
});
