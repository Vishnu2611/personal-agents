// api/chat.js — Anthropic proxy. Copy verbatim; do not hand-author a replacement.
// Model, max tokens and prompts come from chatbot.config.json — nothing here is
// project-specific. ANTHROPIC_API_KEY / SITE_PASSWORD never reach the browser.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, "chatbot.config.json"), "utf8"));
const systemPrompt = fs.readFileSync(path.join(root, config.prompts.system), "utf8");
const knowledgeBase = fs.readFileSync(path.join(root, config.prompts.knowledgeBase), "utf8");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (config.access === "password") {
    const provided = req.headers["x-site-password"];
    if (!provided || provided !== process.env.SITE_PASSWORD) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages must be a non-empty array" });
    return;
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      system: `${systemPrompt}\n\n${knowledgeBase}`,
      // Adaptive-thinking-capable models (Sonnet 5 and newer) return a `thinking`
      // block as content[0] when this is omitted — that silently breaks the
      // content[0].text read below on every response. Keep this explicit.
      thinking: { type: "disabled" },
      messages,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    res.status(upstream.status).json({ error: "Anthropic API error", detail });
    return;
  }

  const data = await upstream.json();
  const text = data.content?.[0]?.text ?? "";
  res.status(200).json({ text });
}
