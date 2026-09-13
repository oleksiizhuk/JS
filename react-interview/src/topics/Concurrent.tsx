import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { useLang } from "../LangContext";
import { useRenderCount } from "./helpers";
import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, L, CodeBlock } from "./InterviewBlocks";

// Намеренно медленный список: 3000 элементов с фильтрацией
const ITEMS = Array.from({ length: 3000 }, (_, i) => `Элемент №${i}`);
const ITEMS_EN = Array.from({ length: 3000 }, (_, i) => `Item #${i}`);

function SlowList({ query }: { query: string }) {
  const lang = useLang();
  const renders = useRenderCount();
  const filtered = useMemo(() => {
    const start = performance.now();
    while (performance.now() - start < 120); // имитация тяжёлого рендера
    const list = lang === "en" ? ITEMS_EN : ITEMS;
    return list.filter((x) => x.includes(query)).slice(0, 5);
  }, [query, lang]);

  return (
    <div>
      <span className="badge">
        {lang === "en" ? "list renders: " : "рендеров списка: "}
        {renders}
      </span>
      <ul style={{ paddingLeft: 18 }}>
        {filtered.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Concurrent() {
  const lang = useLang();
  const [urgent, setUrgent] = useState(""); // то, что видит инпут — мгновенно
  const [listQuery, setListQuery] = useState(""); // то, по чему фильтруем
  const [isPending, startTransition] = useTransition();

  const [plain, setPlain] = useState("");
  const deferred = useDeferredValue(plain);

  return (
    <>
      <InterviewQuestion en="What are useTransition and useDeferredValue for? What is concurrent rendering?">
        Зачем нужны useTransition и useDeferredValue? Что такое concurrent rendering?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Concurrent rendering means React can render <b>interruptibly</b>:
            it starts building a tree, and if something more urgent arrives —
            typing, a click — it pauses or throws that work away and handles the
            urgent update first. To use it I mark updates by priority.
            <b> useTransition</b> wraps a state update in startTransition,
            marking it as <b>non-urgent</b>: the input keeps updating instantly
            while the heavy list re-renders in the background, and isPending
            lets me show a subtle indicator. <b>useDeferredValue</b> is the same
            idea from the other end — I don't control the update, so I take a
            value and get a <b>lagging copy</b> of it, passing the fresh one to
            the input and the deferred one to the expensive subtree. The key
            point for an interview: neither makes anything <b>faster</b> — the
            work is the same. They change <b>priority</b>, so the interface
            stops freezing under the user's fingers. And they only help when the
            slowness is React rendering; a slow network or a heavy synchronous
            loop isn't fixed by them."
          </>
        }
      >
        «Concurrent rendering означает, что React умеет рендерить
        <b> прерываемо</b>: он начинает строить дерево, и если прилетает что-то
        срочное — ввод, клик — он приостанавливает или выбрасывает эту работу и
        сначала обрабатывает срочное обновление. Чтобы этим пользоваться, я
        размечаю обновления по приоритету. <b>useTransition</b> оборачивает
        изменение state в startTransition, помечая его <b>несрочным</b>: инпут
        продолжает обновляться мгновенно, пока тяжёлый список перерисовывается в
        фоне, а isPending позволяет показать неброский индикатор.
        <b> useDeferredValue</b> — та же идея с другой стороны: когда я не
        управляю обновлением, я беру значение и получаю его <b>отстающую
        копию</b>, отдавая свежее в инпут, а отложенное — в дорогое поддерево.
        Главное для собеса: ни то, ни другое не делает работу <b>быстрее</b> —
        объём тот же. Они меняют <b>приоритет</b>, чтобы интерфейс перестал
        зависать под пальцами. И помогают они только когда тормозит именно
        рендер React; медленную сеть или тяжёлый синхронный цикл этим не
        починишь.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3><L ru="useTransition: инпут не залипает" en="useTransition: the input never sticks" /></h3>
        <CodeBlock
          ru={`const [isPending, startTransition] = useTransition();

<input
  value={urgent}
  onChange={(e) => {
    setUrgent(e.target.value);                    // СРОЧНО: буквы в инпуте
    startTransition(() => setListQuery(e.target.value)); // НЕсрочно: список
  }}
/>
{isPending && <span>обновляю…</span>}
<SlowList query={listQuery} />`}
          en={`const [isPending, startTransition] = useTransition();

<input
  value={urgent}
  onChange={(e) => {
    setUrgent(e.target.value);                    // URGENT: letters in the input
    startTransition(() => setListQuery(e.target.value)); // NOT urgent: the list
  }}
/>
{isPending && <span>updating…</span>}
<SlowList query={listQuery} />`}
        />
        <input
          className="inp"
          placeholder={lang === "en" ? "type fast — letters never stick" : "печатай быстро — буквы не залипают"}
          value={urgent}
          onChange={(e) => {
            setUrgent(e.target.value);
            startTransition(() => setListQuery(e.target.value));
          }}
        />
        {isPending && (
          <span className="badge">
            <L ru="обновляю список…" en="updating list…" />
          </span>
        )}
        <SlowList query={listQuery} />
        <p className="hint">
          <L
            ru="Список намеренно тормозит ~120мс на рендер. Благодаря transition ввод остаётся отзывчивым: React бросает недорисованный список, когда прилетает новая буква."
            en="The list is intentionally slow — ~120ms per render. Thanks to the transition, the input stays responsive: React throws away the unfinished list render whenever a new letter arrives."
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="useDeferredValue: когда обновление не твоё" en="useDeferredValue: when the update isn't yours" /></h3>
        <CodeBlock
          ru={`const [plain, setPlain] = useState("");
const deferred = useDeferredValue(plain);   // «отстающая» копия

<input value={plain} onChange={e => setPlain(e.target.value)} />  {/* свежее */}
<SlowList query={deferred} />                                     {/* отложенное */}
// плюс можно показать «устаревание»: plain !== deferred`}
          en={`const [plain, setPlain] = useState("");
const deferred = useDeferredValue(plain);   // a "lagging" copy

<input value={plain} onChange={e => setPlain(e.target.value)} />  {/* fresh */}
<SlowList query={deferred} />                                     {/* deferred */}
// you can also show "staleness": plain !== deferred`}
        />
        <input
          className="inp"
          placeholder={lang === "en" ? "same idea, but via deferred" : "то же самое, но через deferred"}
          value={plain}
          onChange={(e) => setPlain(e.target.value)}
        />
        {plain !== deferred && (
          <span className="badge">
            <L ru="данные устарели…" en="data is stale…" />
          </span>
        )}
        <SlowList query={deferred} />
      </div>

      <div className="card">
        <h3><L ru="Что выбрать" en="Which one to pick" /></h3>
        <CodeBlock
          ru={`useTransition      — ты САМ вызываешь setState и можешь его обернуть
                     (переключение вкладки, применение фильтров, навигация)
useDeferredValue   — значение приходит извне (props, чужой state),
                     обернуть setState нельзя — тормозишь потребителя
Оба                — только про приоритет РЕНДЕРА, не про скорость сети

Не путать с debounce:
  debounce  — откладывает САМО ОБНОВЛЕНИЕ по таймеру (данные реально позже)
  deferred  — обновление происходит сразу, но рендер тяжёлой части
              прерываемый и уступает срочному вводу`}
          en={`useTransition      — YOU call setState yourself and can wrap it
                     (switching a tab, applying filters, navigation)
useDeferredValue   — the value comes from outside (props, someone else's state),
                     you can't wrap setState — you'd slow down the producer
Both               — only about RENDER priority, not network speed

Don't confuse with debounce:
  debounce  — delays the UPDATE ITSELF on a timer (data really arrives later)
  deferred  — the update happens immediately, but rendering the heavy part
              is interruptible and yields to urgent input`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Transition не помог — рендер всё равно виснет",
            code: `startTransition(() => setData(huge));
// внутри рендера: очень тяжёлый СИНХРОННЫЙ цикл в ОДНОМ компоненте
// → React может прервать рендер МЕЖДУ компонентами, но не ВНУТРИ одного`,
            text: "Прерываемость работает на границах компонентов. Один компонент с циклом на 500мс не прервать — разбивать на компоненты, мемоизировать, виртуализировать.",
            en: {
              title: "Transition didn't help — the render still freezes",
              code: `startTransition(() => setData(huge));
// inside the render: a very heavy SYNCHRONOUS loop in ONE component
// → React can interrupt a render BETWEEN components, but not INSIDE one`,
              text: "Interruptibility works at component boundaries. A single component with a 500ms loop can't be interrupted — split it into components, memoize, virtualize.",
            },
          },
          {
            title: "await внутри startTransition",
            code: `startTransition(async () => {
  const data = await fetchData();   // после await «транзишеновость»
  setData(data);                     // ТЕРЯЛАСЬ (до React 19)
});
// React 19: async transitions поддержаны, setState после await — ок`,
            text: "Классическая ловушка React 18: пометка действовала только на синхронную часть. В 19 async actions в transition — официальная фича (на ней стоят form actions).",
            en: {
              title: "await inside startTransition",
              code: `startTransition(async () => {
  const data = await fetchData();   // after await, "transition-ness"
  setData(data);                     // was LOST (before React 19)
});
// React 19: async transitions are supported, setState after await is fine`,
              text: "A classic React 18 trap: the marker only applied to the synchronous part. In React 19, async actions inside a transition are an official feature (form actions are built on it).",
            },
          },
          {
            title: "«Обёрнутый setState стал медленнее — это баг?»",
            code: `setUrgent(v);                       // применится сразу
startTransition(() => setList(v));  // применится ПОЗЖЕ, отдельным рендером
// это не баг: два обновления РАЗНЫХ приоритетов = два рендера`,
            text: "Transition намеренно расщепляет батч: срочное рендерится немедленно, несрочное — потом. Больше рендеров, но каждый быстрее воспринимается.",
            en: {
              title: "\"The wrapped setState got slower — is that a bug?\"",
              code: `setUrgent(v);                       // applies right away
startTransition(() => setList(v));  // applies LATER, as a separate render
// not a bug: two updates of DIFFERENT priorities = two renders`,
              text: "A transition intentionally splits the batch: the urgent part renders immediately, the non-urgent part later. More renders, but each one feels faster.",
            },
          },
          {
            title: "isPending vs plain !== deferred",
            code: `const [isPending, startTransition] = useTransition(); // свой флаг
const stale = value !== deferredValue;  // аналог для useDeferredValue`,
            text: "Оба способа показать «данные обновляются»: у transition флаг встроен, у deferred сравниваешь свежее с отстающим. Затемнение списка через opacity — стандартный приём.",
            en: {
              title: "isPending vs plain !== deferred",
              code: `const [isPending, startTransition] = useTransition(); // built-in flag
const stale = value !== deferredValue;  // the equivalent for useDeferredValue`,
              text: "Both are ways to show \"data is updating\": transition has a built-in flag, deferred means comparing the fresh value to the lagging one. Dimming the list via opacity is a standard trick.",
            },
          },
        ]}
      />

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: «useTransition ускоряет приложение».</b>
              <br />Почему: объём работы не меняется — тяжёлый рендер остаётся
              тяжёлым, он просто перестаёт блокировать ввод. Если список рендерится
              секунду, он и будет рендериться секунду (просто интерфейс не замрёт).
              Сначала — убрать саму тяжесть: мемоизация, виртуализация, меньше
              элементов; transition — поверх этого, а не вместо. И полезно знать
              механику: в React 18+ обновления имеют приоритеты, а StrictMode в dev
              специально вызывает рендер дважды, проверяя, что он чистый — иначе
              прерываемость была бы небезопасна.
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: “useTransition makes the app faster.”</b>
              <br />Why: the amount of work doesn't change — a heavy render stays
              heavy, it just stops blocking input. If a list takes a second to
              render, it still takes a second (the interface just won't freeze).
              First, remove the heaviness itself: memoization, virtualization,
              fewer elements; a transition is a layer on top of that, not a
              replacement. Also useful to know: in React 18+ updates carry
              priorities, and StrictMode in dev deliberately renders twice to
              verify the render is pure — otherwise interruptibility would be
              unsafe.
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> concurrent = прерываемый рендер;
              useTransition помечает своё обновление несрочным (+isPending),
              useDeferredValue даёт отстающую копию чужого значения; оба меняют
              приоритет, а не объём работы.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> concurrent = interruptible rendering;
              useTransition marks your own update as non-urgent (+isPending),
              useDeferredValue gives you a lagging copy of someone else's value;
              both change priority, not the amount of work.
            </>
          }
        />
      </div>
    </>
  );
}
