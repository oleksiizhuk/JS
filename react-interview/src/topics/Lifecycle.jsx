import {
  Component,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { InterviewQuestion, ModelAnswer, CodeBlock, L } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

// Небольшой хелпер: выбрать ru/en строку по языку (для лог-сообщений
// внутри интерактивных демо-компонентов, где текст — не JSX, а строка стора).
function t(lang, ru, en) {
  return lang === "en" ? en : ru;
}

// Модульная переменная — язык для static-методов класса (getDerivedStateFromError
// не имеет доступа ни к props, ни к context: он статический и вызывается без
// инстанса). Синхронизируется эффектом в Lifecycle при каждом изменении lang.
let currentLang = "ru";

// ─────────────────────────────────────────────────────────────
// Лог во ВНЕШНЕМ сторе (не в state), чтобы записи из render-фазы
// не вызывали лишних ре-рендеров демо-компонентов.
// ─────────────────────────────────────────────────────────────
function createLogStore(prefix) {
  let lines = [];
  const subs = new Set();
  const notify = () => queueMicrotask(() => subs.forEach((f) => f()));
  return {
    log(msg) {
      lines = [...lines, `${lines.length + 1}. ${msg}`];
      console.log(`[${prefix}] ${msg}`);
      notify();
    },
    clear() {
      lines = [];
      notify();
    },
    subscribe(f) {
      subs.add(f);
      return () => subs.delete(f);
    },
    get: () => lines,
  };
}

const clsStore = createLogStore("class");
const fnStore = createLogStore("fn");
const errStore = createLogStore("error");

function LogPanel({ store }) {
  const lang = useLang();
  const lines = useSyncExternalStore(store.subscribe, store.get);
  return (
    <div className="log">
      {lines.length ? lines.join("\n") : t(lang, "— нажми Mount —", "— click Mount —")}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// КЛАССОВЫЙ компонент — ПОЛНЫЙ жизненный цикл
// ─────────────────────────────────────────────────────────────
const CLASS_CODE_RU = `class Full extends Component {
  constructor(props)                 // 1 (mount): инициализация state, bind
  static getDerivedStateFromProps()  // 2 (mount) и 1 (update): props → state, редко нужен
  shouldComponentUpdate(nextP, nextS)// 2 (update): вернуть false = пропустить рендер
  render()                           // 3: чистое построение JSX
  getSnapshotBeforeUpdate(pP, pS)    // 4 (update): читаем DOM ДО обновления (scroll)
  // ---- React применяет изменения к DOM ----
  componentDidMount()                // 5 (mount): DOM готов — запросы, подписки
  componentDidUpdate(pP, pS, snap)   // 5 (update): реакция на изменения, snapshot из ↑
  componentWillUnmount()             // unmount: отписки, clearTimeout
}`;

const CLASS_CODE_EN = `class Full extends Component {
  constructor(props)                 // 1 (mount): init state, bind
  static getDerivedStateFromProps()  // 2 (mount) and 1 (update): props → state, rarely needed
  shouldComponentUpdate(nextP, nextS)// 2 (update): return false = skip render
  render()                           // 3: pure JSX construction
  getSnapshotBeforeUpdate(pP, pS)    // 4 (update): read DOM BEFORE update (scroll)
  // ---- React applies the changes to the DOM ----
  componentDidMount()                // 5 (mount): DOM is ready — requests, subscriptions
  componentDidUpdate(pP, pS, snap)   // 5 (update): react to changes, snapshot from ↑
  componentWillUnmount()             // unmount: unsubscribe, clearTimeout
}`;

class ClassChild extends Component {
  constructor(props) {
    super(props);
    this.state = { n: 0 };
    clsStore.log(
      t(props.lang, "constructor — создание, начальный state", "constructor — creation, initial state")
    );
  }
  static getDerivedStateFromProps(props, state) {
    clsStore.log(
      t(
        props.lang,
        "static getDerivedStateFromProps — props → state (до каждого render)",
        "static getDerivedStateFromProps — props → state (before every render)"
      )
    );
    return null; // null = state не меняем
  }
  shouldComponentUpdate(nextProps, nextState) {
    clsStore.log(
      t(
        this.props.lang,
        `shouldComponentUpdate — рендерить? (n: ${this.state.n} → ${nextState.n}) → true`,
        `shouldComponentUpdate — should we render? (n: ${this.state.n} → ${nextState.n}) → true`
      )
    );
    return true; // false бы ОТМЕНИЛ рендер (ручная оптимизация, аналог memo)
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    clsStore.log(
      t(
        this.props.lang,
        "getSnapshotBeforeUpdate — читаем старый DOM, вернём snapshot",
        "getSnapshotBeforeUpdate — read the old DOM, return a snapshot"
      )
    );
    return t(this.props.lang, `snapshot(n был ${prevState.n})`, `snapshot(n was ${prevState.n})`);
  }
  componentDidMount() {
    clsStore.log(
      t(
        this.props.lang,
        "componentDidMount — компонент в DOM (запросы, подписки)",
        "componentDidMount — component is in the DOM (requests, subscriptions)"
      )
    );
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    clsStore.log(
      t(
        this.props.lang,
        `componentDidUpdate — DOM обновлён, получил "${snapshot}"`,
        `componentDidUpdate — DOM updated, received "${snapshot}"`
      )
    );
  }
  componentWillUnmount() {
    clsStore.log(
      t(this.props.lang, "componentWillUnmount — уборка перед удалением", "componentWillUnmount — cleanup before removal")
    );
  }
  render() {
    clsStore.log(
      t(this.props.lang, `render — строим JSX (n=${this.state.n})`, `render — building JSX (n=${this.state.n})`)
    );
    return (
      <button
        className="btn"
        onClick={() => this.setState({ n: this.state.n + 1 })}
      >
        setState: n = {this.state.n}
      </button>
    );
  }
}

// ─────────────────────────────────────────────────────────────
// ФУНКЦИОНАЛЬНЫЙ компонент — те же этапы через хуки
// ─────────────────────────────────────────────────────────────
const FN_CODE_RU = `function FnChild() {
  const [n, setN] = useState(0);
  // тело функции = render-фаза (должно быть чистым)

  useLayoutEffect(() => {           // после DOM-мутаций, ДО отрисовки кадра
    return () => {/* cleanup */};
  }, []);

  useEffect(() => {                 // ≈ componentDidMount (но ПОСЛЕ отрисовки!)
    return () => {/* ≈ componentWillUnmount */};
  }, []);

  useEffect(() => {                 // ≈ componentDidUpdate по n
    return () => {/* cleanup ПЕРЕД следующим запуском */};
  }, [n]);
}`;

const FN_CODE_EN = `function FnChild() {
  const [n, setN] = useState(0);
  // function body = render phase (must be pure)

  useLayoutEffect(() => {           // after DOM mutations, BEFORE paint
    return () => {/* cleanup */};
  }, []);

  useEffect(() => {                 // ≈ componentDidMount (but AFTER paint!)
    return () => {/* ≈ componentWillUnmount */};
  }, []);

  useEffect(() => {                 // ≈ componentDidUpdate on n
    return () => {/* cleanup BEFORE the next run */};
  }, [n]);
}`;

function FnChild() {
  const lang = useLang();
  const [n, setN] = useState(0);
  fnStore.log(t(lang, `тело функции = render (n=${n})`, `function body = render (n=${n})`));

  useLayoutEffect(() => {
    fnStore.log(
      t(lang, "useLayoutEffect [] — DOM обновлён, браузер ЕЩЁ не отрисовал", "useLayoutEffect [] — DOM updated, browser hasn't painted YET")
    );
    return () => fnStore.log(t(lang, "cleanup useLayoutEffect []", "cleanup useLayoutEffect []"));
  }, []);

  useEffect(() => {
    fnStore.log(t(lang, "useEffect [] — после отрисовки (≈ didMount)", "useEffect [] — after paint (≈ didMount)"));
    return () => fnStore.log(t(lang, "cleanup useEffect [] (≈ willUnmount)", "cleanup useEffect [] (≈ willUnmount)"));
  }, []);

  useEffect(() => {
    fnStore.log(
      n === 0
        ? t(lang, "useEffect [n] — ПЕРВЫЙ запуск (на mount, не update!)", "useEffect [n] — FIRST run (on mount, not update!)")
        : t(lang, `useEffect [n] — ≈ didUpdate (n=${n})`, `useEffect [n] — ≈ didUpdate (n=${n})`)
    );
    return () =>
      fnStore.log(
        t(lang, `cleanup useEffect [n] — прибираем за прошлым n=${n}`, `cleanup useEffect [n] — cleaning up after previous n=${n}`)
      );
  }, [n]);

  return (
    <button className="btn" onClick={() => setN(n + 1)}>
      setState: n = {n}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ERROR BOUNDARY — только классы умеют ловить ошибки рендера
// ─────────────────────────────────────────────────────────────
const ERR_CODE_RU = `class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {   // 1: во время render-фазы
    return { hasError: true };               //    переключаем на fallback-UI
  }
  componentDidCatch(error, info) {           // 2: после коммита
    logToSentry(error, info.componentStack); //    сайд-эффекты: логирование
  }
  render() {
    if (this.state.hasError) return <h4>⚠️ Что-то сломалось</h4>;
    return this.props.children;
  }
}`;

const ERR_CODE_EN = `class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {   // 1: during the render phase
    return { hasError: true };               //    switch to fallback UI
  }
  componentDidCatch(error, info) {           // 2: after commit
    logToSentry(error, info.componentStack); //    side effects: logging
  }
  render() {
    if (this.state.hasError) return <h4>⚠️ Something broke</h4>;
    return this.props.children;
  }
}`;

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    errStore.log(
      t(
        currentLang,
        `static getDerivedStateFromError("${error.message}") → показываем fallback`,
        `static getDerivedStateFromError("${error.message}") → showing fallback`
      )
    );
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    errStore.log(
      t(
        this.props.lang,
        "componentDidCatch — логируем (Sentry и т.п.), есть componentStack",
        "componentDidCatch — logging (Sentry etc.), componentStack is available"
      )
    );
  }
  reset = () => {
    errStore.clear();
    this.setState({ hasError: false });
  };
  render() {
    if (this.state.hasError)
      return (
        <div>
          <p>{t(this.props.lang, "⚠️ Что-то сломалось (fallback UI)", "⚠️ Something broke (fallback UI)")}</p>
          <button className="btn" onClick={this.reset}>
            {t(this.props.lang, "Сбросить boundary", "Reset boundary")}
          </button>
        </div>
      );
    return this.props.children;
  }
}

function Bomb() {
  const lang = useLang();
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error(t(lang, "Бум! Ошибка в render", "Boom! Error during render"));
  return (
    <button className="btn" onClick={() => setBoom(true)}>
      {t(lang, "💣 Бросить ошибку в render", "💣 Throw an error in render")}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
export default function Lifecycle() {
  const lang = useLang();
  const [showClass, setShowClass] = useState(false);
  const [showFn, setShowFn] = useState(false);

  useEffect(() => {
    currentLang = lang;
  }, [lang]);

  return (
    <>
      <InterviewQuestion en="Walk me through the React component lifecycle — classes and hooks.">
        Расскажи про жизненный цикл компонента — классы и хуки.
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "For classes there are three phases. <b>Mount</b>: constructor →
            getDerivedStateFromProps → render → componentDidMount.
            <b> Update</b>: getDerivedStateFromProps → shouldComponentUpdate →
            render → getSnapshotBeforeUpdate → componentDidUpdate.
            <b> Unmount</b>: componentWillUnmount. Plus error boundaries —
            getDerivedStateFromError and componentDidCatch, still class-only.
            In function components the lifecycle is replaced by
            <b> synchronizing with effects</b>: useLayoutEffect runs after DOM
            mutations before paint, useEffect after paint, and cleanup runs
            before every next effect run and on unmount. Caveat: useEffect
            with [] is only roughly didMount — it's async, double-invoked in
            dev StrictMode, and captures the first render's state."
          </>
        }
      >
        «У классов три фазы. <b>Mount</b>: constructor →
        getDerivedStateFromProps → render → componentDidMount.
        <b> Update</b>: getDerivedStateFromProps → shouldComponentUpdate →
        render → getSnapshotBeforeUpdate → componentDidUpdate.
        <b> Unmount</b>: componentWillUnmount. Плюс error boundaries —
        getDerivedStateFromError и componentDidCatch, они до сих пор только
        классовые. В функциях lifecycle заменён <b>синхронизацией с
        эффектами</b>: useLayoutEffect — после DOM-мутаций до отрисовки,
        useEffect — после отрисовки, cleanup — перед каждым следующим запуском
        эффекта и при размонтировании. Оговорка: useEffect с [] — лишь
        примерный аналог didMount: он асинхронный, в dev StrictMode двойной и
        захватывает state первого рендера.»
      </ModelAnswer>

      <div className="card">
        <h3>
          <L ru="Порядок вызовов: что первое, что второе…" en="Call order: what happens first, what's next…" />
        </h3>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#eef2ff" }}>
              <th style={{ padding: "6px 10px" }}>#</th>
              <th style={{ padding: "6px 10px" }}>MOUNT</th>
              <th style={{ padding: "6px 10px" }}>UPDATE (setState/props)</th>
              <th style={{ padding: "6px 10px" }}>UNMOUNT</th>
              <th style={{ padding: "6px 10px" }}>
                <L ru="ОШИБКА в render" en="ERROR in render" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "constructor", "getDerivedStateFromProps", "componentWillUnmount", "getDerivedStateFromError"],
              ["2", "getDerivedStateFromProps", "shouldComponentUpdate", "", "render (fallback)"],
              ["3", "render", "render", "", "componentDidCatch"],
              ["4", "→ React пишет в DOM", "getSnapshotBeforeUpdate", "", ""],
              ["5", "componentDidMount", "→ React пишет в DOM", "", ""],
              ["6", "", "componentDidUpdate", "", ""],
            ].map((row, i) => (
              <tr key={i} style={{ borderTop: "1px solid #e3e5ec" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "6px 10px", fontFamily: j ? "monospace" : "inherit", fontSize: 13 }}>
                    {j === 1 || j === 4
                      ? cell === "→ React пишет в DOM"
                        ? <L ru={cell} en="→ React writes to the DOM" />
                        : cell
                      : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">
          <L
            ru="Хуки-эквиваленты: didMount ≈ useEffect [] (но позже по таймингу), didUpdate ≈ useEffect [deps], willUnmount ≈ cleanup, shouldComponentUpdate ≈ React.memo, getSnapshotBeforeUpdate ≈ useLayoutEffect. Аналога error boundary в хуках НЕТ — только класс или react-error-boundary."
            en="Hook equivalents: didMount ≈ useEffect [] (but later in timing), didUpdate ≈ useEffect [deps], willUnmount ≈ cleanup, shouldComponentUpdate ≈ React.memo, getSnapshotBeforeUpdate ≈ useLayoutEffect. There's no hook equivalent of an error boundary — only a class or react-error-boundary."
          />
        </p>
      </div>

      <div className="row">
        <div className="card">
          <h3>
            <L ru="Класс — полный цикл" en="Class — full lifecycle" />
          </h3>
          <CodeBlock ru={CLASS_CODE_RU} en={CLASS_CODE_EN} />
          <button
            className="btn primary"
            onClick={() => {
              if (!showClass) clsStore.clear();
              setShowClass(!showClass);
            }}
          >
            {showClass ? "Unmount" : "Mount"}
          </button>
          {showClass && <ClassChild lang={lang} />}
          <LogPanel store={clsStore} />
        </div>

        <div className="card">
          <h3>
            <L ru="Функция + хуки" en="Function + hooks" />
          </h3>
          <CodeBlock ru={FN_CODE_RU} en={FN_CODE_EN} />
          <button
            className="btn primary"
            onClick={() => {
              if (!showFn) fnStore.clear();
              setShowFn(!showFn);
            }}
          >
            {showFn ? "Unmount" : "Mount"}
          </button>
          {showFn && <FnChild />}
          <LogPanel store={fnStore} />
        </div>
      </div>

      <div className="card">
        <h3>
          <L ru="Error Boundary (живое демо)" en="Error Boundary (live demo)" />
        </h3>
        <CodeBlock ru={ERR_CODE_RU} en={ERR_CODE_EN} />
        <ErrorBoundary lang={lang}>
          <Bomb />
        </ErrorBoundary>
        <LogPanel store={errStore} />
        <p className="hint">
          <L
            ru="Жми 💣 — ошибка из render ребёнка поймается границей: сначала getDerivedStateFromError (переключить на fallback), потом componentDidCatch (залогировать). Boundary НЕ ловит: ошибки в обработчиках событий, в setTimeout/промисах, и свои собственные."
            en="Click 💣 — the error thrown in the child's render is caught by the boundary: first getDerivedStateFromError (switch to fallback), then componentDidCatch (log it). The boundary does NOT catch: errors in event handlers, in setTimeout/promises, or errors of its own."
          />
        </p>
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>⚠️ Red flag на собесе: «useEffect(fn, []) — это то же, что componentDidMount».</b>
              <br />Почему это неверно (и что ответить):
              <br />1) <b>Тайминг</b>: didMount — синхронно после коммита, ДО отрисовки кадра;
              useEffect — ПОСЛЕ отрисовки. Читаешь layout и меняешь state в useEffect —
              пользователь увидит мигание (для этого есть useLayoutEffect).
              <br />2) <b>StrictMode</b>: в dev React монтирует → размонтирует → монтирует
              повторно, эффект с [] сработает дважды. Код «один раз за жизнь» без
              cleanup (подписка, аналитика, fetch без abort) даст дубли — эффекты
              должны быть идемпотентными.
              <br />3) <b>Замыкание</b>: didMount видит this.props/this.state всегда
              актуальными; useEffect(fn, []) навсегда захватил props/state ПЕРВОГО
              рендера (stale closure).
              <br />Правильная формулировка: «useEffect — не lifecycle, а синхронизация
              с зависимостями; с [] он ПРИМЕРНО соответствует didMount, но асинхронный,
              в dev двойной и требует cleanup».
            </>
          }
          en={
            <>
              <b>⚠️ Interview red flag: "useEffect(fn, []) is the same as componentDidMount".</b>
              <br />Why that's wrong (and what to say instead):
              <br />1) <b>Timing</b>: didMount runs synchronously after commit, BEFORE the
              frame is painted; useEffect runs AFTER paint. Read layout and set state in
              useEffect and the user will see a flash (that's what useLayoutEffect is for).
              <br />2) <b>StrictMode</b>: in dev, React mounts → unmounts → mounts again,
              so an effect with [] fires twice. "Once per lifetime" code without cleanup
              (a subscription, analytics, a fetch without abort) produces duplicates —
              effects must be idempotent.
              <br />3) <b>Closures</b>: didMount always sees the current this.props/this.state;
              useEffect(fn, []) permanently captures the props/state from the FIRST
              render (a stale closure).
              <br />The correct framing: "useEffect isn't a lifecycle method, it's
              synchronization with dependencies; with [] it's ROUGHLY equivalent to
              didMount, but it's async, double-invoked in dev, and needs cleanup".
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> классы — методы по фазам
              (mount/update/unmount + error boundary), хуки — синхронизация с
              эффектами (useLayoutEffect до paint, useEffect после, cleanup перед
              следующим запуском и при unmount).
            </>
          }
          en={
            <>
              <b>One-line summary:</b> classes use phase methods
              (mount/update/unmount + error boundary), hooks synchronize with
              effects (useLayoutEffect before paint, useEffect after, cleanup
              before the next run and on unmount).
            </>
          }
        />
      </div>
    </>
  );
}
