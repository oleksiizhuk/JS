# Interview prep (React/JS)

The user is preparing for an interview following the checklist in
`~/Downloads/temp.xlsx` (sections: JS Core, React, Redux, Native, GraphQL,
TypeScript, Live coding).
**Communicate in Russian**; technical terms in English. Docs, skills and
commit bodies may be in either language (commit subjects — in Russian, see
the git-workflow skill).

## Structure

- `react-interview/` — the Vite + React "interview trainer": topic pages with
  live demos, a quiz (10/20/50 questions, bank in `src/quiz/sections/*.js`),
  live coding (`src/livecoding/`: in-browser editor, code runs via
  new Function, tests in tasks.js; NEW TASK rule: the solution must pass its
  own tests — verify with a node script running task.solution through
  task.tests), the code review trainer (`src/codereview/`: exercises with
  easy/medium/hard levels — put NEW exercises into
  `levels/{easy,medium,hard}.js` with a `level` field; RULE: `issue.lines`
  are 1-based line numbers into `code`, unmarked lines must be clean —
  clicking them counts as a false positive; no backticks or `${` inside
  `code`), and why-did-you-render. The "i18n / i18next" page uses REAL
  i18next (a separate createInstance just for the demo — the trainer's
  global RU/EN toggle stays hand-rolled `<L>`, a deliberate trade-off).
  Run: `cd react-interview && npm run dev` → http://localhost:5173
  Check after changes: `npm run build && npm test` (vitest + snapshots).
- `js-core/` — exercise files (call-bind-apply, event-loop) + the `JS-CORE.md`
  summary
- `react-notes/` — notes (prop-drilling)
- `live-coding/` — live coding tasks (reverse-string)
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
  `react-interview/src/topics/`. Reference: `src/topics/js/LetVarConst.jsx`.
- **`/quiz-questions`** (`.claude/skills/quiz-questions/SKILL.md`) — the quiz
  question format and rules ({ t, q, o[4], a, e }; sections JS/React/Redux/
  Native/GraphQL/TS/EnginX/Claude). Invoke when adding questions to
  `src/quiz/questions.js`.
- **`/git-workflow`** (`.claude/skills/git-workflow/SKILL.md`) — commit/push
  rules, the pre-commit build+test gate, auto-deploy to GitHub Pages, what
  must never be done (force-push, breaking the `/JS/` base). Invoke for any
  commit, push or deploy-affecting change.

## Project rules

- Register new topics in `react-interview/src/App.jsx` (SECTIONS), section
  order: JS Core → React → Redux → ... → Тренировка → Разное.
- Add 2–3 questions for every new topic to `src/quiz/questions.js`
  ({ t, q, o[4], a, e }), keeping the topic order in the bank.
- Always show example code ON the page (`pre.code`) — the user reads from
  the site.
- ALL content is BILINGUAL (the RU/EN toggle switches everything): pages —
  via `<L ru en>` / `<CodeBlock ru en>` / the en props of Demo/Gotchas (see
  the interview-topic skill); quiz — an `en` field on every question (en.o
  order = o!); live coding and code review — en fields on tasks/exercises.
  New content without its EN version is not considered done. Guard:
  `src/__tests__/translations.test.js` + `npm test` after any change.
- No `eval` in demos — only `new Function("...")()`.
- StrictMode in `main.jsx` is intentionally off (lifecycle demos).
- Learning format: the user predicts the answer first, then checks it with
  a breakdown of mistakes.
