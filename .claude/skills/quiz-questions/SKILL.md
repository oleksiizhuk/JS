---
name: quiz-questions
description: Format and rules for writing quiz questions for the interview trainer (react-interview/src/quiz/questions.ts). Use when adding questions for a new topic or growing the bank.
---

# Quiz: question format

The bank is split by section: `react-interview/src/quiz/sections/{js,react,
redux,native,graphql,ts,enginx,claude}.ts` — each exports an array
(`JS_QUESTIONS`, `REACT_QUESTIONS`, …). `quiz/questions.ts` only concatenates
them into `QUESTIONS` in section order. When adding questions, edit the
relevant section file; a new section = a new file + an import in
`questions.ts` + an entry in `SECTION_LABELS` in `Quiz.tsx`.
Engine: `src/quiz/Quiz.tsx` — shuffles questions, never repeats across runs
(localStorage `quiz-seen`); on start the user picks sections via checkboxes
and a size (10/20/50).

## Question format

Every question is BILINGUAL: alongside the ru fields, the field
`en: { t, q, o: [4], e }` — a full translation — is mandatory. CRITICAL: the
option order in `en.o` must match `o` (the correct index `a` is shared; the
engine shuffles both lists with the same order). Question text and options
are in Russian in the ru fields, English in `en`.

```js
{
  t: "JS · Event loop",   // section · subtopic. Section = the prefix before " · "!
  q: "Что выведет?\n<code with \\n>",  // multi-line code goes through \n
  o: ["option A", "option B", "option C", "option D"], // exactly 4
  a: 1,                   // index of the correct option (0-3)
  e: "Explanation: WHY + the fix / the correct interview phrasing.",
}
```

## Sections (the `t` prefix)

`JS`, `React`, `Redux`, `Native`, `GraphQL`, `TS`, `EnginX`, `Claude` — add
new sections to `SECTION_LABELS` in Quiz.tsx as well. Group questions in the
bank by section (separator comments `// ═══ SECTION ═══`), then by subtopic.

## Question quality rules

1. **The best format is "predict the result"**: code in `q`, options are the
   possible outputs (including errors: TypeError, ReferenceError, undefined).
2. **The answer must not be contained in the question.** Bad: "why did this
   get lost?" with the option "because this got lost". Good: "what does fn()
   return?"
3. **Distractors must be plausible** — typical thinking mistakes, not junk:
   for `[1,10,2].sort()` the distractor `[1,2,10]` is mandatory.
4. **Exactly one correct answer**, no "all of the above".
5. **`e` teaches**: the cause + the fix / correct interview phrasing, 1–3
   sentences. Not a restatement of the correct option.
6. **Option length must not give the answer away.** The most common mistake
   is in "What is X?" questions: the correct option gets a full 15–20-word
   definition while distractors are 2–4-word stubs. Test-takers quickly learn
   to pick "the longest, most technical one" without reading. All 4 options
   must be comparable in length and detail (±30%); balance by EXPANDING the
   wrong options into full-fledged false statements, never by shortening the
   correct one.
7. Per new topic — 2–4 questions; at least one "predict the result" and one
   conceptual. **Coverage**: every card in the topic page's deep-dive block
   should have at least one question in the bank.
8. **Section balance**: sections with a comparable number of topic pages
   should differ in question count by no more than ~2×. Check before
   finishing (see below).

## After changes

```bash
cd react-interview && npm run build   # a syntax error fails the build

# Balance and validity check (rules 6-8):
node -e "import('./src/quiz/questions.ts').then(({QUESTIONS})=>{
  const by={}; const bad=[];
  QUESTIONS.forEach((q,i)=>{
    const s=q.t.split(' · ')[0]; by[s]=(by[s]||0)+1;
    if(q.o.length!==4) bad.push(i+' options: '+q.o.length);
    if(q.a<0||q.a>3) bad.push(i+' a='+q.a);
    if(!q.en||!q.en.o||q.en.o.length!==4) bad.push('#'+i+' missing/short en');
    const len=q.o.map(o=>o.length), max=Math.max(...len), min=Math.min(...len);
    if(max>min*2.5) bad.push('#'+i+' \"'+q.t+'\" option length gives the answer away: '+len.join('/'));
  });
  console.log(by); console.log(bad.length?bad:'ok');
})"
```
