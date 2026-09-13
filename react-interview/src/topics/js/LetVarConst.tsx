import { Demo } from "./JsDemo";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks";

export default function LetVarConst() {
  return (
    <>
      {/* 1. ВОПРОС */}
      <InterviewQuestion en="What's the difference between var, let and const? Which one should you use and why?">
        В чём разница между var, let и const? Что использовать и почему?
      </InterviewQuestion>

      {/* 2. ЭТАЛОННЫЙ ОТВЕТ */}
      <ModelAnswer
        en={
          <>
            "Three differences. <b>Scope</b>: var is function-scoped, let and
            const are block-scoped. <b>Hoisting</b>: var is hoisted and
            initialized with undefined, let/const are also hoisted but stay in
            the TDZ until their declaration line — accessing them throws a
            ReferenceError. <b>Reassignment</b>: var can even be redeclared,
            let can be reassigned, const can't be reassigned — but the contents
            of an object or array CAN be mutated, because it's the reference
            that is constant. In modern code: const by default, let when I need
            reassignment, and never var — that eliminates a whole class of bugs
            like variables leaking out of blocks and the shared loop variable
            in closures."
          </>
        }
      >
        «Три отличия. <b>Область видимости</b>: var — функциональная, let и
        const — блочная. <b>Hoisting</b>: var всплывает со значением undefined,
        let/const тоже всплывают, но до строки объявления лежат в TDZ —
        обращение даёт ReferenceError. <b>Переприсваивание</b>: var можно даже
        переобъявлять, let — переприсваивать, const — нельзя переприсвоить
        ссылку, но содержимое объекта или массива мутировать можно, потому что
        константна именно ссылка. В новом коде: const по умолчанию, let — когда
        нужно переприсваивать, var — не использую; это убирает целый класс багов
        вроде утечки переменной из блока и общей переменной цикла в замыканиях.»
      </ModelAnswer>

      {/* 3. РАЗБОР С ПРИМЕРАМИ */}
      <SectionTitle>Разбор с примерами</SectionTitle>

      <Demo
        title="Классика: var vs let в цикле с setTimeout"
        code={`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i));
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j));
}`}
        run={(log) => {
          for (var i = 0; i < 3; i++) setTimeout(() => log("var:", i));
          for (let j = 0; j < 3; j++) setTimeout(() => log("let:", j));
        }}
        hint="var — ОДНА переменная на весь цикл (function scope): к моменту срабатывания таймеров i уже 3. let — НОВАЯ переменная на каждую итерацию (block scope), каждое замыкание помнит свою."
        en={{
          title: "Classic: var vs let in a loop with setTimeout",
          code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i));
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j));
}`,
          hint: "var is ONE variable for the whole loop (function scope): by the time the timers fire, i is already 3. let creates a NEW variable on every iteration (block scope), so each closure remembers its own.",
        }}
      />

      <Demo
        title="const: нельзя переприсвоить, но можно мутировать"
        code={`const arr = [1, 2];
arr.push(3);        // ок! константна ССЫЛКА, не содержимое
console.log(arr);
arr = [9];          // TypeError: Assignment to constant variable`}
        run={(log) => {
          const arr = [1, 2];
          arr.push(3);
          log(arr);
          new Function("const a = 1; a = 2;")(); // воспроизводим TypeError
        }}
        hint="const запрещает менять ссылку (=), но объект/массив по этой ссылке мутировать можно. Полная заморозка — Object.freeze (и то неглубокая)."
        en={{
          title: "const: can't reassign, but can mutate",
          code: `const arr = [1, 2];
arr.push(3);        // fine! it's the REFERENCE that's constant, not the contents
console.log(arr);
arr = [9];           // TypeError: Assignment to constant variable`,
          hint: "const forbids changing the reference (=), but the object/array it points to can still be mutated. Full immutability requires Object.freeze (and even that is shallow).",
        }}
      />

      <Demo
        title="var — function scope, вытекает из блока"
        code={`if (true) {
  var leaked = "я вытек из блока";
  let contained = "я живу в блоке";
}
console.log(leaked);     // работает
console.log(contained);  // ReferenceError`}
        run={(log) => {
          if (true) {
            var leaked = "я вытек из блока";
            let contained = "я живу в блоке";
          }
          log(leaked);
          new Function("if (true) { let c = 1; } return c;")(); // ReferenceError
        }}
        hint="Блок {} для var — не граница, граница только функция. let/const живут строго в своём блоке."
        en={{
          title: "var is function-scoped — it leaks out of a block",
          code: `if (true) {
  var leaked = "I leaked out of the block";
  let contained = "I live inside the block";
}
console.log(leaked);     // works
console.log(contained);  // ReferenceError`,
          hint: "A {} block is not a boundary for var — only a function is. let/const live strictly within their own block.",
        }}
      />

      {/* 4. ЛОВУШКИ */}
      <Gotchas
        items={[
          {
            title: "«А что выведет?» — цикл var + setTimeout",
            code: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
// 3 3 3, а не 0 1 2`,
            text: "Самая частая проверка. Бонус: назвать ДВА фикса — заменить на let, или замкнуть значение через IIFE / третий аргумент setTimeout(fn, 0, i).",
            en: {
              title: "\"What does this log?\" — a var loop + setTimeout",
              code: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
// 3 3 3, not 0 1 2`,
              text: "The most common check. Bonus points: name TWO fixes — switch to let, or capture the value via an IIFE / the third argument of setTimeout(fn, 0, i).",
            },
          },
          {
            title: "«const же константа?» — мутация содержимого",
            code: `const user = { name: "A" };
user.name = "B";   // работает!
user = {};         // TypeError`,
            text: "Ловят на словах «const нельзя изменить». Правильно: нельзя переприсвоить ССЫЛКУ. Если скажешь «const делает объект неизменяемым» — минус балл.",
            en: {
              title: "\"Isn't const supposed to be constant?\" — mutating the contents",
              code: `const user = { name: "A" };
user.name = "B";   // works!
user = {};          // TypeError`,
              text: "A trap around the phrase \"const can't be changed\". The correct answer: you can't reassign the REFERENCE. Saying \"const makes the object immutable\" costs you points.",
            },
          },
          {
            title: "«Что будет?» — обращение до объявления",
            code: `console.log(a); // undefined  (var всплыл)
console.log(b); // ReferenceError (let в TDZ)
var a = 1;
let b = 2;`,
            text: "Проверяют, знаешь ли ты, что let ТОЖЕ всплывает — просто в TDZ. Ответ «let не всплывает» формально неверен.",
            en: {
              title: "\"What happens here?\" — accessing before the declaration",
              code: `console.log(a); // undefined  (var was hoisted)
console.log(b); // ReferenceError (let is in the TDZ)
var a = 1;
let b = 2;`,
              text: "This checks whether you know that let is ALSO hoisted — it just stays in the TDZ. Saying \"let isn't hoisted\" is technically wrong.",
            },
          },
          {
            title: "Переобъявление в одном скоупе",
            code: `var x = 1; var x = 2;  // ок
let y = 1; let y = 2;  // SyntaxError`,
            text: "var молча переобъявляется (источник багов в больших файлах), let/const — синтаксическая ошибка ещё до выполнения.",
            en: {
              title: "Redeclaring in the same scope",
              code: `var x = 1; var x = 2;  // fine
let y = 1; let y = 2;  // SyntaxError`,
              text: "var silently allows redeclaration (a source of bugs in large files); let/const throw a syntax error before the code even runs.",
            },
          },
          {
            title: "var в браузере попадает в window",
            code: `var a = 1;  // window.a === 1 (в скрипте, не в модуле)
let b = 2;  // window.b === undefined`,
            text: "Глобальный var создаёт свойство глобального объекта, let/const — нет. В ES-модулях top-level var в window уже не попадает.",
            en: {
              title: "In the browser, var ends up on window",
              code: `var a = 1;  // window.a === 1 (in a classic script, not a module)
let b = 2;  // window.b === undefined`,
              text: "A global var creates a property on the global object; let/const don't. In ES modules, top-level var no longer lands on window either.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> const по умолчанию → let по
              необходимости → var никогда. Отличия: скоуп (функция vs блок),
              hoisting (undefined vs TDZ), переприсваивание (свободно vs
              нельзя ссылку).
            </>
          }
          en={
            <>
              <b>One-line summary:</b> const by default → let when needed →
              var never. Differences: scope (function vs block), hoisting
              (undefined vs TDZ), reassignment (free vs reference locked).
            </>
          }
        />
      </div>
    </>
  );
}
