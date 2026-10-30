'use strict';
// Project conventions the gates read: .rs-harness.json (role, ticket prefixes), ticket IDs in branch names, and
// `Feature Designs/*.md` briefs carrying `ticket:` frontmatter and a `## Prototype Approval` verdict.
const fs = require('fs');
const path = require('path');

const CONFIG = '.rs-harness.json';
const DESIGNS = 'Feature Designs';
const SPECS = 'specs';

function readConfig(root) {
  try {
    const c = JSON.parse(fs.readFileSync(path.join(root, CONFIG), 'utf8'));
    return c && typeof c === 'object' ? c : {};
  } catch {
    return {};
  }
}

// A repo's role in a multi-repo project decides which ticket-branch gates apply. No role = a
// single-repo project, which runs every gate.
const ROLES = {
  fe: { prototype: true, qa: 'browser' },
  be: { prototype: false, qa: 'API' },
  infra: { prototype: false, qa: null },
};
const ALL_GATES = { prototype: true, qa: 'browser or API' };

// {role, gates} for the repo, or {error} when .rs-harness.json names a role that does not exist.
function roleOf(root) {
  const { role } = readConfig(root);
  if (role === undefined) return { role: null, gates: ALL_GATES };
  if (typeof role === 'string' && Object.prototype.hasOwnProperty.call(ROLES, role)) return { role, gates: ROLES[role] };
  return { error: `${CONFIG} has "role": ${JSON.stringify(role)}; use one of ${Object.keys(ROLES).map((r) => `"${r}"`).join(', ')}, `
    + 'or leave it out for a single-repo project' };
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// With ticket_prefixes, `<prefix>-<n>` in any case counts; without, only uppercase IDs like RS-142.
// Returns the ID uppercased, or null when the branch carries no ticket.
function ticketFromBranch(branch, prefixes) {
  if (!branch) return null;
  const list = Array.isArray(prefixes) ? prefixes.filter((p) => typeof p === 'string' && p) : [];
  const re = list.length
    ? new RegExp(`(?:^|[^A-Za-z0-9])(${list.map(escapeRe).join('|')})-(\\d+)(?![0-9])`, 'i')
    : /(?:^|[^A-Za-z0-9])([A-Z][A-Z0-9]*)-(\d+)(?![0-9])/;
  const m = branch.match(re);
  return m ? `${m[1].toUpperCase()}-${m[2]}` : null;
}

// Frontmatter lines, or null when the text has no leading `---` block.
function frontmatterLines(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1].split(/\r?\n/) : null;
}

const unquote = (v) => v.trim().replace(/^["']|["']$/g, '');

// A scalar `key: value` (comment stripped), or null.
function scalarField(lines, key) {
  const line = lines.find((l) => new RegExp(`^${key}\\s*:`, 'i').test(l));
  return line ? line.slice(line.indexOf(':') + 1).replace(/\s+#.*$/, '').trim() : null;
}

// `key: [a, b]`, `key:` followed by `- a` lines, or a single `key: a` -> [a, b].
function listField(lines, key) {
  const raw = scalarField(lines, key);
  if (raw === null) return [];
  if (raw.startsWith('[')) return raw.replace(/^\[|\]$/g, '').split(',').map(unquote).filter(Boolean);
  if (raw !== '') return [unquote(raw)];
  const at = lines.findIndex((l) => new RegExp(`^${key}\\s*:`, 'i').test(l));
  const out = [];
  for (let i = at + 1; i < lines.length && /^\s+-\s*/.test(lines[i]); i += 1) out.push(unquote(lines[i].replace(/^\s+-\s*/, '')));
  return out.filter(Boolean);
}

// Ticket IDs a design brief covers: `ticket:` and/or `tickets:` frontmatter, uppercased.
function frontmatterTickets(text) {
  const lines = frontmatterLines(text);
  if (!lines) return [];
  return [...listField(lines, 'ticket'), ...listField(lines, 'tickets')].map((t) => t.toUpperCase());
}

// Every design brief whose frontmatter `ticket:` / `tickets:` includes `ticket`.
function designsFor(root, ticket) {
  const dir = path.join(root, DESIGNS);
  let names;
  try { names = fs.readdirSync(dir); } catch { return []; }
  return names.filter((n) => n.endsWith('.md')).map((n) => {
    const text = fs.readFileSync(path.join(dir, n), 'utf8');
    return { file: `${DESIGNS}/${n}`, text, tickets: frontmatterTickets(text) };
  }).filter((d) => d.tickets.includes(ticket));
}

// `specs/<feature>/requirements.md` frontmatter (spec-generator v4): {feature, tickets[], source}.
function specFrontmatter(text) {
  const lines = frontmatterLines(text);
  if (!lines) return null;
  const source = scalarField(lines, 'source');
  return {
    feature: scalarField(lines, 'feature'),
    tickets: listField(lines, 'tickets').map((t) => t.toUpperCase()),
    source: source && unquote(source),
  };
}

// Every specs/*/requirements.md whose frontmatter lists `ticket`.
function specsFor(root, ticket) {
  const dir = path.join(root, SPECS);
  let names;
  try { names = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name); } catch { return []; }
  return names.flatMap((n) => {
    const file = path.join(dir, n, 'requirements.md');
    let text;
    try { text = fs.readFileSync(file, 'utf8'); } catch { return []; }
    const fm = specFrontmatter(text);
    return fm && fm.tickets.includes(ticket) ? [{ file: `${SPECS}/${n}/requirements.md`, ...fm }] : [];
  });
}

// `## Prototype Approval` section containing a `Verdict: APPROVED` line.
function prototypeApproved(text) {
  const start = text.search(/^## Prototype Approval\s*$/m);
  if (start === -1) return false;
  const rest = text.slice(start).split(/\r?\n/).slice(1);
  const end = rest.findIndex((l) => /^#{1,2} /.test(l));
  return (end === -1 ? rest : rest.slice(0, end)).some((l) => /^\s*Verdict:\s*\**APPROVED\**\s*$/.test(l));
}

module.exports = { CONFIG, DESIGNS, SPECS, specFrontmatter, specsFor, ROLES, readConfig, roleOf, ticketFromBranch, frontmatterTickets, designsFor, prototypeApproved };
