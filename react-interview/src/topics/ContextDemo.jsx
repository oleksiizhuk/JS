import { createContext, memo, useContext, useState } from "react";
import { useRenderCount } from "./helpers.jsx";
import { InterviewQuestion, ModelAnswer, SectionTitle, CodeBlock, L } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

const ThemeContext = createContext("light");

// ⚠️ ВСЕ три компонента обёрнуты в memo НАМЕРЕННО.
// Иначе они рендерились бы просто потому, что рендерится их родитель
// (владелец state theme) — и демо показывало бы не контекст, а обычный
// каскад рендеров сверху вниз (см. тему «Component render»).
// memo убирает этот эффект, оставляя ТОЛЬКО влияние контекста.

// Читает контекст → ре-рендерится при смене темы ДАЖЕ в memo:
// memo сравнивает props, но подписка на контекст его пробивает
const ThemedBox = memo(function ThemedBox() {
  const theme = useContext(ThemeContext);
  const renders = useRenderCount();
  const lang = useLang();
  const dark = theme === "dark";
  return (
    <div
      style={{
        padding: 12, borderRadius: 8, marginTop: 8,
        background: dark ? "#1a1a2e" : "#fff",
        color: dark ? "#fff" : "#1a1a2e",
        border: "1px solid #c7cad6",
      }}
    >
      {lang === "en" ? "reading context:" : "читаю контекст:"} {theme}{" "}
      <span className="badge">
        {lang === "en" ? "renders" : "рендеров"}: {renders}
      </span>
    </div>
  );
});

// НЕ читает контекст → в memo смена темы его не трогает
const IgnorantBox = memo(function IgnorantBox() {
  const renders = useRenderCount();
  const lang = useLang();
  return (
    <div style={{ padding: 12, borderRadius: 8, marginTop: 8, border: "1px dashed #c7cad6" }}>
      {lang === "en" ? "not reading context" : "не читаю контекст"}{" "}
      <span className="badge">
        {lang === "en" ? "renders" : "рендеров"}: {renders}
      </span>
    </div>
  );
});

// Посредник: тему не читает, детей получает через children
// (children — те же элементы, ссылка не меняется → memo пропускает рендер)
const Middle = memo(function Middle({ children }) {
  const renders = useRenderCount();
  const lang = useLang();
  return (
    <div style={{ paddingLeft: 12 }}>
      {lang === "en" ? "mediator" : "посредник"}{" "}
      <span className="badge">
        {lang === "en" ? "renders" : "рендеров"}: {renders}
      </span>
      {children}
    </div>
  );
});

// Поддерево создано ОДИН раз на уровне модуля: ссылки на элементы стабильны,
// поэтому props у Middle (children) не меняются между рендерами и memo работает.
// Если бы этот JSX жил внутри ContextDemo, элементы пересоздавались бы каждый
// рендер — и все дети рендерились бы «за компанию» с родителем.
const TREE = (
  <Middle>
    <ThemedBox />
    <IgnorantBox />
    <ThemedBox />
  </Middle>
);

export default function ContextDemo() {
  const [theme, setTheme] = useState("light");
  const lang = useLang();
  // ⚠️ value-объект пересоздавался бы каждый рендер → лишние ре-рендеры читателей;
  // строка примитивна, поэтому тут ок. Для объектов — useMemo.

  return (
    <>
      <InterviewQuestion en="How does Context work? What are its limitations?">
        Как работает Context? Какие у него ограничения?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "createContext → Provider with a value → useContext in any
            descendant — data travels down without props. Context is a
            <b> delivery mechanism (DI), not a state manager</b>. Its main
            limitation: on any value change <b>all consumers re-render</b>,
            and there are no built-in selectors to subscribe to a slice.
            Hence the practices: <b>memoize the value</b> (an inline object is
            a new reference each render), <b>split contexts</b> by change
            frequency — state and dispatch separately, and keep frequently
            changing data in an external store instead. Good fit: theme,
            locale, auth. Context + useReducer works for feature-level state;
            Redux/Zustand for app-level with selector subscriptions."
          </>
        }
      >
        «createContext → Provider со значением → useContext у любого потомка —
        данные едут вниз без props. Context — это <b>механизм доставки (DI),
        а не стейт-менеджер</b>. Главное ограничение: при любом изменении
        value <b>ре-рендерятся все consumer-ы</b>, селекторов из коробки нет.
        Отсюда практики: <b>мемоизировать value</b> (инлайн-объект — новая
        ссылка каждый рендер), <b>дробить контексты</b> по частоте изменений —
        state и dispatch отдельно, а часто меняющееся уносить во внешний стор.
        Хорошо подходит: тема, локаль, auth. Context + useReducer — для
        feature-level state; Redux/Zustand — для app-level с подпиской
        селекторами.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <button
          className="btn primary"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {lang === "en" ? "Toggle theme" : "Переключить тему"}: {theme}
        </button>

        <ThemeContext.Provider value={theme}>{TREE}</ThemeContext.Provider>
        <p className="hint">
          <L
            ru="Жми кнопку: счётчики ThemedBox растут, у посредника и IgnorantBox стоят на 1 — контекст будит ТОЛЬКО своих читателей."
            en="Click the button: the ThemedBox counters climb, while the mediator's and IgnorantBox's stay at 1 — context wakes up ONLY its own readers."
          />
        </p>
      </div>

      <div className="card">
        <h3>
          <L ru="⚠️ Важная оговорка: почему тут memo" en="⚠️ An important caveat: why memo is here" />
        </h3>
        <CodeBlock
          ru={`// Все три компонента обёрнуты в memo, а поддерево вынесено из рендера:
const ThemedBox   = memo(function ThemedBox() {...});
const IgnorantBox = memo(function IgnorantBox() {...});
const Middle      = memo(function Middle({ children }) {...});
const TREE = <Middle><ThemedBox /><IgnorantBox /><ThemedBox /></Middle>;

// Зачем? Без memo IgnorantBox и Middle рендерились бы всё равно —
// но НЕ из-за контекста, а потому что рендерится их РОДИТЕЛЬ
// (владелец state theme). Это тема «Component render».
// memo убирает этот шум, оставляя чистый эффект контекста.`}
          en={`// All three components are wrapped in memo, and the subtree is hoisted out of render:
const ThemedBox   = memo(function ThemedBox() {...});
const IgnorantBox = memo(function IgnorantBox() {...});
const Middle      = memo(function Middle({ children }) {...});
const TREE = <Middle><ThemedBox /><IgnorantBox /><ThemedBox /></Middle>;

// Why? Without memo, IgnorantBox and Middle would re-render anyway —
// but NOT because of context, just because their PARENT re-renders
// (the owner of the theme state). That's the "component render" topic.
// memo removes that noise, leaving only the pure effect of context.`}
        />
        <p className="hint">
          <L
            ru={
              <>
                И обрати внимание на главное: ThemedBox рендерится, <b>несмотря на
                memo</b>. memo сравнивает props — а подписка на контекст его пробивает.
                Это и значит «селекторов нет»: отписаться от части value нельзя.
              </>
            }
            en={
              <>
                And notice the main point: ThemedBox re-renders <b>despite
                memo</b>. memo compares props — but a context subscription
                bypasses it entirely. That's exactly what "no selectors" means:
                you can't opt out of a slice of the value.
              </>
            }
          />
        </p>
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> Context — DI, не стейт-менеджер: все
              читатели рендерятся при смене value (даже под memo); мемоизировать
              value, дробить контексты, частое — во внешний стор.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> Context is DI, not a state manager: all
              readers re-render on any value change (even under memo);
              memoize the value, split contexts, keep fast-changing data in
              an external store.
            </>
          }
        />
      </div>

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: «Context — это замена Redux».</b>
              <br />Почему: это разные инструменты. Context — механизм ДОСТАВКИ значения
              вниз по дереву (dependency injection). Redux — управление состоянием:
              предсказуемые обновления через reducer, middleware для side effects,
              devtools с time-travel, мемоизированные селекторы, подписка на СРЕЗ state.
              Context не умеет: подписаться на часть value (любое изменение → все
              consumer-ы рендерятся), отделить чтение от записи без ручного дробления,
              централизовать side effects. Правильно: «Context + useReducer — для
              feature-level state; Redux/Zustand — для app-level, часто обновляемого,
              с селекторами».
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: "Context is a Redux replacement".</b>
              <br />Why: they're different tools. Context is a DELIVERY
              mechanism for a value down the tree (dependency injection).
              Redux is state management: predictable updates via a reducer,
              middleware for side effects, time-travel devtools, memoized
              selectors, subscribing to a SLICE of state. Context can't:
              subscribe to part of a value (any change re-renders all
              consumers), separate reads from writes without manual
              splitting, centralize side effects. The right framing:
              "Context + useReducer for feature-level state; Redux/Zustand
              for app-level, frequently-updated state with selectors".
            </>
          }
        />
      </div>
    </>
  );
}
