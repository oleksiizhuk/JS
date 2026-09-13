// Страж переводов: каждая страница темы обязана иметь EN-версии
// вопроса и эталонного ответа (пропсы en у InterviewQuestion и ModelAnswer).
// Формат описан в скилле .claude/skills/interview-topic/SKILL.md.
import { describe, expect, test } from "vitest";

// Исходники всех страниц тем как строки (Vite: ?raw) — без node:fs,
// ключ = путь относительно этого файла ("../topics/js/LetVarConst.tsx").
const TOPICS_DIR = "../topics/";
const sources: Record<string, string> = import.meta.glob("../topics/**/*.tsx", { query: "?raw", eager: true, import: "default" });

const pages = Object.keys(sources).filter((f) => {
  const src = sources[f];
  // страница темы = использует InterviewQuestion (служебные файлы пропускаем)
  return src.includes("<InterviewQuestion");
});

describe("двуязычность страниц (RU/EN)", () => {
  test("найдены страницы тем", () => {
    expect(pages.length).toBeGreaterThan(30);
  });

  test.each(pages.map((f) => [f.replace(TOPICS_DIR, ""), f]))(
    "%s: en-перевод вопроса и ответа",
    (_: string, file: string) => {
      const src = sources[file];
      // Вопрос: <InterviewQuestion en="..."> (без en — голый тег с '>')
      expect(src, "InterviewQuestion без пропа en").not.toMatch(
        /<InterviewQuestion>/
      );
      // Ответ: у каждого <ModelAnswer в ближайших строках должен быть en={
      const answers = src.split("<ModelAnswer").slice(1);
      for (const chunk of answers) {
        const head = chunk.slice(0, 200); // пропсы открывающего тега
        expect(head, "ModelAnswer без пропа en").toMatch(/en=\{/);
      }
    }
  );
});
