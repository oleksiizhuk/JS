// Страж переводов: каждая страница темы обязана иметь EN-версии
// вопроса и эталонного ответа (пропсы en у InterviewQuestion и ModelAnswer).
// Формат описан в скилле .claude/skills/interview-topic/SKILL.md.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const TOPICS_DIR = join(import.meta.dirname, "..", "topics");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return name.endsWith(".jsx") ? [full] : [];
  });
}

const pages = walk(TOPICS_DIR).filter((f) => {
  const src = readFileSync(f, "utf8");
  // страница темы = использует InterviewQuestion (служебные файлы пропускаем)
  return src.includes("<InterviewQuestion");
});

describe("двуязычность страниц (RU/EN)", () => {
  test("найдены страницы тем", () => {
    expect(pages.length).toBeGreaterThan(30);
  });

  test.each(pages.map((f) => [f.replace(TOPICS_DIR + "/", ""), f]))(
    "%s: en-перевод вопроса и ответа",
    (_, file) => {
      const src = readFileSync(file, "utf8");
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
