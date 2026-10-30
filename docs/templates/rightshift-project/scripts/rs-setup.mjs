#!/usr/bin/env node
// One-time setup for a repo made from the RightShift template. Writes .rs-harness.json (repo role,
// ticket prefix, required MCP servers) and fills docs/agents/project-context.md with the project's
// Notion pages, or removes it when the project keeps no context in Notion.
//
//   node scripts/rs-setup.mjs                       ask for everything
//   node scripts/rs-setup.mjs --role be --prefix COM --tracker linear \
//     --client compass --notion-home <url> [--prd <url>] [--tech-design <url>] \
//     [--glossary <url>] [--decisions <url>] [--opportunity <url>] [--linear-project <name>] [--force]
//
// --role single (or no role) = one repo holds the whole product; fe / be / infra = one repo of a
// multi-repo project. Without --notion-home the project has no Notion context.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const ROLES = ['single', 'fe', 'be', 'infra'];
const TRACKERS = { linear: 'linear-server', jira: 'atlassian', asana: 'asana' };
const PAGES = [
  ['opportunity', 'Opportunity Packet'],
  ['prd', 'PRD (approved)'],
  ['tech-design', 'Technical Design'],
  ['glossary', 'Glossary (project-wide)'],
  ['decisions', 'Decisions / ADRs (project-wide)'],
];

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--force') opts.force = true;
    else if (a.startsWith('--')) { opts[a.slice(2)] = argv[i + 1]; i += 1; }
  }
  return opts;
}

const isUrl = (s) => /^https?:\/\/\S+$/.test(s || '');

async function ask(opts, rl) {
  const q = async (key, question, check, fallback = '') => {
    if (opts[key] !== undefined) return opts[key];
    if (!rl) return fallback;
    for (;;) {
      const a = (await rl.question(`${question}${fallback ? ` [${fallback}]` : ''}: `)).trim() || fallback;
      if (!check || check(a)) return a;
      console.log('  not valid, try again');
    }
  };
  const o = {};
  o.role = await q('role', `Repo role (${ROLES.join(' / ')})`, (a) => ROLES.includes(a), 'single');
  o.prefix = (await q('prefix', 'Ticket prefix, e.g. COM', (a) => /^[A-Za-z][A-Za-z0-9]*$/.test(a))).toUpperCase();
  o.tracker = await q('tracker', `Tracker (${Object.keys(TRACKERS).join(' / ')})`, (a) => a in TRACKERS, 'linear');
  o.client = await q('client', 'Client / project slug, e.g. compass', (a) => /^[a-z0-9-]+$/.test(a));
  o['linear-project'] = await q('linear-project', 'Tracker project name', null, o.client);
  o['notion-home'] = await q('notion-home', 'Notion project home URL (blank = no Notion context)', (a) => a === '' || isUrl(a));
  if (o['notion-home']) {
    for (const [key, label] of PAGES) o[key] = await q(key, `${label} URL (blank to skip)`, (a) => a === '' || isUrl(a));
  }
  return o;
}

function validate(o) {
  const errors = [];
  if (!ROLES.includes(o.role)) errors.push(`--role must be one of ${ROLES.join(', ')}`);
  if (!/^[A-Z][A-Z0-9]*$/.test(o.prefix || '')) errors.push('--prefix must be letters/digits, e.g. COM');
  if (!(o.tracker in TRACKERS)) errors.push(`--tracker must be one of ${Object.keys(TRACKERS).join(', ')}`);
  if (!/^[a-z0-9-]+$/.test(o.client || '')) errors.push('--client must be a lowercase slug, e.g. compass');
  for (const key of ['notion-home', ...PAGES.map(([k]) => k)]) {
    if (o[key] && !isUrl(o[key])) errors.push(`--${key} must be an http(s) URL`);
  }
  if (o.role !== 'single' && !o['notion-home']) errors.push('a multi-repo role needs --notion-home (the shared project context)');
  return errors;
}

function harnessConfig(o) {
  const config = {};
  if (o.role !== 'single') config.role = o.role;
  config.ticket_prefixes = [o.prefix];
  if (o['notion-home']) config.required_mcp = ['plugin:rs-delivery:notion', `plugin:rs-delivery:${TRACKERS[o.tracker]}`];
  return config;
}

function projectContext(o) {
  const rows = [['Project home', o['notion-home']], ...PAGES.map(([key, label]) => [label, o[key]])]
    .filter(([, url]) => url);
  const multi = o.role !== 'single';
  const lines = [
    `# Project context — ${o.client}`,
    '',
    "Where this project's shared context lives. Agents read the pages below through the Notion MCP before",
    "planning, specifying or designing work. They are the source of truth: link to them, don't copy their",
    "content into this repo.",
    '',
    '| What | Notion page |',
    '|---|---|',
    ...rows.map(([label, url]) => `| ${label} | <${url}> |`),
    '',
    `- **Tracker:** ${o.tracker[0].toUpperCase()}${o.tracker.slice(1)} project "${o['linear-project'] || o.client}", ticket prefix \`${o.prefix}\` (see \`issue-tracker.md\`).`,
  ];
  if (multi) {
    lines.push(
      `- **This repo:** \`${o.client}-${o.role}\`, role \`${o.role}\` (as in \`.rs-harness.json\`).`,
      `- **Sibling repos:** ${['fe', 'be', 'infra'].filter((r) => r !== o.role).map((r) => `\`${o.client}-${r}\``).join(', ')}.`,
      `- **API contract:** \`${o.client}-be/api/openapi.yaml\`.`,
    );
  } else {
    lines.push('- **This repo:** the whole product (single repo).');
  }
  return `${lines.join('\n')}\n`;
}

export function setup(root, o) {
  const errors = validate(o);
  if (errors.length) return { errors };
  const harness = path.join(root, '.rs-harness.json');
  if (fs.existsSync(harness) && !o.force) return { errors: ['.rs-harness.json already exists; re-run with --force to replace it'] };
  fs.writeFileSync(harness, `${JSON.stringify(harnessConfig(o), null, 2)}\n`);
  const ctx = path.join(root, 'docs', 'agents', 'project-context.md');
  if (o['notion-home']) {
    fs.mkdirSync(path.dirname(ctx), { recursive: true });
    fs.writeFileSync(ctx, projectContext(o));
  } else {
    fs.rmSync(ctx, { force: true });
  }
  return { errors: [], wrote: ['.rs-harness.json', o['notion-home'] ? 'docs/agents/project-context.md' : null].filter(Boolean) };
}

function nextSteps(o) {
  const steps = [
    'Next:',
    '1. Fill in docs/agents/issue-tracker.md (tracker team/project), then commit .rs-harness.json and docs/agents/.',
    '2. In Claude Code: install the plugins (see README.md), then run /mcp and sign in to the Notion and tracker',
    '   servers that rs-delivery provides. Planning skills stay blocked until you do.',
  ];
  if (o.role !== 'single') {
    steps.push(
      '3. GitHub, once per repo: give each developer write access only to their own repo (read-only on the',
      `   siblings), protect main, and add a CODEOWNERS file. Repeat this setup in ${['fe', 'be', 'infra'].filter((r) => r !== o.role).map((r) => `${o.client}-${r}`).join(' and ')}`,
      '   with the same Notion links and prefix.',
    );
    if (o.role === 'be') steps.push('4. Create api/openapi.yaml: it is the contract the frontend builds against.');
  }
  return steps.join('\n');
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    const src = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n');
    console.log(src.slice(1, src.findIndex((l) => l.startsWith('import'))).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    return;
  }
  const opts = parseArgs(argv);
  const interactive = process.stdin.isTTY && !opts.role;
  const rl = interactive ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null;
  const o = await ask(opts, rl);
  o.force = Boolean(opts.force);
  if (rl) rl.close();
  const { errors, wrote } = setup(process.cwd(), o);
  if (errors.length) {
    console.error(`rs-setup: ${errors.join('\nrs-setup: ')}`);
    process.exitCode = 2;
    return;
  }
  console.log(`rs-setup: wrote ${wrote.join(', ')}${o['notion-home'] ? '' : ' (no Notion context: removed docs/agents/project-context.md)'}`);
  console.log(nextSteps(o));
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) main();
