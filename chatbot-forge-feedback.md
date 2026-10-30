# chatbot-forge: delta between the skill's scaffold and what Ask RecoMe actually needed

## TL;DR

Phases 0–3 (interview, scaffold, knowledge base, grounding test) worked close
to as designed. The gap is almost entirely in two places:

1. **The bundled theme reference and config schema are too thin for a real
   branded deployment.** Everything visual beyond "pick a color and a font" —
   header chrome, a team/leadership panel, a welcome message, eyebrow labels,
   a disclaimer footer, an icon send button — had to be invented from scratch,
   iteratively, across ~6 separate rounds, because a sibling chatbot
   (askrsv.rightshift.co) turned out to be the actual design source of truth
   and it uses none of `theme-rightshift.md`'s tokens.
2. **Phase 3 requires "run the built app" but the skill provides zero tooling
   for that.** No local dev-server pattern exists, so one had to be
   hand-built (and its first version had a real bug). `vercel dev` was tried
   as an alternative and hit an unrelated but very confusing Vercel-specific
   gotcha (see below) before being abandoned in favor of the hand-built server.

Everything below is organized by phase, each item tagged with what happened,
why it mattered, and a concrete fix.

---

## Recommended improvements (action list)

Concrete, prioritized changes to the skill itself. Each links to the fuller
rationale in the phase sections below.

1. **[High] Ship a local dev-server template as part of Phase 1's scaffold.**
   Add `scripts/dev-server.mjs` (or equivalent) + an `npm run dev` script to
   the required file list — not optional, since Phase 3 depends on being
   able to run the built app. Combine: a static file server for `public/`,
   the `api/chat.js` handler wired in directly, and esbuild in **watch mode
   via its JS API** (`esbuild.context(...).watch()`) — not by spawning
   `node_modules/.bin/esbuild` through `node`, which resolves to a native
   binary on some platforms and throws a cryptic `SyntaxError`. *(Phase 1 / Phase 3)*
2. **[High] Default `api/chat.js` to `thinking: { type: 'disabled' }`.**
   Adaptive-thinking-capable models (Sonnet 5 and newer) return a `thinking`
   block as `content[0]` when `thinking` is omitted, silently breaking the
   standard `data.content[0].text` response-reading pattern the skill's own
   scaffold uses. This will bite every project built on such a model unless
   the reference template sets this explicitly. One-line fix, high blast
   radius if skipped. *(Phase 3)*
3. **[High] Ship a richer default `assets/chatbot.config.json` template.**
   Add the branding/chrome fields that turned out to be near-universal, not
   edge cases: `team[]` (name/role/email/avatar), `ui.welcomeMessage`,
   `ui.composerPlaceholder`, `theme.logoMark`/`logoImage`, `theme.badge`,
   `theme.ctaLabel`, `theme.teamLabel`, `theme.assistantLabel`,
   `theme.commonQuestionsLabel`, `theme.disclaimer`, and a full
   `theme.colors` palette (bg/panel/paper/ink/inkSoft/inkFaint/accent/
   accentDeep/rule). Keep every field nullable with conditional rendering —
   that convention held up well across every round here. See the proposed
   shape further down. *(Post-deploy theme section)*
4. **[Medium] Add a Phase 0 question: "should this match an existing
   site/bot exactly?"** If yes, treat that URL/repo as the theme source of
   truth (fetch it, derive tokens from it) instead of defaulting to
   `theme-rightshift.md`, which was stale relative to the actual current
   brand. This is what caused the multi-round rework here. *(Phase 0)*
5. **[Medium] Document the Vercel "Sensitive" env var gotcha in the Phase 4
   guide.** Either recommend a non-Sensitive type specifically so
   `vercel dev` can decrypt it locally, or recommend skipping `vercel dev`
   for local iteration entirely in favor of item #1's dev server, reserving
   `vercel dev` only for testing real Vercel routing behavior. *(Phase 4)*
6. **[Medium] Correct the "preview before production" guidance in Phase 4.**
   A plain `vercel deploy` only produces a real, non-aliased preview if Git
   integration is connected and working; otherwise it aliases straight to
   production on the very first deploy. Add a check (e.g. confirm the deploy
   response's `target` field, or that Git integration actually connected)
   before relying on "preview first" as a safety net. *(Phase 4)*
7. **[Low] Add a one-line fallback for inaccessible knowledge-base sources.**
   If the named Phase 0 source needs auth and no MCP is configured, ask the
   user to export/share it directly rather than stalling silently. Also note
   that `.docx`/`.pdf` sources may need conversion (e.g. LibreOffice
   headless: `libreoffice --headless --convert-to txt:Text <file>` — on some
   Linux installs the binary is at `/snap/bin/libreoffice`, not `soffice`,
   on `PATH`). *(Phase 2)*
8. **[Low] Document the full-height flex-scroll layout gotcha** wherever the
   skill discusses chat UI layout: the outer shell needs `height: 100vh`
   (plus `html, body { height: 100%; }`), not `min-height: 100vh`, or a flex
   child's `overflow-y: auto` won't actually scroll — the whole page grows
   instead. *(Post-deploy layout section)*
9. **[Low] Treat "enabled in settings but not actually installed" as not
   installed** in Phase 1's prerequisite check for ponytail/caveman — check
   the plugin actually resolves (e.g. its skill directory exists in the
   plugin cache), don't trust the settings flag alone. *(Phase 1)*

---

## Phase 0 — Interview

**Worked well.** The AskUserQuestion-driven flow was fast and the questions
were well-scoped. No issues.

**Gap: no question captures "is there a reference design/sibling bot to
match."** This came up *twice* in this session, both times after Phase 4 —
first "restyle to match askrsv.rightshift.co," then "the header is missing
things, see image.png." Both required re-deriving brand facts by cloning a
sibling repo and reverse-engineering its CSS by eye. If Phase 0 asked "is
there an existing site/bot this should visually match?" up front, that
reverse-engineering could happen once, during scaffolding, instead of across
several post-deploy round trips.

**Suggested fix:** add a Phase 0 question: *"Should this match an existing
brand/site exactly? If so, share the URL or repo."* If yes, treat that as the
source of theme tokens instead of `theme-rightshift.md`, and derive the same
category of config fields proposed below directly from it.

---

## Phase 1 — Scaffold

**Prerequisite check has no path for "enabled but not actually installed."**
`.claude/settings.json` claimed `ponytail`/`chatbot-forge` were enabled, but
neither plugin was actually present in the plugin cache — a stale-config
state the skill's simple "installed or not" check doesn't anticipate. Not
a big deal (just told the user the install command), but worth a one-line
mention in the prerequisite section: *"if enabled in settings but the skill
directory doesn't exist, treat as not installed."*

**The "five files" framing undercounts what a testable, deployable bot
actually needs.** By the end, the file list was:

```
api/chat.js, src/App.jsx, src/index.jsx, public/index.html,   ← the "five"
config/system-prompt.md, config/knowledge-base.md,
chatbot.config.json, vercel.json, package.json,                ← acknowledged separately, fine
.gitignore, README.md,                                         ← needed for conflict logging (Phase 2 rule)
tests/grounding.md, tests/run-grounding.mjs,                    ← needed for Phase 3, NOT mentioned anywhere in Phase 1
scripts/dev-server.mjs                                          ← needed to run anything locally, NOT mentioned anywhere
```

The last two rows are the real gap — Phase 3 *requires* "run every question
against the built app," but nothing in Phase 1 scaffolds a way to do that.

**Suggested fix:** add a sixth-and-seventh file to the Phase 1 template:
a `scripts/dev-server.mjs` (or equivalent) that combines a static file
server for `public/`, the `api/chat.js` handler, and esbuild in watch mode,
started via `npm run dev`. Concrete gotcha to bake in: **don't spawn
`node_modules/.bin/esbuild` via `node <path>` in that script** — depending on
platform that path resolves to a native binary, not a JS entry point, and
throws a cryptic `SyntaxError`. Use esbuild's JS API instead:

```js
const ctx = await esbuild.context({ entryPoints: [...], bundle: true, outfile: ..., jsx: 'automatic' });
await ctx.watch();
```

---

## Phase 2 — Knowledge base

**Worked well overall**, especially the conflict-surfacing rule — the
Encoding.com/Jitterbit discrepancy between the RFP and the code-based docs
was caught and correctly left unresolved rather than silently picked, exactly
per the skill's design. Keep this rule as-is, it's doing its job.

**Gap: no fallback guidance when the named source is inaccessible.** The
Notion link from Phase 0 needed login and `WebFetch` looped on redirects.
The skill assumes "Notion MCP, Drive, or files the user provides" just
works; there's no guidance for "the Notion page is private and no MCP is
configured" beyond generically stopping to ask. (Resolved fine here — user
exported to PDF — but worth a documented fallback path: *"if the named
source needs auth and no MCP is available, ask the user to export/share it
directly."*)

**Gap: no guidance on non-text source formats.** Two `.docx` files needed
LibreOffice headless conversion to plain text before they could be read, and
finding a working invocation took a few tries (the `soffice` binary wasn't
on PATH under snap; had to use `/snap/bin/libreoffice` instead — snap
packaging quirk, but the skill gives no guidance at all on docx/pdf handling
beyond "stage the raw pulls," which implicitly assumes they're already
readable).

---

## Phase 3 — Grounding test

**Gap: "run the built app" has no supported implementation path.** This is
the same gap as Phase 1's missing dev-server, from the testing side. The
skill's instruction — run every question against the actual running app —
is the right bar (an inspection-only pass was correctly rejected as
insufficient when first attempted here), but there is currently no
recommended way to stand the app up locally to do it.

**Real bug worth baking into the Phase 1 `api/chat.js` template: Claude
Sonnet 5 (and other adaptive-thinking-capable models) return a `thinking`
content block first when `thinking` is omitted from the request.** A naive
`data.content[0].text` (the obvious way to read a Messages API response, and
what a first-draft scaffold would write) silently breaks — `content[0]` is
the thinking block, not text, so every response looks like "Something went
wrong." Fix is one line: explicitly set `thinking: { type: 'disabled' }` in
the request body. This will bite **every** chatbot-forge project built on a
thinking-capable model unless the reference `api/chat.js` template includes
it from the start.

---

## Phase 4 — Deploy

**Vercel "Sensitive" env var type breaks local `vercel dev`, silently.**
When adding `ANTHROPIC_API_KEY` via `vercel env add`, the CLI's default
produced a "Sensitive" var. That's fine for production (Vercel decrypts it
at real runtime), but `vercel dev` cannot decrypt Sensitive vars locally —
it returns a redacted placeholder, which the API then rejects as an invalid
key with no indication *why*. Cost real debugging time to trace. The deploy
guide doesn't mention this at all.

**Suggested fix:** either recommend the non-Sensitive/"Encrypted" type when
adding the key specifically because local `vercel dev` needs to read it, or
—simpler — just standardize on the hand-rolled local dev server (see Phase 1)
that reads `.env.local` directly and skip `vercel dev` for local iteration
entirely, reserving `vercel dev` only for testing the *actual* Vercel
request-routing behavior.

**`vercel deploy` (no `--prod`) went straight to production, not preview.**
The deploy guide's Phase 4 says "preview before production, run the
grounding test against the preview URL" — but without a connected Git
branch, a plain `vercel deploy` aliased straight to the production domain on
the very first run (confirmed: `target: "production"` in the response, main
domain aliased immediately). The "preview first" safety step the guide
describes doesn't actually happen unless Git integration is set up and
working — worth flagging in the guide, since here the GitHub auto-connect on
`vercel link` *also* failed (different Vercel account than the repo owner),
compounding it.

---

## Post-deploy: the theme/branding system (the biggest delta)

This is the part most worth feeding back. Once the config-driven pattern was
established, extending it was fast and clean — but the *shape* of that
schema didn't exist yet and had to be built field-by-field, across separate
requests, in this order — each round required touching `App.jsx`,
`index.html`, and `chatbot.config.json` together:

1. `escalation` (human/email/link) — present in the skill's own template, fine.
2. `team` (array of {name, role, email, avatar}) — invented; not in the skill's template at all.
3. `theme.colors` (11-key palette) + `theme.font` + runtime CSS-variable injection + dynamic Google Fonts `<link>` injection — invented.
4. `theme.logoMark` / `theme.badge` / `theme.ctaLabel` / `theme.teamLabel` — invented.
5. `ui.welcomeMessage` / `ui.composerPlaceholder` — invented.
6. `theme.assistantLabel` / `theme.commonQuestionsLabel` / `theme.disclaimer` — invented.

None of these are exotic — a welcome message, a "who's behind this" panel, a
disclaimer about data scope, and a themeable palette are close to *default
expectations* for this category of product (any branded Q&A/portal bot), not
edge cases. The skill's `assets/chatbot.config.json` template currently has
none of them.

**Suggested fix:** ship a richer default template. Proposed shape (additive
to what's already in the skill's template):

```json
{
  "team": [
    { "name": "", "role": "", "email": "", "avatar": null }
  ],
  "ui": {
    "welcomeMessage": "",
    "composerPlaceholder": ""
  },
  "theme": {
    "font": "",
    "logoMark": "",
    "logoImage": null,
    "badge": null,
    "ctaLabel": null,
    "teamLabel": "Team",
    "assistantLabel": "",
    "commonQuestionsLabel": "Common Questions",
    "disclaimer": null,
    "colors": {
      "bg": "", "panel": "", "paper": "",
      "ink": "", "inkSoft": "", "inkFaint": "",
      "accent": "", "accentDeep": "",
      "rule": ""
    }
  }
}
```

Every field conditionally renders (nothing shows if absent/null) — that
pattern held up well across all six rounds and is worth keeping as the
stated convention, just documented once instead of re-derived per field.

Also worth documenting as a fixed pattern in the skill (this is the actual
mechanism, works well, no changes needed to it): theme colors are applied at
**runtime** via `document.documentElement.style.setProperty(...)` from
`config.theme.colors` in a `useEffect` on mount, with matching hardcoded
defaults in `index.html`'s `:root` block purely to avoid a flash before JS
runs. Same pattern for font: a `<link>` tag is injected dynamically for
`config.theme.font` rather than hardcoded in the HTML, so swapping fonts is a
pure config change.

## Layout gotcha worth documenting

Splitting a single `max-width` column into "full-width header + centered
content below" introduced a genuine regression that only showed up when
testing actual scroll behavior with enough messages to overflow: the outer
shell used `min-height: 100vh`, which let it grow *past* the viewport when
content demanded it, so the whole page scrolled instead of just the message
list. Fix: the outer shell needs a hard `height: 100vh` (plus `html, body { height: 100%; }`), not `min-height`, for a flex child's `overflow-y: auto` to
actually activate instead of just growing the page. Worth a one-line note in
the skill wherever it documents any full-height chat layout.
