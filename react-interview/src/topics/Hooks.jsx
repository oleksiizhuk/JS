import { useEffect, useMemo, useRef, useState } from "react";
import { useRenderCount } from "./helpers.jsx";
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

// ── Кастомный хук: переиспользуемая логика со state
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function slowDouble(n) {
  const start = performance.now();
  while (performance.now() - start < 150); // имитация тяжёлого вычисления
  return n * 2;
}

// ── Stale closure: два одинаковых интервала, разные deps
function StaleClosureDemo() {
  const lang = useLang();
  const [count, setCount] = useState(0);
  const [brokenSees, setBrokenSees] = useState("—");
  const [fixedSees, setFixedSees] = useState("—");

  // ❌ []: колбэк интервала замкнул count ПЕРВОГО рендера — навсегда
  useEffect(() => {
    const id = setInterval(() => setBrokenSees(count), 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ [count]: на каждое изменение — cleanup старого + новый интервал
  //    со свежим замыканием (работает всегда ровно один — последний)
  useEffect(() => {
    const id = setInterval(() => setFixedSees(count), 500);
    return () => clearInterval(id);
  }, [count]);

  return (
    <>
      <button className="btn primary" onClick={() => setCount(count + 1)}>
        {lang === "en" ? `count + 1 → now ${count}` : `count + 1 → сейчас ${count}`}
      </button>
      <p>
        {lang === "en" ? "❌ interval with " : "❌ интервал с "}<code>[]</code>{lang === "en" ? " sees: " : " видит: "}<b>{String(brokenSees)}</b>
        <span className="hint">{lang === "en" ? " — locked onto the first render, click all you want" : " — замкнул первый рендер, кликай сколько хочешь"}</span>
      </p>
      <p>
        {lang === "en" ? "✅ interval with " : "✅ интервал с "}<code>[count]</code>{lang === "en" ? " sees: " : " видит: "}<b>{String(fixedSees)}</b>
        <span className="hint">{lang === "en" ? " — recreated with a fresh closure" : " — пересоздан со свежим замыканием"}</span>
      </p>
    </>
  );
}

export default function Hooks() {
  const lang = useLang();
  const renders = useRenderCount();

  // useState — состояние, изменение вызывает ре-рендер
  const [count, setCount] = useState(0);

  // useRef — «коробка», живёт между рендерами, изменение НЕ вызывает ре-рендер
  const clicks = useRef(0);

  // useMemo — кэш тяжёлого вычисления: пересчёт только при изменении count
  const [other, setOther] = useState(0);
  const doubled = useMemo(() => slowDouble(count), [count]);

  // кастомный хук
  const [nick, setNick] = useLocalStorage("nick", "");

  return (
    <>
      <InterviewQuestion en="What are hooks? What are the rules of hooks and why do they exist?">
        Что такое хуки? Какие правила хуков и почему они такие?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Hooks give function components state and lifecycle. Two rules:
            call them only at the <b>top level</b> — not in ifs or loops — and
            only from React functions. The reason is that hooks have no names:
            React matches them <b>by call order</b> in the fiber's linked
            list, so a skipped call would shift all subsequent hooks' state.
            The core set: useState, useEffect, useContext, <b>useRef</b> — a
            mutable box that doesn't trigger renders, <b>useMemo /
            useCallback</b> — caching values and function identities between
            renders (useCallback(fn, deps) is literally useMemo(() =&gt; fn,
            deps)), useReducer, useLayoutEffect. Custom hooks are logic reuse —
            each call gets its own state. Memoization isn't free — I use it
            when a function goes into a memo child, into deps, or the
            computation is genuinely heavy."
          </>
        }
      >
        «Хуки дают функциональным компонентам state и жизненный цикл. Два
        правила: вызывать только на <b>верхнем уровне</b> — не в if и циклах —
        и только из React-функций. Причина в том, что у хуков нет имён: React
        сопоставляет их <b>по порядку вызова</b> в списке fiber-а, и
        пропущенный вызов сдвинул бы state всех последующих. Базовый набор:
        useState, useEffect, useContext, <b>useRef</b> — мутабельная коробка
        без ре-рендера, <b>useMemo/useCallback</b> — кэш значений и
        идентичности функций между рендерами (useCallback(fn, deps) — это
        буквально useMemo(() =&gt; fn, deps)), useReducer, useLayoutEffect.
        Кастомные хуки — переиспользование логики, у каждого вызова свой
        state. Мемоизация не бесплатна — ставлю её, когда функция идёт в
        memo-ребёнка, в deps, или вычисление реально тяжёлое.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>useState vs useRef <span className="badge"><L ru={<>рендеров: {renders}</>} en={<>renders: {renders}</>} /></span></h3>
        <button className="btn primary" onClick={() => setCount(count + 1)}>
          {lang === "en" ? `state: ${count} (re-renders)` : `state: ${count} (рендерит)`}
        </button>
        <button className="btn" onClick={() => { clicks.current += 1; console.log("ref =", clicks.current); }}>
          {lang === "en" ? "ref: check the console (does NOT re-render)" : "ref: смотри console (НЕ рендерит)"}
        </button>
        <p className="hint">
          <L
            ru={<>ref копит значение молча — на экране оно обновится только при следующем
            рендере по другой причине. Сейчас ref = {clicks.current}</>}
            en={<>ref accumulates its value silently — on screen it will only update on
            the next render triggered by something else. Right now ref = {clicks.current}</>}
          />
        </p>
      </div>

      <div className="card">
        <h3>useMemo</h3>
        <p>slowDouble({count}) = {doubled} <span className="hint">(<L ru="вычисление ~150ms" en="computation ~150ms" />)</span></p>
        <button className="btn primary" onClick={() => setCount(count + 1)}>
          {lang === "en" ? "count+1 → recompute (noticeable pause)" : "count+1 → пересчёт (заметная пауза)"}
        </button>
        <button className="btn" onClick={() => setOther(other + 1)}>
          {lang === "en" ? `other+1 = ${other} → NO recompute (instant)` : `other+1 = ${other} → БЕЗ пересчёта (мгновенно)`}
        </button>
      </div>

      <div className="card">
        <h3><L ru="Stale closure: почему useEffect(fn, []) видит старый state" en="Stale closure: why useEffect(fn, []) sees stale state" /></h3>
        <CodeBlock
          ru={`// ❌ замкнул count первого рендера — печатает 0 навсегда
useEffect(() => {
  const id = setInterval(() => console.log(count), 500);
  return () => clearInterval(id);
}, []);

// ✅ честные deps: изменился count → cleanup старого интервала,
//    новый интервал со СВЕЖИМ замыканием (живёт всегда один)
useEffect(() => {
  const id = setInterval(() => console.log(count), 500);
  return () => clearInterval(id);
}, [count]);`}
          en={`// ❌ locked onto count from the first render — logs 0 forever
useEffect(() => {
  const id = setInterval(() => console.log(count), 500);
  return () => clearInterval(id);
}, []);

// ✅ honest deps: count changed → cleanup the old interval,
//    new interval with a FRESH closure (there's always exactly one alive)
useEffect(() => {
  const id = setInterval(() => console.log(count), 500);
  return () => clearInterval(id);
}, [count]);`}
        />
        <StaleClosureDemo />
        <p className="hint">
          <L
            ru={<>Механика: замыкание пересоздаётся КАЖДЫЙ рендер, но выполняется
            эффект только при изменении deps. Эффект видит значения того рендера,
            в котором был ЗАПУЩЕН. С [] — навсегда первого. Ещё фиксы:
            функциональный setCount(c =&gt; c + 1) или ref как «дырка» сквозь
            замыкания.</>}
            en={<>Mechanics: the closure is recreated on EVERY render, but the effect
            only runs when its deps change. The effect sees the values from the
            render it was LAUNCHED in. With [] — forever the first one. Other
            fixes: the functional setCount(c =&gt; c + 1), or a ref as a "hole"
            through closures.</>}
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="Кастомный хук useLocalStorage" en="Custom hook: useLocalStorage" /></h3>
        <input
          className="inp"
          placeholder={lang === "en" ? "nickname — survives F5" : "ник — переживёт F5"}
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
        <p className="hint"><L ru="обнови страницу — значение останется" en="refresh the page — the value stays" /></p>
      </div>

      <div className="explain">
        <L
          ru={<><b>Резюме одной строкой:</b> правила хуков — из-за сопоставления по
          порядку вызова; useRef — без ре-рендера; useCallback =
          useMemo(() =&gt; fn); мемоизация — по необходимости, не «на всякий».</>}
          en={<><b>One-line summary:</b> the rules of hooks exist because of matching
          by call order; useRef — no re-render; useCallback =
          useMemo(() =&gt; fn); memoization — on demand, not "just in case".</>}
        />
      </div>

      <div className="redflag">
        <L
          ru={<>
            <b>⚠️ Red flag: «оборачиваю всё в useCallback/useMemo на всякий случай».</b>
            <br />Почему: мемоизация не бесплатна — каждый useMemo это сравнение deps
            на каждом рендере + хранение прошлого значения в fiber. Для дешёвого
            вычисления или функции, которую никто не сравнивает по ссылке, это чистый
            overhead и шум. useCallback оправдан ровно в трёх случаях: функция идёт
            в React.memo-компонент, попадает в deps другого хука, или её идентичность
            важна внешней библиотеке. «На всякий случай» = не понимает, ЧТО защищает
            мемоизация (referential equality для downstream-сравнений). К тому же
            React Compiler мемоизирует автоматически — ручное «везде» устаревает.
          </>}
          en={<>
            <b>⚠️ Red flag: "I wrap everything in useCallback/useMemo just in case".</b>
            <br />Why: memoization isn't free — every useMemo compares deps on every
            render plus stores the previous value in the fiber. For a cheap
            computation or a function nobody compares by reference, that's pure
            overhead and noise. useCallback is justified in exactly three cases: the
            function goes into a React.memo component, lands in another hook's deps,
            or its identity matters to an external library. "Just in case" means not
            understanding WHAT memoization protects (referential equality for
            downstream comparisons). On top of that, the React Compiler memoizes
            automatically — manual "everywhere" is becoming obsolete.
          </>}
        />
      </div>
    </>
  );
}
