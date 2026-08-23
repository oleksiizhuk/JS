import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function TypeVsInterface() {
  return (
    <>
      <InterviewQuestion en="Type vs Interface — differences and which one do you use?">
        Type vs Interface — в чём отличия и что используешь?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "For describing an object shape they're ~equivalent — both can be
            extended and implemented. The real differences: <b>type</b> can
            express things interface can't — <b>unions</b>
            (A | B), primitives, tuples, mapped and conditional types;
            <b> interface</b> supports <b>declaration merging</b> — declaring
            it twice merges the members, which is how libraries let you
            augment types (extending Express Request, process.env), while a
            duplicate type is an error. Extension: interface extends vs type
            intersection &amp; — similar, but extends gives better errors and
            is a bit friendlier to the compiler. My convention: interface for
            public object shapes and library-facing contracts (merging,
            clearer errors), type for everything else — unions, function
            types, utility compositions. The honest senior answer: pick one
            convention per team and be consistent; the technical differences
            matter in maybe 5% of cases."
          </>
        }
      >
        «Для описания формы объекта они почти эквивалентны — оба расширяются
        и имплементируются. Реальные отличия: <b>type</b> умеет то, чего не
        умеет interface — <b>union-ы</b> (A | B), примитивы, кортежи, mapped
        и conditional types; <b>interface</b> поддерживает <b>declaration
        merging</b> — два объявления сливаются, на этом построено расширение
        чужих типов (Express Request, process.env), а дубль type — ошибка.
        Расширение: interface extends vs пересечение &amp; у type — похоже,
        но extends даёт понятнее ошибки и чуть дружелюбнее компилятору.
        Моя конвенция: interface — для публичных форм объектов и контрактов
        для библиотек (merging, ошибки читабельнее), type — для всего
        остального: union-ы, типы функций, композиции утилит. Честный
        senior-ответ: в команде выбирается одна конвенция и соблюдается —
        технические отличия важны в ~5% случаев.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Что умеет только type" en="What only type can do" /></h3>
        <CodeBlock
          ru={`type Id = string | number;               // union
type Point = [number, number];           // кортеж
type Handler = (e: Event) => void;       // функция (interface тоже может, но страннее)
type Keys = keyof User;                  // операторы типов
type Readonly<T> = { readonly [K in keyof T]: T[K] };  // mapped
type NonNull<T> = T extends null ? never : T;          // conditional`}
          en={`type Id = string | number;               // union
type Point = [number, number];           // tuple
type Handler = (e: Event) => void;       // function (interface can too, but it's odder)
type Keys = keyof User;                  // type operators
type Readonly<T> = { readonly [K in keyof T]: T[K] };  // mapped
type NonNull<T> = T extends null ? never : T;          // conditional`}
        />
      </div>

      <div className="card">
        <h3><L ru="Что умеет только interface: declaration merging" en="What only interface can do: declaration merging" /></h3>
        <CodeBlock
          ru={`interface Window { myApp: AppApi }   // добавили к глобальному Window
// оба объявления СЛИЛИСЬ — теперь window.myApp типизирован

// та же механика — аугментация библиотек:
declare module "express" {
  interface Request { user?: User }
}

type X = { a: 1 };
type X = { b: 2 };   // ❌ Duplicate identifier`}
          en={`interface Window { myApp: AppApi }   // extended the global Window
// both declarations MERGED — window.myApp is now typed

// the same mechanism — augmenting libraries:
declare module "express" {
  interface Request { user?: User }
}

type X = { a: 1 };
type X = { b: 2 };   // ❌ Duplicate identifier`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«interface только для ООП?»",
            code: `// Нет: interface описывает ФОРМУ, класс не обязателен
interface Props { title: string }
const Card = ({ title }: Props) => <h1>{title}</h1>;`,
            text: "Путают с interface из Java/C#. В TS это просто описание структуры.",
            en: {
              title: "“Is interface only for OOP?”",
              code: `// No: interface describes a SHAPE, a class isn't required
interface Props { title: string }
const Card = ({ title }: Props) => <h1>{title}</h1>;`,
              text: "Confused with interface from Java/C#. In TS it's just a structural description.",
            },
          },
          {
            title: "extends vs & при конфликте полей",
            code: `interface A { x: string }
interface B extends A { x: number }  // ❌ ошибка сразу, понятная
type C = { x: string } & { x: number }; // ✅ компилится! x: never`,
            text: "Коварство пересечений: конфликт молча даёт never, и ошибка вылезет позже в неожиданном месте. extends честнее.",
            en: {
              title: "extends vs & on a field conflict",
              code: `interface A { x: string }
interface B extends A { x: number }  // ❌ immediate, clear error
type C = { x: string } & { x: number }; // ✅ compiles! x: never`,
              text: "The treachery of intersections: a conflict silently produces never, and the error surfaces later somewhere unexpected. extends is more honest.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="type = union/кортежи/mapped/conditional; interface = declaration merging + extends с понятными ошибками; главное — единая конвенция в команде."
          en="type = unions/tuples/mapped/conditional; interface = declaration merging + extends with clear errors; what matters most is one shared team convention."
        />
      </div>
    </>
  );
}
