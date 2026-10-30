#!/usr/bin/env node
'use strict';
// rs-receipt: write commit-bound receipts that the rs-guard PR gates read.
//
//   rs-receipt verify -- <test command...>   run the tests on a clean tree; record pass/fail for HEAD
//   rs-receipt qa --report <path> --p0-failed <n>
//                                            record a committed QA report's verdict for HEAD
//                                            (n = P0 scenarios with verdict Fail or Blocked)
//   rs-receipt status                        show the receipts recorded for HEAD
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { git, repoRoot, headSha, trackedTreeClean } = require('../lib/git.cjs');
const { readReceipt, writeReceipt, toolVersion } = require('../lib/receipts.cjs');
const { roleOf } = require('../lib/project.cjs');

const USAGE = `usage:
  rs-receipt verify -- <test command...>
  rs-receipt qa --report <path> --p0-failed <n>
  rs-receipt status`;

function fail(msg, code = 2) {
  process.stderr.write(`rs-receipt: ${msg}\n`);
  return code;
}

function context() {
  const root = repoRoot(process.cwd());
  const sha = root && headSha(root);
  return sha ? { root, sha } : null;
}

function verify(argv) {
  const sep = argv.indexOf('--');
  const cmd = sep === -1 ? [] : argv.slice(sep + 1);
  if (!cmd.length) return fail(`missing test command\n${USAGE}`);
  const ctx = context();
  if (!ctx) return fail('not inside a git repository with at least one commit');
  if (!trackedTreeClean(ctx.root)) return fail('uncommitted changes to tracked files; commit first so the receipt matches what was tested');

  // One argument is a shell string (`-- "npm test && npm run lint"`); several are an argv.
  const shell = cmd.length === 1;
  const r = spawnSync(cmd[0], cmd.slice(1), { cwd: ctx.root, stdio: 'inherit', shell });
  const exitCode = r.status === null ? 1 : r.status;
  // Tests that edit tracked files or a commit during the run invalidate the receipt.
  const treeClean = headSha(ctx.root) === ctx.sha && trackedTreeClean(ctx.root);
  const file = writeReceipt(ctx.root, {
    kind: 'verify',
    sha: ctx.sha,
    result: exitCode === 0 && treeClean ? 'pass' : 'fail',
    command: cmd.join(' '),
    exit_code: exitCode,
    tree_clean: treeClean,
    created_at: new Date().toISOString(),
    tool_version: toolVersion(),
  });
  process.stderr.write(`rs-receipt: ${exitCode === 0 && treeClean ? 'PASS' : 'FAIL'} recorded in ${file}\n`);
  if (!treeClean) process.stderr.write('rs-receipt: tracked files or HEAD changed during the run; receipt marked fail\n');
  return exitCode === 0 && !treeClean ? 1 : exitCode;
}

function qa(argv) {
  const opt = (name) => { const i = argv.indexOf(name); return i === -1 ? undefined : argv[i + 1]; };
  const report = opt('--report');
  const p0 = opt('--p0-failed');
  if (!report || p0 === undefined || !/^\d+$/.test(p0)) return fail(`--report and a numeric --p0-failed are required\n${USAGE}`);
  const ctx = context();
  if (!ctx) return fail('not inside a git repository with at least one commit');
  const abs = path.resolve(process.cwd(), report);
  if (!fs.existsSync(abs)) return fail(`report not found: ${report}`);
  const rel = path.relative(ctx.root, abs);
  if (git(ctx.root, ['ls-files', '--error-unmatch', '--', rel]) === null) return fail(`commit the report first: ${rel}`);
  if (!trackedTreeClean(ctx.root)) return fail('uncommitted changes to tracked files; commit first so the receipt matches what was tested');
  const p0Failed = Number(p0);
  const file = writeReceipt(ctx.root, {
    kind: 'qa',
    sha: ctx.sha,
    result: p0Failed === 0 ? 'pass' : 'fail',
    p0_failed: p0Failed,
    report: rel,
    command: `qa --report ${rel} --p0-failed ${p0Failed}`,
    exit_code: p0Failed === 0 ? 0 : 1,
    created_at: new Date().toISOString(),
    tool_version: toolVersion(),
  });
  process.stderr.write(`rs-receipt: QA ${p0Failed === 0 ? 'PASS' : 'FAIL'} recorded in ${file}\n`);
  return p0Failed === 0 ? 0 : 1;
}

function status() {
  const ctx = context();
  if (!ctx) return fail('not inside a git repository with at least one commit');
  process.stdout.write(`HEAD ${ctx.sha}\n`);
  const { role, gates, error } = roleOf(ctx.root);
  if (error) {
    process.stdout.write(`  role: invalid (${error})\n`);
  } else {
    const ticketGates = [gates.prototype && 'prototype approval', gates.qa && `${gates.qa} QA`].filter(Boolean);
    process.stdout.write(`  role: ${role || 'none (single repo)'}; ticket branches also need: ${ticketGates.join(', ') || 'nothing more'}\n`);
  }
  for (const kind of ['verify', 'qa']) {
    const r = readReceipt(ctx.root, kind, ctx.sha);
    process.stdout.write(`  ${kind}: ${r ? `${r.result} (${r.created_at})` : 'missing'}\n`);
  }
  process.stdout.write(`  gstack /review: ${require('../guards/review-gate.cjs').reviewSummary(ctx.root)}\n`);
  return 0;
}

function main(argv) {
  switch (argv[0]) {
    case 'verify': return verify(argv.slice(1));
    case 'qa': return qa(argv.slice(1));
    case 'status': return status();
    default: return fail(USAGE);
  }
}

process.exitCode = main(process.argv.slice(2));
