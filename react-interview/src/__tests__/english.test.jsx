// Страж словаря английского (src/english/units.js): полнота каждой карточки,
// совпадение маркеров [[k]] в story с ключами слов, валидность gap-предложений.
// Плюс smoke-тест: все четыре режима тренажёра рендерятся без ошибок.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { UNITS, ALL_WORDS } from "../english/units.js";
import EnglishTrainer from "../english/EnglishTrainer.jsx";

const FIELDS = ["k", "w", "form", "ru", "def", "reg", "ex", "use", "use_en", "gap"];

describe("english/units.js", () => {
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

describe("EnglishTrainer", () => {
  test("все режимы рендерятся", () => {
    render(<EnglishTrainer />);
    expect(screen.getAllByText(/Section 2/).length).toBeGreaterThan(0);
    for (const label of ["🃏 Слова", "🔁 Повторение", "✍️ Пропуски", "📖 Текст"]) {
      fireEvent.click(screen.getByText(label));
    }
    // в тексте есть подсвеченное слово, клик открывает карточку с определением
    fireEvent.click(screen.getAllByText("renowned")[0]);
    expect(screen.getByText(/famous and admired/)).toBeTruthy();
  });
});
