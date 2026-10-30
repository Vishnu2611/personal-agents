# Theme: rightshift (default)

Applies when `chatbot.config.json` sets `ui.theme` to `rightshift`. If the user
names a different brand or aesthetic, use that instead and ignore this file.

## Fonts

```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap
```

- Headings — Fraunces, weight 500, tight negative letter-spacing at large sizes
- Body — IBM Plex Sans 400/500/600
- Numbers, code, eyebrow labels — IBM Plex Mono

No Inter, Roboto, Arial or system stacks.

## Tokens

```css
--bg:          #faf6ee;  /* warm paper, not white */
--paper:       #ffffff;
--ink:         #1a1d24;
--ink-soft:    #5b5953;
--ink-faint:   #8a877f;
--violet:      #6B2BD9;
--violet-deep: #4A1F9E;
--violet-soft: #B89AF5;
--violet-pale: #F5EFFD;
--rule:        #e8e2d4;
--rule-strong: #c9c1ad;
```

## Patterns

- Page background `--bg`; message surfaces `--paper` with 1px `--rule` borders,
  radius 0–3px
- User messages tinted `--violet-pale`; assistant messages on `--paper`
- Eyebrow labels uppercase IBM Plex Mono, ~11px, 0.12–0.14em letter-spacing
- Escalation line ("not covered — ask <human>") in `--ink-faint`, mono, small
