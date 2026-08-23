import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function Tdz() {
  return (
    <>
      <InterviewQuestion en="What is the Temporal Dead Zone? Why does it exist?">
        Что такое Temporal Dead Zone? Зачем она нужна?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "The TDZ is the period <b>from entering a scope until the
            declaration line</b> of a let/const/class, when the variable is
            already registered but can't be accessed — any access throws a
            <b> ReferenceError</b>, even typeof. That's what separates let from
            var: var silently returns undefined before assignment, let fails
            loudly. And that's the whole point of the TDZ — the
            "used before initialization" bug becomes explicit at runtime
            instead of a silent undefined that surfaces as a bug somewhere
            else. The TDZ also applies to default parameters: they initialize
            left to right, and referencing a not-yet-initialized parameter
            throws too."
          </>
        }
      >
        «TDZ — это период <b>от входа в скоуп до строки объявления</b>
        let/const/class, когда переменная уже зарегистрирована, но обращаться к
        ней нельзя — любое обращение даёт <b>ReferenceError</b>, даже через
        typeof. Это отличает let от var: var до присваивания тихо возвращает
        undefined, а let падает громко. В этом и смысл TDZ — ошибка
        «использовал переменную до инициализации» становится явной на этапе
        выполнения, вместо тихого undefined, который всплывёт багом где-то
        дальше. TDZ действует и в параметрах по умолчанию: они инициализируются
        слева направо, и обращение к ещё не инициализированному параметру —
        тоже ReferenceError.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Обращение к let до объявления — ReferenceError"
        code={`console.log(x); // 💥 ReferenceError (НЕ undefined!)
let x = 5;`}
        run={(log) => {
          log(x); // TDZ
          let x = 5;
        }}
        hint="x уже 'зарегистрирована' в скоупе (поэтому не ищется снаружи), но до строки let x = 5 находится во 'временной мёртвой зоне'."
        en={{
          title: "Accessing let before its declaration — ReferenceError",
          code: `console.log(x); // 💥 ReferenceError (NOT undefined!)
let x = 5;`,
          hint: "x is already 'registered' in the scope (so it isn't looked up outside it), but before the line let x = 5 it sits in the 'temporal dead zone'.",
        }}
      />

      <Demo
        title="typeof в TDZ тоже падает"
        code={`console.log(typeof notDeclared); // "undefined" — ок для НЕсуществующей
console.log(typeof y);           // 💥 ReferenceError — y в TDZ!
let y = 1;`}
        run={(log) => {
          log(typeof notDeclared);
          log(typeof y);
          let y = 1;
        }}
        hint="Парадокс: спросить typeof у вообще не объявленной переменной можно, а у объявленной ниже через let — нельзя. TDZ строже, чем полное отсутствие."
        en={{
          title: "typeof also throws in the TDZ",
          code: `console.log(typeof notDeclared); // "undefined" — fine for a variable that doesn't exist
console.log(typeof y);           // 💥 ReferenceError — y is in the TDZ!
let y = 1;`,
          hint: "A paradox: typeof on a completely undeclared variable is safe, but typeof on one declared below with let is not. The TDZ is stricter than total absence.",
        }}
      />

      <Demo
        title="TDZ ловит реальные баги: параметры по умолчанию"
        code={`function f(a = b, b = 2) { return [a, b]; }
f(); // 💥 ReferenceError: b в TDZ, когда вычисляется a = b`}
        run={(log) => {
          function f(a = b, b = 2) {
            return [a, b];
          }
          log(f());
        }}
        hint="Параметры инициализируются слева направо, каждый — как let. a = b обращается к b, который ещё в TDZ."
        en={{
          title: "The TDZ catches real bugs: default parameters",
          code: `function f(a = b, b = 2) { return [a, b]; }
f(); // 💥 ReferenceError: b is in the TDZ when a = b is evaluated`,
          hint: "Parameters initialize left to right, each one like a let. a = b refers to b, which is still in the TDZ.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«typeof же безопасен?»",
            code: `typeof abc;  // "undefined" — необъявленная, ок
typeof x;    // ReferenceError!
let x;`,
            text: "Единственный случай, где typeof кидает ошибку. Проверяют глубину: TDZ строже, чем полное отсутствие переменной.",
            en: {
              title: "\"Isn't typeof always safe?\"",
              code: `typeof abc;  // "undefined" — undeclared, fine
typeof x;    // ReferenceError!
let x;`,
              text: "The one case where typeof throws. Tests depth of understanding: the TDZ is stricter than a variable not existing at all.",
            },
          },
          {
            title: "TDZ + внешний скоуп",
            code: `const x = 1;
{
  console.log(x); // ReferenceError, не 1!
  const x = 2;
}`,
            text: "Внутренний x затеняет внешний с НАЧАЛА блока (регистрация всплыла), но до строки const он в TDZ. Ответ «выведет 1» — ошибка.",
            en: {
              title: "TDZ + an enclosing scope",
              code: `const x = 1;
{
  console.log(x); // ReferenceError, not 1!
  const x = 2;
}`,
              text: "The inner x shadows the outer one from the START of the block (its registration was hoisted), but before its const line it's in the TDZ. Answering \"it logs 1\" is wrong.",
            },
          },
          {
            title: "Параметры по умолчанию",
            code: `function f(a = b, b = 2) {}
f(); // ReferenceError: b в TDZ`,
            text: "Параметры — как let, инициализируются слева направо. a = b обращается к b, который ещё не инициализирован. f(1) при этом сработает!",
            en: {
              title: "Default parameters",
              code: `function f(a = b, b = 2) {}
f(); // ReferenceError: b is in the TDZ`,
              text: "Parameters behave like let, initializing left to right. a = b refers to b, which isn't initialized yet. Note that f(1) works fine!",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> TDZ — зона от входа в скоуп до
              строки let/const, где обращение (даже typeof) даёт
              ReferenceError; делает баг «использовал до инициализации»
              громким.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> the TDZ is the zone from entering a
              scope to the let/const line, where any access (even typeof)
              throws a ReferenceError; it makes the "used before
              initialization" bug loud instead of silent.
            </>
          }
        />
      </div>
    </>
  );
}
