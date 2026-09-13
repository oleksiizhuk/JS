// Страж словаря английского (src/english/units.ts): полнота каждой карточки,
// совпадение маркеров [[k]] в story с ключами слов, валидность gap-предложений.
// Плюс страж grammar.ts и smoke-тест: все пять режимов тренажёра рендерятся без ошибок.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { UNITS, ALL_WORDS } from "../english/units";
import type { Word } from "../english/units";
import EnglishTrainer from "../english/EnglishTrainer";
import { GRAMMAR, GRAMMAR_TEXTS } from "../english/grammar";
import type { GrammarPoint } from "../english/grammar";

const FIELDS: (keyof Word)[] = ["k", "w", "form", "ru", "def", "reg", "ex", "use", "use_en", "gap"];

describe("english/units.ts", () => {
  test("ключи слов уникальны по всему словарю", () => {
    const keys = ALL_WORDS.map((w) => w.k);
    expect(new Set(keys).size).toBe(keys.length);
  });

  test.each(UNITS.map((u) => [u.id, u]))("%s: карточки полные, story ссылается на существующие слова", (_, u) => {
    expect(u.title && u.title_en && u.theme && u.theme_en && u.story).toBeTruthy();
    const keys = new Set(u.words.map((w) => w.k));
    const used = [...u.story.matchAll(/\[\[(.+?)\]\]/g)].map((m) => m[1].split("|")[0]);
    expect(used.filter((k) => !keys.has(k)), "маркер без слова").toEqual([]);
    expect([...keys].filter((k) => !used.includes(k)), "слово не встречается в story").toEqual([]);
    for (const w of u.words) {
      for (const f of FIELDS) expect(w[f], `${w.k}: нет поля ${f}`).toBeTruthy();
      expect(w.ex.length, `${w.k}: нужно >= 2 примера`).toBeGreaterThanOrEqual(2);
      expect(w.gap.s.split("___").length, `${w.k}: в gap.s ровно один ___`).toBe(2);
      expect(w.gap.a.trim(), `${w.k}: пустой gap.a`).not.toBe("");
    }
    // для 4 вариантов ответа нужно >= 4 разных gap.a в разделе
    expect(new Set(u.words.map((w) => w.gap.a.toLowerCase())).size).toBeGreaterThanOrEqual(4);
  });
});

describe("english/grammar.ts", () => {
  const points = Object.entries(GRAMMAR).flatMap(([unit, ps]) => ps.map((p) => ({ unit, p })));
  const TEXT: (keyof GrammarPoint)[] = ["id", "title", "title_en", "quote", "rule", "rule_en", "pattern", "trap", "trap_en"];
  test("ключи разделов существуют в UNITS, id уникальны", () => {
    const ids = new Set(UNITS.map((u) => u.id));
    for (const unit of Object.keys(GRAMMAR)) expect(ids.has(unit)).toBe(true);
    expect(new Set(points.map(({ p }) => p.id)).size).toBe(points.length);
  });
  test("маркеры [[id|фраза]] в тексте ссылаются на существующие правила, каждое правило есть в тексте", () => {
    for (const [unit, paras] of Object.entries(GRAMMAR_TEXTS)) {
      const ids = new Set((GRAMMAR[unit] ?? []).map((p) => p.id));
      const used = new Set<string>();
      for (const { text } of paras) {
        expect(text, unit + ": незакрытый маркер").not.toMatch(/\[\[[^\]]*$/);
        for (const m of text.matchAll(/\[\[(.+?)\|(.+?)\]\]/g)) {
          expect(ids.has(m[1]), `${unit}: маркер ${m[1]} без правила`).toBe(true);
          used.add(m[1]);
        }
      }
      for (const id of ids) expect(used.has(id), `${unit}: правило ${id} не размечено в тексте`).toBe(true);
    }
  });
  test.each(points.map(({ unit, p }) => [unit + "/" + p.id, p]))("%s — карточка полная", (_name, p) => {
    for (const f of TEXT) expect(String(p[f]).trim().length, f).toBeGreaterThan(0);
    expect(p.quote, "quote без **выделения**").toMatch(/\*\*.+?\*\*/);
    expect(p.examples.length).toBeGreaterThanOrEqual(2);
    for (const f of ["q", "q_en", "a"] as const) expect(p.task[f].trim().length, "task." + f).toBeGreaterThan(0);
    if (p.task.note) expect(p.task.note_en, "task.note без note_en").toBeTruthy();
  });
});

describe("EnglishTrainer", () => {
  test("все режимы рендерятся", () => {
    render(<EnglishTrainer />);
    expect(screen.getAllByText(/Section 2/).length).toBeGreaterThan(0);
    for (const label of ["🃏 Слова", "🔁 Повторение", "✍️ Пропуски", "📐 Грамматика", "📖 Текст"]) {
      fireEvent.click(screen.getByText(label));
    }
    // режим Grammar: ответ на задание скрыт, пока не нажали «Показать ответ»
    fireEvent.click(screen.getByText("📐 Грамматика"));
    expect(screen.getByText(/Radio announcer/)).toBeTruthy(); // исходный текст на месте
    fireEvent.click(screen.getByTitle("having-left")); // клик по фразе в тексте не падает (scrollIntoView в jsdom нет)
    expect(screen.queryByText(/The manager having approved/)).toBeNull();
    fireEvent.click(screen.getAllByText("Показать ответ")[0]);
    expect(screen.getByText(/The manager having approved/)).toBeTruthy();
    fireEvent.click(screen.getByText("📖 Текст"));
    // в тексте есть подсвеченное слово, клик открывает карточку с определением
    fireEvent.click(screen.getAllByText("renowned")[0]);
    expect(screen.getByText(/famous and admired/)).toBeTruthy();
  });
});
