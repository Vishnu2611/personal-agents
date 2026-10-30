## 8. Day 5 — Slicing and handoff (65 min)

### Concept (12 min)

A flat feature list gives you order but not shape. You can't see what's missing, and you can't see which small set adds up to something a person could use. A **story map** lays the user's journey left to right with detail underneath each step. Draw a horizontal line across it and you can see a complete but thin version of the product.✓

**Thin slice, not phase one.** Building the first third of the journey perfectly ships nothing usable. Take one narrow path all the way through: fewer options at every step, but a person can finish the job.

**Appetite instead of estimate.** An estimate answers how long the work takes. An appetite fixes the time and asks what fits. The second produces decisions.✓

**Acceptance criteria.** "User can refill a prescription" isn't testable. Write what is true before, what the user does, what is observably true after, and the failure branches. If an engineer can satisfy your criterion in a way you'd reject, it isn't finished.

### Start here — the reading

Say this, as written:

> Before today you should have read two things, 65 minutes together. Both free:
>
> Jeff Patton, *The New User Story Backlog is a Map* — 25 min
> **https://jpattonassociates.com/the-new-backlog/**
>
> Ryan Singer, *Shape Up* — the chapters on shaping and setting the appetite — 40 min
> **https://basecamp.com/shapeup**
>
> This was the heaviest reading of the week. If you haven't done it, do it now — today's concept is short because the reading carries it.
>
> If you have: why does Patton say a flat backlog is a bad plan?

Wait for the answer before going on.


### Build (45 min) — artifact: Story Map + Thin Slice + Criteria

1. **Story map** — backbone of user activities across, detail below each.
2. **Thin slice line**, drawn explicitly. State what's above it, what's below, and why.
3. **Appetite statement** — "6 weeks, 2 engineers, 1 designer. Here's what fits and what I cut."
4. **Acceptance criteria** for 3 stories, each with at least one failure branch.
5. **Handoff page** — one page: outcome, target user, flow, thin slice, criteria, open questions. This is what the designer and engineer receive.

### Rubric (100 pts)

| Criterion | Pts | Full marks |
|---|---|---|
| Thin slice complete end to end | 25 | A user could finish the job, narrowly |
| Criteria include failure branches | 20 | Not only the happy path |
| Criteria unambiguously testable | 20 | No adjectives, no "works correctly" |
| Cuts justified against appetite | 15 | A named trade, not an omission |
| Handoff page self-sufficient | 15 | No verbal explanation required |
| Open questions listed | 5 | Unknowns named rather than guessed |

### Quiz — Day 5

**Easy 1.** Acceptance criterion: *"The refill flow should be fast."*
- A) How fast?
- B) Fast measured from what event to what event, and what number counts as pass?
- C) On what device?
- D) Compared to what?

→ **B.** A gets a number without a definition, which fails differently.

**Easy 2.** Client: *"Can we add just one more small feature?"*
- A) How small?
- B) Which item currently in scope comes out to make room?
- C) Can it wait?
- D) Who asked for it?

→ **B.** With a fixed appetite every addition is a trade. Making the trade visible is the job.

**Easy 3.** A story map has no failure branches.
- A) Is it finished?
- B) What does the user do when this step can't complete?
- C) How many sprints is this?
- D) Who owns each story?

→ **B.**

**Medium 4.** An engineer says a story is unclear. Best first question to yourself?
- A) Is the engineer being difficult?
- B) Could this criterion be satisfied in a way I'd reject?
- C) Should I add more detail?
- D) Is there a design for it?

→ **B.** That's the test for a broken criterion. C often makes it worse, adding volume instead of precision.

**Medium 5.** The client wants all four abandonment causes solved in six weeks.
- A) Can we get more budget?
- B) If we removed only one cause and it worked, which would you want it to be?
- C) Can we extend the timeline?
- D) Which is easiest?

→ **B.** Forces a priority using their judgment and sets up a measurable first release. A and C attack the appetite instead of the scope.

**Medium 6.** Which is a genuine thin slice for MeridianRx?
- A) A full notification system for all message types
- B) One medication, one patient, refill request through to pickup-ready alert, no family accounts, no payment
- C) The refill request screen only, fully designed
- D) An account system plus profile plus preferences

→ **B.** Narrow and complete. C is a fragment. A and D are infrastructure with no user outcome.

**Hard 7.** *(Free text)* Write acceptance criteria for "patient is told their refill needs doctor approval," including two failure branches.

*Rubric (10 pts):* Precondition stated (2). Trigger is an event, not a screen visit (2). Observable post-condition (2). Two real failure branches — doctor unreachable, approval denied (3). No adjectives (1).

**Hard 8.** *(Free text)* Your handoff page is done. Write the three questions you'd want a skeptical engineer to be unable to ask. Then check your own artifact and say honestly whether they can ask them.

*Rubric (10 pts):* Questions target load-bearing gaps — data source, permissions, failure handling (4). Self-audit is honest and finds at least one real gap (4). Says how they'd close it (2).

---
---

## Rules to reveal (only after the artifact is graded)

From RightShift Product Rules, sections 2 and 8.

- Do the expensive part by hand until volume justifies building it.
- Cut to MVP at implementation, not at design.
- State exclusions in writing before the client assumes otherwise.
- Sequence by dependency and effort, not desire.
- Placeholder copy ships.
- Keep standing validation rules outside the design document.


---

## Before Day 6

Deliver this as the last thing in the session. Say it as written:

> **No reading before Day 6.** The capstone uses everything from the first five days.
>
> Set aside 110 minutes and have Claude Code open — you build the prototype in it.
