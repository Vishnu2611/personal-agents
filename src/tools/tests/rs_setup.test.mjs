// Template setup script (docs/templates/rightshift-project/scripts/rs-setup.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const TEMPLATE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'docs', 'templates', 'rightshift-project');
const SCRIPT = path.join(TEMPLATE, 'scripts', 'rs-setup.mjs');

function repo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-setup-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.cpSync(TEMPLATE, dir, { recursive: true });
  return dir;
}
const run = (cwd, ...args) => spawnSync('node', [SCRIPT, ...args], { cwd, encoding: 'utf8', input: '' });
const read = (dir, f) => fs.readFileSync(path.join(dir, f), 'utf8');
const NOTION = ['--notion-home', 'https://www.notion.so/acme/Compass-1a2b', '--prd', 'https://www.notion.so/acme/Compass-PRD-7a8b'];

test('a backend repo of a multi-repo project', (t) => {
  const dir = repo(t);
  const r = run(dir, '--role', 'be', '--prefix', 'com', '--tracker', 'linear', '--client', 'compass', ...NOTION);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(JSON.parse(read(dir, '.rs-harness.json')), {
    role: 'be', ticket_prefixes: ['COM'], required_mcp: ['plugin:rs-delivery:notion', 'plugin:rs-delivery:linear-server'],
  });
  const ctx = read(dir, 'docs/agents/project-context.md');
  assert.match(ctx, /# Project context — compass/);
  assert.match(ctx, /\| PRD \(approved\) \| <https:\/\/www\.notion\.so\/acme\/Compass-PRD-7a8b> \|/);
  assert.doesNotMatch(ctx, /Technical Design/);
  assert.match(ctx, /\*\*This repo:\*\* `compass-be`, role `be`/);
  assert.match(ctx, /\*\*Sibling repos:\*\* `compass-fe`, `compass-infra`/);
  assert.match(r.stdout, /Create api\/openapi\.yaml/);
  assert.match(r.stdout, /write access only to their own repo/);
});

test('a single repo without Notion drops the context file and the MCP requirement', (t) => {
  const dir = repo(t);
  const r = run(dir, '--role', 'single', '--prefix', 'RS', '--tracker', 'jira', '--client', 'acme', '--notion-home', '');
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(JSON.parse(read(dir, '.rs-harness.json')), { ticket_prefixes: ['RS'] });
  assert.equal(fs.existsSync(path.join(dir, 'docs/agents/project-context.md')), false);
});

test('a jira project requires the atlassian server', (t) => {
  const dir = repo(t);
  run(dir, '--role', 'fe', '--prefix', 'ACM', '--tracker', 'jira', '--client', 'acme', ...NOTION);
  assert.deepEqual(JSON.parse(read(dir, '.rs-harness.json')).required_mcp, ['plugin:rs-delivery:notion', 'plugin:rs-delivery:atlassian']);
});

test('bad input is refused and nothing is written', (t) => {
  const dir = repo(t);
  const r = run(dir, '--role', 'frontend', '--prefix', 'COM', '--tracker', 'linear', '--client', 'compass', '--notion-home', 'not-a-url');
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--role must be one of single, fe, be, infra/);
  assert.match(r.stderr, /--notion-home must be an http\(s\) URL/);
  assert.equal(fs.existsSync(path.join(dir, '.rs-harness.json')), false);
  const multi = run(dir, '--role', 'be', '--prefix', 'COM', '--tracker', 'linear', '--client', 'compass', '--notion-home', '');
  assert.match(multi.stderr, /a multi-repo role needs --notion-home/);
});

test('an existing .rs-harness.json is kept unless --force', (t) => {
  const dir = repo(t);
  const args = ['--role', 'infra', '--prefix', 'COM', '--tracker', 'linear', '--client', 'compass', ...NOTION];
  assert.equal(run(dir, ...args).status, 0);
  const again = run(dir, '--role', 'be', '--prefix', 'COM', '--tracker', 'linear', '--client', 'compass', ...NOTION);
  assert.equal(again.status, 2);
  assert.match(again.stderr, /already exists; re-run with --force/);
  assert.equal(JSON.parse(read(dir, '.rs-harness.json')).role, 'infra');
  assert.equal(run(dir, '--role', 'be', '--prefix', 'COM', '--tracker', 'linear', '--client', 'compass', ...NOTION, '--force').status, 0);
  assert.equal(JSON.parse(read(dir, '.rs-harness.json')).role, 'be');
});
