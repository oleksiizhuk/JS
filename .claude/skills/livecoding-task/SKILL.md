---
name: livecoding-task
description: Format and rules for live coding tasks in the interview trainer (react-interview/src/livecoding/tasks.js) — task object, in-browser tests, reference solution, bilingual en block, and the mandatory self-check script. Use whenever adding, rewriting or debugging a live coding task, even if the user just says "add a task about debounce/curry/flatten" or "the tests in live coding are wrong".
---

# Live coding: task format

The trainer (`react-interview/src/livecoding/LiveCoding.jsx`) shows the task,
gives the user an editor pre-filled with `starter`, runs the user's code with
`new Function(code + "return " + fnName)` and executes every test against the
returned function. Tasks live in `src/livecoding/tasks.js` (the `TASKS`
array), grouped by level with `// ═══ EASY / MEDIUM / HARD ═══` separators.
The user practises the way an interview goes: reads the brief, writes code,
runs tests, then compares with `solution` + `notes`.

## Task object

```js
{
  id: "group-by",                 // kebab-case, unique
  title: "groupBy",               // short, may be English
  level: "easy" | "medium" | "hard",
  brief: "one line for the task list",
  description: "full statement: signature, expected behaviour, interview bonus",
  fnName: "groupBy",              // what `new Function` returns — MUST be declared in starter & solution
  starter: `function groupBy(arr, key) {\n  // твой код\n}`,
  tests: [                        // >= 3; test = { name, run(fn) } — run may be async, throws on failure
    { name: 'groupBy([...], "x") → {...}', run: (fn) => assertEq(fn(input), expected) },
  ],
  solution: `...idiomatic code with short comments...`,
  notes: "what the interviewer is checking + the senior-level extra (1–3 sentences)",
  en: { title, brief, description, starter, solution, notes },  // full translation, all six
}
```

`assertEq(actual, expected, label)` and `assert(cond, msg)` are already
defined at the top of tasks.js — use them, don't add new helpers per task.
`sleep(ms)` is exported for async tasks.

## Why each rule exists

- **The solution must pass its own tests.** The user compares their result
  with `solution`; if the reference fails, they learn the wrong thing and
  trust the trainer less. Same for a test with a wrong expectation — the user
  will "fix" correct code to satisfy it.
- **The starter must not pass all tests** — otherwise there is nothing to
  solve. Keep `starter` to the signature plus a `// твой код` comment.
- **Tests are the specification.** Cover: the happy path, an empty input,
  one edge case that a naive solution gets wrong (emoji in a string,
  `[1,10,2]` for sort, `this` for call/bind, out-of-order responses for
  async). Name tests as `input → output` so a red test explains itself.
- **Tests run in the browser** via `new Function`: no imports, no Node APIs,
  no shared mutable state between tests. Async tests must settle — a test
  that waits for a callback the user never calls hangs forever; add a
  timeout inside the test if the API is callback-based. When a test reads
  `this` inside the user's callback, use `this?.x` — a wrong solution (an
  arrow function) should fail with a clean red test, not with an uncaught
  error thrown from inside `setTimeout`.
- **Keep `solution` interview-idiomatic**, not the shortest possible:
  comments on the non-obvious line, and a second variant when the interview
  bonus asks for one ("without `.reverse()`"). `notes` = what to SAY out
  loud in the interview (Unicode, `return await`, backoff, AbortSignal…).
- **Bilingual**: the EN toggle swaps in `task.en` (`{...task, ...task.en}`),
  so every text field the page shows needs an `en` twin. Code in
  `en.starter`/`en.solution` is identical, only comments and messages are
  translated. Test names stay as they are (mostly code already).
- No backticks or `${` inside the `starter`/`solution` template literals
  unless escaped — they terminate the literal.

## Mandatory check

Run from `react-interview/` after every change (also for a single task):

```bash
node ../.claude/skills/livecoding-task/scripts/check-tasks.mjs          # all tasks
node ../.claude/skills/livecoding-task/scripts/check-tasks.mjs group-by # one task
```

It executes each `solution` through its own `tests` exactly like the browser
does (with a 3 s timeout per test), checks that the starter does not already
pass, validates `fnName`, `level`, uniqueness of `id` and the full `en`
block. Exit code 1 with a list of problems = the task is not done.

Then the usual gate: `npm run build && npm test`. If the task deserves quiz
questions (most do: "what does curry(f)(1)(2) return?"), add 1–2 via the
`/quiz-questions` skill.
