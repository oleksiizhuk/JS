---
name: git-workflow
description: Git rules for this repository (oleksiizhuk/JS) — commits, pushing, auto-deploy to GitHub Pages. Use for every commit/push and for any change that affects the deploy.
---

# Git: repository rules

Repository: `git@github.com:oleksiizhuk/JS.git`, single branch — `main`,
which is also production: **every push to main auto-deploys the site** to
GitHub Pages → https://oleksiizhuk.github.io/JS/ (workflow
`.github/workflows/deploy.yml`: `npm ci → npm test → npm run build` →
publish `react-interview/dist`). Red tests = no deploy.

## Mandatory gate before committing

```bash
cd react-interview && npm run build && npm test
```

Both green — commit away. Pushing with broken tests is pointless: CI reruns
them and blocks the deploy, and the README badge turns red.

## Commit format

- Subject line — in Russian, specific, about WHAT changed (not "fix", not
  "update").
- Body — a bulleted list of the key changes (what and why), also in Russian;
  technical terms in English.
- Mandatory trailer as the last line:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

Example:

```
Квиз: 3 вопроса про i18n + фикс утечки ответа в секции Claude

- React · i18n: плюрализация, Trans, Intl (двуязычные, длины сбалансированы)
- вопрос про модели: голые названия вместо дескрипторов-подсказок

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
```

## Never do

- **Never force-push** to main: the history contains a merge with the 2024
  practice files (`closure/`, `eventLoop/`, `leetcode/`…) — they must not be
  lost.
- Don't commit `node_modules/`, `dist/`, `.idea/`, `.DS_Store` — they're in
  `.gitignore`; if `git status` shows them, the ignore setup is broken.
- Don't change `base: '/JS/'` in `react-interview/vite.config.js` or the
  `react-interview/dist` path in the workflow — Pages depends on them.
  Renaming the repository = update the base, the README links and the badge.

## After pushing

A push triggers the deploy (~40–60 s). For significant changes, verify:

```bash
gh run list --repo oleksiizhuk/JS --limit 1        # workflow status
gh run watch <id> --repo oleksiizhuk/JS --exit-status
curl -s -o /dev/null -w "%{http_code}" https://oleksiizhuk.github.io/JS/
```

## When to commit

A commit = a complete unit of meaning (a topic plus its quiz questions; a
batch of review fixes), not every micro-change. When the user says «залей /
запушь» — commit + push; without being asked, commit after finishing a major
chunk of work, but don't commit every step.
