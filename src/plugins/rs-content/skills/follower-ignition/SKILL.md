---
name: follower-ignition
description: Build a 6-week, no-ad-spend plan to take a dormant or under-followed RightShift/IntuitioLabs LinkedIn company page to a credible one — invite filter, 90-day credit plan, team activation message, routing habits, first-visit checklist. Trigger on "grow our LinkedIn followers", "LinkedIn page follower plan", "invite credits plan".
---

# LinkedIn Follower Ignition

Turns page followers, connection count, admin invite credits and team profiles into a 5-part plan: who to
invite and who to skip, a 90-day credit schedule by ICP segment, a team-activation message, repeatable
routing habits, and a pre-flight checklist for what must be live before the first invite goes out. Each
phase ends at a STOP checkpoint.

## When to use

When growing the RightShift/IntuitioLabs LinkedIn company page organically — no ad budget, no purchased
followers. Have ready: current followers, the admin's connection count, how many admins have invite credits,
team member names/profile links, and the page + personal profile URLs. The prompt asks for the ICP segment
and page positioning tagline itself, through the question box — it does not assume either.

## Not for

Paid LinkedIn campaigns, post content (see `linkedin-post-machine` once that's wrapped, or `deep-voice-guide`
for voice), or personal profile growth unrelated to the company page.

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/rs-content/prompts/follower-ignition/current/follower-ignition-v1.md`). Ask for the inputs it
lists at its Input Validation Gate, use `AskUserQuestion` for the ICP segment and tagline exactly as the
prompt specifies, and do not skip its STOP checkpoints.
