---
name: design-guidelines
description: Use when a repo has no explicit, written-down visual design system yet — before the first feature-design-brief runs, when starting a greenfield UI project, or when an existing project's colors/type/spacing live only as scattered CSS/Tailwind config nobody's summarized. Trigger on "set up design guidelines", "what's our design system", "define the visual language", or automatically once repo-knowledge-base finishes on a repo with a frontend.
---

# Design Guidelines

Produces one durable file — `Design Guidelines/design-system.md` — that every
`feature-design-brief` and implementation task reads before touching UI code.
Run once per repo (like `repo-knowledge-base`), not per ticket; re-run when the
system visibly drifts from the doc.

**Altitude rule:** does not pick colors/fonts/spacing by itself and call it
done — for a greenfield system it asks the human first; for an existing system
it only writes down what the code actually evidences. Never fabricate a token
or convention that isn't confirmed or observed.

## Prerequisites

- `frontend-design` skill available (ships with this marketplace's parent
  plugin set) — load it for aesthetic-direction and anti-genericism guidance.
- Vercel skills available for the composition/React side: `vercel:shadcn`,
  `vercel:react-best-practices`, `vercel:nextjs`. Load whichever apply to the
  target stack.
- **Optional, recommended:** the Bencium UX Designer plugin
  (`github.com/bencium/bencium-marketplace` — `bencium-controlled-ux-designer`
  for an established system, `bencium-innovative-ux-designer` for greenfield).
  If not installed, don't block — apply its core discipline manually instead
  (see Step 2): ask before deciding colors/fonts/spacing rather than picking
  silently.
- `manifest.yaml` from `rs-delivery:repo-knowledge-base`, if it's been run —
  read it first for tech stack instead of re-discovering it.

## How to run

### Gate 0 — fresh or existing?

Check for evidence of an existing UI: a component library import (shadcn
`components.json`, MUI theme, Chakra, etc.), a `tailwind.config.*`, CSS custom
properties, or rendered pages/screenshots. If genuinely absent, this is
**fresh**. If any exist, this is **existing** — even a partial or inconsistent
one. If ambiguous, ask the human rather than guessing.

### Fresh path — define from scratch

1. **Ground in real examples first.** WebSearch/WebFetch 2-3 live products in
   the same category as what's being built. Note each one's URL and the
   specific pattern being borrowed (a nav structure, a card density, a type
   scale) — not a screenshot copy, a directional reference. This is what keeps
   the result from reading as generic AI-template output. If WebSearch/WebFetch
   isn't available in this session, say so explicitly and use 2-3 real products
   from your own knowledge instead — never skip this step and draft ungrounded.
2. **Ask, don't invent.** One round of concrete questions: brand tone
   (e.g., "utilitarian dashboard" vs "consumer marketing"), target users,
   light/dark requirement, any existing brand assets (logo, existing palette)
   to anchor to, WCAG target (default AA, confirm if AAA needed), and
   **component library choice** (e.g. shadcn/ui vs. another system) — this is
   as consequential as a color pick, so it's asked here, not silently decided
   in Step 3. This mirrors Bencium's controlled-designer discipline whether or
   not that plugin is installed.
3. **Draft the system** using `frontend-design` skill guidance plus the
   Vercel skills above for component/composition conventions: color palette
   (with tokens, not just hex), typography (family + scale), spacing scale,
   tone/voice, light/dark handling — everything from Step 2's answers plus
   the reference examples, not new undiscussed decisions.
4. **Write `Design Guidelines/design-system.md`** (shape below).

### Existing path — extract & document

1. **Read the evidence**, don't interview: `tailwind.config.*`, CSS custom
   properties, theme files, `components.json` or equivalent, any Storybook or
   design-token file, existing pages for observed patterns.
2. **Cross-check with `frontend-design` + Vercel skills** for internal
   inconsistency (e.g., two different button radii, three near-duplicate
   blues) — flag each as `DESIGN GAP:` rather than silently picking one.
3. **Write `Design Guidelines/design-system.md`** sourced only from what's
   observed; every `DESIGN GAP:` stays visible in the doc, not resolved by
   guessing.

### `design-system.md` shape (both paths)

```markdown
# Design System — <repo name>

Source: <fresh | extracted from <files>>  Generated: <date>

## Palette
<tokens with values, light + dark if applicable>

## Typography
<font family, weights, type scale>

## Spacing & layout
<scale, grid/container rules>

## Components
<library in use (e.g. shadcn/ui), key primitives, composition conventions>

## Tone & voice
<one paragraph>

## Accessibility baseline
WCAG <AA|AAA>. <any project-specific requirement>

## Reference examples
- <product> — <URL> — <what pattern was borrowed>

## DESIGN GAP
<inconsistencies found in the existing system, or empty>
```

### Report back

State the file's path and every `DESIGN GAP:` out loud. Don't invoke
`feature-design-brief` or any other skill from here — this is a standalone
step other skills read from, same shape as `repo-knowledge-base`.

## Inputs you need from the user

- **Required (fresh path only):** brand tone, target users, light/dark
  requirement, WCAG target if not AA, component library choice.
- **Optional:** existing brand assets to anchor to; confirmation on Gate 0 if
  ambiguous.

## Output

`Design Guidelines/design-system.md` at the target repo's root. Downstream,
every `feature-design-brief` cites this file's tokens instead of inventing new
ones per feature, and implementation tasks are told to read it before writing
UI code.
