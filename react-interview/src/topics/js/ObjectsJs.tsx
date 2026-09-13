import { Demo } from "./JsDemo";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
  CodeBlock,
} from "../InterviewBlocks";

export default function ObjectsJs() {
  return (
    <>
      <InterviewQuestion en="Tell me about objects in JS: copying, comparison, prototypes.">
        Расскажи про объекты в JS: копирование, сравнение, прототипы.
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Objects are compared and passed <b>by reference</b> —
            {" {} === {} "} is false, and assignment copies the reference, not
            the object. Copying: spread and Object.assign are <b>shallow</b>,
            nested objects stay shared; deep copy — <b>structuredClone</b>
            (the old JSON.parse/stringify trick loses functions, Dates and
            undefined). A missing property is looked up through the
            <b> prototype chain</b> — that's how array methods work and how
            inheritance is implemented; class is syntactic sugar over it.
            Keys are strings or Symbols; Object.keys returns own enumerable
            keys, for...in also walks inherited ones. Object.freeze is
            shallow. Reference comparison is what React's immutability rests
            on: to change something means to create a new reference."
          </>
        }
      >
        «Объекты сравниваются и передаются <b>по ссылке</b> — {"{} === {}"} это
        false, а присваивание копирует ссылку, не объект. Копирование:
        spread и Object.assign — <b>поверхностные</b>, вложенные объекты
        остаются общими; глубокая копия — <b>structuredClone</b> (старый способ
        JSON.parse/stringify теряет функции, Date и undefined). Свойство,
        которого нет у объекта, ищется по <b>цепочке прототипов</b> — так
        работают методы массивов и «наследование»; class — синтаксический сахар
        над этим механизмом. Ключи — строки или Symbol; Object.keys возвращает
        свои enumerable-ключи, for...in — ещё и унаследованные. Ну и
        Object.freeze — неглубокая заморозка. На сравнении по ссылке стоит вся
        иммутабельность React: изменить = создать новую ссылку.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>
      <Demo
        title="Сравнение по ссылке"
        code={`console.log({} === {});            // false — разные объекты
const a = { x: 1 };
const b = a;                        // копируется ССЫЛКА
b.x = 99;
console.log(a.x);                   // 99 — a и b это ОДИН объект`}
        run={(log) => {
          const o1 = {}; // TS не даёт сравнивать литералы напрямую — то же через переменные
          const o2 = {};
          log(o1 === o2);
          const a = { x: 1 };
          const b = a;
          b.x = 99;
          log(a.x);
        }}
        hint="Переменная хранит не объект, а ссылку на него. Поэтому же React требует иммутабельности — он сравнивает ссылки."
        en={{
          title: "Reference comparison",
          code: `console.log({} === {});            // false — different objects
const a = { x: 1 };
const b = a;                        // the REFERENCE is copied
b.x = 99;
console.log(a.x);                   // 99 — a and b are ONE object`,
          hint: "A variable doesn't hold an object, it holds a reference to it. That's exactly why React requires immutability — it compares references.",
        }}
      />

      <Demo
        title="Поверхностная копия vs structuredClone"
        code={`const user = { name: "Olex", address: { city: "Kyiv" } };

const shallow = { ...user };            // копия 1-го уровня
shallow.address.city = "Lviv";          // а вложенный объект ОБЩИЙ!
console.log(user.address.city);         // "Lviv" 😱

const deep = structuredClone(user);     // глубокая копия
deep.address.city = "Odesa";
console.log(user.address.city);         // не изменился`}
        run={(log) => {
          const user = { name: "Olex", address: { city: "Kyiv" } };
          const shallow = { ...user };
          shallow.address.city = "Lviv";
          log(user.address.city);
          const deep = structuredClone(user);
          deep.address.city = "Odesa";
          log(user.address.city);
        }}
        hint="{...obj} и Object.assign копируют только верхний уровень — вложенные объекты остаются общими. Глубоко: structuredClone (JSON.parse(JSON.stringify) — старый способ, теряет функции/Date/undefined)."
        en={{
          title: "Shallow copy vs structuredClone",
          code: `const user = { name: "Olex", address: { city: "Kyiv" } };

const shallow = { ...user };            // top-level copy
shallow.address.city = "Lviv";          // but the nested object is SHARED!
console.log(user.address.city);         // "Lviv" 😱

const deep = structuredClone(user);     // deep copy
deep.address.city = "Odesa";
console.log(user.address.city);         // unchanged`,
          hint: "{...obj} and Object.assign only copy the top level — nested objects stay shared. For a deep copy: structuredClone (JSON.parse(JSON.stringify) is the old trick, but it loses functions/Dates/undefined).",
        }}
      />

      <Demo
        title="Прототипы: поиск свойства по цепочке"
        code={`const animal = { eats: true, walk() { return "иду"; } };
const dog = Object.create(animal);   // animal — прототип dog
dog.barks = true;

console.log(dog.barks);              // своё
console.log(dog.eats);               // найдено в прототипе!
console.log(dog.walk());             // метод из прототипа
console.log(Object.keys(dog));       // только СВОИ ключи
console.log("eats" in dog);          // in смотрит и в прототип`}
        run={(log) => {
          const animal = {
            eats: true,
            walk() {
              return "иду";
            },
          };
          const dog = Object.create(animal);
          dog.barks = true;
          log(dog.barks);
          log(dog.eats);
          log(dog.walk());
          log(Object.keys(dog));
          log("eats" in dog);
        }}
        hint="Если свойства нет у объекта — JS ищет в его прототипе, потом в прототипе прототипа... Так работают методы массивов ([].map лежит в Array.prototype) и «наследование» классов."
        en={{
          title: "Prototypes: looking up a property along the chain",
          code: `const animal = { eats: true, walk() { return "walking"; } };
const dog = Object.create(animal);   // animal is dog's prototype
dog.barks = true;

console.log(dog.barks);              // own property
console.log(dog.eats);               // found on the prototype!
console.log(dog.walk());             // method from the prototype
console.log(Object.keys(dog));       // only OWN keys
console.log("eats" in dog);          // in also checks the prototype`,
          hint: "If a property isn't on the object, JS looks it up on its prototype, then that prototype's prototype... That's how array methods work ([].map lives on Array.prototype) and how class \"inheritance\" is implemented.",
        }}
      />

      <Demo
        title="Порядок ключей и Object.entries"
        code={`const obj = { b: 1, 2: "two", a: 3, 1: "one" };
console.log(Object.keys(obj));
// числовые — по возрастанию, потом строковые — в порядке добавления

console.log(Object.entries({ x: 1, y: 2 }));
console.log(Object.fromEntries([["a", 1], ["b", 2]]));`}
        run={(log) => {
          const obj = { b: 1, 2: "two", a: 3, 1: "one" };
          log(Object.keys(obj));
          log(Object.entries({ x: 1, y: 2 }));
          log(Object.fromEntries([["a", 1], ["b", 2]]));
        }}
        hint="entries/fromEntries — мост объект ↔ массив пар: фильтрация и трансформация объектов через map/filter."
        en={{
          title: "Key order and Object.entries",
          code: `const obj = { b: 1, 2: "two", a: 3, 1: "one" };
console.log(Object.keys(obj));
// numeric keys ascending first, then string keys in insertion order

console.log(Object.entries({ x: 1, y: 2 }));
console.log(Object.fromEntries([["a", 1], ["b", 2]]));`,
          hint: "entries/fromEntries bridge object ↔ array of pairs: filter and transform objects with map/filter.",
        }}
      />

      <div className="card">
        <h3><L ru="📚 Справочник: методы Object" en="📚 Reference: Object methods" /></h3>
        <CodeBlock
          ru={`── Чтение ──
Object.keys(obj)                 // свои enumerable ключи → ["a", "b"]
Object.values(obj)               // значения → [1, 2]
Object.entries(obj)              // пары → [["a", 1], ["b", 2]]
Object.getOwnPropertyNames(obj)  // все свои ключи (даже non-enumerable)
Object.getPrototypeOf(obj)       // прототип объекта
obj.hasOwnProperty("a")          // своё ли свойство (не из прототипа)
Object.hasOwn(obj, "a")          // современная замена hasOwnProperty
"a" in obj                       // есть ли (включая прототипы)

── Создание / копирование ──
Object.assign(target, src)       // поверхностное слияние (мутирует target!)
{ ...obj }                       // поверхностная копия (spread)
structuredClone(obj)             // ГЛУБОКАЯ копия
Object.create(proto)             // новый объект с заданным прототипом
Object.fromEntries(pairs)        // [["a",1]] → { a: 1 } (обратно entries)

── Защита ──
Object.freeze(obj)               // нельзя менять/добавлять/удалять (неглубоко!)
Object.seal(obj)                 // нельзя добавлять/удалять, менять можно
Object.isFrozen / isSealed       // проверки

── Сравнение / дескрипторы ──
Object.is(a, b)                  // как ===, но NaN===NaN true, +0!==-0
Object.defineProperty(obj, k, d) // свойство с дескриптором (writable, get/set)
Object.getOwnPropertyDescriptor(obj, k)`}
          en={`── Reading ──
Object.keys(obj)                 // own enumerable keys → ["a", "b"]
Object.values(obj)               // values → [1, 2]
Object.entries(obj)              // pairs → [["a", 1], ["b", 2]]
Object.getOwnPropertyNames(obj)  // all own keys (even non-enumerable)
Object.getPrototypeOf(obj)       // the object's prototype
obj.hasOwnProperty("a")          // is it an own property (not from the prototype)
Object.hasOwn(obj, "a")          // the modern replacement for hasOwnProperty
"a" in obj                       // does it exist (including prototypes)

── Creating / copying ──
Object.assign(target, src)       // shallow merge (mutates target!)
{ ...obj }                       // shallow copy (spread)
structuredClone(obj)             // DEEP copy
Object.create(proto)             // a new object with the given prototype
Object.fromEntries(pairs)        // [["a",1]] → { a: 1 } (the inverse of entries)

── Protection ──
Object.freeze(obj)               // can't change/add/remove (shallow only!)
Object.seal(obj)                 // can't add/remove, but can change
Object.isFrozen / isSealed       // checks

── Comparison / descriptors ──
Object.is(a, b)                  // like ===, but NaN===NaN is true, +0!==-0
Object.defineProperty(obj, k, d) // define a property with a descriptor (writable, get/set)
Object.getOwnPropertyDescriptor(obj, k)`}
        />
        <p className="hint">
          <L
            ru="Частый приём на собесе: трансформация объекта через Object.fromEntries(Object.entries(obj).map/filter(...))."
            en="A common interview trick: transforming an object via Object.fromEntries(Object.entries(obj).map/filter(...))."
          />
        </p>
      </div>

      <Gotchas
        items={[
          {
            title: "«Сравни два объекта»",
            code: `{ a: 1 } === { a: 1 }  // false!
// по содержимому: JSON.stringify (хрупко) или deepEqual из библиотеки`,
            text: "Встроенного глубокого сравнения в JS нет. Упомянуть, что React/memo сравнивают ТОЛЬКО по ссылке — поэтому иммутабельность.",
            en: {
              title: "\"Compare two objects\"",
              code: `{ a: 1 } === { a: 1 }  // false!
// by content: JSON.stringify (fragile) or a library's deepEqual`,
              text: "JS has no built-in deep comparison. Mention that React/memo compare ONLY by reference — that's why immutability matters.",
            },
          },
          {
            title: "const и мутация + freeze неглубокий",
            code: `const obj = Object.freeze({ a: { b: 1 } });
obj.a = 2;    // молча не сработает (strict: TypeError)
obj.a.b = 99; // РАБОТАЕТ! freeze не трогает вложенные`,
            text: "Двойная ловушка: const не защищает содержимое, а freeze — только верхний уровень.",
            en: {
              title: "const and mutation + freeze is shallow",
              code: `const obj = Object.freeze({ a: { b: 1 } });
obj.a = 2;    // silently fails (strict mode: TypeError)
obj.a.b = 99; // WORKS! freeze doesn't touch nested objects`,
              text: "A double trap: const doesn't protect the contents, and freeze only covers the top level.",
            },
          },
          {
            title: "Ключи всегда строки",
            code: `const obj = {};
obj[1] = "a"; obj["1"] = "b";
console.log(obj[1]); // "b" — это ОДИН ключ "1"`,
            text: "Числовые ключи приводятся к строкам (кроме Symbol). Отсюда же порядок: числовые по возрастанию, потом строковые по вставке.",
            en: {
              title: "Keys are always strings",
              code: `const obj = {};
obj[1] = "a"; obj["1"] = "b";
console.log(obj[1]); // "b" — this is ONE key, "1"`,
              text: "Numeric keys are coerced to strings (except Symbols). That's also why the ordering is: numeric keys ascending, then string keys in insertion order.",
            },
          },
          {
            title: "Копия «оторвалась» не полностью",
            code: `const copy = { ...state };
copy.user.name = "X";   // ❌ изменил и state.user.name!
// фикс: { ...state, user: { ...state.user, name: "X" } }`,
            text: "Главный источник багов с state в React: spread скопировал верхний уровень, вложенный user — общий.",
            en: {
              title: "The copy isn't fully detached",
              code: `const copy = { ...state };
copy.user.name = "X";   // ❌ also mutated state.user.name!
// fix: { ...state, user: { ...state.user, name: "X" } }`,
              text: "The main source of state bugs in React: spread copied the top level, but the nested user object is still shared.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> всё по ссылке; spread —
              поверхностно, structuredClone — глубоко; поиск свойств — по
              цепочке прототипов; freeze и const не защищают вложенное.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> everything is by reference; spread is
              shallow, structuredClone is deep; property lookup follows the
              prototype chain; freeze and const don't protect nested data.
            </>
          }
        />
      </div>
    </>
  );
}
