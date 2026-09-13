# Interview Trainer (React / JS)

[![Deploy to GitHub Pages](https://github.com/oleksiizhuk/JS/actions/workflows/deploy.yml/badge.svg)](https://github.com/oleksiizhuk/JS/actions/workflows/deploy.yml)

## 🌐 Live site: **https://oleksiizhuk.github.io/JS/**

Prep materials for a senior React / React Native frontend interview, built as an
interactive web app plus a set of notes and exercises. The app is bilingual
(RU/EN toggle in the sidebar) and works straight from the browser — quiz, live
coding and the code review trainer included, no install needed.

## react-interview/ — the interview trainer (main app)

Vite + React + TypeScript (strict). Run locally:

```bash
cd react-interview
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit + production build
npm run typecheck  # types only
npm test           # vitest: snapshot, regression and translation-guard tests
```

Every page follows a mock-interview format: **interviewer's question → the
answer they want to hear → deep dive with live demos → common traps → red
flags → one-line summary**. All content is bilingual — the RU/EN toggle in
the sidebar switches everything, including code comments.

Sections:

- **JS Core** (16 topics) — scope, closures, coercion, prototypes, event loop,
  promises, iterators/generators, collections, `bind/call/apply`…
- **React** (17) — lifecycle, rendering, hooks, context, reconciliation,
  **React Fiber**, Suspense, concurrent features, RSC, **i18n / i18next**
  (with a live i18next demo: interpolation, CLDR plurals, language switching)…
- **Redux** (5), **React Native** (5), **GraphQL** (4), **TypeScript** (5)
- **EnginX** (9) — SDLC, testing pyramid, static analysis, branching
  strategies, design patterns, antipatterns, CI/CD, OWASP, code review
- **Practice**:
  - **Quiz** — 258 questions with per-section checkboxes, 10/20/50 sizes,
    shuffled options, no repeats across runs
  - **Live coding** — 12 tasks executed right in the browser with test runners
  - **Code review trainer** — 20 exercises with difficulty levels
    (🟢 easy / 🟡 medium / 🔴 hard): click the buggy lines, get scored on
    found / missed / false positives — mirrors a real code-review interview
- **Misc** — Claude AI (models, Messages API, tool use, agents) for the
  "do you use AI?" interview questions

## Other folders

- `react-interview/exercises/` — standalone JS Core scripts (run with
  `node exercises/<dir>/<file>.ts` from `react-interview/`): closures,
  `this` / call-bind-apply, event loop ordering, Map/Set/WeakMap/WeakSet,
  promises (all / allSettled / any / race / withResolvers), prototypes,
  leetcode, `reverse-string`, plus the `js-core/JS-CORE.md` summary. See
  `exercises/README.md`
- `react-interview/exercises/react-notes/prop-drilling.tsx` — a read-only
  note: prop drilling and 3 fixes (composition / context / store)
- Plus a few legacy JS practice files in the repo root (TDZ, curry, recursion,
  linked list…) from earlier study rounds

- **English** — the vocabulary trainer for the user's English course: text
  with highlighted words, cards, spaced review, gap-fill and a **Grammar**
  mode (C1 constructions from the unit text: quote → rule → pattern → trap →
  task with a hidden answer)

## Deployment

The site auto-deploys to **GitHub Pages** on every push to `main`
(`.github/workflows/deploy.yml`): `npm ci → npm test → npm run build` →
publish `react-interview/dist`. Tests gate the deploy — a red build never
ships. Production is served from `/JS/` (the repo name), configured via
`base` in `vite.config.ts`; local dev stays at the root.

## Development notes

- New topic pages and quiz questions follow the formats encoded in
  `.claude/skills/` (`interview-topic`, `quiz-questions`); project rules live
  in `CLAUDE.md`.
- After any change: `npm run build && npm test` must stay green — tests
  include a translation guard that fails if a page lacks its EN version.
