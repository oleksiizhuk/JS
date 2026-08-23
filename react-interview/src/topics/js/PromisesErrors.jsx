import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function PromisesErrors() {
  return (
    <>
      <InterviewQuestion en="Promise combinators and error handling in async code — what do you use?">
        Комбинаторы промисов и обработка ошибок в асинхронном коде — что используешь?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Four combinators, and the choice depends on what failure means for
            me. <b>Promise.all</b> — everything must succeed, rejects on the
            first failure (fail-fast) and the other requests keep running
            anyway. <b>allSettled</b> — I need every result regardless of
            failures: it never rejects and returns status/value/reason per
            item — the right one for dashboards and batch operations.
            <b> race</b> — the first to <b>settle</b>, success or failure alike;
            the classic use is a timeout. <b>any</b> — the first to
            <b> succeed</b>, rejecting only if all fail, with an
            AggregateError. On errors: async/await plus try/catch, custom error
            classes extending Error so I can distinguish them by instanceof,
            never swallow an error with an empty catch, and remember that a
            rejected promise nobody handles becomes an unhandledrejection.
            Two practical rules: independent requests go through
            Promise.all, not a sequential await in a loop; and cancellation is
            AbortController, because a promise itself can't be cancelled."
          </>
        }
      >
        «Четыре комбинатора, и выбор зависит от того, что для меня значит сбой.
        <b> Promise.all</b> — нужны все: реджектится на первой же ошибке
        (fail-fast), при этом остальные запросы всё равно продолжают
        выполняться. <b>allSettled</b> — нужен каждый результат независимо от
        ошибок: никогда не реджектится и возвращает status/value/reason по
        каждому — то, что нужно для дашбордов и пакетных операций.
        <b> race</b> — первый <b>завершившийся</b>, успех или ошибка без
        разницы; классика применения — таймаут. <b>any</b> — первый
        <b> успешный</b>, реджектится только если провалились все, с
        AggregateError. По ошибкам: async/await плюс try/catch, кастомные
        классы ошибок через extends Error, чтобы различать их по instanceof,
        никогда не глотать ошибку пустым catch, и помнить, что необработанный
        реджект превращается в unhandledrejection. Два практических правила:
        независимые запросы — через Promise.all, а не последовательный await в
        цикле; и отмена — это AbortController, потому что сам промис отменить
        нельзя.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <Demo
        title="Четыре комбинатора на одних и тех же данных"
        code={`const ok = (v, ms) => new Promise(r => setTimeout(() => r(v), ms));
const fail = (e, ms) => new Promise((_, rj) => setTimeout(() => rj(new Error(e)), ms));

Promise.all([ok("A", 10), fail("бум", 5)])
  .then(r => console.log("all:", r))
  .catch(e => console.log("all ОТВАЛИЛСЯ:", e.message));

Promise.allSettled([ok("A", 10), fail("бум", 5)])
  .then(r => console.log("allSettled:", r.map(x => x.status)));

Promise.race([ok("быстрый", 5), ok("медленный", 50)])
  .then(r => console.log("race:", r));

Promise.any([fail("e1", 5), ok("первый успешный", 20)])
  .then(r => console.log("any:", r));`}
        run={(log) => {
          const ok = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));
          const fail = (e, ms) =>
            new Promise((_, rj) => setTimeout(() => rj(new Error(e)), ms));
          Promise.all([ok("A", 10), fail("бум", 5)])
            .then((r) => log("all:", r))
            .catch((e) => log("all ОТВАЛИЛСЯ:", e.message));
          Promise.allSettled([ok("A", 10), fail("бум", 5)]).then((r) =>
            log("allSettled:", r.map((x) => x.status))
          );
          Promise.race([ok("быстрый", 5), ok("медленный", 50)]).then((r) =>
            log("race:", r)
          );
          Promise.any([fail("e1", 5), ok("первый успешный", 20)]).then((r) =>
            log("any:", r)
          );
        }}
        hint="all — все или ошибка; allSettled — всегда все статусы; race — первый завершившийся (в т.ч. ошибкой); any — первый успешный."
        en={{
          title: "Four combinators on the same data",
          code: `const ok = (v, ms) => new Promise(r => setTimeout(() => r(v), ms));
const fail = (e, ms) => new Promise((_, rj) => setTimeout(() => rj(new Error(e)), ms));

Promise.all([ok("A", 10), fail("boom", 5)])
  .then(r => console.log("all:", r))
  .catch(e => console.log("all FAILED:", e.message));

Promise.allSettled([ok("A", 10), fail("boom", 5)])
  .then(r => console.log("allSettled:", r.map(x => x.status)));

Promise.race([ok("fast", 5), ok("slow", 50)])
  .then(r => console.log("race:", r));

Promise.any([fail("e1", 5), ok("first success", 20)])
  .then(r => console.log("any:", r));`,
          hint: "all — everything or an error; allSettled — always every status; race — the first to settle (even with an error); any — the first to succeed.",
        }}
      />

      <Demo
        title="Последовательно vs параллельно"
        code={`const load = (name, ms) => new Promise(r => setTimeout(() => r(name), ms));

(async () => {
  const t1 = Date.now();
  for (const n of ["a", "b", "c"]) await load(n, 60);      // ❌ ждём каждый
  console.log("последовательно ~", Date.now() - t1, "мс");

  const t2 = Date.now();
  await Promise.all(["a", "b", "c"].map(n => load(n, 60))); // ✅ разом
  console.log("параллельно ~", Date.now() - t2, "мс");
})();`}
        run={(log) => {
          const load = (name, ms) =>
            new Promise((r) => setTimeout(() => r(name), ms));
          (async () => {
            const t1 = Date.now();
            for (const n of ["a", "b", "c"]) await load(n, 60);
            log("последовательно ~", Date.now() - t1, "мс");
            const t2 = Date.now();
            await Promise.all(["a", "b", "c"].map((n) => load(n, 60)));
            log("параллельно ~", Date.now() - t2, "мс");
          })();
        }}
        hint="~180мс против ~60мс. Await в цикле оправдан, только если следующий запрос зависит от предыдущего — иначе Promise.all."
        en={{
          title: "Sequential vs parallel",
          code: `const load = (name, ms) => new Promise(r => setTimeout(() => r(name), ms));

(async () => {
  const t1 = Date.now();
  for (const n of ["a", "b", "c"]) await load(n, 60);      // ❌ waits for each one
  console.log("sequential ~", Date.now() - t1, "ms");

  const t2 = Date.now();
  await Promise.all(["a", "b", "c"].map(n => load(n, 60))); // ✅ all at once
  console.log("parallel ~", Date.now() - t2, "ms");
})();`,
          hint: "~180ms vs ~60ms. await in a loop is justified only when the next request depends on the previous one — otherwise use Promise.all.",
        }}
      />

      <Demo
        title="Кастомные ошибки: различаем по типу"
        code={`class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";      // иначе в стеке будет просто "Error"
    this.status = status;
  }
}
class ValidationError extends Error {
  constructor(field) { super("Некорректное поле: " + field); this.name = "ValidationError"; this.field = field; }
}

function handle(err) {
  if (err instanceof ValidationError) return "показать подсветку поля " + err.field;
  if (err instanceof ApiError) return err.status >= 500 ? "повторить запрос" : "показать текст ошибки";
  throw err;                      // чужую ошибку — пробрасываем дальше!
}

console.log(handle(new ValidationError("email")));
console.log(handle(new ApiError("Server down", 503)));
console.log(handle(new ApiError("Not found", 404)));`}
        run={(log) => {
          class ApiError extends Error {
            constructor(message, status) {
              super(message);
              this.name = "ApiError";
              this.status = status;
            }
          }
          class ValidationError extends Error {
            constructor(field) {
              super("Некорректное поле: " + field);
              this.name = "ValidationError";
              this.field = field;
            }
          }
          function handle(err) {
            if (err instanceof ValidationError)
              return "показать подсветку поля " + err.field;
            if (err instanceof ApiError)
              return err.status >= 500
                ? "повторить запрос"
                : "показать текст ошибки";
            throw err;
          }
          log(handle(new ValidationError("email")));
          log(handle(new ApiError("Server down", 503)));
          log(handle(new ApiError("Not found", 404)));
        }}
        hint="Классы ошибок позволяют ветвить обработку по типу вместо парсинга текста сообщения. Всегда ставь this.name и пробрасывай незнакомые ошибки дальше."
        en={{
          title: "Custom errors: branching by type",
          code: `class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";      // otherwise the stack would just say "Error"
    this.status = status;
  }
}
class ValidationError extends Error {
  constructor(field) { super("Invalid field: " + field); this.name = "ValidationError"; this.field = field; }
}

function handle(err) {
  if (err instanceof ValidationError) return "highlight field " + err.field;
  if (err instanceof ApiError) return err.status >= 500 ? "retry the request" : "show the error text";
  throw err;                      // an unfamiliar error — rethrow it!
}

console.log(handle(new ValidationError("email")));
console.log(handle(new ApiError("Server down", 503)));
console.log(handle(new ApiError("Not found", 404)));`,
          hint: "Error classes let you branch handling by type instead of parsing the message text. Always set this.name and rethrow errors you don't recognize.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Promise.all отменяет остальные запросы?»",
            code: `Promise.all([slow, failsFast]);
// ❌ нет: slow продолжит выполняться, просто его результат никому не нужен
// отмена — только AbortController: fetch(url, { signal })`,
            text: "Промис нельзя отменить — можно только перестать слушать. Для реальной отмены сетевых запросов есть AbortController.",
            en: {
              title: "\"Does Promise.all cancel the other requests?\"",
              code: `Promise.all([slow, failsFast]);
// ❌ no: slow keeps running, its result is just no longer needed by anyone
// real cancellation requires AbortController: fetch(url, { signal })`,
              text: "A promise can't be cancelled — you can only stop listening to it. Real cancellation of network requests needs AbortController.",
            },
          },
          {
            title: "try/catch не ловит асинхронное",
            code: `try {
  setTimeout(() => { throw new Error("бум"); }, 0);  // НЕ поймается
} catch (e) {}
// ошибка вылетит в другом тике, вне стека этого try`,
            text: "try/catch работает только внутри своего синхронного стека (или с await). Внутри колбэков — свой try/catch, для промисов — .catch.",
            en: {
              title: "try/catch doesn't catch async errors",
              code: `try {
  setTimeout(() => { throw new Error("boom"); }, 0);  // NOT caught
} catch (e) {}
// the error fires on a different tick, outside this try's stack`,
              text: "try/catch only works within its own synchronous stack (or with await). Inside callbacks you need their own try/catch; for promises, use .catch.",
            },
          },
          {
            title: "Забытый await = ошибка мимо catch",
            code: `try {
  doAsync();          // ❌ без await — реджект улетит в unhandledrejection
} catch (e) { /* не сработает */ }`,
            text: "Классика на code review. Правило: любой промис либо await, либо .catch, либо явно void с обработчиком.",
            en: {
              title: "A forgotten await = the error skips catch",
              code: `try {
  doAsync();          // ❌ no await — the rejection becomes an unhandledrejection
} catch (e) { /* never fires */ }`,
              text: "A classic code-review finding. Rule: every promise gets either await, .catch, or an explicit void with a handler.",
            },
          },
          {
            title: "Пустой catch хуже отсутствия catch",
            code: `try { risky(); } catch (e) {}     // ❌ ошибка исчезла бесследно
try { risky(); } catch (e) {         // ✅
  logger.error(e);
  throw new AppError("Не удалось", { cause: e });   // cause сохраняет исходную
}`,
            text: "Проглоченная ошибка = баг, который невозможно найти. Опция cause (ES2022) сохраняет цепочку причин.",
            en: {
              title: "An empty catch is worse than no catch",
              code: `try { risky(); } catch (e) {}     // ❌ the error vanishes without a trace
try { risky(); } catch (e) {         // ✅
  logger.error(e);
  throw new AppError("Failed", { cause: e });   // cause preserves the original
}`,
              text: "A swallowed error is a bug you can never find. The cause option (ES2022) preserves the chain of causes.",
            },
          },
          {
            title: "finally не меняет результат",
            code: `promise.finally(() => cleanup());   // значение/ошибка проходят СКВОЗЬ
// но: return внутри finally в try/catch — перезатрёт результат и глотает throw!`,
            text: "У промиса .finally прозрачен, а вот return в блоке finally у try/catch подменяет результат и способен проглотить исключение — известная ловушка.",
            en: {
              title: "finally doesn't change the result",
              code: `promise.finally(() => cleanup());   // the value/error pass THROUGH unchanged
// but: a return inside a try/catch's finally block overwrites the result and swallows a throw!`,
              text: "A promise's .finally is transparent, but a return inside a try/catch's finally block replaces the result and can swallow an exception — a well-known trap.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> all (все или ошибка) / allSettled
              (всегда все) / race (первый любой) / any (первый успешный);
              ошибки — классы через extends Error, никаких пустых catch,
              отмена — AbortController.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> all (everything or an error) /
              allSettled (always everything) / race (the first to settle) /
              any (the first to succeed); errors — classes via extends Error,
              no empty catches, cancellation via AbortController.
            </>
          }
        />
      </div>
    </>
  );
}
