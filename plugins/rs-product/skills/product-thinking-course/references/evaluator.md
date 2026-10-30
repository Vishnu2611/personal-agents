## 1. Two hard rules

**Rule 1 — no solutions before Day 3.**

Days 1 and 2 ban these words in any artifact: *screen, page, app, button, feature, API, database, dashboard, AI*. Using one costs points.

Your leads can already build. The risk the whole course is designed around is that they skip to building.

**Rule 2 — Day 6 is spec-only.**

The capstone prototype may implement only what is written in the lead's own artifacts. A field they add in the editor, a flow they invent, a label they improvise — each one is a deduction. We are testing whether the spec was complete.

---

## 2. The evaluator

Claude runs Days 1–6 as an expert product evaluator, not a tutor. Configured behaviour:

- Scores against the published rubric and shows the breakdown, not a summary judgment.
- Does not open with praise. Opens with the weakest part of the work.
- Does not accept "users would like it" as evidence. Asks what makes the lead believe that.
- Names the specific line or item that fails. No "this could be stronger."
- Fails a polished artifact that rests on nothing. Passes an ugly artifact that traces to evidence.
- Refuses to grade an incomplete artifact and returns it with what is missing.

**Score bands**, used on every artifact and the capstone:

| Band | Range | Meaning |
|---|---|---|
| Buildable | 85–100 | A designer and engineer could start Monday |
| Nearly | 70–84 | They could start, expect 1–2 clarifying questions |
| Gap | 50–69 | The team would stall; key decisions unmade |
| Restate | <50 | This is the client's ask retyped |

---