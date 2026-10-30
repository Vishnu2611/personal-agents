# Handover: Rightshift AI code harness (Matt Pocock + gstack, phasing out Superpowers)

Written 2026-10-13 from a Claude Code session run inside the Stayntouch workspace
(`~/Desktop/data/projects/snt/workspace-master`). The build session should run **inside the Rightshift
repo** (`~/Desktop/data/projects/intuitiolabs/agents`), not in the Stayntouch workspace. See §1.

Status: **research and design are done. No code has been written. No branch exists yet.** Nothing in the
Rightshift repo has been modified. Everything below was verified by reading real files, except where a line
is marked **UNVERIFIED**.

---

## 1. How to start the build session

1. The Stayntouch workspace has a guard hook (`guard-git-scope.sh`) that blocks git writes outside that
   workspace. That is why this work must happen from a session started in the Rightshift repo.
2. Start it:
   ```bash
   cd ~/Desktop/data/projects/intuitiolabs/agents
   claude
   ```
3. First message to give the new session:
   > Read `../HANDOVER-rightshift-harness.md` fully. Then resolve the open questions in §10 with me, one at a
   > time. Then start Step 0 on a new branch `feat/harness-foundation`.
4. Expect the **Superpowers SessionStart hook** to still be active in that session (it is a user-level
   plugin on this machine: `superpowers@superpowers-marketplace` v6.2.0 in `~/.claude-personal`). It will push
   the session to use `brainstorming` etc. Until Step 5 that is tolerated. The user wants to move away from it
   gradually, not to fight it.
5. This machine's Claude config dir is `~/.claude-personal`, not `~/.claude`. Anything that looks for installed
   plugins or skills must honour `CLAUDE_CONFIG_DIR` (see §8.4).

Untracked files currently in the repo that are **not part of this work** and must never be committed by this
work: `RS Managed Agents — Plugin Taxonomy & Setup Guide.pdf`, `chatbot-forge-feedback.md`. Stage files by
name; never `git add -A`.

---

## 2. Goal

Give Rightshift (IntuitioLabs) an AI code harness for its client delivery work, modelled on the Stayntouch
harness, with this stack:

- **Matt Pocock's skills** (`mattpocock/skills`) as the day-to-day engineering method.
- **gstack** (`garrytan/gstack`) as a mandatory, auto-checked dependency, mainly for `/review`, `/ship` and
  its safety/QA tooling.
- **Superpowers** removed **step by step**, not all at once.
- **Hooks plus commit-bound receipts** enforcing the rules that must never be skipped.

Where the harness lives: the `rs-delivery` plugin in `IntuitioLabsLLC/rightshift-managed-agents` (local path
above), plus the project template at `docs/templates/rightshift-project/`.

---

## 3. The three ecosystems, explicitly

### 3.1 Superpowers (obra/superpowers) — being phased out

A methodology plugin: 14 skills and one hook. Installed locally at
`~/.claude-personal/plugins/cache/superpowers-marketplace/superpowers/6.2.0`.

**The hook.** One `SessionStart` hook (`hooks/hooks.json` → `hooks/session-start`), matcher
`startup|clear|compact`. It injects the full text of the `using-superpowers` skill into the model context
every session. That text says: if there is even a 1% chance a skill applies, invoke it before any response,
including clarifying questions. This is why Superpowers feels automatic.

| Skill | What it does |
|---|---|
| using-superpowers | The forcing rule above. Lists "rationalizations" the agent must not use to skip skills. |
| brainstorming | `HARD-GATE`: no code until a design is presented and approved, even for tiny tasks. Explore context → clarify one question at a time → propose 2–3 approaches → present design in sections → write `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit → self-review → user reviews file → invoke `writing-plans`. |
| writing-plans | Writes `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` for an engineer with zero context. Maps files first. Steps are 2–5 minutes each (failing test, run, implement, run, commit). Contains code. |
| using-git-worktrees | Ensures isolated worktree before execution. |
| subagent-driven-development | Fresh implementer subagent per task, then a task reviewer (spec compliance + quality), then a broad whole-branch review. Runs continuously. Ships `implementer-prompt.md`, `task-reviewer-prompt.md`, `re-review-prompt.md`. |
| executing-plans | Alternative: run the plan in a separate session with human checkpoints. |
| dispatching-parallel-agents | For 2+ independent tasks with no shared state. |
| test-driven-development | Iron Law: no production code without a failing test first; code written first is deleted. Red → green → refactor. |
| systematic-debugging | No fixes without root-cause investigation. |
| requesting-code-review | Dispatches a reviewer subagent. |
| receiving-code-review | Handle feedback with technical rigor, not blind agreement. |
| verification-before-completion | Run the verification command and read the output before claiming done. |
| finishing-a-development-branch | Verify tests, then menu: merge / push + PR / keep / discard. |
| writing-skills | Methodology for writing and testing skills. |

Character: automatic (model-driven), heavy ritual, file-based specs and plans in the repo, **no enforcement
beyond prose**.

### 3.2 gstack (garrytan/gstack) — mandatory dependency

A role-play "virtual engineering team" as slash commands. About 55 skill folders (README: 23 specialists + 8
power tools). Flow: Think → Plan → Build → Review → Test → Ship → Reflect. Current `VERSION` file:
`1.91.95.0`. **No git tags and no GitHub releases**, so pin by commit SHA (see §11).

Character: **user-invoked**; skills are generated from `SKILL.md.tmpl` by `bun run gen:skill-docs`; each
skill runs a `gstack-skill-start` preamble script; it has a compiled browser daemon; install is
`git clone` + `./setup` and **needs Bun** (setup refuses Bun older than 1.3.3; tested with 1.4.2). **It is
not a Claude Code plugin** (no `.claude-plugin/` in the repo), so it cannot be listed under `dependencies`
in a plugin's `plugin.json`.

Skills by purpose:

- **Think/plan:** `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`,
  `/plan-devex-review`, `/autoplan` (runs the plan reviews in sequence), `/spec`, `/design-consultation`,
  `/design-shotgun`, `/design-html`.
- **Review/test:** `/review`, `/qa`, `/qa-only`, `/investigate`, `/cso` (security), `/design-review`,
  `/devex-review`, `/test-audit`, `/deslop-shared-libs`, `/benchmark`, `/canary`.
- **Ship:** `/ship`, `/land-and-deploy`, `/document-release`, `/document-generate`, `/retro`, `/learn`.
- **Browser/tools:** `/browse`, `/scrape`, `/diagram`, `/make-pdf`, `/codex` (second opinion via OpenAI
  Codex CLI), `ios-*`.
- **Safety (real hooks):** `/careful` (PreToolUse hook warning on `rm -rf`, `DROP TABLE`, force-push,
  `reset --hard`, `kubectl delete`, …), `/freeze`, `/guard`, `/unfreeze`.
- **Standalone binaries:** `gstack-verify-gate` (opt-in Stop hook that blocks ending a turn until the
  declared verify command passes), `gstack-evidence` and `gstack-review-log` (evidence bound to a
  working-tree fingerprint, graded FRESH/STALE/MISSING), `gstack-wtree` (the fingerprint), `gstack-egress`
  (hash-chained receipts of every off-machine send), `gstack-context-bill`, `gstack-team-init`.

`/review` (1,212 lines) in brief: scope-drift check against commits/TODOs → read `review/checklist.md` →
get diff → **gate-integrity scan** (`gstack-gate-diff` lists every edit to tests/CI/lint/snapshots; each must
be judged "did this weaken a check?"; gate findings are always ASK, never auto-fixed) → critical checklist
(SQL/data safety, race conditions, unsafe HTML, LLM-output trust boundaries, shell injection, **enum
completeness** traced outside the diff) → parallel specialist subagents + adversarial pass → **fix-first**
(auto-fix mechanical items, one batched question for judgement calls) → exploratory QA → persist a review
record that `/ship` checks later.

`/ship` (1,233 lines) in brief: 21 steps: pre-flight → merge base branch before testing → tests → reviews →
`VERSION` bump + `CHANGELOG` + `TODOS.md` → docs audit → bisectable commits → **verification gate** ("Iron
Law: no completion claims without fresh verification evidence") → push (never force) → PR. Keeps an
"invocation record" file so a paused run can resume. Assumes a solo-founder repo shape (4-digit `VERSION`,
`TODOS.md`); these may not fit client repos and may need configuring or skipping.

gstack's own "required" team mode, verified by reading `bin/gstack-team-init`: running
`gstack-team-init required` in a repo writes (1) a `## gstack (REQUIRED)` section into `CLAUDE.md` telling
the agent to check for gstack before any work and stop if missing, with the exact install commands;
(2) a hook `.claude/hooks/check-gstack.cjs` (CommonJS, run by node, so it works on Windows) registered in
`.claude/settings.json`, which blocks skill use when gstack is not installed; (3) removes any vendored copy.
`./setup --team` adds a throttled (hourly) silent auto-update check at session start. **UNVERIFIED:** I read
only the first part of `check-gstack.cjs`; confirm exactly what it blocks before copying its approach.

### 3.3 Matt Pocock's skills (mattpocock/skills) — the new method

Plugin `mattpocock-skills`, tag **v1.3.1** (tag object sha `0b6cee10…`; `main` was at `49dd158d…` on
2026-10-09). MIT. About 27 shipped skills. Philosophy (`README`, `SCOPE.md`): small, composable, you stay in
control; explicitly *not* a process framework like GSD/BMAD/Spec-Kit. It targets four failures: agent didn't
do what I wanted (→ grilling), too verbose (→ shared `GLOSSARY.md` + ADRs), code doesn't work (→ feedback
loops, `/tdd`, `/diagnosing-bugs`), ball of mud (→ deep-module design).

**Two kinds of skill.** *User-invoked* (`disable-model-invocation: true`; only the human can type them; they
orchestrate) and *model-invoked* (human or agent; hold reusable discipline). Rule from Matt's README: a
user-invoked skill may call model-invoked skills but **never another user-invoked skill**. This matters for
`rs-delivery` (see §6.2).

Main flow (from `ask-matt`):
`/grill-with-docs` → (optional `/prototype` detour bridged by `/handoff`) → `/to-spec` → `/to-tickets` →
`/implement` or `/implement-spec` → `/code-review` → `/pr` → `/retro`.

| Skill | Kind | What it does |
|---|---|---|
| ask-matt | user | Router over the other skills; also documents phase boundaries (continue / clear / handoff / subagent / compact). |
| grill-with-docs | user | Thin wrapper: calls the `grilling` and `domain-modeling` skills. |
| grilling | model | Interview engine. Maps the plan as a design tree. Each round asks the **whole frontier** (all questions whose prerequisites are settled) as numbered questions, each with a recommended answer. Facts are looked up by sub-agents, decisions are the human's. Ends when the frontier is empty and the human confirms. |
| domain-modeling | model | Challenges terms against `GLOSSARY.md`, sharpens vague words, stress-tests with scenarios, updates glossary inline; offers an ADR only when a decision is hard to reverse, surprising, and a real trade-off. Supports `GLOSSARY-MAP.md` for multi-context repos. |
| to-spec | user | No interview. Synthesizes the conversation into a spec (Problem, Solution, long user-story list, Implementation Decisions, Testing Decisions, Out of Scope, Further Notes) and publishes it to the issue tracker with label `ready-for-agent`. No file paths or code in the spec. Agrees test **seams** with the human first (prefer one). |
| to-tickets | user | Splits a spec into **tracer-bullet vertical slices**, each declaring the tickets that block it (native blocking links on a real tracker, text in one file per ticket locally). |
| implement | user | Fetches the ticket, drives `/tdd` at pre-agreed seams, typechecks and single tests often, full suite once at the end, runs `/code-review`, commits. |
| implement-spec | user | Treats tickets as a task graph. One implementer subagent per ready ticket, each in its own worktree on its own branch, merged by a merger subagent onto one integration branch; one `/code-review` over the branch; cleans worktrees. |
| tdd | model | Confirm seams first; vertical slices (one test → one implementation); bans horizontal slicing, implementation-coupled mocks and tautological tests; refactoring is **not** in the loop (it belongs to review). |
| diagnosing-bugs | model | Build a tight, deterministic, agent-runnable red signal first; reproduce and minimise; 3–5 ranked hypotheses; instrument; fix; regression test. Redacts secrets. |
| code-review | model | Two axes run as parallel subagents and reported separately: **Standards** (repo docs + a fixed Fowler smell baseline) and **Spec** (does the diff match the originating issue). |
| pr | model | PR body template: visual summary, before/after evidence, "Merge Danger" (one-way/two-way door, blast radius). |
| retro | user | Reviews a session and proposes changes to the agent's **environment** (navigation, automated checks, coding standards, steering files), mechanical mistakes → deterministic checks. Keeps CLAUDE.md/AGENTS.md tiny. |
| setup-matt-pocock-skills | user | Run once per repo: issue tracker (GitHub, GitLab, local `.scratch/`, or free-prose "other" e.g. Jira/Linear), triage labels, domain-doc layout. Writes `docs/agents/*` and an `## Agent skills` section into AGENTS.md/CLAUDE.md. |
| triage, wayfinder, improve-codebase-architecture, prototype, research, wizard, handoff, grill-me, teach, to-questionnaire, wait-what, writing-for-agents, codebase-design | mixed | **Known only from README one-liners, not read in full.** |
| `misc/git-guardrails-claude-code` | n/a | PreToolUse hook blocking `git push`, `reset --hard`, `clean -f`, `branch -D`, `checkout .`, `restore .`. **Frozen and unmaintained**, not in the plugin. |

---

## 4. The Stayntouch reference harness (the pattern to port)

Location: `~/Desktop/data/projects/snt/workspace-master`. Documented in `docs/AGENTIC-DEVELOPMENT.md`.

The pattern, used by every gate:

1. A skill or workflow does the judgement work and writes a **receipt** bound to a commit SHA
   (e.g. `.security-outbox/receipts/<repo>/<HEAD sha>.md` containing `verdict: PASS`).
2. A **PreToolUse hook on Bash** reads the command; if it is `gh pr create` without `--draft`, it looks for
   the receipt for the current HEAD and **denies** the action if missing or not PASS.
3. Any new commit changes HEAD, so the old receipt stops counting.
4. The rule is also written in `CLAUDE.md` so the agent knows it before the hook fires.

Hooks in `.claude/hooks/` there: `guard-git-scope.sh`, `guard-infra-exec.py`, `guard-rca-invariants.sh`,
`guard-rca-mcp.sh`, `guard-intent-package.sh`, `guard-security-receipt.sh`, `guard-spec-home.sh`,
`nudge-intent-package.sh`. Registered in `.claude/settings.json`. The hook reads the PreToolUse JSON on stdin
(`.tool_input.command`, `.cwd`) and prints a `permissionDecision: deny` to block. Commands whose first word
is a text-carrying tool (`python3`, `cat`, `echo`) are skipped so that a heredoc containing "gh pr create" is
not mistaken for an invocation. The user decided **not** to read/port these in full for now; port the
*pattern*, and read the specific file only if a detail is needed.

---

## 5. Current state of the Rightshift repo (facts)

Repo: `IntuitioLabsLLC/rightshift-managed-agents`, local `~/Desktop/data/projects/intuitiolabs/agents`.
Branches: `main` (current, clean except the two untracked files in §1), `feat/distribution`,
`refactor/src-layout`; remotes include `release/v2.0.0`. Current version **3.0.0**
(`chore(release): 3.0.0` is HEAD).

**Source/build split.**
- Edit only `src/plugins/<plugin>/` and `src/standards/`.
- `plugins/<plugin>/` is generated by `make sync` (`src/tools/sync_plugins.py`). Never hand-edit it. Sync
  refuses to run over uncommitted `plugins/` edits unless `FORCE=1`.
- **`sync_plugins.py` ships only `SHIPPED = (".claude-plugin", "skills", "README.md")`**, plus whatever
  `sync.json` `copy`/`prompts`/`post` adds. A new `hooks/` directory will **not** be shipped unless you add
  `"hooks"` to `SHIPPED` (preferred) or list files in `sync.json`. `src/plugins/rs-delivery/sync.json` today
  has one `prompts` entry and two `copy` entries (formatting standard, `.mcp.json`).
- `Makefile` has one `PLUGINS` list (12 plugins). `make verify` runs `src/tools/verify_plugins.py`
  (manifest, version equals `package.json`, SKILL.md frontmatter, name rules, marketplace entries). `make test`
  runs `python3 -m unittest discover -s src/tools/tests`.

**Husky.** `pre-commit` runs `make verify`. `commit-msg` runs commitlint (Conventional Commits; allowed
types: build, chore, ci, docs, feat, fix, perf, prompt, refactor, revert, style, test). Hooks are only active
after `npm install`. Bypass with `--no-verify` only in emergencies; CI must re-run `make verify`.

**Release.** `npm run release` (`commit-and-tag-version`) derives semver from commits, bumps
`package.json`, every `src/plugins/*/.claude-plugin/plugin.json` and `marketplace.json` in lockstep, tags
`vX.Y.Z`; then move the `v3` tag. `fix` → patch, `feat` → minor, `!`/`BREAKING CHANGE` → major. Removing a
dependency or skill = **major** per `docs/SOP.md`.

**Distribution.** Marketplace `rightshift` (`.claude-plugin/marketplace.json`) lists the 12 `rs-*` plugins
plus `superpowers` as a third-party entry pinned to `ref: v6.2.0`. That is the existing pattern for a
third-party dependency; Matt's plugin can be added the same way (his repo has its own
`.claude-plugin/marketplace.json`, plugin name `mattpocock-skills`). `rs-delivery`'s `plugin.json` has
`"dependencies": ["superpowers", "rs-scoping"]`. Also an npm channel (`npx rightshift-skills`,
`bin/install.js`) that only copies skill folders into `.claude/skills/` (no hooks, no dependencies).

**Consumer template** `docs/templates/rightshift-project/`: `AGENTS.md`, `CLAUDE.md`, `README.md`,
`.gitignore`, `.claude/settings.json` (registers marketplace `rightshift` with `ref: v3`, enables
`rs-scoping`, `rs-delivery`, `rs-qa`, `rs-common`). `AGENTS.md` states the rules: Conventional Commits, TDD
with no exceptions, no invented scope, human gates are real gates.

**`rs-delivery` skills:** `kickoff`, `repo-knowledge-base`, `design-guidelines`, `ticket-intake`,
`spec-generator`, `feature-design-brief`, `feature-prototype`, `qa-verify-report`, `ship-with-ticket`.
Pipeline and artifact folders: `manifest.yaml`, `Design Guidelines/`, `Ticket Briefs/`, `specs/`
(`requirements.md` EARS, `design.md`, `tasks.md` TDD), `Feature Designs/` (with a `## Prototype Approval`
section after the gate), `Prototypes/`, `Execution Reports/`. Today the gates (prototype accepted, QA report
with no failing P0 before ship) are **prose in skills**, not enforced.

**Known gaps** (from `docs/SOP.md`, `docs/DEPLOYMENT.md`): QA/spec stages are not wired into
`src/orchestrator/pipeline.yaml`; npm publish is blocked until the `@rightshift` org exists and
`"private": true` is removed; marketplace pins are partly unpinned.

---

## 6. Design

### 6.1 Ownership after migration (one owner per job)

| Job | Owner | Replaces |
|---|---|---|
| Interview and design before coding | Matt `grilling` + `domain-modeling` (what `grill-with-docs` calls) | Superpowers `brainstorming` |
| Spec and tickets | Matt `to-spec` / `to-tickets`, expanded by Rightshift `spec-generator` | Superpowers `writing-plans` |
| Build with tests | Matt `tdd`, `implement`, `implement-spec` | Superpowers TDD, `subagent-driven-development` |
| Debugging | Matt `diagnosing-bugs` | `systematic-debugging` |
| Review: standards + spec | Matt `code-review` | `requesting-code-review` |
| Review: bugs, security, gate integrity | gstack `/review` (and `/cso` if wanted) | new |
| Browser testing | gstack `/browse`/`/qa`, or Playwright MCP (**undecided**, §10) | `qa-verify-report` plumbing |
| Ship | `ship-with-ticket` using gstack `/ship` + Matt `/pr` | `finishing-a-development-branch` |
| Verify before done / QA / prototype / dangerous git | **Rightshift hooks + receipts** (Step 0) | `verification-before-completion` + prose |
| Safety rails | gstack `/careful`, plus the hooks | new |

Gaps with **no equivalent in Matt's set**, to be covered by Step 0 hooks or a small Rightshift skill:
`verification-before-completion`, `finishing-a-development-branch`, `receiving-code-review`,
`executing-plans`, `using-git-worktrees` (only inside `implement-spec`), and the auto-invocation behaviour.

### 6.2 Invocation model: "mostly user-driven, model-driven when necessary"

| Mode | What | Why |
|---|---|---|
| User types it | grill, to-spec, to-tickets, implement, implement-spec, retro, setup | They start or end a phase; the human decides when. |
| Model reaches for it | tdd, diagnosing-bugs, code-review, domain-modeling, pr | Discipline that should always apply when relevant. |
| Must always happen | verify-before-PR, QA gate, prototype gate, no dangerous git | Enforced by **hooks**, not prose. |

**Important design consequence (UNVERIFIED in practice, from Matt's README rule):** `rs-delivery:kickoff` is a
skill, and today it tells the model to invoke `superpowers:brainstorming`. A skill cannot invoke a
user-invoked skill, and `grill-with-docs` is user-invoked. So `kickoff` must either (a) instruct the human to
type `/grill-with-docs`, or (b) invoke the model-invoked `grilling` and `domain-modeling` skills directly
(which is all `grill-with-docs` does). Test this in Step 1 before relying on it.

### 6.3 Specs: "both" (tracker for work in flight, repo for durable knowledge)

- **Issue tracker** (Linear/Jira/Asana) holds the spec ticket and the tracer-bullet tickets with blocking
  links (Matt `to-spec` / `to-tickets`). Matt's setup officially covers GitHub, GitLab and local files; for
  Linear/Jira/Asana it records free prose, so reuse Rightshift's `ticket-intake` adapters (full Linear, Jira
  and Asana support) for the tracker I/O rather than relying on Matt's setup.
- **Repo files** hold durable knowledge: `GLOSSARY.md`, `docs/adr/`, `manifest.yaml`, `Design Guidelines/`,
  `Feature Designs/`, `Execution Reports/`, and (open) the expanded `specs/<feature>/` files.
- **Format mismatch to resolve by Step 3:** Matt's spec is user stories with no code; Rightshift's
  `spec-generator` produces EARS `requirements.md`, `design.md`, and a TDD `tasks.md` per feature. Proposal:
  `to-spec` produces the ticket-level spec; `spec-generator` stays and expands it into the three files that
  `implement`/`implement-spec` and the QA gate read.

---

## 7. Migration plan (step by step; Superpowers stays installed until Step 5)

Each step: its own branch, Conventional Commits, `make verify` and `make test` green, then one small real
feature run end to end before the next step. Branch names: `feat/harness-foundation` (Step 0), then one per
step (`feat/harness-grilling`, `feat/harness-tdd`, `feat/harness-execution`, `feat/harness-review`,
`feat/harness-ship`).

### Step 0 — Foundation (hooks, receipts, dependency check, pins) — details in §8
Done when: (a) a `gh pr create` without a valid receipt for current HEAD is denied; (b) a `git push --force`
or a push to the default branch is denied; (c) a missing dependency is reported with the exact fix; (d) all
hooks have tests; (e) `make verify` checks the hooks exist and are well-formed.

### Step 1 — Front door
- Add Matt's plugin to `.claude-plugin/marketplace.json` pinned to `v1.3.1` (same shape as the `superpowers`
  entry), and `mattpocock-skills` to `rs-delivery` `plugin.json` `dependencies`.
- `kickoff`, `ticket-intake`, `feature-design-brief`, `repo-knowledge-base`, `spec-generator` prompt: replace
  `superpowers:brainstorming` references with grilling (see §6.2 consequence).
- Template: run/describe `/setup-matt-pocock-skills` (tracker = reuse `ticket-intake` adapters; labels;
  `GLOSSARY.md` + `docs/adr/` layout) and merge its `## Agent skills` section into the template `AGENTS.md`.
- Done when: a feature starts with grilling that creates/updates `GLOSSARY.md`, and `kickoff` hands off
  correctly (test the user-invoked-skill limitation).

### Step 2 — Build discipline
- Replace `superpowers:test-driven-development` with Matt `tdd` in `spec-generator` prompt text, `tasks.md`
  template wording, `feature-design-brief` §"must go through…", and template `AGENTS.md`.
- Reconcile "TDD Iron Law / delete code" (Superpowers) with Matt's "agree seams, vertical slices, refactor in
  review". Decide which wording the `tasks.md` template keeps.
- Done when: a feature is built in vertical slices with seams agreed first.

### Step 3 — Execution
- Replace `superpowers:subagent-driven-development` with Matt `implement` / `implement-spec`.
- Resolve the spec format question (§6.3). Decide whether `tasks.md` or tracker tickets drive
  `implement-spec`'s task graph.
- Done when: a multi-ticket feature builds in parallel on one integration branch with a draft PR.

### Step 4 — Review and debugging
- Matt `diagnosing-bugs`, Matt `code-review` (Standards + Spec), gstack `/review` (bugs/security/gate
  integrity). Define where each runs in the pipeline and how their results feed the QA receipt.
- Done when: a PR gets both review reports and the gate-integrity scan.

### Step 5 — Finish and remove Superpowers
- Rewrite `ship-with-ticket` (today a wrapper around `superpowers:finishing-a-development-branch`) to work
  alone, using gstack `/ship` + Matt `/pr`, backed by the Step 0 hooks.
- Remove `superpowers` from `rs-delivery` `plugin.json` and from `marketplace.json`; update README "Why
  depend on…" section; update `docs/superpowers/*` references only where they are live instructions
  (the historical specs/plans there are records; leave them).
- This is a **breaking change → major bump (v4)** per `docs/SOP.md`: use `feat!:` / `BREAKING CHANGE:`,
  update template `ref` from `v3` to `v4`, add a CHANGELOG note.
- Done when: `rs-delivery` runs end to end with Superpowers uninstalled.

---

## 8. Step 0 specification

All shipped hook code in **Node (CommonJS, `.cjs`)**, because gstack does the same for Windows safety, and
Node is already required by npm/husky here. No Bun dependency in Rightshift's own hooks (Bun is needed only
by gstack itself).

### 8.1 Where things live
- Source: `src/plugins/rs-delivery/hooks/` with `hooks.json` (plugin hook registration using
  `${CLAUDE_PLUGIN_ROOT}`, same mechanism as Superpowers' `hooks/hooks.json`) and the `.cjs` files, plus
  `src/plugins/rs-delivery/hooks/tests/`.
- Generated: `plugins/rs-delivery/hooks/` via `make sync`. Add `"hooks"` to `SHIPPED` in
  `src/tools/sync_plugins.py`.
- Verify: extend `src/tools/verify_plugins.py` to check, per plugin that has `hooks/hooks.json`, that it is
  valid JSON, every referenced script exists, and scripts parse (`node --check`). Add unit tests.
- `Makefile`: `make test` should also run the hook tests (`node --test`).
- Template: gitignore `.rs-receipts/`; document in `AGENTS.md`.

### 8.2 Hook protocol (VERIFY against current Claude Code docs before coding)
PreToolUse hooks receive JSON on stdin (fields used by the Stayntouch hooks: `.tool_input.command`, `.cwd`)
and block by printing a deny decision, which the Stayntouch hook does as `permissionDecision: deny`. The
documented shape is believed to be
`{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"…"}}`
— **UNVERIFIED, confirm it.** Skip commands whose first word is `echo`, `cat`, `printf`, `python`, `node`
(text-carrying) like the Stayntouch hook, so a heredoc containing "gh pr create" is not blocked.

### 8.3 The four enforcement hooks (all PreToolUse on Bash)

| Hook | Trigger | Denies unless | Receipt / source of truth |
|---|---|---|---|
| `guard-verify-receipt` | `gh pr create` (no `--draft`) | `.rs-receipts/verify/<HEAD sha>.json` exists with `result:"pass"` and the working tree is clean | Written by `rs-receipt verify -- <test command>` which runs the project's tests and records command, exit code, timestamp, HEAD sha |
| `guard-qa-receipt` | `gh pr create` (no `--draft`) | `.rs-receipts/qa/<HEAD sha>.json` exists with `p0_failed:0` | Written by `qa-verify-report` (modify the skill to call `rs-receipt qa …`) from the `Execution Reports/` verdict |
| `guard-prototype-gate` | `gh pr create` (no `--draft`) | the feature's `Feature Designs/<slug>.md` contains a `## Prototype Approval` section (optionally: also block first edits under `src/` until it exists) | The design file itself. **Open:** how to map branch → feature slug (propose: branch name contains the ticket ID; design file frontmatter has `ticket:`). |
| `guard-dangerous-git` | any Bash | never matches: `git push --force`/`-f`, `git push` to the default branch (`main`/`master`), `git reset --hard`, `git clean -f`, `git branch -D`, `git checkout .`, `git restore .` | none. Note: unlike Matt's frozen script, do **not** block ordinary `git push`, because feature branches must be pushed to open PRs. |

Draft PRs (`--draft`) are allowed through, as in Stayntouch, so work can be shared before gates pass.

Receipt design choice: bind to **HEAD sha** (Stayntouch pattern, simplest). gstack instead binds to a
working-tree fingerprint (`gstack-wtree`) which survives rebases/amends/squashes. Start with HEAD sha;
revisit if rebases become a pain.

`rs-receipt` is a small Node CLI in the plugin (`hooks/bin/rs-receipt.cjs`). Receipt JSON fields: `kind`,
`sha`, `result`, `command`, `exit_code`, `created_at`, `tool_version`. Hooks must treat receipts as untrusted
local files only for *freshness*; they are a guard against agent mistakes, not against a hostile developer.

**CI backstop:** the SOP says CI must repeat the key checks. Receipts are local and gitignored, so CI cannot
read them. Decide whether CI re-runs tests itself (simplest) or whether receipts are committed. (§10.)

### 8.4 Dependency check ("mandatory, auto-checked")
- `SessionStart` hook (`startup|clear|compact`) runs `rs-doctor --quiet`.
- `rs-doctor` checks: Node present; Bun present and ≥ 1.3.3 (1.4.2 tested); `git`; `gh`; gstack installed at
  `$GSTACK_ROOT` or `<config dir>/skills/gstack` or `~/.claude/skills/gstack` **and at the pinned commit**;
  the `mattpocock-skills` plugin installed (read `<config dir>/plugins/installed_plugins.json`).
  `<config dir>` = `$CLAUDE_CONFIG_DIR` if set, else `~/.claude`. This machine uses `~/.claude-personal`.
- On failure it prints the exact fix commands. **Proposed default behaviour (confirm, §10):** do not brick the
  whole session; instead the `gh pr create` and `git push` guards also deny while a mandatory dependency is
  missing, and the session-start message tells the agent to stop and ask the human to install.
- `rs-doctor --install` (separate, explicit): clones gstack at the pinned commit
  (`git clone`, then `git fetch --depth 1 origin <sha>` + checkout, then `./setup --team`) and prints the
  `claude plugin` command for Matt's plugin. Installing runs third-party code and downloads Chromium, so it
  must always ask the human first; never silent.
- Also expose it as `npx rightshift-skills doctor` by extending `bin/install.js` (it currently only copies
  skills).
- Template `CLAUDE.md`/`AGENTS.md` get a "Required tools" section (modelled on gstack's generated
  `## gstack (REQUIRED)` block) pointing at `rs-doctor`.

### 8.5 Pins (store in one file, e.g. `src/plugins/rs-delivery/hooks/pins.json`, and echo in docs)
- gstack: `https://github.com/garrytan/gstack` commit **`dbf400ec3f1ffb96a429f0d0b29ca932b3d6c6f0`**
  (main on 2026-10-12, `VERSION` 1.91.95.0). No tags exist, so pin the SHA and bump deliberately.
- Matt: `mattpocock/skills` tag **v1.3.1**.
- Superpowers (until Step 5): `obra/superpowers` `v6.2.0` (already in `marketplace.json`).

### 8.6 Tests for Step 0
`node --test` for each hook with fixture stdin JSON: allow when receipt valid; deny when missing; deny when
sha mismatched; deny when tree dirty; allow `--draft`; ignore heredoc text; dangerous-git matrix (each pattern
denied, `git push origin feature/x` allowed); doctor cases (all present, each missing). Python unit tests for
the new `verify_plugins.py` checks and `SHIPPED` change. Manual end-to-end: in a scratch repo, try
`gh pr create` (with `gh` stubbed) with and without receipts.

---

## 9. Where Superpowers is referenced in the Rightshift repo (migration worklist)

Live instructions (must change): `src/plugins/rs-delivery/.claude-plugin/plugin.json`;
`src/plugins/rs-delivery/README.md` (lines ~13, 45, 59, 63, 78–80); `skills/kickoff/SKILL.md` (65, 79, 106);
`skills/ticket-intake/SKILL.md` (3, 9, 58, 70); `skills/feature-design-brief/SKILL.md` (3, 33, 133–136);
`skills/repo-knowledge-base/SKILL.md` (9, 113); `skills/ship-with-ticket/SKILL.md` (3, 8, 26);
`skills/spec-generator/SKILL.md` (17); `prompts/08-spec-generator/README.md` (26) and
`prompts/08-spec-generator/current/spec-generator-v2.md` (17, 34, 42, 75, 303);
`docs/templates/rightshift-project/AGENTS.md` (4, 25); `.claude-plugin/marketplace.json` (the `superpowers`
entry); `src/tools/tests/test_verify_plugins.py` (31, test fixture).
Historical records (leave as is): `docs/superpowers/specs/*`, `docs/superpowers/plans/*`.
After editing `src/`, always run `make sync` and commit the regenerated `plugins/`.

---

## 10. Open questions and unverified items (resolve first, one at a time)

Open decisions:
1. **Browser testing:** gstack `/browse`/`/qa`, or keep Playwright MCP (used today by `qa-verify-report` and
   `test-executor`)? The user said "need gstack with matt" but did not choose for browsing.
2. **What "mandatory" blocks** when gstack/Matt is missing: whole session, or only PR/push (proposed).
3. **Spec format** (§6.3): does `to-spec` feed `spec-generator`, or replace it?
4. **Prototype gate mapping:** how a branch maps to a `Feature Designs/<slug>.md` file.
5. **CI backstop** for receipts (§8.3).
6. **Windows:** do any Rightshift developers or clients use Windows? gstack's mainstream support is macOS/
   Linux; Bun and the compiled tools may not work there. Not checked.
7. **gstack `/ship` defaults** (`VERSION`, `CHANGELOG`, `TODOS.md`) may not fit client repos; decide whether to
   configure or skip those steps.
8. `/review`'s gate-integrity helper is gstack-internal (`gstack-gate-diff`). Decide whether Rightshift also
   writes its own lightweight gate-integrity check so safety does not depend on gstack alone.

Unverified facts (check before relying on them):
- **Telemetry / data egress.** Both `/review` and `/ship` contain "Telemetry (run last)" and "Artifacts Sync"
  steps. I did **not** read what they send. gstack has `gstack-egress` consent settings. Read these and
  decide whether it is acceptable on client machines **before making gstack mandatory**. The user said "we
  should be good", so this was deprioritised, not resolved.
- The full behaviour of gstack's `check-gstack.cjs`.
- The exact PreToolUse deny JSON shape (§8.2).
- That a skill cannot call a user-invoked skill (§6.2) works as Matt describes.
- That a name-only `dependencies` entry resolves to a marketplace-listed third-party plugin for Matt exactly
  as it does for `superpowers` (the `superpowers` pattern already exists; Matt's should match).
- Matt skills read only via README one-liners: `triage`, `wayfinder`, `improve-codebase-architecture`,
  `prototype`, `research`, `wizard`, `handoff`, `grill-me`, `teach`, `to-questionnaire`, `wait-what`,
  `writing-for-agents`, `codebase-design`. Read them before deciding they are not needed.

---

## 11. Decisions log (made by the user, 2026-10-13)

| # | Decision |
|---|---|
| 1 | Invocation: mostly user-driven; model-driven only when necessary. |
| 2 | "Must always happen" rules are enforced by **hooks with commit-bound receipts** (the Stayntouch pattern) — assistant's pick of the widely used standard, user agreed. |
| 3 | Specs: "both" — tracker for work in flight, repo for durable docs. |
| 4 | Stack: Matt's skills **with** gstack; Superpowers removed or only partly kept. |
| 5 | gstack is a **mandatory dependency**, auto-checked/installed via CLAUDE.md + hook + doctor; user said "we should be good" on the telemetry question. |
| 6 | Migration: **step by step**. |
| 7 | Work on a new branch in `intuitiolabs/agents`; no need to read the Stayntouch hooks in full for now. |

### Resolved in the build session (2026-10-13)

| §10 # | Decision |
|---|---|
| 1 | Browser testing: **gstack** `/browse` + `/qa` (replaces Playwright MCP plumbing over time). |
| 2 | Missing mandatory dependency blocks **only** non-draft `gh pr create` and `git push`; SessionStart doctor tells the agent to stop and ask the human to install. |
| 3 | Spec format: Matt `/to-spec` **feeds** `spec-generator`, which expands into `specs/<feature>/` (EARS requirements, design, TDD tasks). |
| 4 | Prototype gate mapping: **ticket ID** in branch name, matched to `ticket:` frontmatter in `Feature Designs/<slug>.md` (written by `feature-design-brief`); requires `APPROVED` verdict. Branches with no ticket ID pass (chores); ticket ID without approved design is denied. |
| 5 | CI backstop: **none for now**. Local hooks are the only gate; known gap. |
| 6 | Windows: **macOS/Linux only**; Windows users use WSL. `rs-doctor` detects native Windows and says so. |
| 7 | gstack `/ship`: run `VERSION`/`CHANGELOG`/`TODOS.md` steps **only where those files already exist**. |
| 8 | Gate-integrity: **rely on gstack `/review` only**; no Rightshift-owned check. |
| — | Config dir on this machine is `~/.claude-intuitio` (intentional). Superpowers project-scoped installs left as they are. |
| — | QA gate, like the prototype gate, applies only to branches with a ticket ID; the verify receipt applies to every PR. |
| — | Ticket ID detection: project lists `ticket_prefixes` in `.rs-harness.json` at its root (matched case-insensitively); without it only uppercase IDs like `RS-142` count. |
| — | gstack stays on the exact pinned commit: install with `./setup --no-team` (supersedes `--team` in §8.4, which enables hourly auto-upgrade and would break the pin). Bump by editing `hooks/pins.json`. |
| — | **Found in live test (2026-10-13):** if any `dependencies` entry of `rs-delivery` (or a transitive one, e.g. `rs-scoping` → `rs-common`) is missing, Claude Code disables the whole plugin, hooks included, silently — the gates fail open. **Resolved:** hooks moved to a new dependency-free plugin `rs-guard`; `rs-delivery` depends on it. Do **not** add `mattpocock-skills` to `rs-guard`'s dependencies (doctor checks it instead). Step 0 merged via PR #8 into integration branch `feat/ai-code-harness` (2026-10-13). **All later step PRs target `feat/ai-code-harness`, not `main`.** |
| — | Matt's plugin on this machine is org-synced (`<config>/plugins/synced/…`, v1.2.3, older than the v1.3.1 pin); doctor detects synced plugins; older-than-pin is a warning, not a block. |
| S1-1 | `kickoff` hands off by telling the human to type `/grill-with-docs` (verified: the model cannot invoke it — `disable-model-invocation` — and Claude Code says not to replicate it). |
| S1-2 | Grilling leaves no design doc, so single-feature flow is: ticket-intake → `/grill-with-docs` → `/to-spec` (tracker issue) → `spec-generator` P-alt reads Ticket Brief + that spec. (Q3 decision applied from Step 1.) |
| S1-3 | Template ships Matt's setup pre-filled: `docs/agents/issue-tracker.md` ("other": same tracker/MCP as ticket-intake, spec posted as linked issue labelled `ready-for-agent`), `domain.md` (single-context), `triage-labels.md` (defaults), `## Agent skills` in AGENTS.md + pointer in CLAUDE.md. |
| S2-1 | tasks.md tasks are RED → GREEN only (Matt `tdd`); REFACTOR removed, clean-up at code review. |
| S2-2 | Test seams fixed in the spec: `design.md` `## Test seams` (from `/to-spec` Testing Decisions in P-alt; proposed + confirmed at Phase 2 in PRD runs); each RED names its seam; no test at an unconfirmed seam. Folded into unreleased spec-generator v3. Step 1 = PR #10 (merged), Step 2 = PR #11. |
| S3-1 | Execution sized by tasks.md: one slice → human types `/implement specs/<feature>/`; several → `/to-tickets` (groups tasks.md tasks into tracker tickets; rules in template `docs/agents/issue-tracker.md`) then `/implement-spec` (parallel, integration branch, draft PR). tasks.md stays the test plan; tickets carry work in flight. rs-guard now also gates `gh pr ready`. Step 3 = PR #12. |
| S4-1 | gstack `/review` enforced by rs-guard `review-gate` on every branch: PR needs a `CURRENT` row from gstack's `gstack-review-read` (clean, converged pass bound to working-tree content fingerprint). |
| S4-2 | Order: implement (+ Matt `code-review`) → QA report committed → `rs-receipt qa` → gstack `/review` (last) → `rs-receipt verify` → PR. If `/review` fixes code, re-run QA. Telemetry/egress resolved: telemetry off, artifacts sync off by default (one-off privacy prompt → answer off). Step 4 = PR #13. |
| S5-1 | gstack `/ship` kept, run as `/ship --no-pr` right after implement (before QA); then QA → `/review` → verify → `ship-with-ticket` opens the PR (Matt `pr` body + ticket link). Superpowers removed from rs-delivery deps and marketplace (`feat!`); template pinned to `v4`. `release:dry` shows 3.0.0 → 4.0.0. Step 5 = PR #14. Release (tag v4.0.0, move `v4`) only after `feat/ai-code-harness` merges to `main`. |
| — | Never run `gstack-team-init required` in client repos: its `check-gstack.cjs` blocks every Skill call when gstack is missing (conflicts with §10 Q2) and ignores `CLAUDE_CONFIG_DIR`. |

---

## 12. Working rules for the build session

- Stage files by name. Never `git add -A`. Do not commit the two untracked files (§1).
- Never hand-edit `plugins/`; edit `src/`, run `make sync`, commit both.
- Conventional Commits; the pre-commit hook runs `make verify`; do not use `--no-verify`.
- Do not force-push, and do not push to `main`. Open PRs from feature branches.
- Do not run gstack's `./setup` or any third-party installer without asking the human first.
- Before claiming any step done: run `make verify`, `make test`, and the manual end-to-end check; report
  the actual output.
- Update this document's §10/§11 as questions are resolved, and keep the memory note
  `rightshift-harness-migration` (in the Stayntouch workspace project memory) in step.

## 13. Source links

- Superpowers: https://github.com/obra/superpowers (local copy v6.2.0)
- gstack: https://github.com/garrytan/gstack (README, `bin/gstack-team-init`, `review/SKILL.md`,
  `ship/SKILL.md`, `careful/SKILL.md`)
- Matt Pocock skills: https://github.com/mattpocock/skills (README, `ask-matt`, `SCOPE.md`, `CLAUDE.md`)
- Stayntouch harness: `~/Desktop/data/projects/snt/workspace-master/docs/AGENTIC-DEVELOPMENT.md`,
  `.claude/settings.json`, `.claude/hooks/`
- Rightshift: `docs/SOP.md`, `docs/DEPLOYMENT.md`, `docs/PIPELINE.md`, `src/plugins/rs-delivery/README.md`,
  `docs/templates/rightshift-project/`
