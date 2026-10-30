'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOKS = path.resolve(__dirname, '..', '..', 'hooks');

function git(cwd, ...args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
}

// Fresh repo on `branch` with one commit and a tracked file; removed after the test.
function tempRepo(t, { branch = 'feat/x' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-hooks-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'config', 'user.email', 't@example.com');
  git(dir, 'config', 'user.name', 't');
  git(dir, 'config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'a\n');
  fs.writeFileSync(path.join(dir, '.gitignore'), '.rs-receipts/\n');
  git(dir, 'add', 'a.txt', '.gitignore');
  git(dir, 'commit', '-qm', 'init');
  if (branch !== 'main') git(dir, 'switch', '-qc', branch);
  return dir;
}

// A machine where every required tool is present: stub bun/gh on PATH, a fake gstack checkout
// pinned via RS_HARNESS_PINS, and mattpocock-skills in installed_plugins.json. Built once per process.
let healthy = null;
function healthyEnv() {
  if (healthy) return healthy;
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-home-'));
  process.on('exit', () => fs.rmSync(home, { recursive: true, force: true }));
  const bin = path.join(home, 'bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'bun'), '#!/bin/sh\necho 1.3.9\n', { mode: 0o755 });
  fs.writeFileSync(path.join(bin, 'gh'), '#!/bin/sh\necho "gh version 2.45.0 (2025-07-18)"\n', { mode: 0o755 });
  const gstack = path.join(home, '.claude', 'skills', 'gstack');
  fs.mkdirSync(path.join(gstack, 'bin'), { recursive: true });
  fs.writeFileSync(path.join(gstack, 'bin', 'gstack-config'), '');
  // Stand-in for gstack's review reader: a CURRENT review unless RS_TEST_REVIEW_ROWS names a file
  // whose content to print instead (e.g. NO_REVIEWS, or a STALE row).
  fs.writeFileSync(path.join(gstack, 'bin', 'gstack-review-read'), [
    '#!/bin/sh',
    'if [ -n "$RS_TEST_REVIEW_ROWS" ]; then cat "$RS_TEST_REVIEW_ROWS"; else',
    '  echo \'{"skill":"review","status":"clean","review_freshness":{"status":"CURRENT","reason":"completed clean pass on unchanged content"}}\'',
    'fi',
    'echo "---CONFIG---"; echo false; echo "---HEAD---"; echo abc',
  ].join('\n') + '\n', { mode: 0o755 });
  git(gstack, 'init', '-q');
  git(gstack, 'add', '.');
  git(gstack, '-c', 'user.email=t@example.com', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'gstack');
  const pins = JSON.parse(fs.readFileSync(path.join(HOOKS, 'pins.json'), 'utf8'));
  pins.gstack.commit = git(gstack, 'rev-parse', 'HEAD');
  const pinsFile = path.join(home, 'pins.json');
  fs.writeFileSync(pinsFile, JSON.stringify(pins));
  const config = path.join(home, '.claude-test');
  fs.mkdirSync(path.join(config, 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(config, 'plugins', 'installed_plugins.json'), JSON.stringify({
    version: 2, plugins: { 'mattpocock-skills@mattpocock': [{ scope: 'user', version: '1.3.1' }] },
  }));
  healthy = {
    HOME: home, CLAUDE_CONFIG_DIR: config, GSTACK_ROOT: '', RS_HARNESS_PINS: pinsFile,
    PATH: `${bin}${path.delimiter}${process.env.PATH}`,
  };
  return healthy;
}

// Run the real hook process the way Claude Code does: JSON on stdin, decision on stdout.
// Defaults to a healthy-tools environment; pass env overrides to break one.
function runHook(script, input, env = {}) {
  const r = spawnSync('node', [path.join(HOOKS, script)], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, ...healthyEnv(), ...env },
  });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, json: r.stdout.trim() ? JSON.parse(r.stdout) : null };
}

const bashInput = (command, cwd) => ({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command }, cwd });

function denied(result) {
  const o = result.json && result.json.hookSpecificOutput;
  return Boolean(o && o.hookEventName === 'PreToolUse' && o.permissionDecision === 'deny');
}

module.exports = { HOOKS, git, tempRepo, healthyEnv, runHook, bashInput, denied };
