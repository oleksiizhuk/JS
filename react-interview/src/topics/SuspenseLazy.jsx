import { Suspense, lazy, useState } from "react";
import { useLang } from "../LangContext.jsx";
import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, L, CodeBlock } from "./InterviewBlocks.jsx";

// Компонент, который «загружается» с задержкой — имитация динамического импорта
const HeavyChart = lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: () => (
              <div style={{ padding: 12, background: "#eef2ff", borderRadius: 8 }}>
                <L
                  ru="📊 Тяжёлый компонент загружен (в реальности — отдельный чанк)"
                  en="📊 Heavy component loaded (in reality, a separate chunk)"
                />
              </div>
            ),
          }),
        1200
      )
    )
);

export default function SuspenseLazy() {
  const [show, setShow] = useState(false);
  const lang = useLang();

  return (
    <>
      <InterviewQuestion en="What are Suspense and lazy for? How do they work together?">
        Зачем нужны Suspense и lazy? Как они работают вместе?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "<b>lazy</b> takes a dynamic import and returns a component whose
            code the bundler puts into a <b>separate chunk</b>, downloaded only
            when the component first renders — that's code splitting, and it
            cuts the initial bundle. While the chunk is loading, the component
            <b> suspends</b>, and that's where <b>Suspense</b> comes in: it's a
            boundary that renders a fallback while anything below it is
            suspended. The key idea is that Suspense is <b>not only about
            lazy</b> — it's a general mechanism for "this subtree isn't ready
            yet": data-fetching libraries and the use() hook in React 19 suspend
            the same way, so loading states move from a dozen isLoading flags to
            one declarative boundary. In practice I place boundaries by UX
            granularity — one per route, plus separate ones around heavy widgets
            so a slow chart doesn't hold back the whole page — and combine them
            with an error boundary, since a failed chunk download is an error,
            not a loading state."
          </>
        }
      >
        «<b>lazy</b> принимает динамический импорт и возвращает компонент, код
        которого бандлер выносит в <b>отдельный чанк</b>, скачиваемый только при
        первом рендере этого компонента — это code splitting, он уменьшает
        начальный бандл. Пока чанк грузится, компонент <b>приостанавливается</b>,
        и тут вступает <b>Suspense</b>: это граница, которая показывает fallback,
        пока что-то под ней приостановлено. Ключевая мысль — Suspense <b>не
        только про lazy</b>: это общий механизм «это поддерево ещё не готово», и
        библиотеки загрузки данных вместе с хуком use() в React 19
        приостанавливаются так же, поэтому состояния загрузки переезжают из
        десятка isLoading-флагов в одну декларативную границу. На практике я
        расставляю границы по UX-гранулярности — одна на маршрут плюс отдельные
        вокруг тяжёлых виджетов, чтобы медленный график не держал всю
        страницу — и сочетаю их с error boundary, потому что упавшая загрузка
        чанка это ошибка, а не загрузка.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3><L ru="Живое демо: lazy + Suspense" en="Live demo: lazy + Suspense" /></h3>
        <CodeBlock
          ru={`const HeavyChart = lazy(() => import("./HeavyChart"));   // отдельный чанк

<Suspense fallback={<Spinner />}>
  {show && <HeavyChart />}     {/* грузится при ПЕРВОМ рендере */}
</Suspense>`}
          en={`const HeavyChart = lazy(() => import("./HeavyChart"));   // a separate chunk

<Suspense fallback={<Spinner />}>
  {show && <HeavyChart />}     {/* loads on the FIRST render */}
</Suspense>`}
        />
        <button className="btn primary" onClick={() => setShow(!show)}>
          {lang === "en"
            ? show
              ? "Remove component"
              : "Show (load ~1.2s)"
            : show
              ? "Убрать компонент"
              : "Показать (загрузка ~1.2с)"}
        </button>
        <Suspense
          fallback={
            <div style={{ padding: 12, color: "#667" }}>
              <L ru="⏳ Загружаю чанк…" en="⏳ Loading chunk…" />
            </div>
          }
        >
          {show && <HeavyChart />}
        </Suspense>
        <p className="hint">
          <L
            ru="Первый показ — виден fallback, пока «скачивается» чанк. Повторный — мгновенный: модуль уже в памяти, второй раз не грузится."
            en="On the first show you see the fallback while the chunk is “downloading”. On repeat shows it's instant — the module is already in memory and doesn't load again."
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="Где ставить границы" en="Where to place boundaries" /></h3>
        <CodeBlock
          ru={`// ❌ одна граница на всё приложение: любой медленный кусок
//    держит весь экран в спиннере
<Suspense fallback={<FullPageSpinner />}>
  <Header /> <Sidebar /> <Feed /> <Chart />
</Suspense>

// ✅ границы по смыслу: шапка и сайдбар видны сразу,
//    каждый тяжёлый блок грузится под своим скелетоном
<Header />
<Sidebar />
<Suspense fallback={<FeedSkeleton />}>  <Feed />  </Suspense>
<Suspense fallback={<ChartSkeleton />}> <Chart /> </Suspense>

// ✅ с обработкой ошибок загрузки
<ErrorBoundary fallback={<Retry />}>
  <Suspense fallback={<Skeleton />}>
    <Widget />
  </Suspense>
</ErrorBoundary>`}
          en={`// ❌ one boundary for the whole app: any slow piece
//    holds the entire screen in a spinner
<Suspense fallback={<FullPageSpinner />}>
  <Header /> <Sidebar /> <Feed /> <Chart />
</Suspense>

// ✅ boundaries by meaning: header and sidebar show immediately,
//    each heavy block loads under its own skeleton
<Header />
<Sidebar />
<Suspense fallback={<FeedSkeleton />}>  <Feed />  </Suspense>
<Suspense fallback={<ChartSkeleton />}> <Chart /> </Suspense>

// ✅ with load-error handling
<ErrorBoundary fallback={<Retry />}>
  <Suspense fallback={<Skeleton />}>
    <Widget />
  </Suspense>
</ErrorBoundary>`}
        />
      </div>

      <div className="card">
        <h3><L ru="Suspense — не только про lazy" en="Suspense isn't only about lazy" /></h3>
        <CodeBlock
          ru={`// React 19: хук use() приостанавливает компонент на промисе
function Profile({ userPromise }) {
  const user = use(userPromise);      // подвиснет, пока промис не зарезолвится
  return <b>{user.name}</b>;
}
<Suspense fallback={<Skeleton />}><Profile userPromise={p} /></Suspense>

// Тот же механизм используют:
//   React.lazy           — загрузка кода
//   use() / RSC          — загрузка данных
//   TanStack Query (suspense: true), Relay
//   startTransition      — не даёт fallback моргнуть при обновлении`}
          en={`// React 19: the use() hook suspends the component on a promise
function Profile({ userPromise }) {
  const user = use(userPromise);      // suspends until the promise resolves
  return <b>{user.name}</b>;
}
<Suspense fallback={<Skeleton />}><Profile userPromise={p} /></Suspense>

// The same mechanism is used by:
//   React.lazy            — code loading
//   use() / RSC           — data loading
//   TanStack Query (suspense: true), Relay
//   startTransition       — keeps the fallback from flashing on updates`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Чанк не загрузился (сеть/деплой) — что увидит юзер?",
            code: `// ChunkLoadError — это ОШИБКА, а не «загрузка»:
// Suspense покажет fallback навсегда? Нет — промис РЕДЖЕКТИТСЯ
// → нужна error boundary вокруг:
<ErrorBoundary fallback={<Retry onRetry={reload} />}>
  <Suspense fallback={<Skeleton />}><Page /></Suspense>
</ErrorBoundary>`,
            text: "Классика прода: выкатили новую версию, у юзера старый HTML со ссылками на удалённые чанки. Suspense + error boundary — обязательная пара, retry — перезагрузкой страницы.",
            en: {
              title: "Chunk failed to load (network/deploy) — what does the user see?",
              code: `// ChunkLoadError is an ERROR, not "loading":
// Will Suspense show the fallback forever? No — the promise REJECTS
// → you need an error boundary around it:
<ErrorBoundary fallback={<Retry onRetry={reload} />}>
  <Suspense fallback={<Skeleton />}><Page /></Suspense>
</ErrorBoundary>`,
              text: "A production classic: you ship a new version, and the user's stale HTML still links to chunks that no longer exist. Suspense + error boundary is a mandatory pair; retry means reloading the page.",
            },
          },
          {
            title: "Fallback «моргает» при переходах",
            code: `// Данные уже показаны, юзер кликнул фильтр → всё дерево
// снова suspend → контент ЗАМЕНИЛСЯ спиннером (плохой UX)
startTransition(() => setFilter(f));
// transition говорит React: покажи СТАРОЕ, пока готовится новое`,
            text: "Suspense + transitions работают в паре: без transition каждое обновление данных роняет готовый UI в fallback. Это и есть их совместный дизайн в React 18+.",
            en: {
              title: "The fallback \"flashes\" on transitions",
              code: `// Data is already shown, user clicks a filter → the whole tree
// suspends again → content got REPLACED by a spinner (bad UX)
startTransition(() => setFilter(f));
// transition tells React: keep showing the OLD content while the new one is ready`,
              text: "Suspense and transitions work as a pair: without a transition, every data update drops the finished UI back into the fallback. That is exactly their joint design in React 18+.",
            },
          },
          {
            title: "Named exports и lazy",
            code: `lazy(() => import("./Chart"));            // ждёт DEFAULT export
// файл экспортирует export function Chart? →
lazy(() => import("./Chart").then(m => ({ default: m.Chart })));`,
            text: "lazy требует модуль с default. Для named — обёртка с .then. Частая ошибка «lazy is not a function / undefined».",
            en: {
              title: "Named exports and lazy",
              code: `lazy(() => import("./Chart"));            // expects a DEFAULT export
// the file has \`export function Chart\` instead? →
lazy(() => import("./Chart").then(m => ({ default: m.Chart })));`,
              text: "lazy requires a module with a default export. For named exports, wrap it with .then. A common error is \"lazy is not a function / undefined\".",
            },
          },
          {
            title: "Где грузится чанк: при рендере или при импорте?",
            code: `const C = lazy(() => import("./C"));  // тут НИЧЕГО не грузится
{show && <C />}                        // ← загрузка стартует ЗДЕСЬ
// а можно раньше: onMouseEnter={() => import("./C")} — прелоад`,
            text: "Динамический import внутри lazy ленивый: сеть дёргается при первом рендере компонента. Прелоад по hover/viewport — дешёвый способ спрятать задержку.",
            en: {
              title: "When does the chunk load: on render or on import?",
              code: `const C = lazy(() => import("./C"));  // NOTHING loads here
{show && <C />}                        // ← loading starts HERE
// or earlier: onMouseEnter={() => import("./C")} — preload`,
              text: "The dynamic import inside lazy is lazy: the network request fires on the component's first render. Preloading on hover/viewport is a cheap way to hide the delay.",
            },
          },
        ]}
      />

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: «Suspense заменяет isLoading в useEffect».</b>
              <br />Почему не так просто: обычный useEffect + fetch <b>не
              приостанавливает</b> компонент — Suspense про него ничего не знает и
              fallback не покажет. Чтобы работал Suspense, источник данных должен
              уметь «бросать» промис: use(), RSC, Relay, TanStack Query в suspense-режиме.
              Второй нюанс: <b>lazy нельзя объявлять внутри компонента</b> —
              <code>const C = lazy(...)</code> в теле рендера создаёт новый тип
              каждый раз, и React ремаунтит поддерево бесконечно.
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: “Suspense replaces isLoading in useEffect.”</b>
              <br />Why it's not that simple: a plain useEffect + fetch does
              <b> not suspend</b> the component — Suspense knows nothing about
              it and won't show the fallback. For Suspense to work, the data
              source has to be able to “throw” a promise: use(), RSC, Relay,
              TanStack Query in suspense mode. Second subtlety: <b>lazy can't
              be declared inside a component</b> — <code>const C = lazy(...)</code>{" "}
              in the render body creates a new type every time, and React
              remounts the subtree forever.
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> lazy = отдельный чанк по требованию,
              Suspense = декларативная граница «поддерево не готово» (работает и для
              данных через use()/RSC); границы ставить по UX и оборачивать в error
              boundary.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> lazy = a separate chunk on demand,
              Suspense = a declarative “subtree isn't ready” boundary (also works for
              data via use()/RSC); place boundaries by UX and wrap them in an
              error boundary.
            </>
          }
        />
      </div>
    </>
  );
}
