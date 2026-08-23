---
name: interview-topic
description: Page format for the interview trainer (react-interview) — interviewer's question → model answer → deep dive with live demos → "where they trip you up" traps. Use when creating or reworking ANY topic page in react-interview/src/topics/.
---

# Topic page format for the interview trainer

Project: `react-interview/` (Vite + React). Every topic page is built as a
"mini-interview" in a strict order. Reference sample: `src/topics/js/LetVarConst.jsx`.
The user communicates in Russian; page content is bilingual RU/EN.

## Page structure (mandatory order)

1. **`<InterviewQuestion en="...">`** — the question exactly as an interviewer
   would ask it ("What's the difference between X and Y?"). BILINGUAL:
   Russian — children, English — the `en` prop (string). The language is
   switched by the RU/EN toggle in the sidebar (LangContext).
2. **`<ModelAnswer en={<>...</>}>`** — the model answer the interviewer wants
   to hear. BILINGUAL: Russian — children, English — the `en` prop (JSX):
   - first person, in quotes «...» (English — "..."), as coherent spoken speech
   - 4–7 sentences, key terms highlighted with `<b>`
   - ends with a practical takeaway ("in new code I do X, because...")
   - the English version is a full translation of the same structure, not a
     shortened one
3. **`<SectionTitle>Разбор с примерами</SectionTitle>`** + 2–4 demos:
   - JS topics — the `Demo` component from `js/JsDemo.jsx`: code on the page,
     a "▶ Run" button, real output, a `hint` with the explanation
   - React/Redux topics — interactive cards with render counters
     (`useRenderCount` from `helpers.jsx`), logs (`LogPanel`), badges
   - TS — use `Demo` where the effect is visible at JS runtime (`as` doesn't
     check, `Omit` lets a typo through, `!` doesn't save you from null);
     static cards only for purely type-level constructs with no runtime trace
   - topics with no browser runtime (React Native, GraphQL server) — static
     `<pre className="code">` cards; that's fine, don't fake a `Demo`
   - **code is ALWAYS visible next to the demo** (`<pre className="code">`):
     an interactive part without code is incomprehensible — the user must see
     exactly what is being compared. Syntax highlighting is applied
     automatically (`src/highlight.js`)
   - **the shown code must match the executed code** in `run`. If reproducing
     an error requires a workaround (`new Function`), that's acceptable, but
     the visible code and the expectation comment must match the real output
   - **a demo must prove its claim**: if the text promises "this component
     doesn't re-render", verify (with a test or logic) that it really doesn't
     re-render when the parent renders; wrap in `memo` and hoist the subtree
     out of render if needed, explaining that on the page
4. **`<Gotchas items={[...]}>`** — "Where they trip you up": 3–6 traps, each
   `{ title: "«trick question»", code: "mini-snippet with the answer in a comment", text: "what's being tested + how to answer correctly" }`
5. If the topic has a well-known red flag — a `<div className="redflag">` block:
   **what people say → why it's a red flag → the correct phrasing**
6. Finish with `<div className="explain">` — a "one-line summary".

## Imports

```jsx
import { Demo } from "./JsDemo.jsx"; // from the js/ folder; adjust the path elsewhere
import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas } from "../InterviewBlocks.jsx";
```

## Rules

- The ENTIRE page is bilingual (RU/EN toggle in the sidebar, LangContext):
  - question/answer — the `en` props (see above);
  - arbitrary text (cards, hint, explain, redflag) — the
    `<L ru={<>…</>} en={<>…</>} />` wrapper from InterviewBlocks;
  - code blocks — `<CodeBlock ru={`…`} en={`…`} />` (the code is identical,
    only COMMENTS and string-literal messages are translated);
  - `Demo` — the `en={{ title, code, hint }}` prop; `Reveal` — `en={{ note }}`;
  - `Gotchas` items — the `en: { title, code, text }` field;
  - `SectionTitle` — common titles translate themselves, custom ones — the
    `en` prop.
  Terms (hoisting, TDZ, batching) stay in English inside Russian text.
- Do NOT translate terms with literal calques: "first-class citizens" is
  «объекты первого класса» or the English term, never «граждане первого
  класса». If unsure how a term sounds in Russian — keep the English.
- Do NOT use `eval` in `Demo.run` (rolldown complains) — reproduce errors
  with `new Function("...")()`.
- Demo errors are caught automatically (Demo wraps run in try/catch).
- Register a new topic in `src/App.jsx` in SECTIONS (section order:
  JS Core → React → Redux → ... → Тренировка → Разное).
- Add 2–3 quiz questions for the new topic to `src/quiz/questions.js`
  (format `{ t, q, o[4], a, e }`), keeping the topic order in the bank.
- After changes: `cd react-interview && npm run build && npm test` — both
  green. `npm test` includes the TRANSLATION GUARD
  (`src/__tests__/translations.test.js`): it fails if any page's
  `InterviewQuestion` or `ModelAnswer` lacks the `en` prop. A page without
  its EN translation is not considered done — translate immediately, not
  "later".

## Styles (already in App.css)

`.q-block` / `.answer-block` / `.q-label` — question and answer; `.card`,
`.explain` (blue, summary), `.redflag` (red), `.hint`, `.badge`, `pre.code`,
`.log`.
