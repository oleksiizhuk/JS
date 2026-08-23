// Банк вопросов квиза. Разбит по секциям — файлы в ./sections/.
// Порядок здесь = порядок тем в квизе: JS → React → Redux → Native → GraphQL → TS.
// Формат вопроса и правила написания — скилл .claude/skills/quiz-questions/SKILL.md

import { JS_QUESTIONS } from "./sections/js.js";
import { REACT_QUESTIONS } from "./sections/react.js";
import { REDUX_QUESTIONS } from "./sections/redux.js";
import { NATIVE_QUESTIONS } from "./sections/native.js";
import { GRAPHQL_QUESTIONS } from "./sections/graphql.js";
import { TS_QUESTIONS } from "./sections/ts.js";
import { ENGINX_QUESTIONS } from "./sections/enginx.js";
import { CLAUDE_QUESTIONS } from "./sections/claude.js";

export const QUESTIONS = [
  ...JS_QUESTIONS,
  ...REACT_QUESTIONS,
  ...REDUX_QUESTIONS,
  ...NATIVE_QUESTIONS,
  ...GRAPHQL_QUESTIONS,
  ...TS_QUESTIONS,
  ...ENGINX_QUESTIONS,
  ...CLAUDE_QUESTIONS,
];
