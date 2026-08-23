import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function VsPropTypes() {
  return (
    <>
      <InterviewQuestion en="TypeScript vs PropTypes — what's the difference and what do you choose?">
        TypeScript vs PropTypes — в чём разница и что выбираешь?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "They check at different moments. <b>PropTypes</b> is a
            <b> runtime</b> check of props on an already running app, dev-only
            console warnings, props only, no autocomplete or refactoring
            help. <b>TypeScript</b> checks at <b>compile time</b> — before the
            code runs — and covers <b>everything</b>: props, state, functions,
            API responses; the build simply fails on a wrong prop, plus IDE
            support and codegen from GraphQL/OpenAPI. Today the choice is
            unambiguous — TypeScript; PropTypes remains in legacy and in
            plain-JS libraries. The nuance worth adding: TS types are erased,
            so for data crossing the runtime boundary — API responses, form
            input — neither PropTypes nor TS is the answer: that's schema
            validation (zod), which gives both a runtime check and an
            inferred static type from one source."
          </>
        }
      >
        «Они проверяют в разные моменты. <b>PropTypes</b> — проверка props в
        <b> рантайме</b> уже запущенного приложения: dev-only warnings в
        консоли, только props, без автокомплита и помощи в рефакторинге.
        <b> TypeScript</b> проверяет на <b>этапе компиляции</b> — до запуска —
        и покрывает <b>всё</b>: props, state, функции, ответы API; сборка
        просто падает при неверном prop, плюс поддержка IDE и codegen из
        GraphQL/OpenAPI. Сегодня выбор однозначен — TypeScript; PropTypes
        остался в легаси и в библиотеках на чистом JS. Нюанс, который стоит
        добавить: типы TS стираются, поэтому для данных, пересекающих границу
        рантайма — ответы API, ввод форм — ни PropTypes, ни TS не ответ: там
        схема-валидация (zod), дающая из одного источника и рантайм-проверку,
        и выведенный статический тип.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Одно и то же — тремя способами" en="The same thing, three ways" /></h3>
        <CodeBlock
          ru={`// PropTypes: рантайм, dev-warning в консоли
UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
};

// TypeScript: compile-time, сборка не пройдёт
type UserCardProps = { name: string; age?: number };
function UserCard({ name, age = 18 }: UserCardProps) { ... }

// zod: рантайм-валидация + тип из одной схемы
const UserSchema = z.object({ name: z.string(), age: z.number().optional() });
type User = z.infer<typeof UserSchema>;      // статический тип
const user = UserSchema.parse(await res.json()); // рантайм-проверка`}
          en={`// PropTypes: runtime, dev-warning in the console
UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
};

// TypeScript: compile-time, the build fails
type UserCardProps = { name: string; age?: number };
function UserCard({ name, age = 18 }: UserCardProps) { ... }

// zod: runtime validation + a type from one schema
const UserSchema = z.object({ name: z.string(), age: z.number().optional() });
type User = z.infer<typeof UserSchema>;      // static type
const user = UserSchema.parse(await res.json()); // runtime check`}
        />
      </div>

      <div className="card">
        <h3><L ru="Сравнение" en="Comparison" /></h3>
        <CodeBlock
          ru={`                     PropTypes         TypeScript
момент проверки      рантайм (dev)     компиляция
что покрывает        только props      весь код
ошибка               warning в консоли build fail / красное в IDE
автокомплит/рефактор нет               да
внешние данные       нет               нет (типы стёрты) → zod`}
          en={`                     PropTypes         TypeScript
check happens at     runtime (dev)     compile time
coverage             props only        entire codebase
error                console warning   build fail / red in IDE
autocomplete/refactor no               yes
external data        no                no (types erased) → zod`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«TS проверит ответ API?»",
            code: `const user: User = await res.json(); // ❌ это ДОВЕРИЕ, не проверка
// бэкенд прислал другое → рантайм-краш при обращении к полю
// граница = zod.parse / кодогенерация с валидацией`,
            text: "Любимая проверка на понимание стирания типов: типизация ≠ валидация.",
            en: {
              title: "“Will TS check the API response?”",
              code: `const user: User = await res.json(); // ❌ this is TRUST, not a check
// the backend sent something else → runtime crash when a field is accessed
// the boundary = zod.parse / codegen with validation`,
              text: "A favorite check of understanding type erasure: typing ≠ validation.",
            },
          },
          {
            title: "«Можно ли их вместе?»",
            code: `// Технически да (babel-plugin генерил PropTypes из типов),
// практически — смысла нет: дублирование источников правды`,
            text: "Ок-ответ: TS для кода, zod для границ; PropTypes — только если библиотека обязана работать в JS-проектах.",
            en: {
              title: "“Can you use both together?”",
              code: `// Technically yes (a babel plugin used to generate PropTypes from types),
// but practically pointless: it duplicates the source of truth`,
              text: "A good answer: TS for code, zod for boundaries; PropTypes only if the library must also work in plain-JS projects.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="PropTypes — рантайм-warning только для props (легаси); TS — compile-time для всего кода; внешние данные — zod (тип + валидация из одной схемы)."
          en="PropTypes is a runtime warning for props only (legacy); TS is compile-time for the whole codebase; external data goes through zod (type + validation from one schema)."
        />
      </div>
    </>
  );
}
