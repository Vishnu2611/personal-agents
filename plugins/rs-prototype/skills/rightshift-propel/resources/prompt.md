---
name: RightShift Propel
notion_page_id: 349b19fdbedb80d0865dcbcd4a0dcc01
notion_url: https://app.notion.com/349b19fdbedb80d0865dcbcd4a0dcc01
version: 1
status: Done
pulled_on: 2026-06-29
---

# 🚀 RightShift Propel

# **Grow Beyond your early Testable Product**

> 🔥 Accelerate growth with AI-powered tools for scaling beyond the launch phase. Develop polished presentation materials, investor-ready visuals, and market validation assets. Propel your startup into its next phase with a focus on growth and scalability.

# Definition- Product Web Application

- **Purpose**: Provide functional utility to signed-in users
- **Scope**: Complex system with user accounts and personalized experiences
- **Content**: User dashboard, tools, settings, interactive features
- **Design**: Function-oriented UI focused on usability and workflow efficiency
- **Example use**: SaaS platform where users manage their accounts and use the product

# Document Outline

The document below will outline a step-by-step process that will allow you to create the following:

- Create a prompt for generating a Testable Product site
- Create a Testable Product site using the wireframe, logo, and branding input.
- Create a prompt for generating web app
- Create an early Testable Product App using the wireframe, logo, and branding input.

# Pre-Requisites

- Follow all the steps outlined in [Design Tool Chain page](https://app.notion.com/p/207b19fdbedb801f808cf939f1cc93e3)
- Register a domain at [GoDaddy](https://www.godaddy.com)
- [Claude](http://claude.ai) *Pro Plan - 20$ / month*
- [Lovable](https://lovable.dev/) - *Starter plan 20$ / month*
- [Supabase](https://supabase.com/) - *Pro plan - 25$ / month*
- [Clarity](https://clarity.microsoft.com/) - *Free plan*

# The How to Guide

## Step 1 - Create a prompt for generating a web application site

### Description

In this step, we will define a structured prompt that guides an AI code generator to create a web application. This prompt should include the application's functional and non-functional requirements, a comprehensive feature list, user stories, and detailed descriptions of wireframes. The goal is to ensure the AI can generate a well-structured, user-centric, and brand-aligned web application.

### Tools

Claude

### Prompt

> 🚫 You only need to do this step if you have not performed this step as part of the [Spark AI tool chain](/207b19fdbedb80628028e164e474ada6?pvs=25#207b19fdbedb81d88baccd8183252147)

> 🔥 Please make sure you copy the prompt and execute it in the SAME prompt window of Claude you used as part of the design tool chain steps. Context is crucial for AI models. Not doing this will create sub-optimal results.

> 📖 **Prompt**
>
> ---
>
> Create a comprehensive prompt for an AI chatbot (code generator) to build a web application. The prompt should clearly communicate the application's purpose, core features, user stories, design references, and technical expectations. Follow these structured instructions:
>
> **Instructions**
>
> 1. **Provide a brief introduction to the project**
>    - Describe the application's purpose and target audience.
>    - Highlight the main problem it solves or the opportunity it addresses.
> 2. **Detail the application requirements**
>    - List all **functional requirements** (e.g., authentication, data entry, dashboards).
>    - Include any **non-functional requirements** (e.g., performance, scalability, accessibility).
>    - Specify **constraints** (e.g., responsive design, cross-browser compatibility).
> 3. **Present the feature list and user stories**
>    - Provide a **clear, itemized list of features**, grouped by modules or user roles.
>    - Write **user stories** using the standard format:
>      *As a [user type], I want to [goal] so that [reason].*
>    - Ensure the feature list maps directly to the user stories where applicable.
> 4. **Specify the technology stack**
>    - The frontend must be developed using **React**.
>    - A global state management solution must be used (e.g., **Redux**, **MobX**, or **React Context API**).
>    - Clarify any integration needs (e.g., backend APIs, third-party services).
> 5. **Describe the wireframes and connect them to functionality**
>    - Reference specific wireframe images/screens.
>    - For each screen, describe:
>      - Layout and UI components
>      - User interactions
>      - Navigation flow and how it supports the user stories
>    - Link wireframes to corresponding features and user flows.
> 6. **Add any additional considerations**
>    - Mention environment assumptions, testing needs, accessibility guidelines, or deployment requirements.

### Quick Fit Example

> 📖 **Output**
>
> ---
>
> [QuickFit Web Application Development Prompt](https://app.notion.com/p/349b19fdbedb81858c44e150735e2196)

## Step 2 - Create a Web Application

> 🚫 You only need to do this step if you have not performed this step as part of the [Spark AI tool chain](/207b19fdbedb80628028e164e474ada6?pvs=25#207b19fdbedb819fa3a3c27b663d6157)

### Description

In this step, we will define a structured prompt that guides an AI code generator to create a web application. This prompt should include the application's functional and non-functional requirements, a comprehensive feature list, user stories, and detailed descriptions of wireframes. The goal is to ensure the AI can generate a well-structured, user-centric, and brand-aligned web application.

### Tools

- Lovable

### Inputs to Lovable

- [Prompt obtained from step 1](/207b19fdbedb80e8b730ca1de865e6e0?pvs=25)
- [Wireframes obtained from the design tool chain](/1a5b19fdbedb803ab920cc7ddb023a49?pvs=25)
- [Logo PNG/JPEG obtained from design tool chain](/1a5b19fdbedb803ab920cc7ddb023a49?pvs=25)

### Quick Fit Example

![image (1)](attachment:c68d976e-0c5b-4185-9083-a101c3864633:image_(1).png)

[https://quickfit-zenith-showcase.lovable.app/](https://quickfit-zenith-showcase.lovable.app/)

## Step 3 - Create and integrate a database (Supabase) into the Web App

> 🚫 You only need to do this step if you have not performed this step as part of the [Spark AI tool chain](/207b19fdbedb80628028e164e474ada6?pvs=25#207b19fdbedb81288486fa9c725a5a47)

### Description

In this step, we will set up **Supabase** as the backend service for the web app, allowing data storage, authentication, and real-time features.

### Tools

- Supabase
- Lovable

### Input to Lovable

1. **Authorize Lovable to Access Supabase**
   - Click on the **Supabase icon** located at the top right corner of the Lovable dashboard.
   - Grant the necessary permissions to allow Lovable to integrate with your Supabase account.
2. **Select the Supabase Project**
   - Choose the Supabase project that will serve as the backend for your marketing website.
   - Confirm the selection to establish the connection between Lovable and Supabase.

### Prompt

> 📖 **Prompt**
>
> ---
>
> Create a comprehensive Supabase integration for the marketing website that includes:
>
> 1. Database Setup:
>    - Create essential tables
>    - Implement appropriate relationships and constraints between tables

### Quick Fit Example

[https://quickfit-zenith-showcase.lovable.app/](https://quickfit-zenith-showcase.lovable.app/)

## Step 4 - Add Features from the feature catalog to the application

| Sno | Feature Name | |
| --- | --- | --- |
| 1 | Header | [Header](https://app.notion.com/p/207b19fdbedb8118a49bc690e133321f) |
| 2 | Footer | [Footer](https://app.notion.com/p/207b19fdbedb81dea0c7c04f4dbb3cdd) |
| 3 | Signup | [Signup](https://app.notion.com/p/207b19fdbedb81259c18f8c5051082ba) |
| 4 | Login | [Login](https://app.notion.com/p/207b19fdbedb8102aee0e4d022b27607) |
| 5 | Account Verification | [Account Verification](https://app.notion.com/p/207b19fdbedb810ba02bd835ba504037) |
| 6 | Magic Link | [Magic Link](https://app.notion.com/p/207b19fdbedb8142979afab73fe4a120) |
| 7 | Forgot Password | [Forgot Password](https://app.notion.com/p/207b19fdbedb8190b4b7f7d8a333b0a8) |
| 8 | Profile Management | [Profile Management](https://app.notion.com/p/207b19fdbedb816da93bf53d144ba7c5) |
| 9 | Social Login | [Social Login](https://app.notion.com/p/207b19fdbedb81b9a14ad269d5618764) |
| 10 | Referral Invite | [Referral Invite](https://app.notion.com/p/207b19fdbedb8124af33e922a91b6484) |
| 11 | Role based access | [Role based access](https://app.notion.com/p/207b19fdbedb81ac9d0dd78495fefbd0) |
| 12 | Menu Navigation - Hamburger style | [Menu Navigation](https://app.notion.com/p/207b19fdbedb819584d5e335b2b6f24f) |
| 13 | Pagination of Data | [Pagination of Data](https://app.notion.com/p/207b19fdbedb8158a84de072007045dd) |
| 14 | Filtering Data | [Filtering Data](https://app.notion.com/p/207b19fdbedb81b58a0de47553e631b7) |
| 15 | Sorting Data based on values | [Sorting Data](https://app.notion.com/p/207b19fdbedb81ac8dfaea6c45349690) |
| 16 | Searching Data | [Searching Data](https://app.notion.com/p/207b19fdbedb81c6bd95e71d07d77d00) |
| 17 | Product Analytics | [Product Analytics](https://app.notion.com/p/207b19fdbedb81e2af91f1afaff473a6) |
| 18 | Payment Gateway Integration | [Payment Gateway Integration](https://app.notion.com/p/207b19fdbedb812186bce707554c9a8e) |
| 19 | Scheduling Events | [Scheduling Events](https://app.notion.com/p/207b19fdbedb81ecb15de75492f92f95) |

Implementation pages (v1):

- [Header Implementation (1)](https://app.notion.com/p/349b19fdbedb803f90d7c7b79d933e50)
- [Footer Implementation (1)](https://app.notion.com/p/349b19fdbedb8013bef6c5c5b4ba8a3b)
- [Signup Implementation (1)](https://app.notion.com/p/349b19fdbedb80578c8bca67e16d8b61)
- [Login Implementation (1)](https://app.notion.com/p/349b19fdbedb808bb8d9c811f89f1321)
- [Account Verification Implementation (1)](https://app.notion.com/p/349b19fdbedb800586f4f0b73baf2220)
- [Magic Link Implementation (1)](https://app.notion.com/p/349b19fdbedb808ba7d6fc2d07c8788c)
- [Pagination of Data Implementation (1)](https://app.notion.com/p/349b19fdbedb805d928ece2a8c536a30)
- [Forgot Password Implementation (1)](https://app.notion.com/p/349b19fdbedb80eb859dd8eac5f4f1f1)
- [Menu Navigation Implementation (1)](https://app.notion.com/p/349b19fdbedb8088a5d6d55cc1b22503)
- [Product Analytics Implementation (1)](https://app.notion.com/p/349b19fdbedb805cb5ebf769b922c2b5)
- [Profile Management Implementation (1)](https://app.notion.com/p/349b19fdbedb80adb358d42ad879ebd4)
- [Payment Gateway Implementation (1)](https://app.notion.com/p/349b19fdbedb80e09d5ac6394e13a67e)
- [Data Filtering Implementation (1)](https://app.notion.com/p/349b19fdbedb80c69736e9f2107e4169)
- [Data Sorting Implementation (1)](https://app.notion.com/p/349b19fdbedb8074a1c7fae2c0684e27)
- [Data Searching Implementation (1)](https://app.notion.com/p/349b19fdbedb806f9a85cad4b086f408)
- [Scheduling Implementation (1)](https://app.notion.com/p/349b19fdbedb8089a1afd10e6299022a)
- [Social Login Implementation (1)](https://app.notion.com/p/349b19fdbedb80bcb5b1ed9074c9050c)
- [Referral Invite Implementation (1)](https://app.notion.com/p/349b19fdbedb8094b6b9d9c8c0dfcda1)
- [Role-Based Access Implementation (1)](https://app.notion.com/p/349b19fdbedb809793cfe6a7303a265a)

## Step 5 - Modify the web application and fix errors

### Description

In this step, we will evaluate the app created by Lovable and identify issues and improvements that needs to be made and provide as a list of things to update in this site. If an issue cannot be resolved, then revert back to the previous version.

### Tools

- Lovable

### Inputs to Lovable

- Prompts to improve the application behavior or fix issues.

### Example Prompts

- Update the behavior of showcasing the sign-in page as a modal rather than a separate page.
- Fix the issue in the sign-up modal; it has two close buttons.
- Update the hero image with the attached image and add animations to the image on hovering it.

---

© 2025 IntuitioLabs LLC. All Rights Reserved. Confidential content protected under NDA. Unauthorized distribution prohibited.
