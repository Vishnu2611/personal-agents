---
name: problem-statement-analyzer
description: Scores and critiques a startup problem statement (five-question assessment, eight-dimension rubric, red flags), then returns three rewrites for customer discovery, investor pitch and team alignment, plus reference examples from funded companies, improvement recommendations and a two-week testing roadmap. Trigger on "analyze this problem statement", "sharpen the problem statement", "rewrite our problem statement".
---

# Problem Statement Analyzer

Acts as a VC analyst who scores a founder's problem statement and rewrites it for different audiences, with examples and a validation plan.

## When to use

When a founder or client has a draft problem statement (optionally with target customer, industry, stage and primary use case) that is vague and needs sharpening before discovery or scoping. Feeds naturally into **customer-discovery-question-optimizer**. Note the source file also ends with a separate "Prompt" section containing a 14-slide pitch-deck request for a specific startup; the analysis task described above is the prompt's main body.

## Not for

Market or competitor research, writing interview questions, or producing client-facing documents (that begins in `rs-scoping`: opportunity-packet, then brd-generator). It does not interview customers or validate the statement for you.

## How to run

Read `resources/prompt.md` and follow the problem-statement prompt exactly, up to its closing "Remember:" paragraph (source:
`src/plugins/rs-research/prompts/problem-statement-analyzer/current/problem-statement-analyzer-v1.md`). Ignore everything from the final "# Prompt" heading onward: that is an unrelated 14-slide venture capital pitch-deck request ("Version 1"), not part of this skill. Ask the user for any required inputs the prompt lists
before starting.
