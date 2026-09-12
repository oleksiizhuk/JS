---
name: english-words
description: How to add a new section of English vocabulary to the interview trainer (react-interview/src/english/units.js) — the word-card format (ru, definition, register, examples, usage note with a trap, gap sentence), the story with [[key]] markers, and the guard test. Use whenever the user pastes a list of English words or phrases from their course ("Section 5", "новые слова", "добавь раздел по английскому") or asks to fix a word card.
---

# English vocabulary: adding a section

The page «English → Словарь курса» (`src/english/EnglishTrainer.jsx`) has four
modes built on one data file, `src/english/units.js`: 📖 Text (a story with
the words highlighted), 🃏 Words (reveal cards + the user's own sentence),
🔁 Review (Leitner boxes in localStorage), ✍️ Gaps (fill-the-blank with 4
options from the same section). One new unit in `UNITS` = all four modes
work for it automatically.

The user pastes word lists from a course book, one «Section N» at a time,
often with odd casing / spacing and curly apostrophes — keep the key `k`
EXACTLY as pasted (trimmed), because that is what the user sees in the
course and recognises; put the dictionary form in `w`.

## Unit

```js
{
  id: "s5",
  title: "Section 5 · <тема по-русски>", title_en: "Section 5 · <theme>",
  theme: "какой текст и регистр", theme_en: "...",
  story: "An ORIGINAL 120–180-word text that uses EVERY word: [[k]] or [[k|Display]] …",
  words: [ /* see below */ ],
}
```

The story is the heart of the «interesting» part: write it yourself as a
coherent mini-narrative in the register of the source text (biography →
journalistic; interview → spoken; holidays → informal), never copy the
course text. Every word key appears once as `[[k]]`; when the pasted key has
the wrong case for its position in the sentence, use `[[k|display form]]`.

## Word card

```js
{
  k: "had hoped",                    // exactly as in the user's list
  w: "had hoped (to)",               // dictionary / pattern form
  form: "grammar: past perfect",     // part of speech, or "idiom", "phrasal verb", "grammar: …"
  ipa: "/…/",                        // "" for phrases and grammar patterns
  ru: "надеялся… но не вышло",       // short, captures the nuance, not just a translation
  def: "past perfect of hope: a hope that was NOT fulfilled",   // plain English, learner-dictionary style
  reg: "neutral",                    // formal · neutral · informal · slang · spoken · BrE · AmE (combine with " · ")
  ex: ["…", "…"],                    // 2 natural sentences; the first may echo the course context
  use: "Где и как: collocations, prepositions (cope WITH), register; + Ловушка: the typical mistake of a Russian speaker or a false friend",
  use_en: "the same in English",
  gap: { s: "We ___ to arrive before dark, but the train was delayed.", a: "had hoped" },
}
```

What makes a card worth reading (the user's goal is «как и где правильно
использовать»): a fixed preposition or pattern, the register and BrE/AmE
split, the nearest confusable word (renowned/notorious, occasion/opportunity,
hang around/hang out), and a concrete «don't say» example. The `gap`
sentence must be solvable from meaning alone and must not appear verbatim
in `ex` (otherwise it tests memory of the card, not the word). The answer
`a` is the inflected form that fits the blank; distractors are taken
automatically from other words' `gap.a` in the same unit, so keep answers
lexically distinct (not two cards both answering «up»).

## Check

```bash
cd react-interview && npm test -- english   # data guard + render smoke test
npm run build
```

The guard (`src/__tests__/english.test.jsx`) fails on: a missing field, a
`[[marker]]` that matches no `k`, a word absent from the story, a gap
sentence without exactly one `___`, fewer than 4 distinct answers per unit.
Update the page title in `App.jsx` («Sections 2–4» → the new range).
