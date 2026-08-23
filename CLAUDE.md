# Подготовка к собеседованию (React/JS)

Пользователь готовится к собеседованию по чек-листу из `~/Downloads/temp.xlsx`
(секции: JS Core, React, Redux, Native, GraphQL, TypeScript, Live coding).
Общение — на русском; технические термины — по-английски.

## Структура

- `react-interview/` — Vite + React «собес-тренажёр»: страницы тем с живыми демо,
  квиз (10/20/50 вопросов, банк в `src/quiz/sections/*.js`), live coding
  (`src/livecoding/`: редактор в браузере, код выполняется через new Function,
  тесты в tasks.js; НОВАЯ ЗАДАЧА: решение обязано проходить свои тесты —
  проверка: node-скрипт прогоняет task.solution через task.tests),
  code review тренажёр (`src/codereview/`: задачи с уровнями easy/medium/hard —
  НОВЫЕ задачи класть в `levels/{easy,medium,hard}.js` с полем `level`;
  ПРАВИЛО: `issue.lines` — номера строк в `code` с 1, непомеченные строки
  обязаны быть чистыми — клик по ним = ложная тревога; внутри `code` нельзя
  использовать бэктики и `\${`),
  why-did-you-render. Страница «i18n / i18next» использует НАСТОЯЩИЙ i18next
  (отдельный createInstance только для демо — глобальный RU/EN-тумблер
  тренажёра остаётся самодельным `<L>`, это осознанный trade-off).
  Запуск: `cd react-interview && npm run dev` → http://localhost:5173
  Проверка после изменений: `npm run build && npm test` (vitest + snapshot).
- `js-core/` — задачки-файлы (call-bind-apply, event-loop) + конспект `JS-CORE.md`
- `react-notes/` — конспекты (prop-drilling)
- `live-coding/` — задачи live coding (reverse-string)
- `README.md` — индекс всего

## Скиллы (ОБЯЗАТЕЛЬНО использовать)

- **`/interview-topic`** (`.claude/skills/interview-topic/SKILL.md`) — формат
  страниц тренажёра: вопрос интервьюера → эталонный ответ (двуязычный RU/EN) →
  разбор с демо → «где могут подловить» → red flag → резюме. Вызывать при
  создании или переделке ЛЮБОЙ страницы темы в `react-interview/src/topics/`.
  Образец: `src/topics/js/LetVarConst.jsx`.
- **`/quiz-questions`** (`.claude/skills/quiz-questions/SKILL.md`) — формат и
  правила вопросов квиза ({ t, q, o[4], a, e }; секции JS/React/Redux/Native/
  GraphQL/TS). Вызывать при добавлении вопросов в `src/quiz/questions.js`.

## Правила проекта

- Новые темы регистрировать в `react-interview/src/App.jsx` (SECTIONS),
  порядок секций: JS Core → React → Redux → ... → Тренировка → Разное.
- К новой теме добавлять 2–3 вопроса в `src/quiz/questions.js`
  ({ t, q, o[4], a, e }), сохраняя порядок тем в банке.
- Код примеров всегда показывать НА странице (`pre.code`) — пользователь
  читает с сайта.
- ВЕСЬ контент ДВУЯЗЫЧНЫЙ (тумблер RU/EN переключает всё): страницы — через
  `<L ru en>` / `<CodeBlock ru en>` / en-пропсы Demo/Gotchas (см. скилл
  interview-topic); квиз — поле `en` у каждого вопроса (порядок en.o = o!);
  live coding и code review — en-поля задач/упражнений. Новый контент без
  en-версии не считается готовым. Страж: `src/__tests__/translations.test.js`
  + `npm test` после любых изменений.
- В демо не использовать `eval` — только `new Function("...")()`.
- StrictMode в `main.jsx` выключен намеренно (демо жизненного цикла).
- Формат обучения: сначала пользователь предсказывает ответ, потом проверка
  с разбором ошибок.
