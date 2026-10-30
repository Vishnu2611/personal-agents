---
name: Feature POV Narrative
notion_page_id: 320b19fd-bedb-80d2-b52f-d64d916fd595
notion_url: https://app.notion.com/p/320b19fdbedb80d2b52fd64d916fd595
version: 1
status: Done
pulled_on: 2026-06-29
---

# 👤 Feature POV Narrative

## Properties

- **Benefit:** avoids communication gaps, creates consistency across all client communications
- **Cost Estimate per Run:**
  - Estimate: $0.09
  - Model: Claude Sonnet 4.5
  - Pricing assumption: $3/M input tokens, $15/M output tokens
  - Token band: Light-Medium
  - Token estimate: ~10k in / 4k out
- **Description:** Summarizes the estimate from the user's perspective—value, experience, and outcomes—for inclusion in the final estimation deck.
- **Downstream:** Gamma Platform Proposal Generation
- **Inputs Required:**
  - Feature/estimate list from the estimation deck
  - Target user/persona context
- **Latest Version:** 1
- **Name:** Feature POV Narrative
- **Outcome Type:** Productivity
- **Outputs Produced:**
  - User-POV narrative paragraphs per feature (value, experience, outcome)
  - Destination: Estimation deck / proposal insert
- **RS Business Unit:** Product Studio
- **Reflection Criteria:** (none)
- **Status:** Done
- **Time Savings Or Value:** Value
- **Type:** Claude Prompt
- **Upstream:** https://app.notion.com/p/341b19fdbedb80f6aae3fee1cddfd147

---

## Prompt

I'm going to paste a feature estimation sheet for a software product. Please analyze it and give me:

1. **What the product is** — a plain-English 2-3 sentence description of what this app/platform does
2. **Who the typical user is** — a brief persona (who they are, what they're trying to accomplish)
3. **Feature walkthrough** — for each feature, one sentence explaining what the user actually *does* and *experiences*, written for a non-technical audience. Skip infrastructure items like DevOps, buffer days, and internal calls.

Keep the tone conversational. No technical jargon (no mentions of APIs, backends, SDKs, React, etc.). Write it as if you're explaining the product to a potential investor or first-time user.

## E.g Output

## SuvTV — Sports Streaming Mobile App

This is a **mobile-first sports broadcasting app** (React Native + Python backend) that lets fans watch live and on-demand sports content, buy event tickets, and order match highlights.

---

### The User Journey

**1. Onboarding** User opens the app → splash screen → signs up via email (OTP-verified), Google, or Apple ID → sets a password.

**2. Browsing Content** Home screen shows **Live Now** and **Upcoming Matches**. Users drill into league/tournament listing pages, then tap into a video detail page with thumbnail, metadata, and a play button.

**3. Watching** Powered by Vimeo (HLS/DASH streams). The player has standard controls, a seek bar, and a custom UI skin. Live streams support a DVR window so users can scrub back — but can't go outside that window.

**4. Buying Tickets (SUV Lane)** Users purchase event tickets → receive a QR code → show it at the door. Backend handles issuance and validation.

**5. Ordering Highlights** After a match, users fill out a form to order specific highlight clips. Admin fulfills manually; users can check order history.

**6. Earning Points** Optionally, watching broadcasts earns points visible on the user profile. No redemption yet — just balance tracking.

---

### Admin Side

Django admin panel covers ticket management, highlights order fulfillment, and user/points visibility.
