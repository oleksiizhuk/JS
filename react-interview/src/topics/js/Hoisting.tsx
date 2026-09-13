import { Demo } from "./JsDemo";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks";

export default function Hoisting() {
  return (
    <>
      <InterviewQuestion en="What is hoisting? What gets hoisted and how?">
        Что такое hoisting? Что всплывает и как?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Hoisting means the engine processes <b>declarations</b> before
            executing the code: when a scope is created, all variables and
            functions are registered upfront. But they're hoisted differently:
            a <b>function declaration</b> is hoisted entirely with its body, so
            you can call it before it's declared; <b>var</b> — only the
            declaration, initialized as undefined; <b>let/const/class</b> are
            registered too, but stay in the TDZ until their line — accessing
            them throws a ReferenceError. That's why the same pattern gives
            three different outcomes: the function works, var gives undefined,
            let throws. A function expression is hoisted as a variable, not as
            a function — calling it before the assignment is a TypeError."
          </>
        }
      >
        «Hoisting — это то, что движок обрабатывает <b>объявления</b> до
        выполнения кода: при создании скоупа все переменные и функции
        регистрируются заранее. Но всплывают они по-разному:
        <b> function declaration</b> — целиком, с телом, её можно вызвать до
        объявления; <b>var</b> — только объявление, со значением undefined;
        <b> let/const/class</b> — тоже регистрируются, но до своей строки лежат
        в TDZ, и обращение к ним даёт ReferenceError. Поэтому один и тот же
        код даёт три разных исхода: функция работает, var — undefined, let —
        ошибка. Function expression всплывает как переменная, а не как функция —
        вызов до присваивания это TypeError.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Function declaration всплывает ЦЕЛИКОМ"
        code={`console.log(sum(2, 3)); // 5 — вызов ДО объявления работает!

function sum(a, b) { return a + b; }`}
        run={(log) => {
          log(sum(2, 3));
          function sum(a: number, b: number) {
            return a + b;
          }
        }}
        hint="Объявления функций обрабатываются до выполнения кода — функция доступна с первой строки скоупа."
        en={{
          title: "A function declaration is hoisted ENTIRELY",
          code: `console.log(sum(2, 3)); // 5 — calling it BEFORE the declaration works!

function sum(a, b) { return a + b; }`,
          hint: "Function declarations are processed before the code runs — the function is available from the first line of the scope.",
        }}
      />

      <Demo
        title="var всплывает только ОБЪЯВЛЕНИЕМ (значение — undefined)"
        code={`console.log(x); // undefined (не ошибка!)
var x = 10;
console.log(x); // 10`}
        run={(log) => {
          log(x);
          var x: number | undefined = 10; // до присваивания x === undefined — говорим это и TS
          log(x);
        }}
        hint="Движок видит это как: var x; console.log(x); x = 10; — объявление всплыло, присваивание осталось на месте."
        en={{
          title: "var hoists only the DECLARATION (value stays undefined)",
          code: `console.log(x); // undefined (not an error!)
var x = 10;
console.log(x); // 10`,
          hint: "The engine sees this as: var x; console.log(x); x = 10; — the declaration was hoisted, the assignment stayed in place.",
        }}
      />

      <Demo
        title="Function expression НЕ всплывает как функция"
        code={`console.log(typeof f); // "undefined" — всплыла только var f
f();                    // TypeError: f is not a function

var f = function () {};`}
        run={(log) => {
          // TS не пропускает обращение до присваивания напрямую — через замыкание, runtime тот же
          const probe = () => {
            log(typeof f);
            f(); // TypeError
          };
          probe();
          var f = function () {};
        }}
        hint="Всплывает переменная f (как undefined), а функция присвоится только на своей строке. С const f = ... была бы ReferenceError (TDZ)."
        en={{
          title: "A function expression is NOT hoisted as a function",
          code: `console.log(typeof f); // "undefined" — only var f was hoisted
f();                     // TypeError: f is not a function

var f = function () {};`,
          hint: "Only the variable f is hoisted (as undefined); the function gets assigned only on its own line. With const f = ..., this would be a ReferenceError (TDZ) instead.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Значит, let не всплывает?»",
            code: `let x = "outer";
{
  console.log(x); // ReferenceError, а НЕ "outer"!
  let x = "inner";
}`,
            text: "Ловушка-доказательство: если бы let не всплывал, вывелось бы «outer» из внешнего скоупа. ReferenceError показывает: внутренний x УЖЕ зарегистрирован в блоке — просто в TDZ.",
            en: {
              title: "\"So let isn't hoisted?\"",
              code: `let x = "outer";
{
  console.log(x); // ReferenceError, NOT "outer"!
  let x = "inner";
}`,
              text: "A proof-by-trap: if let weren't hoisted, this would log \"outer\" from the enclosing scope. The ReferenceError shows the inner x is ALREADY registered in the block — it's just in the TDZ.",
            },
          },
          {
            title: "Function declaration vs expression",
            code: `f(); // работает
g(); // TypeError: g is not a function
function f() {}
var g = function () {};`,
            text: "Проверяют, понимаешь ли разницу: declaration всплывает с телом, expression — только var g (undefined). С const g было бы ReferenceError.",
            en: {
              title: "Function declaration vs expression",
              code: `f(); // works
g(); // TypeError: g is not a function
function f() {}
var g = function () {};`,
              text: "Checks whether you understand the difference: a declaration is hoisted with its body, an expression only hoists var g (as undefined). With const g, this would be a ReferenceError.",
            },
          },
          {
            title: "Порядок: функция или var — кто победит?",
            code: `console.log(typeof x); // "function"!
var x = 1;
function x() {}`,
            text: "При конфликте имён function declaration приоритетнее var при всплытии. Редкий, но эффектный вопрос со звёздочкой.",
            en: {
              title: "Order: function or var — who wins?",
              code: `console.log(typeof x); // "function"!
var x = 1;
function x() {}`,
              text: "On a name conflict, a function declaration takes priority over var during hoisting. A rare but striking bonus question.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> всплывают все объявления, но
              по-разному: function — целиком, var — как undefined, let/const —
              в TDZ до своей строки.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> all declarations are hoisted, but
              differently: function — entirely, var — as undefined, let/const
              — into the TDZ until their line.
            </>
          }
        />
      </div>
    </>
  );
}
