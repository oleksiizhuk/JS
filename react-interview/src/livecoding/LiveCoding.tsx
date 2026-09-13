import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { TASKS, type UserFn } from "./tasks";
import { highlight } from "../highlight";
import { useLang } from "../LangContext";

const UI = {
  ru: {
    pick: "Выбери задачу", solved: "решено", run: "▶ Запустить тесты",
    running: "⏳ Выполняю...", reset: "Сбросить код",
    resetConfirm: "Стереть твоё решение и вернуть стартовый код?",
    showSol: "Показать решение", hideSol: "Скрыть решение",
    warn: "⚠️ Код выполняется прямо в браузере: синхронный бесконечный цикл повесит вкладку (обнови страницу — код сохранён), а зависший промис тест отловит сам по таймауту 4с.",
    compile: "Компиляция", solvedBanner: "— решено! 🎉", seeErrors: "— смотри ошибки выше",
    solTitle: "Эталонное решение", say: "Что рассказать, пока пишешь:",
    levels: { easy: "🟢 лёгкие", medium: "🟡 средние", hard: "🔴 сложные (Async)" },
  },
  en: {
    pick: "Pick a task", solved: "solved", run: "▶ Run tests",
    running: "⏳ Running...", reset: "Reset code",
    resetConfirm: "Erase your solution and restore the starter code?",
    showSol: "Show solution", hideSol: "Hide solution",
    warn: "⚠️ Code runs right in the browser: a synchronous infinite loop will freeze the tab (refresh — your code is saved), and a hanging promise is caught by the 4s test timeout.",
    compile: "Compilation", solvedBanner: "— solved! 🎉", seeErrors: "— see errors above",
    solTitle: "Reference solution", say: "What to say out loud while coding:",
    levels: { easy: "🟢 easy", medium: "🟡 medium", hard: "🔴 hard (Async)" },
  },
};

const codeKey = (id: string) => "lc-code-" + id;
const doneKey = "lc-done";

const loadDone = () => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(doneKey) || "[]"));
  } catch {
    return new Set<string>();
  }
};

// Достаём функцию пользователя из его кода.
// Компромисс: без "use strict" — код выполняется в sloppy mode, как и
// задумано для обучающих сценариев с this (myCall). Плата: опечатка в имени
// переменной создаст глобальную вместо ReferenceError. Код НЕ изолирован
// (не Worker): задача myCall осознанно патчит настоящий Function.prototype.
function compile(code: string, fnName: string): UserFn {
  const factory = new Function(`${code}\nreturn ${fnName};`);
  const fn: unknown = factory();
  if (typeof fn !== "function")
    throw new Error(`не найдена функция ${fnName} — проверь имя`);
  return fn as UserFn;
}

// Тест с таймаутом: зависший промис (забыл resolve) не блокирует движок навечно
const TEST_TIMEOUT = 4000;
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `тест не завершился за ${TEST_TIMEOUT / 1000}с — промис никогда не резолвится? (забыт resolve/return?)`
            )
          ),
        TEST_TIMEOUT
      )
    ),
  ]);
}

// результат одного теста (error — только при провале)
type TestResult = { name: string; ok: boolean; error?: string };

export default function LiveCoding() {
  const lang = useLang();
  const T = UI[lang];
  const [taskId, setTaskId] = useState(TASKS[0].id);
  const task = TASKS.find((t) => t.id === taskId) ?? TASKS[0];
  // отображаемые поля — в выбранном языке (task.en опционален)
  const tv = lang === "en" && task.en ? { ...task, ...task.en } : task;

  const [code, setCode] = useState("");
  const [results, setResults] = useState<TestResult[] | null>(null); // [{name, ok, error}]
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [done, setDone] = useState(loadDone);
  const solutionRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0); // токен актуальности прогона (гонки при смене задачи)

  // код задачи: сохранённый или стартовый; прогресс живёт в localStorage
  useEffect(() => {
    runIdRef.current++; // отменяем «протухший» прогон прошлой задачи
    setCode(localStorage.getItem(codeKey(task.id)) ?? task.starter);
    setResults(null);
    setRunning(false);
    setShowSolution(false);
  }, [task]);

  const onCodeChange = (v: string) => {
    setCode(v);
    localStorage.setItem(codeKey(task.id), v);
  };

  // Tab: отступ (не уводит фокус). С выделением — индент выделенных строк
  // (НЕ затирает текст!), Shift+Tab — обратный отступ.
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.target as HTMLTextAreaElement;
    const { selectionStart: s, selectionEnd: en } = el;

    if (s === en && !e.shiftKey) {
      // курсор без выделения — просто два пробела
      const next = code.slice(0, s) + "  " + code.slice(en);
      onCodeChange(next);
      requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
      return;
    }

    // выделение (или Shift+Tab): индент/дедент каждой затронутой строки
    const lineStart = code.lastIndexOf("\n", s - 1) + 1;
    const block = code.slice(lineStart, en);
    const changed = block
      .split("\n")
      .map((line) => (e.shiftKey ? line.replace(/^ {1,2}/, "") : "  " + line))
      .join("\n");
    const next = code.slice(0, lineStart) + changed + code.slice(en);
    onCodeChange(next);
    const delta = changed.length - block.length;
    requestAnimationFrame(() =>
      el.setSelectionRange(lineStart, en + delta)
    );
  };

  const runTests = async () => {
    const runId = ++runIdRef.current; // этот прогон актуален, пока id совпадает
    const alive = () => runIdRef.current === runId;

    setRunning(true);
    setResults(null);
    const out: TestResult[] = [];
    let fn: UserFn;
    try {
      fn = compile(code, task.fnName);
    } catch (e) {
      if (alive()) {
        setResults([{ name: T.compile, ok: false, error: (e as Error).message }]);
        setRunning(false);
      }
      return;
    }
    for (const t of task.tests) {
      try {
        await withTimeout(Promise.resolve(t.run(fn)));
        out.push({ name: t.name, ok: true });
      } catch (e) {
        out.push({ name: t.name, ok: false, error: (e as Error).message });
      }
      if (!alive()) return; // задачу переключили — не пишем результаты в чужой UI
      setResults([...out]); // показываем по мере выполнения (async-тесты)
    }
    if (out.every((r) => r.ok)) {
      const next = new Set(done).add(task.id);
      setDone(next);
      localStorage.setItem(doneKey, JSON.stringify([...next]));
    }
    if (alive()) setRunning(false);
  };

  const passed = results?.filter((r) => r.ok).length ?? 0;
  const allPassed = results && passed === task.tests.length;

  return (
    <>
      <div className="card">
        <h3>{T.pick} ({done.size}/{TASKS.length} {T.solved})</h3>
        {Object.entries(T.levels).map(([level, label]) => (
          <div key={level} style={{ marginBottom: 6 }}>
            <span className="hint" style={{ marginRight: 8 }}>{label}:</span>
            {TASKS.filter((t) => t.level === level).map((t) => (
              <button
                key={t.id}
                className="btn"
                style={
                  t.id === taskId
                    ? { background: "#4f6ef7", color: "#fff", borderColor: "#4f6ef7" }
                    : {}
                }
                onClick={() => setTaskId(t.id)}
              >
                {done.has(t.id) ? "✅ " : ""}{lang === "en" && t.en?.title ? t.en.title : t.title}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="card">
        <h3>{tv.title}</h3>
        <p>{tv.description}</p>
        <textarea
          className="editor"
          spellCheck={false}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={Math.max(10, code.split("\n").length + 2)}
        />
        <div>
          <button className="btn primary" disabled={running} onClick={runTests}>
            {running ? T.running : T.run}
          </button>
          <button
            className="btn"
            onClick={() => {
              if (!window.confirm(T.resetConfirm)) return;
              runIdRef.current++; // отменяем возможный текущий прогон
              onCodeChange(task.starter);
              setResults(null);
              setRunning(false);
            }}
          >
            {T.reset}
          </button>
          <button
            className="btn"
            onClick={() => {
              setShowSolution(!showSolution);
              requestAnimationFrame(() =>
                solutionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
              );
            }}
          >
            {showSolution ? T.hideSol : T.showSol}
          </button>
        </div>
        <p className="hint">
          {T.warn}
        </p>

        {results && (
          <div style={{ marginTop: 10 }}>
            {results.map((r, i) => (
              <div
                key={i}
                className={r.ok ? "explain" : "redflag"}
                style={{ marginTop: 6, padding: "6px 12px" }}
              >
                {r.ok ? "✅" : "❌"} {r.name}
                {r.error && <span className="hint"> — {r.error}</span>}
              </div>
            ))}
            <p style={{ fontWeight: 600 }}>
              {passed}/{task.tests.length}{" "}
              {allPassed ? T.solvedBanner : running ? "" : T.seeErrors}
            </p>
          </div>
        )}
      </div>

      {showSolution && (
        <div className="card" ref={solutionRef}>
          <h3>{T.solTitle}</h3>
          <pre
            className="code"
            data-hl="1"
            dangerouslySetInnerHTML={{ __html: highlight(tv.solution) }}
          />
          <div className="explain">
            <b>{T.say}</b> {tv.notes}
          </div>
        </div>
      )}
    </>
  );
}
