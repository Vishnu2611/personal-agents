## 4. Day 1 — Client ask vs. business need (55 min)

### Concept (12 min)

A client tells you what to build. Your job is to find what has to become true for them. Those are different sentences and they rarely match.

Three layers:

1. **Output** — the thing you ship. "A loyalty app."
2. **Business outcome** — the money or risk that moves. "Maintenance refill retention goes up."
3. **User behaviour change** — what a person does differently. "A patient who gets a refill reminder picks it up within 7 days."

Layer 3 is the only one you can design for. Without it you have a request, not a product.

**Assumptions and facts.** A fact has a source you can point at: a number, a ticket, a recording, a named person who said it. Everything else is an assumption. Unlabelled assumptions are the problem, not assumptions. Test the ones that would sink the project first.

**Working Backwards.** Amazon writes the press release and FAQ before building. Used here as a forcing function — it makes you state the benefit before the feature.°

### Start here — the reading

Say this, as written:

> Before today you should have read Marty Cagan, *The Alternative to Roadmaps* — 10 minutes:
> **https://www.svpg.com/the-alternative-to-roadmaps/**
>
> If you haven't, read it now and come back. It's short, and everything below assumes it.
>
> If you have: what does Cagan say is wrong with grading yourself on how many roadmap items shipped?

Wait for the answer. A vague one means they skimmed — send them back to the link before going on.

Amazon's Working Backwards / PR-FAQ is described in the concept below. There's no free canonical source for it, so there's nothing to read.


### Build (35 min) — artifact: Outcome Brief

One page, four sections.

1. **Client's stated ask**, their words, one sentence.
2. **Business outcome** — one sentence, with the number it moves and where that number came from.
3. **User behaviour change** — one sentence. "Today [person] does X. After this, they do Y."
4. **Assumption ledger** — 10 rows, ranked by risk.

| # | Assumption | Fact or assumption? | Source if fact | If wrong, what breaks? |
|---|---|---|---|---|

Rule 1 applies.

### Rubric (100 pts)

| Criterion | Pts | Full marks |
|---|---|---|
| Behaviour change is specific and observable | 25 | Names a person, an action, a timeframe. "Engages more" scores 0 |
| Outcome traces to a number | 20 | Cites the 61% or the refill revenue line |
| Facts separated from assumptions | 20 | Nothing marked "fact" without a pointable source |
| Risk ranking is defensible | 15 | Top assumption would actually sink the project |
| Rule 1 held | 10 | Zero solution words |
| One page, no padding | 10 | No restating the brief back |

### Quiz — Day 1

**Easy 1.** Client: *"We need a dashboard for our ops team."* Which clarifying question gets you furthest?
- A) What charts do you want on it?
- B) What decision does the ops team make today that they make badly or late?
- C) Should it be real-time or daily?
- D) Who on the ops team is the primary user?

→ **B.** A and C are build details that only matter once the decision is known. D matters, but knowing who without knowing what decision still leaves you designing blind.

**Easy 2.** Client: *"Make it more engaging."*
- A) What does engaging mean to you?
- B) Should we add gamification?
- C) What would you see in your numbers next quarter if this worked?
- D) Do you have a design reference?

→ **C.** A invites another adjective. C forces a measurable outcome.

**Easy 3.** Client: *"Our competitor has this feature, we need it too."*
- A) Which competitor?
- B) When did you last see it?
- C) What do you think it's doing for them?
- D) Do you want it to look the same?

→ **C.** Moves from imitation to mechanism. A is answerable in two seconds and changes nothing.

**Medium 4.** Client: *"Users are complaining the checkout is confusing."* You have no analytics access.
- A) Can you send me the complaints?
- B) How many users have complained, out of how many checkouts?
- C) Which step do they mention most often?
- D) Do you want us to redesign checkout?

→ **A.** B and C are both good and both derivable from A. Ask for the source rather than the summary — you get B, C, and things you didn't know to ask.

**Medium 5.** Client on timeline: *"We need this before the holidays."*
- A) What's the hard date?
- B) What happens if it's two weeks late?
- C) Can we cut scope to make it?
- D) Is the date driven by a campaign, a contract, or a preference?

→ **D.** B tests severity and is close. D tests nature. A contractual date and a preference look the same until you ask, and they lead to different scope conversations.

**Medium 6.** A stakeholder answers your "why" with *"because that's what our customers are asking for."*
- A) How many customers?
- B) Where did you hear that — support, sales, or a survey?
- C) Can I see one of those requests in the customer's own words?
- D) What exactly did they ask for?

→ **C.** A and B narrow the source. C gets the artifact. Customers' own words usually describe a problem that the summarized "ask" has already converted into a solution.

**Hard 7.** *(Free text)* Dana says *"we're losing ground to CVS."* Write the two questions you'd ask next, in order, and one sentence on what a bad answer to the first would tell you.

*Rubric (10 pts):* Q1 targets what "losing ground" is measured by — scripts, customers, revenue (3). Q2 targets whether the loss is to CVS specifically or general (2). Sequencing logic stated (2). Identifies that a non-numeric answer to Q1 means the loss is a feeling rather than a finding (3).

**Hard 8.** *(Free text)* A client gives you a 12-item feature list and a fixed date. You may ask three questions before scoping. Write them, and say what you'd do if the client refused to answer any of them.

*Rubric (10 pts):* One question targets the outcome behind the list (3). One targets which items are load-bearing (2). One targets the date's nature (2). Fallback is concrete — scope against the assumption ledger and put the risk in writing (3).

---
---

## Rules to reveal (only after the artifact is graded)

From RightShift Product Rules, section 1. Show these after scoring Day 1's artifact, never before.

- Say the rule in plain words before anyone opens a design tool.
- When the team's memory of the client's answer drifts, go back to the record.
- Find the leak and put a number on it.
- Anchor the deadline to the client's business calendar.

Ask the lead which of these they arrived at on their own, and where they'd have scored higher if they had.


---

## Read before Day 2

Deliver this as the last thing in the session, before writing progress.md. Say it as written:

> **Read this before Day 2** — 20 minutes:
>
> Teresa Torres, *Opportunity Solution Trees*
> **https://www.producttalk.org/opportunity-solution-trees/**
>
> Tomorrow you interview the client. This is the framing you'll use to write up what she tells you.
