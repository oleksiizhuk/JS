import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "../LangContext.jsx";
import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, L, CodeBlock } from "./InterviewBlocks.jsx";

// React 19: ref приходит обычным пропом, forwardRef больше не нужен
function FancyInput({ ref, placeholder }) {
  const inner = useRef(null);
  // Наружу отдаём не сам DOM-узел, а ограниченный «пульт управления»
  useImperativeHandle(ref, () => ({
    focus: () => inner.current.focus(),
    clear: () => {
      inner.current.value = "";
      inner.current.focus();
    },
  }));
  return <input className="inp" ref={inner} placeholder={placeholder} />;
}

function Modal({ onClose, children }) {
  const lang = useLang();
  // Портал: DOM уезжает в body, но React-дерево (и context, и события) — прежнее.
  // Закрытие — по клику ТОЧНО в оверлей (target === currentTarget), а не через
  // stopPropagation на контенте: stopPropagation оборвал бы и всплытие к
  // React-родителю, сломав демо ниже.
  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
      }}
    >
      <div style={{ background: "#fff", padding: 24, borderRadius: 12, maxWidth: 420 }}>
        {children}
        <button className="btn primary" onClick={onClose}>
          {lang === "en" ? "Close" : "Закрыть"}
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function RefsPortals() {
  const lang = useLang();
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  const [, force] = useState(0);
  const [open, setOpen] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <>
      <InterviewQuestion en="What are refs for, how has ref changed in React 19, and what are portals?">
        Зачем нужны ref, что изменилось в React 19, и что такое порталы?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "A ref is a <b>mutable box that survives re-renders and doesn't
            trigger them</b>. Two uses: access to a DOM node — focus, scroll,
            measure, play a video — and storing a value between renders that
            shouldn't cause a render: a timer id, the previous value, a flag,
            a fresh value to escape a stale closure. The rule is simple: if it
            is displayed — useState; if it's only needed in handlers and
            effects — useRef. In <b>React 19</b> ref is passed to function
            components as a <b>regular prop</b>, so forwardRef is no longer
            needed — the React team plans to deprecate it in a future release; worth mentioning as a version marker.
            When I don't want to expose the raw DOM node, <b>useImperativeHandle
            </b> exposes a limited API instead — focus and clear rather than the
            whole element. <b>Portals</b> — createPortal — render children into
            a different DOM node, typically body: this escapes overflow: hidden
            and z-index stacking contexts for modals, tooltips and dropdowns.
            The important subtlety: the portal only moves the <b>DOM</b> — in
            the React tree the component stays where it was, so context works
            and events bubble to the React parent, not the DOM one."
          </>
        }
      >
        «Ref — это <b>мутабельная коробка, которая переживает ре-рендеры и не
        вызывает их</b>. Два применения: доступ к DOM-узлу — фокус, скролл,
        замеры, запуск видео — и хранение значения между рендерами, которое не
        должно вызывать рендер: id таймера, предыдущее значение, флаг, свежее
        значение для выхода из stale closure. Правило простое: отображается на
        экране — useState; нужно только в обработчиках и эффектах — useRef.
        В <b>React 19</b> ref передаётся в функциональные компоненты
        <b> обычным пропом</b>, поэтому forwardRef больше не нужен и объявлен
        к депрекации в будущем релизе — это стоит упомянуть как маркер версии. Когда не хочется
        отдавать наружу сырой DOM-узел, <b>useImperativeHandle</b> выставляет
        ограниченный API — focus и clear вместо всего элемента. <b>Порталы</b> —
        createPortal — рендерят детей в другой DOM-узел, обычно в body: это
        побег из overflow: hidden и контекстов наложения z-index для модалок,
        тултипов и дропдаунов. Важная тонкость: портал переносит только
        <b> DOM</b> — в React-дереве компонент остаётся на месте, поэтому
        контекст работает, а события всплывают к React-родителю, а не к
        DOM-родителю.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3><L ru="ref как «коробка без рендера»" en="ref as a “box without a render”" /></h3>
        <CodeBlock
          ru={`const renderCount = useRef(0);
useEffect(() => { renderCount.current += 1; });   // меняем — рендера НЕТ

const [, force] = useState(0);                    // а это рендерит`}
          en={`const renderCount = useRef(0);
useEffect(() => { renderCount.current += 1; });   // mutate — NO render

const [, force] = useState(0);                    // but this does render`}
        />
        <p>
          <L ru="Рендеров было: " en="Renders so far: " />
          <b>{renderCount.current}</b>{" "}
          <span className="hint">
            <L
              ru="(значение обновилось молча — на экране видно только при следующем рендере)"
              en="(the value updated silently — it's only visible on screen after the next render)"
            />
          </span>
        </p>
        <button className="btn" onClick={() => force((n) => n + 1)}>
          <L ru="Форсировать рендер" en="Force a render" />
        </button>
      </div>

      <div className="card">
        <h3><L ru="React 19: ref как проп + useImperativeHandle" en="React 19: ref as a prop + useImperativeHandle" /></h3>
        <CodeBlock
          ru={`// React 19 — forwardRef не нужен, ref приходит обычным пропом
function FancyInput({ ref, placeholder }) {
  const inner = useRef(null);
  useImperativeHandle(ref, () => ({          // наружу — только это API
    focus: () => inner.current.focus(),
    clear: () => { inner.current.value = ""; inner.current.focus(); },
  }));
  return <input ref={inner} placeholder={placeholder} />;
}

// было до React 19:
// const FancyInput = forwardRef(function FancyInput(props, ref) {...});`}
          en={`// React 19 — forwardRef isn't needed, ref arrives as a regular prop
function FancyInput({ ref, placeholder }) {
  const inner = useRef(null);
  useImperativeHandle(ref, () => ({          // expose only this API
    focus: () => inner.current.focus(),
    clear: () => { inner.current.value = ""; inner.current.focus(); },
  }));
  return <input ref={inner} placeholder={placeholder} />;
}

// before React 19:
// const FancyInput = forwardRef(function FancyInput(props, ref) {...});`}
        />
        <FancyInput ref={inputRef} placeholder={lang === "en" ? "controlled from outside" : "управляется снаружи"} />
        <button className="btn primary" onClick={() => inputRef.current.focus()}>
          ref.focus()
        </button>
        <button className="btn" onClick={() => inputRef.current.clear()}>
          ref.clear()
        </button>
        <p className="hint">
          <L
            ru="Родитель дёргает только focus/clear — доступа к самому input-элементу у него нет. Это и есть смысл useImperativeHandle: узкий контракт вместо сырого DOM."
            en="The parent can only call focus/clear — it has no access to the input element itself. That's exactly the point of useImperativeHandle: a narrow contract instead of raw DOM."
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="Портал: DOM в body, React-дерево на месте" en="Portal: DOM in body, React tree unchanged" /></h3>
        <CodeBlock
          ru={`function Modal({ onClose, children }) {
  return createPortal(
    <div className="overlay" onClick={onClose}>...</div>,
    document.body                     // ← DOM-узел назначения
  );
}

// клик внутри модалки всплывает к REACT-родителю (счётчик ниже растёт),
// хотя в DOM модалка лежит в body — за пределами этой карточки`}
          en={`function Modal({ onClose, children }) {
  return createPortal(
    <div className="overlay" onClick={onClose}>...</div>,
    document.body                     // ← target DOM node
  );
}

// a click inside the modal bubbles to the REACT parent (the counter below
// grows), even though in the DOM the modal lives in body — outside this card`}
        />
        <div onClick={() => setClicks((c) => c + 1)}>
          <button className="btn primary" onClick={() => setOpen(true)}>
            <L ru="Открыть модалку" en="Open modal" />
          </button>
          <span className="badge">
            <L ru="кликов поймано этим блоком: " en="clicks caught by this block: " />
            {clicks}
          </span>
          {/* Modal — ПОТОМОК этого div в React-дереве (хоть DOM и в body) */}
          {open && (
            <Modal onClose={() => setOpen(false)}>
              <p>
                <L
                  ru={<>Я в <code>document.body</code>, но клики по мне всплывают к
                  React-родителю — счётчик за модалкой растёт.</>}
                  en={<>I'm in <code>document.body</code>, but clicks on me bubble up to
                  the React parent — the counter behind the modal grows.</>}
                />
              </p>
            </Modal>
          )}
        </div>
        <p className="hint">
          <L
            ru="Открой модалку и покликай по ней: счётчик снаружи увеличивается. Это доказывает, что всплытие идёт по React-дереву, а не по DOM."
            en="Open the modal and click inside it: the counter outside increases. That proves bubbling follows the React tree, not the DOM."
          />
        </p>
      </div>

      <Gotchas
        items={[
          {
            title: "ref.current === null — когда и почему",
            code: `const ref = useRef(null);
console.log(ref.current);        // null: DOM ещё НЕ создан (render-фаза)
useEffect(() => {
  console.log(ref.current);      // ✅ элемент: эффекты бегут ПОСЛЕ коммита
});
{show && <div ref={ref} />}      // а при show=false — снова null!`,
            text: "DOM-ref заполняется после коммита и обнуляется при размонтировании узла. Обращаться — в эффектах/обработчиках + проверка ?. для условного рендера.",
            en: {
              title: "ref.current === null — when and why",
              code: `const ref = useRef(null);
console.log(ref.current);        // null: the DOM doesn't exist yet (render phase)
useEffect(() => {
  console.log(ref.current);      // ✅ the element: effects run AFTER commit
});
{show && <div ref={ref} />}      // and with show=false — null again!`,
              text: "A DOM ref is populated after commit and reset to null when the node unmounts. Access it in effects/handlers, plus an ?. check for conditional rendering.",
            },
          },
          {
            title: "Ref-колбэк вызывается дважды",
            code: `<div ref={(node) => console.log(node)} />
// при каждом ре-рендере с ИНЛАЙН-колбэком: сначала null (отцепили
// старый), потом node (прицепили новый) — это контракт, не баг
// React 19: колбэк может вернуть cleanup-функцию — как у эффекта`,
            text: "Инлайн-функция — новая ссылка каждый рендер, React честно переподключает. Стабилизировать useCallback-ом или использовать cleanup-возврат (React 19).",
            en: {
              title: "Ref callback fires twice",
              code: `<div ref={(node) => console.log(node)} />
// on every re-render with an INLINE callback: first null (detached
// the old one), then node (attached the new one) — that's the contract, not a bug
// React 19: the callback can return a cleanup function — like an effect`,
              text: "An inline function is a new reference every render, so React honestly reattaches. Stabilize it with useCallback, or use the cleanup return (React 19).",
            },
          },
          {
            title: "Модалка в портале не закрывается по «клику мимо»",
            code: `document.addEventListener("click", (e) => {
  if (!modalRef.current.contains(e.target)) close();  // DOM-проверка
});
// contains работает по DOM: модалка в body, кнопка открытия — нет
// → клик по кнопке «мимо модалки» → мгновенно закрыл после открытия`,
            text: "Смешение DOM- и React-иерархий: contains смотрит DOM, события React всплывают по React-дереву. Типовой баг «модалка закрывается сразу» — лечится проверкой и кнопки тоже, или stopPropagation осознанно.",
            en: {
              title: "A portaled modal doesn't close on \"click outside\"",
              code: `document.addEventListener("click", (e) => {
  if (!modalRef.current.contains(e.target)) close();  // a DOM check
});
// contains works on the DOM: the modal is in body, the open button isn't
// → clicking the open button counts as "outside the modal" → closes instantly after opening`,
              text: "A mix-up between DOM and React hierarchies: contains looks at the DOM, React events bubble through the React tree. The classic \"modal closes immediately\" bug — fix by also checking the button, or use stopPropagation deliberately.",
            },
          },
          {
            title: "«Хочу прошлое значение пропа» — useRef-паттерн",
            code: `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });  // пишем ПОСЛЕ рендера
  return ref.current;                          // читаем прошлое
}`,
            text: "Мини-live-coding: эффект обновляет ref после коммита, поэтому в течение рендера ref хранит значение прошлого. Заодно проверяет понимание тайминга эффектов.",
            en: {
              title: "\"I want the previous prop value\" — the useRef pattern",
              code: `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });  // write AFTER the render
  return ref.current;                          // read the previous one
}`,
              text: "A mini live-coding exercise: the effect updates the ref after commit, so during the render the ref still holds the previous value. It also checks understanding of effect timing.",
            },
          },
        ]}
      />

      <div className="redflag">
        <L
          ru={<b>⚠️ Red flag: читать/писать ref во время рендера.</b>}
          en={<b>⚠️ Red flag: reading/writing a ref during render.</b>}
        />
        <CodeBlock
          ru={`function Bad() {
  const ref = useRef(0);
  ref.current += 1;              // ❌ сайд-эффект в render-фазе
  return <div>{ref.current}</div>;
}`}
          en={`function Bad() {
  const ref = useRef(0);
  ref.current += 1;              // ❌ a side effect in the render phase
  return <div>{ref.current}</div>;
}`}
        />
        <L
          ru={
            <>
              Почему: render-фаза обязана быть чистой и может быть прервана или
              выброшена (concurrent rendering) — тогда счётчик посчитает лишнее, а
              StrictMode в dev вызовет рендер дважды и покажет это. Мутировать ref —
              в обработчиках и эффектах. И второе: <code>ref.current</code> у DOM-узла
              равен null до коммита, поэтому обращаться к нему можно только в эффектах
              и колбэках, но не в теле компонента.
            </>
          }
          en={
            <>
              Why: the render phase must be pure and can be interrupted or
              discarded (concurrent rendering) — then the counter would count
              extra, and StrictMode in dev deliberately renders twice to expose
              it. Mutate a ref in handlers and effects. And second: a DOM node's
              <code> ref.current</code> is null until commit, so you can only
              access it in effects and callbacks, never in the component body.
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> ref = мутабельная коробка без ре-рендера
              (DOM-доступ + значения между рендерами); в React 19 ref — обычный проп
              (forwardRef на пути к депрекации), useImperativeHandle сужает API; портал
              переносит DOM, но не React-дерево.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> ref = a mutable box without a re-render
              (DOM access + values between renders); in React 19, ref is a
              regular prop (forwardRef is on its way to deprecation),
              useImperativeHandle narrows the API; a portal moves the DOM but
              not the React tree.
            </>
          }
        />
      </div>
    </>
  );
}
