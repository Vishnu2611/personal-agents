'use strict';
// rs-doctor --install against a local fake gstack remote (no network), the `installers` guard, and
// the `npx rightshift-skills doctor` pass-through.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { HOOKS, tempRepo, healthyEnv, runHook, bashInput, denied, git } = require('./helpers.cjs');

const REPO_ROOT = path.resolve(HOOKS, '..', '..', '..', '..');

// A bare "gstack" remote whose ./setup records its arguments, and a pins file pointing at it.
function fakeRemote(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-gstack-remote-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const work = path.join(dir, 'work');
  fs.mkdirSync(path.join(work, 'bin'), { recursive: true });
  fs.writeFileSync(path.join(work, 'bin', 'gstack-config'), '');
  fs.writeFileSync(path.join(work, 'setup'), '#!/bin/sh\necho "$@" > setup-ran.txt\n', { mode: 0o755 });
  fs.writeFileSync(path.join(work, '.gitignore'), 'setup-ran.txt\n');
  git(work, 'init', '-q', '-b', 'main');
  git(work, 'add', '.');
  git(work, '-c', 'user.email=t@e.x', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'gstack');
  const sha = git(work, 'rev-parse', 'HEAD');
  git(dir, 'clone', '-q', '--bare', work, 'gstack.git');
  const pins = JSON.parse(fs.readFileSync(healthyEnv().RS_HARNESS_PINS, 'utf8'));
  pins.gstack.repo = `file://${path.join(dir, 'gstack.git')}`;
  pins.gstack.commit = sha;
  const pinsFile = path.join(dir, 'pins.json');
  fs.writeFileSync(pinsFile, JSON.stringify(pins));
  const home = path.join(dir, 'home');
  const config = path.join(home, '.claude-test');
  fs.mkdirSync(path.join(config, 'plugins'), { recursive: true });
  fs.copyFileSync(path.join(healthyEnv().CLAUDE_CONFIG_DIR, 'plugins', 'installed_plugins.json'),
    path.join(config, 'plugins', 'installed_plugins.json'));
  return {
    sha, home, target: path.join(config, 'skills', 'gstack'),
    env: { HOME: home, CLAUDE_CONFIG_DIR: config, RS_HARNESS_PINS: pinsFile },
  };
}

const doctor = (args, env, opts = {}) => spawnSync('node', [path.join(HOOKS, 'bin', 'rs-doctor.cjs'), ...args],
  { encoding: 'utf8', env: { ...process.env, ...healthyEnv(), ...env }, input: '', ...opts });

test('--install --yes puts gstack at the pinned commit and runs ./setup --no-team', (t) => {
  const f = fakeRemote(t);
  const r = doctor(['--install', '--yes'], f.env);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /gstack will be put at the pinned commit/);
  assert.match(r.stdout, /ok +gstack: /);
  assert.equal(git(f.target, 'rev-parse', 'HEAD'), f.sha);
  assert.equal(fs.readFileSync(path.join(f.target, 'setup-ran.txt'), 'utf8').trim(), '--no-team');
  assert.equal(doctor([], f.env).status, 0);
});

test('--install without --yes and without a terminal changes nothing', (t) => {
  const f = fakeRemote(t);
  const r = doctor(['--install'], f.env);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /re-run with --yes/);
  assert.equal(fs.existsSync(f.target), false);
});

// util-linux `script` runs the command on a real terminal, feeding it our stdin as keystrokes.
const hasScript = process.platform === 'linux' && spawnSync('script', ['--version']).status === 0;
const inTerminal = (f, answer) => spawnSync('script', ['-qec',
  `node "${path.join(HOOKS, 'bin', 'rs-doctor.cjs')}" --install`, '/dev/null'],
{ encoding: 'utf8', input: `${answer}\n`, env: { ...process.env, ...healthyEnv(), ...f.env } });

test('--install in a terminal waits for the answer: n cancels', { skip: !hasScript }, (t) => {
  const f = fakeRemote(t);
  const r = inTerminal(f, 'n');
  assert.match(r.stdout, /Proceed\? \[y\/N\]/);
  assert.match(r.stdout, /Cancelled/);
  assert.equal(fs.existsSync(path.join(f.target, 'bin')), false);
});

test('--install in a terminal waits for the answer: y installs', { skip: !hasScript }, (t) => {
  const f = fakeRemote(t);
  const r = inTerminal(f, 'y');
  assert.match(r.stdout, /ok +gstack: /, r.stdout);
  assert.equal(git(f.target, 'rev-parse', 'HEAD'), f.sha);
});

test('a missing CLAUDE_CONFIG_DIR is called out', (t) => {
  const f = fakeRemote(t);
  const r = doctor([], { ...f.env, CLAUDE_CONFIG_DIR: '' });
  assert.match(r.stdout, /Note: CLAUDE_CONFIG_DIR is not set, so this checked .*\.claude\b/);
  assert.doesNotMatch(doctor([], f.env).stdout, /CLAUDE_CONFIG_DIR is not set/);
});

test('--install moves an off-pin checkout to the pin', (t) => {
  const f = fakeRemote(t);
  doctor(['--install', '--yes'], f.env);
  fs.writeFileSync(path.join(f.target, 'new.txt'), 'x');
  git(f.target, 'add', 'new.txt');
  git(f.target, '-c', 'user.email=t@e.x', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'drift');
  assert.match(doctor([], f.env).stdout, /MISS gstack: at \w{12}/);
  const r = doctor(['--install', '--yes'], f.env);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(git(f.target, 'rev-parse', 'HEAD'), f.sha);
});

test('--install refuses a dirty checkout or a foreign directory', (t) => {
  const f = fakeRemote(t);
  fs.mkdirSync(f.target, { recursive: true });
  fs.writeFileSync(path.join(f.target, 'notes.txt'), 'mine');
  let r = doctor(['--install', '--yes'], f.env);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /exists and is not a gstack install/);
  fs.rmSync(f.target, { recursive: true });

  doctor(['--install', '--yes'], f.env);
  fs.appendFileSync(path.join(f.target, 'setup'), '# local edit\n');
  git(f.target, 'checkout', '-q', '--detach', 'HEAD');
  fs.writeFileSync(path.join(f.target, 'bin', 'gstack-config'), 'edited');
  const pins = JSON.parse(fs.readFileSync(f.env.RS_HARNESS_PINS, 'utf8'));
  pins.gstack.commit = '0'.repeat(40);
  const off = path.join(f.home, 'off-pins.json');
  fs.writeFileSync(off, JSON.stringify(pins));
  r = doctor(['--install', '--yes'], { ...f.env, RS_HARNESS_PINS: off });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /not a clean git checkout/);
});

test('--install with everything present does nothing', () => {
  const r = doctor(['--install', '--yes'], {});
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Nothing to install/);
});

test('the agent may not run the installer', (t) => {
  const dir = tempRepo(t);
  for (const cmd of [
    'node /x/plugins/rs-guard/hooks/bin/rs-doctor.cjs --install --yes',
    'cd /tmp && node "$HOME/rs-doctor.cjs" --install',
    'npx rightshift-skills doctor --install --yes',
    'node bin/install.js doctor --install',
  ]) {
    const r = runHook('pre-bash.cjs', bashInput(cmd, dir));
    assert.ok(denied(r), cmd);
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /\[rs-guard:installers\] Blocked/, cmd);
  }
  for (const cmd of ['node /x/rs-doctor.cjs', 'npx rightshift-skills doctor', 'echo "rs-doctor --install"']) {
    assert.equal(runHook('pre-bash.cjs', bashInput(cmd, dir)).stdout, '', cmd);
  }
});

test('npx rightshift-skills doctor runs the same doctor', () => {
  const r = spawnSync('node', [path.join(REPO_ROOT, 'bin', 'install.js'), 'doctor'],
    { encoding: 'utf8', env: { ...process.env, ...healthyEnv() } });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /ok +gstack: /);
});
