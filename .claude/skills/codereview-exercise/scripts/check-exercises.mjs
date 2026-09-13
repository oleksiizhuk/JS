#!/usr/bin/env node
// Проверка упражнений код-ревью: номера строк в issues попадают в code,
// в code нет обратных кавычек и ${, у упражнения и каждой issue есть en.
// Запуск из react-interview/:  node ../.claude/skills/codereview-exercise/scripts/check-exercises.mjs [id]
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const onlyId = process.argv[2];
const { EXERCISES } = await import(pathToFileURL(resolve("src/codereview/exercises.ts")).href);

const LEVELS = new Set(["easy", "medium", "hard"]);
const SEVERITIES = new Set(["blocker", "major", "nit"]);
const problems = [];
const ids = new Set();

for (const ex of EXERCISES) {
  if (onlyId && ex.id !== onlyId) continue;
  const tag = `[${ex.id}]`;
  const lineCount = ex.code.split("\n").length;

  if (ids.has(ex.id)) problems.push(`${tag} duplicate id`);
  ids.add(ex.id);
  if (!LEVELS.has(ex.level)) problems.push(`${tag} level must be easy|medium|hard`);
  if (ex.code.includes("`") || ex.code.includes("${"))
    problems.push(`${tag} code contains a backtick or \${ — breaks the template literal`);
  if (!ex.en?.title || !ex.en?.context) problems.push(`${tag} missing en.title / en.context`);
  if (!Array.isArray(ex.issues) || ex.issues.length < 2) problems.push(`${tag} needs >= 2 issues`);

  const marked = new Set();
  for (const [i, issue] of (ex.issues || []).entries()) {
    const itag = `${tag} issue #${i + 1} "${issue.title}"`;
    if (!SEVERITIES.has(issue.severity)) problems.push(`${itag} bad severity "${issue.severity}"`);
    if (!Array.isArray(issue.lines) || !issue.lines.length) problems.push(`${itag} has no lines`);
    for (const n of issue.lines || []) {
      if (!Number.isInteger(n) || n < 1 || n > lineCount)
        problems.push(`${itag} line ${n} is out of range 1..${lineCount}`);
      else if (ex.code.split("\n")[n - 1].trim() === "")
        problems.push(`${itag} line ${n} is blank — probably an off-by-one`);
      marked.add(n);
    }
    for (const f of ["title", "explain", "fix"]) {
      if (!issue[f]) problems.push(`${itag} missing ${f}`);
      if (!issue.en?.[f]) problems.push(`${itag} missing en.${f}`);
    }
  }
  // Sanity: a reviewer must have clean lines to be wrong about.
  if (marked.size >= lineCount - 1) problems.push(`${tag} almost every line is marked — no clean lines left`);
}

const checked = onlyId ? 1 : EXERCISES.length;
if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\n${problems.length} problem(s) in ${checked} exercise(s)`);
  process.exit(1);
}
console.log(`ok: ${checked} exercise(s)`);
