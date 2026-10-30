---
name: Competitive and Market Research
notion_page_id: 349b19fdbedb80da91a4d9251059e80b
notion_url: https://app.notion.com/349b19fdbedb80da91a4d9251059e80b
version: 1
status: Done
pulled_on: 2026-06-29
---

# 🔎 Competitive and Market Research

> Category: Discovery & Strategy
> Description: Synthesizes Gemini + Perplexity deep research into a conflict-checked market, competitive, and startup viability analysis with citations.
> Function: Founder, Product, Sales / Account
> RS Business Unit: Venture, Accelerator
> Outcome Type: Productivity
> Time Savings Or Value: Value
> Type: Claude Prompt
> Latest Version: 1
> Status: Done
>
> Inputs Required:
> - Gemini Deep Research output
> - Perplexity Deep Research output
> - Startup/product description
>
> Outputs Produced:
> - Conflict-checked synthesis across sources (market, competitive, viability)
> - Citations preserved
> - Destination: cohort research Notion page / VC memo
>
> Cost Estimate per Run:
> - Estimate: $0.60
> - Model: Claude Sonnet 4.5
> - Pricing assumption: $3/M input tokens, $15/M output tokens
> - Token band: Heavy
> - Token estimate: ~80k in / 20k out

---

[Table of Contents]

# A-Market and Competitve Analysis

## Step 1 : Enter the following prompt in google Gemini with Deep research enabled

> 🏃
> Objective:
> Generate:
> Executive summary
> Market analysis
> Competitive analysis
>
> I am conducting a competitive and market analysis for a new startup idea:
>
> Product description:
> Its a AI-powered platform helping small businesses find, apply to, and succeed at pop-up markets'm a small business owner turned tech startup founder, building from a lived experience and real pain point. After navigating fragmented vendor processes across markets nationwide,  to build a solution that's both personal and scalable.
>
> Target Market:
> is  pop up managers and vendors
>
> Please provide the following:
> Executive Summary of the opportunity, trend, and market gap.
> Market Analysis: market size, audience segments, trends, potential growth.
> Competitive Analysis: current players, differentiators, risks.
>
> Then answer these questions:
> Is this a viable product idea in today's market conditions? Why or why not?
> convince me I should build this product
> Be a devil's advocate: why might this idea fail?
>
> If we are a self-funded small team with a 12-month runway, should we pursue this? Are there narrower versions that improve our chance of success?
> give references to data for all data used or cited

## Step 2 : Enter the same prompt above in perplexity with Deep research enabled

## Step 3 : Combine the prompts using the following Claude prompt

> 🏃
> **STARTUP ANALYSIS SYNTHESIS PROMPT:**
>
> You are an expert business analyst tasked with synthesizing market research from two AI sources (Gemini and Perplexity) into actionable startup insights.
>
> **INPUTS:**
> - Startup Name: [STARTUP_NAME]
> - Product Description: [PRODUCT_DESCRIPTION]
> - Target Market: [TARGET_MARKET]
> - Gemini Analysis: [GEMINI_OUTPUT]
> - Perplexity Analysis: [PERPLEXITY_OUTPUT]
>
> **ANALYSIS FRAMEWORK:**
>
> 1. **Parse both analyses for:**
> 	- Market size data (dollar amounts, growth rates)
> 	- Competitor information (names, funding, market share)
> 	- Timeline estimates (months/years to profitability, market entry)
> 	- Risk factors and challenges
> 	- Opportunities and advantages
> 	- Strategic recommendations
>
> 2. **Identify conflicts between sources:**
> 	- Market size discrepancies (>10% difference)
> 	- Growth rate variations (>2% difference)
> 	- Competitor count differences
> 	- Timeline estimate conflicts
> 	- Contradictory recommendations
>
> **OUTPUT REQUIREMENTS:**
>
> Generate exactly three artifacts:
>
> **📋 EXECUTIVE SUMMARY**
> - Key opportunities synthesized from both sources
> - Primary risks identified across analyses
> - Critical conflicts between Gemini and Perplexity (if any)
> - Recommended strategic actions
> - Format: Clear conflict callouts with source tags [Gemini] vs [Perplexity]
>
> **📊 MARKET ANALYSIS**
> - Market size synthesis (reconcile conflicting data)
> - Growth projections from both sources
> - Key timeline milestones
> - Market entry barriers and opportunities
> - Format: Highlight data conflicts with source attribution
>
> **⚔️ COMPETITIVE ANALYSIS**
> - Comprehensive competitor landscape from both sources
> - Funding and market position data
> - Competitive challenges and advantages
> - Strategic positioning recommendations
> - Format: Note conflicts in competitor assessment
>
> **CONFLICT REPORTING:** For any disagreements between sources:
> - Clearly mark with visual indicators
> - Show exact conflicting data points
> - Attribute to specific source [Gemini] or [Perplexity]
> - Provide synthesis rationale when possible
>
> **TONE:** Professional, data-driven, actionable. Focus on decision-making insights for startup founders with limited runway.

*Prototype for when we built page for this*

[bookmark: https://app.notion.com/p/349b19fdbedb80da91a4d9251059e80b#21cb19fdbedb80179168cf85365bd35b]

---

# B- Real-world insipiration for product

## Step 1 : Enter the following prompt in google Gemini with Deep research enabled

> 🏃 Based on the *previous* market and competitive analysis, highlight 3 potential product differentiation that would stand out. Keep in mind successful examples of *other disruptive products where a startup successfully differentiated in a crowded market of old incumbents from large enterprises*.

## Step 2 : Enter the same prompt above in perplexity

## Step 3 : Combine the prompts using Claude

*Prototype for when we built page for this*

[bookmark: https://app.notion.com/p/349b19fdbedb80da91a4d9251059e80b#21cb19fdbedb80eb8338df59c1c0c448]

---

# C- Target and Segment user profile

## Step 1 : Enter the following prompt in google Gemini with Deep research enabled

> 🏃 Based on the previous analysis and the chosen product differentiation, identify **2 separate target user and buy segments** for our product. For each target segment provide: **TAM, key characteristics, key value propositions factors**. Compare and contrast the 2 segments and recommend related GTM motions if choosing as primary segment. Also create anti-personas: ie. not target user segment

## Step 2 : Enter the same prompt above in perplexity

## Step 3 : Combine the prompts using Claude
