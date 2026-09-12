import { useEffect, useMemo, useState } from "react";
import { UNITS } from "./units.js";
import { useLang } from "../LangContext.jsx";

// Тренажёр словаря: 4 режима поверх одного списка слов (units.js).
//  📖 Текст     — связный рассказ, слова подсвечены; клик открывает карточку
//  🃏 Слова     — карточки «сначала угадай, потом раскрой» + своё предложение
//  🔁 Повторение — интервальное повторение (коробки Лейтнера в localStorage)
//  ✍️ Пропуски  — предложение с ___ и 4 варианта из того же раздела

const UI = {
  ru: {
    units: "Разделы", modes: { text: "📖 Текст", words: "🃏 Слова", srs: "🔁 Повторение", gaps: "✍️ Пропуски" },
    intro: "Слова из твоего курса. Сначала попробуй вспомнить значение сам, потом раскрывай карточку — так запоминается втрое лучше.",
    clickWord: "Кликни подсвеченное слово — откроется карточка.",
    reveal: "Показать значение", hide: "Свернуть", own: "Твоё предложение с этим словом:",
    ownPh: "Напиши сам — так слово переходит в активный словарь…", meaning: "Значение", def: "Definition",
    examples: "Примеры", usage: "Где и как употреблять", box: "коробка",
    due: (n) => `К повторению сейчас: ${n}`, allDone: "Всё повторено! Следующие слова подойдут по расписанию — или выбери другой раздел.",
    front: "Что это значит?", frontRu: "Как это по-английски?", direction: "Направление", show: "Показать ответ",
    know: "✅ Знаю", again: "🔁 Ещё раз", dirEn: "EN → RU", dirRu: "RU → EN",
    gapTitle: "Вставь слово", score: (ok, all) => `Верно ${ok} из ${all}`, next: "Дальше →", restart: "Ещё раз",
    right: "Верно!", wrong: "Не то. Правильно:", gapDone: "Раздел пройден!", reset: "Сбросить прогресс повторения",
    resetConfirm: "Стереть прогресс интервального повторения по всем словам?",
    boxes: "Коробки: 0 — новое, 5 — выучено. «Знаю» сдвигает вверх и откладывает слово на 1 → 3 → 7 → 14 → 30 дней, «Ещё раз» возвращает в 0.",
  },
  en: {
    units: "Sections", modes: { text: "📖 Text", words: "🃏 Words", srs: "🔁 Review", gaps: "✍️ Gaps" },
    intro: "Words from your course. Try to recall the meaning first, then open the card — retrieval beats rereading.",
    clickWord: "Click a highlighted word to open its card.",
    reveal: "Show meaning", hide: "Collapse", own: "Your own sentence with this word:",
    ownPh: "Write one yourself — that moves the word into your active vocabulary…", meaning: "Meaning", def: "Definition",
    examples: "Examples", usage: "Where and how to use it", box: "box",
    due: (n) => `Due now: ${n}`, allDone: "All reviewed! More words will come due on schedule — or pick another section.",
    front: "What does it mean?", frontRu: "How do you say it in English?", direction: "Direction", show: "Show answer",
    know: "✅ I know it", again: "🔁 Again", dirEn: "EN → RU", dirRu: "RU → EN",
    gapTitle: "Fill the gap", score: (ok, all) => `${ok} of ${all} correct`, next: "Next →", restart: "Restart",
    right: "Correct!", wrong: "Not quite. The answer:", gapDone: "Section complete!", reset: "Reset review progress",
    resetConfirm: "Erase spaced-repetition progress for all words?",
    boxes: "Boxes: 0 = new, 5 = learned. «I know it» moves a word up and schedules it 1 → 3 → 7 → 14 → 30 days ahead; «Again» sends it back to 0.",
  },
};

// ── localStorage helpers ──────────────────────────────────────────────
const SRS_KEY = "en-srs";
const OWN_KEY = (k) => "en-own-" + k;
const DAYS = [0, 1, 3, 7, 14, 30];
const loadSrs = () => {
  try { return JSON.parse(localStorage.getItem(SRS_KEY) || "{}"); } catch { return {}; }
};
const saveSrs = (s) => localStorage.setItem(SRS_KEY, JSON.stringify(s));
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── карточка слова ───────────────────────────────────────────────────
function WordCard({ word, open, onToggle, srs }) {
  const lang = useLang();
  const T = UI[lang];
  const [own, setOwn] = useState(() => localStorage.getItem(OWN_KEY(word.k)) || "");
  const box = srs?.[word.k]?.box ?? 0;
  return (
    <div className={"card en-card" + (open ? " open" : "")}>
      <div className="en-head" onClick={onToggle}>
        <div>
          <b className="en-w">{word.w}</b>
          {word.ipa && <span className="hint"> {word.ipa}</span>}
          <span className="hint"> · {word.form}</span>
        </div>
        <div>
          <span className="badge en-reg">{word.reg}</span>
          <span className="badge en-box" title={T.box}>📦 {box}</span>
        </div>
      </div>
      {!open ? (
        <button className="btn" onClick={onToggle}>{T.reveal}</button>
      ) : (
        <>
          <p className="en-ru">{word.ru}</p>
          <p className="hint"><i>{word.def}</i></p>
          <div className="en-label">{T.examples}</div>
          <ul className="en-ex">{word.ex.map((e) => <li key={e}>{e}</li>)}</ul>
          <div className="explain"><b>{T.usage}:</b> {lang === "en" ? word.use_en : word.use}</div>
          <div className="en-label" style={{ marginTop: 10 }}>{T.own}</div>
          <textarea
            className="en-own"
            rows={2}
            value={own}
            placeholder={T.ownPh}
            onChange={(e) => { setOwn(e.target.value); localStorage.setItem(OWN_KEY(word.k), e.target.value); }}
          />
          <button className="btn" onClick={onToggle}>{T.hide}</button>
        </>
      )}
    </div>
  );
}

// ── режим «Текст» ────────────────────────────────────────────────────
function TextMode({ units, srs }) {
  const lang = useLang();
  const T = UI[lang];
  const [sel, setSel] = useState(null);
  return (
    <>
      <p className="hint">{T.clickWord}</p>
      {units.map((u) => {
        const byKey = Object.fromEntries(u.words.map((w) => [w.k, w]));
        const parts = u.story.split(/(\[\[.+?\]\])/g);
        return (
          <div className="card" key={u.id}>
            <h3>{lang === "en" ? u.title_en : u.title}</h3>
            <p className="hint">{lang === "en" ? u.theme_en : u.theme}</p>
            <p className="en-story">
              {parts.map((p, i) => {
                const m = p.match(/^\[\[(.+?)(?:\|(.+))?\]\]$/); // [[key]] или [[key|display]]
                if (!m) return <span key={i}>{p}</span>;
                const w = byKey[m[1]];
                const active = sel?.k === w.k;
                const toggle = () => setSel(active ? null : w);
                // span, а не button: кнопка не переносится по строкам, а длинная
                // фраза должна течь как обычный текст
                return (
                  <span key={i} className={"en-hl" + (active ? " active" : "")} role="button" tabIndex={0}
                    onClick={toggle} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}>
                    {m[2] ?? m[1]}
                  </span>
                );
              })}
            </p>
            {sel && byKey[sel.k] && <WordCard word={sel} open onToggle={() => setSel(null)} srs={srs} />}
          </div>
        );
      })}
    </>
  );
}

// ── режим «Слова» ────────────────────────────────────────────────────
function WordsMode({ units, srs }) {
  const lang = useLang();
  const [open, setOpen] = useState(() => new Set());
  const toggle = (k) => setOpen((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  return units.map((u) => (
    <div key={u.id}>
      <h3 className="section-h2">{lang === "en" ? u.title_en : u.title}</h3>
      {u.words.map((w) => <WordCard key={w.k} word={w} open={open.has(w.k)} onToggle={() => toggle(w.k)} srs={srs} />)}
    </div>
  ));
}

// ── режим «Повторение» (Leitner) ─────────────────────────────────────
function SrsMode({ units, srs, setSrs }) {
  const lang = useLang();
  const T = UI[lang];
  const [dir, setDir] = useState("en");
  const [queue, setQueue] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const unitIds = units.map((u) => u.id).join(",");

  useEffect(() => {
    const now = Date.now();
    const due = units.flatMap((u) => u.words).filter((w) => {
      const s = srs[w.k];
      return !s || s.due <= now;
    });
    setQueue(shuffle(due));
    setRevealed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitIds]);

  const grade = (ok) => {
    const w = queue[0];
    const box = ok ? Math.min((srs[w.k]?.box ?? 0) + 1, DAYS.length - 1) : 0;
    const next = { ...srs, [w.k]: { box, due: Date.now() + DAYS[box] * 864e5 } };
    setSrs(next);
    saveSrs(next);
    setQueue((q) => (ok ? q.slice(1) : [...q.slice(1), w]));
    setRevealed(false);
  };
  const reset = () => {
    if (!confirm(T.resetConfirm)) return;
    setSrs({}); saveSrs({});
    setQueue(shuffle(units.flatMap((u) => u.words)));
  };

  const w = queue[0];
  return (
    <>
      <div className="card">
        <span className="hint">{T.direction}: </span>
        {["en", "ru"].map((d) => (
          <button key={d} className={"btn" + (dir === d ? " primary" : "")} onClick={() => { setDir(d); setRevealed(false); }}>
            {d === "en" ? T.dirEn : T.dirRu}
          </button>
        ))}
        <span className="badge">{T.due(queue.length)}</span>
        <p className="hint">{T.boxes}</p>
      </div>
      {!w ? (
        <div className="card"><p>{T.allDone}</p><button className="btn" onClick={reset}>{T.reset}</button></div>
      ) : (
        <div className="card en-flash">
          <div className="hint">{dir === "en" ? T.front : T.frontRu}</div>
          <div className="en-front">{dir === "en" ? w.w : w.ru}</div>
          <div className="hint">{w.form}{dir === "en" && w.ipa ? " · " + w.ipa : ""}</div>
          {!revealed ? (
            <button className="btn primary" onClick={() => setRevealed(true)}>{T.show}</button>
          ) : (
            <>
              <WordCard word={w} open onToggle={() => {}} srs={srs} />
              <button className="btn primary" onClick={() => grade(true)}>{T.know}</button>
              <button className="btn" onClick={() => grade(false)}>{T.again}</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

// ── режим «Пропуски» ─────────────────────────────────────────────────
function buildGapQueue(units) {
  return shuffle(
    units.flatMap((u) =>
      u.words.map((w) => {
        const others = shuffle(u.words.filter((o) => o.k !== w.k && o.gap.a.toLowerCase() !== w.gap.a.toLowerCase())).slice(0, 3);
        return { word: w, options: shuffle([w.gap.a, ...others.map((o) => o.gap.a)]) };
      })
    )
  );
}
function GapsMode({ units }) {
  const lang = useLang();
  const T = UI[lang];
  const unitIds = units.map((u) => u.id).join(",");
  const [queue, setQueue] = useState(() => buildGapQueue(units));
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ ok: 0, all: 0 });
  const [retried, setRetried] = useState(() => new Set());

  useEffect(() => {
    setQueue(buildGapQueue(units)); setPicked(null); setScore({ ok: 0, all: 0 }); setRetried(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitIds]);

  const item = queue[0];
  const pick = (o) => {
    if (picked) return;
    setPicked(o);
    setScore((s) => ({ ok: s.ok + (o === item.word.gap.a ? 1 : 0), all: s.all + 1 }));
  };
  const next = () => {
    const wrong = picked !== item.word.gap.a;
    setQueue((q) => {
      const rest = q.slice(1);
      // ошибся — слово вернётся один раз в конце очереди
      return wrong && !retried.has(item.word.k) ? [...rest, item] : rest;
    });
    if (wrong) setRetried((s) => new Set(s).add(item.word.k));
    setPicked(null);
  };

  if (!item)
    return (
      <div className="card">
        <h3>{T.gapDone}</h3>
        <p>{T.score(score.ok, score.all)}</p>
        <button className="btn primary" onClick={() => { setQueue(buildGapQueue(units)); setScore({ ok: 0, all: 0 }); setRetried(new Set()); }}>{T.restart}</button>
      </div>
    );
  const [before, after] = item.word.gap.s.split("___");
  return (
    <div className="card">
      <div className="hint">{T.gapTitle} <span className="badge">{T.score(score.ok, score.all)}</span> <span className="hint">· {queue.length}</span></div>
      <p className="en-gap">{before}<span className="en-blank">{picked ? item.word.gap.a : "_____"}</span>{after}</p>
      <div>
        {item.options.map((o) => {
          let cls = "btn en-opt";
          if (picked) cls += o === item.word.gap.a ? " right" : o === picked ? " wrong" : "";
          return <button key={o} className={cls} onClick={() => pick(o)}>{o}</button>;
        })}
      </div>
      {picked && (
        <>
          <div className={picked === item.word.gap.a ? "explain" : "redflag"}>
            <b>{picked === item.word.gap.a ? T.right : T.wrong + " " + item.word.gap.a + "."}</b>{" "}
            <b>{item.word.w}</b> — {item.word.ru}. {lang === "en" ? item.word.use_en : item.word.use}
          </div>
          <button className="btn primary" onClick={next}>{T.next}</button>
        </>
      )}
    </div>
  );
}

// ── страница ─────────────────────────────────────────────────────────
export default function EnglishTrainer() {
  const lang = useLang();
  const T = UI[lang];
  const [mode, setMode] = useState("text");
  const [unitIds, setUnitIds] = useState(() => new Set(UNITS.map((u) => u.id)));
  const [srs, setSrs] = useState(loadSrs);
  const units = useMemo(() => UNITS.filter((u) => unitIds.has(u.id)), [unitIds]);
  const toggleUnit = (id) =>
    setUnitIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n.size ? n : s; // хотя бы один раздел
    });

  return (
    <>
      <p className="hint">{T.intro}</p>
      <div className="card">
        <span className="hint">{T.units}: </span>
        {UNITS.map((u) => (
          <button key={u.id} className={"btn" + (unitIds.has(u.id) ? " primary" : "")} onClick={() => toggleUnit(u.id)}>
            {u.id.replace("s", "Section ")} · {u.words.length}
          </button>
        ))}
        <div style={{ marginTop: 8 }}>
          {Object.entries(T.modes).map(([m, label]) => (
            <button key={m} className={"btn" + (mode === m ? " primary" : "")} onClick={() => setMode(m)}>{label}</button>
          ))}
        </div>
      </div>
      {mode === "text" && <TextMode units={units} srs={srs} />}
      {mode === "words" && <WordsMode units={units} srs={srs} />}
      {mode === "srs" && <SrsMode units={units} srs={srs} setSrs={setSrs} />}
      {mode === "gaps" && <GapsMode units={units} />}
    </>
  );
}
