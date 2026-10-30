## 7. Day 4 — Voice and copy (60 min)

### Concept (12 min)

In most products the copy is the interface. A user doesn't experience your architecture. They read eleven words and decide whether to continue. If those words are wrong, the structure underneath doesn't get a chance.

Four places copy carries the product:

- **Buttons** — a verb the user would say. "Refill it" over "Submit." Never "OK" on a consequential action.
- **Empty states** — the first thing a new user sees. "No items" wastes the best teaching moment in the product.
- **Errors** — say what happened, whose problem it is, and what to do next. Don't blame the user. Don't show a code on its own.
- **Confirmations** — say what happened and what happens next, including when.

**Voice and tone are different things.** Voice is constant: who you sound like. Tone shifts with the situation. The same product is warm on a success screen and plain on an error.

Define voice as three adjectives and three anti-adjectives. The anti-list does more work. "Friendly" means nothing until you've written "not jokey."

**Plain language is a design decision.** Short sentences, everyday words, the important thing first. Government digital teams rebuilt whole services on this and measured the result.°

For MeridianRx: a message reading *"your refill needs your doctor's approval — we've asked, and we'll text you when it's ready"* removes one of the four abandonment causes on its own. No new screen. Words in the right place at the right time.

### Start here — the reading

Say this, as written:

> Before today you should have read two things, 35 minutes together:
>
> Mailchimp Content Style Guide, *Voice and Tone* — 15 min
> **https://styleguide.mailchimp.com/voice-and-tone/**
>
> GOV.UK, *Writing to GOV.UK standards* — 20 min
> **https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards**
>
> If you haven't, read them now and come back.
>
> If you have: what's Mailchimp's distinction between voice and tone, in their own words?

Wait for the answer before going on.


### Build (40 min) — artifact: Copy Pass

1. **Voice definition** — 3 adjectives, 3 anti-adjectives, one sentence on why this voice suits someone managing medication.
2. **Rewrite every string** in the Day 3 flow. Table: location, string, why this wording.
3. **Three hard states in full** — an insurance denial error, a no-prescriptions-yet empty state, a refill-submitted success.
4. **The reauthorization message.** Write it three ways and pick one.

### Rubric (100 pts)

| Criterion | Pts | Full marks |
|---|---|---|
| Error copy says what, whose, next | 20 | No codes, no blame, an actionable step |
| Anti-adjectives are specific | 15 | "Not cheerful about health" beats "not bad" |
| Buttons use the user's verb | 15 | No "Submit," no "OK" on consequential actions |
| Empty state teaches | 15 | Explains what goes here and how to start |
| Reauthorization message | 20 | Names the situation, the action taken, and when they'll hear back |
| Voice consistent across states | 15 | Same person talking on the error and the success |

### Quiz — Day 4

**Easy 1.** Client: *"Make the tone friendlier."*
- A) Friendlier than what?
- B) Can you show me a message that felt wrong, and one that felt right?
- C) Should we use emoji?
- D) Who's the audience?

→ **B.** An example is more useful than an adjective.

**Easy 2.** Best error message?
- A) Error 402: transaction declined
- B) Something went wrong. Try again.
- C) Your insurance didn't cover this refill. Call us at [number] and we'll check other options.
- D) We couldn't process your request at this time.

→ **C.** What happened, whose issue, what to do next.

**Easy 3.** A button reads "Submit."
- A) Is it too long?
- B) What does the user think they're doing when they press it?
- C) Should it be a different colour?
- D) Is there a cancel button?

→ **B.**

**Medium 4.** The client wants the error on a failed medication refill to read *"Oops! Our bad 🙈"*.
- A) Do you want emoji elsewhere too?
- B) What should someone who needs this medication today do after reading that?
- C) Is this on brand?
- D) Have you tested it?

→ **B.** Reframes tone as consequence rather than taste, and avoids arguing about brand, which you'll lose.

**Medium 5.** Writing the reauthorization message. Which question most changes the wording?
- A) How long does approval usually take?
- B) Has the pharmacy already contacted the doctor, or does the patient have to?
- C) Can we send it by SMS?
- D) What's the character limit?

→ **B.** It decides whose task it is. That's the difference between "we've asked your doctor" and "call your doctor." The rest is trim.

**Medium 6.** A client asks for the same cheerful voice on every screen.
- A) Agree, consistency matters
- B) Ask what they'd want the screen to sound like when a patient's medication is denied
- C) Explain voice vs. tone theory
- D) Propose two voices

→ **B.** Uses their own product to make the point. C is correct and won't land.

**Hard 7.** *(Free text)* You're handed a screen reading "No data available." Write the questions you'd ask to rewrite it, then write your replacement.

*Rubric (10 pts):* Asks whether it's genuinely empty or failed to load — these need opposite copy (4). Asks who arrives here and why (2). Asks what the next action is (2). Replacement teaches and offers an action (2).

**Hard 8.** *(Free text)* Write the reauthorization message in under 25 words. Then list the two facts you'd need confirmed by the client before you'd ship it.

*Rubric (10 pts):* Under 25 words (1). States the situation plainly (2). Says who is doing what (3). Says when they'll hear back (2). The two facts are genuinely blocking — who contacts the doctor, typical turnaround (2).

---
---

## Rules to reveal (only after the artifact is graded)

From RightShift Product Rules, sections 6 and 7.

- No step ends without closure.
- Design the empty state, not only the full one.
- Check the design against real data before approving it.
- Prefer the informational element over the decorative one.
- Warm the screens where the user arrives.
- One support address, not a scatter of "contact your administrator."
- Say what an input field means, show an example, state what happens.


---

## Read before Day 5

Deliver this as the last thing in the session, before writing progress.md. Say it as written:

> **Read these before Day 5** — 65 minutes together. This is the heaviest night of the week, so give it a proper sitting:
>
> Jeff Patton, *The New User Story Backlog is a Map* — 25 min
> **https://jpattonassociates.com/the-new-backlog/**
>
> Ryan Singer, *Shape Up*, the chapters on shaping and setting the appetite — 40 min
> **https://basecamp.com/shapeup**
>
> Both free. Tomorrow's concept section is short because these carry it.
