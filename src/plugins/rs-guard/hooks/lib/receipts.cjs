'use strict';
// Commit-bound receipts: .rs-receipts/<kind>/<HEAD sha>.json in the project root (gitignored).
// A new commit changes HEAD, so an old receipt stops counting. Receipts guard against agent
// mistakes; they are local files, not proof against a hostile developer.
const fs = require('fs');
const path = require('path');

const DIR = '.rs-receipts';

const receiptPath = (root, kind, sha) => path.join(root, DIR, kind, `${sha}.json`);

function readReceipt(root, kind, sha) {
  try {
    return JSON.parse(fs.readFileSync(receiptPath(root, kind, sha), 'utf8'));
  } catch {
    return null;
  }
}

function writeReceipt(root, receipt) {
  const file = receiptPath(root, receipt.kind, receipt.sha);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(receipt, null, 2)}\n`);
  return file;
}

function toolVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '.claude-plugin', 'plugin.json'), 'utf8')).version;
  } catch {
    return 'unknown';
  }
}

// Absolute command the agent can run; printed in deny messages and at session start.
const receiptCli = () => `node "${path.join(__dirname, '..', 'bin', 'rs-receipt.cjs')}"`;

module.exports = { DIR, receiptPath, readReceipt, writeReceipt, toolVersion, receiptCli };
