'use strict';
// MCP sign-in checks for planning work. A project lists the MCP servers its planning needs in
// .rs-harness.json ("required_mcp"), by the name `claude mcp get` takes: rs-delivery's own servers are
// `plugin:rs-delivery:notion` and `plugin:rs-delivery:linear-server` (or `:atlassian`, `:asana`); a
// server from a project `.mcp.json` goes by its plain name. Each server's state
// comes from `claude mcp get <name>` run in the project root (about 3 s per server, run in parallel);
// a connected result is cached for 10 minutes in .rs-receipts/mcp/. When the state cannot be read
// (no `claude` on PATH, output not understood) the server counts as unknown, which never blocks.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { DIR } = require('./receipts.cjs');
const { readConfig } = require('./project.cjs');

const CACHE_MS = 10 * 60 * 1000;

// Skills that read project context, by plugin. Agents start them through the Skill tool; humans type
// them as `/name` or `/plugin:name`.
const PLANNING = {
  'rs-delivery': ['kickoff', 'ticket-intake', 'spec-generator', 'feature-design-brief'],
  'mattpocock-skills': ['grill-with-docs', 'to-spec', 'to-tickets'],
};

// `plugin:name` or bare `name` -> true when it is a planning skill.
function isPlanningSkill(id) {
  const s = String(id || '').trim();
  const i = s.lastIndexOf(':');
  const plugin = i === -1 ? null : s.slice(0, i);
  const name = i === -1 ? s : s.slice(i + 1);
  return Object.entries(PLANNING).some(([p, names]) => names.includes(name) && (plugin === null || plugin === p));
}

function requiredServers(root) {
  const list = readConfig(root).required_mcp;
  return Array.isArray(list) ? list.filter((n) => typeof n === 'string' && n) : [];
}

// `claude mcp get` output -> connected | needs-auth | failed | pending | missing | unknown.
function parseStatus(out) {
  if (/No MCP server found/i.test(out)) return 'missing';
  const line = (out.match(/^\s*Status:\s*(.*)$/m) || [])[1] || '';
  if (/Connected/i.test(line)) return 'connected';
  if (/Needs authentication/i.test(line)) return 'needs-auth';
  if (/Pending approval/i.test(line)) return 'pending';
  if (/Failed/i.test(line)) return 'failed';
  return 'unknown';
}

function probe(name, root, env) {
  return new Promise((resolve) => {
    let out = '';
    let child;
    try {
      child = spawn(env.RS_CLAUDE_BIN || 'claude', ['mcp', 'get', name], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch {
      resolve('unknown');
      return;
    }
    const timer = setTimeout(() => child.kill(), 15000);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { out += d; });
    child.on('error', () => { clearTimeout(timer); resolve('unknown'); });
    child.on('close', () => { clearTimeout(timer); resolve(parseStatus(out)); });
  });
}

const cacheFile = (root, name) => path.join(root, DIR, 'mcp', `${name.replace(/[^\w.-]/g, '_')}.json`);

function cached(root, name) {
  try {
    const c = JSON.parse(fs.readFileSync(cacheFile(root, name), 'utf8'));
    return c.status === 'connected' && Date.now() - Date.parse(c.checked_at) < CACHE_MS ? c.status : null;
  } catch {
    return null;
  }
}

function remember(root, name, status) {
  if (status !== 'connected') return;
  try {
    const file = cacheFile(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify({ name, status, checked_at: new Date().toISOString() })}\n`);
  } catch { /* the cache is an optimisation */ }
}

// [{name, status}] for every required server of the project at `root`.
async function serverStates(root, env = process.env) {
  return Promise.all(requiredServers(root).map(async (name) => {
    const hit = cached(root, name);
    if (hit) return { name, status: hit };
    const status = await probe(name, root, env);
    remember(root, name, status);
    return { name, status };
  }));
}

const FIX = {
  'needs-auth': 'needs sign-in: run `/mcp`, choose it, and sign in',
  failed: 'failed to connect: run `/mcp` to see the error, then reconnect',
  pending: 'is waiting for approval: run `/mcp` and approve the project server',
  missing: 'is not configured: add it to `.mcp.json` (see docs/agents/project-context.md)',
  'missing-plugin': 'is not available: install and enable the plugin that provides it (`/plugin`), then sign in with `/mcp`',
};

// Servers that block planning: known and not connected. Unknown never blocks.
const blocking = (states) => states.filter((s) => s.status !== 'connected' && s.status !== 'unknown');
const fixFor = (s) => FIX[s.status === 'missing' && s.name.startsWith('plugin:') ? 'missing-plugin' : s.status];
const describe = (states) => states.map((s) => `- ${s.name} ${fixFor(s)}`).join('\n');

async function planningDenial(root, skill, env = process.env) {
  const bad = blocking(await serverStates(root, env));
  if (!bad.length) return null;
  return `Blocked: \`${skill}\` reads project context through MCP, but a required server is not available:\n`
    + `${describe(bad)}\nAsk the human to fix it, then retry. Do not write specs, briefs or tickets without that context.`;
}

module.exports = { PLANNING, isPlanningSkill, requiredServers, parseStatus, serverStates, blocking, describe, planningDenial };
