# Interview prep (React/JS)

The user is preparing for an interview following the checklist in
`~/Downloads/temp.xlsx` (sections: JS Core, React, Redux, Native, GraphQL,
TypeScript, Live coding).
**Communicate in Russian**; technical terms in English. Docs, skills and
commit bodies may be in either language (commit subjects — in Russian, see
the git-workflow skill).

## Structure

- `react-interview/` — the Vite + React + **TypeScript (strict)** "interview
  trainer": topic pages with
  live demos, a quiz (10/20/50 questions, bank in `src/quiz/sections/*.ts`),
  live coding (`src/livecoding/`: in-browser editor, code runs via
  new Function, tests in tasks.ts; NEW TASK rule: the solution must pass its
  own tests — verify with a node script running task.solution through
  task.tests), the code review trainer (`src/codereview/`: exercises with
  easy/medium/hard levels — put NEW exercises into
  `levels/{easy,medium,hard}.ts` with a `level` field; RULE: `issue.lines`
  are 1-based line numbers into `code`, unmarked lines must be clean —
  clicking them counts as a false positive; no backticks or `${` inside
  `code`), and why-did-you-render. The "i18n / i18next" page uses REAL
  i18next (a separate createInstance just for the demo — the trainer's
  global RU/EN toggle stays hand-rolled `<L>`, a deliberate trade-off).
  The "English" section (`src/english/`): a vocabulary trainer for the user's
  English course — `units.ts` holds sections of word cards + an original
  story with `[[key]]` markers; modes: text, cards, spaced review, gaps,
  grammar (`grammar.ts`: C1 constructions from the unit text, keyed by unit
  id — quote with `**highlight**`, rule, pattern, examples, trap, task with
  a hidden answer; ru + en fields on every point). The ENG tab always renders
  the English UI (RU/EN toggle lives in the RN tab only).
  New word lists → the english-words skill; guard: `english.test.tsx`.
  Run: `cd react-interview && npm run dev` → http://localhost:5173
  Check after changes: `npm run build && npm test` (build = `tsc --noEmit`
  + vite; `npm run typecheck` alone is faster while iterating).
- `react-interview/exercises/` — standalone JS Core scripts from earlier study
  rounds (closure, context/this, event-loop, js-core + `JS-CORE.md`, leetcode,
  live-coding, map-set-weakmap-weakset, promise, prototype, array,
  recursion, misc,
  react-notes/prop-drilling.tsx — read-only, imports zustand). Run:
  `node exercises/<dir>/<file>.ts`. Deliberately CommonJS (own package.json)
  and outside the app's tsc — `this` puzzles need sloppy mode.
- `README.md` — the index of everything (in English, with the live-site link)

## Deployment

Push to `main` = production deploy to GitHub Pages
(https://oleksiizhuk.github.io/JS/) via `.github/workflows/deploy.yml`.
Details and git rules — in the git-workflow skill.

## Skills (MANDATORY to use)

- **`/interview-topic`** (`.claude/skills/interview-topic/SKILL.md`) — the
  trainer page format: interviewer's question → model answer (bilingual
  RU/EN) → deep dive with demos → "where they trip you up" → red flag →
  summary. Invoke when creating or reworking ANY topic page in
  `react-interview/src/topics/`. Reference: `src/topics/js/LetVarConst.tsx`.
- **`/quiz-questions`** (`.claude/skills/quiz-questions/SKILL.md`) — the quiz
  question format and rules ({ t, q, o[4], a, e }; sections JS/React/Redux/
  Native/GraphQL/TS/EnginX/Claude). Invoke when adding questions to
  `src/quiz/questions.ts`.
- **`/livecoding-task`** (`.claude/skills/livecoding-task/SKILL.md`) — live
  coding task format (`src/livecoding/tasks.ts`) + the check script that
  runs every solution through its own tests. Invoke when adding or fixing
  a live coding task.
- **`/codereview-exercise`** (`.claude/skills/codereview-exercise/SKILL.md`)
  — code review exercise format (`src/codereview/levels/*.ts`) + the check
  script for line numbers, backticks and `en`. Invoke when adding or fixing
  a code review exercise.
- **`/english-words`** (`.claude/skills/english-words/SKILL.md`) — word-card
  and story format for `src/english/units.ts`. Invoke whenever the user
  pastes a list of English words/phrases from their course.
- **`/git-workflow`** (`.claude/skills/git-workflow/SKILL.md`) — commit/push
  rules, the pre-commit build+test gate, auto-deploy to GitHub Pages, what
  must never be done (force-push, breaking the `/JS/` base). Invoke for any
  commit, push or deploy-affecting change.

## Project rules

- Register new topics in `react-interview/src/App.tsx` (SECTIONS), section
  order: JS Core → React → Redux → ... → Тренировка → Разное. The sidebar has
  two top tabs (RN = interview trainer, ENG = English) and section headers
  are accordions (the current topic's section opens automatically).
- Add 2–3 questions for every new topic to `src/quiz/questions.ts`
  ({ t, q, o[4], a, e }), keeping the topic order in the bank.
- Always show example code ON the page (`pre.code`) — the user reads from
  the site.
- ALL content is BILINGUAL (the RU/EN toggle switches everything): pages —
  via `<L ru en>` / `<CodeBlock ru en>` / the en props of Demo/Gotchas (see
  the interview-topic skill); quiz — an `en` field on every question (en.o
  order = o!); live coding and code review — en fields on tasks/exercises.
  New content without its EN version is not considered done. Guard:
  `src/__tests__/translations.test.ts` + `npm test` after any change.
- TypeScript rules: strict mode, real types — no `any` (except the `UserFn`
  alias for user-written live-coding functions), no `@ts-ignore` /
  `@ts-expect-error`, no `as unknown as`. Data modules export their types
  (`Question` in `quiz/types.ts`, `Task` in `livecoding/tasks.ts`, `Exercise`
  in `codereview/exercises.ts`, `Unit`/`Word` in `english/units.ts`); shared
  demo props live in `topics/js/JsDemo.tsx` (`Demo`, `Logger`) and
  `topics/InterviewBlocks.tsx` (`GotchaItem`). Imports are extension-less,
  except the two aggregators (`quiz/questions.ts`, `codereview/exercises.ts`)
  which keep `.ts` so the skills' Node check scripts can load them.
- No `eval` in demos — only `new Function("...")()`.
- StrictMode in `main.tsx` is intentionally off (lifecycle demos).
- Learning format: the user predicts the answer first, then checks it with
  a breakdown of mistakes.
