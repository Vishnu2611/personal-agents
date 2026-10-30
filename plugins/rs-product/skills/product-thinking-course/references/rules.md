**CONFIDENTIAL — RightShift. Internal use only. Do not distribute outside IntuitioLabs.**

# RightShift Product Rules

Extracted from client calls and design reviews. Rule first, then the call it came from.

**Seven transcripts read, ten to go.** Internal delivery and tracking practice is deliberately out of scope here — this doc covers product decisions and client engagement only.

Coverage log at the bottom.

---

## 1. Deciding what to build

**Say the rule in plain words before anyone opens a design tool.**
A Compass permissions argument ended once the rule was stated in three sentences. The screen followed in two minutes.

**When the team's memory of the client's answer drifts, go back to the record.**
Two people had different versions of what the client said about access. The fix was restating his three rules, not voting on who remembered better.

**Build to find the bottleneck. Don't predict it.**
The bet on Mocha was that job postings would be the busy feature. It might be the networking side. You learn that from usage.

**Find the leak and put a number on it.**
30–35,000 parents visited Camply in one season with no email capture. That number set the roadmap, not a feature list.

**Anchor the deadline to the client's business calendar.**
Camply's parent experience must ship by November. January is peak camp registration — miss it and the release is worth little until next year.

**Keep the recommendation layer separate from the permission layer.**
Everyone on Compass sees the knowledge library; Risk Map recommends what to do first. Merge the two and nobody can explain the model later.

**Put a feature's logic where the feature lives.**
Rubric mapping was proposed as a field on document upload. It belongs in Risk Map, which consumes it.

**Don't build the app because everyone has an app.**
The client's own line: it has to make sense, and maintenance costs. His breakthrough was a QR code on a name badge opening a mobile claim form — thirty minutes, no app.

---

## 2. Scope and trade-offs

**Do the expensive part by hand until volume justifies building it.**
Mocha's employer portal became a concierge inbox — employers email postings, the team uploads them. ~$12K saved.

**Absorb the genuinely small ask without repricing.**
The Mocha Academy page was a form linking to a partner. It went in at no change.

**Raise the change order rather than absorb real scope quietly.**
The Compass report engine wasn't in the PRD and the claim portal needs it. Specced, costed, sent. The client said go ahead.

**Cut to MVP at implementation, not at design.**
The Compass session timeout screen stayed in Figma and came out of the build.

**State exclusions in writing before the client assumes otherwise.**
Camply Option 1 named it outright: no security audit, no pen testing, no OWASP.

**State the trade-off with the number attached.**
Web app: ~30% more signups, no in-app push. Native: push works, download friction. Give both sides figures.

**Separate the function from the channel.**
"Notifications" is the function. Email, SMS and in-app are channels. Clients merge them and compare the wrong things.

**Commit to what you control.**
Eight weeks to App Store submission, not to being live.

**Defer the decision that depends on information nobody has yet.**
Mocha's maintenance plan gets revisited four weeks in, once go-to-market is clearer.

**Sequence by dependency and effort, not desire.**
Camply's parent experience needs the security work done first.

---

## 3. Platform and architecture

**Present two costed options, then give your recommendation and label it as yours.**
Camply got Option 1 (stay put, ~5 weeks) and Option 2 (rebuild, ~7 weeks, twice the money). The recommendation came after.

**Recommend against the bigger sale when the client isn't ready.**
Camply is at ~$15K ARR and seasonal. The recommendation was the cheaper half of the work.

**Tie the rebuild trigger to a business number.**
Revisit at ~$100K ARR with a stable revenue model. That gives the founder a condition to watch instead of an argument to keep having.

**Document the path you're not taking.**
The rebuild plan answers the investor question — here's the path, here's the cost — without spending the money.

**Migration gets more expensive the longer it waits.**
Any platform move forces users to re-sign, and re-signing causes dropout.

**Judge a platform by the team it lets you run.**
Camply's stack takes two developers; three checking in breaks the flow. That's why the rebuild doubles cost but adds only two weeks.

**Name the maintenance a platform creates.**
Row-level security policies there are maintained by hand — add a table, forget the policy, open a hole. Around 80% of reported problems are missing policies, not bad code.

**A missing CMS layer is a ten-year cost decision.**
Recognition Media has to pay a developer and run a deploy to fix a typo or change a font. Every deploy on that stack introduces new bugs.

**Separate readiness from compliance. Claim readiness only.**
HIPAA readiness is a stack property: encryption at rest, a BAA. Compliance covers operational procedure, which isn't yours.

**When the legal question is unresolved, say so and split the homework.**
Nobody knew whether HIPAA applied to Camply's allergy and insurance fields. Both sides took it as an action item, and the answer changes the recommendation.

**Keep the auxiliary tool out of the production product.**
Camply's data assistant produces a CSV. Define the interface and ingest it; don't give it release rigour.

**Hand over the infrastructure.**
Client's own cloud account, you admin during the build, remove yourself at the end. The alternative strands them.

**Match the contract model to the client's calendar.**
Fixed bid where scope is set and they want a team. T&M — one developer, client runs the queue — where the founder can manage it and wants lower burn.

---

## 4. Roles, permissions, data ownership

**State the relationship rule absolutely when the client can.**
One client, one agency in Compass. No exceptions. That sentence removed an entire many-to-many model.

**Use the client's word for the role and model the org they have.**
"Supervisor" became "manager." Module access toggles per manager — a plant manager shouldn't see claim files.

**Build placeholders for roles that have no function yet.**
Compass has supervisor and employee roles with nothing behind them, so the model survives the learning system arriving.

**Stack roles in layers even when two look identical in the business.**
A producer and a client service manager differ only in assignment today. Layered architecture means the next difference doesn't force a rebuild.

**A report can remove the need for a role.**
The client wanted C-level visibility. A monthly report killed a login, a permission set and a screen. His words: a report is as good as a role.

**Phase the mechanism, not the outcome.**
Compass reports start as a script plus a hand-made PDF. The client gets the report on day one; the engine gets built when funded.

**Source content is immutable.**
Clients edit a copy into their own repository; it never writes back to the master library. The client learned this on an earlier system — 500 companies editing shared content produced thousands of versions.

**Configure at the platform level, not per item.**
Logo placement is set once by file type and applied at print time using the logo each agency uploaded. The client leaves every document blank instead of tagging hundreds.

**Leave identity out where the data is better without it.**
Employee perception surveys run anonymously off a QR code. Tagging responses changes the answers.

**Don't require a login from users with no email address.**
Most employees at these companies don't have work email — the identifier every learning system assumes.

**Hold sensitive data out on purpose.**
Compass carries no SSNs and no birthdates. What sensitivity exists arrives as attachments, redacted by the carrier.

**Expect to supply the architecture document for the client's compliance.**
Compass needs cyber insurance before launch. The application asks how data is stored, where, how redundant. That answer comes from you.

**Every addition brings complexity.**
The client's rule, worth borrowing: it has to kill three birds, and if it only kills one, it had better be an important bird.

---

## 5. Structure and naming

**One word per concept, everywhere.**
Compass called the same object a document, content, an asset, a lesson and a course. It became "document."

**Name things the way the user describes them, not the way the system stores them.**
"Manage Access" became "Manage Visibility." Access reads as read/write/delete to anyone technical.

**Test the word against the specific non-technical person who'll use it.**

**Design the menu for the product you'll have in a year.**
Home, features, administration. Claims is one screen today with somewhere to grow.

**Order fields by what the user can change: informational, editable, locked.**
Compass had a locked email field mid-form with a line explaining the lock. Reordering removed the need for it.

**Hide the row, not just the value.**
"Your Producer" doesn't apply to an agency admin. Nobody should see a labelled blank.

**The same component looks the same on every screen.**
Compass's multi-select view rendered cards differently from the main list.

**Decide search scope before writing search rules.**
Global or section-scoped. That choice determines half the rules underneath.

---

## 6. Flow and states

**No step ends without closure.**
Setting a password and landing on an empty dashboard leaves the user asking what happened. A welcome screen goes between.

**Design the empty state, not only the full one.**
A new Compass user's first view is a dashboard of zeros.

**Check the design against real data before approving it.**
Document cards previewing page one looked good in Figma. In production, most first pages are title pages and every card looks the same.

**Prefer the informational element over the decorative one.**
A file-type icon or read-time estimate earns its space; a thumbnail carrying no information doesn't.

---

## 7. Copy

**Warm the screens where the user arrives.**
"Check your details" reads as abrupt — the user clicked a button and rarely read the email. Greet by name, say who invited them.

**One support address, not a scatter of "contact your administrator."**
You also find out what's actually going wrong.

**Say what an input field means, show an example, state what happens.**
Left to interpretation, users invent a model of how search works and it won't match yours.

---

## 8. Handoff to engineering

**Placeholder copy ships.**
An engineer picks text off the screen and it turns up at the sprint demo. Fix it in the design the moment you see it.

**Apply a correction to every screen it touches.**

**Don't invent a pattern you've already solved.**
Check how the last product did it first.

**Keep standing validation rules outside the design document.**
Name length, email format, phone format, password length. Write once, reuse. Per-screen restatement guarantees divergence.

---

## 9. Working with the client

**Never ask for something today that takes a week.**
Say in writing what you need, why you need it, and when you need it by — far enough ahead of the work. Do that and you can defend everything.

**Acknowledge a miss. Don't argue it.**
The instinct on TuneCore was to explain why the client should have provided the credentials anyway. Arguing a miss breaks good faith. Say sorry, say what changes, move on.

**Push back with facts and acknowledge in the same message.**
One response can do both — the timeline pushback was factual and dated, the credentials point was a straight apology.

**Don't give a date that carries no consequence.**
Miss a date, nothing happens, and the client learns your dates are decorative. If a slip has an impact, say what it is.

**Then offer flexibility on their date and ask them to name one.**
"We put the 20th to keep the plan on track. Tell us what works and we'll update the plan."

**Get the specific impact before you answer them.**
Two weeks late — does UAT go from two weeks to two days, or to one week? Take the number off the plan rather than inventing it live.

**Translate the client's phrasing into the actual ask.**
"App registration" sounded like submitting something to Apple. The ask was three logins for tools already in their stack. Say it the short way.

**Never use another client's accounts for client-facing work.**
The team was about to run TestFlight builds on a different client's developer account. Get your own; the implications are serious.

**Do the homework between calls and bring it built.**
Camply sent a PRD; the next call opened with two costed options. Mocha asked for a portal removed; the next call opened with revised scope, price and a mobile comparison.

**Say what you don't know.**
On HIPAA: counsel hadn't answered, nobody knew, here's what it changes. That reads as competence.

## 10. Taking over someone else's platform

**Ask for the ticket export before proposing.**
Sixty days of tickets tells you the skill level and the real mix of work. Proposing without it is shooting in the dark.

**Read the client's cost structure, not just their complaint.**
Recognition Media's problem isn't the 100-hour SLA. It's that QA and project management crept from 20% of those hours to 50%, so they're paying for overhead.

**The gap between what their AI says and what their vendor quotes is the opening.**
The client's own analysis said five hours; the vendor said a hundred. He isn't sure who's right, and that's exactly why he's looking.

**Match your development cadence to their business cadence.**
The outgoing partner serves HIPAA healthcare clients who plan months out. A media company needs things in a week. Same skills, wrong rhythm, relationship over.

**Price maintenance on four dimensions, not one.**
Skill mix, monthly hours, coverage window, and spike months. Recognition Media needs .NET, Angular, DevOps and QA inside 100 hours, with a jump to ~120 twice a year on a calendar they know a year ahead.

**Tier the coverage to hold the cost down.**
L1 monitoring 24/7, L2 engineering on overlapping hours. That's how TuneCore is run.

**Proactive recommendations are the thing clients miss most.**
Reactive bug fixing is table stakes. Recognition Media's complaint, repeatedly: nobody tells them what to fix, so they have to work it out themselves and hand it over as a story.

**Say who is doing what.**
The client can't tell how their hours are spent or how many engineers touch their system. That opacity is half the reason they're leaving.

**Plan the handoff for the bad case and find the person who actually knows the system.**
The one engineer who understood the platform was let go and now lives in another country. Reaching him is a plan; assuming the documentation is enough is not.

**Say plainly when near-term work doesn't guarantee the big one.**
The client said it first — the rebuild goes to a formal RFP regardless. Match that directness.

---

## Coverage log

**Read:** Compass Design Review (Sep 2) · Camply Option 1 vs 2 (Sep 9) · Compass Roles, Reports & Claims (Aug 19) · TuneCore Client Response & PM Review (Aug 18) · Mocha Scope Review (Aug 4) · Recognition Media Discovery (Jul 14) · Compass budget/variance (within Sep 2)

**To read:** Compass Knowledge Library & Risk Map (Sep 1) · Compass PRD Review (Aug 18) · Compass Product Development w/ Steve (Aug 11) · StageWing Technical Review (Aug 11) · Compass Requirements & Onboarding (Aug 4) · Product Working Session: PRD Review (Aug 4) · Compass Dashboard & Screen Inventory (Jul 30) · Mocha MVP Scope & Pricing (Jul 28) · Mocha Pre-Launch Strategy (Jul 13) · Design Team Sync (Jul 8) · plus meetings older than the 50 most recent

---

**CONFIDENTIAL — RightShift. Internal use only.**
