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
  new Function; rules in the livecoding-task skill), the code review trainer
  (`src/codereview/`; rules in the codereview-exercise skill), and
  why-did-you-render. The "i18n / i18next" page uses REAL
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
- `react-interview/exercises/` — standalone JS Core scripts from earlier study
  rounds, run with `node exercises/<dir>/<file>.ts`. Deliberately CommonJS
  (own package.json) and outside the app's tsc — `this` puzzles need sloppy
  mode.

## Deployment

Push to `main` = production deploy to GitHub Pages
(https://oleksiizhuk.github.io/JS/) via `.github/workflows/deploy.yml`.
Details and git rules — in the git-workflow skill.

## Skills (MANDATORY to use)

Invoke the matching project skill BEFORE the task, every time: `interview-topic`
(any topic page in `src/topics/`), `quiz-questions`, `livecoding-task`,
`codereview-exercise`, `english-words` (the user pastes course words),
`git-workflow` (any commit, push or deploy-affecting change).

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
  `@ts-expect-error`, no `as unknown as`. Imports are extension-less,
  except the two aggregators (`quiz/questions.ts`, `codereview/exercises.ts`)
  which keep `.ts` so the skills' Node check scripts can load them.
- No `eval` in demos — only `new Function("...")()`.
- StrictMode in `main.tsx` is intentionally off (lifecycle demos).
- Learning format: the user predicts the answer first, then checks it with
  a breakdown of mistakes.
