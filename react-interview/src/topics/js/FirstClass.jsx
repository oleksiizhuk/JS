import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function FirstClass() {
  return (
    <>
      <InterviewQuestion en='What does "functions are first-class citizens" mean? What follows from it?'>
        Что значит «функции — first-class citizens» (объекты первого класса)? Что из этого следует?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "It means a function in JS is <b>an ordinary value</b>: you can
            store it in a variable, pass it as an argument, return it from
            another function, keep it in arrays or objects. Almost the entire
            style of the language follows from that: <b>callbacks</b>,
            higher-order functions like <b>map/filter/reduce</b>,
            <b> closures</b>, currying and composition, and in React — HOCs
            and hooks. Worth adding the function kinds: declarations are fully
            hoisted, expressions aren't, and <b>arrow functions</b> have no
            own this or arguments (this is lexical) and can't be called with
            new — perfect as callbacks, wrong as object methods."
          </>
        }
      >
        «Это значит, что функция в JS — <b>обычное значение</b>: её можно
        положить в переменную, передать аргументом, вернуть из другой функции,
        хранить в массиве или объекте. Из этого следует практически весь стиль
        языка: <b>колбэки</b>, функции высшего порядка вроде
        <b> map/filter/reduce</b>, <b>замыкания</b>, каррирование и композиция,
        а в React — HOC и хуки. Дополню про виды функций: declaration всплывает
        целиком, expression — нет, а <b>стрелки</b> не имеют своего this и
        arguments (берут this лексически) и не вызываются с new — поэтому они
        идеальны как колбэки, но не как методы объектов.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Функция — это значение"
        code={`const fn = function () { return "лежу в переменной"; };

function callTwice(f) { return [f(), f()]; }     // функция как АРГУМЕНТ

function makeGreeter(name) {                     // функция как РЕЗУЛЬТАТ
  return () => "Привет, " + name;
}

console.log(fn());
console.log(callTwice(() => "🎲"));
console.log(makeGreeter("Olex")());`}
        run={(log) => {
          const fn = function () {
            return "лежу в переменной";
          };
          function callTwice(f) {
            return [f(), f()];
          }
          function makeGreeter(name) {
            return () => "Привет, " + name;
          }
          log(fn());
          log(callTwice(() => "🎲"));
          log(makeGreeter("Olex")());
        }}
        hint="First-class = с функцией можно всё то же, что с числом или строкой: присвоить, передать, вернуть, положить в массив/объект."
        en={{
          title: "A function is a value",
          code: `const fn = function () { return "I live in a variable"; };

function callTwice(f) { return [f(), f()]; }     // function as an ARGUMENT

function makeGreeter(name) {                     // function as a RESULT
  return () => "Hello, " + name;
}

console.log(fn());
console.log(callTwice(() => "🎲"));
console.log(makeGreeter("Olex")());`,
          hint: "First-class means a function supports everything a number or string does: assign it, pass it, return it, put it in an array/object.",
        }}
      />

      <Demo
        title="Следствие: HOF и каррирование"
        code={`// Функции высшего порядка (HOF) — принимают/возвращают функции
console.log([1, 2, 3].map(n => n * 2));

// Каррирование: f(a, b) → f(a)(b)
const mul = (a) => (b) => a * b;
const double = mul(2);          // частично применили
console.log(double(21));
console.log(mul(10)(5));`}
        run={(log) => {
          log([1, 2, 3].map((n) => n * 2));
          const mul = (a) => (b) => a * b;
          const double = mul(2);
          log(double(21));
          log(mul(10)(5));
        }}
        hint="map/filter/reduce, debounce, HOC в React, connect в Redux — всё это возможно только потому, что функции first-class."
        en={{
          title: "Consequence: HOFs and currying",
          code: `// Higher-order functions (HOF) — take/return functions
console.log([1, 2, 3].map(n => n * 2));

// Currying: f(a, b) → f(a)(b)
const mul = (a) => (b) => a * b;
const double = mul(2);          // partially applied
console.log(double(21));
console.log(mul(10)(5));`,
          hint: "map/filter/reduce, debounce, HOCs in React, connect in Redux — all of this is possible only because functions are first-class.",
        }}
      />

      <Demo
        title="Стрелки vs обычные: this и arguments"
        code={`const obj = {
  name: "obj",
  regular() { return this.name; },
  arrow: () => this?.name,   // ?. потому что в модуле this === undefined
};
console.log(obj.regular()); // "obj" — this от вызова через точку
console.log(obj.arrow());   // undefined — у стрелки НЕТ своего this
// без ?. было бы TypeError: Cannot read properties of undefined`}
        run={(log) => {
          const obj = {
            name: "obj",
            regular() {
              return this.name;
            },
            arrow: () => this?.name,
          };
          log(obj.regular());
          log(obj.arrow());
        }}
        hint="Стрелка берёт this из места СОЗДАНИЯ (здесь — модуль, не obj). Поэтому стрелки нельзя делать методами объекта, но отлично — колбэками внутри методов."
        en={{
          title: "Arrows vs regular functions: this and arguments",
          code: `const obj = {
  name: "obj",
  regular() { return this.name; },
  arrow: () => this?.name,   // ?. because in a module this === undefined
};
console.log(obj.regular()); // "obj" — this from the dot-call
console.log(obj.arrow());   // undefined — an arrow has NO this of its own
// without ?. this would be a TypeError: Cannot read properties of undefined`,
          hint: "An arrow function takes this from where it was CREATED (here — the module, not obj). That's why arrows make bad object methods but great callbacks inside methods.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "Стрелка как метод объекта",
            code: `const obj = {
  name: "obj",
  say: () => this.name,  // ❌ this НЕ obj
};
obj.say(); // undefined`,
            text: "У стрелки нет своего this — она взяла его из внешнего скоупа при СОЗДАНИИ. Методы объектов — только обычные функции / shorthand.",
            en: {
              title: "An arrow function as an object method",
              code: `const obj = {
  name: "obj",
  say: () => this.name,  // ❌ this is NOT obj
};
obj.say(); // undefined`,
              text: "An arrow has no this of its own — it took it from the enclosing scope at CREATION time. Object methods should only be regular functions / shorthand methods.",
            },
          },
          {
            title: "Передача метода как колбэка",
            code: `arr.forEach(obj.method);        // this потерян!
arr.forEach(obj.method.bind(obj)); // фикс
arr.forEach(x => obj.method(x));   // фикс`,
            text: "Передавая obj.method, ты передаёшь ГОЛУЮ функцию — this отвалится. Та же история с onClick={this.handler} в классовых компонентах.",
            en: {
              title: "Passing a method as a callback",
              code: `arr.forEach(obj.method);        // this is lost!
arr.forEach(obj.method.bind(obj)); // fix
arr.forEach(x => obj.method(x));   // fix`,
              text: "Passing obj.method hands over a BARE function — this falls off. Same story with onClick={this.handler} in class components.",
            },
          },
          {
            title: "Напиши каррирование (live coding)",
            code: `const curry = (f) => (a) => (b) => f(a, b);
const add = curry((a, b) => a + b);
add(2)(3); // 5`,
            text: "Проверяют «функция возвращает функцию» на практике. Бонус: объяснить, что partial application через bind — родственный приём.",
            en: {
              title: "Write currying (live coding)",
              code: `const curry = (f) => (a) => (b) => f(a, b);
const add = curry((a, b) => a + b);
add(2)(3); // 5`,
              text: "Tests \"a function returning a function\" in practice. Bonus: explain that partial application via bind is a related technique.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> функция — значение: хранить,
              передавать, возвращать; отсюда колбэки, HOF, замыкания,
              каррирование; стрелки — без своего this/arguments/new.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> a function is a value: store it, pass
              it, return it; that's where callbacks, HOFs, closures, and
              currying come from; arrow functions have no this/arguments/new
              of their own.
            </>
          }
        />
      </div>
    </>
  );
}
