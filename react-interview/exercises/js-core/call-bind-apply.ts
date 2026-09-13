// ЗАДАЧКИ: call / bind / apply
// Напиши, что выведет каждая, потом проверь запуском: node call-bind-apply.js

// ── 1. Базовое: что выведет?
const user = { name: "Olex" };
function hi(greeting) {
  console.log(greeting + ", " + this.name);
}
hi.call(user, "Привет");
hi.apply(user, ["Hello"]);
const bound = hi.bind(user);
bound("Yo");
console.log("==============    ==============    ==============")

// ── 2. Потерянный this: что выведет и как починить одной строкой?
const cat = {
  name: "Барсик",
  say() { console.log(this.name); }
};
const fn = cat.say;
fn(); // undefined
// починка
const fn1 = cat.say.bind(cat);
fn1()
const fn2 = cat.say
fn2.call(cat)
// 3. Обёртка — вызов через точку сохраняется внутри
const fn3 = () => cat.say();
fn3();
(() => cat.say())()

console.log("==============    ==============    ==============")

// ── 3. bind нельзя перебить: что выведет?
function who() { console.log('3 ' + this.name); }
const a = who.bind({ name: "A" });
a.call({name: "B"}); // ??? 3 A

// ── 4. Двойной bind: что выведет?
const b = who.bind({ name: "X" }).bind({ name: "Y" });
b(); // ???

// ── 5. apply для массива: найди max без spread
const nums = [3, 7, 1, 9, 4];
console.log(Math.max.apply(null, nums)); // допиши

// ── 6. Частичное применение (bind с аргументами): что выведет?
function mul(x, y) { return x * y; }
const double = mul.bind(null, 2);
console.log(double(5)); // ???

// ── 7. setTimeout + this: что выведет и как починить через bind?
const timer = {
  sec: 10,
  start() {
    setTimeout( () =>{
      console.log(this.sec); // ???
    }, 100);
  }
};
timer.start();

// ── 8. Напиши свой myCall (полифилл) — без call/apply/bind:
// Function.prototype.myCall = function (ctx, ...args) { ... };
