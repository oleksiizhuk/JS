import { Demo } from "./JsDemo.jsx";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  Gotchas,
  L,
} from "../InterviewBlocks.jsx";

export default function Classes() {
  return (
    <>
      <InterviewQuestion en="How do classes work in JS? What's under the hood?">
        Как устроены классы в JS? Что под капотом?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Classes are <b>syntactic sugar over prototypes</b>: methods land on
            Prototype, fields on the instance, and extends just wires the
            prototype chains. What they add on top: <b>strict mode</b> inside,
            no hoisting into a callable state (a class is in the TDZ),
            <b> super</b> for the parent constructor and methods, <b>static</b>
            members and static blocks, and real <b>private fields</b> with #,
            which are enforced by the engine — unlike the underscore
            convention. Details worth mentioning: in a derived constructor you
            can't touch this before calling super(); methods are not bound, so
            passing this.handler as a callback loses this — that's why class
            fields with arrow functions became popular. Instance fields are
            created per object, methods are shared through the prototype —
            that's the memory difference between defining a method and an arrow
            field."
          </>
        }
      >
        «Классы — <b>синтаксический сахар над прототипами</b>: методы ложатся в
        prototype, поля — в экземпляр, а extends просто связывает цепочки
        прототипов. Что они добавляют сверху: внутри всегда <b>strict mode</b>,
        класс не всплывает в вызываемом виде (лежит в TDZ), <b>super</b> для
        родительского конструктора и методов, <b>static</b>-члены и
        static-блоки, и настоящие <b>приватные поля</b> через #, которые
        обеспечивает движок — в отличие от конвенции с подчёркиванием. Детали,
        которые стоит назвать: в наследнике нельзя трогать this до вызова
        super(); методы не привязаны, поэтому передача this.handler колбэком
        теряет this — отсюда популярность полей-стрелок. Поля создаются на
        каждый объект, а методы общие через прототип — в этом разница по памяти
        между методом и стрелочным полем.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <Demo
        title="Класс = прототипы: где что лежит"
        code={`class Animal {
  legs = 4;                      // поле → в ЭКЗЕМПЛЯРЕ
  walk() { return "иду"; }       // метод → в PROTOTYPE (общий для всех)
}
const a = new Animal();

console.log(Object.keys(a));                          // свои поля
console.log(a.hasOwnProperty("walk"));                // метод не свой
console.log(Object.getPrototypeOf(a) === Animal.prototype);
console.log(typeof Animal);                           // класс — это функция!`}
        run={(log) => {
          class Animal {
            legs = 4;
            walk() {
              return "иду";
            }
          }
          const a = new Animal();
          log(Object.keys(a));
          log(a.hasOwnProperty("walk"));
          log(Object.getPrototypeOf(a) === Animal.prototype);
          log(typeof Animal);
        }}
        hint="Класс — это функция-конструктор, методы живут в prototype (одна копия на все экземпляры), поля — в каждом объекте свои."
        en={{
          title: "Class = prototypes: where things live",
          code: `class Animal {
  legs = 4;                      // field → on the INSTANCE
  walk() { return "walking"; }   // method → on the PROTOTYPE (shared by all)
}
const a = new Animal();

console.log(Object.keys(a));                          // own fields
console.log(a.hasOwnProperty("walk"));                // the method isn't its own
console.log(Object.getPrototypeOf(a) === Animal.prototype);
console.log(typeof Animal);                           // a class is a function!`,
          hint: "A class is a constructor function; methods live on the prototype (one copy shared by all instances), while fields belong to each object individually.",
        }}
      />

      <Demo
        title="Приватные поля #: настоящая инкапсуляция"
        code={`class Counter {
  #count = 0;                    // приватное — движок не пустит снаружи
  _legacy = "просто конвенция";  // «приватное» по договорённости

  inc() { return ++this.#count; }
  static has(obj) { return #count in obj; }  // проверка «наш ли класс»
}
const c = new Counter();
c.inc(); c.inc();
console.log(c.inc());
console.log(Object.keys(c));      // #count не видно вообще
console.log(c._legacy);           // а это доступно всем
console.log(Counter.has(c), Counter.has({}));`}
        run={(log) => {
          class Counter {
            #count = 0;
            _legacy = "просто конвенция";
            inc() {
              return ++this.#count;
            }
            static has(obj) {
              return #count in obj;
            }
          }
          const c = new Counter();
          c.inc();
          c.inc();
          log(c.inc());
          log(Object.keys(c));
          log(c._legacy);
          log(Counter.has(c), Counter.has({}));
        }}
        hint="# — единственная настоящая приватность в JS: не видна в Object.keys, JSON, DevTools-переборе; обращение снаружи — синтаксическая ошибка."
        en={{
          title: "Private fields #: real encapsulation",
          code: `class Counter {
  #count = 0;                    // private — the engine blocks outside access
  _legacy = "just a convention"; // "private" by convention only

  inc() { return ++this.#count; }
  static has(obj) { return #count in obj; }  // check "is this our class?"
}
const c = new Counter();
c.inc(); c.inc();
console.log(c.inc());
console.log(Object.keys(c));      // #count isn't visible at all
console.log(c._legacy);           // but this is accessible to everyone
console.log(Counter.has(c), Counter.has({}));`,
          hint: "# is the only real privacy in JS: invisible in Object.keys, JSON, and DevTools enumeration; accessing it from outside is a syntax error.",
        }}
      />

      <Demo
        title="Наследование, super и порядок инициализации"
        code={`class Base {
  constructor() { this.init(); }        // ⚠️ вызов метода из конструктора
  init() { console.log("Base.init"); }
}
class Child extends Base {
  value = "поле ребёнка";               // инициализируется ПОСЛЕ super()
  init() { console.log("Child.init, value =", this.value); }
}
new Child();   // что выведет?`}
        run={(log) => {
          class Base {
            constructor() {
              this.init();
            }
            init() {
              log("Base.init");
            }
          }
          class Child extends Base {
            value = "поле ребёнка";
            init() {
              log("Child.init, value =", this.value);
            }
          }
          new Child();
        }}
        hint="Вызвался переопределённый Child.init (полиморфизм), но value ещё undefined: поля ребёнка инициализируются ПОСЛЕ super(), а super() уже позвал init. Классическая ловушка «не зови переопределяемые методы из конструктора»."
        en={{
          title: "Inheritance, super, and initialization order",
          code: `class Base {
  constructor() { this.init(); }        // ⚠️ calling a method from the constructor
  init() { console.log("Base.init"); }
}
class Child extends Base {
  value = "child's field";              // initialized AFTER super()
  init() { console.log("Child.init, value =", this.value); }
}
new Child();   // what does this log?`,
          hint: "The overridden Child.init runs (polymorphism), but value is still undefined: the child's fields initialize AFTER super(), and super() already called init. A classic trap: never call overridable methods from a constructor.",
        }}
      />

      <Demo
        title="Потеря this у метода класса"
        code={`class Btn {
  label = "OK";
  handleMethod() { return this?.label; }        // обычный метод
  handleArrow = () => this.label;               // поле-стрелка
}
const b = new Btn();
const m = b.handleMethod;
const ar = b.handleArrow;
console.log(m());     // оторвали от объекта
console.log(ar());    // стрелка помнит this`}
        run={(log) => {
          class Btn {
            label = "OK";
            handleMethod() {
              return this?.label;
            }
            handleArrow = () => this.label;
          }
          const b = new Btn();
          const m = b.handleMethod;
          const ar = b.handleArrow;
          log(m());
          log(ar());
        }}
        hint="Методы не привязаны к экземпляру. Поле-стрелка привязано (создаётся в конструкторе с this экземпляра), но лежит в КАЖДОМ объекте — плата памятью за удобство."
        en={{
          title: "A class method loses its this",
          code: `class Btn {
  label = "OK";
  handleMethod() { return this?.label; }        // a regular method
  handleArrow = () => this.label;               // an arrow field
}
const b = new Btn();
const m = b.handleMethod;
const ar = b.handleArrow;
console.log(m());     // detached from the object
console.log(ar());    // the arrow remembers this`,
          hint: "Methods aren't bound to the instance. An arrow field is bound (created in the constructor with the instance's this), but it lives on EVERY object — a memory cost paid for convenience.",
        }}
      />

      <Gotchas
        items={[
          {
            title: "«Классы всплывают, как функции?»",
            code: `new Foo();          // ReferenceError — класс в TDZ
class Foo {}

sum();              // а так работает
function sum() {}`,
            text: "Класс регистрируется, но до объявления недоступен (как let/const). Ответ «классы всплывают как function declaration» — ошибка.",
            en: {
              title: "\"Are classes hoisted like functions?\"",
              code: `new Foo();          // ReferenceError — the class is in the TDZ
class Foo {}

sum();              // but this works fine
function sum() {}`,
              text: "A class is registered but unreachable before its declaration (like let/const). Answering \"classes hoist like function declarations\" is wrong.",
            },
          },
          {
            title: "this до super()",
            code: `class Child extends Base {
  constructor() {
    this.x = 1;   // ❌ ReferenceError: Must call super first
    super();
  }
}`,
            text: "В наследнике this не существует, пока super() не создал объект. Порядок: super() → поля ребёнка → тело конструктора.",
            en: {
              title: "this before super()",
              code: `class Child extends Base {
  constructor() {
    this.x = 1;   // ❌ ReferenceError: Must call super first
    super();
  }
}`,
              text: "In a derived class, this doesn't exist until super() creates the object. Order: super() → the child's fields → the constructor body.",
            },
          },
          {
            title: "Стрелка-поле vs метод: что выбрать",
            code: `class A {
  m() {}            // 1 копия в prototype, но теряет this
  f = () => {};     // своя копия в КАЖДОМ экземпляре, this привязан
}`,
            text: "Для тысяч экземпляров разница по памяти реальна. Современная альтернатива обеим — привязка в конструкторе или просто функциональные компоненты вместо классов.",
            en: {
              title: "Arrow field vs method: which to choose",
              code: `class A {
  m() {}            // 1 copy on the prototype, but loses this
  f = () => {};     // its own copy on EVERY instance, this is bound
}`,
              text: "With thousands of instances, the memory difference is real. A modern alternative to both: binding in the constructor, or simply using function components instead of classes.",
            },
          },
          {
            title: "instanceof обманывается",
            code: `class A {}
const fake = Object.create(A.prototype);
fake instanceof A;   // true, хотя конструктор не вызывался!
// плюс instanceof ломается между iframe/realm`,
            text: "instanceof проверяет только цепочку прототипов. Надёжнее — приватное поле (#brand in obj) или явное поле-дискриминатор.",
            en: {
              title: "instanceof can be fooled",
              code: `class A {}
const fake = Object.create(A.prototype);
fake instanceof A;   // true, even though the constructor never ran!
// plus instanceof breaks across iframes/realms`,
              text: "instanceof only checks the prototype chain. More reliable: a private field (#brand in obj) or an explicit discriminator field.",
            },
          },
          {
            title: "static-блоки и наследование статики",
            code: `class Base { static create() { return new this(); } }
class Child extends Base {}
Child.create() instanceof Child;  // true — this в static это КЛАСС`,
            text: "Статика наследуется, и this внутри static-метода — сам класс (поэтому new this() создаёт наследника). Красивый вопрос со звёздочкой.",
            en: {
              title: "static blocks and inheriting statics",
              code: `class Base { static create() { return new this(); } }
class Child extends Base {}
Child.create() instanceof Child;  // true — this inside a static method is the CLASS`,
              text: "Static members are inherited, and this inside a static method is the class itself (which is why new this() creates a subclass instance). An elegant bonus question.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> класс = сахар над прототипами
              (методы в prototype, поля в экземпляре) + strict mode, TDZ,
              super, static и настоящая приватность через #; методы не
              привязаны к this.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> a class is sugar over prototypes
              (methods on the prototype, fields on the instance) + strict
              mode, TDZ, super, static, and real privacy via #; methods
              aren't bound to this.
            </>
          }
        />
      </div>
    </>
  );
}
