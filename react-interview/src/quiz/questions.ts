// Банк вопросов квиза. Разбит по секциям — файлы в ./sections/.
// Порядок здесь = порядок тем в квизе: JS → React → Redux → Native → GraphQL → TS.
// Формат вопроса и правила написания — скилл .claude/skills/quiz-questions/SKILL.md

import { JS_QUESTIONS } from "./sections/js.ts";
import { REACT_QUESTIONS } from "./sections/react.ts";
import { REDUX_QUESTIONS } from "./sections/redux.ts";
import { NATIVE_QUESTIONS } from "./sections/native.ts";
import { GRAPHQL_QUESTIONS } from "./sections/graphql.ts";
import { TS_QUESTIONS } from "./sections/ts.ts";
import { ENGINX_QUESTIONS } from "./sections/enginx.ts";
import { CLAUDE_QUESTIONS } from "./sections/claude.ts";

import type { Question } from "./types";

export const QUESTIONS: Question[] = [
  ...JS_QUESTIONS,
  ...REACT_QUESTIONS,
  ...REDUX_QUESTIONS,
  ...NATIVE_QUESTIONS,
  ...GRAPHQL_QUESTIONS,
  ...TS_QUESTIONS,
  ...ENGINX_QUESTIONS,
  ...CLAUDE_QUESTIONS,
];
