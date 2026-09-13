// Блоки формата «страница = мини-собеседование»:
// 1) вопрос интервьюера  2) эталонный ответ  3) разбор с демо  4) где подловят
// Вопрос и ответ — двуязычные: пропсы ru / en, язык из LangContext (тумблер в
// сайдбаре). children — легаси-фолбэк, работает как ru.
import type { ReactNode } from "react";
import { useLang, type Lang } from "../LangContext";
import { highlight } from "../highlight";

const LABELS: Record<Lang, { question: string; answer: string; gotchas: string }> = {
  ru: {
    question: "❓ Вопрос интервьюера",
    answer: "🎤 Ответ, который хотят услышать",
    gotchas: "🪤 Где могут подловить",
  },
  en: {
    question: "❓ Interviewer's question",
    answer: "🎤 The answer they want to hear",
    gotchas: "🪤 Common traps",
  },
};

// Универсальный переключатель текста/JSX: <L ru={...} en={...} />
// en не задан — показываем ru (постепенная миграция страниц безопасна).
export function L({ ru, en }: { ru: ReactNode; en?: ReactNode }) {
  const lang = useLang();
  return lang === "en" && en !== undefined ? en : ru;
}

// Блок кода с языковыми вариантами (комментарии в коде тоже переводятся).
// Подсвечивает сам (не через глобальный observer — тот пропустил бы смену языка).
export function CodeBlock({ ru, en }: { ru: string; en?: string }) {
  const lang = useLang();
  const code = lang === "en" && en !== undefined ? en : ru;
  return (
    <pre
      className="code"
      data-hl="1"
      dangerouslySetInnerHTML={{ __html: highlight(code) }}
    />
  );
}

function pick(lang: Lang, ru: ReactNode, en: ReactNode, children: ReactNode) {
  if (lang === "en" && en) return en;
  return ru ?? children;
}

type QAProps = { ru?: ReactNode; en?: ReactNode; children?: ReactNode };

export function InterviewQuestion({ ru, en, children }: QAProps) {
  const lang = useLang();
  return (
    <div className="q-block">
      <div className="q-label">{LABELS[lang].question}</div>
      <div className="q-text">{pick(lang, ru, en, children)}</div>
    </div>
  );
}

export function ModelAnswer({ ru, en, children }: QAProps) {
  const lang = useLang();
  return (
    <div className="answer-block">
      <div className="q-label">{LABELS[lang].answer}</div>
      <div>{pick(lang, ru, en, children)}</div>
    </div>
  );
}

// Известные заголовки секций переводятся автоматически; свой en — пропом.
const SECTION_TITLES: Record<string, string> = {
  "Разбор с примерами": "Deep dive with examples",
  "Разбор": "Deep dive",
  "Разбор: квиз": "Deep dive: quiz",
};
export function SectionTitle({ children, en }: { children: string; en?: string }) {
  const lang = useLang();
  const text =
    lang === "en" ? en ?? SECTION_TITLES[children] ?? children : children;
  return <h2 className="section-h2">{text}</h2>;
}

// en у пункта не задан — показываем ru-версию (безопасная миграция).
export type GotchaItem = {
  title: string;
  code?: string;
  text: ReactNode;
  en?: { title?: string; code?: string; text?: ReactNode };
};

export function Gotchas({ items }: { items: GotchaItem[] }) {
  const lang = useLang();
  return (
    <div className="card">
      <h3>{LABELS[lang].gotchas}</h3>
      {items.map((raw, i) => {
        const g = lang === "en" && raw.en ? { ...raw, ...raw.en } : raw;
        return (
          <div key={i} style={{ marginBottom: 14 }}>
            <p style={{ fontWeight: 600, margin: "6px 0" }}>
              {i + 1}. {g.title}
            </p>
            {g.code && (
              <pre
                className="code"
                data-hl="1"
                dangerouslySetInnerHTML={{ __html: highlight(g.code) }}
              />
            )}
            <p className="hint" style={{ margin: "4px 0" }}>{g.text}</p>
          </div>
        );
      })}
    </div>
  );
}
