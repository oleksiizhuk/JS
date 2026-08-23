import { useState } from "react";
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "../InterviewBlocks.jsx";
import { useLang } from "../../LangContext.jsx";

// Имитация API
const fakeApi = () =>
  new Promise((resolve) => setTimeout(() => resolve({ name: "Olex", id: 7 }), 900));

export default function SideEffects() {
  const lang = useLang();
  const [state, setState] = useState({ status: "idle", user: null });
  const [log, setLog] = useState([]);
  const note = (m) => setLog((l) => [...l, m]);

  // Thunk-паттерн: функция, которая получает dispatch и делает async-работу,
  // диспатча обычные "фактовые" actions на каждом этапе
  const fetchUser = () => async (dispatch) => {
    dispatch({ type: "user/pending" });
    try {
      const user = await fakeApi();
      dispatch({ type: "user/fulfilled", payload: user });
    } catch (e) {
      dispatch({ type: "user/rejected", error: e.message });
    }
  };

  const dispatch = (action) => {
    if (typeof action === "function") {
      note(
        lang === "en"
          ? "dispatch(function) → middleware intercepted it, called thunk(dispatch)"
          : "dispatch(функция) → middleware перехватил, вызвал thunk(dispatch)"
      );
      return action(dispatch); // то, что делает redux-thunk middleware
    }
    note(`dispatch → ${JSON.stringify(action)}`);
    if (action.type === "user/pending") setState({ status: "loading", user: null });
    if (action.type === "user/fulfilled") setState({ status: "done", user: action.payload });
  };

  return (
    <>
      <InterviewQuestion en="Where do side effects live in Redux? How do async requests work?">
        Где в Redux живут side effects? Как работают асинхронные запросы?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Reducers are pure and synchronous, so side effects live in
            <b> middleware</b> — the layer between dispatch and the reducer.
            The simplest is <b>redux-thunk</b>: you dispatch a function, the
            middleware calls it with dispatch and getState, and inside you
            await the API and dispatch plain fact-actions —
            pending/fulfilled/rejected. In RTK that's <b>createAsyncThunk</b>,
            which generates all three action types for you.
            <b> redux-saga</b> uses generators for complex flows —
            cancellation, races, debounce. And for server data specifically
            the modern answer is <b>RTK Query</b> (or TanStack Query): caching,
            invalidation and loading states out of the box, so you stop
            hand-writing pending/fulfilled reducers at all."
          </>
        }
      >
        «Reducer-ы чистые и синхронные, поэтому side effects живут в
        <b> middleware</b> — прослойке между dispatch и reducer-ом. Простейший —
        <b> redux-thunk</b>: диспатчишь функцию, middleware вызывает её с
        dispatch и getState, внутри await-ишь API и диспатчишь обычные
        фактовые actions — pending/fulfilled/rejected. В RTK это
        <b> createAsyncThunk</b>, который генерирует все три типа за тебя.
        <b> redux-saga</b> — генераторы для сложных потоков: отмена, гонки,
        debounce. А конкретно для серверных данных современный ответ —
        <b> RTK Query</b> (или TanStack Query): кэш, инвалидация и статусы
        загрузки из коробки, руками pending/fulfilled больше не пишем.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>
          <L
            ru="Проблема: reducer-ы ЧИСТЫЕ — где жить запросам?"
            en="The problem: reducers are PURE — where do requests live?"
          />
        </h3>
        <CodeBlock
          ru={`// ❌ так нельзя — reducer должен быть чистым и синхронным
function reducer(state, action) {
  const data = await fetch(...);  // мутации, запросы, random — запрещено
}`}
          en={`// ❌ not allowed — a reducer must be pure and synchronous
function reducer(state, action) {
  const data = await fetch(...);  // mutations, requests, random — forbidden
}`}
        />
        <p className="hint">
          <L
            ru={
              <>
                Ответ Redux: side effects живут в <b>middleware</b> —
                прослойке между dispatch и reducer. Самая простая —
                redux-thunk.
              </>
            }
            en={
              <>
                Redux's answer: side effects live in <b>middleware</b> — the
                layer between dispatch and the reducer. The simplest one is
                redux-thunk.
              </>
            }
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="Thunk вживую: pending → fulfilled" en="Thunk in action: pending → fulfilled" /></h3>
        <CodeBlock
          ru={`const fetchUser = () => async (dispatch) => {
  dispatch({ type: "user/pending" });
  try {
    const user = await api.getUser();
    dispatch({ type: "user/fulfilled", payload: user });
  } catch (e) {
    dispatch({ type: "user/rejected", error: e.message });
  }
};
// компонент: dispatch(fetchUser()) — диспатчим ФУНКЦИЮ`}
          en={`const fetchUser = () => async (dispatch) => {
  dispatch({ type: "user/pending" });
  try {
    const user = await api.getUser();
    dispatch({ type: "user/fulfilled", payload: user });
  } catch (e) {
    dispatch({ type: "user/rejected", error: e.message });
  }
};
// component: dispatch(fetchUser()) — we dispatch a FUNCTION`}
        />
        <button
          className="btn primary"
          disabled={state.status === "loading"}
          onClick={() => dispatch(fetchUser())}
        >
          {state.status === "loading" ? (
            <L ru="⏳ грузим..." en="⏳ loading..." />
          ) : (
            "dispatch(fetchUser())"
          )}
        </button>
        <p>
          status: <b>{state.status}</b> | user: <b>{state.user ? state.user.name : "—"}</b>
        </p>
        <div className="log">
          {log.length ? log.join("\n") : <L ru="— жми кнопку —" en="— click the button —" />}
        </div>
      </div>

      <div className="card">
        <h3><L ru="Зоопарк решений" en="The zoo of solutions" /></h3>
        <CodeBlock
          ru={`redux-thunk   — диспатчишь функцию; просто, для 90% случаев (встроен в RTK)
redux-saga    — генераторы, декларативные эффекты; сложные потоки (отмена, гонки)
RTK Query     — данные с сервера: кэш, инвалидация, лоадинги ИЗ КОРОБКИ
listener middleware (RTK) — «когда пришёл action X — сделай Y», замена простых саг`}
          en={`redux-thunk   — dispatch a function; simple, covers 90% of cases (built into RTK)
redux-saga    — generators, declarative effects; complex flows (cancellation, races)
RTK Query     — data from the server: cache, invalidation, loading states OUT OF THE BOX
listener middleware (RTK) — "when action X arrives, do Y", a replacement for simple sagas`}
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> эффекты — в middleware: thunk для
              90% случаев (createAsyncThunk в RTK), saga для сложных потоков,
              RTK Query — для серверного кэша.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> effects live in middleware: thunk
              covers 90% of cases (createAsyncThunk in RTK), saga for complex
              flows, RTK Query for server-side caching.
            </>
          }
        />
      </div>
    </>
  );
}
