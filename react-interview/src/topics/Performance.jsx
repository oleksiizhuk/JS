import { memo, useCallback, useMemo, useState } from "react";
import { useRenderCount } from "./helpers.jsx";
import { InterviewQuestion, ModelAnswer, SectionTitle, CodeBlock, L } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

const Row = memo(function Row({ item, onSelect }) {
  const renders = useRenderCount();
  const lang = useLang();
  return (
    <li style={{ marginBottom: 4 }}>
      {item}{" "}
      <span className="badge">
        {lang === "en" ? "renders" : "рендеров"}: {renders}
      </span>{" "}
      <button className="btn" onClick={() => onSelect(item)}>
        {lang === "en" ? "select" : "выбрать"}
      </button>
    </li>
  );
});

const ITEMS = ["Alpha", "Beta", "Gamma"];

export default function Performance() {
  const renders = useRenderCount();
  const lang = useLang();
  const [selected, setSelected] = useState("");
  const [count, setCount] = useState(0);
  const [useStable, setUseStable] = useState(true);

  // ❌ новая функция каждый рендер → memo у Row бесполезен
  const unstableHandler = (item) => setSelected(item);

  // ✅ useCallback — та же ссылка между рендерами → memo работает
  const stableHandler = useCallback((item) => setSelected(item), []);

  const onSelect = useStable ? stableHandler : unstableHandler;

  // useMemo для производного значения — не пересчитывать на каждый рендер
  const shouted = useMemo(
    () => ITEMS.map((i) => i.toUpperCase()).join(" / "),
    [] // от state не зависит — считаем один раз
  );

  return (
    <>
      <InterviewQuestion en="The app is slow. How do you approach React performance?">
        Приложение тормозит. Как подходишь к производительности в React?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "First <b>measure, then fix</b> — React DevTools Profiler and
            why-did-you-render tell me what renders and why; without a
            diagnosis any memo is guesswork. Then the tool matches the cause.
            Extra re-renders: <b>React.memo plus stable references</b> —
            useCallback/useMemo, because memo compares props shallowly by
            reference. State architecture: <b>colocation</b> — push state down
            to narrow the re-render zone, or children-composition — children
            passed from outside don't re-render with the wrapper. Heavy
            updates: useTransition/useDeferredValue. Long lists:
            <b> virtualization</b> (react-window). Bundle: lazy + Suspense
            code splitting. And the React Compiler now automates memoization.
            Red flag answer is starting with 'wrap everything in memo' —
            that's treating a symptom without a diagnosis."
          </>
        }
      >
        «Сначала <b>измерить, потом лечить</b> — React DevTools Profiler и
        why-did-you-render показывают, что рендерится и почему; без диагноза
        любой memo — гадание. Дальше инструмент под причину. Лишние
        ре-рендеры: <b>React.memo + стабильные ссылки</b> —
        useCallback/useMemo, потому что memo сравнивает props поверхностно по
        ссылкам. Архитектура state: <b>colocation</b> — опустить state вниз,
        сузив зону ре-рендера, или children-композиция — дети, переданные
        снаружи, не рендерятся со своей обёрткой. Тяжёлые обновления:
        useTransition/useDeferredValue. Длинные списки: <b>виртуализация</b>
        (react-window). Бандл: lazy + Suspense. Ну и React Compiler теперь
        автоматизирует мемоизацию. Red flag — начинать с «оберну всё в memo»:
        лечение симптома без диагноза.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>
          React.memo + useCallback{" "}
          <span className="badge">
            {lang === "en" ? "parent" : "родитель"}: {renders}
          </span>
        </h3>
        <p className="hint">
          {lang === "en" ? "selected" : "выбран"}: {selected || "—"} | {shouted}
        </p>

        <label style={{ display: "block", margin: "8px 0" }}>
          <input
            type="checkbox"
            checked={useStable}
            onChange={(e) => setUseStable(e.target.checked)}
          />{" "}
          {lang === "en"
            ? "pass the handler through useCallback"
            : "передавать обработчик через useCallback"}
        </label>

        <button className="btn primary" onClick={() => setCount(count + 1)}>
          {lang === "en" ? "Re-render parent" : "Ре-рендер родителя"}: {count}
        </button>

        <ul style={{ paddingLeft: 18, marginTop: 10 }}>
          {ITEMS.map((item) => (
            <Row key={item} item={item} onSelect={onSelect} />
          ))}
        </ul>
        <p className="hint">
          <L
            ru="с галочкой: кнопка родителя НЕ рендерит строки (memo + стабильная ссылка). Сними галочку — строки рендерятся каждый раз: memo сравнил props, а onSelect — новая функция ≠ старая."
            en="with the checkbox on: the parent button does NOT re-render the rows (memo + a stable reference). Uncheck it — the rows re-render every time: memo compared props, and onSelect is a new function ≠ the old one."
          />
        </p>
        <p className="hint">
          <L
            ru={
              <>
                🔍 Открой браузерную console: <b>why-did-you-render</b> подключён и при
                снятой галочке ругается на Row — «props изменились по ссылке, но равны
                по значению» (onSelect). Это и есть сигнал «нужен useCallback».
              </>
            }
            en={
              <>
                🔍 Open the browser console: <b>why-did-you-render</b> is wired
                up and, with the checkbox off, complains about Row — "props
                changed by reference but are equal by value" (onSelect).
                That's exactly the signal that "you need useCallback".
              </>
            }
          />
        </p>
      </div>

      <div className="card">
        <h3>
          <L ru="Остальной чек-лист производительности" en="The rest of the performance checklist" />
        </h3>
        <CodeBlock
          ru={`// Ленивая загрузка — не грузить весь бандл сразу
const Heavy = lazy(() => import("./Heavy"));
<Suspense fallback={<Spinner />}><Heavy /></Suspense>

// Виртуализация длинных списков (react-window):
// рендерим только видимые ~20 строк из 10 000

// Ленивый начальный state — не вычислять на каждый рендер
useState(() => expensiveInit());

// Поиск проблем: React DevTools Profiler`}
          en={`// Lazy loading — don't ship the whole bundle upfront
const Heavy = lazy(() => import("./Heavy"));
<Suspense fallback={<Spinner />}><Heavy /></Suspense>

// Virtualizing long lists (react-window):
// render only the ~20 visible rows out of 10,000

// Lazy initial state — don't compute it on every render
useState(() => expensiveInit());

// Finding problems: React DevTools Profiler`}
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> измерь (Profiler/WDYR) → потом: memo +
              стабильные ссылки, colocation/children, useTransition, виртуализация,
              lazy; memo «на всякий случай» — антипаттерн.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> measure first (Profiler/WDYR) → then:
              memo + stable references, colocation/children, useTransition,
              virtualization, lazy; memo "just in case" is an anti-pattern.
            </>
          }
        />
      </div>

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: на вопрос «приложение тормозит» отвечать «оберну в memo».</b>
              <br />Почему: это лечение симптома без диагноза. Тормозить может что
              угодно: лишние ре-рендеры (тогда memo), тяжёлый JS на главном потоке
              (memo не поможет — разбивать работу), список на 2000 элементов без
              виртуализации, тяжёлые картинки, утечка памяти. Senior-ответ начинается
              с «откуда знаем, что тормозит, и что именно: fps, TTI, память?» —
              Profiler / why-did-you-render — и только потом инструмент под конкретную
              причину. Кто сразу тянется за memo, потратит неделю на мемоизацию и не
              ускорит ничего, потому что проблема была в ScrollView с 2000 строк.
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: answering "the app is slow" with "I'll wrap it
              in memo".</b>
              <br />Why: that's treating a symptom without a diagnosis.
              Slowness can come from anywhere: extra re-renders (then memo
              helps), heavy JS on the main thread (memo won't help — break up
              the work), a 2,000-item list without virtualization, heavy
              images, a memory leak. A senior answer starts with "how do we
              know it's slow, and what exactly: fps, TTI, memory?" — Profiler
              / why-did-you-render — and only then the tool that matches the
              actual cause. Whoever reaches for memo right away will spend a
              week memoizing and speed up nothing, because the problem was a
              2,000-row ScrollView.
            </>
          }
        />
      </div>
    </>
  );
}
