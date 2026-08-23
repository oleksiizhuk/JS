import { useMemo, useState } from "react";
import { QUESTIONS } from "./questions.js";
import { highlight } from "../highlight.js";
import { useLang } from "../LangContext.jsx";

// Интерфейсные строки квиза
const UI = {
  ru: {
    pickTopics: "1. Выбери темы", pickSize: "2. Выбери размер",
    qCount: "вопр.", available: "Доступно вопросов:",
    noRepeat: "Вопросы перемешиваются и не повторяются между прогонами, пока не закончится пул.",
    sizes: ["Маленький", "Средний", "Большой"], questions: "вопросов",
    result: "Результат", again: "Новый квиз", mistakes: "Разбор ошибок",
    question: "Вопрос", correct: "✅ Верно!", wrong: "❌ Неверно.",
    next: "Дальше →", results: "Результаты",
  },
  en: {
    pickTopics: "1. Pick topics", pickSize: "2. Pick a size",
    qCount: "q.", available: "Questions available:",
    noRepeat: "Questions are shuffled and won't repeat across runs until the pool is exhausted.",
    sizes: ["Small", "Medium", "Large"], questions: "questions",
    result: "Score", again: "New quiz", mistakes: "Review mistakes",
    question: "Question", correct: "✅ Correct!", wrong: "❌ Wrong.",
    next: "Next →", results: "Results",
  },
};

// Вопрос в выбранном языке: en-поля переопределяют ru (без en — ru)
function localized(q, lang) {
  return lang === "en" && q.en ? { ...q, ...q.en } : q;
}

// Вопрос: первая строка — текст, остальные — код (подсвеченный блок).
// data-hl ставим сами, чтобы глобальный highlightAll не обработал повторно.
function QuestionText({ text, bold = true }) {
  const [first, ...rest] = text.split("\n");
  const code = rest.join("\n");
  return (
    <>
      <p style={{ fontWeight: bold ? 600 : 400, margin: "6px 0" }}>{first}</p>
      {code && (
        <pre
          className="code"
          data-hl="1"
          dangerouslySetInnerHTML={{ __html: highlight(code) }}
        />
      )}
    </>
  );
}

// Секция вопроса = префикс темы до " · " ("JS", "React", "Redux", "Native", ...)
const sectionOf = (q) => q.t.split(" · ")[0];
const SECTION_LABELS = {
  JS: "JS Core",
  React: "React",
  Redux: "Redux",
  Native: "React Native",
  GraphQL: "GraphQL",
  TS: "TypeScript",
  EnginX: "EnginX (практики)",
  Claude: "Claude AI 🤖",
};
const ALL_SECTIONS = [...new Set(QUESTIONS.map(sectionOf))];

// ── «Без повторов между прогонами»: ключи показанных вопросов в localStorage
const SEEN_KEY = "quiz-seen";
// Ключ по полному тексту вопроса — префикс мог бы схлопнуть два вопроса,
// различающиеся только хвостом код-сниппета
const qKey = (q) => q.t + "|" + q.q;
const loadSeen = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
};
const saveSeen = (seen) =>
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Перемешать варианты ответа и пересчитать индекс правильного, чтобы при
// повторном показе не запоминалась позиция («правильный обычно B»).
// en.o перемешивается ТЕМ ЖЕ порядком — иначе переключение языка ломало бы ответ.
function shuffleOptions(q) {
  const order = shuffle(q.o.map((_, i) => i));
  return {
    ...q,
    o: order.map((i) => q.o[i]),
    a: order.indexOf(q.a),
    en: q.en?.o ? { ...q.en, o: order.map((i) => q.en.o[i]) } : q.en,
  };
}

// Выборка: сначала НЕвиданные вопросы; если не хватает — добираем виданными.
// Если весь пул уже показан — сбрасываем историю для этих секций.
function pickQuestions(n, sections) {
  const pool = QUESTIONS.filter((q) => sections.includes(sectionOf(q)));
  const seen = loadSeen();
  let unseen = pool.filter((q) => !seen.has(qKey(q)));

  if (unseen.length === 0) {
    // пул исчерпан — начинаем круг заново (забываем только эти секции)
    pool.forEach((q) => seen.delete(qKey(q)));
    unseen = pool;
  }

  const fresh = shuffle(unseen).slice(0, n);
  const chosen = new Set(fresh);
  const rest =
    fresh.length < n
      ? shuffle(pool.filter((q) => !chosen.has(q))).slice(0, n - fresh.length)
      : [];
  const quiz = shuffle([...fresh, ...rest]);

  quiz.forEach((q) => seen.add(qKey(q)));
  saveSeen(seen);
  return quiz.map(shuffleOptions); // варианты тоже перемешиваем
}

const SIZES = [{ n: 10 }, { n: 20 }, { n: 50 }];

export default function Quiz() {
  const lang = useLang();
  const T = UI[lang];
  const [quiz, setQuiz] = useState(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [sections, setSections] = useState(ALL_SECTIONS);

  const counts = useMemo(() => {
    const c = {};
    QUESTIONS.forEach((q) => (c[sectionOf(q)] = (c[sectionOf(q)] || 0) + 1));
    return c;
  }, []);

  const poolSize = QUESTIONS.filter((q) => sections.includes(sectionOf(q))).length;

  const toggle = (s) =>
    setSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const start = (n) => {
    setQuiz(pickQuestions(n, sections));
    setI(0);
    setPicked(null);
    setAnswers([]);
  };

  // ── Стартовый экран: выбор тем + размера
  if (!quiz) {
    return (
      <>
        <div className="card">
          <h3>{T.pickTopics}</h3>
          {ALL_SECTIONS.map((s) => (
            <label key={s} style={{ display: "block", padding: "4px 0", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={sections.includes(s)}
                onChange={() => toggle(s)}
              />{" "}
              {SECTION_LABELS[s] ?? s}{" "}
              <span className="hint">({counts[s]} {T.qCount})</span>
            </label>
          ))}
          <p className="hint">
            {T.available} <b>{poolSize}</b>. {T.noRepeat}
          </p>
        </div>

        <div className="card">
          <h3>{T.pickSize}</h3>
          {SIZES.map((s, si) => (
            <button
              key={s.n}
              className="btn primary"
              disabled={poolSize === 0}
              onClick={() => start(Math.min(s.n, poolSize))}
            >
              {T.sizes[si]} — {Math.min(s.n, poolSize)} {T.questions}
            </button>
          ))}
        </div>
      </>
    );
  }

  // ── Экран результатов
  if (i >= quiz.length) {
    const correct = answers.filter((a) => a.ok).length;
    const pct = Math.round((correct / quiz.length) * 100);
    const bySection = {};
    answers.forEach((a) => {
      const s = sectionOf(a.q);
      bySection[s] ??= { ok: 0, total: 0 };
      bySection[s].total++;
      if (a.ok) bySection[s].ok++;
    });
    const wrong = answers.filter((a) => !a.ok);

    return (
      <>
        <div className="card">
          <h3>
            {T.result}: {correct} / {quiz.length} ({pct}%){" "}
            {pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}
          </h3>
          {Object.entries(bySection).map(([name, s]) => (
            <p key={name}>
              {SECTION_LABELS[name] ?? name}: <b>{s.ok}/{s.total}</b>
            </p>
          ))}
          <button className="btn primary" onClick={() => setQuiz(null)}>
            {T.again}
          </button>
        </div>
        {wrong.length > 0 && (
          <div className="card">
            <h3>{T.mistakes} ({wrong.length})</h3>
            {wrong.map((a, k) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <p style={{ margin: "4px 0" }}>
                  <span className="badge">{a.q.t}</span>
                </p>
                <QuestionText text={localized(a.q, lang).q} bold={false} />
                <p className="hint" style={{ margin: "4px 0" }}>
                  ✅ {localized(a.q, lang).o[a.q.a]} — {localized(a.q, lang).e}
                </p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // ── Экран вопроса (отображение — в выбранном языке, логика — по индексам)
  const q = localized(quiz[i], lang);
  const answered = picked !== null;

  const choose = (k) => {
    if (answered) return;
    setPicked(k);
    setAnswers((a) => [...a, { q, ok: k === q.a }]);
  };

  return (
    <div className="card">
      <p className="hint">
        {T.question} {i + 1} / {quiz.length} <span className="badge">{q.t}</span>
      </p>
      <QuestionText text={q.q} />

      {q.o.map((option, k) => {
        let style = {};
        if (answered && k === q.a) style = { background: "#d8f5dc", borderColor: "#2f9e44" };
        else if (answered && k === picked) style = { background: "#ffe3e3", borderColor: "#e5484d" };
        return (
          <button
            key={k}
            className="btn"
            style={{ display: "block", width: "100%", textAlign: "left", ...style }}
            onClick={() => choose(k)}
          >
            {String.fromCharCode(65 + k)}. {option}
          </button>
        );
      })}

      {answered && (
        <>
          <div className={picked === q.a ? "explain" : "redflag"}>
            <b>{picked === q.a ? T.correct : T.wrong}</b> {q.e}
          </div>
          <button className="btn primary" onClick={() => { setI(i + 1); setPicked(null); }}>
            {i + 1 < quiz.length ? T.next : T.results}
          </button>
        </>
      )}
    </div>
  );
}
