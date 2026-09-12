---
name: codereview-exercise
description: Format and rules for code review trainer exercises in react-interview/src/codereview/levels/{easy,medium,hard}.js — code with planted issues, 1-based issue.lines, severity, bilingual en, plus the check script. Use whenever adding, editing or fixing a code review exercise, even if the user only says "add a code review about race conditions" or "the highlighted lines in code review are off".
---

# Code review trainer: exercise format

The trainer (`react-interview/src/codereview/CodeReviewTrainer.jsx`) shows a
snippet as a fake pull request. The user clicks the lines they consider
problematic, then reveals the answer: every planted `issue` with its lines,
severity, explanation and fix. Clicks on lines not listed in any issue count
as **false positives** — so unmarked lines must be genuinely clean.

Exercises live in `src/codereview/levels/{easy,medium,hard}.js` (arrays
`EASY_EXERCISES` / `MEDIUM_EXERCISES` / `HARD_EXERCISES`); `exercises.js`
merges them and holds four legacy base exercises — don't add new ones there.

## Exercise object

```js
{
  id: "profile-card",              // kebab-case, unique across all levels
  level: "easy",                   // must match the file it lives in
  title: "ProfileCard (React)",    // what + stack in brackets: (React) (async) (RN) (security)
  context: "1–2 sentences: what the code is for + the PR author's claim «починил фильтрацию»",
  en: { title, context },
  code: `function ProfileCard({ userId }) {
  ...
}`,
  issues: [
    {
      lines: [9, 10],              // 1-based line numbers into `code`
      severity: "blocker" | "major" | "nit",
      title: "«name of the smell»",
      explain: "what actually breaks for the user/team, with a concrete scenario",
      fix: "how to fix — a snippet or one precise sentence",
      en: { title, explain, fix },
    },
  ],
}
```

## Level guide (comments at the top of each level file)

| level  | code size   | issues | nature |
|--------|-------------|--------|--------|
| easy   | 10–16 lines | 2–3    | visible on careful reading: mutation of state, missing dep, `key={i}`, empty catch |
| medium | 20–30 lines | 3–4    | implicit: stale closure, missing cleanup, race, mutated props, cache without invalidation |
| hard   | 35–50 lines | 4–6    | plausible production code: TOCTOU, leaks, StrictMode double-run, security, reference stability |

## Why each rule exists

- **Lines are the answer key.** `issue.lines` are 1-based indexes into the
  lines of `code` — count after the code is final, and re-count after ANY
  edit to `code` (adding one blank line shifts everything below). Mark every
  line that belongs to the problem (the whole `useEffect` for a missing
  cleanup), not just the first one, otherwise a correct click is scored as
  a miss.
- **Unmarked lines must be clean.** The user is trained to spot problems;
  a real smell on an unmarked line gets punished as a false positive and
  teaches the wrong lesson. Before finishing, re-read the code as a hostile
  reviewer and either mark or remove every extra smell you find.
- **Severity is part of the lesson**: `blocker` = data loss / security /
  broken feature; `major` = wrong behaviour in realistic cases or perf that
  users notice; `nit` = style, readability, minor perf. Each exercise
  should mix at least two severities so the user practises triage.
- **`explain` names a consequence, not a rule.** "Array.prototype.sort
  mutates the array in state → React may skip the re-render" beats "don't
  mutate state". `fix` should be concrete enough to type.
- **The code must be realistic** — a believable component or function with
  a plausible PR claim in `context`. Junior-style bugs are fine on easy,
  hard ones should pass a quick glance.
- **No backticks or `${` inside `code`** — it's a template literal. Use
  string concatenation in the snippet instead.
- **Bilingual**: the EN toggle spreads `ex.en` over the exercise and
  `issue.en` over each issue; missing fields fall back to Russian silently,
  so the check script insists on every `en` field.

## Mandatory check

Run from `react-interview/` after every change:

```bash
node ../.claude/skills/codereview-exercise/scripts/check-exercises.mjs              # all
node ../.claude/skills/codereview-exercise/scripts/check-exercises.mjs profile-card # one
```

It validates line ranges (and flags blank marked lines — the usual
off-by-one), backticks/`${` in `code`, severities, unique ids and the full
`en` block on the exercise and on every issue. Then the usual gate:
`npm run build && npm test`.
