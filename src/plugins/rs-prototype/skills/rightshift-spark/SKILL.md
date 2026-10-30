---
name: rightshift-spark
description: Guides a founder through building and launching a product launch / marketing website with a waiting list, emails, analytics and a custom domain, using Claude, Lovable, Supabase, SendGrid, Clarity, GitHub and Vercel. Trigger on "Spark engagement", "build the launch page", "marketing site with waiting list".
---

# RightShift Spark

A step-by-step how-to guide (not a single prompt) for the Spark tool chain: write the site-generation prompt in Claude, build the site in Lovable, add a Supabase database, fix issues, wire SendGrid confirmation emails, add Microsoft Clarity analytics, and deploy to a custom domain via GitHub and Vercel.

## When to use

Use when the engagement is Spark: the founder needs a multi-page marketing presence (Home, About, Pricing, Testimonials) that captures a waiting list and shows traction data. Requires the Design Tool Chain outputs (brand guideline, wireframes, logo) and, per the prompt's prerequisites, a domain and accounts on Claude, Lovable, Supabase, SendGrid, Clarity, GitHub and Vercel. Run the Claude prompt in the same Claude conversation used for the design tool chain. Spark comes first; `rightshift-propel` is the follow-on for a signed-in web app. The guide links to Notion pages and Quick Fit example outputs that are not part of the prompt text; do not expect to open them.

## Not for

Production delivery of an approved PRD (use `rs-delivery`), a signed-in product web application (use `rightshift-propel`), and visual or brand design work (use `rs-design`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-prototype/prompts/rightshift-spark/current/rightshift-spark-v1.md`). Ask the user for any required inputs it lists
before starting.
