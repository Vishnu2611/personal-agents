## 6. Day 3 — Information architecture and flow (65 min)

### Concept (12 min)

**Information architecture** is how the parts are arranged so the whole makes sense. Not visual design — structure and naming. Anything a user can't find might as well not be there.✓

Two questions do most of the work:

- **What are the things?** The nouns. For MeridianRx: prescriptions, people, stores, insurance, doctors.
- **How does a user group them in their own head?** Not how the database groups them. A patient thinks "my mom's medicine," not "dependent record."

**Naming is product work.** "Manage" promises control. "Settings" promises configuration. Pick the word your user already uses. If you have to add a tooltip to explain a label, change the label.

**Flow** is the sequence over time. Three parts that get skipped:

1. The **happy path**, where everything works. Easy to draw, rarely what breaks.
2. The **unhappy paths** — insurance denies, doctor approval expired, store closed, price changed. Most of the value sits here.
3. The **entry points**. A flow doesn't start at your home screen. It starts with a text message, a phone call, or a person standing at a counter.

Rule for the day: every happy-path step gets at least one named failure.

### Start here — the reading

Say this, as written:

> Before today you should have read Abby Covert, *How to Make Sense of Any Mess*, chapters 1–3 — 30 minutes. Full text is free:
> **https://www.howtomakesenseofanymess.com/**
>
> If you haven't, read it now and come back.
>
> If you have: what does she mean by a "mess"?

Wait for the answer before going on.

Optional, if they want it: Jakob Nielsen's 10 usability heuristics, 15 minutes — **https://www.nngroup.com/articles/ten-usability-heuristics/**


### Build (45 min) — artifact: Flow + Structure Map

Solution words are now allowed. Screens are still not drawn.

1. **Noun list** — every thing the product knows about, in the user's word, not the system's.
2. **Structure map** — how those nouns group and nest, one line of defence each.
3. **End-to-end flow** for the target opportunity, starting from a real entry point.
4. **Failure table**:

| Step | Fails when | User should then… |
|---|---|---|

### Rubric (100 pts)

| Criterion | Pts | Full marks |
|---|---|---|
| Failure modes cover every step | 25 | No step without one; reauthorization case caught |
| Entry point is realistic | 15 | Starts outside the product |
| Nouns use the user's language | 15 | "My mom's prescriptions," not "dependent entity" |
| Groupings are defended | 15 | One line each, referencing a user's mental model |
| Flow complete end to end | 20 | A stranger could trace it without asking |
| No orphan states | 10 | Every branch terminates somewhere named |

### Quiz — Day 3

**Easy 1.** You're told to "organize the settings page."
- A) How many settings are there?
- B) Which settings do users change more than once?
- C) Should it be tabs or a list?
- D) Who designed the current one?

→ **B.** Frequency of use is the organizing principle. C is a layout decision made too early.

**Easy 2.** Before naming a top-level section:
- A) What does the team call it internally?
- B) What do users call it when they describe it out loud?
- C) What do competitors call it?
- D) What's shortest?

→ **B.** Internal vocabulary is the most common source of bad labels.

**Easy 3.** A flow diagram shows only the success path.
- A) Is this the final version?
- B) What happens at each step when it doesn't work?
- C) How long does this take?
- D) Is this mobile or desktop?

→ **B.**

**Medium 4.** The client's data model has "patients" and "dependents" as separate types. Users say "my family."
- A) Can we merge them?
- B) Does a user ever need to act on a dependent's prescription the same way as their own, and are they allowed to?
- C) Which is more common?
- D) What does the pharmacy system require?

→ **B.** Tests whether the distinction is a real constraint — permissions, law — or a database artifact. That answer decides the whole structure.

**Medium 5.** You're told the flow starts when the user opens the app.
- A) What if they don't open it?
- B) What happened in the user's life five minutes before they opened it?
- C) How do they find the app?
- D) Is there onboarding?

→ **B.** Locates the real trigger, which sits outside your product and is often actionable.

**Medium 6.** Which failure mode is most likely to be missed in a refill flow?
- A) Network offline
- B) Prescription needs a new doctor authorization
- C) User forgot their password
- D) Store is closed

→ **B.** A, C and D get caught by habit. B is domain-specific, frequent in the evidence, and invisible unless you read the tickets.

**Hard 7.** *(Free text)* Write the three clarifying questions you'd ask a client before finalizing top-level structure, and which downstream decision each unblocks.

*Rubric (10 pts):* One targets user vocabulary (3). One targets task frequency or priority (3). One targets a hard constraint — permissions, regulation, existing system (2). Each links to a named downstream decision (2).

**Hard 8.** *(Free text)* A step in your flow is "pharmacy confirms insurance." List every way it can fail and, for each, the one thing the user most needs to know. Then say which you'd design for first and why.

*Rubric (10 pts):* Four or more distinct failures (3). Each paired with user-facing information rather than system state (3). Prioritized by frequency against harm, and says so (3). Recognizes at least one case where the right answer is a person, not a screen (1).

---
---

## Rules to reveal (only after the artifact is graded)

From RightShift Product Rules, sections 4 and 5.

- Keep the recommendation layer separate from the permission layer.
- Put a feature's logic where the feature lives.
- State the relationship rule absolutely when the client can.
- One word per concept, everywhere.
- Name things the way the user describes them, not the way the system stores them.
- Design the menu for the product you'll have in a year.
- Order fields by what the user can change: informational, editable, locked.
- Hide the row, not just the value.
- Decide search scope before writing search rules.


---

## Read before Day 4

Deliver this as the last thing in the session, before writing progress.md. Say it as written:

> **Read these before Day 4** — 35 minutes together:
>
> Mailchimp Content Style Guide, *Voice and Tone* — 15 min
> **https://styleguide.mailchimp.com/voice-and-tone/**
>
> GOV.UK, *Writing to GOV.UK standards* — 20 min
> **https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards**
>
> Tomorrow is copy. These two are what you'll be writing against.
