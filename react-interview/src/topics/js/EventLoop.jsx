import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function EventLoop() {
  return (
    <>
      <InterviewQuestion en="How does the event loop work? What are micro- and macrotasks?">
        Как работает event loop? Что такое микро- и макротаски?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "JS is single-threaded; asynchrony is built on the event loop.
            There's a call stack and two queues: <b>microtasks</b> —
            Promise.then, queueMicrotask, code after await — and
            <b> macrotasks</b> — setTimeout, setInterval, I/O, events. The
            cycle: run all synchronous code → drain the <b>entire</b>
            microtask queue, including tasks created along the way → take
            <b> one</b> macrotask → drain microtasks again → repeat.
            Consequences: setTimeout(fn, 0) isn't "immediately" but "after all
            microtasks, in FIFO order"; a microtask created inside a macrotask
            runs right after it, before the next macrotask; and await is sugar
            over .then — code before the first await is synchronous, the rest
            becomes a microtask."
          </>
        }
      >
        «JS однопоточный, асинхронность строится на event loop. Есть стек
        вызовов и две очереди: <b>микротаски</b> — Promise.then,
        queueMicrotask, код после await — и <b>макротаски</b> — setTimeout,
        setInterval, I/O, события. Цикл такой: выполнить весь синхронный код →
        опустошить <b>всю</b> очередь микротасок, включая созданные по ходу →
        взять <b>одну</b> макротаску → снова все микротаски → и так по кругу.
        Отсюда следствия: setTimeout(fn, 0) — это не «сразу», а «после всех
        микротасок, в порядке FIFO»; микротаска, созданная внутри макротаски,
        выполнится сразу после неё, до следующей макротаски; а await — это
        синтаксический сахар над .then: код до первого await синхронный,
        после — микротаска.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Наша задачка (та самая) — предскажи порядок!"
        code={`console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
setTimeout(() => {
  console.log(4);
  Promise.resolve().then(() => console.log(5));
}, 0);
Promise.resolve().then(() => {
  console.log(6);
  setTimeout(() => console.log(7), 0);
});
queueMicrotask(() => console.log(8));
console.log(9);`}
        run={(log) => {
          log(1);
          setTimeout(() => log(2), 0);
          Promise.resolve().then(() => log(3));
          setTimeout(() => {
            log(4);
            Promise.resolve().then(() => log(5));
          }, 0);
          Promise.resolve().then(() => {
            log(6);
            setTimeout(() => log(7), 0);
          });
          queueMicrotask(() => log(8));
          log(9);
        }}
        hint="1 9 | 3 6 8 (ВСЕ микротаски) | 2 (макро) | 4 5 (макро + её микро сразу) | 7. Правило: синхронный код → вся очередь микротасок → ОДНА макротаска → снова все микротаски → ..."
        en={{
          title: "The classic exercise — predict the order!",
          code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
setTimeout(() => {
  console.log(4);
  Promise.resolve().then(() => console.log(5));
}, 0);
Promise.resolve().then(() => {
  console.log(6);
  setTimeout(() => console.log(7), 0);
});
queueMicrotask(() => console.log(8));
console.log(9);`,
          hint: "1 9 | 3 6 8 (ALL microtasks) | 2 (macro) | 4 5 (a macro + its microtask right away) | 7. Rule: synchronous code → the entire microtask queue → ONE macrotask → all microtasks again → ...",
        }}
      />

      <Demo
        title="await — это скрытый .then"
        code={`async function main() {
  console.log("A");            // синхронно
  await null;                  // всё ПОСЛЕ await — микротаска
  console.log("B");
}
console.log("start");
main();
console.log("C");
// порядок?`}
        run={(log) => {
          async function main() {
            log("A");
            await null;
            log("B");
          }
          log("start");
          main();
          log("C");
        }}
        hint="start A C B. Вызов main() идёт синхронно ДО первого await; await разрезает функцию — остаток уходит в микротаски и ждёт конца синхронного кода."
        en={{
          title: "await is a hidden .then",
          code: `async function main() {
  console.log("A");            // synchronous
  await null;                  // everything AFTER await is a microtask
  console.log("B");
}
console.log("start");
main();
console.log("C");
// what's the order?`,
          hint: "start A C B. The call to main() runs synchronously UP TO the first await; await splits the function — the rest goes to the microtask queue and waits for the synchronous code to finish.",
        }}
      />

      <Demo
        title="Микротаски жадные: выполняются даже порождённые"
        code={`setTimeout(() => console.log("макро"), 0);

Promise.resolve()
  .then(() => console.log("микро 1"))
  .then(() => console.log("микро 2"))
  .then(() => console.log("микро 3"));
// каждая .then создаёт НОВУЮ микротаску — но все они успеют до макро`}
        run={(log) => {
          setTimeout(() => log("макро"), 0);
          Promise.resolve()
            .then(() => log("микро 1"))
            .then(() => log("микро 2"))
            .then(() => log("микро 3"));
        }}
        hint="Очередь микротасок опустошается ДО КОНЦА, включая свежесозданные. Бесконечная цепочка микротасок заморозила бы страницу — макротаски до неё бы не дошли."
        en={{
          title: "Microtasks are greedy: even newly spawned ones run",
          code: `setTimeout(() => console.log("macro"), 0);

Promise.resolve()
  .then(() => console.log("micro 1"))
  .then(() => console.log("micro 2"))
  .then(() => console.log("micro 3"));
// each .then creates a NEW microtask — but all of them run before the macro`,
          hint: "The microtask queue is drained COMPLETELY, including freshly created ones. An infinite chain of microtasks would freeze the page — macrotasks would never get a turn.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Промис же асинхронный?» — executor синхронный!",
            code: `new Promise((resolve) => {
  console.log("A");  // выполнится СИНХРОННО, сразу!
  resolve();
}).then(() => console.log("B")); // а вот then — микротаска
console.log("C");
// A C B`,
            text: "Функция-executor внутри new Promise выполняется немедленно. Асинхронен только .then/.catch/.finally.",
            en: {
              title: "\"Isn't a Promise asynchronous?\" — the executor is synchronous!",
              code: `new Promise((resolve) => {
  console.log("A");  // runs SYNCHRONOUSLY, right away!
  resolve();
}).then(() => console.log("B")); // but then IS a microtask
console.log("C");
// A C B`,
              text: "The executor function inside new Promise runs immediately. Only .then/.catch/.finally are asynchronous.",
            },
          },
          {
            title: "setTimeout(fn, 0) — не мгновенно",
            code: `setTimeout(fn, 0);
// сначала: весь синхронный код + ВСЕ микротаски
// плюс браузерный минимум ~4ms на вложенных таймерах`,
            text: "Проверяют формулировку: «выполнится, когда стек пуст, микротаски кончились и до него дошла FIFO-очередь».",
            en: {
              title: "setTimeout(fn, 0) isn't instant",
              code: `setTimeout(fn, 0);
// first: all synchronous code + ALL microtasks
// plus the browser's ~4ms floor on nested timers`,
              text: "Tests your phrasing: \"it runs once the stack is empty, microtasks are drained, and its turn comes up in the FIFO queue.\"",
            },
          },
          {
            title: "Блокировка цикла",
            code: `while (true) {}          // повесит вкладку: loop не крутится
Promise.resolve().then(function loop() {
  Promise.resolve().then(loop);
});                       // тоже повесит! микротаски бесконечны`,
            text: "И синхронный код, и бесконечная цепочка микротасок блокируют рендер страницы — макротаски и paint не получат хода.",
            en: {
              title: "Blocking the loop",
              code: `while (true) {}          // hangs the tab: the loop can't turn
Promise.resolve().then(function loop() {
  Promise.resolve().then(loop);
});                       // also hangs it! an infinite microtask chain`,
              text: "Both synchronous code and an infinite microtask chain block page rendering — macrotasks and paint never get a turn.",
            },
          },
          {
            title: "«В спецификации нет слова macrotask»",
            code: `// ECMAScript: "jobs" (это микротаски)
// HTML-спека:  "tasks" + "microtask checkpoint"
// "macrotask" — разговорный термин, но все его понимают`,
            text: "Иногда придираются к терминологии. Безопасная формулировка: «задачи (tasks) и микрозадачи (microtasks)», а «макротаска» — как общепринятый жаргон.",
            en: {
              title: "\"The spec doesn't use the word 'macrotask'\"",
              code: `// ECMAScript: "jobs" (these are microtasks)
// HTML spec:  "tasks" + "microtask checkpoint"
// "macrotask" is colloquial, but everyone understands it`,
              text: "Sometimes interviewers nitpick terminology. Safe phrasing: \"tasks and microtasks\", with \"macrotask\" as widely-used jargon.",
            },
          },
          {
            title: "Node.js: свои очереди",
            code: `process.nextTick(fn)  // РАНЬШЕ промис-микротасок (своя очередь)
Promise.then(fn)      // микротаски
setTimeout(fn, 0)     // фаза timers
setImmediate(fn)      // фаза check — после I/O-колбэков`,
            text: "Если в вакансии есть Node — спросят. Ключевое: nextTick приоритетнее промисов, а setImmediate vs setTimeout(0) внутри I/O-колбэка даёт предсказуемый порядок (immediate раньше).",
            en: {
              title: "Node.js: its own queues",
              code: `process.nextTick(fn)  // EARLIER than promise microtasks (its own queue)
Promise.then(fn)      // microtasks
setTimeout(fn, 0)     // timers phase
setImmediate(fn)      // check phase — after I/O callbacks`,
              text: "If the role involves Node, this comes up. Key fact: nextTick runs before promises, and setImmediate vs setTimeout(0) inside an I/O callback has a predictable order (immediate first).",
            },
          },
          {
            title: "await в цикле — последовательно или параллельно?",
            code: `for (const u of urls) await fetch(u);      // ПОСЛЕДОВАТЕЛЬНО
await Promise.all(urls.map(u => fetch(u))); // ПАРАЛЛЕЛЬНО`,
            text: "Классика оптимизации: независимые запросы — через Promise.all. Бонус: Promise.allSettled, когда важны и ошибки.",
            en: {
              title: "await in a loop — sequential or parallel?",
              code: `for (const u of urls) await fetch(u);      // SEQUENTIAL
await Promise.all(urls.map(u => fetch(u))); // PARALLEL`,
              text: "A classic optimization: independent requests should go through Promise.all. Bonus: Promise.allSettled when you also care about failures.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> синхронный код → ВСЕ микротаски →
              ОДНА макротаска → снова все микротаски; await — сахар над then,
              executor промиса синхронный.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> synchronous code → ALL microtasks → ONE
              macrotask → all microtasks again; await is sugar over then, and
              a Promise's executor runs synchronously.
            </>
          }
        />
      </div>
    </>
  );
}
