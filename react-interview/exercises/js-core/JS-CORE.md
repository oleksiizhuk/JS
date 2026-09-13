# JS Core — конспект по чек-листу собеседования

## 1. Let / var / const
- `var` — function scope, всплывает с `undefined`, можно переобъявлять, попадает в `window` (в браузере, не в модулях)
- `let` — block scope, TDZ, нельзя переобъявить в том же скоупе
- `const` — как let + нельзя переприсвоить. НО объект/массив внутри мутировать МОЖНО
  (`const a = []; a.push(1)` — ок; константна ссылка, не содержимое)
- Классика: `for (var i...) setTimeout(() => console.log(i))` → печатает N раз N
  (одна общая i); с `let` — 0,1,2... (своя i на итерацию)

## 2. Hoisting (всплытие)
- Объявления обрабатываются ДО выполнения кода
- `function declaration` — всплывает целиком (можно вызвать до объявления)
- `var` — всплывает только объявление, значение = undefined
- `let/const/class` — всплывают, но в TDZ (обращение = ReferenceError)
- `const f = function() {}` — всплывает как переменная, не как функция

## 3. TDZ (Temporal Dead Zone)
- Зона от начала скоупа до строки объявления let/const
- Обращение в TDZ → ReferenceError (не undefined!)
- `typeof x` в TDZ тоже кидает ошибку (в отличие от вообще необъявленной)
- Зачем: ловит обращение к переменной до инициализации

## 4. Scope (область видимости)
- Global → function → block; лексический (определяется МЕСТОМ написания, не вызова)
- Scope chain: поиск переменной изнутри наружу
- Модули имеют свой scope (не глобальный)
- this — НЕ часть лексического скоупа (определяется вызовом), кроме стрелок

## 5. Closure (замыкание)
- Функция + ссылки на переменные внешнего скоупа, где она была СОЗДАНА
- Живёт после завершения внешней функции
```js
const counter = () => { let n = 0; return () => ++n; };
const inc = counter(); inc(); inc(); // 2 — n живёт в замыкании
```
- Применения: приватные данные, каррирование, once/debounce/throttle, мемоизация
- Ловушка: замыкание держит ССЫЛКУ на переменную, не копию значения

## 6. Destructuring
```js
const { a, b: renamed, c = 10, ...rest } = obj;   // rename, default, rest
const [x, , z] = arr;                              // пропуск элементов
const { data: { user } } = res;                    // вложенное
function f({ id, name = "?" } = {}) {}             // в параметрах + защита от undefined
[a, b] = [b, a];                                   // swap
```

## 7. Functions = first-class citizens
- Функция — значение: кладём в переменную, передаём аргументом, возвращаем
- Отсюда: колбэки, HOF (map/filter/reduce), замыкания, каррирование, композиция
- Declaration vs expression vs arrow:
  - стрелка: нет своего this/arguments, нельзя new, this из места создания
  - declaration всплывает, expression — нет

## 8. Coercion (приведение типов)
- Явное: `Number(x)`, `String(x)`, `Boolean(x)`
- Неявное: `+` с строкой → конкатенация; остальные арифм. → число; `==` приводит типы
- Falsy: `0, "", null, undefined, NaN, false` (и всё! `[]` и `{}` — truthy)
- Знаменитое: `[] + [] = ""`, `[] + {} = "[object Object]"`, `1 + "2" = "12"`,
  `"5" - 1 = 4`, `null == undefined // true`, `NaN === NaN // false`
- Правило: `===` всегда; `==` только как `x == null` (ловит null и undefined разом)

## 9. Objects in JS
- Создание: литерал, `Object.create(proto)`, class/new, фабрика
- Ключи — строки/Symbol; порядок: целые числа по возрастанию, потом строки по вставке
- Копирование: `{...obj}` / `Object.assign` — ПОВЕРХНОСТНЫЕ; глубокое — `structuredClone(obj)`
- Сравнение по ссылке: `{} !== {}`
- Прототипы: поиск свойства по цепочке `__proto__`; `Object.keys` — свои, `for...in` — и унаследованные enumerable
- `Object.freeze` (неглубокий), `Object.entries/fromEntries`, optional chaining `?.`
- Геттеры/сеттеры, дескрипторы (writable/enumerable/configurable)

## 10. Array methods
- Итерация: `forEach` (ничего не возвращает)
- Трансформация: `map`, `filter`, `reduce`, `flat`, `flatMap`
- Поиск: `find`, `findIndex`, `includes`, `indexOf`, `some`, `every`
- МУТИРУЮТ: `push/pop/shift/unshift/splice/sort/reverse/fill`
- НЕ мутируют: `slice/concat/map/filter/toSorted/toReversed/toSpliced` (новые ES2023)
- Ловушки: `sort()` без компаратора сортирует КАК СТРОКИ ([1,10,2]);
  `map` по разреженному массиву пропускает дыры; `reduce` без initialValue падает на []
- Уметь на собесе: переписать цикл через reduce, dedupe через `[...new Set(arr)]`,
  groupBy через reduce

## 11. Event loop
- Стек вызовов + очереди: микротаски (Promise.then, queueMicrotask, await)
  и макротаски (setTimeout, setInterval, I/O, события)
- Порядок: весь синхронный код → ВСЕ микротаски (до пустой очереди) →
  ОДНА макротаска → снова все микротаски → ...
- Микротаска внутри макротаски выполнится сразу после неё, до следующей макротаски
- setTimeout(fn, 0) ≠ сразу; это «после всех микротасок, в порядке FIFO»
- await = скрытый .then: код после await — микротаска
- Задачка с ответом: см. event-loop.ts (1 9 3 6 8 2 4 5 7)

## 12. Bind / call / apply
- Управление this: `f.call(ctx, a, b)` — вызов сразу, аргументы через запятую;
  `f.apply(ctx, [a, b])` — вызов сразу, массивом (Apply=Array, Call=Comma);
  `f.bind(ctx, a)` — НЕ вызывает, возвращает функцию с прибитым this (+ partial application)
- bind нельзя перебить повторным bind/call/apply (только оператор new)
- `bind(ctx)()` = call: вызовется сразу, вернёт результат, а не функцию
- this зависит от ВЫЗОВА: `obj.f()` → obj; `f()` → undefined/global; стрелки this не имеют
- Задачки: см. call-bind-apply.ts
