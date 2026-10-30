---
name: rightshift-propel
description: Guides a founder through building an early signed-in product web application beyond the launch page, using Claude, Lovable and Supabase plus a catalog of reusable features (login, profile, payments, search and more). Trigger on "Propel engagement", "build the product web app", "grow beyond the launch page".
---

# RightShift Propel

A step-by-step how-to guide (not a single prompt) for the Propel tool chain: write the web-app generation prompt in Claude, build the app in Lovable, add a Supabase database, add features from the feature catalog, then modify and fix errors.

## When to use

Use when the engagement is Propel: the founder needs a function-oriented web application with user accounts, dashboards and personalised experiences, not a marketing site. Requires the Design Tool Chain outputs (wireframes, logo, brand) and accounts on Claude, Lovable, Supabase and Clarity plus a domain. Steps 1 to 3 are skipped if already done in `rightshift-spark`. Step 4 lists 19 catalog features (Header, Footer, Signup, Login, Magic Link, Payment Gateway Integration, Scheduling and others) with links to Notion pages that are not part of the prompt text. The final copyright and NDA line is a footer notice, not an instruction.

## Not for

Production delivery of an approved PRD (use `rs-delivery`), a marketing or launch site with a waiting list (use `rightshift-spark`), and visual or brand design work (use `rs-design`).

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-prototype/prompts/rightshift-propel/current/rightshift-propel-v1.md`). Ask the user for any required inputs it lists
before starting.
