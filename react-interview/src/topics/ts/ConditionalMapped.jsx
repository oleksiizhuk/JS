import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function ConditionalMapped() {
  return (
    <>
      <InterviewQuestion en="Explain conditional and mapped types. When are they actually useful?">
        Объясни conditional и mapped types. Когда они реально полезны?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "A <b>mapped type</b> iterates over the keys of another type —
            {"{ [K in keyof T]: ... }"} — transforming each property: make
            them optional, readonly, rename via as, change value types;
            Partial and Readonly are exactly this. A <b>conditional type</b>
            is an if at the type level — T extends U ? X : Y — with
            <b> infer</b> to extract pieces (that's how ReturnType is built),
            and it <b>distributes</b> over unions: Exclude filters a union by
            checking each member. Where it pays off in real life: typed
            wrappers over APIs (derive a response type from a route), form
            libraries mapping a schema to errors/touched shapes, making
            invalid states unrepresentable. My honest position: in
            application code I mostly consume these via utility types and
            libraries like zod — deep custom type gymnastics belongs in
            libraries, because it's hard to read and debug."
          </>
        }
      >
        «<b>Mapped type</b> итерируется по ключам другого типа —
        {"{ [K in keyof T]: ... }"} — трансформируя каждое свойство: сделать
        опциональным, readonly, переименовать через as, поменять тип
        значения; Partial и Readonly — ровно это. <b>Conditional type</b> —
        if на уровне типов: T extends U ? X : Y, с <b>infer</b> для
        извлечения кусков (так устроен ReturnType), и он
        <b> дистрибутируется</b> по union-ам: Exclude фильтрует union,
        проверяя каждый элемент. Где реально полезно: типизированные обёртки
        над API (вывести тип ответа из роута), формы — маппинг схемы в формы
        errors/touched, «нерепрезентируемость» невалидных состояний. Честная
        позиция: в прикладном коде я в основном потребляю это через utility
        types и библиотеки типа zod — глубокая типовая гимнастика уместна в
        библиотеках, потому что её тяжело читать и отлаживать.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Mapped types" en="Mapped types" /></h3>
        <CodeBlock
          ru={`type Partial<T>  = { [K in keyof T]?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

// модификаторы можно СНИМАТЬ:
type Mutable<T>  = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] };   // = Required

// переименование ключей через as + template literal types
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
};
// Getters<{ name: string }> → { getName: () => string }`}
          en={`type Partial<T>  = { [K in keyof T]?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

// modifiers can be REMOVED:
type Mutable<T>  = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] };   // = Required

// renaming keys via as + template literal types
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
};
// Getters<{ name: string }> → { getName: () => string }`}
        />
      </div>

      <div className="card">
        <h3><L ru="Conditional types + infer" en="Conditional types + infer" /></h3>
        <CodeBlock
          ru={`type IsString<T> = T extends string ? true : false;

// infer — «выхвати кусок типа»
type MyReturnType<T> = T extends (...a: any[]) => infer R ? R : never;
type ElementOf<T>   = T extends (infer E)[] ? E : never;
type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;

// дистрибутивность по union:
type NoNull<T> = T extends null | undefined ? never : T;
NoNull<string | null | number>  // string | number
// (проверка применилась К КАЖДОМУ члену union-а отдельно)`}
          en={`type IsString<T> = T extends string ? true : false;

// infer — "grab a piece of the type"
type MyReturnType<T> = T extends (...a: any[]) => infer R ? R : never;
type ElementOf<T>   = T extends (infer E)[] ? E : never;
type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;

// distributes over a union:
type NoNull<T> = T extends null | undefined ? never : T;
NoNull<string | null | number>  // string | number
// (the check was applied to EACH union member separately)`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Как работает Exclude?» (написать самому)",
            code: `type Exclude<T, U> = T extends U ? never : T;
// Exclude<"a"|"b"|"c", "a"> →
// ("a" ext "a"? never) | ("b"...? "b") | ("c"...? "c") → "b" | "c"`,
            text: "Проверка дистрибутивности: conditional применяется к каждому члену union, never-ы выпадают.",
            en: {
              title: "“How does Exclude work?” (write it yourself)",
              code: `type Exclude<T, U> = T extends U ? never : T;
// Exclude<"a"|"b"|"c", "a"> →
// ("a" ext "a"? never) | ("b"...? "b") | ("c"...? "c") → "b" | "c"`,
              text: "A check on distributivity: the conditional is applied to each union member, and never results drop out.",
            },
          },
          {
            title: "Отключить дистрибутивность",
            code: `type IsUnion<T> = [T] extends [string] ? ...
// обёртка в кортеж [T] выключает распределение по union`,
            text: "Вопрос со звёздочкой: дистрибутивность работает только на «голом» параметре типа.",
            en: {
              title: "Turning off distributivity",
              code: `type IsUnion<T> = [T] extends [string] ? ...
// wrapping in a tuple [T] disables distribution over the union`,
              text: "A bonus-point question: distributivity only kicks in on a “naked” type parameter.",
            },
          },
          {
            title: "Когда НЕ надо",
            code: `// 5-этажный conditional в прикладном коде =
// нечитаемые ошибки на 30 строк и медленный tsc
// прикладной код: utility types + zod; гимнастика — в библиотеки`,
            text: "Зрелость = знать инструмент И границы его уместности. «Обожаю типовую гимнастику везде» — тревожный звонок.",
            en: {
              title: "When NOT to reach for it",
              code: `// a 5-level-deep conditional in application code =
// unreadable 30-line errors and a slow tsc
// application code: utility types + zod; gymnastics belong in libraries`,
              text: "Maturity means knowing the tool AND its limits. “I love type gymnastics everywhere” is a red flag.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru={<>mapped = цикл по ключам ({"[K in keyof T]"}), conditional = if с infer и дистрибутивностью по union; на них построены все utility types; в приложении — умеренно.</>}
          en={<>mapped = a loop over keys ({"[K in keyof T]"}), conditional = an if with infer and distributivity over unions; every utility type is built on these; use them sparingly in application code.</>}
        />
      </div>
    </>
  );
}
