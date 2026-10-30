'use strict';
// rs-doctor and the dependencies guard: a missing required tool blocks only PR and push.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { HOOKS, tempRepo, healthyEnv, runHook, bashInput, denied, git } = require('./helpers.cjs');

const doctor = (args, env = {}, opts = {}) => spawnSync('node', [path.join(HOOKS, 'bin', 'rs-doctor.cjs'), ...args],
  { encoding: 'utf8', env: { ...process.env, ...healthyEnv(), ...env }, ...opts });
const receipt = (cwd) => spawnSync('node', [path.join(HOOKS, 'bin', 'rs-receipt.cjs'), 'verify', '--', 'true'], { cwd });

// Each way a machine can be missing something, as env overrides on top of the healthy env.
function brokenEnvs() {
  const h = healthyEnv();
  const noBunBin = path.join(h.HOME, 'nobun');
  if (!fs.existsSync(noBunBin)) {
    fs.mkdirSync(noBunBin);
    fs.writeFileSync(path.join(noBunBin, 'bun'), '#!/bin/sh\nexit 127\n', { mode: 0o755 });
  }
  const oldBunBin = path.join(h.HOME, 'oldbun');
  if (!fs.existsSync(oldBunBin)) {
    fs.mkdirSync(oldBunBin);
    fs.writeFileSync(path.join(oldBunBin, 'bun'), '#!/bin/sh\necho 1.2.0\n', { mode: 0o755 });
  }
  const emptyConfig = path.join(h.HOME, 'empty-config');
  fs.mkdirSync(emptyConfig, { recursive: true });
  const otherPins = path.join(h.HOME, 'other-pins.json');
  const pins = JSON.parse(fs.readFileSync(h.RS_HARNESS_PINS, 'utf8'));
  pins.gstack.commit = '0'.repeat(40);
  fs.writeFileSync(otherPins, JSON.stringify(pins));
  const emptyHome = path.join(h.HOME, 'empty-home');
  fs.mkdirSync(emptyHome, { recursive: true });
  return {
    'bun missing': { env: { PATH: `${noBunBin}${path.delimiter}${h.PATH}` }, match: /bun: not found/ },
    'bun too old': { env: { PATH: `${oldBunBin}${path.delimiter}${h.PATH}` }, match: /bun: 1\.2\.0 < 1\.3\.3/ },
    'gstack missing': { env: { HOME: emptyHome }, match: /gstack: not installed[\s\S]*git fetch --depth 1 origin/ },
    'gstack off pin': { env: { RS_HARNESS_PINS: otherPins }, match: /gstack: at \w{12} .*pinned 000000000000/ },
    'matt missing': { env: { CLAUDE_CONFIG_DIR: emptyConfig }, match: /mattpocock-skills: plugin not installed[\s\S]*claude plugin install mattpocock-skills@mattpocock/ },
  };
}

test('doctor passes on a healthy machine', () => {
  const r = doctor([]);
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /ok +gstack: 1\.91\.95\.0 @/);
  assert.match(r.stdout, /ok +mattpocock-skills: mattpocock-skills@mattpocock 1\.3\.1 \(user\)/);
});

test('doctor reports each missing tool with its exact fix', () => {
  for (const [label, { env, match }] of Object.entries(brokenEnvs())) {
    const r = doctor([], env);
    assert.equal(r.status, 1, label);
    assert.match(r.stdout, match, label);
    assert.match(r.stdout, /fix: /, label);
  }
});

test('matt installed for another project only does not count', (t) => {
  const dir = tempRepo(t);
  const config = path.join(healthyEnv().HOME, 'project-config');
  fs.mkdirSync(path.join(config, 'plugins'), { recursive: true });
  fs.writeFileSync(path.join(config, 'plugins', 'installed_plugins.json'), JSON.stringify({
    plugins: { 'mattpocock-skills@rightshift': [{ scope: 'project', projectPath: '/somewhere/else' }] } }));
  assert.match(doctor([], { CLAUDE_CONFIG_DIR: config }, { cwd: dir }).stdout, /MISS mattpocock-skills/);
  fs.writeFileSync(path.join(config, 'plugins', 'installed_plugins.json'), JSON.stringify({
    plugins: { 'mattpocock-skills@rightshift': [{ scope: 'project', projectPath: fs.realpathSync(dir) }] } }));
  assert.match(doctor([], { CLAUDE_CONFIG_DIR: config }, { cwd: dir }).stdout, /ok +mattpocock-skills: mattpocock-skills@rightshift \(project\)/);
});

test('an org-synced plugin counts; an older version warns but does not block', () => {
  const config = path.join(healthyEnv().HOME, 'synced-config');
  const plugin = path.join(config, 'plugins', 'synced', 'org_x', 'abc', '.claude-plugin');
  fs.mkdirSync(plugin, { recursive: true });
  fs.writeFileSync(path.join(plugin, 'plugin.json'), JSON.stringify({ name: 'mattpocock-skills', version: '1.2.3' }));
  const r = doctor([], { CLAUDE_CONFIG_DIR: config });
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /warn mattpocock-skills: mattpocock-skills \(org-synced\) 1\.2\.3 \(synced\)/);
  assert.match(r.stdout, /note: version 1\.2\.3 is older than the pinned v1\.3\.1/);
  const ctx = JSON.parse(doctor(['--session-start'], { CLAUDE_CONFIG_DIR: config }, { input: '' }).stdout)
    .hookSpecificOutput.additionalContext;
  assert.match(ctx, /Note: mattpocock-skills version 1\.2\.3 is older/);
  assert.doesNotMatch(ctx, /STOP/);
});

test('session-start mode always exits 0 with additionalContext', () => {
  const ok = doctor(['--session-start'], {}, { input: '{"cwd":"/"}' });
  assert.equal(ok.status, 0);
  const okCtx = JSON.parse(ok.stdout).hookSpecificOutput;
  assert.equal(okCtx.hookEventName, 'SessionStart');
  assert.match(okCtx.additionalContext, /rs-receipt\.cjs/);
  assert.doesNotMatch(okCtx.additionalContext, /STOP/);

  const bad = doctor(['--session-start'], brokenEnvs()['gstack missing'].env, { input: '' });
  assert.equal(bad.status, 0);
  const ctx = JSON.parse(bad.stdout).hookSpecificOutput.additionalContext;
  assert.match(ctx, /STOP: required tools .* are missing/);
  assert.match(ctx, /Do not run installers yourself/);
  assert.match(ctx, /gstack: not installed/);
});

test('missing dependency blocks push and non-draft PR only', (t) => {
  const dir = tempRepo(t);
  receipt(dir);
  const { env } = brokenEnvs()['gstack missing'];
  const run = (cmd) => runHook('pre-bash.cjs', bashInput(cmd, dir), env);

  const push = run('git push -u origin feat/x');
  assert.ok(denied(push));
  assert.match(push.json.hookSpecificOutput.permissionDecisionReason, /\[rs-guard:dependencies\] Blocked: required tools/);
  assert.ok(denied(run('gh pr create --fill')));

  for (const cmd of ['gh pr create --draft', 'git status', 'git commit -m x', 'npm test', 'ls']) {
    assert.equal(run(cmd).stdout, '', cmd);
  }
});

test('native Windows is reported with the WSL fix', () => {
  const { runChecks, missing } = require(path.join(HOOKS, 'bin', 'rs-doctor.cjs'));
  const failed = missing(runChecks({ platform: 'win32' }));
  assert.equal(failed.length, 1);
  assert.match(failed[0].fix, /WSL/);
});

test('healthy deps let a feature-branch push through', (t) => {
  const dir = tempRepo(t);
  assert.equal(runHook('pre-bash.cjs', bashInput('git push -u origin feat/x', dir)).stdout, '');
  git(dir, 'status');
});
