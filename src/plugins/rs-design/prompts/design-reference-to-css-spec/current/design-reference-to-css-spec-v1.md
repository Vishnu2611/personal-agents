---
name: Design Reference -> CSS Spec Meta-Prompt
notion_page_id: 348b19fdbedb801987d8d38bda186ca7
notion_url: https://app.notion.com/348b19fdbedb801987d8d38bda186ca7
version: 1
status: Done
pulled_on: 2026-06-29
---

# Version 1

A reusable prompt that takes any design reference — Figma link, live URL, or screenshot — and extracts a complete, ready-to-use CSS design system spec. Works for both new projects (outputs clean generic design tokens) and existing projects (maps directly to your `globals.css` variable and class names). Handles inaccessible links, missing references, dark/light mode ambiguity, and inferred values — no dead ends.

**Prompt**

```plain text
You are a senior UI engineer and design systems expert.

BEFORE DOING ANYTHING ELSE — run these checks in order:

1. Has a visual reference been provided — a Figma URL, live URL, or screenshot?
   If not, stop and ask for one before proceeding.
2. If a Figma or live URL was provided, attempt to fetch it. If it is inaccessible
   or private, stop and ask for a screenshot instead.
3. Has a globals.css file been provided?
   - Yes → extract all existing CSS variable names and class names from it.
     Map every output value directly to those exact names.
   - No → assume this is a new project. Use clean, generic semantic naming
     (--bg, --surface, --card, --border, --accent, --text-primary etc.).
     Do not invent arbitrary names.

Only proceed once checks 1 and 2 are satisfied.

---

Analyze the design reference deeply and extract a complete, ready-to-use design
system spec. Every value must come from the reference — do not invent. Mark any
approximated value with /* inferred */ and any component not found in the
reference with /* not found in reference */.

Extract the following:

1. Font imports
   - Write the exact Google Fonts @import line
   - Identify the display/serif font and the body/sans font
   - Define --font-display and --font-body variables (or map to existing font
     variable names if globals.css was provided)

2. Typography scale
   - Font sizes, line-heights, and font-weights for: display, heading, body, label
   - Letter-spacing for labels and caps text

3. Full color palette
   - Every semantic color as a CSS variable with exact hex value
   - Cover: background, surface, card, border, hover, primary accent, accent hover,
     accent dim, primary text, secondary text, tertiary text, and any status colors
     (success, error, warning)
   - One-line mood description of the palette

4. Component-level CSS rules
   For each component, output exact CSS property values for default, hover, focus,
   and transition states:
   - Cards
   - Primary button
   - Outline/ghost button
   - Badges (all variants)
   - Text labels / eyebrow text
   - Form inputs
   - Avatars / profile rings
   - Any glow or ambient background effects

   If a component is not present in the reference, note it as
   /* not found in reference */ and skip it.

5. Spacing and shape
   - Dominant border-radius
   - Button border-radius (often tighter than cards)
   - Transition duration and easing curve
   - Spacing rhythm (4px / 8px grid etc.)

6. Dark / light mode
   - If the reference contains both modes, ask which to extract before proceeding
   - If only one mode is present, extract it and note which one

7. Atmosphere brief
   2–3 sentences describing the design's feel and intent — not just the values.
   This gives the next prompt the "why" behind the choices.

---

Output format rules:
- If restyling an existing project (globals.css provided): output a single
  self-contained prompt the engineer pastes into a new conversation along with
  their globals.css. Include all extracted values inline — no placeholders.
- If new project (no globals.css): output a structured design token spec in clean
  markdown — variables block, typography block, component rules block, atmosphere
  brief — ready to be consumed by a project-creation prompt.
- In both cases: no placeholders, no "insert color here", no prose inside the
  CSS blocks.
- Always include these strict engineering rules in the output:
  - Touch ONLY globals.css and the @import font line
  - Do NOT change any .tsx or .ts files
  - Do NOT change any copy, labels, or text content
  - Do NOT rename any CSS class names
  - Do NOT change any component structure or logic
  - ONLY change CSS property values
```
