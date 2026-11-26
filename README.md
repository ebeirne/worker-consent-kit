# Worker Consent Kit

When a fast-food worker gets a text asking them to cover a shift, they answer the way people text: "ok but only till 9", "sí, ya voy 👍", "who is this?". Whoever reads that reply decides whether it counts as a yes. In New York City that decision matters: a late schedule change needs the worker's written consent and often extra pay of $10 to $100, and in July 2026 a city judge recommended $70.5 million against one chain for 38,933 changes made without it.

This kit is the open part of that problem:

- **A reply reader** (`src/reader.js`) that labels a short English, Spanish or mixed reply as `yes`, `no`, `conditional` or `unclear`, and records a yes on its own only when the yes is plain. Anything with a time, a limit, a hedge or a question goes back to the worker or the manager.
- **Public test sets** (`data/`) and a scorer (`eval/score.js`) that counts the one error that must stay at zero: a **wrong yes**, where a no, a condition or a maybe gets recorded as consent.
- **New York City's Fair Workweek extra-pay rules as code** (`src/payrules.js`), checked against the city's own worked examples (`test/payrules.test.js`).
- **Worker Pay Check** (`web/worker-pay-check.html`), a free page in English and Spanish where a worker picks what happened to their schedule and sees what extra pay the city says they are owed.

## Results so far

| Test set | Replies | Read right | Wrong yes | Real yeses recorded on the first reply |
|---|---|---|---|---|
| Tuning set (rules were adjusted on it) | 100 | 100 | 0 | 40 of 40 |
| Held-out set, scored once before any change | 50 | 46 | 0 | 10 of 16 |
| Set 2, harder, written after the rules were frozen | 80 | 69 | 0 | 9 of 24 |

Honesty notes:

- Every reply in these sets was written by the author, not collected from real workers. Real texts will be messier. The next version needs real, opt-in replies.
- After the held-out set was scored once, a bug found on the tuning set was fixed ("no puedo" was read as mixed). The current code scores 47 of 50 on the held-out set, but that number no longer counts as held-out.
- The reader stays at zero wrong yeses by sending many real yeses to a one-line confirm text. Recording more of them directly, without adding wrong yeses, is the open research problem.

## Run it

```
npm test
```

or one piece at a time:

```
node test/payrules.test.js
node eval/score.js data/set2.json --show
```

No dependencies. Node 18 or newer.

To try it without Node, open `web/index.html` in any browser: type a reply and see how it's read, try to fool the reader, and see what a schedule change owes. `web/worker-pay-check.html` is the worker-facing pay page in English and Spanish.

## Use and limits

The pay rules follow New York City's Fast Food Fair Workweek FAQ. They are a guide, not legal advice, and rules differ outside New York City and outside fast food. The reader is a rule-based baseline meant to be beaten; please send test replies that break it.

MIT licensed.
