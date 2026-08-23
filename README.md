# Подготовка к собеседованию

Структура повторяет чек-лист собеседования (temp.xlsx).

## js-core/ — секция «JS Core»
- `call-bind-apply.js` — 8 задачек по this/call/bind/apply (запуск: `node js-core/call-bind-apply.js`)
- `event-loop.js` — задачка «что за чем выведется»: микро- vs макротаски

## react-notes/ — конспекты по секции «React»
- `prop-drilling.jsx` — prop drilling и 3 решения (composition / context / стор)

## react-interview/ — собес-тренажёр (все секции чек-листа)
Vite-проект: `cd react-interview && npm run dev` → http://localhost:5173
Секции: JS Core (16), React (15), Redux (5), React Native (5), GraphQL (4),
TypeScript (5), EnginX (8: SDLC, testing pyramid, static analysis, branching,
patterns, antipatterns, CI/CD, OWASP) — формат «вопрос → эталонный ответ
(RU/EN) → разбор → ловушки».
Плюс: квиз (выбор тем чекбоксами, 10/20/50, без повторов), why-did-you-render,
snapshot-тесты (`npm test`).

## live-coding/ — секция «Live coding»
- `reverse-string.js` — reverse string (+ знать варианты: reverse/join, recursion, reduce)

Чек-лист покрыт полностью: JS Core, React, Redux, React Native, GraphQL, TypeScript.
