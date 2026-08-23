import { useState } from "react";
import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
  CodeBlock,
} from "../InterviewBlocks.jsx";

// Живое замыкание: две независимые фабрики счётчиков
function makeCounter() {
  let n = 0;
  return () => ++n;
}
const counterA = makeCounter();
const counterB = makeCounter();

export default function Closure() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  return (
    <>
      <InterviewQuestion en="What is a closure? Give practical use cases.">
        Что такое замыкание? Приведи практические примеры использования.
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "A closure is a function together with the <b>lexical environment
            of the place where it was created</b>: it keeps access to outer
            variables even after the outer function has returned. Crucially it
            captures <b>a reference to the variable, not a copy of the
            value</b> — so two functions created in the same environment see
            each other's changes. In practice: private state (counters,
            modules), <b>debounce/throttle/once</b>, memoization, currying —
            anywhere you need state between calls without globals. React hooks
            are built on closures, and that's where the classic stale closure
            problem comes from — an effect captured the state of the first
            render. Side effect to mention: closures retain memory — the GC
            can't collect captured variables while the closure is alive."
          </>
        }
      >
        «Замыкание — это функция вместе с <b>лексическим окружением места, где
        она была создана</b>: она сохраняет доступ к внешним переменным даже
        после того, как внешняя функция завершилась. Важно, что захватывается
        <b> ссылка на переменную, а не копия значения</b> — поэтому две функции,
        созданные в одном окружении, видят изменения друг друга. Практика:
        приватное состояние (счётчики, модули), <b>debounce/throttle/once</b>,
        мемоизация, каррирование — везде, где нужно хранить состояние между
        вызовами без глобальных переменных. В React на замыканиях стоят хуки, и
        оттуда же классическая проблема stale closure — эффект захватил state
        первого рендера. Побочный эффект: замыкание удерживает память — GC не
        соберёт переменные, пока живо само замыкание.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <div className="card">
        <h3><L ru="Живой пример: счётчики на замыканиях" en="Live example: counters built on closures" /></h3>
        <CodeBlock
          ru={`function makeCounter() {
  let n = 0;              // приватная переменная
  return () => ++n;       // замыкание помнит СВОЮ n
}
const counterA = makeCounter();
const counterB = makeCounter(); // у каждого своя n!`}
          en={`function makeCounter() {
  let n = 0;              // private variable
  return () => ++n;       // the closure remembers ITS OWN n
}
const counterA = makeCounter();
const counterB = makeCounter(); // each one has its own n!`}
        />
        <button className="btn primary" onClick={() => setA(counterA())}>
          counterA() → {a}
        </button>
        <button className="btn" onClick={() => setB(counterB())}>
          counterB() → {b}
        </button>
        <p className="hint">
          <L
            ru="makeCounter давно завершился, а n живёт — потому что на неё ссылается возвращённая функция. Два вызова фабрики = два независимых замыкания. Снаружи до n не добраться — приватность."
            en="makeCounter finished executing long ago, yet n stays alive — because the returned function still references it. Two calls to the factory = two independent closures. There's no way to reach n from the outside — that's privacy."
          />
        </p>
      </div>

      <Demo
        title="Замыкание держит ССЫЛКУ, а не копию"
        code={`function make() {
  let secret = "старое";
  return {
    get: () => secret,
    set: (v) => { secret = v; },
  };
}
const box = make();
console.log(box.get());  // ?
box.set("новое");
console.log(box.get());  // ? — обе функции видят ОДНУ переменную`}
        run={(log) => {
          function make() {
            let secret = "старое";
            return { get: () => secret, set: (v) => (secret = v) };
          }
          const box = make();
          log(box.get());
          box.set("новое");
          log(box.get());
        }}
        hint="get и set замкнуты на одну и ту же переменную — изменение через set видно в get. Именно поэтому var в цикле даёт всем таймерам одно и то же i."
        en={{
          title: "A closure keeps a REFERENCE, not a copy",
          code: `function make() {
  let secret = "old";
  return {
    get: () => secret,
    set: (v) => { secret = v; },
  };
}
const box = make();
console.log(box.get());  // ?
box.set("new");
console.log(box.get());  // ? — both functions see the SAME variable`,
          hint: "get and set close over the same variable — a change through set is visible in get. This is exactly why var in a loop gives every timer the same i.",
        }}
      />

      <Demo
        title="Практика: once — функция срабатывает один раз"
        code={`function once(fn) {
  let done = false;         // состояние в замыкании
  return (...args) => {
    if (done) return "уже вызывалась";
    done = true;
    return fn(...args);
  };
}
const init = once(() => "инициализация!");
console.log(init());
console.log(init());
console.log(init());`}
        run={(log) => {
          function once(fn) {
            let done = false;
            return (...args) => {
              if (done) return "уже вызывалась";
              done = true;
              return fn(...args);
            };
          }
          const init = once(() => "инициализация!");
          log(init());
          log(init());
          log(init());
        }}
        hint="Тот же приём — в debounce, throttle, memoize: состояние между вызовами хранится в замыкании, без глобальных переменных."
        en={{
          title: "In practice: once — a function that fires a single time",
          code: `function once(fn) {
  let done = false;         // state kept in the closure
  return (...args) => {
    if (done) return "already called";
    done = true;
    return fn(...args);
  };
}
const init = once(() => "initializing!");
console.log(init());
console.log(init());
console.log(init());`,
          hint: "The same trick powers debounce, throttle, memoize: state between calls lives in the closure, no global variables needed.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Что выведет?» — var в цикле",
            code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3 3 3
}`,
            text: "Все три замыкания держат ссылку на ОДНУ переменную i. Фиксы: let (своя i на итерацию) или IIFE. Вопрос №1 по замыканиям на любом собесе.",
            en: {
              title: "\"What does this log?\" — var in a loop",
              code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3 3 3
}`,
              text: "All three closures hold a reference to the SAME variable i. Fixes: let (a fresh i per iteration) or an IIFE. The number-one closure question at any interview.",
            },
          },
          {
            title: "«Независимы ли счётчики?»",
            code: `const c1 = makeCounter();
const c2 = makeCounter();
c1(); c1(); // 1, 2
c2();       // 1, а не 3!`,
            text: "Каждый ВЫЗОВ фабрики создаёт новое окружение. Ответ «3» = не понимает, что замыкание привязано к вызову, а не к функции.",
            en: {
              title: "\"Are the counters independent?\"",
              code: `const c1 = makeCounter();
const c2 = makeCounter();
c1(); c1(); // 1, 2
c2();       // 1, not 3!`,
              text: "Every CALL to the factory creates a new environment. Answering \"3\" shows a misunderstanding: a closure is tied to the call, not the function.",
            },
          },
          {
            title: "Написать debounce (live coding)",
            code: `function debounce(fn, ms) {
  let timer;                    // состояние в замыкании
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}`,
            text: "Классика: timer живёт между вызовами благодаря замыканию. Уметь написать без подглядывания.",
            en: {
              title: "Write debounce (live coding)",
              code: `function debounce(fn, ms) {
  let timer;                    // state kept in the closure
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}`,
              text: "A classic: timer stays alive between calls thanks to the closure. Be able to write it from memory.",
            },
          },
          {
            title: "Stale closure в React",
            code: `useEffect(() => {
  setInterval(() => console.log(count), 1000);
}, []); // всегда логирует ПЕРВЫЙ count`,
            text: "Эффект с [] захватил count первого рендера навсегда. Фиксы: count в deps, функциональный setCount(c => c + 1), или ref.",
            en: {
              title: "Stale closure in React",
              code: `useEffect(() => {
  setInterval(() => console.log(count), 1000);
}, []); // always logs the FIRST render's count`,
              text: "An effect with [] captured the first render's count forever. Fixes: add count to deps, use the functional setCount(c => c + 1), or use a ref.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> замыкание = функция + окружение
              места создания; держит ссылки (не копии) и живёт после
              завершения внешней функции — основа приватности, debounce и
              хуков React.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> a closure = a function + the
              environment where it was created; it holds references (not
              copies) and survives after the outer function returns — the
              foundation of privacy, debounce, and React hooks.
            </>
          }
        />
      </div>
    </>
  );
}
