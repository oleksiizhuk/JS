import { useMemo, useState } from "react";
import { EXERCISES, SEVERITY, LEVELS, type Level } from "./exercises";
import { highlight } from "../highlight";
import { useLang } from "../LangContext";

const UI = {
  ru: {
    pickPr: "Выбери PR на ревью",
    howTo: "Как на собесе: 1) пойми, что делает код; 2) кликай по строкам с проблемами (кратные строки одной проблемы — достаточно одной); 3) мысленно проговори по каждой: что → чем грозит → как чинить → blocker или nit; 4) жми «Проверить».",
    markHint: "клик — пометить строку",
    check: "Проверить", markedN: "строк помечено", clear: "Снять пометки",
    retry: "Пройти заново", result: "Результат: найдено", of: "из",
    falseAlarms: "ложных тревог:",
    legend: "Легенда в коде: зелёное — нашёл, красное — пропустил, жёлтое — ложная тревога (строка без заложенной проблемы).",
    fpWarn: " Ложные срабатывания на собесе минусуют: не выдумывай проблемы.",
    lines: "строки", risk: "Чем грозит:", fix: "Как чинить:",
    level: "Уровень:", allLevels: "Все",
  },
  en: {
    pickPr: "Pick a PR to review",
    howTo: "Like a real interview: 1) understand what the code does; 2) click the problematic lines (one line per issue is enough); 3) for each, say out loud: what → why it hurts → how to fix → blocker or nit; 4) hit Check.",
    markHint: "click to flag the line",
    check: "Check", markedN: "lines flagged", clear: "Clear flags",
    retry: "Try again", result: "Result: found", of: "of",
    falseAlarms: "false alarms:",
    legend: "Code legend: green — found, red — missed, yellow — false alarm (a line with no planted issue).",
    fpWarn: " False positives cost you points in an interview: do not invent problems.",
    lines: "lines", risk: "Why it hurts:", fix: "How to fix:",
    level: "Level:", allLevels: "All",
  },
};

// Тренажёр код-ревью: кликай по подозрительным строкам → «Проверить» →
// сверка с заложенными проблемами: нашёл / пропустил / ложная тревога.

export default function CodeReviewTrainer() {
  const lang = useLang();
  const T = UI[lang];
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const visible = EXERCISES.filter(
    (e) => levelFilter === "all" || e.level === levelFilter
  );
  const [exId, setExId] = useState(EXERCISES[0].id);
  // фильтр скрыл текущую задачу — показываем первую видимую
  const exRaw = visible.find((e) => e.id === exId) ?? visible[0];
  // локализация: en-поля упражнения и его issues (без en — ru)
  const ex =
    lang === "en" && exRaw.en
      ? {
          ...exRaw,
          ...exRaw.en,
          issues: exRaw.issues.map((i) => (i.en ? { ...i, ...i.en } : i)),
        }
      : exRaw;

  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);

  const lines = useMemo(() => ex.code.split("\n"), [ex]);
  const issueLines = useMemo(
    () => new Set(ex.issues.flatMap((i) => i.lines)),
    [ex]
  );

  const pick = (id: string) => {
    setExId(id);
    setMarked(new Set());
    setChecked(false);
  };

  const toggle = (n: number) => {
    if (checked) return;
    const next = new Set(marked);
    next.has(n) ? next.delete(n) : next.add(n);
    setMarked(next);
  };

  // Итоги: проблема найдена, если помечена ХОТЯ БЫ одна из её строк
  const found = ex.issues.filter((i) => i.lines.some((l) => marked.has(l)));
  const missed = ex.issues.filter((i) => !i.lines.some((l) => marked.has(l)));
  const falsePositives = [...marked].filter((l) => !issueLines.has(l));

  const lineClass = (n: number) => {
    if (!checked) return marked.has(n) ? "cr-marked" : "";
    const isIssue = issueLines.has(n);
    const isMarked = marked.has(n);
    if (isIssue && isMarked) return "cr-hit";
    if (isIssue) return "cr-missed";
    if (isMarked) return "cr-false";
    return "";
  };

  const sortedIssues = [...ex.issues].sort(
    (a, b) => SEVERITY[a.severity].order - SEVERITY[b.severity].order
  );

  return (
    <>
      <div className="card">
        <h3>{T.pickPr}</h3>
        <p style={{ margin: "4px 0 8px" }}>
          <span className="hint">{T.level} </span>
          {(["all", ...(Object.keys(LEVELS) as Level[])] as const).map((lv) => (
            <button
              key={lv}
              className="btn"
              style={
                lv === levelFilter
                  ? { background: "#4f6ef7", color: "#fff", borderColor: "#4f6ef7" }
                  : {}
              }
              onClick={() => {
                // фильтр может сменить активную задачу — сбрасываем прогресс
                setLevelFilter(lv);
                setMarked(new Set());
                setChecked(false);
              }}
            >
              {lv === "all" ? T.allLevels : `${LEVELS[lv].emoji} ${LEVELS[lv].label}`}
            </button>
          ))}
        </p>
        {visible.map((e) => (
          <button
            key={e.id}
            className="btn"
            style={e.id === exRaw.id ? { background: "#4f6ef7", color: "#fff", borderColor: "#4f6ef7" } : {}}
            onClick={() => pick(e.id)}
          >
            {LEVELS[e.level].emoji}{" "}
            {lang === "en" && e.en?.title ? e.en.title : e.title}
          </button>
        ))}
        <p className="hint" style={{ marginTop: 8 }}>
          {T.howTo}
        </p>
      </div>

      <div className="card">
        <h3>{ex.title}</h3>
        <p className="hint">{ex.context}</p>
        <pre className="code" data-hl="1" style={{ padding: "8px 0" }}>
          {lines.map((line, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                className={"cr-line " + lineClass(n)}
                onClick={() => toggle(n)}
                title={checked ? undefined : T.markHint}
              >
                <span className="cr-num">{n}</span>
                <span dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }} />
              </div>
            );
          })}
        </pre>

        {!checked ? (
          <>
            <button
              className="btn primary"
              disabled={marked.size === 0}
              onClick={() => setChecked(true)}
            >
              {T.check} ({marked.size} {T.markedN})
            </button>
            <button className="btn" onClick={() => setMarked(new Set())}>
              {T.clear}
            </button>
          </>
        ) : (
          <button className="btn primary" onClick={() => { setMarked(new Set()); setChecked(false); }}>
            {T.retry}
          </button>
        )}
      </div>

      {checked && (
        <>
          <div className="card">
            <h3>
              {T.result} {found.length} {T.of} {ex.issues.length}
              {falsePositives.length > 0 && ` · ${T.falseAlarms} ${falsePositives.length}`}{" "}
              {found.length === ex.issues.length && falsePositives.length === 0
                ? "🏆"
                : found.length === ex.issues.length
                ? "👍"
                : "📚"}
            </h3>
            <p className="hint">
              {T.legend}
              {falsePositives.length > 0 && T.fpWarn}
            </p>
          </div>

          {sortedIssues.map((issue, k) => {
            const wasFound = found.includes(issue);
            const sev = SEVERITY[issue.severity];
            return (
              <div className="card" key={k}>
                <h3>
                  {wasFound ? "✅" : "❌"} {sev.emoji} {sev.label}: {issue.title}
                  <span className="hint"> ({T.lines} {issue.lines.join(", ")})</span>
                </h3>
                <p>
                  <b>{T.risk}</b> {issue.explain}
                </p>
                <p>
                  <b>{T.fix}</b> {issue.fix}
                </p>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
