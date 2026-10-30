# chatbot-forge

Claude Code plugin. Takes a chatbot from interview to live URL in five gated phases.

## Install

```
/plugin marketplace add IntuitioLabsLLC/rightshift-managed-agents
/plugin install rs-chatbot@rightshift
```

## Prerequisites

Install these separately — this plugin defers to them rather than reimplementing them:

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail

claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman
```

ponytail governs what gets built. caveman governs what the agent says.
chatbot-forge turns caveman off for the knowledge-base phase and back on after —
compressed source material is a corrupted knowledge base.

## Phases

| Phase | Output | Gate |
|---|---|---|
| 0 Interview | `chatbot.config.json` | audience, source, must-not-get-wrong, snapshot-vs-live all answered |
| 1 Scaffold | React + `api/chat.js` proxy | build passes, `/ponytail-review` clean |
| 2 Knowledge | `config/knowledge-base.md` | every section sourced, no unresolved conflict, token count reported |
| 3 Grounding | `tests/grounding.md` | covered questions correct AND uncovered questions refused |
| 4 Deploy | live Vercel URL | only runs if gate 3 passed |

## Configuration

Behaviour lives in `chatbot.config.json` plus `config/system-prompt.md` and
`config/knowledge-base.md`. Nothing is hardcoded in `src/`. To change the bot,
edit config and rerun phase 3.
