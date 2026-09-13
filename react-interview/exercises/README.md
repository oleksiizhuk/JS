# Упражнения по JS Core

Самостоятельные скрипты из ранних раундов подготовки. Запуск любого файла:

```bash
node exercises/closure/closure.ts        # из react-interview/
```

Node ≥ 22.6 выполняет `.ts` напрямую (type stripping), ничего собирать не нужно.
Файлы намеренно остаются CommonJS (см. `package.json` здесь): задачки на `this`
рассчитаны на sloppy mode, а ESM/strict изменил бы их ответы.
Эти файлы не входят в `tsc --noEmit` приложения — это черновики, а не код сайта.

| Папка | Что внутри |
|---|---|
| `closure/` | замыкания: динамический/лексический scope |
| `context/` | `this`, call/bind/apply (4 файла) |
| `event-loop/` | 6 задач на порядок micro/macrotasks |
| `js-core/` | `call-bind-apply.ts` (8 задач на `this`), `event-loop.ts`, конспект `JS-CORE.md` |
| `leetcode/` | 58, 66, 123, 136, 1480 |
| `live-coding/` | `reverse-string.ts` |
| `map-set-weakmap-weakset/` | по файлу на структуру |
| `promise/` | all / allSettled / any / race / withResolvers, промисификация колбэка |
| `prototype/` | свои `_map` / `_filter` на `Array.prototype`, цепочка прототипов |
| `array/` | numberPairing, MagicSquare |
| `recursion/` | factorial, fibonachi, recursion, deepCopy, deepCopyShallowCopy |
| `misc/` | data, firstLetterUpperCase, linkedList, manticaAndDoubleEqual, TDZ, test, twoSum, use-strict, curry |
| `react-notes/` | `prop-drilling.tsx` — конспект для чтения (prop drilling и 3 решения), импортирует zustand, не запускается |
| `index.html` | legacy-раннер для браузера (раскомментировать нужный script) |
