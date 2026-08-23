import { useState } from "react";
import { InterviewQuestion, ModelAnswer, SectionTitle, CodeBlock, L } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

const PURE_CODE_RU = `// Компонент = чистая функция: props → JSX, без сайд-эффектов в теле
const Sum = ({ a, b }) => <b>{a + b}</b>;

// Иммутабельные обновления = map/filter вместо мутаций
setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
setTodos(todos.filter(t => t.id !== id));

// Функции высшего порядка повсюду: HOC, hooks, обработчики
const makeHandler = (id) => () => remove(id);`;

const PURE_CODE_EN = `// A component = a pure function: props → JSX, no side effects in the body
const Sum = ({ a, b }) => <b>{a + b}</b>;

// Immutable updates = map/filter instead of mutations
setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
setTodos(todos.filter(t => t.id !== id));

// Higher-order functions are everywhere: HOC, hooks, handlers
const makeHandler = (id) => () => remove(id);`;

export default function FunctionalProgramming() {
  const lang = useLang();
  const [user, setUser] = useState({ name: "Olex", tags: ["js"] });
  const [log, setLog] = useState([]);
  const note = (m) => setLog((l) => [...l, m]);

  // ❌ МУТАЦИЯ: меняем существующий объект — ссылка та же,
  // React (и memo, и зависимости эффектов) не видят изменения
  const mutate = () => {
    user.tags.push("mutated!");
    setUser(user); // та же ссылка → Object.is → bail-out → ре-рендера НЕТ
    note(
      lang === "en"
        ? "mutate: push + setUser(same object) → UI didn't update (data is already corrupted!)"
        : "mutate: push + setUser(тот же объект) → UI не обновился (данные уже испорчены!)"
    );
  };

  // ✅ ИММУТАБЕЛЬНО: новый объект и новый массив
  const immutable = () => {
    setUser((u) => ({ ...u, tags: [...u.tags, "ok" + u.tags.length] }));
    note(lang === "en" ? "immutable: spread → new reference → UI updated" : "immutable: spread → новая ссылка → UI обновился");
  };

  return (
    <>
      <InterviewQuestion en="How does React use functional programming ideas?">
        Как React использует идеи функционального программирования?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "React is built on FP principles. A component is a <b>pure
            function</b> of props and state — no side effects in the render
            body; effects live in useEffect. State is <b>immutable</b>: to
            change means to create a new reference — spread, map, filter —
            because React compares by reference (Object.is), not by content.
            <b> Composition over inheritance</b> — components and functions
            compose, hooks and HOCs are higher-order functions. Why it
            matters: predictability, referential transparency makes
            memoization work (memo, useMemo compare references), and
            concurrent rendering can safely discard renders because they're
            pure — StrictMode even double-invokes renders to verify
            idempotency. The classic violation is mutating state in place:
            data changed, the reference didn't — the UI doesn't update."
          </>
        }
      >
        «React построен на принципах ФП. Компонент — <b>чистая функция</b> от
        props и state: без сайд-эффектов в теле рендера, эффекты — в
        useEffect. State <b>иммутабелен</b>: изменить = создать новую ссылку
        (spread, map, filter), потому что React сравнивает по ссылке
        (Object.is), а не по содержимому. <b>Композиция вместо наследования</b>:
        компоненты и функции компонуются, хуки и HOC — функции высшего
        порядка. Зачем это всё: предсказуемость, ссылочная прозрачность
        заставляет работать мемоизацию (memo и useMemo сравнивают ссылки),
        а concurrent-рендеринг может безопасно отбрасывать рендеры, потому
        что они чистые — StrictMode даже вызывает рендер дважды, проверяя
        идемпотентность. Классическое нарушение — мутация state на месте:
        данные изменились, ссылка нет — UI не обновился.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>Immutability</h3>
        <p>
          <L ru="user.tags на экране: " en="user.tags on screen: " />
          <b>[{user.tags.join(", ")}]</b>
        </p>
        <button className="btn" onClick={mutate}>
          {lang === "en" ? "❌ mutate" : "❌ мутировать"}
        </button>
        <button className="btn primary" onClick={immutable}>
          {lang === "en" ? "✅ immutable" : "✅ иммутабельно"}
        </button>
        <p className="hint">
          <L
            ru="после «мутировать» экран отстаёт от данных; нажми «иммутабельно» — и увидишь, что mutated! всё это время сидел в массиве"
            en="after clicking “mutate” the screen lags behind the data; click “immutable” — and you'll see that mutated! was sitting in the array the whole time"
          />
        </p>
        <div className="log">{log.join("\n") || (lang === "en" ? "— click the buttons —" : "— жми кнопки —")}</div>
      </div>

      <div className="card">
        <h3>
          <L ru="Чистые функции и FP-инструменты в React" en="Pure functions and FP tools in React" />
        </h3>
        <CodeBlock ru={PURE_CODE_RU} en={PURE_CODE_EN} />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> чистые компоненты + иммутабельный state
              (новая ссылка!) + эффекты вне render + композиция — благодаря этому
              работают мемоизация и concurrent rendering.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> pure components + immutable state (a
              new reference!) + effects outside render + composition — this
              is what makes memoization and concurrent rendering work.
            </>
          }
        />
      </div>

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: мутировать state напрямую (state.items.push(x); setState(state)).</b>
              <br />Почему: React сравнивает по ссылке (Object.is). Мутированный массив —
              ТА ЖЕ ссылка → bail-out, ре-рендера нет (демо выше). Хуже: даже если
              обновление случится по другой причине, memo-дети и useMemo с этим массивом
              в deps НЕ пересчитаются — ссылка-то не менялась. В concurrent-режиме
              мутация ещё опаснее: React может рендерить параллельно с мутацией.
              Итог — «призрачные» баги, воспроизводящиеся нестабильно. Правильно:
              всегда новая ссылка (spread, map, filter, toSorted) или Immer/RTK.
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: mutating state directly (state.items.push(x); setState(state)).</b>
              <br />Why: React compares by reference (Object.is). A mutated
              array is the SAME reference → bail-out, no re-render (demo
              above). Worse: even if an update happens for another reason,
              memo children and useMemo with that array in deps will NOT
              recompute — the reference never changed. In concurrent mode
              mutation is even more dangerous: React may render in parallel
              with the mutation. The result is "phantom" bugs that reproduce
              unreliably. The fix: always use a new reference (spread, map,
              filter, toSorted) or Immer/RTK.
            </>
          }
        />
      </div>
    </>
  );
}
