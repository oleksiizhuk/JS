import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  CodeBlock,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function Modules() {
  return (
    <>
      <InterviewQuestion en="What's the difference between ESM and CommonJS? What is tree shaking and how does it work?">
        Чем ESM отличается от CommonJS? Что такое tree shaking и за счёт чего
        он работает?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "CommonJS (require/module.exports) is Node's original system:{" "}
            <b>dynamic</b> — require() is a regular function call, you can put
            it inside an if, and it hands you a <b>value copy</b> of what was
            exported at that moment, synchronously. ESM (import/export) is the
            language standard: imports are <b>static</b> — declared at the top
            level, analyzable <b>before execution</b> — and exports are{" "}
            <b>live bindings</b>, a live reference rather than a copy. That
            static nature is exactly what enables <b>tree shaking</b>: the
            bundler builds the full module graph ahead of time, sees which
            exports are actually used, and drops the rest. That's also why
            static import can't be conditional — for that there's dynamic{" "}
            <b>import()</b>, which returns a promise and gives us{" "}
            <b>code splitting</b>: a route or a heavy component ships as a
            separate chunk (React.lazy). In practice: I write named exports
            (default objects kill tree shaking), mind the{" "}
            <b>sideEffects</b> field in package.json, and remember the interop
            rule — ESM can import CJS, but CJS can't require() an ES module
            synchronously."
          </>
        }
      >
        «CommonJS (require/module.exports) — историческая система Node:
        <b> динамическая</b> — require() это обычный вызов функции, его можно
        положить в if, и он синхронно отдаёт <b>копию значения</b> на момент
        экспорта. ESM (import/export) — стандарт языка: импорты{" "}
        <b>статические</b> — объявляются на верхнем уровне и анализируются{" "}
        <b>до выполнения</b>, а экспорты — это <b>live bindings</b>, живая
        ссылка, а не копия. Именно статичность даёт <b>tree shaking</b>:
        бандлер заранее строит полный граф модулей, видит, какие экспорты
        реально используются, и выбрасывает остальное. Поэтому же статический
        import нельзя сделать условным — для этого есть динамический{" "}
        <b>import()</b>, который возвращает промис и даёт{" "}
        <b>code splitting</b>: роут или тяжёлый компонент уезжает отдельным
        чанком (React.lazy). На практике: пишу именованные экспорты (default
        с объектом убивает tree shaking), слежу за полем <b>sideEffects</b> в
        package.json и помню правило интеропа — ESM умеет импортировать CJS,
        а CJS синхронно затребовать ES-модуль не может.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <Demo
        title="Динамический import() и live bindings — вживую"
        code={`// Модуль прямо в data: URL — чтобы пощупать import() в браузере
const src = "export let count = 0; export const inc = () => { count++; };";
const url = "data:text/javascript," + encodeURIComponent(src);

const m = await import(url);   // динамический импорт: промис с модулем
console.log(m.count);          // 0
m.inc();                       // модуль меняет СВОЮ переменную...
console.log(m.count);          // 1 — live binding: мы видим изменение!

const again = await import(url);
console.log(again.count);      // 1 — модуль исполняется ОДИН раз (кэш)
console.log(again === m);      // true — тот же инстанс из module map`}
        run={(log) => {
          const src =
            "export let count = 0; export const inc = () => { count++; };";
          const url = "data:text/javascript," + encodeURIComponent(src);
          const dynamicImport = new Function("u", "return import(u)");
          dynamicImport(url).then((m) => {
            log(m.count);
            m.inc();
            log(m.count);
            dynamicImport(url).then((again) => {
              log(again.count);
              log(again === m);
            });
          });
        }}
        hint="Два факта в одном демо: экспорт ESM — живая ссылка (CJS отдал бы копию 0), и модуль кэшируется — повторный import того же URL не исполняет код заново."
        en={{
          title: "Dynamic import() and live bindings — hands-on",
          code: `// A module right in a data: URL — to touch import() in the browser
const src = "export let count = 0; export const inc = () => { count++; };";
const url = "data:text/javascript," + encodeURIComponent(src);

const m = await import(url);   // dynamic import: a promise with the module
console.log(m.count);          // 0
m.inc();                       // the module changes ITS OWN variable...
console.log(m.count);          // 1 — live binding: we see the change!

const again = await import(url);
console.log(again.count);      // 1 — the module runs ONCE (cached)
console.log(again === m);      // true — same instance from the module map`,
          hint: "Two facts in one demo: an ESM export is a live reference (CJS would hand you a copy of 0), and modules are cached — re-importing the same URL doesn't re-run the code.",
        }}
      />

      <div className="card">
        <h3>
          <L ru="ESM vs CommonJS: смысловые различия" en="ESM vs CommonJS: the real differences" />
        </h3>
        <CodeBlock
          ru={`//                         CommonJS            ESM
// синтаксис               require / exports   import / export
// разрешается             в РАНТАЙМЕ          ДО выполнения (статически)
// условный импорт         можно (if)          только через import()
// экспорт                 копия значения      live binding (ссылка)
// загрузка                синхронная          асинхронная (top-level await!)
// this в модуле           module.exports      undefined
// строгий режим           нет по умолчанию    всегда strict

// Копия vs live binding:
// CJS:  let count = 0;  exports.count = count;   // экспортировалась КОПИЯ
//       inc() внутри модуля НЕ изменит exports.count у импортёра
// ESM:  export let count = 0;                    // экспортировалось ИМЯ
//       импортёр всегда видит актуальное значение (демо выше)

// Интероп: ESM → CJS работает (default = module.exports),
// CJS → ESM синхронно НЕЛЬЗЯ (только await import()) —
// поэтому «ESM-only» пакеты ломают require()-проекты`}
          en={`//                         CommonJS            ESM
// syntax                  require / exports   import / export
// resolved                at RUNTIME          BEFORE execution (statically)
// conditional import      allowed (if)        only via import()
// export                  value copy          live binding (reference)
// loading                 synchronous         asynchronous (top-level await!)
// this in a module        module.exports      undefined
// strict mode             off by default      always strict

// Copy vs live binding:
// CJS:  let count = 0;  exports.count = count;   // a COPY was exported
//       inc() inside the module does NOT change the importer's exports.count
// ESM:  export let count = 0;                    // the NAME was exported
//       the importer always sees the current value (demo above)

// Interop: ESM → CJS works (default = module.exports),
// CJS → ESM synchronously is IMPOSSIBLE (only await import()) —
// which is why "ESM-only" packages break require()-based projects`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Tree shaking: почему он требует ESM"
            en="Tree shaking: why it requires ESM"
          />
        </h3>
        <CodeBlock
          ru={`// utils.js
export function used() { /* ... */ }
export function unused() { /* ... */ }   // ← выпадет из бандла

// app.js
import { used } from "./utils.js";
// Бандлер ДО выполнения видит: unused никто не импортировал → выбросить.
// С require так нельзя: require("./utils")[name] — что взяли, известно
// только в рантайме, приходится тащить всё.

// Что ЛОМАЕТ tree shaking:
export default { used, unused };   // ❌ default-объект: берут весь объект
import * as utils from "./utils";  // ⚠️ ok, если обращения статические
import "./styles.css";             // side effect — нельзя выбросить

// package.json библиотеки:
{ "sideEffects": false }           // «мои модули чистые — шейкай смело»
{ "sideEffects": ["*.css"] }       // кроме CSS: их импорт — эффект`}
          en={`// utils.js
export function used() { /* ... */ }
export function unused() { /* ... */ }   // ← gets dropped from the bundle

// app.js
import { used } from "./utils.js";
// BEFORE execution the bundler sees: nobody imports unused → drop it.
// You can't do that with require: require("./utils")[name] — what's used
// is only known at runtime, so everything must be kept.

// What BREAKS tree shaking:
export default { used, unused };   // ❌ default object: the whole object is taken
import * as utils from "./utils";  // ⚠️ fine if the accesses are static
import "./styles.css";             // a side effect — can't be dropped

// A library's package.json:
{ "sideEffects": false }           // "my modules are pure — shake freely"
{ "sideEffects": ["*.css"] }       // except CSS: importing it IS the effect`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Code splitting: import() в React"
            en="Code splitting: import() in React"
          />
        </h3>
        <CodeBlock
          ru={`// Статический import попадает в ГЛАВНЫЙ чанк. Динамический — в свой:
const Chart = lazy(() => import("./HeavyChart.jsx"));  // отдельный файл

<Suspense fallback={<Spinner />}>
  {showChart && <Chart data={data} />}   // чанк грузится при первом показе
</Suspense>

// Типовые границы сплита:
// - роуты (каждая страница — свой чанк)
// - тяжёлые редкие фичи: график, редактор, PDF-вьювер
// - модалки/визарды, которые открывает меньшинство пользователей
// Vite/rolldown делает это автоматически по границам import()`}
          en={`// A static import lands in the MAIN chunk. A dynamic one gets its own:
const Chart = lazy(() => import("./HeavyChart.jsx"));  // separate file

<Suspense fallback={<Spinner />}>
  {showChart && <Chart data={data} />}   // the chunk loads on first show
</Suspense>

// Typical split boundaries:
// - routes (each page is its own chunk)
// - heavy rare features: a chart, an editor, a PDF viewer
// - modals/wizards that only a minority of users ever open
// Vite/rolldown does this automatically along import() boundaries`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Почему import нельзя положить в if?»",
            code: `if (isAdmin) {
  import { adminTools } from "./admin";   // ❌ SyntaxError
}
// ✅ const { adminTools } = await import("./admin");`,
            text: "Статические импорты разрешаются до выполнения кода — на этом стоит весь статический анализ (tree shaking, циклы, линтеры). Условная загрузка — задача динамического import().",
            en: {
              title: '"Why can\'t import go inside an if?"',
              code: `if (isAdmin) {
  import { adminTools } from "./admin";   // ❌ SyntaxError
}
// ✅ const { adminTools } = await import("./admin");`,
              text: "Static imports are resolved before the code runs — all static analysis (tree shaking, cycles, linters) rests on that. Conditional loading is dynamic import()'s job.",
            },
          },
          {
            title: "CJS экспортирует копию, ESM — ссылку",
            code: `// counter.cjs
let count = 0;
exports.count = count;                 // копия числа НА МОМЕНТ экспорта
exports.inc = () => { count++; };      // меняет локальную переменную
// importer: inc(); console.log(mod.count)  // 0 — копия не обновилась!`,
            text: "Классика собеса. В ESM импортёр видел бы 1 (live binding — см. демо). В CJS рабочий паттерн — экспортировать объект и мутировать его поля или экспортировать геттер.",
            en: {
              title: "CJS exports a copy, ESM exports a reference",
              code: `// counter.cjs
let count = 0;
exports.count = count;                 // a copy of the number AT export time
exports.inc = () => { count++; };      // mutates the local variable
// importer: inc(); console.log(mod.count)  // 0 — the copy never updated!`,
              text: "An interview classic. In ESM the importer would see 1 (live binding — see the demo). The working CJS pattern is exporting an object and mutating its fields, or exporting a getter.",
            },
          },
          {
            title: "export default { a, b } убивает tree shaking",
            code: `// ❌ берут «весь объект» — бандлер не докажет, что b не нужен
export default { formatDate, formatMoney };
// ✅ именованные экспорты шейкаются по одному
export { formatDate, formatMoney };`,
            text: "Свойства объекта — не статические экспорты: обращение obj[key] может быть каким угодно. Поэтому утилиты и библиотеки пишут именованными экспортами.",
            en: {
              title: "export default { a, b } kills tree shaking",
              code: `// ❌ "the whole object" is taken — the bundler can't prove b is unused
export default { formatDate, formatMoney };
// ✅ named exports shake one by one
export { formatDate, formatMoney };`,
              text: "Object properties aren't static exports: an obj[key] access could be anything. That's why utilities and libraries are written with named exports.",
            },
          },
          {
            title: "Barrel-файлы (index.js с реэкспортами)",
            code: `// components/index.js
export * from "./Button"; export * from "./Modal"; // ...50 штук
// import { Button } from "@/components" ТЯНЕТ весь barrel:
// без идеального sideEffects бандлер оставит и Modal, и остальные`,
            text: "Удобные импорты ценой бандла и скорости dev-сервера: один импорт из barrel затягивает граф всех реэкспортов. На больших проектах barrel-файлы часто запрещают линтером.",
            en: {
              title: "Barrel files (index.js full of re-exports)",
              code: `// components/index.js
export * from "./Button"; export * from "./Modal"; // ...50 of them
// import { Button } from "@/components" PULLS the whole barrel:
// without perfect sideEffects the bundler keeps Modal and the rest too`,
              text: "Convenient imports paid for with bundle size and dev-server speed: one barrel import drags in the graph of every re-export. Large projects often ban barrels via a lint rule.",
            },
          },
          {
            title: "Циклические импорты: ESM не падает, но…",
            code: `// a.js: import { b } from "./b.js"; export const a = "A";
// b.js: import { a } from "./a.js"; export const b = "B" + a;
// цикл: b.js исполняется ПЕРВЫМ до конца a.js →
// a ещё в TDZ → ReferenceError (или undefined для var/function-хойста)`,
            text: "Модуль в цикле получает частично инициализированного соседа. Лечится разрывом цикла: вынести общее в третий модуль, отложить обращение внутрь функции.",
            en: {
              title: "Circular imports: ESM doesn't crash, but…",
              code: `// a.js: import { b } from "./b.js"; export const a = "A";
// b.js: import { a } from "./a.js"; export const b = "B" + a;
// the cycle: b.js runs FIRST, before a.js finishes →
// a is still in the TDZ → ReferenceError (or undefined with var/function hoisting)`,
              text: "A module inside a cycle gets a partially initialized neighbor. The cure is breaking the cycle: hoist the shared part into a third module, or defer the access into a function body.",
            },
          },
        ]}
      />

      <div className="redflag">
        <b>
          <L
            ru="⚠️ Red flag: «ESM и CommonJS — это просто разный синтаксис»."
            en={`⚠️ Red flag: "ESM and CommonJS are just different syntax".`}
          />
        </b>
        <br />
        <L
          ru={
            <>
              Почему: различия семантические, и на них стоит инфраструктура —
              статический анализ (tree shaking, code splitting), live bindings
              против копий, асинхронная загрузка (top-level await), интероп с
              его односторонним ограничением. Правильная формулировка: «ESM
              статичен и анализируем до выполнения — поэтому бандлер может
              выбрасывать неиспользуемый код и резать чанки; CJS динамичен, и
              для него это в общем случае невозможно».
            </>
          }
          en={
            <>
              Why: the differences are semantic, and tooling stands on them —
              static analysis (tree shaking, code splitting), live bindings vs
              copies, asynchronous loading (top-level await), interop with its
              one-way restriction. The right phrasing: "ESM is static and
              analyzable before execution — that's what lets the bundler drop
              unused code and split chunks; CJS is dynamic, which makes that
              impossible in the general case."
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> ESM статичен (анализ до выполнения →
              tree shaking, code splitting) и экспортирует live bindings; CJS
              динамичен и отдаёт копии синхронно; условная загрузка —
              import(), для библиотек — именованные экспорты + sideEffects.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> ESM is static (analyzed before execution
              → tree shaking, code splitting) and exports live bindings; CJS is
              dynamic and hands out copies synchronously; conditional loading
              is import(), and libraries want named exports + sideEffects.
            </>
          }
        />
      </div>
    </>
  );
}
