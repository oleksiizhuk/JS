// Формат вопроса квиза — правила в скилле .claude/skills/quiz-questions/SKILL.md
export type Options = [string, string, string, string];

export type Question = {
  t: string; // тема: "JS · let/var/const"
  q: string; // вопрос
  o: Options; // ровно 4 варианта
  a: number; // индекс правильного в o
  e: string; // объяснение
  en: { t: string; q: string; o: Options; a?: number; e: string }; // en.o — в том же порядке, что o
};
