import { useState, type ReactNode } from "react";
import { useLang } from "../../LangContext";
import { highlight } from "../../highlight";

function fmt(v: unknown) {
  if (v === undefined) return "undefined"; // иначе join() превратит в пустоту
  if (v === null) return "null";
  if (typeof v === "string") return v;
  if (typeof v === "function") return "ƒ " + ((v as { name?: string }).name || "anonymous");
  if (v instanceof Error) return `${v.constructor.name}: ${v.message}`;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

// Универсальное демо: показывает код, по кнопке выполняет run(log)
// и печатает вывод. Асинхронные логи (setTimeout/promise) дособираются
// повторными обновлениями панели.
// Языки: en = { title, code, hint } — опционально, без него показывается ru.
export type Logger = (...args: unknown[]) => void;
export type DemoProps = {
  title: string;
  code: string;
  run: (log: Logger) => void;
  hint?: ReactNode;
  en?: { title?: string; code?: string; hint?: ReactNode };
};

export function Demo({ title, code, run, hint, en }: DemoProps) {
  const lang = useLang();
  const [lines, setLines] = useState<string[] | null>(null);
  const v =
    lang === "en" && en ? { title, code, hint, ...en } : { title, code, hint };

  const exec = () => {
    const out: string[] = [];
    const log: Logger = (...args) => out.push(args.map(fmt).join(" "));
    try {
      run(log);
    } catch (e) {
      const err = e as Error;
      out.push(`💥 ${err.constructor.name}: ${err.message}`);
    }
    setLines([...out]);
    // подобрать то, что прилетит асинхронно (микро/макротаски)
    [30, 150, 400].forEach((ms) => setTimeout(() => setLines([...out]), ms));
  };

  return (
    <div className="card">
      <h3>{v.title}</h3>
      <pre
        className="code"
        data-hl="1"
        dangerouslySetInnerHTML={{ __html: highlight(v.code) }}
      />
      <button className="btn primary" onClick={exec}>
        {lang === "en" ? "▶ Run" : "▶ Выполнить"}
      </button>
      {lines !== null && (
        <div className="log">
          {lines.length
            ? lines.join("\n")
            : lang === "en"
            ? "— no output —"
            : "— нет вывода —"}
        </div>
      )}
      {lines !== null && v.hint && <p className="hint">{v.hint}</p>}
    </div>
  );
}

// Квиз-строка: выражение → «показать ответ»
// en = { note } (выражение и результат — код, общий для языков)
export type RevealProps = {
  expr: string;
  result: ReactNode;
  note?: ReactNode;
  en?: { note?: ReactNode };
};

export function Reveal({ expr, result, note, en }: RevealProps) {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const shownNote = lang === "en" && en?.note !== undefined ? en.note : note;
  return (
    <tr onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
      <td style={{ padding: "6px 12px", fontFamily: "monospace" }}>{expr}</td>
      <td style={{ padding: "6px 12px", fontFamily: "monospace", minWidth: 140 }}>
        {open ? (
          <b>{result}</b>
        ) : (
          <span className="hint">{lang === "en" ? "— click —" : "— клик —"}</span>
        )}
      </td>
      <td style={{ padding: "6px 12px", fontSize: 13, color: "#667" }}>
        {open ? shownNote : ""}
      </td>
    </tr>
  );
}
