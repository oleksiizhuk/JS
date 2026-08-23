import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function Iterators() {
  return (
    <>
      <InterviewQuestion en="How does for...of work under the hood? What are generators for?">
        Как работает for...of под капотом? Зачем нужны генераторы?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "for...of works with anything <b>iterable</b> — an object with a
            <b> [Symbol.iterator]</b> method returning an <b>iterator</b>: an
            object with next() that gives {"{ value, done }"}. Arrays, strings,
            Map, Set and NodeList implement it; a plain object doesn't, which is
            exactly why for...of over an object throws while for...in works.
            Implementing the protocol makes my own object work with for...of,
            spread and destructuring for free. <b>Generators</b> —
            function* with yield — are the easy way to write iterators: the
            function <b>pauses</b> at each yield and resumes on the next
            next(), keeping its local state. Practical uses: lazy and infinite
            sequences, id generators, tree traversal without building an
            intermediate array, and — historically — async flows, which is how
            redux-saga works. There are also async generators with for await...
            of for streams and paginated APIs."
          </>
        }
      >
        «for...of работает с любым <b>итерируемым</b> объектом — тем, у кого
        есть метод <b>[Symbol.iterator]</b>, возвращающий <b>итератор</b>:
        объект с next(), выдающим {"{ value, done }"}. Массивы, строки, Map,
        Set и NodeList его реализуют; обычный объект — нет, поэтому for...of по
        объекту падает, а for...in работает. Реализовав протокол, свой объект
        бесплатно получает и for...of, и спред, и деструктуризацию.
        <b> Генераторы</b> — function* с yield — простой способ писать
        итераторы: функция <b>приостанавливается</b> на каждом yield и
        продолжает с этого места на следующем next(), сохраняя локальное
        состояние. Практика: ленивые и бесконечные последовательности,
        генераторы id, обход дерева без промежуточного массива и — исторически —
        асинхронные потоки, на этом построен redux-saga. Есть ещё асинхронные
        генераторы с for await...of — для стримов и постраничных API.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <Demo
        title="Протокол итератора вручную"
        code={`const range = {
  from: 1, to: 4,
  [Symbol.iterator]() {           // делаем объект итерируемым
    let cur = this.from, last = this.to;
    return {
      next: () => cur <= last
        ? { value: cur++, done: false }
        : { value: undefined, done: true },
    };
  },
};

console.log([...range]);          // спред заработал бесплатно
const [first, second] = range;    // и деструктуризация
console.log(first, second);
for (const n of range) console.log("for...of:", n);`}
        run={(log) => {
          const range = {
            from: 1,
            to: 4,
            [Symbol.iterator]() {
              let cur = this.from;
              const last = this.to;
              return {
                next: () =>
                  cur <= last
                    ? { value: cur++, done: false }
                    : { value: undefined, done: true },
              };
            },
          };
          log([...range]);
          const [first, second] = range;
          log(first, second);
          for (const n of range) log("for...of:", n);
        }}
        hint="Один метод — и объект работает во всех местах, где ждут итерируемое: for...of, spread, деструктуризация, Array.from, new Set(...)."
        en={{
          title: "Implementing the iterator protocol by hand",
          code: `const range = {
  from: 1, to: 4,
  [Symbol.iterator]() {           // makes the object iterable
    let cur = this.from, last = this.to;
    return {
      next: () => cur <= last
        ? { value: cur++, done: false }
        : { value: undefined, done: true },
    };
  },
};

console.log([...range]);          // spread works for free
const [first, second] = range;    // and so does destructuring
console.log(first, second);
for (const n of range) console.log("for...of:", n);`,
          hint: "One method, and the object works everywhere an iterable is expected: for...of, spread, destructuring, Array.from, new Set(...).",
        }}
      />

      <Demo
        title="То же самое генератором — в 3 строки"
        code={`function* range(from, to) {
  for (let i = from; i <= to; i++) yield i;   // пауза на каждом yield
}

const it = range(1, 3);
console.log(it.next());     // { value: 1, done: false }
console.log(it.next());
console.log(it.next());
console.log(it.next());     // { value: undefined, done: true }
console.log([...range(1, 5)]);`}
        run={(log) => {
          function* range(from, to) {
            for (let i = from; i <= to; i++) yield i;
          }
          const it = range(1, 3);
          log(it.next());
          log(it.next());
          log(it.next());
          log(it.next());
          log([...range(1, 5)]);
        }}
        hint="Генератор сам себе итератор: возвращает объект с next() и с [Symbol.iterator]. Состояние (i) живёт между вызовами — как в замыкании, но без ручной обвязки."
        en={{
          title: "The same thing with a generator — in 3 lines",
          code: `function* range(from, to) {
  for (let i = from; i <= to; i++) yield i;   // pauses at each yield
}

const it = range(1, 3);
console.log(it.next());     // { value: 1, done: false }
console.log(it.next());
console.log(it.next());
console.log(it.next());     // { value: undefined, done: true }
console.log([...range(1, 5)]);`,
          hint: "A generator is its own iterator: it returns an object with next() and [Symbol.iterator]. Its state (i) persists between calls — like a closure, but without hand-written plumbing.",
        }}
      />

      <Demo
        title="Ленивость: бесконечная последовательность"
        code={`function* naturals() {
  let n = 1;
  while (true) yield n++;      // бесконечно — но НЕ зависает
}
function* take(it, count) {
  for (const v of it) {
    if (count-- <= 0) return;
    yield v;
  }
}
console.log([...take(naturals(), 5)]);
// значения вычисляются ПО ЗАПРОСУ: массив на бесконечность не строится`}
        run={(log) => {
          function* naturals() {
            let n = 1;
            while (true) yield n++;
          }
          function* take(it, count) {
            for (const v of it) {
              if (count-- <= 0) return;
              yield v;
            }
          }
          log([...take(naturals(), 5)]);
        }}
        hint="Главное свойство генераторов — ленивость: следующее значение считается только когда его попросили. Так делают пайплайны обработки без промежуточных массивов."
        en={{
          title: "Laziness: an infinite sequence",
          code: `function* naturals() {
  let n = 1;
  while (true) yield n++;      // infinite — but does NOT hang
}
function* take(it, count) {
  for (const v of it) {
    if (count-- <= 0) return;
    yield v;
  }
}
console.log([...take(naturals(), 5)]);
// values are computed ON DEMAND: no infinite array gets built`,
          hint: "The key property of generators is laziness: the next value is only computed once it's requested. That's how processing pipelines avoid intermediate arrays.",
        }}
      />

      <Demo
        title="Обход дерева через yield* (делегирование)"
        code={`const tree = { v: 1, kids: [{ v: 2, kids: [{ v: 4, kids: [] }] }, { v: 3, kids: [] }] };

function* walk(node) {
  yield node.v;
  for (const kid of node.kids) yield* walk(kid);   // делегируем вложенному
}
console.log([...walk(tree)]);`}
        run={(log) => {
          const tree = {
            v: 1,
            kids: [{ v: 2, kids: [{ v: 4, kids: [] }] }, { v: 3, kids: [] }],
          };
          function* walk(node) {
            yield node.v;
            for (const kid of node.kids) yield* walk(kid);
          }
          log([...walk(tree)]);
        }}
        hint="yield* передаёт управление другому генератору/итерируемому. Рекурсивный обход без накопления результата в массиве — красивый ответ на live coding «обойди дерево»."
        en={{
          title: "Traversing a tree with yield* (delegation)",
          code: `const tree = { v: 1, kids: [{ v: 2, kids: [{ v: 4, kids: [] }] }, { v: 3, kids: [] }] };

function* walk(node) {
  yield node.v;
  for (const kid of node.kids) yield* walk(kid);   // delegates to the nested one
}
console.log([...walk(tree)]);`,
          hint: "yield* hands control to another generator/iterable. Recursive traversal without accumulating a result array — an elegant answer to the live-coding classic \"traverse a tree\".",
        }}
      />

      <Gotchas
        items={[
          {
            title: "for...of по обычному объекту",
            code: `for (const x of { a: 1 }) {}   // TypeError: is not iterable
for (const k in { a: 1 }) {}   // работает: for...in по КЛЮЧАМ
for (const [k, v] of Object.entries(obj)) {}  // правильный способ`,
            text: "for...in — про ключи (и лезет в прототип), for...of — про значения итерируемого. Путать их — классика.",
            en: {
              title: "for...of over a plain object",
              code: `for (const x of { a: 1 }) {}   // TypeError: is not iterable
for (const k in { a: 1 }) {}   // works: for...in walks KEYS
for (const [k, v] of Object.entries(obj)) {}  // the right way`,
              text: "for...in is about keys (and it reaches into the prototype), for...of is about the values of an iterable. Mixing them up is a classic mistake.",
            },
          },
          {
            title: "Итератор одноразовый",
            code: `const it = [1, 2, 3][Symbol.iterator]();
[...it];   // [1, 2, 3]
[...it];   // [] — итератор ИСЧЕРПАН`,
            text: "Массив итерируемый (можно перебирать сколько угодно), а итератор — одноразовый курсор. Та же ловушка с генератором: второй спред даст пустоту.",
            en: {
              title: "An iterator is single-use",
              code: `const it = [1, 2, 3][Symbol.iterator]();
[...it];   // [1, 2, 3]
[...it];   // [] — the iterator is EXHAUSTED`,
              text: "An array is iterable (you can loop over it as many times as you like), but an iterator is a one-shot cursor. The same trap applies to generators: a second spread yields nothing.",
            },
          },
          {
            title: "next() умеет ПРИНИМАТЬ значение",
            code: `function* dialog() {
  const name = yield "Как тебя зовут?";   // придёт из next(...)
  yield "Привет, " + name;
}
const d = dialog();
d.next();          // { value: "Как тебя зовут?" }
d.next("Olex");    // { value: "Привет, Olex" }`,
            text: "Двусторонний канал: yield отдаёт наружу, next(arg) передаёт внутрь. На этом построены саги и старые async-раннеры (co).",
            en: {
              title: "next() can PASS a value in",
              code: `function* dialog() {
  const name = yield "What's your name?";   // arrives from next(...)
  yield "Hello, " + name;
}
const d = dialog();
d.next();          // { value: "What's your name?" }
d.next("Olex");    // { value: "Hello, Olex" }`,
              text: "A two-way channel: yield sends a value out, next(arg) sends one in. This is what sagas and older async runners (co) are built on.",
            },
          },
          {
            title: "async/await и генераторы — родня",
            code: `// до async/await писали так (co, redux-saga):
function* main() { const data = yield fetch(url); }
// async-функция — это генератор + автоматический раннер промисов`,
            text: "Хороший ответ со звёздочкой: async/await — синтаксический сахар над генератором, который приостанавливается на промисах.",
            en: {
              title: "async/await and generators are relatives",
              code: `// before async/await, code looked like this (co, redux-saga):
function* main() { const data = yield fetch(url); }
// an async function is a generator + an automatic promise runner`,
              text: "A great bonus answer: async/await is syntactic sugar over a generator that pauses on promises.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> итерируемое = [Symbol.iterator] →
              итератор с next() → {"{value, done}"}; генератор
              (function*/yield) — простой способ его написать, даёт
              ленивость и паузу с сохранением состояния.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> iterable = [Symbol.iterator] → an
              iterator with next() → {"{value, done}"}; a generator
              (function*/yield) is the easy way to write one, giving you
              laziness and pausing with preserved state.
            </>
          }
        />
      </div>
    </>
  );
}
