---
name: RightShift Feature Generator
notion_page_id: 349b19fdbedb803aac34d4402277692f
notion_url: https://app.notion.com/349b19fdbedb803aac34d4402277692f
version: 1
status: Done
pulled_on: 2026-06-29
---

# 🧪 RightShift Feature Generator

## Step 1 : Enter the following prompt into google Gemini with "Deep Research" enabled or with Claude

> 📌 **Note that the prompt below takes the following inputs for best contextual output. Do not skip providing these inputs. These are all items you should have accumulated over the past few weeks of the Accelerator.**
>
> - **Problem Statement**: The core problem being solved (can be part of a pitch deck )
> - **Solution Statement**: The proposed solution approach (can be part of a pitch deck )
> - **Customer Interview Notes**: Raw insights from potential users *(PRIMARY SOURCE - weight heavily) Do NOT include your Key Quotes, Insights, Referrals, Next Steps. If you do AI will pick it up and build on it and we want to avoid that. LLMs are very good at text synthesis. so you want to give it as much as possible and let it do the synthesis.*
> - **Lean Canvas**: Business model overview

> 📌 <u>Copy the entire prompt below AS IS along with the inputs called out above into Google Gemini (with Deep Research) and Claude in this Step.</u>

> 🏃
>
> ### Overview
>
> You are an expert product strategist helping accelerator founders define their earliest testable product and create a strategic product roadmap. Your goal is to analyze their startup inputs and research to deliver two key documents that will guide their product development.
>
> ### Your Mission
>
> Generate two comprehensive outputs:
>
> 1. **Earliest Testable Product Features** - A minimal, focused feature set for immediate validation
> 2. **Product Roadmap** - A strategic progression from earliest testable product to MVP and beyond
>
> ### Input Materials Provided
>
> You will receive the following materials from the founder:
>
> - **Problem Statement**: The core problem being solved
> - **Solution Statement**: The proposed solution approach
> - **Customer Interview Notes**: Raw insights from potential users *(PRIMARY SOURCE - weight heavily)*
> - **Lean Canvas**: Business model overview
> - **Platform Context**: Building on Lovable (no-code/low-code platform)
>
> ### Customer Discovery Analysis Required
>
> Before defining features, thoroughly analyze the customer interview notes to identify:
>
> - **Pain Points**: Specific problems customers mentioned experiencing
> - **Current Workarounds**: How customers solve this problem today
> - **Must-Have vs Nice-to-Have**: What customers said they absolutely need vs would be nice
> - **User Behavior Patterns**: How customers currently approach similar tasks
> - **Language & Terminology**: Exact words customers use to describe problems/solutions
> - **Workflow Context**: When, where, and why customers encounter these problems
> - **Decision Criteria**: What would make customers choose this solution over alternatives
>
> ### Research Requirements
>
> Before generating your outputs, conduct web research to:
>
> - Identify 3-5 direct competitors and analyze their core features
> - Find 2-3 similar successful products in adjacent markets
> - Research current market trends and user expectations for this problem space
> - Identify technical feasibility considerations for Lovable platform
> - Look for any relevant case studies or product teardowns
>
> ### Output 1: Earliest Testable Product Features
>
> #### Format Requirements:
>
> For each feature, provide:
>
> ```plain text
> **Feature Name**: [Clear, descriptive name]
> **Priority**: [Critical/High/Medium - only include Critical and High for earliest testable product]
> **User Story**: As a [user type], I want [functionality] so that [benefit]
>
> **Customer Discovery Insight**:
> - **Source**: [Reference to specific interview(s) or pattern across multiple interviews]
> - **Customer Quote/Pattern**: [Direct quote or paraphrased insight from customers]
> - **Pain Point Addressed**: [Specific customer problem this feature solves]
> - **Validation**: [How customers currently handle this need or what they said they'd value]
>
> **Detailed Functional Requirements**:
> - [Specific functionality with input/output specifications]
> - [User interaction flows step-by-step]
> - [Business logic rules and conditions]
> - [Integration points with other features]
> - [Database tables and key fields needed]
> - [Third-party services or APIs required]
>
> **User Experience Specifications**:
> - **User Flow**: [Step-by-step user journey through the feature]
> - **Error Handling**: [What happens when things go wrong, error messages]
> - **Loading States**: [What users see during processing/waiting]
> - **Responsive Behavior**: [How feature works on mobile vs desktop]
> - **Accessibility**: [Screen reader support, keyboard navigation]
>
> **Acceptance Criteria**:
> - [Specific, testable criteria with clear pass/fail conditions]
> - [Performance benchmarks (load times, response times)]
> - [Measurable user outcomes and success metrics]
>
> **Validation Hypothesis**: What user behavior/feedback will validate this feature's value
> **Effort Estimate**: [Small/Medium/Large for Lovable platform with justification]
> **Dependencies**: [Prerequisite features, external services, data requirements - ALL dependencies must be either included as separate features in this list OR available as third-party services]
> **Risk Factors**: [Technical challenges, platform limitations, integration risks]
> ```
>
> #### Guidelines for Earliest Testable Product:
>
> - **Maximum 8-12 features total**
> - **Customer-First Approach**: Every feature MUST be directly traceable to customer discovery insights
> - **Evidence-Based Prioritization**: Features with multiple customer mentions get higher priority
> - **Language Alignment**: Use terminology and workflows that match how customers described their needs
> - **Dependency Completeness**: If a feature requires another feature to function, that dependency MUST be included in the feature list
> - **No Hidden Complexity**: Don't assume complex algorithms, AI models, or custom logic exists unless explicitly defined as a feature
> - **Third-Party vs Custom**: Only assume functionality exists if it's available out-of-the-box from third-party services (Stripe for payments, Twilio for SMS, etc.)
> - Focus on core value proposition validation as expressed by customers
> - Prioritize features that address the most frequently mentioned pain points
> - Ensure 80% of features are "Small" effort on Lovable
> - Include at least one feature that addresses the #1 customer pain point
> - Consider a product led growth product onboarding flow that matches customer mental models (max  4 steps)
> - Include basic analytics/feedback collection capability
> - Avoid features not mentioned or validated by customers in earliest version
>
> #### Dependency Analysis Requirements:
>
> Before finalizing the feature list, conduct a dependency analysis:
>
> - **Identify Hidden Dependencies**: For each feature, ask "What other functionality must exist for this to work?"
> - **Algorithm Detection**: If a feature mentions "recommendations," "matching," "suggestions," "scoring," or "ranking," the underlying algorithm must be a separate feature
> - **Data Processing**: If a feature displays processed data, the data processing logic must be a separate feature
> - **Custom Logic**: Any business logic more complex than basic CRUD operations needs its own feature
> - **Integration Requirements**: If a feature assumes data from another system, the integration must be a separate feature
>
> #### Common Hidden Dependencies to Watch For:
>
> - **Recommendation Systems**: "Show relevant items" requires recommendation algorithm feature
> - **Search Functionality**: "Find content" may require search indexing and ranking features
> - **Matching/Pairing**: "Connect users" requires matching algorithm feature
> - **Notifications**: "Send alerts" requires notification system feature
> - **Analytics/Reporting**: "View insights" requires data processing and visualization features
> - **Content Moderation**: "User-generated content" may require moderation system feature
> - **Scoring/Rating**: "Rate quality" requires scoring algorithm feature
>
> #### Customer Discovery Integration Rules:
>
> - **No Assumption-Based Features**: If customers didn't mention needing it, don't include it in earliest testable product
> - **Quote Directly**: Reference specific customer quotes when possible to justify feature inclusion
> - **Pattern Recognition**: Call out when multiple customers mentioned similar needs
> - **Workflow Matching**: Design user flows that match how customers described wanting to work
> - **Priority by Frequency**: Features addressing problems mentioned by more customers get higher priority
> - **Language Consistency**: Use the exact terms customers used to describe problems and solutions
> - **Context Preservation**: Consider the situational context customers provided about when/why they need solutions
>
> #### Technical Detail Requirements:
>
> - **Be Specific**: Instead of "user can search," specify "user can search by text input with autocomplete, filtering by category dropdown, showing max 20 results per page"
> - **Define Requirements**: Specify database tables, UI components, and key integrations needed
> - **Clarify Integrations**: Name specific APIs, authentication methods, and data formats
> - **Detail User Interactions**: Describe every click, form submission, and page transition
>
> ### Output 2: Product Roadmap
>
> #### Format Requirements:
>
> Organize features across three phases:
>
> **Phase 1: Earliest Testable Product (Month 1)**
>
> - [Features from Output 1]
> - Success Metrics: [Key metrics to track]
> - Validation Checkpoints: [What to measure/learn]
>
> **Phase 2: Enhanced Product (Months 2-3)**
>
> - [Additional features building on learnings]
> - New capabilities based on user feedback
> - Performance and UX improvements
> - Integration features (if validated)
>
> **Phase 3: MVP & Beyond (Months 4-6)**
>
> - [Advanced features for market readiness]
> - Scaling capabilities
> - Revenue-driving features
> - Platform expansion considerations
>
> #### Roadmap Guidelines:
>
> - Each phase should build logically on previous learnings
> - Include decision points based on user feedback
> - Consider technical debt and refactoring needs
> - Plan for platform limitations and workarounds
> - Include features that support business model validation
> - Balance user-requested features with strategic product vision
>
> ### Research Integration Instructions
>
> Your feature recommendations must be informed by (in priority order):
>
> 1. **Customer Discovery Insights (PRIMARY)**: What customers explicitly said they need, struggle with, or would value
> 2. **Competitive Analysis**: What do competitors include in their core offering that customers mentioned or would expect?
> 3. **Market Standards**: What do users expect as baseline functionality (only if validated by customer feedback)
> 4. **Technical Feasibility**: What's realistic on Lovable platform given customer requirements?
>
> #### Customer Insight Integration:
>
> - **Direct Mapping**: Each feature should map to specific customer pain points or requests
> - **Frequency Weighting**: Prioritize features addressing problems mentioned by multiple customers
> - **Context Inclusion**: Consider the full context customers provided about their needs
> - **Language Preservation**: Use customer terminology in feature descriptions
> - **Workflow Alignment**: Design features to match customer-described workflows
>
> #### Balancing Research Sources:
>
> - If customer insights conflict with competitive analysis, prioritize customer insights
> - Use competitive research to enhance customer-validated features, not replace them
> - Market standards only matter if customers explicitly mentioned expecting them
> - Technical constraints should shape HOW to build customer-requested features, not WHETHER to build them
>
> ### Constraints to Consider
>
> - Lovable platform capabilities and limitations
> - Early-stage startup resource constraints
> - Need for rapid iteration and testing
> - Balance between feature completeness and speed to market
> - Technical complexity should match team capabilities
>
> ### Quality Checklist
>
> Before submitting, ensure:
>
> - [ ] **Every feature traces back to specific customer discovery insights**
> - [ ] **Customer quotes or patterns are referenced for each feature**
> - [ ] **Features are prioritized by frequency of customer mentions**
> - [ ] [**All feature dependencies are explicitly included in the feature list OR available as third-party services**
> - [ ] **No features assume complex algorithms, AI models, or custom logic without defining them as separate features**
> - [ ] **Hidden dependencies have been identified and included (recommendation engines, matching algorithms, etc.)**
> - [ ] Features directly address the core problem statement
> - [ ] Each feature has clear validation criteria
> - [ ] Roadmap shows logical progression and learning
> - [ ] Effort estimates are realistic for the platform
> - [ ] Research insights are clearly integrated
> - [ ] Success metrics are specific and measurable
> - [ ] Features support the business model from Lean Canvas
> - [ ] Functional requirements are detailed enough for engineering estimation
> - [ ] User flows include all steps and decision points
> - [ ] Error handling and user experience specifications are included
> - [ ] Performance requirements are included
> - [ ] Dependencies and integrations are explicitly detailed
> - [ ] **No features included that weren't validated by customer discovery**
> - [ ] **Language and terminology matches customer vocabulary**
> - [ ] **Workflows align with how customers described wanting to work**
>
> ### Deliverable Format
>
> Structure your response as two distinct sections in this order:
>
> **1. PRODUCT ROADMAP** (with three-phase structure) **2. EARLIEST TESTABLE PRODUCT FEATURES** (with the detailed format above)
>
> Keep the output focused and direct - minimize preamble and explanatory text. The output should primarily consist of the roadmap phases and detailed feature specifications.
>
> ### Formatting Requirements for Human Readability
>
> #### Document Structure:
>
> - Use clear markdown headers (# ## ###) to organize sections
> - Include proper spacing between sections and features
> - Make the document easy to scan with clear visual hierarchy
> - Use consistent formatting throughout the document
>
> #### Roadmap Formatting:
>
> - Use **bold text** for phase titles and key milestones
> - Include bullet points for feature lists within each phase
> - Add clear section breaks between phases
> - Include success metrics and validation checkpoints in easily scannable format
>
> #### Feature Formatting:
>
> - Each feature should be clearly separated with horizontal lines (---) or clear spacing
> - Use consistent bullet points and sub-bullets for requirements
> - Bold key terms and section headers within features
> - Format user flows as numbered steps when appropriate
> - Use consistent indentation for nested information
>
> #### Overall Presentation:
>
> - Include a table of contents for easy navigation if the document is long
> - Use consistent terminology throughout
> - Format validation criteria as clear, numbered acceptance criteria
> - Present effort estimates and priorities prominently
> - Ensure dependencies are clearly highlighted and easy to spot
>
> Include only a brief **Executive Summary** at the top highlighting:
>
> - Core value proposition being tested
> - Key assumptions to validate
>
> #### Additional Engineering Resources
>
> When possible, supplement feature descriptions with:
>
> - **Wireframes or Mockups**: Simple sketches of key screens and user flows
> - **User Journey Maps**: Visual representation of user interactions
>
> Remember: The goal is rapid validation of customer-discovered needs, not perfection. Every feature should help prove or disprove a key business assumption that emerged from customer discovery, and must be detailed enough for accurate engineering estimation and implementation without requiring clarification meetings.
>
> **Customer Discovery is King**: If customers didn't express a need for it, don't build it in the earliest testable product. Let customer insights drive every decision.
>
> **Complete Dependency Mapping**: Every feature must be buildable with only the features listed OR readily available third-party services. Never assume complex custom functionality exists without explicitly defining it as a feature.

## Step 2 : Review output carefully and ensure it aligns with your understanding and needs

![Screenshot 2025-07-03 at 5.46.43 AM](https://prod-files-secure.s3.us-west-2.amazonaws.com/4a5dcc3a-af66-48bd-b879-dbb6b9d0a96c/c1eb5fcf-895e-4423-9dc0-513533e9be54/Screenshot_2025-07-03_at_5.46.43_AM.png)
