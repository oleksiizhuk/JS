import { Demo } from "./JsDemo";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks";

export default function ScopeDemo() {
  return (
    <>
      <InterviewQuestion en="What kinds of scope exist in JS? What is lexical scope?">
        Какие области видимости есть в JS? Что такое лексический скоуп?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Three levels: <b>global</b>, <b>function</b> and <b>block</b>
            scope (for let/const), plus each ES module has its own scope.
            Scope in JS is <b>lexical</b>, i.e. static: where a variable is
            accessible is determined by <b>where the code is written</b>, not
            where it's called from. Variable lookup walks the <b>scope
            chain</b> — inside out, stopping at the first match; inner
            declarations shadow outer ones. Closures are a direct consequence
            of lexical scope: a function permanently keeps access to the
            environment where it was created. Important contrast: <b>this</b>
            works the opposite way — it's determined by the call site, except
            arrow functions, whose this is lexical."
          </>
        }
      >
        «Три уровня: <b>глобальный</b>, <b>функциональный</b> и <b>блочный</b>
        (для let/const), плюс у каждого ES-модуля свой скоуп. Скоуп в JS
        <b> лексический</b>, то есть статический: где переменная доступна,
        определяется <b>местом написания</b> кода, а не местом вызова. Поиск
        переменной идёт по <b>scope chain</b> — изнутри наружу до первого
        совпадения, внутренние объявления затеняют внешние. Прямое следствие
        лексического скоупа — замыкания: функция навсегда сохраняет доступ к
        окружению места, где была создана. Важный контраст: <b>this</b> работает
        наоборот — определяется вызовом, а не местом написания; исключение —
        стрелочные функции, у которых как раз лексический this.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Лексический скоуп: важно ГДЕ создана, а не откуда вызвана"
        code={`const x = "глобальный";

function inner() { console.log(x); }   // создана рядом с x = "глобальный"

function outer() {
  const x = "локальный outer";
  inner();  // что выведет?
}
outer();`}
        run={(log) => {
          const x = "глобальный";
          function inner() {
            log(x);
          }
          function outer() {
            const x = "локальный outer";
            inner();
          }
          outer();
        }}
        hint="«глобальный»! inner ищет x там, где была НАПИСАНА, а не там, откуда вызвана. Это и есть лексический (статический) скоуп."
        en={{
          title: "Lexical scope: WHERE a function is created matters, not where it's called from",
          code: `const x = "global";

function inner() { console.log(x); }   // created next to x = "global"

function outer() {
  const x = "outer's local";
  inner();  // what does this log?
}
outer();`,
          hint: "\"global\"! inner looks up x where it was WRITTEN, not where it was called from. That's exactly what lexical (static) scope means.",
        }}
      />

      <Demo
        title="Scope chain и затенение (shadowing)"
        code={`const v = "уровень 1";
function f() {
  const v = "уровень 2";
  {
    const v = "уровень 3";
    console.log(v);   // ближайший
  }
  console.log(v);
}
f();`}
        run={(log) => {
          const v = "уровень 1";
          function f() {
            const v = "уровень 2";
            {
              const v = "уровень 3";
              log(v);
            }
            log(v);
          }
          f();
        }}
        hint="Поиск идёт изнутри наружу по цепочке скоупов и останавливается на первом совпадении — внутренняя v «затеняет» внешние."
        en={{
          title: "Scope chain and shadowing",
          code: `const v = "level 1";
function f() {
  const v = "level 2";
  {
    const v = "level 3";
    console.log(v);   // the nearest one
  }
  console.log(v);
}
f();`,
          hint: "Lookup goes from inside out along the scope chain and stops at the first match — the inner v \"shadows\" the outer ones.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Функция вызвана в другом месте — какой x увидит?»",
            code: `const x = "глобальный";
function inner() { console.log(x); }
function outer() {
  const x = "локальный";
  inner(); // "глобальный"!
}`,
            text: "Главная проверка на лексический скоуп. inner смотрит туда, где НАПИСАНА. Ответ «локальный» = мышление динамическим скоупом, минус балл.",
            en: {
              title: "\"The function is called elsewhere — which x does it see?\"",
              code: `const x = "global";
function inner() { console.log(x); }
function outer() {
  const x = "local";
  inner(); // "global"!
}`,
              text: "The core check for lexical scope. inner looks up x where it was WRITTEN. Answering \"local\" means you're thinking in dynamic scope — a point off.",
            },
          },
          {
            title: "Присваивание без объявления",
            code: `function f() { leaked = 42; } // без var/let/const!
f();
console.log(leaked); // 42 — создалась ГЛОБАЛЬНАЯ (без strict)`,
            text: "В sloppy mode необъявленное присваивание создаёт глобальную переменную. В strict mode ('use strict' / модули) — ReferenceError. Один из аргументов за модули.",
            en: {
              title: "Assignment without a declaration",
              code: `function f() { leaked = 42; } // no var/let/const!
f();
console.log(leaked); // 42 — a GLOBAL was created (outside strict mode)`,
              text: "In sloppy mode, an undeclared assignment creates a global variable. In strict mode ('use strict' / modules) it throws a ReferenceError — one of the arguments for using modules.",
            },
          },
          {
            title: "Function declaration внутри блока",
            code: `if (true) { function f() {} }
f(); // sloppy mode: работает (Annex B — имя «протекает» в функцию)
     // strict mode / модули: ReferenceError — f живёт только в блоке`,
            text: "Поведение зависит от режима — легаси-совместимость (Annex B). В модулях (весь современный код) — блочная область. Правильный ответ: «объявлять функции в блоке не стоит, используй let f = () => {}».",
            en: {
              title: "A function declaration inside a block",
              code: `if (true) { function f() {} }
f(); // sloppy mode: works (Annex B — the name "leaks" out)
     // strict mode / modules: ReferenceError — f lives only in the block`,
              text: "Behavior depends on the mode — legacy compatibility (Annex B). In modules (all modern code), it's block-scoped. The right answer: \"don't declare functions inside a block, use let f = () => {} instead\".",
            },
          },
          {
            title: "Скоуп vs this",
            code: `const obj = {
  x: 1,
  get() { return x; }   // НЕ this.x!
};
// ReferenceError: x не в scope chain — свойства объекта не скоуп`,
            text: "Тело объекта НЕ создаёт скоуп: к свойствам доступ только через this. Путают тех, кто пришёл из языков с классами.",
            en: {
              title: "Scope vs this",
              code: `const obj = {
  x: 1,
  get() { return x; }   // NOT this.x!
};
// ReferenceError: x is not in the scope chain — object properties aren't scope`,
              text: "An object literal does NOT create a scope: properties are only reachable via this. This trips up people coming from class-based languages.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> скоуп лексический (место
              написания), поиск — по цепочке изнутри наружу; this — наоборот,
              от вызова (кроме стрелок).
            </>
          }
          en={
            <>
              <b>One-line summary:</b> scope is lexical (where it's written),
              lookup follows the chain from inside out; this works the
              opposite way — determined by the call (except arrow functions).
            </>
          }
        />
      </div>
    </>
  );
}
