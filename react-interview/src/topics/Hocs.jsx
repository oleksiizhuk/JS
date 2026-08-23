import { useEffect, useState } from "react";
import { InterviewQuestion, ModelAnswer, SectionTitle, CodeBlock, L } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

// HOC = функция: принимает компонент → возвращает новый компонент с доп. поведением

// ── withLoading: показывает спиннер, пока isLoading
function withLoading(Wrapped) {
  return function WithLoading({ isLoading, ...props }) {
    const lang = useLang();
    if (isLoading) return <p>{lang === "en" ? "⏳ Loading..." : "⏳ Загрузка..."}</p>;
    return <Wrapped {...props} />;
  };
}

// ── withBorder: чисто визуальная обёртка
function withBorder(Wrapped) {
  return function WithBorder(props) {
    return (
      <div style={{ border: "2px dashed #4f6ef7", borderRadius: 8, padding: 8 }}>
        <Wrapped {...props} />
      </div>
    );
  };
}

function UserCard({ user }) {
  const lang = useLang();
  return (
    <div>
      🧑 {user.name}, {user.age} {lang === "en" ? "years old" : "лет"}
    </div>
  );
}

// Композиция HOC'ов — оборачиваются как матрёшка
const EnhancedUserCard = withBorder(withLoading(UserCard));

const PATTERN_CODE_RU = `const withX = (Wrapped) => (props) => {
  // доп. логика (данные, условия, обёртки)
  return <Wrapped {...props} />; // не забыть прокинуть props!
};`;

const PATTERN_CODE_EN = `const withX = (Wrapped) => (props) => {
  // extra logic (data, conditions, wrapping)
  return <Wrapped {...props} />; // don't forget to forward props!
};`;

const PARENT_BUG_CODE_RU = `function Parent() {
  const Enhanced = withBorder(UserCard); // ❌ НОВЫЙ тип на каждом рендере!
  return <Enhanced />;
}`;

const PARENT_BUG_CODE_EN = `function Parent() {
  const Enhanced = withBorder(UserCard); // ❌ a NEW type on every render!
  return <Enhanced />;
}`;

export default function Hocs() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <InterviewQuestion en="What is a HOC? Pros, cons, and are they still relevant?">
        Что такое HOC? Плюсы, минусы, актуальны ли они сейчас?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "A HOC is a function <b>Component → Component</b>: it takes a
            component and returns a new one with extra behavior — auth,
            loading states, logging. Classic examples: connect from Redux,
            withRouter. Downsides: <b>wrapper hell</b> in the tree, prop name
            collisions, it's unclear where a prop came from, refs need extra
            care (forwardRef before React 19 — now ref is a normal prop and
            forwardRef is headed for deprecation), static methods get lost. Today HOCs are mostly
            replaced by <b>custom hooks</b> — simpler and no extra tree
            layers; they remain where you genuinely need to wrap a subtree:
            React.memo, error boundaries, connect. Key gotcha: never create a
            HOC inside render — that's a new component type each time, and
            React remounts the whole subtree."
          </>
        }
      >
        «HOC — функция <b>Component → Component</b>: принимает компонент и
        возвращает новый с расширенным поведением — авторизация, лоадеры,
        логирование. Классика: connect из Redux, withRouter. Минусы:
        <b> wrapper hell</b> в дереве, коллизии имён props, непонятно, откуда
        пришёл prop, ref требует внимания (до React 19 — forwardRef, теперь ref
        обычный проп, а forwardRef готовят к депрекации), теряются статики. Сегодня HOC
        в основном вытеснены <b>кастомными хуками</b> — проще и без лишних
        слоёв; остались там, где реально нужно обернуть поддерево: React.memo,
        error boundaries, connect. Ключевая ловушка: не создавать HOC внутри
        render — это новый тип компонента каждый раз, и React ремаунтит всё
        поддерево.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>withBorder(withLoading(UserCard))</h3>
        <EnhancedUserCard isLoading={isLoading} user={{ name: "Olex", age: 30 }} />
        <button className="btn" onClick={() => setIsLoading(!isLoading)}>
          toggle loading
        </button>
      </div>

      <div className="card">
        <h3>
          <L ru="Суть паттерна" en="The pattern in a nutshell" />
        </h3>
        <CodeBlock ru={PATTERN_CODE_RU} en={PATTERN_CODE_EN} />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> HOC = Component → Component для
              cross-cutting-логики; сейчас в основном заменён хуками; не создавать
              внутри render и не забывать {"{...props}"}.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> HOC = Component → Component for
              cross-cutting logic; mostly replaced by hooks today; don't
              create it inside render and don't forget {"{...props}"}.
            </>
          }
        />
      </div>

      <div className="redflag">
        <L
          ru={<b>⚠️ Red flag: создавать HOC (или объявлять компонент) ВНУТРИ render.</b>}
          en={<b>⚠️ Red flag: creating a HOC (or declaring a component) INSIDE render.</b>}
        />
        <div style={{ marginTop: 8 }}>
          <CodeBlock ru={PARENT_BUG_CODE_RU} en={PARENT_BUG_CODE_EN} />
        </div>
        <L
          ru={
            <>
              Почему: withX(Inner) возвращает новую функцию-компонент при каждом вызове.
              Для reconciliation новый тип ≠ старый тип → React РАЗМОНТИРУЕТ всё
              поддерево и смонтирует заново на каждом рендере родителя: теряется state,
              сбрасываются инпуты, повторяются эффекты. Ошибка тихая — всё «работает»,
              просто плохо. Правильно: вызывать HOC один раз на уровне модуля.
            </>
          }
          en={
            <>
              Why: withX(Inner) returns a new component function on every
              call. For reconciliation, a new type ≠ the old type → React
              UNMOUNTS the whole subtree and mounts it again on every render
              of the parent: state is lost, inputs reset, effects re-run. The
              bug is silent — everything "works", just badly. The fix: call
              the HOC once at module scope.
            </>
          }
        />
      </div>
    </>
  );
}
