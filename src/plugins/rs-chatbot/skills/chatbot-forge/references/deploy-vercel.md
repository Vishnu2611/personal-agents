# Deploy to Vercel

Do not start until Gate 3 has passed. Confirm with the user first.

## 1. Repo

```bash
git init && git add -A && git commit -m "feat: <slug> chatbot"
gh repo create <slug> --private --source=. --push
```

`.gitignore` must contain `.env.local` and `node_modules`. Verify before the
first push — an API key in git history is not fixed by a later commit.

## 2. Link and configure

```bash
vercel link
vercel env add ANTHROPIC_API_KEY production
# only if chatbot.config.json sets access: "password"
vercel env add SITE_PASSWORD production
```

**Gotcha:** `vercel env add`'s interactive default produces a "Sensitive"
variable. That's fine in production (Vercel decrypts it at real runtime),
but `vercel dev` cannot decrypt a Sensitive var locally — it hands your code
a redacted placeholder, and the Anthropic API then rejects it as an invalid
key with no indication why. You should not need `vercel dev` for local
iteration at all: `npm run dev` (Phase 1's `scripts/dev-server.mjs`) reads
`.env.local` directly and needs no Vercel env vars. Reserve `vercel dev` for
testing actual Vercel request-routing behavior; if you do use it, pick the
non-Sensitive/"Encrypted" type when adding the var.

## 3. Preview before production

```bash
vercel deploy
```

Run the Phase 3 grounding test against the preview URL. The preview runs the
real model against the real KB; the local build may not.

**Gotcha:** this only produces a real, non-aliased preview URL if Git
integration is connected and working. Without it, `vercel deploy` aliases
straight to the production domain on the very first deploy — the "preview
first" safety net silently doesn't happen. Check the deploy command's output
(or `vercel inspect <url>`) for `target: "production"` before assuming
you're looking at a preview; if it says production, Git integration didn't
connect and the grounding test just ran against the live URL instead.

## 4. Production

```bash
vercel deploy --prod
```

## 5. Custom domain

Add the domain in the Vercel project, then point DNS:

```
CNAME  <subdomain>  cname.vercel-dns.com
```

Wait for the certificate to issue before sending the link to anyone.

## 6. Hand back

Report: production URL, custom domain status, which env vars are set (names
only, never values), and the Gate 3 result table.

## Updating the knowledge base later

Edit `config/knowledge-base.md`, rerun Phase 3, then redeploy. Rerunning the
grounding test is not optional — a KB edit is exactly when fabrication returns.

## Cost

Roughly $0.003 per conversation on Sonnet at this prompt size. Report the KB
token count so the user can estimate their own volume.
