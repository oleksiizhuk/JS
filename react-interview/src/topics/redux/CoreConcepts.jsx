import { useState } from "react";
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "../InterviewBlocks.jsx";
import { useLang } from "../../LangContext.jsx";

// createStore своими руками — ~20 строк, любимый вопрос «а как Redux устроен внутри?»
function createStore(reducer) {
  let state = reducer(undefined, { type: "@@INIT" });
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((l) => l());
      return action;
    },
    subscribe(l) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

function todosReducer(state = { todos: [], filter: "all" }, action) {
  switch (action.type) {
    case "todos/added":
      return { ...state, todos: [...state.todos, action.payload] };
    case "todos/cleared":
      return { ...state, todos: [] };
    case "filter/changed":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

const store = createStore(todosReducer);

// Селекторы — функции чтения из state (инкапсулируют форму стора)
const selectCount = (s) => s.todos.length;
const selectLast = (s) => s.todos[s.todos.length - 1] ?? "—";

export default function CoreConcepts() {
  const lang = useLang();
  const [, force] = useState(0);
  const [log, setLog] = useState([]);
  const rerender = () => force((n) => n + 1);

  const send = (action) => {
    store.dispatch(action);
    setLog((l) => [...l, `dispatch → ${JSON.stringify(action)}`]);
    rerender();
  };

  const s = store.getState();

  return (
    <>
      <InterviewQuestion en="Core Redux concepts — store, action, reducer, selector. How does data flow?">
        Основные концепции Redux — store, action, reducer, selector. Как течёт поток данных?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Five concepts. <b>Store</b> holds the state tree and exposes
            getState/dispatch/subscribe. <b>Action</b> — a plain object-fact
            with type and payload. <b>Reducer</b> — a pure function
            (state, action) → newState. <b>Dispatch</b> — the only way to
            change state. <b>Selector</b> — a read function over a slice; it
            encapsulates the store shape and gets memoized with reselect.
            The flow is one-directional: UI dispatches an action → the reducer
            computes new state → subscribers are notified → UI re-reads
            through selectors. In react-redux, Provider passes the store via
            context, useSelector subscribes a component to a slice — it
            re-renders only when the selector result changes — and useDispatch
            returns dispatch. Under the hood a store is ~20 lines: a closure
            over state plus pub/sub."
          </>
        }
      >
        «Пять концепций. <b>Store</b> хранит дерево state и даёт
        getState/dispatch/subscribe. <b>Action</b> — простой объект-факт с
        type и payload. <b>Reducer</b> — чистая функция (state, action) →
        newState. <b>Dispatch</b> — единственный способ изменить state.
        <b> Selector</b> — функция чтения среза; инкапсулирует форму стора и
        мемоизируется через reselect. Поток однонаправленный: UI диспатчит
        action → reducer вычисляет новый state → подписчики уведомлены → UI
        перечитывает через селекторы. В react-redux: Provider передаёт стор
        через контекст, useSelector подписывает компонент на срез — ре-рендер
        только при изменении результата селектора, useDispatch отдаёт
        dispatch. Под капотом стор — это ~20 строк: замыкание над state плюс
        pub/sub.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3><L ru="Поток данных: один круг" en="Data flow: one loop" /></h3>
        <CodeBlock
          ru={`UI ──(событие)──▶ dispatch(action) ──▶ reducer(state, action) ──▶ новый state
▲                                                                    │
└──────────────── subscribe: UI перечитывает через селекторы ◀───────┘`}
          en={`UI ──(event)──▶ dispatch(action) ──▶ reducer(state, action) ──▶ new state
▲                                                                  │
└──────────────── subscribe: UI re-reads through selectors ◀───────┘`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="createStore своими руками (вопрос «как Redux внутри?»)"
            en={'createStore from scratch (the "how does Redux work internally?" question)'}
          />
        </h3>
        <CodeBlock
          ru={`function createStore(reducer) {
  let state = reducer(undefined, { type: "@@INIT" });
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);   // единственное место изменения
      listeners.forEach((l) => l());    // уведомить подписчиков
    },
    subscribe(l) {
      listeners.add(l);
      return () => listeners.delete(l); // отписка
    },
  };
}`}
          en={`function createStore(reducer) {
  let state = reducer(undefined, { type: "@@INIT" });
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);   // the only place state changes
      listeners.forEach((l) => l());    // notify subscribers
    },
    subscribe(l) {
      listeners.add(l);
      return () => listeners.delete(l); // unsubscribe
    },
  };
}`}
        />
        <p className="hint">
          <L
            ru="Весь Redux-стор — это замыкание над state + паттерн pub/sub."
            en="The entire Redux store is just a closure over state plus a pub/sub pattern."
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="Живое демо на этом сторе" en="Live demo on this store" /></h3>
        <button
          className="btn primary"
          onClick={() =>
            send({
              type: "todos/added",
              payload: (lang === "en" ? "task " : "задача ") + (selectCount(s) + 1),
            })
          }
        >
          dispatch(todos/added)
        </button>
        <button className="btn" onClick={() => send({ type: "todos/cleared" })}>
          dispatch(todos/cleared)
        </button>
        <p>
          selectCount → <b>{selectCount(s)}</b> | selectLast → <b>{String(selectLast(s))}</b>
        </p>
        <div className="log">
          {log.length ? log.join("\n") : <L ru="— жми dispatch —" en="— click dispatch —" />}
        </div>
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> store/action/reducer/dispatch/selector,
              однонаправленный поток; стор внутри — замыкание + pub/sub (см. код выше).
            </>
          }
          en={
            <>
              <b>One-line summary:</b> store/action/reducer/dispatch/selector,
              a one-directional flow; the store internally is a closure +
              pub/sub (see the code above).
            </>
          }
        />
      </div>
    </>
  );
}
