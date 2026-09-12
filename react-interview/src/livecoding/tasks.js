// Задачи live coding. Каждая: описание, стартовый код, тесты (запускаются
// в браузере по коду пользователя), эталонное решение с разбором.
// Тест = async-функция, получает функцию пользователя, кидает Error при провале.

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function assertEq(actual, expected, label = "") {
  if (!eq(actual, expected))
    throw new Error(
      (label ? label + ": " : "") +
        `ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(actual)}`
    );
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export const TASKS = [
  // ═══════════ EASY ═══════════
  {
    id: "reverse-string",
    title: "Reverse String",
    level: "easy",
    brief: "Разверни строку (задача из чек-листа).",
    description:
      "Напиши функцию reverse(str), возвращающую строку задом наперёд. Бонус на собесе: сделать без .reverse() и объяснить проблему с эмодзи.",
    fnName: "reverse",
    starter: `function reverse(str) {
  // твой код
}`,
    tests: [
      { name: 'reverse("hello") → "olleh"', run: (fn) => assertEq(fn("hello"), "olleh") },
      { name: "пустая строка", run: (fn) => assertEq(fn(""), "") },
      { name: "один символ", run: (fn) => assertEq(fn("а"), "а") },
      { name: 'reverse("Hello World!") → "!dlroW olleH"', run: (fn) => assertEq(fn("Hello World!"), "!dlroW olleH") },
      { name: "эмодзи не ломаются: reverse('ab👍')", run: (fn) => assertEq(fn("ab👍"), "👍ba") },
    ],
    solution: `const reverse = (str) => [...str].reverse().join("");

// без встроенного reverse:
function reverse2(str) {
  let result = "";
  for (const ch of str) result = ch + result; // for...of идёт по code points
  return result;
}`,
    notes:
      "[...str] и for...of итерируют по code points — эмодзи (суррогатные пары) не ломаются. str.split(\"\") разрезал бы 👍 на два битых чара. Индексный цикл for (i--) — тоже ломает.",
    en: {
      title: "Reverse String",
      brief: "Reverse a string (checklist task).",
      description:
        "Write a function reverse(str) that returns the string backwards. Bonus in the interview: do it without .reverse() and explain the emoji problem.",
      starter: `function reverse(str) {
  // your code
}`,
      solution: `const reverse = (str) => [...str].reverse().join("");

// without the built-in reverse:
function reverse2(str) {
  let result = "";
  for (const ch of str) result = ch + result; // for...of walks over code points
  return result;
}`,
      notes:
        "[...str] and for...of iterate over code points — emoji (surrogate pairs) don't break. str.split(\"\") would cut 👍 into two broken chars. An index-based loop for (i--) breaks it too.",
    },
  },
  {
    id: "dedupe",
    title: "Убрать дубликаты",
    level: "easy",
    brief: "uniq(arr) — уникальные значения с сохранением порядка.",
    description:
      "Напиши uniq(arr): вернуть массив без дубликатов, порядок первых вхождений сохранить.",
    fnName: "uniq",
    starter: `function uniq(arr) {
  // твой код
}`,
    tests: [
      { name: "[1,2,2,3,1] → [1,2,3]", run: (fn) => assertEq(fn([1, 2, 2, 3, 1]), [1, 2, 3]) },
      { name: "строки", run: (fn) => assertEq(fn(["a", "b", "a"]), ["a", "b"]) },
      { name: "пустой массив", run: (fn) => assertEq(fn([]), []) },
      { name: "без дублей — без изменений", run: (fn) => assertEq(fn([3, 1, 2]), [3, 1, 2]) },
      { name: "не мутирует исходный", run: (fn) => { const a = [1, 1]; fn(a); assertEq(a, [1, 1], "исходный массив"); } },
      { name: "1 и '1' — разные значения", run: (fn) => assertEq(fn([1, "1", 2]), [1, "1", 2]) },
    ],
    solution: `const uniq = (arr) => [...new Set(arr)];

// вручную (спросят «а без Set?»):
function uniq2(arr) {
  const seen = new Set();
  return arr.filter((x) => !seen.has(x) && seen.add(x));
}`,
    notes:
      "Set хранит уникальные по SameValueZero (NaN равен NaN). Вариант с filter+indexOf — O(n²), упомяни это как минус.",
    en: {
      title: "Remove Duplicates",
      brief: "uniq(arr) — unique values, order preserved.",
      description:
        "Write uniq(arr): return an array with duplicates removed, keeping the order of first occurrences.",
      starter: `function uniq(arr) {
  // your code
}`,
      solution: `const uniq = (arr) => [...new Set(arr)];

// by hand (they may ask "and without Set?"):
function uniq2(arr) {
  const seen = new Set();
  return arr.filter((x) => !seen.has(x) && seen.add(x));
}`,
      notes:
        "Set keeps values unique by SameValueZero (NaN equals NaN). The filter+indexOf version is O(n²) — mention that as a downside.",
    },
  },
  {
    id: "flatten",
    title: "Flatten",
    level: "easy",
    brief: "Разгладить вложенный массив без .flat().",
    description:
      "Напиши flatten(arr), разворачивающую вложенность любой глубины: [1,[2,[3,[4]]]] → [1,2,3,4]. Без использования Array.prototype.flat.",
    fnName: "flatten",
    starter: `function flatten(arr) {
  // твой код (без .flat())
}`,
    tests: [
      { name: "[1,[2,[3,[4]]]] → [1,2,3,4]", run: (fn) => assertEq(fn([1, [2, [3, [4]]]]), [1, 2, 3, 4]) },
      { name: "плоский — без изменений", run: (fn) => assertEq(fn([1, 2]), [1, 2]) },
      { name: "пустые вложенности", run: (fn) => assertEq(fn([[], [1, []], 2]), [1, 2]) },
      { name: "глубина 6", run: (fn) => assertEq(fn([[[[[[42]]]]]]), [42]) },
      { name: "смешанные типы", run: (fn) => assertEq(fn([1, ["a", [true, [null]]]]), [1, "a", true, null]) },
    ],
    solution: `function flatten(arr) {
  return arr.reduce(
    (acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x),
    []
  );
}

// итеративно, без рекурсии (стек):
function flatten2(arr) {
  const stack = [...arr], out = [];
  while (stack.length) {
    const x = stack.pop();
    Array.isArray(x) ? stack.push(...x) : out.push(x);
  }
  return out.reverse();
}`,
    notes:
      "Рекурсия + reduce — каноничный ответ. Бонус: итеративная версия со стеком (не упадёт на очень глубокой вложенности) и проверка Array.isArray, а не instanceof.",
    en: {
      title: "Flatten",
      brief: "Flatten a nested array without .flat().",
      description:
        "Write flatten(arr), unwrapping nesting of any depth: [1,[2,[3,[4]]]] → [1,2,3,4]. Without using Array.prototype.flat.",
      starter: `function flatten(arr) {
  // your code (no .flat())
}`,
      solution: `function flatten(arr) {
  return arr.reduce(
    (acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x),
    []
  );
}

// iterative, without recursion (a stack):
function flatten2(arr) {
  const stack = [...arr], out = [];
  while (stack.length) {
    const x = stack.pop();
    Array.isArray(x) ? stack.push(...x) : out.push(x);
  }
  return out.reverse();
}`,
      notes:
        "Recursion + reduce is the canonical answer. Bonus: an iterative version with a stack (won't blow up on very deep nesting), and checking Array.isArray rather than instanceof.",
    },
  },
  {
    id: "group-by",
    title: "groupBy",
    level: "easy",
    brief: "Сгруппировать элементы по ключу из функции.",
    description:
      "Напиши groupBy(arr, keyFn): вернуть объект, где ключ — результат keyFn(элемент), значение — массив элементов с этим ключом.",
    fnName: "groupBy",
    starter: `function groupBy(arr, keyFn) {
  // твой код
}`,
    tests: [
      {
        name: "слова по первой букве",
        run: (fn) =>
          assertEq(fn(["apple", "avocado", "banana"], (w) => w[0]), {
            a: ["apple", "avocado"],
            b: ["banana"],
          }),
      },
      {
        name: "числа по чёт/нечет",
        run: (fn) =>
          assertEq(fn([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even")), {
            odd: [1, 3],
            even: [2, 4],
          }),
      },
      { name: "пустой массив → {}", run: (fn) => assertEq(fn([], (x) => x), {}) },
    ],
    solution: `function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    (acc[keyFn(item)] ??= []).push(item);
    return acc;
  }, {});
}`,
    notes:
      "Идиома (acc[key] ??= []).push(item) — «создай массив, если нет, и добавь». Упомяни встроенный Object.groupBy (ES2024) — знание нового API даёт плюс.",
    en: {
      title: "groupBy",
      brief: "Group elements by a key produced by a function.",
      description:
        "Write groupBy(arr, keyFn): return an object where each key is the result of keyFn(element) and the value is an array of elements sharing that key.",
      starter: `function groupBy(arr, keyFn) {
  // your code
}`,
      solution: `function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    (acc[keyFn(item)] ??= []).push(item);
    return acc;
  }, {});
}`,
      notes:
        "The idiom (acc[key] ??= []).push(item) means \"create the array if it's missing, then push\". Mention the built-in Object.groupBy (ES2024) — knowing the new API is a plus.",
    },
  },

  // ═══════════ MEDIUM ═══════════
  {
    id: "once",
    title: "once",
    level: "medium",
    brief: "Функция выполняется один раз, дальше — кэш результата.",
    description:
      "Напиши once(fn): вернуть функцию, которая вызывает fn только при первом вызове; последующие вызовы возвращают первый результат, не вызывая fn.",
    fnName: "once",
    starter: `function once(fn) {
  // твой код (подсказка: состояние — в замыкании)
}`,
    tests: [
      {
        name: "fn вызвана один раз",
        run: (fn) => {
          let calls = 0;
          const init = fn(() => ++calls);
          init(); init(); init();
          assertEq(calls, 1, "число вызовов");
        },
      },
      {
        name: "возвращается ПЕРВЫЙ результат",
        run: (fn) => {
          let n = 0;
          const g = fn(() => ++n);
          assertEq(g(), 1, "1-й вызов");
          assertEq(g(), 1, "2-й вызов (кэш)");
        },
      },
      {
        name: "аргументы первого вызова передаются",
        run: (fn) => {
          const g = fn((a, b) => a + b);
          assertEq(g(2, 3), 5);
          assertEq(g(100, 200), 5, "аргументы повторных вызовов игнорируются");
        },
      },
      {
        name: "fn вернула undefined — всё равно один вызов",
        run: (fn) => {
          let calls = 0;
          const g = fn(() => { calls++; return undefined; });
          g(); g(); g();
          assertEq(calls, 1, "число вызовов (ловит проверку result === undefined вместо флага)");
        },
      },
    ],
    solution: `function once(fn) {
  let called = false, result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}`,
    notes:
      "Классика на замыкания: called и result живут между вызовами. Флаг called нужен отдельно — проверка result === undefined сломалась бы, если fn вернула undefined.",
    en: {
      title: "once",
      brief: "The function runs once, then returns a cached result.",
      description:
        "Write once(fn): return a function that calls fn only on the first call; subsequent calls return the first result without calling fn again.",
      starter: `function once(fn) {
  // your code (hint: state lives in a closure)
}`,
      solution: `function once(fn) {
  let called = false, result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}`,
      notes:
        "A classic closures exercise: called and result live across calls. The called flag is needed separately — checking result === undefined would break if fn actually returned undefined.",
    },
  },
  {
    id: "memoize",
    title: "memoize",
    level: "medium",
    brief: "Кэшировать результаты по аргументам.",
    description:
      "Напиши memoize(fn): повторный вызов с теми же аргументами возвращает закэшированный результат, не вызывая fn. Ключ кэша — по всем аргументам.",
    fnName: "memoize",
    starter: `function memoize(fn) {
  // твой код (подсказка: Map + ключ из аргументов)
}`,
    tests: [
      {
        name: "повтор аргументов → 1 вызов",
        run: (fn) => {
          let calls = 0;
          const m = fn((a, b) => { calls++; return a + b; });
          assertEq(m(1, 2), 3);
          assertEq(m(1, 2), 3);
          assertEq(calls, 1, "число вызовов");
        },
      },
      {
        name: "разные аргументы → разные вызовы",
        run: (fn) => {
          let calls = 0;
          const m = fn((a) => { calls++; return a * 2; });
          m(1); m(2); m(1);
          assertEq(calls, 2, "число вызовов");
        },
      },
      {
        name: "различает (1,2) и (12)",
        run: (fn) => {
          let calls = 0;
          const m = fn((...a) => { calls++; return a.length; });
          assertEq(m(1, 2), 2);
          assertEq(m(12), 1);
          assertEq(calls, 2, "число вызовов");
        },
      },
      {
        name: "ключ учитывает ВСЕ аргументы",
        run: (fn) => {
          let calls = 0;
          const m = fn((a, b) => { calls++; return a + b; });
          m(1, 2); m(1, 3);
          assertEq(calls, 2, "разный второй аргумент — разные вызовы (кэш только по первому?)");
        },
      },
      {
        name: "join(',') как ключ даёт коллизию",
        run: (fn) => {
          let calls = 0;
          const m = fn((...a) => { calls++; return a.length; });
          assertEq(m(1, "2,3"), 2);
          assertEq(m(1, 2, 3), 3, "args.join(',') не отличил бы эти вызовы");
          assertEq(calls, 2, "число вызовов");
        },
      },
    ],
    solution: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}`,
    notes:
      "JSON.stringify(args) как ключ — честно назови ограничения: не работает для функций/циклических структур, (1,2) vs ('1,2'-строка) различаются благодаря скобкам массива. Продвинутый вариант — вложенные Map по каждому аргументу.",
    en: {
      title: "memoize",
      brief: "Cache results by arguments.",
      description:
        "Write memoize(fn): a repeated call with the same arguments returns the cached result without calling fn. The cache key is derived from all arguments.",
      starter: `function memoize(fn) {
  // your code (hint: a Map + a key built from the arguments)
}`,
      solution: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}`,
      notes:
        "JSON.stringify(args) as the key — be honest about the limits: it doesn't work for functions/cyclic structures, and (1,2) vs the string '1,2' are distinguished thanks to the array brackets. A more advanced variant is nested Maps per argument.",
    },
  },
  {
    id: "curry",
    title: "curry",
    level: "medium",
    brief: "f(a,b,c) → f(a)(b)(c) и f(a,b)(c).",
    description:
      "Напиши curry(fn): вернуть функцию, которую можно вызывать по частям, пока не наберётся fn.length аргументов — тогда вызывается fn.",
    fnName: "curry",
    starter: `function curry(fn) {
  // твой код (подсказка: fn.length — арность)
}`,
    tests: [
      {
        name: "add(1)(2)(3) → 6",
        run: (fn) => assertEq(fn((a, b, c) => a + b + c)(1)(2)(3), 6),
      },
      {
        name: "смешанно: add(1,2)(3) и add(1)(2,3)",
        run: (fn) => {
          const c = fn((a, b, c) => a + b + c);
          assertEq(c(1, 2)(3), 6, "c(1,2)(3)");
          assertEq(c(1)(2, 3), 6, "c(1)(2,3)");
        },
      },
      {
        name: "все аргументы сразу",
        run: (fn) => assertEq(fn((a, b) => a * b)(3, 4), 12),
      },
      {
        name: "каррированные версии независимы",
        run: (fn) => {
          const c = fn((a, b) => a + b);
          const add5 = c(5);
          assertEq(add5(1), 6);
          assertEq(add5(10), 15, "повторное использование add5");
        },
      },
    ],
    solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...rest) => curried(...args, ...rest);
  };
}`,
    notes:
      "fn.length — число объявленных параметров (rest и дефолты не считаются — назови это ограничение). Каждый частичный вызов копит args в замыкании, поэтому add5 переиспользуем.",
    en: {
      title: "curry",
      brief: "f(a,b,c) → f(a)(b)(c) and f(a,b)(c).",
      description:
        "Write curry(fn): return a function that can be called in parts, accumulating arguments until fn.length arguments are collected — then fn is called.",
      starter: `function curry(fn) {
  // your code (hint: fn.length — the arity)
}`,
      solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...rest) => curried(...args, ...rest);
  };
}`,
      notes:
        "fn.length is the number of declared parameters (rest and defaults don't count — mention this limitation). Each partial call accumulates args in a closure, which is why add5 is reusable.",
    },
  },
  {
    id: "my-call",
    title: "Полифилл myCall",
    level: "medium",
    brief: "Свой Function.prototype.call без call/apply/bind.",
    description:
      "Реализуй Function.prototype.myCall(ctx, ...args) — аналог call, не используя call/apply/bind. Подсказка: вызов через точку даёт нужный this.",
    fnName: "Function.prototype.myCall",
    starter: `Function.prototype.myCall = function (ctx, ...args) {
  // твой код
};`,
    tests: [
      {
        name: "this подставляется",
        run: (my) => {
          function who(greet) { return greet + " " + this.name; }
          assertEq(my.apply(who, [{ name: "A" }, "hi"]), "hi A");
        },
      },
      {
        name: "ctx = null → globalThis (не падает)",
        run: (my) => {
          function f() { return typeof this; }
          const t = my.apply(f, [null]);
          assert(t === "object" || t === "undefined", "не должно упасть: " + t);
        },
      },
      {
        name: "не оставляет следов на ctx",
        run: (my) => {
          const obj = { name: "B" };
          function who() { return this.name; }
          my.apply(who, [obj]);
          assertEq(Object.keys(obj), ["name"], "лишние строковые ключи");
          assertEq(
            Object.getOwnPropertySymbols(obj).length, 0,
            "забытый Symbol-ключ — не хватает delete?"
          );
        },
      },
      {
        name: "возвращает результат",
        run: (my) => {
          function sum(a, b) { return a + b + (this.base || 0); }
          assertEq(my.apply(sum, [{ base: 10 }, 1, 2]), 13);
        },
      },
    ],
    solution: `Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;          // null/undefined → глобальный объект
  const key = Symbol("fn");          // Symbol — не затрёт чужое свойство
  ctx[key] = this;                   // this = сама вызываемая функция
  const result = ctx[key](...args);  // вызов через точку → this = ctx!
  delete ctx[key];
  return result;
};`,
    notes:
      "(Тесты не могут запретить встроенный call внутри твоего кода — задача обучающая, честность на твоей совести.) Вся соль: положить функцию В объект и вызвать через точку — правило «this = что слева от точки» делает работу. Symbol гарантирует отсутствие коллизий, delete убирает след (и Object.keys его не видит даже до delete — символы не перечисляются).",
    en: {
      title: "myCall Polyfill",
      brief: "Your own Function.prototype.call, without call/apply/bind.",
      description:
        "Implement Function.prototype.myCall(ctx, ...args) — an analog of call, without using call/apply/bind. Hint: calling via dot notation gives you the right this.",
      starter: `Function.prototype.myCall = function (ctx, ...args) {
  // your code
};`,
      solution: `Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;          // null/undefined → the global object
  const key = Symbol("fn");          // a Symbol won't clobber an existing property
  ctx[key] = this;                   // this = the function being called
  const result = ctx[key](...args);  // dot-call → this = ctx!
  delete ctx[key];
  return result;
};`,
      notes:
        "(Tests can't stop you from using the built-in call inside your own code — this is a learning exercise, honesty is on you.) The whole trick: put the function ONTO the object and call it via the dot — the rule \"this = whatever is left of the dot\" does the work. The Symbol guarantees no collisions, delete removes the trace (and Object.keys doesn't even see it before the delete — symbols aren't enumerable).",
    },
  },

  // ═══════════ HARD (Async из чек-листа) ═══════════
  {
    id: "sleep-retry",
    title: "Async: retry",
    level: "hard",
    brief: "Повторить упавшую async-операцию N раз.",
    description:
      "Напиши async-функцию retry(fn, attempts): вызывает async fn; если она реджектится — пробует снова, всего не больше attempts попыток. Успех — вернуть результат, все попытки провалены — пробросить последнюю ошибку.",
    fnName: "retry",
    starter: `async function retry(fn, attempts) {
  // твой код
}`,
    tests: [
      {
        name: "успех с 3-й попытки",
        run: async (fn) => {
          let n = 0;
          const flaky = async () => {
            n++;
            if (n < 3) throw new Error("fail " + n);
            return "ok";
          };
          assertEq(await fn(flaky, 5), "ok");
          assertEq(n, 3, "число попыток");
        },
      },
      {
        name: "лимит попыток соблюдается",
        run: async (fn) => {
          let n = 0;
          const dead = async () => { n++; throw new Error("always"); };
          let threw = false;
          try { await fn(dead, 2); } catch (e) { threw = true; assertEq(e.message, "always", "текст ошибки"); }
          assert(threw, "должна пробросить ошибку");
          assertEq(n, 2, "число попыток");
        },
      },
      {
        name: "успех с первой — один вызов",
        run: async (fn) => {
          let n = 0;
          assertEq(await fn(async () => { n++; return 42; }, 3), 42);
          assertEq(n, 1, "число вызовов");
        },
      },
    ],
    solution: `async function retry(fn, attempts) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();       // успех — выходим сразу
    } catch (e) {
      lastError = e;           // запомнили, пробуем дальше
    }
  }
  throw lastError;
}

// бонус для собеса: пауза между попытками (exponential backoff)
// if (i < attempts - 1) await new Promise(r => setTimeout(r, 2 ** i * 100));`,
    notes:
      "return await в try обязателен: без await реджект вылетит ПОСЛЕ выхода из try и не поймается. Упомяни backoff и AbortSignal — это переводит ответ в senior-лигу.",
    en: {
      title: "Async: retry",
      brief: "Retry a failed async operation N times.",
      description:
        "Write an async function retry(fn, attempts): calls async fn; if it rejects, try again, up to attempts tries total. On success, return the result; if all attempts fail, rethrow the last error.",
      starter: `async function retry(fn, attempts) {
  // your code
}`,
      solution: `async function retry(fn, attempts) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();       // success — return right away
    } catch (e) {
      lastError = e;           // remember it, try again
    }
  }
  throw lastError;
}

// bonus for the interview: pause between attempts (exponential backoff)
// if (i < attempts - 1) await new Promise(r => setTimeout(r, 2 ** i * 100));`,
      notes:
        "return await inside try is mandatory: without await, the rejection would surface AFTER leaving the try block and wouldn't be caught. Mention backoff and AbortSignal — that bumps the answer into senior territory.",
    },
  },
  {
    id: "promise-all",
    title: "Async: полифилл Promise.all",
    level: "hard",
    brief: "Свой promiseAll: порядок результатов, fail-fast.",
    description:
      "Напиши promiseAll(values): возвращает промис; резолвится массивом результатов В ПОРЯДКЕ входа (не в порядке завершения!), реджектится первой же ошибкой. Обычные значения (не промисы) — тоже допустимы. Без использования Promise.all.",
    fnName: "promiseAll",
    starter: `function promiseAll(values) {
  return new Promise((resolve, reject) => {
    // твой код
  });
}`,
    tests: [
      {
        name: "порядок входа, не завершения",
        run: async (fn) => {
          const slow = new Promise((r) => setTimeout(() => r("slow"), 40));
          const fast = new Promise((r) => setTimeout(() => r("fast"), 5));
          assertEq(await fn([slow, fast]), ["slow", "fast"]);
        },
      },
      {
        name: "обычные значения допустимы",
        run: async (fn) => assertEq(await fn([1, Promise.resolve(2), 3]), [1, 2, 3]),
      },
      {
        name: "реджект первой ошибкой",
        run: async (fn) => {
          let msg = null;
          try {
            await fn([sleep(40).then(() => "late"), Promise.reject(new Error("boom"))]);
          } catch (e) { msg = e.message; }
          assertEq(msg, "boom");
        },
      },
      {
        name: "пустой массив → []",
        run: async (fn) => assertEq(await fn([]), []),
      },
    ],
    solution: `function promiseAll(values) {
  return new Promise((resolve, reject) => {
    const results = new Array(values.length);
    let done = 0;
    if (values.length === 0) return resolve([]);

    values.forEach((v, i) => {
      Promise.resolve(v)              // оборачиваем и не-промисы
        .then((res) => {
          results[i] = res;           // пишем ПО ИНДЕКСУ — порядок входа
          if (++done === values.length) resolve(results);
        })
        .catch(reject);               // первый реджект решает всё
    });
  });
}`,
    notes:
      "Три ловушки, которые проверяют: results[i] по индексу (не push — иначе порядок завершения), счётчик done (results.length врал бы из-за «дырок»), пустой массив (forEach не выполнится — резолвить сразу).",
    en: {
      title: "Async: Promise.all polyfill",
      brief: "Your own promiseAll: results in input order, fail-fast.",
      description:
        "Write promiseAll(values): returns a promise that resolves with an array of results IN INPUT ORDER (not completion order!), and rejects with the first error. Plain values (not promises) are allowed too. Without using Promise.all.",
      starter: `function promiseAll(values) {
  return new Promise((resolve, reject) => {
    // your code
  });
}`,
      solution: `function promiseAll(values) {
  return new Promise((resolve, reject) => {
    const results = new Array(values.length);
    let done = 0;
    if (values.length === 0) return resolve([]);

    values.forEach((v, i) => {
      Promise.resolve(v)              // wrap non-promises too
        .then((res) => {
          results[i] = res;           // write BY INDEX — input order
          if (++done === values.length) resolve(results);
        })
        .catch(reject);               // the first rejection decides everything
    });
  });
}`,
      notes:
        "Three traps this checks for: results[i] by index (not push — otherwise you'd get completion order), the done counter (results.length would lie because of \"holes\"), and the empty array (forEach never runs — resolve right away).",
    },
  },
  {
    id: "debounce",
    title: "Async: debounce",
    level: "hard",
    brief: "Отложить вызов, пока «дёргают».",
    description:
      "Напиши debounce(fn, ms): вернуть функцию, которая вызывает fn только когда с последнего вызова прошло ms миллисекунд. Каждый новый вызов сбрасывает таймер. Аргументы — от последнего вызова.",
    fnName: "debounce",
    starter: `function debounce(fn, ms) {
  // твой код
}`,
    tests: [
      {
        name: "серия вызовов → один, с последними аргументами",
        run: async (fn) => {
          let calls = 0, last = null;
          const d = fn((x) => { calls++; last = x; }, 30);
          d(1); d(2); d(3);
          await sleep(60);
          assertEq(calls, 1, "число вызовов");
          assertEq(last, 3, "аргумент");
        },
      },
      {
        name: "до истечения ms вызова нет",
        run: async (fn) => {
          let calls = 0;
          const d = fn(() => calls++, 50);
          d();
          await sleep(20);
          assertEq(calls, 0, "рано");
          await sleep(50);
          assertEq(calls, 1, "после паузы");
        },
      },
      {
        name: "новая серия — новый вызов",
        run: async (fn) => {
          let calls = 0;
          const d = fn(() => calls++, 25);
          d(); await sleep(45);
          d(); await sleep(45);
          assertEq(calls, 2);
        },
      },
    ],
    solution: `function debounce(fn, ms) {
  let timer;                          // состояние в замыкании
  return (...args) => {
    clearTimeout(timer);              // каждый вызов сбрасывает прошлый таймер
    timer = setTimeout(() => fn(...args), ms);
  };
}`,
    notes:
      "Два предложения кода, но проверяет замыкания + таймеры. Дополнительные вопросы: чем отличается throttle (гарантированная частота, а не «после тишины»), как сохранить this (обычная функция + fn.apply(this, args)), как сделать cancel().",
    en: {
      title: "Async: debounce",
      brief: "Delay a call while it's being \"triggered\" repeatedly.",
      description:
        "Write debounce(fn, ms): return a function that calls fn only once ms milliseconds have passed since the last call. Every new call resets the timer. The arguments used are from the last call.",
      starter: `function debounce(fn, ms) {
  // your code
}`,
      solution: `function debounce(fn, ms) {
  let timer;                          // state lives in the closure
  return (...args) => {
    clearTimeout(timer);              // every call resets the previous timer
    timer = setTimeout(() => fn(...args), ms);
  };
}`,
      notes:
        "Two lines of code, but it tests closures + timers. Follow-up questions: how throttle differs (guaranteed rate rather than \"after quiet\"), how to preserve this (a regular function + fn.apply(this, args)), how to implement cancel().",
    },
  },
  {
    id: "debounce-cancel-flush",
    title: "Async: debounce с leading / cancel / flush",
    level: "hard",
    brief: "debounce «как в lodash»: опции leading/trailing, методы cancel() и flush(), сохранение this.",
    description:
      "Напиши debounce(fn, ms, options) — продвинутую версию задачи «debounce». Требования: 1) по умолчанию trailing — fn вызывается один раз через ms после последнего вызова, с последними аргументами; 2) options.leading = true — первый вызов серии срабатывает сразу, а trailing-вызов в конце происходит только если после него были ещё вызовы; 3) options.trailing = false отключает вызов в конце серии; 4) у возвращённой функции есть cancel() — отменяет ожидающий вызов, и flush() — выполняет его немедленно (если ожидающего нет — ничего не делает); 5) this внутри fn — тот, с которым вызвали debounced-функцию.",
    fnName: "debounce",
    starter: `function debounce(fn, ms, options = {}) {
  // твой код
}`,
    tests: [
      {
        name: "базовый trailing: d(1); d(2); d(3) → один вызов с 3",
        run: async (fn) => {
          let calls = 0, last = null;
          const d = fn((x) => { calls++; last = x; }, 30);
          d(1); d(2); d(3);
          assertEq(calls, 0, "до истечения ms вызова нет");
          await sleep(60);
          assertEq(calls, 1, "число вызовов");
          assertEq(last, 3, "аргумент");
        },
      },
      {
        name: "cancel(): ожидающий вызов не происходит",
        run: async (fn) => {
          let calls = 0;
          const d = fn(() => calls++, 30);
          d(); d();
          d.cancel();
          await sleep(60);
          assertEq(calls, 0, "после cancel");
          d();                                 // после cancel функция снова работает
          await sleep(60);
          assertEq(calls, 1, "новая серия после cancel");
        },
      },
      {
        name: "flush(): вызов сразу, с последними аргументами, и без повтора по таймеру",
        run: async (fn) => {
          let calls = 0, last = null;
          const d = fn((x) => { calls++; last = x; }, 30);
          d(1); d(2);
          d.flush();
          assertEq(calls, 1, "сразу после flush");
          assertEq(last, 2, "аргумент");
          await sleep(60);
          assertEq(calls, 1, "таймер не должен вызвать второй раз");
          d.flush();
          assertEq(calls, 1, "flush без ожидающего вызова — ничего не делает");
        },
      },
      {
        name: "{ leading: true }: d(1); d(2); d(3) → сразу с 1, затем trailing с 3",
        run: async (fn) => {
          const got = [];
          const d = fn((x) => got.push(x), 30, { leading: true });
          d(1); d(2); d(3);
          assertEq(got, [1], "первый вызов серии — сразу");
          await sleep(60);
          assertEq(got, [1, 3], "в конце серии — с последними аргументами");
        },
      },
      {
        name: "{ leading: true }: одиночный вызов не дублируется trailing-вызовом",
        run: async (fn) => {
          let calls = 0;
          const d = fn(() => calls++, 30, { leading: true });
          d();
          assertEq(calls, 1, "сразу");
          await sleep(60);
          assertEq(calls, 1, "trailing не нужен — вызовов после leading не было");
        },
      },
      {
        name: "{ leading: true, trailing: false }: только первый вызов серии",
        run: async (fn) => {
          const got = [];
          const d = fn((x) => got.push(x), 30, { leading: true, trailing: false });
          d(1); d(2);
          await sleep(60);
          assertEq(got, [1], "trailing отключён");
          d(3);                                // новая серия — снова leading
          await sleep(60);
          assertEq(got, [1, 3], "новая серия");
        },
      },
      {
        name: "this сохраняется: obj.method() → this === obj",
        run: async (fn) => {
          let seen = null;
          const obj = { value: 42, method: fn(function () { seen = this.value; }, 20) };
          obj.method();
          await sleep(40);
          assertEq(seen, 42, "this.value");
        },
      },
    ],
    solution: `function debounce(fn, ms, { leading = false, trailing = true } = {}) {
  let timer = null;
  let pending = null;                   // { ctx, args } последнего «не отработанного» вызова

  const invoke = () => {
    const { ctx, args } = pending;
    pending = null;                     // сбрасываем ДО вызова — fn может дёрнуть debounced снова
    fn.apply(ctx, args);
  };

  function debounced(...args) {         // обычная function — нужен свой this
    const isFirst = timer === null;     // нет таймера = начало новой серии
    clearTimeout(timer);
    if (leading && isFirst) {
      fn.apply(this, args);             // leading: первый вызов серии — сразу
    } else {
      pending = { ctx: this, args };    // остальные копим для trailing-вызова
    }
    timer = setTimeout(() => {
      timer = null;
      if (trailing && pending) invoke();
      else pending = null;              // trailing выключен — просто забываем
    }, ms);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
    pending = null;
  };
  debounced.flush = () => {
    if (!pending) return;               // нечего выполнять
    clearTimeout(timer);
    timer = null;
    invoke();
  };
  return debounced;
}`,
    notes:
      "Проверяют не setTimeout, а умение держать состояние в замыкании: таймер (есть ли активная серия), pending (что вызвать в конце) и их согласованность в cancel/flush. Ключевые моменты, которые стоит проговорить: debounced — обычная function, а не стрелка, чтобы пробросить this через fn.apply; leading без pending не должен давать второй вызов; pending сбрасывается до fn.apply, иначе рекурсивный вызов debounced внутри fn затрёт состояние. Бонус: cancel() в cleanup useEffect, чтобы не дёрнуть setState на размонтированном компоненте; чем это отличается от throttle (гарантированная частота, а не «после тишины»).",
    en: {
      title: "Async: debounce with leading / cancel / flush",
      brief: "lodash-style debounce: leading/trailing options, cancel() and flush() methods, this preserved.",
      description:
        "Write debounce(fn, ms, options) — the advanced version of the \"debounce\" task. Requirements: 1) trailing by default — fn is called once, ms after the last call, with the last call's arguments; 2) options.leading = true — the first call of a burst fires immediately, and the trailing call at the end happens only if there were more calls after it; 3) options.trailing = false disables the call at the end of the burst; 4) the returned function has cancel() — drops the pending call, and flush() — runs it immediately (does nothing if there is no pending call); 5) this inside fn is whatever the debounced function was called with.",
      starter: `function debounce(fn, ms, options = {}) {
  // your code
}`,
      solution: `function debounce(fn, ms, { leading = false, trailing = true } = {}) {
  let timer = null;
  let pending = null;                   // { ctx, args } of the last call not yet executed

  const invoke = () => {
    const { ctx, args } = pending;
    pending = null;                     // reset BEFORE calling — fn may call debounced again
    fn.apply(ctx, args);
  };

  function debounced(...args) {         // a regular function — it needs its own this
    const isFirst = timer === null;     // no timer = a new burst starts
    clearTimeout(timer);
    if (leading && isFirst) {
      fn.apply(this, args);             // leading: the first call of a burst fires right away
    } else {
      pending = { ctx: this, args };    // the rest is kept for the trailing call
    }
    timer = setTimeout(() => {
      timer = null;
      if (trailing && pending) invoke();
      else pending = null;              // trailing is off — just forget it
    }, ms);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
    pending = null;
  };
  debounced.flush = () => {
    if (!pending) return;               // nothing to run
    clearTimeout(timer);
    timer = null;
    invoke();
  };
  return debounced;
}`,
      notes:
        "What's tested is not setTimeout but keeping state in a closure: the timer (is a burst active?), pending (what to call at the end) and keeping them consistent in cancel/flush. Points worth saying out loud: debounced is a regular function, not an arrow, so this can be forwarded via fn.apply; leading without a pending call must not produce a second call; pending is reset before fn.apply, otherwise a recursive debounced call inside fn would clobber the state. Bonus: cancel() in a useEffect cleanup so setState isn't fired on an unmounted component; how this differs from throttle (a guaranteed rate rather than \"after quiet\").",
    },
  },
  {
    id: "event-emitter",
    title: "EventEmitter",
    level: "hard",
    brief: "Класс: on / off / emit (паттерн observer).",
    description:
      "Реализуй класс EventEmitter: on(event, handler) — подписка, off(event, handler) — отписка конкретного обработчика, emit(event, ...args) — вызвать всех подписчиков события с аргументами.",
    fnName: "EventEmitter",
    starter: `class EventEmitter {
  // on(event, handler)
  // off(event, handler)
  // emit(event, ...args)
}`,
    tests: [
      {
        name: "on + emit с аргументами",
        run: (EE) => {
          const e = new EE();
          let got = null;
          e.on("msg", (a, b) => (got = a + b));
          e.emit("msg", "hi ", "there");
          assertEq(got, "hi there");
        },
      },
      {
        name: "несколько подписчиков",
        run: (EE) => {
          const e = new EE();
          let n = 0;
          e.on("x", () => n++);
          e.on("x", () => n++);
          e.emit("x");
          assertEq(n, 2);
        },
      },
      {
        name: "off убирает только указанный handler",
        run: (EE) => {
          const e = new EE();
          let a = 0, b = 0;
          const ha = () => a++;
          e.on("x", ha);
          e.on("x", () => b++);
          e.off("x", ha);
          e.emit("x");
          assertEq([a, b], [0, 1]);
        },
      },
      {
        name: "emit несуществующего события не падает",
        run: (EE) => {
          const e = new EE();
          e.emit("nope", 1, 2);
        },
      },
    ],
    solution: `class EventEmitter {
  #listeners = new Map();            // event → Set(handlers)

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(handler);
    return this;
  }
  off(event, handler) {
    this.#listeners.get(event)?.delete(handler);
    return this;
  }
  emit(event, ...args) {
    this.#listeners.get(event)?.forEach((h) => h(...args));
    return this;
  }
}`,
    notes:
      "Map + Set: Set автоматически защищает от двойной подписки одного handler-а, ?.— от emit без подписчиков. Это паттерн observer из темы Design patterns. Бонус-вопросы: once(event, h), утечки памяти от забытых off (см. WeakMap).",
    en: {
      title: "EventEmitter",
      brief: "A class: on / off / emit (the observer pattern).",
      description:
        "Implement an EventEmitter class: on(event, handler) subscribes, off(event, handler) unsubscribes a specific handler, emit(event, ...args) calls all subscribers of an event with the given arguments.",
      starter: `class EventEmitter {
  // on(event, handler)
  // off(event, handler)
  // emit(event, ...args)
}`,
      solution: `class EventEmitter {
  #listeners = new Map();            // event → Set(handlers)

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(handler);
    return this;
  }
  off(event, handler) {
    this.#listeners.get(event)?.delete(handler);
    return this;
  }
  emit(event, ...args) {
    this.#listeners.get(event)?.forEach((h) => h(...args));
    return this;
  }
}`,
      notes:
        "Map + Set: the Set automatically guards against double-subscribing the same handler, and ?. guards against emitting with no subscribers. This is the observer pattern from the Design patterns topic. Bonus questions: once(event, h), memory leaks from forgotten off calls (see WeakMap).",
    },
  },
];
