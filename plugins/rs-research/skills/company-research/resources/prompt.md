---
name: Company Research
notion_page_id: 349b19fdbedb80af92b2c5324645da23
notion_url: https://app.notion.com/349b19fdbedb80af92b2c5324645da23
version: 1
status: Done
pulled_on: 2026-06-29
---

# 🏢 Company Research

> Category: Discovery & Strategy
> Description: Takes any prospect company name and transforms it into a ready-to-use sales engagement package through systematic research and analysis.
> Function: Founder, Product, Sales / Account
> RS Business Unit: Venture, Accelerator
> Outcome Type: Growth
> Time Savings Or Value: Time Savings
> Type: Claude Prompt
> Latest Version: 1
> Status: Done
>
> Inputs Required:
> - Prospect company name
> - Optional: relationship context, prior touch history
>
> Outputs Produced:
> - Sales engagement package: company overview, key people, pain signals, talking points
> - Destination: outbound sequence / sales CRM
>
> Cost Estimate per Run:
> - Estimate: $0.30
> - Model: Claude Sonnet 4.5 + web search
> - Pricing assumption: $3/M input tokens, $15/M output tokens
> - Token band: Medium-Heavy
> - Token estimate: ~30k in / 10k out

---

# **Company Research Prompt for IntuitioLabs Sales Engagement**

> 📌 might use gumdrop for this.

# Purpose

Takes any prospect company name and transforms it into a ready-to-use sales engagement package through systematic research and analysis.

## **Key Outputs**

1. **Company Intelligence** - Current business profile, recent news, and market positioning
2. **Tailored Value Propositions** - 3-5 specific ways IntuitioLabs can help based on the company's profile and pain points
3. **Sales Strategy Guidance** - Relevant case studies, talking points, and engagement angles for Account Executives
4. **Ready-to-Send Responses** - Three distinct email templates with different tones (direct, consultative, insight-driven)

# Steps

1. Input latest version of prompt into claude with `research option enabled`
2. evaluate output, edit the output as needed
3. Iterate to get best **Prospect Engagement Response Options for email and linked in**
4. For meeting stage send verified and updated final prompt output as company research package to account executive

# Version1 (toggle)

	**Role:** Act as a specialized Sales Intelligence Agent for IntuitioLabs. **Objective:** Generate a comprehensive, actionable company intelligence package for a prospect that has shown positive interest, to inform immediate prospect engagement and prepare Account Executives for follow-up.

	**Given the prospect's company name:** **[Insert Company Name Here]**

	**Please provide the following detailed outputs, structured for quick review and direct application by IntuitioLabs' Sales Ops Tech and Account Executives:**

	1. **Company Overview and Recent News:**
	◦ Provide a concise **summary of the company's core business, industry, and primary market position**.
	◦ Highlight any **significant recent news, press releases, product launches, funding rounds, strategic partnerships, or notable market trends** impacting the company within the last 6-12 months.

	2. **IntuitioLabs Value Proposition Ideas (3-5 Tailored Suggestions):**
	◦ Based on the company's profile, industry, and recent activities, propose **3 to 5 specific, tailored ideas on how IntuitioLabs can help this company**. IntuitioLabs specializes in enhancing outbound sales operations through platform management, campaign execution, response monitoring, and pipeline management. Focus these ideas on potential pain points or growth opportunities where IntuitioLabs' services would deliver clear value.

	3. **Relevant IntuitioLabs Case Studies and Talking Points:**
	◦ Suggest **specific themes, industries, or problem-solution scenarios for IntuitioLabs case studies** that would be most pertinent and compelling to this company.
	◦ Identify **key talking points or questions** an Account Executive should consider when engaging with this prospect, drawing from the company's profile. *(Assume IntuitioLabs has a knowledge base of its own successful projects for you to draw thematic relevance from).*

	4. **Prospect Engagement Email Response Options (3 Distinct Drafts):**
	◦ Draft **three distinct, intelligent email response options** for the Sales Ops Tech to use when replying to the prospect's positive initial interest via email (SmartLead or Apollo). Each option should:
	▪ **Acknowledge and appreciate their positive response.**
	▪ **Reference a specific insight** from the research package (e.g., recent news, a potential challenge identified) to show personalization.
	▪ **Propose a clear, low-friction next step** (e.g., a brief 15-minute call to explore their needs, sharing a relevant resource based on their profile, or offering a quick assessment).
	▪ Vary in tone or approach (e.g., direct, consultative, value-driven, question-based) to offer flexibility.

	5. **Prospect Engagement LinkedIn Response Options (3 Distinct Drafts):**
	◦ Draft **three distinct, intelligent LinkedIn message response options** for the Sales Ops Tech to use when replying to the prospect's positive initial interest via LinkedIn (HeyReach or company inboxes). Each option should:
	▪ **Acknowledge and appreciate their positive response or connection request.**
	▪ **Reference a specific insight** from the research package (e.g., recent company news, a relevant industry trend) to demonstrate informed engagement.
	▪ **Propose a clear, low-friction next step** suitable for LinkedIn (e.g., a brief chat, sharing a relevant article, suggesting a short call, or asking a probing question to uncover more needs).
	▪ Vary in tone or approach (e.g., conversational, direct, value-add, question-led) to offer flexibility for different LinkedIn interactions.

	**Formatting Requirement:** Present the information clearly under each numbered heading, using bullet points or concise paragraphs where appropriate for readability. The output should be ready for immediate sharing via Slack and for crafting prospect replies.
