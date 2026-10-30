---
name: RightShift Spark
notion_page_id: 349b19fdbedb8081813ece56d004c5d1
notion_url: https://app.notion.com/349b19fdbedb8081813ece56d004c5d1
version: 1
status: Done
pulled_on: 2026-06-29
---

# ✨ RightShift Spark

> 🔥 Build your Product Launch Page with tools that bring your product vision to life. Create a compelling first version of your product's online presence, designed to attract users, validate your concept, and set the stage for growth.

## What Will You Get

By following this guide, you'll establish:

### Professional Marketing Presence

- Fully functional, responsive website with professional branding
- Key pages (Home, About, Pricing, Testimonials) that convert visitors

### Investor-Ready Analytics

- Real-time user behavior dashboard showing engagement metrics
- Data-driven evidence of market validation to present in pitches

### Lead Generation & Customer Acquisition

- Working waiting list to capture and measure user interest
- Concrete traction data and CAC (Customer Acquisition Cost) metrics investors look for

### Growth-Ready Infrastructure

- Scalable backend database and automated email systems
- Professional deployment with custom domain

### Technical Legitimacy Without Technical Skills

- Modern tech stack demonstrating technical competence
- Ability to make updates without development knowledge
- Cost-effective solution showing capital efficiency

> 🔥 This isn't just a website - it's a marketing infrastructure that validates your concept and positions you for investment.

## Definition of a Product Launch site

- **Purpose**: Educate visitors about your brand, products, and services ( [Design Tool Chain page](https://app.notion.com/p/207b19fdbedb801f808cf939f1cc93e3) outlines how to generate your brand guideline)
- **Scope**: Multiple pages with clear navigation structure
- **Content**: Company information, product details, pricing, testimonials, blog, contact info
- **Design**: Brand-focused with multiple paths for different user intents
- **Example use**: Main company website showcasing full product/service offerings

## Pre-Requisite

- Follow all the steps outlined in [Design Tool Chain page](https://app.notion.com/p/207b19fdbedb801f808cf939f1cc93e3)
- Register a domain at [GoDaddy](https://www.godaddy.com)
- [Claude](http://claude.ai) *Pro Plan - 20$ / month*
- [Lovable](https://lovable.dev/) - *Starter plan 20$ / month*
- [Supabase](https://supabase.com/) - *Pro plan - 25$ / month*
- [SendGrid](https://sendgrid.com/) - Free Plan (100 emails per day)
- [Clarity](https://clarity.microsoft.com/) - *Free plan*
- [GitHub](https://github.com/) - *Free plan*
- [Vercel](https://vercel.com/) - *Free plan*

## The How to Guide

> 🔥 This guide will help you build and launch a digital Testable Product.

### Step 1 - Create a prompt for generating a Testable Product site

#### Description

In this step, we will define a structured prompt that guides an AI code generator to create a digital Testable Product website. This prompt should include the website's functional and non-functional requirements and detailed descriptions of wireframes. The goal is to ensure the AI can generate a well-structured, brand-aligned marketing site.

#### Tools

Claude

#### Prompt

> 🔥 Please make sure you copy the above prompt and execute it in the SAME prompt window of Claude you used as part of the design tool chain steps. Context is crucial for AI models. Not doing this will create sub-optimal results.

> 📖 **Prompt**
>
> ---
>
> Create a comprehensive prompt for an AI Chatbot (code generator) to create a marketing website. This prompt should encapsulate the marketing site requirements, specify the tech stack, and explain the wireframes. Follow these instructions carefully:
>
> 1. Summarize the marketing site requirements in detail. Include all functional and non-functional requirements, user stories, and any specific features mentioned in the requirements.
> 2. Specify that the marketing site should be built using React for the frontend. Emphasize the need for implementing a global state management solution (such as Redux, MobX, or React Context API).
> 3. Articulate the wireframes as references to images in your prompt. Describe each screen, its components, and how they relate to the marketing site's functionality. Reference specific parts of the wireframes when explaining features or user interactions.
> 4. Structure your prompt in the following order:
>    a. Brief introduction to the project
>    b. Detailed summary of marketing site requirements
>    c. Tech stack specification (React + global state management)
>    d. Comprehensive explanation of wireframes and their relation to functionality
>    e. Any additional considerations or constraints
> 5. Use clear, concise language throughout your prompt. Avoid ambiguity and provide specific details where possible.
>
> Remember, your goal is to create a prompt that will enable an AI code generator to understand and implement the marketing site as accurately and comprehensively as possible.

#### Quick Fit Example

> 📖 **Output**
>
> ---
>
> [QuickFit Marketing Website Development Prompt](https://app.notion.com/p/349b19fdbedb81daba8ce03261182bb5)

---

### Step 2 - Create Testable Product Site

#### Description

In this step we will create the actual digital Testable Product website using artifacts we created in prior steps.

#### Tools

Lovable

#### Inputs to Lovable

- [Prompt obtained from step 1](/207b19fdbedb80628028e164e474ada6?pvs=25)

  > 🔥 The prompt above takes the font and colors you have defined in the design tool chain steps already into account

- [Wireframes obtained from design tool chain](/207b19fdbedb801f808cf939f1cc93e3?pvs=25)
- [Logo png/jpeg obtained from design tool chain](/207b19fdbedb801f808cf939f1cc93e3?pvs=25)

#### Quick Fit Example

![image (1)](attachment:c68d976e-0c5b-4185-9083-a101c3864633:image_(1).png)

[https://quickfit-zenith-showcase.lovable.app/](https://quickfit-zenith-showcase.lovable.app/)

---

### Step 3 - Create and integrate a database (Supabase) for your Testable Product site

#### Description

In this step, we will set up **Supabase** as the backend service for the marketing site, allowing data storage, authentication, and real-time features.

#### Tools

Continue using Lovable from step 2
Supabase

#### Input to Lovabale

1. **Authorize Lovable to Access Supabase**
   - Click on the **Supabase icon** located at the top right corner of the Lovable dashboard.
   - Grant the necessary permissions to allow Lovable to integrate with your Supabase account.
2. **Select the Supabase Project**
   - Choose the Supabase project that will serve as the backend for your marketing website.
   - Confirm the selection to establish the connection between Lovable and Supabase.

#### Prompt

> 📖 **Prompt**
>
> ---
>
> Create a comprehensive Supabase integration for the marketing website that includes:
>
> 1. Database Setup:
>    - Create essential tables
>    - Implement appropriate relationships and constraints between tables

#### Quick Fit Example

[https://quickfit-zenith-showcase.lovable.app/](https://quickfit-zenith-showcase.lovable.app/)

---

### Step 4 - Modify Product App and fix errors

#### Description

In this step, we will evaluate the app created by Lovable and identify issues and improvements that needs to be made and provide as a list of things to update in this site. If an issue cannot be resolved, then revert back to the previous version.

#### Tools

Lovable

#### Inputs to Lovable

- Prompts to improve the application behavior or fix issues.

#### Prompt

- Update the behavior of showcasing the sign-in page as a modal rather than a separate page.
- Fix the issue in the sign up modal; it has two close buttons.
- Update the hero image with the attached image and add animations to the image on hovering it.

#### Quick Fit Example

[https://quickfit-zenith-showcase.lovable.app/](https://quickfit-zenith-showcase.lovable.app/)

---

### Step 5 - Email integration to send out confirmation mails on joining waiting list

#### Description

In this step, we will set up email notifications using **SendGrid** for users who join the waiting list. Automate confirmation emails and track delivery logs.

#### Tools

Lovable
Supabase
Sendgrid

#### Inputs to Lovable

#### Step 5.1: Sign Up for Email provider (SendGrid)

1. Go to the SendGrid website ([https://sendgrid.com/](https://sendgrid.com/))
2. Click on "Start For Free" to create a new account
3. Complete the registration form with your details
4. Verify your email address by clicking the link sent to your inbox

#### Step 5.2: Verify with the email provider (Single Sender Verification)

> 🔥 The email you set up here will be the *from* email that people will receive communication from in the platform

1. Go to Settings > Sender Authentication > Single Sender Verification
2. Click "Create New Sender" and verify the email address by clicking the link sent to that address.
3. Fill in the required information:
   From Name: Your company/brand name
   From Email Address: The email address you want to send from
   Reply To: Usually the same as your From Email or a support email
   Company Address: Your physical business address
   City, State, Zip: Complete your location information
4. Click "Create" and verify the email address by clicking the link sent to that address

#### Step 5.3: Generate API Key

1. Navigate to Settings > API Keys
2. Click "Create API Key"
3. Name your API key (e.g., "Lovable Integration")
4. Select "Full Access" or customize permissions (at minimum, select "Mail Send")
5. Click "Create & View"
6. Copy and securely store your API key - you'll need this for the integration

#### Prompt

Use information from 5.1 to 5.3 steps as a Prompt for Lovable to integrate email provider

> 📖 **Prompt**
>
> ---
>
> Create a SendGrid email integration with Supabase using an Edge Function that:
>
> 1. Configures a service in Lovable that connects to our Supabase project
> 2. Sets up the necessary Edge Function for email delivery
> 3. Send email to specified receivers for the following events: (Add according to your use-case, example provided below)
>    1. Welcome email
>       1. Event: When user signup
>       2. Receivers: User, Admin [email]
>
> Requirements:
>
> - Include proper error handling and loading states
> - Log all email activities to a 'email_logs' table
> - Create proper templates with branding and colors for each emails
>
> The integration should be configurable with environment variables in Supabase for:
>
> - SENDGRID_API_KEY
> - SENDGRID_FROM_EMAIL

---

### Step 6 - Add analytics for tracking page and user activities in marketing website

#### Description

In this step, we will integrate **Microsoft Clarity** to track user interactions on the marketing site, such as page views and button clicks.

#### Tools

Lovable
Clarity

#### Inputs to Lovable

#### Step 6.1 : Sign Up for Microsoft Clarity

1. Go to the Microsoft Clarity website (https://clarity.microsoft.com/)
2. Click "Sign Up Free" or "Get Started" to create a new account
3. Sign in with your Microsoft account or create one if you don't have it
4. Accept the terms of service and privacy policy

#### Step 6.2 : Create a New Project

1. Once logged in, click "Create New Project"
2. Fill in the required information:
   - Project name: Your application/website name
   - Website URL: The primary URL of your website
   - Industry: Select the most appropriate option
3. Click "Create Project"

#### Step 6.3 :Get Your Clarity Project ID

1. After project creation, go to settings > Overview
2. Copy **Project ID for future use in Lovable**

#### Prompt

> 📖 **Prompt**
>
> ---
>
> Create a Microsoft Clarity integration to track the following events: (Add according to your use-case, examples provided below)
>
> 1. Page views
> 2. Get Started button
>
> Requirements:
>
> - Include proper error handling to prevent tracking failures
> - Send necessary event data corresponding to the events.
>
> The integration should be configurable with environment variables in Front-end for:
>
> - CLARITY_PROJECT_ID - [value]

#### Step 6.4: Test Analytics Integration

1. After Lovable sets up the integration, publish your application
2. Visit your application and perform some of the tracked actions
3. Wait 2-6 hours (Clarity typically has a data processing delay)
4. Log into your Clarity dashboard to verify data is being collected

---

### Step 7 - Deploy Product website to a custom domain

#### Description

In this step, we will deploy the website using **GitHub** for version control and **Vercel** for hosting. Configure a custom domain for public access.

#### Tools

Lovable
GitHub
Vercel

#### Step 7.1: Sign Up for GitHub

- Go to [GitHub](https://github.com/) and create an account if you don't already have one.

#### Step 7.2: Authorize Lovable to Access GitHub

- In Lovable, click the **GitHub icon** at the top left corner.
- Grant the necessary permissions to allow Lovable to push code to your GitHub repository.

#### Step 7.3: Sign Up for Vercel and Import the GitHub Project

- Visit [Vercel](https://vercel.com/) and sign up using your GitHub account.
- Click **"New Project"** and import the repository that Lovable created on GitHub.

#### Step 7.4: Deploy the Project on Vercel

- Follow Vercel's deployment steps (Vercel automatically detects most settings for React projects).
- Click **"Deploy"** and wait for the build process to complete.
- Once deployed, Vercel will provide a preview URL for the website.

#### Step 7.5: Add a Custom Domain

- Go to the **Domains** tab in your Vercel project settings.
- Click **"Add Domain"** and enter your custom domain (e.g., `yourwebsite.com`).

#### Step 7.6: Configure DNS Settings

- In your domain provider's dashboard, update the **CNAME record** to point to Vercel's assigned domain.

#### Step 7.7: Verify Deployment & SSL Setup

- Wait for DNS propagation (this may take some time).
- Vercel will automatically issue an **SSL certificate** for HTTPS support.
