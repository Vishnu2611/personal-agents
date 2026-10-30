---
name: RightShift Traction
notion_page_id: 349b19fdbedb801da461fca7efe9eccf
notion_url: https://app.notion.com/349b19fdbedb801da461fca7efe9eccf
version: 1
status: Done
pulled_on: 2026-06-29
---

# **Traction Validation and Early **Customer Acquisition

> 🔥 Validate traction and acquire early customers with data-driven strategies. Leverage tools to create product pages, test user acquisition strategies, and gather actionable feedback. Build momentum by demonstrating market demand and refining your product for success.

[Table of Contents]

---

# **Introduction**

### **Who Is This Guide For?**

This guide is for startup founders and business owners who are preparing to launch ad campaigns using Google Ads, Meta Ads, and AdRoll. Whether you're new to digital advertising or need a clear process to optimize your campaigns, this guide breaks everything down step-by-step.

### **How to Use This Guide**

The guide is structured to help you set up in a logical order, starting with ad platforms, moving into analytics tools, and culminating in campaign launches. Bookmark sections for quick reference and take your time implementing one step at a time.

---

## **Step 1 - Set Up Ad Platforms**

### Description

In this guide, we'll walk through the structured steps required to set up a Google Ads account and a Meta Ads account, covering everything from initial sign-in to billing configuration, so you can launch and manage ad campaigns with confidence.

### **1.1 Create Google Ads Account**

1. Visit Google Ads
	1. Go to [Google Ads](https://ads.google.com/) and click "Sign in".
2. Sign in with Google Account
	1. Use your existing Google account to sign in.
	2. If you don't have one, click "Create account" and follow the prompts to set one up.
3. Create Your First Campaign (Optional)
	1. You can choose to skip campaign creation for now as campaign creation, as it is covered in a later section.
4. Add business information: Enter business name (optional) and website URL
5. Link accounts, if any, in the next step
6. You can skip campaign creation in the next step by clicking 'Leave campaign creation'.
7. Confirm your account settings by adding billing country, time zone, and currency. 
8. Create new payments profile by providing Profile type, Organization name, Legal name, and Zip code.
9. The advertiser verification process in the next step can be completed anytime within in a month after the account creation.  

### **1.2 Create Meta Ads Manager Account**

1. **Create a Facebook Profile**
	- Visit [facebook.com](https://facebook.com/) and register.
	- Confirm personal account creation through your email or phone number via the code sent by Facebook.
	- This personal profile will be the admin of your business assets — it won't be visible to customers unless you choose to associate it.
2. **Create a Company Page**
	- This is required before you can create an Ads Manager account on Meta.
	- Using your Facebook profile, click the Menu (grid icon) in the top right > Select Page
	- Create a page for your business.
	- Add business details like logo, website link, and contact information.
3. **Set Up Meta Ads Manager**
	- Navigate to Ads Manager from your Company Page.
	- Create a new ad account and configure time zone, currency, and roles.

---

## **Step 2 - Set Up Analytical Platforms**

### Description

In this step, we'll configure key analytical platforms - Google Analytics 4 (GA4), Google Tag Manager (GTM), and Meta Business Suite - to track user behavior, monitor ad performance, and centralize event data for informed marketing decisions.

### **2.1 Set Up Google Analytics 4 (GA4)**

1. Visit [Google Analytics](https://analytics.google.com/).
2. Sign in with your Google account. If you don't have a Google account, create one.
3. Click "Start measuring".
4. Name your account and choose the data sharing settings, hit Next.
5. Under **Property** creation, add all details and click **Next.**
6. Enter property details like website name, time zone, and industry type.
7. Enter your business details by adding Industry category and Business size
8. Choose the objective that best matches your business in the next step
9. Proceed to accept the Terms of Service Agreement
10. Once the property is created:
	1. You'll land on the Data Collection** **details screen
	2. Select Web, enter your website URL (e.g., https://example.com) and a Stream Name
	3. A prompt shows 'Set up a Google Tag', which can be closed
11. Copy the **Measurement ID** that is shown in the Web stream details screen, to track website activity. This ID will later be used to link the analytical platforms with the website. 

### **2.2 Set Up Google Tag Manager (GTM)**

1. Visit [Google Tag Manager](https://tagmanager.google.com/) and click on 'Create Account' button.
2. Fill out the details as shown below:
	1. **Account Name:** (e.g., Your Company)
	2. **Country:** United States (or your business country)
	3. **Container Name:** (e.g., example.com)
	4. Choose **Web** as the platform
3. Click **Create**
4. Proceed to accept the Terms of Service Agreement

### **2.3 Add GTM Code to Your Website**

After account creation, GTM will give you 2 snippets of code, as below:

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/4a5dcc3a-af66-48bd-b879-dbb6b9d0a96c/4db402d5-703d-4d01-bbdd-8dd8d10b1663/image.png)

1. To add GTM code to the website, go to Lovable.ai and feed in the below prompt along with the code snippet:

> 📖 **Prompt**
>
> ---
>
> To implement Google Tag Manager for a website. Add the provided \<script\> tag to the \<head\> section of the index.html file. 
>
> \<!-- Google Tag Manager --\>
> \<script\>(function(w,d,s,l,i)\{w\[l\]=w\[l\]\|\|\[\];w\[l\].push(\{'gtm.start':
> new Date().getTime(),event:'gtm.js'\});var f=d.getElementsByTagName(s)\[0\],
> j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
> '[https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)](https://www.googletagmanager.com/gtm.js?id=%27+i+dl;f.parentNode.insertBefore(j,f));
> \})(window,document,'script','dataLayer','GTM-PHRZPB3F');\</script\>
> \<!-- End Google Tag Manager --\>

1. To add the second GTM code to the website, go to Lovable.ai and feed in the below prompt along with the code snippet:

> 📖 **Prompt**
>
> ---
>
> Additionally, insert the \<noscript\> fallback tag immediately after the opening \<body\> tag and before the root \<div\> element.
>
> \<!-- Google Tag Manager (noscript) --\>
> \<noscript\>\<iframe src="[https://www.googletagmanager.com/ns.html?id=GTM-PHRZPB3F](https://www.googletagmanager.com/ns.html?id=GTM-PHRZPB3F)"
> height="0" width="0" style="display:none;visibility:hidden"\>\</iframe\>\</noscript\>
> \<!-- End Google Tag Manager (noscript) --\>

1. Install Tag assistant plugin to verify whether the code addition is complete.
2. Go to the Tag Assistant (by Google) Chrome Extension in the Chrome Web Store.
3. Click "Add to Chrome" and then "Add Extension."
4. Open Your Website in a New Tab
5. Visit the website where GTM was installed.
6. Enable and Use the Tag Assistant Plugin:
	1. Click the Tag Assistant icon in your browser toolbar.
	2. Click "Enable", then refresh the webpage.
7. Review the Results:
	- The plugin will list all Google tags found on the site.
	- Look for **Google Tag Manager** and ensure it appears **with a green icon** (or "working" status).
	- If it shows in yellow or red, it means the code might be incomplete or incorrectly placed.

### **2.4 Link Analytics Tools with Website**

1. Use GTM to link your GA4 Measurement ID for efficient tracking across all web pages.
2. In [GTM](http://tagmanager.com), go to Workspace.
3. Click Tags, Select New
4. Name the tag - 'GA4 - Page View'
5. Click Tag Configuration
6. Choose Google Analytics: GA4 Configuration
7. Paste your Measurement ID (from Step 2.1, #11)
8. Trigger: Choose **"All Pages"**
9. Name the tag (e.g., GA4 - All Pages) and click Save
10. Click **Submit → Publish** your container
11. Test the setup using the **Tag Assistant Plugin.**
12. Go to [https://analytics.google.com](https://analytics.google.com/)
13. Click **Reports → Real-Time**
14. Visit your website in a new tab, and you should see your visit appear live

### **2.5 Set Up Meta Business Suite Account**

### **2.5.1**: Set up a Business Portfolio in Meta Business Suite

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Click the Menu (grid icon) in the top left > Create Business Portfolio
3. Enter:
	1. Your Business portfolio name
	2. Your Contact info (Name (as account owner) and Business Email Address)
4. Click Create
5. Navigate to your new [Business Portfolio](https://business.facebook.com/latest/settings/) settings by clicking on the link.
	1. Add your Facebook Page ([created in the above step](/207b19fdbedb803a9d18d95d9723c8d5?pvs=25)) 
	2. Click Add an existing Page and key in the Facebook Page URL
		![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfwarcv-jYhPcqYoNGs2w2ndsim5SUBR5c-ostBQfE514yVuYLQJ_b9pfViosBfHgBvl1SyZAvAeSAMJKtlrB67vzk4T7D4oDr_eLLlpWR84AVrmTkAqnPOyaB130pgc5Aj4xloow?key=9MJ9XL_bQdzujNnLukOYKvH4)
	3. To assign team roles, under **People, **click +Invite people
		![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXe5uyIPxVXUN_Hk9Xoqv_vRLr6lidi43dVRr7kUh3-3K07V-XMS-EB4nU428R9THs99YUyvYpkTKCRQpEMqindLKviZJoJ6km2oS6icFVC6C9rCbOfcpkBHPQjEg8oOQJnRPEhnvw?key=9MJ9XL_bQdzujNnLukOYKvH4)

### **2.5.2**: Link Meta Ads Manager to Your Website

- To create or Get Access to Meta Pixel, go to: [Meta Events Manager](https://www.facebook.com/events_manager)
- Click "Connect Data Sources" → Click on Connect Data and choose "Web"
- Select "Meta Pixel"
- Name your pixel (e.g., *QuickFitPixel*)
- Enter your website URL
- Click Continue

The Pixel is the tracking code that helps Meta monitor traffic and actions on your website.

### **2.5.3 Install and Test Meta Tracking Pixel**

1. Generate a Meta Pixel in the [**Events Manager**](https://www.facebook.com/events_manager)[ ](https://www.facebook.com/events_manager)
2. Copy the pixel base code.

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/4a5dcc3a-af66-48bd-b879-dbb6b9d0a96c/ec79e780-d7f4-4d93-bacb-b764a48c554c/image.png)

1. To paste the base code at the bottom of the header section, just above the closing head (\</head\>) tag, on every page of your website, go to Lovable.ai and feed in the below prompt along with the code snippet:

> 📖 **Prompt**
>
> ---
>
> To implement Meta Pixel for a website. Add the provided \<script\> tag to the closing head (\</head\>) tag of the index.html file, on every page of the website. 
>
> \<!-- Facebook Pixel Code --\>
> \<script\>
> !function(f,b,e,v,n,t,s)
> \{if(f.fbq)return;n=f.fbq=function()\{n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)\};
> if(!f._fbq) f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
> n.queue=\[\];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)\[0\];
> s.parentNode.insertBefore(t,s)\}(window, document, 'script',
> '[https://connect.facebook.net/en_US/fbevents.js](https://connect.facebook.net/en_US/fbevents.js)');
> fbq('init', '2388714421198052');
> fbq('init', '459449588269303');
> \</script\>
> \<!-- End Facebook Pixel Code --\>

1. Use the Pixel Helper browser extension to verify the connection.

### **2.5.4 Set Up Events**

- In [Events Manager](https://www.facebook.com/events_manager), you can:
	- Track conversions (e.g., purchases, signups)
	- Use **Event Setup Tool** to tag buttons like "Add to Cart," "Subscribe," etc.
	- Click the **Data sources** icon in the left menu of the page.
	- Select the name and ID of your data.
	- Click the **Settings** tab at the top of the page.
	- Select **Open event setup tool** under **Event setup**.
	- Enter your URL and click **Open website**. The event setup tool will launch in your website browser.
	- Click **Review** by each suggested event and then select **Confirm** or **Dismiss**.
	- To add events that don't appear in your suggested list, navigate your website as usual to find the buttons or web pages that you want. Select **Track new button **or **Track a URL** and follow the onscreen instructions.
	- **IMPORTANT:** When you set up an event on a button, you're adding the event to all buttons with the same or similar text on your website.
	- Select an event.
	- Set up parameters for your event.
	- Click **Finish setup** in the event setup tool when you've finished.

---

## **Step 3 - Set Up AdRoll**

### Description

In this step, we'll set up an AdRoll account to enable cross-platform advertising and retargeting, configure conversion tracking, and connect it with analytics and ad channels like Google and Meta to run data-driven ad campaigns.

### Pre-Requisites

- Google Ads account
- Google Analytics account
- Meta Ads account

### **3.1 Create AdRoll Account**

1. Sign up on [AdRoll](https://www.adroll.com/) to create an account.
2. To install the AdRoll Pixel on your website, click Google Tag Manager. 

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/4a5dcc3a-af66-48bd-b879-dbb6b9d0a96c/cebd26d1-9cee-4d67-af1d-34bbd95fdebd/image.png)

1. Click **Connect**.

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/4a5dcc3a-af66-48bd-b879-dbb6b9d0a96c/1a1264a5-75bb-4423-9686-c70b829a86bc/image.png)

1. Select the *account* you want to connect to AdRoll.
2. Click **Allow.**
3. **Choose** your account and container.
4. Skip the next screen, by clicking Continue.
5. Click Publish. 
6. Verify your website connection to AdRoll (PixelPal)
	1. Install [PixelPal](https://chrome.google.com/webstore/detail/pixelpal-by-nextroll/fogcpfhkppaffphabnmapoopakjbfnbb?hl=en-US) in your Chrome browser by following the steps from the Chrome Web Store.
	2. Once installed, the extension's icon will be available next to your address bar.
7. Activate PixelPal by clicking the icon to review and confirm the End User License Agreement (EULA).

### **3.2 Connect All Ad Accounts to AdRoll**

1. Access the **Integrations** section on AdRoll's dashboard.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdfgRNIs7CMWxsGDoHoITd7sE0v-9ZW5qi6tm62vfjuLrVDxOrFKkAS3JQkknXePXUbVIyxpY8niiFZgnxvZhfx3k4adKRJki7Ias0c0JpszeDJ-DRPWMmJXAywR0x76Wxs4BAR7w?key=9MJ9XL_bQdzujNnLukOYKvH4)

1. Connect Google Ads and Meta Ads accounts for centralized campaign management.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXe0nuPw14WmtbRrLZ3VKBZEI0oUI4cfKJ-Z1g4Pzn7eJnM0pMnELHsRGwbelSWcQzAeblTb3-8CbaBqEjzmgiE4U4M-SoRml8OsD2CIqiMnEank-fx1GAhT-kXMQBBSmseA_dyxhA?key=9MJ9XL_bQdzujNnLukOYKvH4)

1. Once you connect successfully, your campaigns will be automatically added to the AdRoll platform where you will be able to view your connected social campaigns alongside your AdRoll campaigns.

---

## **Step 4 - Launch Ad Campaigns**

### Description

In this step, we'll create and launch ad campaigns in Google Ads and AdRoll, defining objectives, audience targeting, creatives, budgets, and performance goals to effectively reach and convert your ideal customers across multiple platforms.

### Pre-Requisites

- Google Ads account
- Meta Ads account

### **4.1 Launch Google Ads Display Campaign and Link to AdRoll**

1. Log into [Google Ads](https://ads.google.com/).
2. Create a new campaign by clicking the +icon 'Create Campaign', and select your goal (e.g., Leads, Sales, Website Traffic).

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf21Z8C0-Z7vefmhf5XPhvyXz4D2LlFLzMtrmM1o6zodZV-lKcKnjApecVciBd3BGPO7qIa0UVstSbExMzoLoADyfCfJ5l2UbOGij3-U5c8urFZSDmXnnXwYERc_YEmUTklnRiH5Q?key=9MJ9XL_bQdzujNnLukOYKvH4)

1. Define settings for:
	- Target audience demographics and interests
	- Budget strategy (e.g., Maximize Conversions)
2. Create Your Responsive Display Ads
	- Headlines (max 30 characters)
	- Descriptions (max 90 characters)
	- Final URL
	- Logos
	- CTA text
	- Upload multiple images and Google will mix/match combinations.
3. Click "Publish Campaign"

### **4.2 Launch Google Ads Search Campaign and Link to AdRoll**

1. Log into [Google Ads](https://ads.google.com/) and click on "+ New Campaign"
	1. On the dashboard, click the blue "+" button to start a new campaign.
2. Select a Campaign Objective. Choose your goal, such as Sales, Leads, Website traffic.
3. Then click **Continue.**
4. Choose "Search" as the Campaign Type. Select Search to create text ads shown on Google Search results pages.
5. Click on Websites visit as the way to reach your goal and enter your Business Website (You can provide your website URL if prompted.)
6. Name Your Campaign (Give your campaign a clear, descriptive name (e.g., "QuickFit Lead Gen Search").
7. Uncheck Display Network (To focus on search only, uncheck "Include Google Display Network.")
8. Set Target Locations
	1. Choose geographic locations where you want your ads to show (e.g., United States, specific cities).
9. Set Language Targeting (Usually "English" unless targeting other language speakers.)
10. Set Daily Budget and Bidding Strategy
	1. Enter your daily budget (e.g., $20/day)
	2. Choose a bidding strategy like 'Maximize Conversions' or 'Maximize Clicks'
11. Create Ad Groups
	1. Name your Ad Group - Make sure your ad group name reflects the keywords or products you're targeting to make it easy to manage and track later.
	2. Add a set of related keywords (use Google's keyword suggestions or add your own)
		1. How to Choose Keywords:
			1. Use [Google's Keyword Planner](https://business.google.com/in/ad-tools/keyword-planner/): Google's Keyword Planner tool helps you find keyword ideas based on your business and services. It provides keyword suggestions along with data on how often they are searched.
			2. Consider Your Own Keywords: Think about words your target audience would use when looking for your product or service. If you offer an **AI-powered fitness coach**, think about variations like "best AI fitness coach for beginners" or "personalized fitness AI trainer."
			3. Focus on Relevance: Group similar keywords together. For instance, for a product like **"fitness coaching"**, group keywords like "AI-powered fitness coach," "virtual fitness trainer," and "personalized AI coach" in one ad group.
				How to Use Google Keyword Planner
				1. **Log in to your Google Ads account**: If you don't have one, create a Google Ads account.
				2. **Navigate to the **[**Keyword Planner**](https://business.google.com/in/ad-tools/keyword-planner/):
					- Click on the **Tools & Settings** icon (wrench icon) at the top-right of the Google Ads dashboard.
					- Under the "Planning" section, select **Keyword Planner **or navigate to the page by clicking on the [**link**](https://business.google.com/in/ad-tools/keyword-planner/) and click on Visit Keyword Planner button.
				3. **Click on "Discover new keywords"**: This will allow you to find new keyword ideas based on your business, products, or services.
				4. **Enter Your Product/Service or Website**:
					- You can enter a few words related to your business (e.g., "AI-powered fitness coach") or provide your website's URL. Keyword Planner will generate keyword ideas based on this information.
					- **Optionally**: You can add competitor websites to discover related keywords.
				5. **Select Your Location**: Choose where you want your keywords to be targeted, such as a specific country, city, or global.
				6. **Choose Language**: Pick the language in which you want to target the keywords (e.g., English).
				7. **Choose Search Network**: Select whether you want to include Google Search or the Google Display Network (for broader targeting).
				8. **Keyword Ideas**: Google Keyword Planner will generate a list of keyword ideas related to your input. These will include search volume, competition, and top-of-page bid ranges.
				9. **Filters**: You can use the filters on the left-hand side to refine your keyword list:
					- **Search Volume**: Filter by range to see keywords with higher or lower search volume.
					- **Competition**: Choose from "Low," "Medium," or "High" competition.
					- **Top of Page Bid**: You can filter keywords based on the bid range for both high and low values.
				10. **Select Keywords**: Choose the keywords that best suit your campaign by checking the box next to each one.
				11. If you want to export your keyword list for later use or further analysis, click on the **Download icon** at the top-right corner.
				12. You can download the keyword data in **CSV** format.
		2. **Types of Keywords to Consider Based on Metrics:**
			1. Search Volume:
				1. High Search Volume Keywords: These are the terms that get searched most frequently. They can drive more traffic to your site but are typically more competitive (higher cost-per-click). Example: "**AI-powered fitness coach**" would likely have high search volume.
				2. Low Search Volume Keywords: These might have fewer people searching, but they're often less competitive, so your cost-per-click (CPC) might be lower. For example: "best **AI fitness coach for weight loss**" could have lower search volume but might be more specific and targeted.
			2. Competition:
				1. High Competition Keywords: These are terms where many advertisers are bidding for the same keywords, driving up cost-per-click (CPC). Example: "**personalized AI fitness coach**" could be highly competitive.
				2. Low Competition Keywords: These are easier to rank for and might be cheaper. For example: "best **affordable AI fitness coach**" might have lower competition, especially if it's a long-tail keyword.
			3. Top of Page Bid - High & Low Values:
				1. High Top of Page Bid: Keywords that require higher bids for your ad to appear at the top of search results. If the bid is high, it usually means that many competitors are bidding for this keyword. Example: "**AI fitness coach for runners**" might have a higher bid requirement.
				2. Low Top of Page Bid: Keywords that don't require as much of a bid to show up in top positions. These could be very specific phrases, like "**affordable AI fitness coach for beginners**," which might have less search volume but are more specific and less competitive.
12. Choose match types (Broad, Phrase, Exact) to control when your ads show. Broad match gives you more reach, phrase match adds some control, and exact match ensures precise targeting.
13. Create Ads (Responsive Search Ads)
	1. Add Final URL (landing page)
	2. Enter up to 15 headlines (max 30 characters each)
	3. Enter up to 4 descriptions (max 90 characters each)
	4. Google will mix and match to optimize performance
	5. Add Ad Extensions (Optional but Recommended)
	6. Sitelink Extensions (e.g., About, Contact, Pricing pages)
	7. Callouts, Call Extensions, Structured Snippets
14. Review and Launch after double-checking all settings and ad previews
15. Click **Publish **Campaign

### **4.3 Launch Meta Ads Campaign and Link to AdRoll**

1. Use Meta Ads Manager to create a new ad campaign.
2. Go to [Ads Manager](http://adsmanager.facebook.com)
3. Click Create
4. Choose a campaign objective (eg: Awareness, Traffic, Leads, etc)
5. Click Continue and enter a Campaign name
6. Provide a desired daily budget for the campaign in the next screen.
7. Click Next 
8. Enter an Adset name
9. Choose Conversion location as 'Website'
10. Click Dataset and select the pixel created in Step 3.5.2
11. Select Conversion event (eg: Purchase, Add to cart, etc)
12. If you do not find a desired conversion action, click on 'Set up a conversion'.
13. Click 'Track Conversions with Standard events', choose your Industry, and select a desired conversion action, click on Test events, and hit Done.
14. Add budget & schedule.
15. Under Audience Controls, edit locations, age, gender, etc
16. Click Next. Add an ad name
17. Select your Facebook page and Instagram account, if any
18. Click create Ad and select format and proceed to upload images or videos according to the ad format selection
19. Add Primary text, headline, description, and a CTA. The ad preview will appear on the right column of your screen. 
20. Provide landing page URL in the Destination field
21. Under Tracking, select Website events
22. Click Publish.

### **4.4 AdRoll-Specific Campaigns**

1. Login to [AdRoll](https://app.adroll.com/)
2. Go to Ads under Campaigns and click 'Create' and select Ad Campaign
3. Choose from targeting strategies like Contextual Targeting or Connected TV.
4. Select audience categories and upload creative assets.
5. Define a budget and bid strategy like Conversions or Click optimization.
6. Create an AdGroup by defining the Audience locations and further by adding categories and keywords to target.
7. To select your Ads, click:
	1. Choose, if ad images are already present in ad library
	2. Create, to create custom ads using the ad image customization tool
	3. Upload, if ad images are ready to be uploaded and used
	4. Request free ads, to send a requirement requesting for ad images to the AdRoll team ( the expected turnaround time is up to four days).
8. Choose Budget and hit Submit to run ads.

---

## **Step 5 - Create Ad Copy and Images**

### Description

In this step, we'll use AI-powered platforms such as Jasper for copywriting, Sora and AdCreative for visual assets, and Claude for ideation and refinement to generate compelling ad creatives that align with your brand and campaign goals.

### Pre-Requisites

- [Jasper.ai](https://jasper.ai/) - $49/month plan for freelancers and solopreneurs
- [AdCreative.ai](https://adcreative.ai/) - **$39**/monthly for Starters (10 image downloads a month)
- Sora - [https://openai.com/sora](https://openai.com/sora)
- [Claude](http://claude.ai) *Pro Plan - 20$ / month*
- ChatGPT Plus - [https://openai.com/](https://openai.com/sora) - $25/month Teams plan

### **5.1 Ad Copy Creation**

- Login to [Jasper.ai](http://Jasper.ai) 
- Navigate to 'Discover Apps' in [**Jasper.ai**](http://Jasper.ai).
- Under Social Media Marketing, click 'Social Media Ad' 
- Select preferred Brand Voice and provide URL or upload screenshots of product site
- Provide inputs like your product description, audience profile, and call-to-action (CTA).
- Click 'Generate Now'

### **5.2 Ad Image Design and Tools**

- Use [Claude.AI](http://Claude.AI) to generate prompt for AI image generation

	Example, as below:

> 📖 **Prompt**
>
> ---
>
> Design three SVG social media images for a product. The visuals should convey the brand's identity.
> Design Requirements:
> - Brand Name: Specify your brand
> - Industry Focus: Specify industry, e.g., fitness, finance, education
> - **Brand personality & associations:** List key associations, e.g., innovation, trust, energy, elegance
> - Tagline: Provide a tagline that captures the essence of the brand or campaign message.
> - Primary Color: Specify if any
> - Font: Specify if any
> - CTA Button: Specify if any, eg: Apply Now, Learn More
> - Background: Provide details of how the image background should look like 
> - Style: Bold, clean, futuristic; high contrast for legibility; vector-based for scalability across platforms
> Output Requirements:
> - Format: SVG (Scalable Vector Graphics)
> - Variations (separate files):
> - 1080 x 1080 px (Square – Instagram)
> - 1280 x 960 px (Landscape – Facebook/Twitter)
> - 960 x 1280 px (Portrait – Stories/Ads)
> - Additional: One combined SVG file showing all three layout variations side-by-side as a visual overview

### Quick Fit Example

> ✅ **Example**
>
> ---
>
> 📖 Prompt
>
> ---
>
> > ✅ Design three SVG social media image variations for **QuickFit**, a digital fitness product. The visuals should convey the brand's identity as an AI-powered fitness solution through clean, bold, and futuristic aesthetics.
> >
> > **Requirements:**
> > - Represent a **digital fitness product called QuickFit**, blending **sports, fitness, and AI technology**
> > - Visually express **Power, Energy, Health, Strength, and Technology**
> > - Maintain a **clean, bold, and futuristic** style
> > - **Tagline:** *Transform Your Body with Your Personal AI Fitness Coach*
> > - **Brand Color:** #9c4edc
> > - **Font:** Google Font *Poppins*
> > - **CTA:** *Contact Us* button
> > - **Background:** Modern, tech-inspired illustration featuring dynamic fitness silhouettes, neural network patterns, or gym-tech fusion
> > - **Output Format:** Vector-based SVG
> > - **Three Layouts:**
> > 	- 1080x1080 px (Instagram)
> > 	- 1280x960 px (Facebook/Twitter)
> > 	- 960x1280 px (Stories/Ads)
> > - Also generate a **combined SVG layout** showing all three formats side by side
> >
> > Designs must be **scalable**, **visually compelling**, and reflect **QuickFit** as a next-gen AI fitness solution.

- Generate reference images from ChatGPT Plus, Sora.ai or [Ideogram.ai](http://ideogram.ai/) using the same prompt generated through Claude.ai
- Go to [Adcreative.ai](http://adcreative.ai/) and feed ad copy generated using Jasper.ai
	- Create a 'Brand' by providing brand name, description, logo and brand colors
	- To create an ad creative, click create a 'Project' and select Ad Creatives
	- Select the desired social media poster dimensions from the list below, click Next.
	- Under 'Text on Image', feed in the copy generated using Jasper.ai
	- Under 'Choose Background Image', either make use of Adcreative iStock library or insert images generated as reference images from ChatGPT Plus, Sora.ai or [Ideogram.ai](http://ideogram.ai/).
	- Click 'Generate'.
	- Click the 'refresh' icon below the image, to generate the image in other dimensions.
	- Choose preferred images generated by the platform.
- Download the generated images and feed into AdRoll

**Pro Tip:** Always A/B test your copy and image variations to identify the best-performing creatives.

---

## **Resource Links**

To assist with your setup and campaigns, explore these tools and platforms:

- **Ad Campaign Creation**
	- [Google Ads](https://ads.google.com/)
	- [Meta Ads Manager](https://business.facebook.com/)
	- [AdRoll](https://www.adroll.com/)
- **Analytics Platforms**
	- [Google Analytics](https://analytics.google.com/)
	- [Google Tag Manager](https://tagmanager.google.com/)
	- [Meta Events Manager](https://business.facebook.com/events_manager)
- **AI-Powered Copy Creation**
	- [Jasper.ai](https://jasper.ai/)
	- [AdCreative.ai](https://adcreative.ai/)
- **AI-Powered Text to Image Creation**
	- Sora - [https://openai.com/sora](https://openai.com/sora)
	- ChatGPT Plus - [https://openai.com/](https://openai.com/sora)
	- AdCreative - [Adcreative.ai](http://adcreative.ai/)
	- Ideogram - [ideogram.ai](https://ideogram.ai/)
	- Midjourney - [https://www.midjourney.com](https://www.midjourney.com/)
- **Stock Images & Videos:**
	- Unsplash - [https://unsplash.com](https://unsplash.com/)
	- Freepik - [https://www.freepik.com](https://www.freepik.com/)
	- Pexels - [https://www.pexels.com](https://www.pexels.com/)
	- Lucide Icons - [https://lucide.dev/icons/](https://lucide.dev/icons/)
