import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
  CodeBlock,
} from "../InterviewBlocks.jsx";

export default function Collections() {
  return (
    <>
      <InterviewQuestion en="Map vs Object, Set, and what are WeakMap/WeakSet for?">
        Map vs Object, Set — в чём разница? Зачем нужны WeakMap/WeakSet?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "<b>Map</b> differs from a plain object in four ways: keys can be
            <b> any type</b> including objects and functions (object keys are
            coerced to strings), insertion <b>order is guaranteed</b> for all
            keys, size is O(1) via <b>.size</b>, and there's no prototype
            pollution — no inherited keys to collide with. So Map is for
            dictionaries with a dynamic or non-string key set; a plain object is
            for records with a known shape, and it's still the only one that
            serializes to JSON directly. <b>Set</b> is a collection of unique
            values — dedupe, membership checks, and it's the reason
            [...new Set(arr)] is the idiomatic dedupe. <b>WeakMap/WeakSet</b>
            hold keys <b>weakly</b>: if nothing else references the object, it
            gets garbage collected together with its entry. They accept only
            objects as keys, aren't iterable and have no size — precisely
            because entries can vanish at any moment. Their use cases: private
            data attached to an object, caches and metadata keyed by DOM nodes
            or instances — anywhere a regular Map would leak memory."
          </>
        }
      >
        «<b>Map</b> отличается от обычного объекта четырьмя вещами: ключами
        может быть <b>любой тип</b>, включая объекты и функции (у объекта ключи
        приводятся к строкам), <b>гарантирован порядок вставки</b> для всех
        ключей, размер за O(1) через <b>.size</b>, и нет загрязнения
        прототипом — нет унаследованных ключей, с которыми можно
        столкнуться. Поэтому Map — для словарей с динамическим или нестроковым
        набором ключей; обычный объект — для записей с известной формой, и
        только он напрямую сериализуется в JSON. <b>Set</b> — коллекция
        уникальных значений: дедупликация и проверка вхождения, отсюда идиома
        [...new Set(arr)]. <b>WeakMap/WeakSet</b> держат ключи <b>слабо</b>:
        если на объект больше никто не ссылается, он собирается сборщиком
        мусора вместе с записью. Ключами могут быть только объекты, они не
        итерируемы и не имеют size — именно потому, что записи могут исчезнуть
        в любой момент. Применения: приватные данные, привязанные к объекту,
        кэши и метаданные по DOM-узлам или экземплярам — везде, где обычный Map
        давал бы утечку памяти.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <Demo
        title="Ключи: Map берёт что угодно, объект — только строки"
        code={`const obj = {};
obj[1] = "число";
obj["1"] = "строка";        // ЗАТЁР — ключ один и тот же "1"
console.log(obj);

const map = new Map();
const keyObj = { id: 1 };
map.set(1, "число").set("1", "строка").set(keyObj, "объект как ключ");
console.log(map.size);
console.log(map.get(1), map.get("1"), map.get(keyObj));
console.log(map.get({ id: 1 }));   // другой объект → другая ссылка!`}
        run={(log) => {
          const obj = {};
          obj[1] = "число";
          obj["1"] = "строка";
          log(obj);
          const map = new Map();
          const keyObj = { id: 1 };
          map.set(1, "число").set("1", "строка").set(keyObj, "объект как ключ");
          log(map.size);
          log(map.get(1), map.get("1"), map.get(keyObj));
          log(map.get({ id: 1 }));
        }}
        hint="У объекта ключи приводятся к строкам — 1 и '1' схлопнулись. Map различает типы и сравнивает объекты по ссылке (поэтому одинаковый по виду литерал не найдётся)."
        en={{
          title: "Keys: Map takes anything, an object — only strings",
          code: `const obj = {};
obj[1] = "number";
obj["1"] = "string";        // OVERWRITTEN — it's the same key "1"
console.log(obj);

const map = new Map();
const keyObj = { id: 1 };
map.set(1, "number").set("1", "string").set(keyObj, "object as a key");
console.log(map.size);
console.log(map.get(1), map.get("1"), map.get(keyObj));
console.log(map.get({ id: 1 }));   // a different object → a different reference!`,
          hint: "An object's keys get coerced to strings — 1 and '1' collapse into one. Map distinguishes types and compares objects by reference (so a lookalike literal won't be found).",
        }}
      />

      <Demo
        title="Set: уникальность, дедупликация, операции"
        code={`const s = new Set([1, 2, 2, 3, 1]);
console.log([...s], s.size);
console.log(s.has(2), s.has(99));

// Set использует SameValueZero: NaN считается равным самому себе
console.log(new Set([NaN, NaN]).size);
console.log([NaN].indexOf(NaN), [NaN].includes(NaN));

// но объекты — по ссылке
console.log(new Set([{ a: 1 }, { a: 1 }]).size);`}
        run={(log) => {
          const s = new Set([1, 2, 2, 3, 1]);
          log([...s], s.size);
          log(s.has(2), s.has(99));
          log(new Set([NaN, NaN]).size);
          log([NaN].indexOf(NaN), [NaN].includes(NaN));
          log(new Set([{ a: 1 }, { a: 1 }]).size);
        }}
        hint="Дедупликация работает для примитивов; объекты уникальны по ссылке. Сравнение — SameValueZero: NaN равен NaN (в отличие от ===), но +0 и -0 считаются одним значением."
        en={{
          title: "Set: uniqueness, deduplication, operations",
          code: `const s = new Set([1, 2, 2, 3, 1]);
console.log([...s], s.size);
console.log(s.has(2), s.has(99));

// Set uses SameValueZero: NaN is considered equal to itself
console.log(new Set([NaN, NaN]).size);
console.log([NaN].indexOf(NaN), [NaN].includes(NaN));

// but objects are compared by reference
console.log(new Set([{ a: 1 }, { a: 1 }]).size);`,
          hint: "Deduplication works for primitives; objects are unique by reference. The comparison is SameValueZero: NaN equals NaN (unlike ===), but +0 and -0 count as the same value.",
        }}
      />

      <Demo
        title="Приватные данные через WeakMap (паттерн до #-полей)"
        code={`const secrets = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    secrets.set(this, { password });   // данные ЛЕЖАТ СНАРУЖИ объекта
  }
  check(pwd) { return secrets.get(this).password === pwd; }
}

const u = new User("Olex", "1234");
console.log(Object.keys(u));       // password не виден
console.log(JSON.stringify(u));    // и не сериализуется
console.log(u.check("1234"), u.check("oops"));
// когда u соберёт GC — запись в WeakMap исчезнет сама`}
        run={(log) => {
          const secrets = new WeakMap();
          class User {
            constructor(name, password) {
              this.name = name;
              secrets.set(this, { password });
            }
            check(pwd) {
              return secrets.get(this).password === pwd;
            }
          }
          const u = new User("Olex", "1234");
          log(Object.keys(u));
          log(JSON.stringify(u));
          log(u.check("1234"), u.check("oops"));
        }}
        hint="Классический способ приватности до появления #-полей. Главное свойство: WeakMap не удерживает объект в памяти — удалили юзера, запись ушла автоматически."
        en={{
          title: "Private data via WeakMap (the pattern before # fields)",
          code: `const secrets = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    secrets.set(this, { password });   // the data lives OUTSIDE the object
  }
  check(pwd) { return secrets.get(this).password === pwd; }
}

const u = new User("Olex", "1234");
console.log(Object.keys(u));       // password isn't visible
console.log(JSON.stringify(u));    // and it doesn't get serialized either
console.log(u.check("1234"), u.check("oops"));
// once u is garbage collected, its WeakMap entry disappears on its own`,
          hint: "The classic privacy trick before # fields existed. The key property: a WeakMap doesn't keep the object alive in memory — delete the user and its entry vanishes automatically.",
        }}
      />

      <div className="card">
        <h3><L ru="📚 Справочник" en="📚 Reference" /></h3>
        <CodeBlock
          ru={`Map                          Set
new Map([[k, v], ...])       new Set([v, ...])
map.set(k, v)  → сам map     set.add(v)     → сам set (чейнится)
map.get(k)                   set.has(v)
map.has(k) / map.delete(k)   set.delete(v)
map.size / map.clear()       set.size / set.clear()
map.keys()/values()/entries()  — итераторы, порядок вставки
[...map]  → [[k,v], ...]     [...set]  → [v, ...]
Object.fromEntries(map)      Array.from(set)

WeakMap / WeakSet — только: get/set/has/delete (WeakSet: add/has/delete)
  ключи ТОЛЬКО объекты (и Symbol), не итерируемы, нет size и clear

Когда что:
  объект  — запись известной формы, нужен JSON
  Map     — словарь: динамические/нестроковые ключи, частые add/delete, size
  Set     — уникальность и быстрая проверка вхождения
  WeakMap — метаданные по объекту без удержания его в памяти (кэш, приватность)`}
          en={`Map                          Set
new Map([[k, v], ...])       new Set([v, ...])
map.set(k, v)  → the map     set.add(v)     → the set (chainable)
map.get(k)                   set.has(v)
map.has(k) / map.delete(k)   set.delete(v)
map.size / map.clear()       set.size / set.clear()
map.keys()/values()/entries()  — iterators, insertion order
[...map]  → [[k,v], ...]     [...set]  → [v, ...]
Object.fromEntries(map)      Array.from(set)

WeakMap / WeakSet — only: get/set/has/delete (WeakSet: add/has/delete)
  keys are ONLY objects (and Symbols), not iterable, no size or clear

When to use what:
  object  — a record of a known shape, needs JSON
  Map     — a dictionary: dynamic/non-string keys, frequent add/delete, size
  Set     — uniqueness and fast membership checks
  WeakMap — metadata attached to an object without keeping it in memory (cache, privacy)`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Map не сериализуется в JSON",
            code: `JSON.stringify(new Map([["a", 1]]));  // "{}" — пусто!
JSON.stringify([...map]);              // [["a",1]] — так работает
new Map(JSON.parse(str));              // и обратно`,
            text: "Частая боль при сохранении в localStorage/по сети: Map и Set молча превращаются в {}. Конвертировать явно.",
            en: {
              title: "Map doesn't serialize to JSON",
              code: `JSON.stringify(new Map([["a", 1]]));  // "{}" — empty!
JSON.stringify([...map]);              // [["a",1]] — this works
new Map(JSON.parse(str));              // and back again`,
              text: "A common pain point when saving to localStorage or sending over the network: Map and Set silently turn into {}. Convert them explicitly.",
            },
          },
          {
            title: "«Объект — тоже словарь, зачем Map?»",
            code: `const dict = {};
dict["toString"];      // ƒ toString — унаследовано из прототипа!
dict["__proto__"] = 1; // может сломать объект
// защита: Object.create(null) или просто Map`,
            text: "Пользовательские ключи в обычном объекте пересекаются с прототипом (prototype pollution — ещё и уязвимость). Map чист по определению.",
            en: {
              title: "\"An object is also a dictionary, why use Map?\"",
              code: `const dict = {};
dict["toString"];      // ƒ toString — inherited from the prototype!
dict["__proto__"] = 1; // can break the object
// protection: Object.create(null) or just use a Map`,
              text: "User-controlled keys on a plain object collide with the prototype (prototype pollution — also a security vulnerability). A Map is clean by design.",
            },
          },
          {
            title: "WeakMap не итерируется — и это не недостаток",
            code: `for (const x of weakMap) {}   // TypeError: не итерируем
weakMap.size                   // undefined`,
            text: "Если бы перебор был возможен, GC-сборка меняла бы результат перебора недетерминированно. Отсюда ограничение API — частый вопрос «почему нельзя».",
            en: {
              title: "WeakMap isn't iterable — and that's not a flaw",
              code: `for (const x of weakMap) {}   // TypeError: not iterable
weakMap.size                   // undefined`,
              text: "If iteration were possible, garbage collection would change the iteration result nondeterministically. Hence the API restriction — a common \"why can't you\" question.",
            },
          },
          {
            title: "Set не сохраняет «первое» при мутации объектов",
            code: `const a = { v: 1 };
const s = new Set([a]);
a.v = 2;             // мутировали объект внутри Set
s.has(a);            // true — ключ это ССЫЛКА, не содержимое`,
            text: "Set/Map сравнивают объекты по ссылке, поэтому мутация «внутри» их не волнует — но и дедупликации по содержимому не будет.",
            en: {
              title: "Set doesn't freeze objects when they mutate",
              code: `const a = { v: 1 };
const s = new Set([a]);
a.v = 2;             // mutated the object while it's inside the Set
s.has(a);            // true — the key is a REFERENCE, not the contents`,
              text: "Set/Map compare objects by reference, so mutating them \"in place\" doesn't matter to the collection — but you also don't get deduplication by content.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> Map — любые ключи, порядок, size,
              без прототипа; Set — уникальность; Weak-версии держат ключи
              слабо (только объекты, без итерации) для метаданных и кэшей без
              утечек.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> Map — any key type, guaranteed order,
              size, no prototype; Set — uniqueness; the Weak variants hold
              keys weakly (objects only, no iteration) for metadata and
              caches without leaks.
            </>
          }
        />
      </div>
    </>
  );
}
