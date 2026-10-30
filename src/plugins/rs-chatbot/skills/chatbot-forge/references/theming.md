# Theming mechanism (theme-agnostic)

This is the *mechanism* every bot uses to turn `chatbot.config.json`'s
`theme`/`team`/`ui` fields into a rendered app — independent of which palette
is picked. `references/theme-rightshift.md` is the default palette's token
values; this file is how any palette gets applied, and the layout/branding
conventions that go with it. Read both.

## Runtime CSS variable injection

Theme colors are applied at runtime, not hardcoded:

```jsx
useEffect(() => {
  const root = document.documentElement.style;
  const colors = config.theme?.colors ?? {};
  for (const [key, value] of Object.entries(colors)) {
    if (value) root.setProperty(`--${key}`, value);
  }
}, [config]);
```

`public/index.html`'s `:root` block still needs matching hardcoded defaults —
purely to avoid a flash of unstyled content before JS runs, not as the
source of truth. `chatbot.config.json` is the source of truth.

## Dynamic font loading

Don't hardcode a font `<link>` in `index.html`. Inject it from
`config.theme.font` at runtime instead, so a font swap is a pure config
change:

```jsx
useEffect(() => {
  if (!config.theme?.font) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = config.theme.font;
  document.head.appendChild(link);
}, [config]);
```

## Conditional rendering

Every `theme.*`, `team[]`, and `ui.*` field is nullable. Render nothing —
not an empty placeholder — when a field is absent or null. A bot that never
sets `theme.badge` should show no badge at all, not an empty pill. This is
what lets the same `App.jsx` serve a bare-bones bot and a fully-branded one
from config alone.

## Full-height flex-scroll layout

The chat shell needs the message list to scroll on its own, not the whole
page. That requires a hard height, not a minimum one:

```css
html, body { height: 100%; }
.app-shell { height: 100vh; display: flex; flex-direction: column; }
.message-list { flex: 1; overflow-y: auto; }
```

Using `min-height: 100vh` on `.app-shell` instead of `height: 100vh` looks
identical with a handful of messages, but once the message list overflows,
the shell grows past the viewport and the whole page scrolls instead of just
`.message-list`. Test scroll behavior with enough messages to overflow
before calling Phase 1 done, not just a visual glance at an empty chat.
