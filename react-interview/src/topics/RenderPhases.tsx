import { memo, useState } from "react";
import { useRenderCount } from "./helpers";
import { InterviewQuestion, ModelAnswer, SectionTitle, L } from "./InterviewBlocks";

// Ребёнок без memo — рендерится «за компанию» с родителем
function PlainChild() {
  const renders = useRenderCount();
  return (
    <div>
      <L ru="обычный ребёнок" en="plain child" />{" "}
      <span className="badge">
        <L ru="рендеров: " en="renders: " />
        {renders}
      </span>
    </div>
  );
}

// Ребёнок в memo — рендерится только если изменились props
const MemoChild = memo(function MemoChild() {
  const renders = useRenderCount();
  return (
    <div>
      <L ru="memo-ребёнок" en="memo child" />{" "}
      <span className="badge">
        <L ru="рендеров: " en="renders: " />
        {renders}
      </span>
    </div>
  );
});

export default function RenderPhases() {
  const renders = useRenderCount();
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  return (
    <>
      <InterviewQuestion en="How does React render work? What triggers a re-render?">
        Как работает рендер в React? Что вызывает ре-рендер?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Two phases: <b>render</b> — pure and interruptible, React calls
            components and builds the new fiber tree in memory, and this work
            can be discarded; and <b>commit</b> — synchronous, changes are
            applied to the DOM, then layout effects run, then passive ones.
            Re-render triggers are three: own <b>state</b> change, a
            <b> parent's</b> re-render, and a change of <b>context</b> the
            component reads. Props changing is not a trigger by itself — the
            parent re-rendered and called the child again. Updates are
            <b> batched</b> — in React 18 automatically everywhere, including
            timeouts and promises. And setState with the same value bails out
            via Object.is — no render. Render also doesn't equal screen
            update: a component may render and commit nothing."
          </>
        }
      >
        «Две фазы: <b>render</b> — чистая и прерываемая: React вызывает
        компоненты и строит новое fiber-дерево в памяти, эта работа может быть
        отброшена; и <b>commit</b> — синхронная: изменения применяются к DOM,
        затем layout-эффекты, затем passive. Триггера ре-рендера три:
        изменение своего <b>state</b>, ре-рендер <b>родителя</b> и изменение
        читаемого <b>context</b>. Изменение props само по себе не триггер —
        это родитель перерендерился и вызвал ребёнка заново. Обновления
        <b> батчатся</b> — в React 18 автоматически везде, включая таймауты и
        промисы. А setState с тем же значением делает bail-out по Object.is —
        рендера нет. Render ≠ обновление экрана: компонент может
        отрендериться и ничего не закоммитить.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>
          <L ru="Родитель" en="Parent" />{" "}
          <span className="badge">
            <L ru="рендеров: " en="renders: " />
            {renders}
          </span>
        </h3>
        <p className="hint">count = {count}, flag = {String(flag)}</p>

        {/* 1. Batching: три setState → ОДИН рендер */}
        <button
          className="btn primary"
          onClick={() => {
            setCount((c) => c + 1);
            setCount((c) => c + 1);
            setFlag((f) => !f);
            // React 18: всё склеится в один ре-рендер (смотри на счётчик)
          }}
        >
          <L ru="Batching: 3 setState подряд" en="Batching: 3 setState in a row" />
        </button>

        {/* 2. Bail-out: то же значение по Object.is → рендера НЕТ */}
        <button className="btn" onClick={() => setCount(count)}>
          <L ru="Bail-out: setCount(тот же count)" en="Bail-out: setCount(the same count)" />
        </button>

        {/* 3. setState в setTimeout — в React 18 тоже батчится */}
        <button
          className="btn"
          onClick={() =>
            setTimeout(() => {
              setCount((c) => c + 1);
              setFlag((f) => !f);
            }, 0)
          }
        >
          <L ru="Batching в setTimeout (React 18)" en="Batching in setTimeout (React 18)" />
        </button>

        <PlainChild />
        <MemoChild />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> render (чистая, прерываемая) → commit
              (синхронная); триггеры — state / родитель / context; batching в 18
              везде; bail-out по Object.is. Проверь демо: «3 setState» = +1 рендер,
              «тот же count» = 0 рендеров.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> render (pure, interruptible) → commit
              (synchronous); triggers are state / parent / context; batching
              is everywhere in 18; bail-out via Object.is. Check the demo: "3
              setState" = +1 render, "the same count" = 0 renders.
            </>
          }
        />
      </div>

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: «компонент ре-рендерится, когда меняются props».</b>
              <br />Почему неверно: нет механизма, который «следит» за props. Ребёнок
              ре-рендерится потому, что ре-рендерился РОДИТЕЛЬ и вызвал функцию ребёнка
              заново — независимо от того, изменились props или нет (демо выше:
              PlainChild рендерится при каждом клике, хотя props у него вообще нет).
              Следствия, которые надо уметь объяснить: (а) React.memo существует именно
              чтобы ДОБАВИТЬ сравнение props, которого по умолчанию нет; (б) children,
              созданные снаружи, не ре-рендерятся при изменении state обёртки;
              (в) «почему рендерится, хотя props те же» — потому что так и задумано.
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: "a component re-renders when its props change".</b>
              <br />Why that's wrong: there's no mechanism that "watches" props. A
              child re-renders because its PARENT re-rendered and called the
              child function again — regardless of whether props changed or
              not (see the demo above: PlainChild renders on every click even
              though it has no props at all). Consequences you should be able
              to explain: (a) React.memo exists precisely to ADD a props
              comparison, which doesn't exist by default; (b) children created
              outside a wrapper don't re-render when the wrapper's state
              changes; (c) "why does it render if props are the same" —
              because that's the intended design.
            </>
          }
        />
      </div>
    </>
  );
}
