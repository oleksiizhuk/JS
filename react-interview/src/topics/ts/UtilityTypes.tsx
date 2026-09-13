import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function UtilityTypes() {
  return (
    <>
      <InterviewQuestion en="Which utility types do you use and for what?">
        Какие utility types используешь и для чего?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "The everyday set: <b>Partial&lt;T&gt;</b> — all fields optional,
            for update payloads and default configs; <b>Required</b> and
            <b> Readonly</b> — the opposites; <b>Pick&lt;T, K&gt;</b> /
            <b> Omit&lt;T, K&gt;</b> — carve a narrower shape out of a big
            one, classic for component props (Omit&lt;Props, 'onClick'&gt;);
            <b> Record&lt;K, V&gt;</b> — dictionaries like Record&lt;UserId,
            User&gt;; <b>ReturnType</b> and <b>Parameters</b> — extract types
            from functions instead of duplicating them;
            <b> Awaited&lt;T&gt;</b> — unwrap promises;
            <b> NonNullable</b> — strip null/undefined; and for unions —
            <b> Exclude/Extract</b>. The point I'd stress: utility types keep
            <b> one source of truth</b> — derived types update themselves when
            the base type changes, instead of drifting apart. They're not
            magic: each is a one-liner on mapped and conditional types, and
            I can write my own when needed."
          </>
        }
      >
        «Повседневный набор: <b>Partial&lt;T&gt;</b> — все поля опциональны,
        для update-payload-ов и дефолтных конфигов; <b>Required</b> и
        <b> Readonly</b> — противоположности; <b>Pick&lt;T, K&gt;</b> /
        <b> Omit&lt;T, K&gt;</b> — вырезать узкую форму из большой, классика
        для props (Omit&lt;Props, 'onClick'&gt;); <b>Record&lt;K, V&gt;</b> —
        словари вида Record&lt;UserId, User&gt;; <b>ReturnType</b> и
        <b> Parameters</b> — извлечь типы из функций вместо дублирования;
        <b> Awaited&lt;T&gt;</b> — развернуть промис; <b>NonNullable</b> —
        убрать null/undefined; для union-ов — <b>Exclude/Extract</b>. Мысль,
        которую подчеркну: utility types сохраняют <b>один источник
        правды</b> — производные типы обновляются сами при изменении базового,
        а не расползаются. И это не магия: каждый — однострочник на mapped и
        conditional types, при необходимости пишу свои.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3>📚 <L ru="Справочник с примерами" en="Reference with examples" /></h3>
        <CodeBlock
          ru={`interface User { id: string; name: string; email: string; age?: number }

Partial<User>          // все поля опциональны → update(id, patch)
Required<User>         // все обязательны (age тоже)
Readonly<User>         // нельзя присваивать поля
Pick<User, "id" | "name">   // { id, name }
Omit<User, "email">         // всё, кроме email
Record<string, User>        // словарь { [id]: User }

type Fn = (a: number, b: string) => Promise<User>;
Parameters<Fn>         // [number, string]
ReturnType<Fn>         // Promise<User>
Awaited<ReturnType<Fn>>// User

type Status = "idle" | "loading" | "error" | "success";
Exclude<Status, "idle">       // "loading" | "error" | "success"
Extract<Status, "error" | "x">// "error"
NonNullable<string | null>    // string`}
          en={`interface User { id: string; name: string; email: string; age?: number }

Partial<User>          // all fields optional → update(id, patch)
Required<User>         // all fields required (age too)
Readonly<User>         // fields can't be assigned to
Pick<User, "id" | "name">   // { id, name }
Omit<User, "email">         // everything except email
Record<string, User>        // dictionary { [id]: User }

type Fn = (a: number, b: string) => Promise<User>;
Parameters<Fn>         // [number, string]
ReturnType<Fn>         // Promise<User>
Awaited<ReturnType<Fn>>// User

type Status = "idle" | "loading" | "error" | "success";
Exclude<Status, "idle">       // "loading" | "error" | "success"
Extract<Status, "error" | "x">// "error"
NonNullable<string | null>    // string`}
        />
      </div>

      <div className="card">
        <h3><L ru="Типовые применения в React" en="Typical usage in React" /></h3>
        <CodeBlock
          ru={`// props-обёртка: всё от кнопки, кроме onClick
type Props = Omit<ButtonProps, "onClick"> & { action: Action };

// тип из API-функции — один источник правды
type User = Awaited<ReturnType<typeof fetchUser>>;

// словарь конфигов по ключам union-а
const icons: Record<Status, IconName> = { idle: "dot", loading: "spin", ... };
// ↑ бонус: добавил статус в union — TS заставит добавить иконку`}
          en={`// props wrapper: everything from Button except onClick
type Props = Omit<ButtonProps, "onClick"> & { action: Action };

// type derived from an API function — one source of truth
type User = Awaited<ReturnType<typeof fetchUser>>;

// config dictionary keyed by a union
const icons: Record<Status, IconName> = { idle: "dot", loading: "spin", ... };
// ↑ bonus: add a status to the union — TS forces you to add an icon`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Partial для «глубоких» объектов",
            code: `Partial<{ user: { name: string } }>
// { user?: { name: string } } — name внутри ОСТАЛСЯ обязательным!
// Partial неглубокий; DeepPartial пишется самому (рекурсивный mapped)`,
            text: "Та же история, что с поверхностным spread: утилиты работают на один уровень.",
            en: {
              title: "Partial on “deep” objects",
              code: `Partial<{ user: { name: string } }>
// { user?: { name: string } } — the inner name is STILL required!
// Partial isn't deep; DeepPartial has to be written yourself (a recursive mapped type)`,
              text: "Same story as a shallow spread: the utility only operates one level deep.",
            },
          },
          {
            title: "«Напиши Partial сам»",
            code: `type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };`,
            text: "Проверка, что утилиты — не магия. Уметь написать Partial, Pick, Readonly с нуля.",
            en: {
              title: "“Write Partial yourself”",
              code: `type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };`,
              text: "A check that utility types aren't magic. Be able to write Partial, Pick, Readonly from scratch.",
            },
          },
          {
            title: "Omit не ругается на несуществующий ключ",
            code: `Omit<User, "emial">   // ✅ компилится! опечатка не поймана
// строгая версия: Omit<T, K extends keyof T> — своя утилита`,
            text: "Известный подвох стандартного Omit (K не ограничен keyof T) — вопрос со звёздочкой.",
            en: {
              title: "Omit doesn't complain about a nonexistent key",
              code: `Omit<User, "emial">   // ✅ compiles! the typo goes uncaught
// a stricter version: Omit<T, K extends keyof T> — your own utility`,
              text: "A known gotcha of the built-in Omit (K isn't constrained to keyof T) — a bonus-point question.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="Partial/Pick/Omit/Record/ReturnType и компания = производные типы от одного источника правды; все — сахар над mapped/conditional, уметь написать самому."
          en="Partial/Pick/Omit/Record/ReturnType and friends = derived types from one source of truth; they're all sugar over mapped/conditional types — be able to write them yourself."
        />
      </div>
    </>
  );
}
