---
name: chatbot-forge
description: Build, configure and deploy a knowledge-grounded Claude chatbot (React + Vercel serverless proxy) from an interview through to a live URL. Use this whenever the user wants to create a chatbot, Q&A bot, "ask <something>" assistant, internal knowledge bot, LP/investor bot, cohort or curriculum bot, docs bot, or asks to scaffold or deploy a Claude-powered chat app — even if they don't say the word "chatbot" and even if they only ask for part of it (just the scaffold, just the knowledge base, just the deploy).
---

# Chatbot Forge

Five phases with hard gates. Do not run a later phase until the gate before it passes.

```
0 Interview  →  1 Scaffold  →  2 Knowledge  →  3 Grounding test  →  4 Deploy
   (write         (write         (assemble        (must pass)        (only if 3
    config)        code)          KB)                                 passed)
```

Everything the bot does is driven by `chatbot.config.json` at the repo root plus
the files in `config/`. Never hardcode a prompt, a model, a colour or a domain
into `src/`. If the user asks to change behaviour, change config.

## Prerequisites

This skill does **not** implement code minimalism or terse output. Two installed
plugins do that. Check they are present at the start of Phase 1:

- **ponytail** (`DietrichGebert/ponytail`) — governs what gets built. Run
  `/ponytail full` before Phase 1. Run `/ponytail-review` at the Phase 1 gate.
- **caveman** (`JuliusBrussee/caveman`) — governs what the agent says. Leave at
  its default level for phases 0, 1, 3, 4.

If either is missing, tell the user the install command once and continue
without it. Do not reimplement their rules here.

Treat "enabled in settings but not actually installed" as not installed —
`.claude/settings.json` can claim a plugin is enabled while its skill
directory doesn't exist in the plugin cache. Check the skill directory
actually resolves before trusting the settings flag.

### Caveman must be OFF for Phase 2

Phase 2 output is a knowledge base of human-authored prose held in a string
literal. Caveman preserves code, commands and errors byte-for-byte — a
curriculum transcript inside a JS string is none of those, and compressing it
corrupts the bot's only source of truth.

Say `normal mode` before the first Phase 2 write. Restore the previous level at
the Phase 2 gate. State both switches out loud so the user sees them.

Ponytail stays on throughout, with one carve-out: the grounding test harness,
the refusal clause, and `scripts/dev-server.mjs` are not over-engineering.
They are the safety rungs. Do not let a minimalism pass delete them.

---

## Phase 0 — Interview

Ask these. Do not guess an answer, and do not proceed on partial answers to 1–4.

1. **Who asks it questions?** (public prospects / logged-in members / internal staff)
2. **What is the source of truth, and where does it live?** (Notion URL, Drive
   folder, pasted docs) — one source. Not "several places."
3. **What must it never get wrong?** The list of facts where a confident wrong
   answer is a real problem. This becomes the Phase 3 test set.
4. **Frozen snapshot or must it stay current?** If current, say plainly that a
   sync job is a separate build, and scope this run as a snapshot.
5. Name, domain, access control (open / password / none), brand or theme.
6. **Should this match an existing brand/site exactly?** If yes, get the URL
   or repo — that becomes the source of theme tokens instead of
   `references/theme-rightshift.md`, derived once here instead of
   re-derived across several post-deploy rounds.

Write the answers to `chatbot.config.json` (see `assets/chatbot.config.json`).

**Gate 0:** config file exists and questions 1–4 are answered. Otherwise stop.

---

## Phase 1 — Scaffold

Write the project.

```
<slug>/
├── api/chat.js              copy verbatim from assets/chat.js
├── src/App.jsx              chat UI, reads config
├── src/index.jsx
├── public/index.html
├── scripts/
│   └── dev-server.mjs       copy verbatim from assets/dev-server.mjs
├── config/
│   ├── system-prompt.md     editable, includes the refusal clause
│   └── knowledge-base.md    written in Phase 2, empty for now
├── chatbot.config.json
├── vercel.json
└── package.json             add an `npm run dev` script → node scripts/dev-server.mjs
```

`tests/grounding.md` and `tests/run-grounding.mjs` get written in Phase 3, but
`scripts/dev-server.mjs` has to exist here: Phase 3 requires running every
question against the built app, and nothing else in this skill stands the app
up locally.

Rules:

- `api/chat.js` and `scripts/dev-server.mjs` are copied verbatim from
  `assets/chat.js` and `assets/dev-server.mjs` — do not hand-author
  replacements. They're pure boilerplate, and reinventing them from scratch is
  exactly how this skill previously shipped two bugs: an esbuild-spawn
  `SyntaxError` (spawning `node_modules/.bin/esbuild` via `node` resolves to a
  native binary on some platforms — the shipped file uses esbuild's JS API
  instead) and a silently-broken response parse (adaptive-thinking models
  return a `thinking` block as `content[0]` unless `thinking: { type:
  "disabled" }` is set — the shipped file sets it).
- `src/App.jsx` imports the two config files as raw text and reads model, title,
  theme and starter questions from `chatbot.config.json`. No literals.
- Build the prompt as: system-prompt.md, then knowledge-base.md, in that order.
- Theme selection lives in `ui.theme` (e.g. `"rightshift"` → use the tokens in
  `references/theme-rightshift.md`). Branding/palette overrides live in the
  separate `theme` block (`colors`, `font`, `logoMark`, labels, `disclaimer`,
  `team`) — apply those via the mechanism in `references/theming.md`
  (runtime CSS-variable injection, dynamic font loading, full-height layout)
  regardless of which base theme is selected. `assets/chatbot.config.example.json`
  shows a fully filled-in config.

**Gate 1:** `npm run build` succeeds, `npm run dev` serves the app locally,
and `/ponytail-review` returns no outstanding deletions. Then move on.

---

## Phase 2 — Knowledge base

`normal mode` first. This is the phase that decides whether the bot is any good.

1. **Fetch from the one source** named in Phase 0. Notion MCP, Drive, or files
   the user provides. Stage the raw pulls in `config/sources/` — do not paste
   straight into the KB.
   - If the source needs auth and no MCP is configured, don't stall silently —
     ask the user to export or share it directly.
   - `.docx`/`.pdf` sources may need conversion before they're readable, e.g.
     `libreoffice --headless --convert-to txt:Text <file>` — on some Linux
     installs the binary is `/snap/bin/libreoffice`, not `soffice` on `PATH`.
2. **Surface conflicts, do not resolve them.** If two versions of a fact exist
   (an 8-week and a 10-week curriculum, two rate cards, two fund sizes), stop
   and ask which is authoritative. Never pick silently.
3. **Decide fidelity per section.** Frameworks, worksheets, transcripts,
   numbers, definitions → verbatim. Navigation and marketing copy → condensed.
   When unsure, verbatim.
4. **Assemble** into `config/knowledge-base.md` with a heading per section and a
   `Source:` line under each heading pointing back to the origin document.
5. **Measure it.** Report the token count. Under ~100k, in-context is right and
   the design holds. Over that, stop and tell the user the single-blob pattern
   has been outgrown and retrieval is a separate build — do not silently start
   chunking.

**Gate 2:** every section has a `Source:` line, no conflict is unresolved, token
count reported. Restore caveman.

---

## Phase 3 — Grounding test

The gate that matters. A scaffold that deploys a fabricating bot is worse than
no bot.

Write `tests/grounding.md` with **at least 12** questions, drawn from the
Phase 0 question-3 list, in two groups:

- **Covered** (8+) — the answer is in the KB and you know it exactly. Record the
  expected answer from the source, not from the model.
- **Uncovered** (4+) — plausible questions the KB deliberately does not answer.
  These are the real test.

Run every question against the built app. Record verdicts.

- A covered question answered wrongly → the KB is wrong or incomplete. Back to
  Phase 2.
- An uncovered question answered *at all* → the refusal clause is failing.
  Strengthen `config/system-prompt.md` and rerun. Do not soften the test.

The refusal clause in `config/system-prompt.md` must say, in substance: answer
only from the knowledge base; where something is not covered, say so plainly and
route to the named human or link; never fill from general knowledge; never
invent framework names, step counts, week numbers or figures.

**Gate 3:** all covered questions correct, all uncovered questions refused.
Report the table. If it does not pass, say so and stop — do not deploy.

---

## Phase 4 — Deploy

Only after Gate 3. Follow `references/deploy-vercel.md`. Confirm with the user
before the first production deploy — it spends real money and produces a real
URL.

---

## Reference files

- `references/deploy-vercel.md` — Vercel steps, env vars, custom domain
- `references/theme-rightshift.md` — default design tokens
- `references/theming.md` — theming mechanism and layout rules, any palette
- `assets/chatbot.config.json` — config template
- `assets/chatbot.config.example.json` — filled-in example config
- `assets/chat.js` — `api/chat.js` template, copy verbatim
- `assets/dev-server.mjs` — `scripts/dev-server.mjs` template, copy verbatim
