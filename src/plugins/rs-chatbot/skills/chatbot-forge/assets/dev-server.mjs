#!/usr/bin/env node
// scripts/dev-server.mjs — local dev server. Copy verbatim; do not hand-author a
// replacement. Serves public/, rebuilds src/ into public/bundle.js on change, and
// wires api/chat.js in directly so Phase 3's grounding test has a real running app
// to hit locally. Reads .env.local itself — no `vercel dev` / Vercel env vars needed
// for local iteration.
//
// esbuild is driven through its JS API (esbuild.context(...).watch()). Do not replace
// this with spawning node_modules/.bin/esbuild via `node <path>` — that path resolves
// to a native binary on some platforms and throws a cryptic SyntaxError.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";

const root = process.cwd();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

loadEnvLocal();

const ctx = await esbuild.context({
  entryPoints: [path.join(root, "src/index.jsx")],
  bundle: true,
  outfile: path.join(root, "public/bundle.js"),
  jsx: "automatic",
  logLevel: "info",
});
await ctx.watch();

const { default: chatHandler } = await import(path.join(root, "api/chat.js"));

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/chat" && req.method === "POST") {
    await handleChat(req, res);
    return;
  }
  serveStatic(req, res);
});

async function handleChat(req, res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(payload));
  };
  try {
    req.body = await readJsonBody(req);
    await chatHandler(req, res);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const publicDir = path.join(root, "public");
  const requested = path.join(publicDir, req.url === "/" ? "index.html" : req.url.split("?")[0]);
  if (!requested.startsWith(publicDir)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  fs.readFile(requested, (err, data) => {
    if (err) {
      fs.readFile(path.join(publicDir, "index.html"), (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(404).end("Not found");
          return;
        }
        res.writeHead(200, { "content-type": "text/html" }).end(fallbackData);
      });
      return;
    }
    const ext = path.extname(requested);
    res.writeHead(200, { "content-type": MIME_TYPES[ext] || "application/octet-stream" }).end(data);
  });
}

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

server.listen(port, () => {
  console.log(`dev server running at http://localhost:${port}`);
});
