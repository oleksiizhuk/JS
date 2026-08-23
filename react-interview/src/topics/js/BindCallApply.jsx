import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function BindCallApply() {
  return (
    <>
      <InterviewQuestion en="What's the difference between call, apply and bind?">
        В чём разница между call, apply и bind?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "All three control <b>this</b>. <b>call</b> and <b>apply</b> invoke
            the function immediately — call takes arguments comma-separated,
            apply takes them as an array (mnemonic: Apply = Array, Call =
            Comma). <b>bind</b> doesn't invoke — it returns a new function with
            this permanently locked, and it can also pre-bake arguments, which
            is partial application. A bound this can't be overridden by
            call/apply or another bind — the only exception is the new
            operator. And this itself depends on <b>how</b> the function is
            called: obj.f() → obj, a bare f() → undefined/globalThis; arrows
            have no own this at all. Historically apply was used to spread
            arrays — Math.max.apply(null, arr) — today that's the spread
            operator."
          </>
        }
      >
        «Все три управляют <b>this</b>. <b>call</b> и <b>apply</b> вызывают
        функцию сразу — call принимает аргументы через запятую, apply массивом
        (мнемоника: Apply = Array, Call = Comma). <b>bind</b> не вызывает — он
        возвращает новую функцию с намертво прибитым this, и умеет запекать
        аргументы — это partial application. Перебить bind повторным
        bind/call/apply нельзя — единственное исключение — оператор new. Сам же
        this зависит от того, <b>как</b> вызвали: obj.f() → obj, голый f() →
        undefined/globalThis; у стрелок своего this нет вообще. Исторически
        apply использовали для разворота массивов — Math.max.apply(null, arr),
        сегодня это делает spread.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Тройка: call / apply / bind"
        code={`const user = { name: "Olex" };
function hi(greeting, mark) { return greeting + ", " + this.name + mark; }

console.log(hi.call(user, "Привет", "!"));   // вызов сразу, args через запятую
console.log(hi.apply(user, ["Hello", "?"])); // вызов сразу, args массивом
const bound = hi.bind(user, "Yo");           // НЕ вызывает — возвращает функцию
console.log(bound("."));                     // прибитый this + partial application`}
        run={(log) => {
          const user = { name: "Olex" };
          function hi(greeting, mark) {
            return greeting + ", " + this.name + mark;
          }
          log(hi.call(user, "Привет", "!"));
          log(hi.apply(user, ["Hello", "?"]));
          const bound = hi.bind(user, "Yo");
          log(bound("."));
        }}
        hint="Мнемоника: Apply = Array, Call = Comma. bind — единственный, кто не вызывает, а возвращает новую функцию (и умеет запекать аргументы)."
        en={{
          title: "The trio: call / apply / bind",
          code: `const user = { name: "Olex" };
function hi(greeting, mark) { return greeting + ", " + this.name + mark; }

console.log(hi.call(user, "Hi", "!"));       // calls right away, args comma-separated
console.log(hi.apply(user, ["Hello", "?"])); // calls right away, args as an array
const bound = hi.bind(user, "Yo");           // does NOT call — returns a function
console.log(bound("."));                     // locked this + partial application`,
          hint: "Mnemonic: Apply = Array, Call = Comma. bind is the only one that doesn't call — it returns a new function (and can also pre-bake arguments).",
        }}
      />

      <Demo
        title="Потерянный this и три починки"
        code={`const cat = { name: "Барсик", say() { return this?.name; } };

const fn = cat.say;
console.log(fn());                  // undefined — «голый» вызов
console.log(fn.call(cat));          // 1) call
console.log(cat.say.bind(cat)());   // 2) bind
console.log((() => cat.say())());   // 3) обёртка: внутри вызов через точку`}
        run={(log) => {
          const cat = {
            name: "Барсик",
            say() {
              return this?.name;
            },
          };
          const fn = cat.say;
          log(fn());
          log(fn.call(cat));
          log(cat.say.bind(cat)());
          log((() => cat.say())());
        }}
        hint="this зависит от того, КАК вызвали: obj.f() → obj; f() → undefined. Присвоив метод в переменную, ты оторвал его от объекта."
        en={{
          title: "Lost this, and three fixes",
          code: `const cat = { name: "Whiskers", say() { return this?.name; } };

const fn = cat.say;
console.log(fn());                  // undefined — a "bare" call
console.log(fn.call(cat));          // 1) call
console.log(cat.say.bind(cat)());   // 2) bind
console.log((() => cat.say())());   // 3) wrapper: calls through the dot inside`,
          hint: "this depends on HOW the function was called: obj.f() → obj; f() → undefined. Assigning a method to a variable detaches it from the object.",
        }}
      />

      <Demo
        title="bind нельзя перебить (наши задачки 3–4)"
        code={`function who() { return this.name; }

const a = who.bind({ name: "A" });
console.log(a.call({ name: "B" }));  // call проигнорирован
console.log(a.apply({ name: "C" })); // apply тоже
const b = who.bind({ name: "X" }).bind({ name: "Y" });
console.log(b());                    // работает только ПЕРВЫЙ bind`}
        run={(log) => {
          function who() {
            return this.name;
          }
          const a = who.bind({ name: "A" });
          log(a.call({ name: "B" }));
          log(a.apply({ name: "C" }));
          const b = who.bind({ name: "X" }).bind({ name: "Y" });
          log(b());
        }}
        hint="Связанная функция хранит this внутри и свой внешний this не использует. Перебить может только оператор new."
        en={{
          title: "bind can't be overridden",
          code: `function who() { return this.name; }

const a = who.bind({ name: "A" });
console.log(a.call({ name: "B" }));  // call is ignored
console.log(a.apply({ name: "C" })); // apply too
const b = who.bind({ name: "X" }).bind({ name: "Y" });
console.log(b());                    // only the FIRST bind takes effect`,
          hint: "A bound function keeps this locked inside and ignores any outer this. Only the new operator can override it.",
        }}
      />

      <Demo
        title="Ловушка из нашей практики: bind(ctx)()"
        code={`function who() { return this.name; }

const good = who.bind({ name: "A" });   // функция
const bad  = who.bind({ name: "A" })(); // ВЫЗВАЛИ сразу — это уже РЕЗУЛЬТАТ

console.log(typeof good, good());
console.log(typeof bad, bad);
// bad.call(...) упало бы: у строки/undefined нет .call`}
        run={(log) => {
          function who() {
            return this.name;
          }
          const good = who.bind({ name: "A" });
          const bad = who.bind({ name: "A" })();
          log(typeof good, good());
          log(typeof bad, bad);
        }}
        hint="Лишние () превращают «функцию на потом» в немедленный вызов. Именно на этом падал наш call-bind-apply.js."
        en={{
          title: "A real-world trap: bind(ctx)()",
          code: `function who() { return this.name; }

const good = who.bind({ name: "A" });   // a function
const bad  = who.bind({ name: "A" })(); // CALLED immediately — this is already a RESULT

console.log(typeof good, good());
console.log(typeof bad, bad);
// bad.call(...) would throw: a string/undefined has no .call`,
          hint: "An extra () turns \"a function for later\" into an immediate call. This is exactly what tripped up our call-bind-apply.js exercise.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "Написать полифилл myCall (live coding)",
            code: `Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;
  const key = Symbol();       // чтобы не затереть свойство
  ctx[key] = this;            // this = сама функция
  const result = ctx[key](...args); // вызов через точку даёт нужный this!
  delete ctx[key];
  return result;
};`,
            text: "Самая частая «напиши сам». Вся соль: временно положить функцию в объект и вызвать через точку.",
            en: {
              title: "Write a myCall polyfill (live coding)",
              code: `Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;
  const key = Symbol();       // so we don't overwrite an existing property
  ctx[key] = this;            // this = the function itself
  const result = ctx[key](...args); // calling through a dot gives the right this!
  delete ctx[key];
  return result;
};`,
              text: "The most common \"write it yourself\" question. The whole trick: temporarily attach the function to an object and call it through the dot.",
            },
          },
          {
            title: "bind + new",
            code: `function Who() { console.log(this.name); }
const B = Who.bind({ name: "A" });
new B(); // undefined — new ПЕРЕБИЛ bind!`,
            text: "Единственный способ обойти bind: new создаёт новый объект и игнорирует привязанный this. Вопрос со звёздочкой.",
            en: {
              title: "bind + new",
              code: `function Who() { console.log(this.name); }
const B = Who.bind({ name: "A" });
new B(); // undefined — new OVERRODE bind!`,
              text: "The only way to bypass bind: new creates a new object and ignores the bound this. A bonus-level question.",
            },
          },
          {
            title: "setTimeout(obj.method, 1000)",
            code: `setTimeout(user.greet, 1000);            // this потерян
setTimeout(user.greet.bind(user), 1000); // фикс
setTimeout(() => user.greet(), 1000);    // фикс`,
            text: "Передача метода в колбэк отрывает его от объекта — та же «потеря this», что и const fn = obj.method.",
            en: {
              title: "setTimeout(obj.method, 1000)",
              code: `setTimeout(user.greet, 1000);            // this is lost
setTimeout(user.greet.bind(user), 1000); // fix
setTimeout(() => user.greet(), 1000);    // fix`,
              text: "Passing a method as a callback detaches it from the object — the same \"lost this\" as const fn = obj.method.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> call/apply вызывают сразу
              (запятая/массив), bind возвращает функцию с прибитым this +
              partial application; перебивает bind только new. Задачки:
              js-core/call-bind-apply.js.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> call/apply invoke immediately
              (comma/array), bind returns a function with this locked +
              partial application; only new can override bind. Exercises:
              js-core/call-bind-apply.js.
            </>
          }
        />
      </div>
    </>
  );
}
