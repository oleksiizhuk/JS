import { useRef, useState } from "react";
import { useRenderCount } from "./helpers.jsx";
import { InterviewQuestion, ModelAnswer, SectionTitle, L } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

// ── Controlled: значение живёт в state, React — единственный источник правды
function ControlledForm() {
  const renders = useRenderCount();
  const lang = useLang();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const error =
    email && !email.includes("@") ? (lang === "en" ? "needs @" : "нужна @") : "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setResult(lang === "en" ? `sent: ${email}` : `отправили: ${email}`);
      }}
    >
      <span className="badge">
        {lang === "en" ? "renders" : "рендеров"}: {renders}
      </span>
      <br />
      <input
        className="inp"
        value={email}                       // значение ИЗ state
        onChange={(e) => setEmail(e.target.value)} // каждый символ → setState
        placeholder="email"
      />
      <span style={{ color: "crimson" }}>{error}</span>
      <br />
      <button className="btn primary" disabled={!!error || !email}>
        {lang === "en" ? "Submit" : "Отправить"}
      </button>
      <p className="hint">{result}</p>
    </form>
  );
}

// ── Uncontrolled: значение живёт в DOM, читаем через ref в момент submit
function UncontrolledForm() {
  const renders = useRenderCount();
  const lang = useLang();
  const inputRef = useRef(null);
  const [result, setResult] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setResult(
          lang === "en"
            ? `sent: ${inputRef.current.value}`
            : `отправили: ${inputRef.current.value}` // читаем из DOM
        );
      }}
    >
      <span className="badge">
        {lang === "en" ? "renders" : "рендеров"}: {renders}
      </span>
      <br />
      <input className="inp" ref={inputRef} defaultValue="" placeholder="email" />
      <br />
      <button className="btn primary">{lang === "en" ? "Submit" : "Отправить"}</button>
      <p className="hint">{result}</p>
    </form>
  );
}

export default function Forms() {
  return (
    <>
      <InterviewQuestion en="Controlled vs uncontrolled components — difference and when to use which?">
        Controlled vs uncontrolled компоненты — в чём разница и что когда брать?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "A <b>controlled</b> input takes its value from state plus
            onChange — React is the single source of truth. That means a
            render on every keystroke, but in return: instant validation,
            masks, dependent fields. An <b>uncontrolled</b> one uses
            defaultValue and a ref — the DOM keeps the value itself, zero
            renders while typing; you read it on submit. Default choice is
            controlled; for large forms — <b>react-hook-form</b>: it's
            uncontrolled under the hood with subscriptions, so it's fast, plus
            schema validation with zod. Formik is fully controlled and
            heavier. React 19 adds form actions — form action, useActionState,
            useFormStatus."
          </>
        }
      >
        «<b>Controlled</b> — value из state + onChange, React — единственный
        источник правды. Это рендер на каждый символ, зато мгновенная
        валидация, маски, зависимые поля. <b>Uncontrolled</b> — defaultValue
        и ref: DOM хранит значение сам, ноль рендеров при вводе, читаем на
        submit. По умолчанию — controlled; для больших форм —
        <b> react-hook-form</b>: под капотом uncontrolled с подписками,
        поэтому быстрый, плюс схема-валидация через zod. Formik — полностью
        controlled и тяжелее. В React 19 добавились form actions —
        &lt;form action&gt;, useActionState, useFormStatus.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="row">
        <div className="card">
          <h3>Controlled</h3>
          <ControlledForm />
        </div>
        <div className="card">
          <h3>Uncontrolled</h3>
          <UncontrolledForm />
        </div>
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> controlled = state+onChange (рендер
              на символ, но валидация на лету), uncontrolled = ref+defaultValue
              (0 рендеров); большие формы — react-hook-form + zod.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> controlled = state+onChange (a render
              per keystroke, but instant validation), uncontrolled =
              ref+defaultValue (0 renders); large forms — react-hook-form +
              zod.
            </>
          }
        />
      </div>
    </>
  );
}
