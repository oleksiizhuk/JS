import { Reveal } from "./JsDemo";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
  CodeBlock,
} from "../InterviewBlocks";

export default function Coercion() {
  return (
    <>
      <InterviewQuestion en="How does type coercion work in JS? When to use == vs ===?">
        Как работает приведение типов в JS? Когда использовать == и ===?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Coercion is either <b>explicit</b> — Number(x), String(x),
            Boolean(x) — or <b>implicit</b>: in operators, in ==, in if
            conditions. Key rules: <b>plus</b> with a string concatenates, the
            rest of arithmetic coerces to number; there are exactly <b>six</b>
            falsy values — false, 0, empty string, null, undefined, NaN — and
            any object, including empty [] and {"{}"}, is truthy. <b>==</b>
            compares with coercion and is full of surprises ('' == 0 is true),
            so my rule is: always <b>===</b>, and the only == I allow is the
            <b> x == null</b> idiom — it catches both null and undefined.
            Special cases to remember: null == undefined is true but
            null == 0 is false; NaN isn't equal even to itself."
          </>
        }
      >
        «Приведение бывает <b>явное</b> — Number(x), String(x), Boolean(x) — и
        <b> неявное</b>: в операторах, в ==, в условиях if. Ключевые правила:
        <b> плюс</b> со строкой конкатенирует, остальная арифметика приводит к
        числу; falsy-значений ровно <b>шесть</b> — false, 0, пустая строка,
        null, undefined, NaN — а любые объекты, включая пустые [] и {"{}"},
        truthy. <b>==</b> сравнивает с приведением типов и полон сюрпризов
        ('' == 0 — true), поэтому моё правило: всегда <b>===</b>, а ==
        допускаю только как идиому <b>x == null</b> — она ловит null и
        undefined одновременно. Отдельно помню спец-случаи: null == undefined —
        true, но null == 0 — false; NaN не равен даже себе.»
      </ModelAnswer>

      <SectionTitle>Разбор: квиз</SectionTitle>

      <div className="card">
        <h3><L ru="Сначала ответь сам, потом кликни по строке" en="Try to answer first, then click the row" /></h3>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 13, color: "#667" }}>
              <th style={{ padding: "6px 12px" }}><L ru="выражение" en="expression" /></th>
              <th style={{ padding: "6px 12px" }}><L ru="результат" en="result" /></th>
              <th style={{ padding: "6px 12px" }}><L ru="почему" en="why" /></th>
            </tr>
          </thead>
          <tbody>
            <Reveal expr={'1 + "2"'} result={'"12"'} note="+ со строкой → конкатенация" en={{ note: "+ with a string → concatenation" }} />
            <Reveal expr={'"5" - 1'} result={"4"} note="минус только числовой → строка приводится к числу" en={{ note: "minus is number-only → the string is coerced to a number" }} />
            <Reveal expr={'"5" + 1'} result={'"51"'} note="а плюс — опять конкатенация" en={{ note: "but plus is concatenation again" }} />
            <Reveal expr={"[] + []"} result={'""'} note="массивы → строки ('' + '')" en={{ note: "arrays → strings ('' + '')" }} />
            <Reveal expr={"[] + {}"} result={'"[object Object]"'} note="'' + строка объекта" en={{ note: "'' + the object's string form" }} />
            <Reveal expr={"true + true"} result={"2"} note="true → 1" en={{ note: "true → 1" }} />
            <Reveal expr={'"" == 0'} result={"true"} note="== приводит: '' → 0" en={{ note: "== coerces: '' → 0" }} />
            <Reveal expr={'"" === 0'} result={"false"} note="=== без приведения: типы разные" en={{ note: "=== has no coercion: the types differ" }} />
            <Reveal expr={"null == undefined"} result={"true"} note="специальное правило ==" en={{ note: "a special rule of ==" }} />
            <Reveal expr={"null == 0"} result={"false"} note="null равен ТОЛЬКО undefined (и себе)" en={{ note: "null equals ONLY undefined (and itself)" }} />
            <Reveal expr={"NaN === NaN"} result={"false"} note="NaN не равен ничему; проверка — Number.isNaN" en={{ note: "NaN isn't equal to anything; check with Number.isNaN" }} />
            <Reveal expr={"[] == false"} result={"true"} note="[] → '' → 0, false → 0" en={{ note: "[] → '' → 0, false → 0" }} />
            <Reveal expr={"Boolean([])"} result={"true"} note="объекты ВСЕГДА truthy, даже пустые!" en={{ note: "objects are ALWAYS truthy, even empty ones!" }} />
            <Reveal expr={'Boolean("0")'} result={"true"} note="непустая строка truthy" en={{ note: "a non-empty string is truthy" }} />
            <Reveal expr={"0.1 + 0.2 === 0.3"} result={"false"} note="0.30000000000000004 — двоичные дроби (это не coercion, но спрашивают рядом)" en={{ note: "0.30000000000000004 — binary fractions (not coercion, but often asked alongside it)" }} />
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3><L ru="Что заучить" en="What to memorize" /></h3>
        <CodeBlock
          ru={`Falsy-значений ровно 6:  false, 0, "", null, undefined, NaN
Всё остальное truthy:    "0", [], {}, "false" — все truthy!

Приведение к числу:  "" → 0, "12" → 12, "12a" → NaN,
                     null → 0, undefined → NaN, [] → 0, [5] → 5

Правила:
  === всегда;  == допустим только как  x == null  (ловит null И undefined)
  + со строкой конкатенирует;  -, *, / всегда числовые`}
          en={`There are exactly 6 falsy values:  false, 0, "", null, undefined, NaN
Everything else is truthy:    "0", [], {}, "false" — all truthy!

Coercion to number:  "" → 0, "12" → 12, "12a" → NaN,
                     null → 0, undefined → NaN, [] → 0, [5] → 5

Rules:
  === always;  == is only acceptable as  x == null  (catches null AND undefined)
  + with a string concatenates;  -, *, / are always numeric`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Проверь, что массив пустой»",
            code: `if (arr) {...}          // ❌ [] truthy — всегда зайдёт!
if (arr.length) {...}   // ✅`,
            text: "Классическая подлянка на «объекты всегда truthy». То же с {}: проверять Object.keys(obj).length.",
            en: {
              title: "\"Check that the array is empty\"",
              code: `if (arr) {...}          // ❌ [] is truthy — this always runs!
if (arr.length) {...}   // ✅`,
              text: "A classic trap around \"objects are always truthy\". Same with {}: check Object.keys(obj).length instead.",
            },
          },
          {
            title: "Цепочка сравнений",
            code: `1 < 2 < 3;  // true (случайно!)
3 > 2 > 1;  // false: (3 > 2) → true → 1; 1 > 1 → false`,
            text: "Сравнения выполняются слева направо, булев результат приводится к числу. Просят объяснить ПОЧЕМУ.",
            en: {
              title: "Chained comparisons",
              code: `1 < 2 < 3;  // true (by accident!)
3 > 2 > 1;  // false: (3 > 2) → true → 1; 1 > 1 → false`,
              text: "Comparisons evaluate left to right, and the boolean result gets coerced to a number. You'll be asked to explain WHY.",
            },
          },
          {
            title: "«Почему 0.1 + 0.2 !== 0.3?»",
            code: `0.1 + 0.2;  // 0.30000000000000004
// сравнивать: Math.abs(a - b) < Number.EPSILON`,
            text: "Это не coercion, а IEEE 754 (двоичные дроби), но спрашивают в связке. Сказать «баг JS» — минус: так во всех языках с float.",
            en: {
              title: "\"Why isn't 0.1 + 0.2 === 0.3?\"",
              code: `0.1 + 0.2;  // 0.30000000000000004
// compare with: Math.abs(a - b) < Number.EPSILON`,
              text: "This isn't coercion but IEEE 754 (binary fractions), though it's often asked in the same breath. Calling it \"a JS bug\" costs you points — it happens in every language with floats.",
            },
          },
          {
            title: "if (x == null) — легальный ==",
            code: `x == null   // true для null И undefined, false для 0 и ""
x === null || x === undefined  // то же, но длиннее`,
            text: "Проверяют, знаешь ли ты ЕДИНСТВЕННУЮ полезную идиому ==. Ответ «== никогда» тоже ок, но идиома — плюс балл.",
            en: {
              title: "if (x == null) — the one legitimate ==",
              code: `x == null   // true for both null AND undefined, false for 0 and ""
x === null || x === undefined  // the same thing, but longer`,
              text: "Tests whether you know the ONE useful == idiom. Saying \"never use ==\" is acceptable too, but knowing the idiom earns you a point.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> 6 falsy наизусть, объекты всегда
              truthy, + конкатенирует со строкой, === всегда (== только как
              x == null).
            </>
          }
          en={
            <>
              <b>One-line summary:</b> know the 6 falsy values by heart,
              objects are always truthy, + concatenates with a string, ===
              always (== only as x == null).
            </>
          }
        />
      </div>
    </>
  );
}
