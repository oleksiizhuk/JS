import { useState } from "react";
import { useLang } from "../../LangContext.jsx";
import { highlight } from "../../highlight.js";

function fmt(v) {
  if (v === undefined) return "undefined"; // иначе join() превратит в пустоту
  if (v === null) return "null";
  if (typeof v === "string") return v;
  if (typeof v === "function") return "ƒ " + (v.name || "anonymous");
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
export function Demo({ title, code, run, hint, en }) {
  const lang = useLang();
  const [lines, setLines] = useState(null);
  const v =
    lang === "en" && en ? { title, code, hint, ...en } : { title, code, hint };

  const exec = () => {
    const out = [];
    const log = (...args) => out.push(args.map(fmt).join(" "));
    try {
      run(log);
    } catch (e) {
      out.push(`💥 ${e.constructor.name}: ${e.message}`);
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
export function Reveal({ expr, result, note, en }) {
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
