import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function Destructuring() {
  return (
    <>
      <InterviewQuestion en="What is destructuring? What can it do?">
        Что такое деструктуризация? Какие возможности у неё есть?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Destructuring is syntax for extracting values from objects and
            arrays directly into variables. It supports <b>renaming</b>
            ({"{ name: userName }"}), <b>defaults</b> (they only kick in on
            undefined, not on null), <b>rest</b> to collect the remainder,
            <b> nested</b> paths, and destructuring <b>in function
            parameters</b> — the standard "named arguments" pattern with the
            = {"{}"} guard against calling with no argument. For arrays:
            skipping elements and swapping without a temp variable. In React
            it's everywhere: props in the component signature, and
            [state, setState] from useState — an array precisely so you can
            name the variables whatever you want."
          </>
        }
      >
        «Деструктуризация — синтаксис извлечения значений из объектов и массивов
        сразу в переменные. Умеет: <b>переименование</b> ({"{ name: userName }"}),
        <b> значения по умолчанию</b> (срабатывают только на undefined, не на
        null), <b>rest</b> для сбора остатка, <b>вложенные</b> пути и
        деструктуризацию <b>в параметрах функций</b> — это стандартный паттерн
        «именованных аргументов» с защитой = {"{}"} от вызова без аргумента.
        Для массивов — пропуск элементов и swap без временной переменной.
        В React это повсюду: props в сигнатуре компонента, [state, setState] из
        useState — массив именно для того, чтобы называть переменные как угодно.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Объекты: rename, default, rest"
        code={`const user = { id: 7, name: "Olex", role: "dev" };

const { name: userName, age = 18, ...rest } = user;
console.log(userName); // rename: name → userName
console.log(age);      // default: age нет в объекте
console.log(rest);     // всё остальное`}
        run={(log) => {
          const user = { id: 7, name: "Olex", role: "dev" };
          const { name: userName, age = 18, ...rest } = user;
          log(userName);
          log(age);
          log(rest);
        }}
        hint="Запись { name: userName } читается «возьми свойство name, положи в переменную userName». Default срабатывает только на undefined (на null — нет!)."
        en={{
          title: "Objects: rename, default, rest",
          code: `const user = { id: 7, name: "Olex", role: "dev" };

const { name: userName, age = 18, ...rest } = user;
console.log(userName); // rename: name → userName
console.log(age);      // default: age isn't in the object
console.log(rest);     // everything else`,
          hint: "The notation { name: userName } reads as \"take property name, put it in variable userName\". A default only kicks in on undefined (not on null!).",
        }}
      />

      <Demo
        title="Массивы: пропуски, swap, вложенность"
        code={`const [first, , third] = ["a", "b", "c"];
console.log(first, third);

let x = 1, y = 2;
[x, y] = [y, x];               // swap без временной переменной
console.log(x, y);

const { data: { user: { name } } } = { data: { user: { name: "Olex" } } };
console.log(name);             // достали с глубины (data и user НЕ создались!)`}
        run={(log) => {
          const [first, , third] = ["a", "b", "c"];
          log(first, third);
          let x = 1,
            y = 2;
          [x, y] = [y, x];
          log(x, y);
          const {
            data: {
              user: { name },
            },
          } = { data: { user: { name: "Olex" } } };
          log(name);
        }}
        hint="При вложенной деструктуризации промежуточные имена (data, user) — только путь, переменных не создают. Опасность: если data undefined — TypeError."
        en={{
          title: "Arrays: skipping, swap, nesting",
          code: `const [first, , third] = ["a", "b", "c"];
console.log(first, third);

let x = 1, y = 2;
[x, y] = [y, x];               // swap without a temp variable
console.log(x, y);

const { data: { user: { name } } } = { data: { user: { name: "Olex" } } };
console.log(name);             // pulled from deep down (data and user are NOT created!)`,
          hint: "With nested destructuring, the intermediate names (data, user) are just a path — they don't create variables. Danger: if data is undefined, this throws a TypeError.",
        }}
      />

      <Demo
        title="В параметрах функции + защита от undefined"
        code={`function greet({ name, lang = "ru" } = {}) {
  return \`[\${lang}] Привет, \${name}\`;
}
console.log(greet({ name: "Olex" }));
console.log(greet());   // не упало! спасло = {}`}
        run={(log) => {
          function greet({ name, lang = "ru" } = {}) {
            return `[${lang}] Привет, ${name}`;
          }
          log(greet({ name: "Olex" }));
          log(greet());
        }}
        hint="= {} — дефолт всего параметра: без него greet() упал бы (деструктуризация undefined). Паттерн «именованные аргументы» — стандарт для опций."
        en={{
          title: "In function parameters + a guard against undefined",
          code: `function greet({ name, lang = "en" } = {}) {
  return \`[\${lang}] Hello, \${name}\`;
}
console.log(greet({ name: "Olex" }));
console.log(greet());   // didn't crash! = {} saved us`,
          hint: "= {} is a default for the whole parameter: without it, greet() would throw (destructuring undefined). The \"named arguments\" pattern is the standard for options objects.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Появится ли переменная name?»",
            code: `const { name: userName } = user;
console.log(userName); // ок
console.log(name);     // ReferenceError (ну или window.name!)`,
            text: "При rename создаётся ТОЛЬКО userName. Коварство браузера: window.name существует всегда — можно получить пустую строку вместо ошибки и долго искать баг.",
            en: {
              title: "\"Does a variable name get created?\"",
              code: `const { name: userName } = user;
console.log(userName); // fine
console.log(name);     // ReferenceError (or window.name!)`,
              text: "A rename creates ONLY userName. A browser gotcha: window.name always exists — you can get an empty string instead of an error and spend a while chasing the bug.",
            },
          },
          {
            title: "Default и null",
            code: `const { x = 10 } = { x: null };
console.log(x); // null, НЕ 10!`,
            text: "Дефолт срабатывает только на undefined. null — это «осознанное отсутствие», дефолт не подставится. Проверяют постоянно.",
            en: {
              title: "Defaults and null",
              code: `const { x = 10 } = { x: null };
console.log(x); // null, NOT 10!`,
              text: "A default only kicks in on undefined. null is \"a deliberate absence of value\" — the default isn't applied. This gets checked constantly.",
            },
          },
          {
            title: "Деструктуризация undefined",
            code: `const { data: { user } } = await res; // res.data === undefined?
// TypeError: Cannot destructure 'user' of undefined`,
            text: "Вложенная деструктуризация падает, если промежуточное звено undefined. Защита: = {} на каждом уровне или optional chaining до деструктуризации.",
            en: {
              title: "Destructuring undefined",
              code: `const { data: { user } } = await res; // res.data === undefined?
// TypeError: Cannot destructure 'user' of undefined`,
              text: "Nested destructuring throws if an intermediate link is undefined. Guard against it with = {} at every level, or optional chaining before destructuring.",
            },
          },
          {
            title: "Деструктуризация в присваивании (без const)",
            code: `let a, b;
{ a, b } = obj;    // SyntaxError! {} прочитан как блок
({ a, b } = obj);  // ок — нужны скобки`,
            text: "Строка, начинающаяся с {, парсится как блок кода. Вопрос со звёздочкой на знание парсера.",
            en: {
              title: "Destructuring assignment (without const)",
              code: `let a, b;
{ a, b } = obj;    // SyntaxError! {} is parsed as a block
({ a, b } = obj);  // fine — parentheses are required`,
              text: "A line starting with { is parsed as a code block. A bonus question testing parser knowledge.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> rename, default (только на
              undefined), rest, вложенность, параметры с защитой = {"{}"} — и
              помнить, что деструктуризация undefined падает.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> rename, defaults (only on undefined),
              rest, nesting, parameters guarded with = {"{}"} — and remember
              that destructuring undefined throws.
            </>
          }
        />
      </div>
    </>
  );
}
