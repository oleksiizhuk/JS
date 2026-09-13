import { useState } from "react";
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "../InterviewBlocks";

// Ручной мини-стор для демонстрации принципов (реальный Redux — та же идея)
type CounterState = { count: number };
type CounterAction = { type: "increment" } | { type: "decrement" };
function counterReducer(state: CounterState = { count: 0 }, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 }; // новый объект, не мутация
    case "decrement":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

export default function ThreePrinciples() {
  const [state, setState] = useState({ count: 0 });
  const [log, setLog] = useState<string[]>([]);

  const dispatch = (action: CounterAction) => {
    setState((prev) => {
      const next = counterReducer(prev, action);
      setLog((l) => [
        ...l,
        `dispatch(${JSON.stringify(action)}) → state: ${JSON.stringify(next)}`,
      ]);
      return next;
    });
  };

  return (
    <>
      <InterviewQuestion en="What are the three principles of Redux?">
        Назови три принципа Redux.
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "First — <b>single source of truth</b>: the whole app state lives
            in one tree inside one store, which makes it easy to debug,
            serialize and restore. Second — <b>state is read-only</b>: the
            only way to change it is dispatching an action, a plain object
            describing what happened; no component writes to state directly.
            Third — <b>changes are made with pure functions</b>: reducers take
            (prevState, action) and return a new state without mutations or
            side effects. Everything Redux is loved for follows from these
            three: predictability, time-travel debugging in devtools, trivial
            reducer testing, and bug reproducibility from an action log."
          </>
        }
      >
        «Первый — <b>single source of truth</b>: всё состояние приложения — в
        одном дереве в одном сторе, поэтому его легко отлаживать,
        сериализовать и восстанавливать. Второй — <b>state только для
        чтения</b>: единственный способ изменить — dispatch action, простого
        объекта-факта «что произошло»; напрямую в state никто не пишет.
        Третий — <b>изменения чистыми функциями</b>: reducer принимает
        (prevState, action) и возвращает новый state без мутаций и
        сайд-эффектов. Из этих трёх следует всё, за что Redux любят:
        предсказуемость, time-travel в devtools, тривиальное тестирование
        reducer-ов и воспроизводимость багов по логу action-ов.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>1. Single source of truth</h3>
        <p className="hint">
          <L
            ru={
              <>
                Всё состояние приложения — в ОДНОМ дереве-объекте в одном
                сторе. Не раскидано по компонентам, сервисам и синглтонам —
                одно место, где «правда»: легко отлаживать, сериализовать,
                восстанавливать.
              </>
            }
            en={
              <>
                The entire application state lives in ONE tree-object inside
                ONE store. It isn't scattered across components, services and
                singletons — there's a single place holding "the truth": easy
                to debug, serialize, and restore.
              </>
            }
          />
        </p>
        <CodeBlock
          ru={`store.getState()
// { user: {...}, cart: {...}, ui: {...} } — вся правда здесь`}
          en={`store.getState()
// { user: {...}, cart: {...}, ui: {...} } — the whole truth lives here`}
        />
      </div>

      <div className="card">
        <h3>2. State is read-only</h3>
        <p className="hint">
          <L
            ru={
              <>
                Изменить состояние можно ТОЛЬКО отправив action — простой
                объект «что произошло». Ни один компонент не пишет в state
                напрямую.
              </>
            }
            en={
              <>
                State can only be changed by dispatching an action — a plain
                object describing "what happened". No component ever writes
                to state directly.
              </>
            }
          />
        </p>
        <p>
          count = <b>{state.count}</b>
        </p>
        <button className="btn primary" onClick={() => dispatch({ type: "increment" })}>
          dispatch({"{ type: 'increment' }"})
        </button>
        <button className="btn" onClick={() => dispatch({ type: "decrement" })}>
          dispatch({"{ type: 'decrement' }"})
        </button>
        <div className="log">
          {log.length ? log.join("\n") : <L ru="— жми dispatch —" en="— click dispatch —" />}
        </div>
      </div>

      <div className="card">
        <h3>3. Changes are made with pure functions</h3>
        <p className="hint">
          <L
            ru={
              <>
                Reducer — чистая функция (prevState, action) → newState: без
                мутаций, запросов, Date.now() и random. Одинаковый вход →
                одинаковый выход.
              </>
            }
            en={
              <>
                A reducer is a pure function (prevState, action) → newState:
                no mutations, no requests, no Date.now() or random. Same
                input in, same output out.
              </>
            }
          />
        </p>
        <CodeBlock
          ru={`function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 }; // НОВЫЙ объект
    default:
      return state; // незнакомый action → state без изменений
  }
}`}
          en={`function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 }; // a NEW object
    default:
      return state; // unknown action → state unchanged
  }
}`}
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> один стор — read-only state через
              dispatch — чистые reducer-ы; отсюда devtools, time-travel и
              тестируемость.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> one store — read-only state via
              dispatch — pure reducers; that's where devtools, time-travel,
              and testability come from.
            </>
          }
        />
      </div>
    </>
  );
}
