import { useEffect, useMemo, useState } from "react";
import { UNITS } from "./units";
import type { Unit, Word } from "./units";
import { GRAMMAR, GRAMMAR_TEXTS } from "./grammar";
import type { GrammarPoint } from "./grammar";
import { useLang } from "../LangContext";
import type { Lang } from "../LangContext";

// Тренажёр словаря: 4 режима поверх одного списка слов (units.js).
//  📖 Текст     — связный рассказ, слова подсвечены; клик открывает карточку
//  🃏 Слова     — карточки «сначала угадай, потом раскрой» + своё предложение
//  🔁 Повторение — интервальное повторение (коробки Лейтнера в localStorage)
//  ✍️ Пропуски  — предложение с ___ и 4 варианта из того же раздела
//  📐 Grammar   — разбор конструкций C1 из текста раздела (grammar.ts)

type Mode = "text" | "words" | "srs" | "gaps" | "grammar";
type Dir = "en" | "ru";
type UiText = {
  units: string; modes: Record<Mode, string>; intro: string; clickWord: string;
  reveal: string; hide: string; own: string; ownPh: string; meaning: string; def: string;
  examples: string; usage: string; box: string;
  due: (n: number) => string; allDone: string;
  front: string; frontRu: string; direction: string; show: string;
  know: string; again: string; dirEn: string; dirRu: string;
  gapTitle: string; score: (ok: number, all: number) => string; next: string; restart: string;
  right: string; wrong: string; gapDone: string; reset: string; resetConfirm: string; boxes: string;
  grammarIntro: string; grammarNone: string; grammarRu: string; rule: string; pattern: string; trap: string; tryIt: string;
  sourceText: string; textHint: string; hideText: string; showText: string; inText: string;
  inIt: string; aboutMe: string;
};

const UI: Record<Lang, UiText> = {
  ru: {
    units: "Разделы", modes: { text: "📖 Текст", words: "🃏 Слова", srs: "🔁 Повторение", gaps: "✍️ Пропуски", grammar: "📐 Грамматика" },
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
    grammarIntro: "Конструкции уровня C1 из текста раздела. Прочитай цитату и попробуй сам сформулировать правило — потом сверься. В конце карточки задание: сначала ответь, потом раскрывай.",
    grammarNone: "Для выбранных разделов разбора грамматики пока нет (есть для Section 2).",
    grammarRu: "🇷🇺 Дублировать по-русски", rule: "Правило", pattern: "Формула", trap: "Ловушка", tryIt: "Попробуй",
    sourceText: "Текст", textHint: "Кликни подсвеченную фразу — перейдёшь к её правилу.", hideText: "Свернуть текст", showText: "Показать текст", inText: "↑ в тексте",
    inIt: "В IT", aboutMe: "О себе на собесе",
  },
  en: {
    units: "Sections", modes: { text: "📖 Text", words: "🃏 Words", srs: "🔁 Review", gaps: "✍️ Gaps", grammar: "📐 Grammar" },
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
    grammarIntro: "C1 structures from the section text. Read the quote and try to state the rule yourself, then check. Each card ends with a task: answer first, then reveal.",
    grammarNone: "No grammar notes for the selected sections yet (available for Section 2).",
    grammarRu: "🇷🇺 Also in Russian", rule: "Rule", pattern: "Pattern", trap: "Trap", tryIt: "Try it",
    sourceText: "Source text", textHint: "Click a highlighted phrase to jump to its rule.", hideText: "Hide text", showText: "Show text", inText: "↑ in the text",
    inIt: "In IT", aboutMe: "About yourself (interview)",
  },
};

// ── localStorage helpers ──────────────────────────────────────────────
type SrsEntry = { box: number; due: number };
type SrsMap = Record<string, SrsEntry>;
const SRS_KEY = "en-srs";
const OWN_KEY = (k: string) => "en-own-" + k;
const DAYS = [0, 1, 3, 7, 14, 30];
const loadSrs = (): SrsMap => {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(SRS_KEY) || "{}");
    return raw !== null && typeof raw === "object" ? (raw as SrsMap) : {};
  } catch { return {}; }
};
const saveSrs = (s: SrsMap) => localStorage.setItem(SRS_KEY, JSON.stringify(s));
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── карточка слова ───────────────────────────────────────────────────
function WordCard({ word, open, onToggle, srs }: { word: Word; open: boolean; onToggle: () => void; srs: SrsMap }) {
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
function TextMode({ units, srs }: { units: Unit[]; srs: SrsMap }) {
  const lang = useLang();
  const T = UI[lang];
  const [sel, setSel] = useState<Word | null>(null);
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
function WordsMode({ units, srs }: { units: Unit[]; srs: SrsMap }) {
  const lang = useLang();
  const [open, setOpen] = useState(() => new Set<string>());
  const toggle = (k: string) => setOpen((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  return units.map((u) => (
    <div key={u.id}>
      <h3 className="section-h2">{lang === "en" ? u.title_en : u.title}</h3>
      {u.words.map((w) => <WordCard key={w.k} word={w} open={open.has(w.k)} onToggle={() => toggle(w.k)} srs={srs} />)}
    </div>
  ));
}

// ── режим «Повторение» (Leitner) ─────────────────────────────────────
function SrsMode({ units, srs, setSrs }: { units: Unit[]; srs: SrsMap; setSrs: (s: SrsMap) => void }) {
  const lang = useLang();
  const T = UI[lang];
  const [dir, setDir] = useState<Dir>("en");
  const [queue, setQueue] = useState<Word[]>([]);
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

  const grade = (ok: boolean) => {
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
        {(["en", "ru"] as const).map((d) => (
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
type GapItem = { word: Word; options: string[] };
function buildGapQueue(units: Unit[]): GapItem[] {
  return shuffle(
    units.flatMap((u) =>
      u.words.map((w) => {
        const others = shuffle(u.words.filter((o) => o.k !== w.k && o.gap.a.toLowerCase() !== w.gap.a.toLowerCase())).slice(0, 3);
        return { word: w, options: shuffle([w.gap.a, ...others.map((o) => o.gap.a)]) };
      })
    )
  );
}
function GapsMode({ units }: { units: Unit[] }) {
  const lang = useLang();
  const T = UI[lang];
  const unitIds = units.map((u) => u.id).join(",");
  const [queue, setQueue] = useState(() => buildGapQueue(units));
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ ok: 0, all: 0 });
  const [retried, setRetried] = useState(() => new Set<string>());

  useEffect(() => {
    setQueue(buildGapQueue(units)); setPicked(null); setScore({ ok: 0, all: 0 }); setRetried(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitIds]);

  const item = queue[0];
  const pick = (o: string) => {
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

// ── режим «Grammar» ──────────────────────────────────────────────────
// **выделение** в цитате → подсветка конструкции
function Marked({ text }: { text: string }) {
  return text.split(/(\*\*.+?\*\*)/g).map((p, i) =>
    p.startsWith("**") ? <mark key={i} className="en-mark">{p.slice(2, -2)}</mark> : <span key={i}>{p}</span>
  );
}
// Исходный текст с размеченными [[id|фраза]]: клик ведёт к карточке правила
function SourceText({ units, onJump }: { units: Unit[]; onJump: (id: string) => void }) {
  const lang = useLang();
  const T = UI[lang];
  const [open, setOpen] = useState(true);
  const texts = units.filter((u) => GRAMMAR_TEXTS[u.id]);
  if (!texts.length) return null;
  return (
    <div className="card">
      <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        {T.sourceText}
        <button className="btn" onClick={() => setOpen((v) => !v)}>{open ? T.hideText : T.showText}</button>
      </h3>
      {open && (
        <>
          <p className="hint">{T.textHint}</p>
          {texts.map((u) => (
            <div key={u.id}>
              <div className="en-label">{lang === "en" ? u.title_en : u.title}</div>
              {GRAMMAR_TEXTS[u.id].map((para, i) => (
                <p className="en-story" key={i}>
                  {para.speaker && <b>{para.speaker}: </b>}
                  {para.text.split(/(\[\[.+?\]\])/g).map((part, j) => {
                    const m = part.match(/^\[\[(.+?)\|(.+)\]\]$/);
                    if (!m) return <span key={j}>{part}</span>;
                    return (
                      <span key={j} className="en-hl" role="button" tabIndex={0} title={m[1]}
                        onClick={() => onJump(m[1])}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onJump(m[1]); } }}>
                        {m[2]}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function GrammarMode({ units }: { units: Unit[] }) {
  const lang = useLang();
  const T = UI[lang];
  const [ru, setRu] = useState(false); // EN-интерфейс: показать пояснения ещё и по-русски
  const [revealed, setRevealed] = useState(() => new Set<string>());
  const [focus, setFocus] = useState<string | null>(null); // карточка, к которой перешли из текста
  const points: { unit: Unit; p: GrammarPoint }[] = units.flatMap((u) => (GRAMMAR[u.id] ?? []).map((p) => ({ unit: u, p })));
  if (!points.length) return <div className="card"><p className="hint">{T.grammarNone}</p></div>;
  const en = lang === "en";
  const dupRu = en && ru;
  const reveal = (id: string) => setRevealed((s) => new Set(s).add(id));
  // scrollIntoView опционально: в jsdom (тесты) его нет
  const scrollTo = (elId: string) => {
    const el = document.getElementById(elId);
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const jump = (id: string) => {
    setFocus(id);
    scrollTo("gr-" + id);
  };
  const backToText = () => scrollTo("gr-text");
  return (
    <>
      <div className="card">
        <p className="hint">{T.grammarIntro}</p>
        {en && <button className={"btn" + (ru ? " primary" : "")} onClick={() => setRu((v) => !v)}>{T.grammarRu}</button>}
      </div>
      <div id="gr-text"><SourceText units={units} onJump={jump} /></div>
      {points.map(({ unit, p }) => {
        const note = en ? p.task.note_en : p.task.note;
        return (
          <div className={"card" + (focus === p.id ? " en-focus" : "")} key={p.id} id={"gr-" + p.id}>
            <div className="hint" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span>{en ? unit.title_en : unit.title}</span>
              <a href="#gr-text" onClick={(e) => { e.preventDefault(); backToText(); }}>{T.inText}</a>
            </div>
            <h3>{en ? p.title_en : p.title}</h3>
            <blockquote className="en-quote"><Marked text={p.quote} /></blockquote>
            <div className="en-label">{T.rule}</div>
            <p>{en ? p.rule_en : p.rule}</p>
            {dupRu && <p className="hint">🇷🇺 {p.rule}</p>}
            <div className="en-label">{T.pattern}</div>
            <p className="en-pattern">{p.pattern}</p>
            <div className="en-label">{T.examples}</div>
            <ul className="en-ex">{p.examples.map((e) => <li key={e}>{e}</li>)}</ul>
            <div className="en-label">💻 {T.inIt}</div>
            <ul className="en-ex">{p.it.map((e) => <li key={e}>{e}</li>)}</ul>
            <div className="en-label">🙋 {T.aboutMe}</div>
            <ul className="en-ex">{p.me.map((e) => <li key={e}>{e}</li>)}</ul>
            <div className="redflag">
              <b>{T.trap}:</b> {en ? p.trap_en : p.trap}
              {dupRu && <div className="hint">🇷🇺 {p.trap}</div>}
            </div>
            <div className="explain">
              <b>{T.tryIt}:</b> {en ? p.task.q_en : p.task.q}
              {!revealed.has(p.id) ? (
                <div><button className="btn primary" onClick={() => reveal(p.id)}>{T.show}</button></div>
              ) : (
                <div className="en-answer">
                  <b>→ {p.task.a}</b>
                  {note && <div className="hint">{note}</div>}
                  {dupRu && p.task.note && <div className="hint">🇷🇺 {p.task.note}</div>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── страница ─────────────────────────────────────────────────────────
export default function EnglishTrainer() {
  const lang = useLang();
  const T = UI[lang];
  const [mode, setMode] = useState<Mode>("text");
  const [unitIds, setUnitIds] = useState(() => new Set(UNITS.map((u) => u.id)));
  const [srs, setSrs] = useState(loadSrs);
  const units = useMemo(() => UNITS.filter((u) => unitIds.has(u.id)), [unitIds]);
  const toggleUnit = (id: string) =>
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
          {(Object.entries(T.modes) as [Mode, string][]).map(([m, label]) => (
            <button key={m} className={"btn" + (mode === m ? " primary" : "")} onClick={() => setMode(m)}>{label}</button>
          ))}
        </div>
      </div>
      {mode === "text" && <TextMode units={units} srs={srs} />}
      {mode === "words" && <WordsMode units={units} srs={srs} />}
      {mode === "srs" && <SrsMode units={units} srs={srs} setSrs={setSrs} />}
      {mode === "gaps" && <GapsMode units={units} />}
      {mode === "grammar" && <GrammarMode units={units} />}
    </>
  );
}
