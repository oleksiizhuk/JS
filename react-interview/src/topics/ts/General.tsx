import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function General() {
  return (
    <>
      <InterviewQuestion en="What is TypeScript and what does it give you? Key concepts?">
        Что такое TypeScript и что он даёт? Ключевые концепции?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "TypeScript is a <b>statically typed superset of JS</b> that
            compiles to plain JavaScript — types exist only at compile time
            and are fully <b>erased</b> at runtime. What it buys: whole
            classes of bugs caught before running, refactoring safety,
            self-documenting APIs and IDE autocomplete. Key concepts: the type
            system is <b>structural</b> — compatibility by shape, not by name;
            <b> inference</b> — I don't annotate what TS can derive;
            <b> unions and narrowing</b> — string | number plus type guards
            (typeof, in, discriminated unions); <b>generics</b> for reusable
            typed code; <b>unknown</b> as the safe any — you must narrow
            before use; strict mode, especially strictNullChecks, which makes
            null/undefined explicit. In React: typing props and hooks,
            generics in useState, and events via React.ChangeEvent."
          </>
        }
      >
        «TypeScript — <b>статически типизированное надмножество JS</b>,
        компилируется в чистый JavaScript: типы существуют только на этапе
        компиляции и полностью <b>стираются</b> в рантайме. Что даёт: классы
        багов ловятся до запуска, безопасный рефакторинг,
        само-документируемые API и автокомплит в IDE. Ключевые концепции:
        система типов <b>структурная</b> — совместимость по форме, а не по
        имени; <b>вывод типов</b> — не аннотирую то, что TS выведет сам;
        <b> union-типы и narrowing</b> — string | number плюс type guards
        (typeof, in, discriminated unions); <b>дженерики</b> для
        переиспользуемого типизированного кода; <b>unknown</b> как безопасный
        any — перед использованием обязан сузить; strict mode, особенно
        strictNullChecks, делающий null/undefined явными. В React: типизация
        props и хуков, дженерики в useState, события через React.ChangeEvent.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="База, которую спрашивают" en="The basics they ask about" /></h3>
        <CodeBlock
          ru={`// Вывод типов: аннотации не нужны там, где TS выведет сам
const n = 42;                    // number
const arr = [1, "a"];            // (string | number)[]

// Union + narrowing
function fmt(x: string | number) {
  if (typeof x === "string") return x.toUpperCase(); // тут x: string
  return x.toFixed(2);                               // тут x: number
}

// Discriminated union — идиома для состояний
type State =
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };
// switch по state.status сужает тип автоматически

// Дженерики
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// any vs unknown
let a: any = JSON.parse(s);  a.foo.bar;        // молча упадёт в рантайме
let u: unknown = JSON.parse(s);                // сначала сузь:
if (typeof u === "object" && u !== null) {...}`}
          en={`// Type inference: no annotations needed where TS can figure it out
const n = 42;                    // number
const arr = [1, "a"];            // (string | number)[]

// Union + narrowing
function fmt(x: string | number) {
  if (typeof x === "string") return x.toUpperCase(); // here x: string
  return x.toFixed(2);                               // here x: number
}

// Discriminated union — the idiom for state
type State =
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };
// switch on state.status narrows the type automatically

// Generics
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// any vs unknown
let a: any = JSON.parse(s);  a.foo.bar;        // fails silently at runtime
let u: unknown = JSON.parse(s);                // narrow first:
if (typeof u === "object" && u !== null) {...}`}
        />
      </div>

      <div className="card">
        <h3><L ru="Структурная типизация" en="Structural typing" /></h3>
        <CodeBlock
          ru={`interface Point { x: number; y: number }
const p = { x: 1, y: 2, z: 3 };
const q: Point = p;        // ✅ форма подходит (лишнее поле ок через переменную)
const r: Point = { x: 1, y: 2, z: 3 };  // ❌ literal — excess property check`}
          en={`interface Point { x: number; y: number }
const p = { x: 1, y: 2, z: 3 };
const q: Point = p;        // ✅ shape matches (extra field is fine via a variable)
const r: Point = { x: 1, y: 2, z: 3 };  // ❌ literal — excess property check`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Типы защищают в рантайме?»",
            code: `const user = await res.json() as User;
// ❌ as — это утверждение, НЕ проверка: рантайм не валидирует
// внешние данные валидировать схемой: zod.parse(json)`,
            text: "Главное заблуждение: типы стираются. Границы (API, формы, localStorage) — только рантайм-валидация (zod/yup).",
            en: {
              title: "“Do types protect you at runtime?”",
              code: `const user = await res.json() as User;
// ❌ as is an ASSERTION, not a check: the runtime doesn't validate
// validate external data with a schema: zod.parse(json)`,
              text: "The main misconception: types are erased. At boundaries (API, forms, localStorage) — only runtime validation (zod/yup).",
            },
          },
          {
            title: "any заражает код",
            code: `function f(x: any) { return x.q.w.e; }  // всё легально
// каждый any отключает проверки ниже по цепочке
// нужен «не знаю что» → unknown + narrowing`,
            text: "Ответ «ставлю any, когда сложно» — red flag; правильный эскейп-хетч — unknown.",
            en: {
              title: "any is infectious",
              code: `function f(x: any) { return x.q.w.e; }  // all legal
// every any disables checking further down the chain
// need "I don't know what" → unknown + narrowing`,
              text: "“I reach for any when it gets hard” is a red flag; the right escape hatch is unknown.",
            },
          },
          {
            title: "strictNullChecks",
            code: `const el = document.getElementById("x"); // HTMLElement | null
el.focus();          // ❌ el возможно null
el?.focus();         // ✅ optional chaining или проверка`,
            text: "Без strict это компилируется и падает в рантайме. «Работаю только в strict» — плюс балл.",
            en: {
              title: "strictNullChecks",
              code: `const el = document.getElementById("x"); // HTMLElement | null
el.focus();          // ❌ el might be null
el?.focus();         // ✅ optional chaining or a check`,
              text: "Without strict mode this compiles and blows up at runtime. “I only work in strict mode” earns a bonus point.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="статические типы, стираемые в рантайме; структурная система + inference + narrowing + generics; strict mode; границы валидировать zod-ом."
          en="static types, erased at runtime; structural system + inference + narrowing + generics; strict mode; validate boundaries with zod."
        />
      </div>
    </>
  );
}
