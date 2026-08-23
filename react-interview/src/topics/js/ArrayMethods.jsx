import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
  CodeBlock,
} from "../InterviewBlocks.jsx";

export default function ArrayMethods() {
  return (
    <>
      <InterviewQuestion en="Which array methods do you know? Which ones mutate and which don't?">
        Какие методы массивов знаешь? Какие мутируют, а какие нет?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "I group them. <b>Mutating</b>: push/pop, shift/unshift, splice,
            sort, reverse, fill — they change the original array.
            <b> Returning a new array</b>: map, filter, slice, concat, flat,
            flatMap, and the ES2023 toSorted/toReversed/toSpliced — immutable
            counterparts. <b>Search and checks</b>: find/findIndex take a
            predicate, includes/indexOf take a value, some/every.
            <b> Folding</b> — reduce, which can express anything: groupBy,
            counters, pipelines. forEach just iterates and returns nothing.
            Known traps: sort without a comparator sorts as strings, reduce
            without an initial value throws on an empty array, indexOf can't
            find NaN (includes can). In React I only use non-mutating methods —
            or copy before sort — because mutation keeps the same reference
            and won't trigger a render."
          </>
        }
      >
        «Делю на группы. <b>Мутирующие</b>: push/pop, shift/unshift, splice,
        sort, reverse, fill — меняют исходный массив.
        <b> Возвращающие новый</b>: map, filter, slice, concat, flat, flatMap
        и новые ES2023 toSorted/toReversed/toSpliced — иммутабельные версии.
        <b> Поиск и проверки</b>: find/findIndex по предикату, includes/indexOf
        по значению, some/every. <b>Свёртка</b> — reduce, им можно выразить
        что угодно: groupBy, счётчики, конвейеры. forEach — просто итерация,
        ничего не возвращает. Знаю ловушки: sort без компаратора сортирует как
        строки, reduce без initialValue падает на пустом массиве, indexOf не
        находит NaN (includes находит). В React использую только немутирующие
        методы — или копию перед sort, потому что мутация не меняет ссылку и
        не триггерит рендер.»
      </ModelAnswer>

      <div className="card">
        <h3><L ru="📚 Справочник: методы Array" en="📚 Reference: Array methods" /></h3>
        <CodeBlock
          ru={`── МУТИРУЮТ исходный массив ──
push(x) / pop()          // конец: добавить / забрать
unshift(x) / shift()     // начало: добавить / забрать
splice(i, n, ...items)   // вырезать/вставить в любом месте
sort(cmp)  reverse()     // сортировка / разворот НА МЕСТЕ
fill(v, from, to)        // заполнить значением
copyWithin(...)          // копировать кусок внутри себя

── НЕ мутируют (возвращают новое) ──
map(fn)                  // трансформация 1:1
filter(fn)               // отбор по предикату
slice(from, to)          // вырезать копию куска
concat(arr2)             // склейка → новый массив
flat(depth)  flatMap(fn) // разглаживание вложенности
toSorted / toReversed / toSpliced / with(i, v)   // ES2023: иммутабельные версии

── Поиск / проверки (не мутируют) ──
find(fn) / findIndex(fn) / findLast(fn) / findLastIndex(fn)
includes(v) / indexOf(v) / lastIndexOf(v)
some(fn)   // хоть один?     every(fn)  // все?
at(-1)     // элемент с конца

── Свёртка / итерация ──
reduce(fn, init) / reduceRight
forEach(fn)              // просто итерация, возвращает undefined
join(sep)                // → строка
keys() / values() / entries()  // итераторы

── Статические ──
Array.isArray(x)         // проверка «это массив?» (typeof даст "object")
Array.from(iterable, fn) // из строки/Set/NodeList (+map)
Array.of(1, 2, 3)        // [1,2,3]`}
          en={`── MUTATE the original array ──
push(x) / pop()          // end: add / remove
unshift(x) / shift()     // start: add / remove
splice(i, n, ...items)   // cut/insert anywhere
sort(cmp)  reverse()     // sort / reverse IN PLACE
fill(v, from, to)        // fill with a value
copyWithin(...)          // copy a chunk within itself

── DON'T mutate (return something new) ──
map(fn)                  // 1:1 transformation
filter(fn)               // select by predicate
slice(from, to)          // cut out a copy of a chunk
concat(arr2)             // join → new array
flat(depth)  flatMap(fn) // flatten nesting
toSorted / toReversed / toSpliced / with(i, v)   // ES2023: immutable versions

── Search / checks (don't mutate) ──
find(fn) / findIndex(fn) / findLast(fn) / findLastIndex(fn)
includes(v) / indexOf(v) / lastIndexOf(v)
some(fn)   // at least one?     every(fn)  // all of them?
at(-1)     // element from the end

── Folding / iteration ──
reduce(fn, init) / reduceRight
forEach(fn)              // just iterates, returns undefined
join(sep)                // → string
keys() / values() / entries()  // iterators

── Static ──
Array.isArray(x)         // "is this an array?" check (typeof gives "object")
Array.from(iterable, fn) // from a string/Set/NodeList (+map)
Array.of(1, 2, 3)        // [1,2,3]`}
        />
        <p className="hint">
          <L
            ru="Мнемоника для мутирующих: всё, что «двигает» массив (push/pop/shift/unshift/splice) + sort/reverse/fill."
            en={'Mnemonic for the mutating ones: anything that "moves" the array (push/pop/shift/unshift/splice) + sort/reverse/fill.'}
          />
        </p>
      </div>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Ловушка №1: sort() без компаратора"
        code={`console.log([1, 10, 2, 21, 3].sort());        // сортирует КАК СТРОКИ!
console.log([1, 10, 2, 21, 3].sort((a, b) => a - b)); // правильно

const arr = [3, 1, 2];
arr.sort();                     // sort МУТИРУЕТ исходный массив
console.log(arr);
console.log([3, 1, 2].toSorted()); // ES2023: копия, без мутации`}
        run={(log) => {
          log([1, 10, 2, 21, 3].sort());
          log([1, 10, 2, 21, 3].sort((a, b) => a - b));
          const arr = [3, 1, 2];
          arr.sort();
          log(arr);
          log([3, 1, 2].toSorted());
        }}
        hint="Без компаратора элементы приводятся к строкам: '10' < '2'. И sort/reverse/splice мутируют — в React это ломает state. Новые toSorted/toReversed/toSpliced возвращают копию."
        en={{
          title: "Trap #1: sort() without a comparator",
          code: `console.log([1, 10, 2, 21, 3].sort());        // sorts AS STRINGS!
console.log([1, 10, 2, 21, 3].sort((a, b) => a - b)); // correct

const arr = [3, 1, 2];
arr.sort();                     // sort MUTATES the original array
console.log(arr);
console.log([3, 1, 2].toSorted()); // ES2023: a copy, no mutation`,
          hint: "Without a comparator, elements are coerced to strings: '10' < '2'. And sort/reverse/splice mutate — in React that breaks state. The new toSorted/toReversed/toSpliced return a copy instead.",
        }}
      />

      <Demo
        title="map / filter / reduce — большая тройка"
        code={`const nums = [1, 2, 3, 4, 5];

console.log(nums.map(n => n * 2));        // трансформация 1:1
console.log(nums.filter(n => n % 2));     // отбор
console.log(nums.reduce((sum, n) => sum + n, 0)); // свёртка в одно значение

// reduce умеет всё: groupBy
const words = ["apple", "banana", "avocado", "cherry"];
const byLetter = words.reduce((acc, w) => {
  (acc[w[0]] ??= []).push(w);
  return acc;
}, {});
console.log(byLetter);`}
        run={(log) => {
          const nums = [1, 2, 3, 4, 5];
          log(nums.map((n) => n * 2));
          log(nums.filter((n) => n % 2));
          log(nums.reduce((sum, n) => sum + n, 0));
          const words = ["apple", "banana", "avocado", "cherry"];
          const byLetter = words.reduce((acc, w) => {
            (acc[w[0]] ??= []).push(w);
            return acc;
          }, {});
          log(byLetter);
        }}
        hint="reduce без initialValue берёт первый элемент как старт (и ПАДАЕТ на пустом массиве) — всегда передавай initialValue."
        en={{
          title: "map / filter / reduce — the big three",
          code: `const nums = [1, 2, 3, 4, 5];

console.log(nums.map(n => n * 2));        // 1:1 transformation
console.log(nums.filter(n => n % 2));     // selection
console.log(nums.reduce((sum, n) => sum + n, 0)); // fold into a single value

// reduce can express anything: groupBy
const words = ["apple", "banana", "avocado", "cherry"];
const byLetter = words.reduce((acc, w) => {
  (acc[w[0]] ??= []).push(w);
  return acc;
}, {});
console.log(byLetter);`,
          hint: "reduce without an initialValue takes the first element as the start (and THROWS on an empty array) — always pass an initialValue.",
        }}
      />

      <Demo
        title="Поиск и проверки"
        code={`const users = [{ id: 1, name: "A" }, { id: 2, name: "B" }];

console.log(users.find(u => u.id === 2));      // элемент или undefined
console.log(users.findIndex(u => u.id === 2)); // индекс или -1
console.log(users.some(u => u.id > 1));        // хоть один?
console.log(users.every(u => u.id > 0));       // все?
console.log([1, 2, NaN].includes(NaN));        // true (indexOf NaN не найдёт!)`}
        run={(log) => {
          const users = [
            { id: 1, name: "A" },
            { id: 2, name: "B" },
          ];
          log(users.find((u) => u.id === 2));
          log(users.findIndex((u) => u.id === 2));
          log(users.some((u) => u.id > 1));
          log(users.every((u) => u.id > 0));
          log([1, 2, NaN].includes(NaN));
        }}
        hint="find/some/every принимают предикат, includes/indexOf — значение (по ===, кроме NaN у includes)."
        en={{
          title: "Search and checks",
          code: `const users = [{ id: 1, name: "A" }, { id: 2, name: "B" }];

console.log(users.find(u => u.id === 2));      // element or undefined
console.log(users.findIndex(u => u.id === 2)); // index or -1
console.log(users.some(u => u.id > 1));        // at least one?
console.log(users.every(u => u.id > 0));       // all of them?
console.log([1, 2, NaN].includes(NaN));        // true (indexOf can't find NaN!)`,
          hint: "find/some/every take a predicate, includes/indexOf take a value (compared with ===, except includes handles NaN).",
        }}
      />

      <Demo
        title="Идиомы: dedupe, flat, chaining"
        code={`console.log([...new Set([1, 2, 2, 3, 1])]);   // дедупликация
console.log([1, [2, [3, [4]]]].flat(Infinity)); // разглаживание
console.log([1, 2, 3].flatMap(n => [n, n]));    // map + flat(1)

// цепочки: топ-2 чётных квадрата
console.log(
  [5, 2, 8, 1, 4]
    .filter(n => n % 2 === 0)
    .map(n => n * n)
    .sort((a, b) => b - a)
    .slice(0, 2)
);`}
        run={(log) => {
          log([...new Set([1, 2, 2, 3, 1])]);
          log([1, [2, [3, [4]]]].flat(Infinity));
          log([1, 2, 3].flatMap((n) => [n, n]));
          log(
            [5, 2, 8, 1, 4]
              .filter((n) => n % 2 === 0)
              .map((n) => n * n)
              .sort((a, b) => b - a)
              .slice(0, 2)
          );
        }}
        hint="Set хранит уникальные значения — спред обратно в массив. Эти идиомы постоянно просят на live coding."
        en={{
          title: "Idioms: dedupe, flat, chaining",
          code: `console.log([...new Set([1, 2, 2, 3, 1])]);   // deduplication
console.log([1, [2, [3, [4]]]].flat(Infinity)); // flattening
console.log([1, 2, 3].flatMap(n => [n, n]));    // map + flat(1)

// chaining: top 2 even squares
console.log(
  [5, 2, 8, 1, 4]
    .filter(n => n % 2 === 0)
    .map(n => n * n)
    .sort((a, b) => b - a)
    .slice(0, 2)
);`,
          hint: "Set stores unique values — spread it back into an array. These idioms come up constantly in live coding.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Отсортируй числа» — sort без компаратора",
            code: `[1, 10, 2].sort();            // [1, 10, 2] — как строки!
[1, 10, 2].sort((a, b) => a - b); // [1, 2, 10]`,
            text: "Ловушка №1. Бонус: sort мутирует — в React нужен [...arr].sort() или toSorted().",
            en: {
              title: "\"Sort the numbers\" — sort without a comparator",
              code: `[1, 10, 2].sort();            // [1, 10, 2] — as strings!
[1, 10, 2].sort((a, b) => a - b); // [1, 2, 10]`,
              text: "Trap #1. Bonus: sort mutates — in React you need [...arr].sort() or toSorted().",
            },
          },
          {
            title: "«map или forEach?»",
            code: `const r1 = arr.forEach(x => x * 2); // undefined!
const r2 = arr.map(x => x * 2);     // новый массив`,
            text: "forEach ничего не возвращает — использовать его результат нельзя. map — когда нужен результат, forEach — только для сайд-эффектов.",
            en: {
              title: "\"map or forEach?\"",
              code: `const r1 = arr.forEach(x => x * 2); // undefined!
const r2 = arr.map(x => x * 2);     // a new array`,
              text: "forEach returns nothing — you can't use its result. Use map when you need a result, forEach only for side effects.",
            },
          },
          {
            title: "delete против splice",
            code: `const a = [1, 2, 3];
delete a[1];      // [1, empty, 3] — ДЫРА, length всё ещё 3!
a.splice(1, 1);   // правильно: [1, 3]`,
            text: "delete оставляет дыру (sparse array), map/forEach дыры пропускают — источник странных багов.",
            en: {
              title: "delete vs splice",
              code: `const a = [1, 2, 3];
delete a[1];      // [1, empty, 3] — a HOLE, length is still 3!
a.splice(1, 1);   // correct: [1, 3]`,
              text: "delete leaves a hole (sparse array), and map/forEach skip holes — a source of strange bugs.",
            },
          },
          {
            title: "«Проверь, что это массив»",
            code: `typeof [];           // "object" — бесполезно
Array.isArray([]);   // true ✅`,
            text: "typeof для массивов не работает. Также [] instanceof Array ломается между iframe/realm — isArray надёжнее.",
            en: {
              title: "\"Check that this is an array\"",
              code: `typeof [];           // "object" — useless
Array.isArray([]);   // true ✅`,
              text: "typeof doesn't work for arrays. Also, [] instanceof Array breaks across iframes/realms — isArray is more reliable.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> мутируют push/pop/shift/unshift/
              splice/sort/reverse/fill, остальные возвращают новое; sort без
              компаратора — строки; reduce всегда с initialValue; в React —
              только немутирующие.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> push/pop/shift/unshift/splice/sort/
              reverse/fill mutate, the rest return something new; sort without
              a comparator treats items as strings; always pass an
              initialValue to reduce; in React, use only non-mutating methods.
            </>
          }
        />
      </div>
    </>
  );
}
