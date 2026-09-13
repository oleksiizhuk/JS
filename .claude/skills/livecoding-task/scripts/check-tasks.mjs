#!/usr/bin/env node
// Проверка задач live coding: эталонное решение обязано пройти свои же тесты,
// плюс структурные проверки (уникальный id, fnName, полный en).
// Запуск из react-interview/:  node ../.claude/skills/livecoding-task/scripts/check-tasks.mjs [id]
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const onlyId = process.argv[2];
const { TASKS } = await import(pathToFileURL(resolve("src/livecoding/tasks.ts")).href);

const LEVELS = new Set(["easy", "medium", "hard"]);
const EN_FIELDS = ["title", "brief", "description", "starter", "solution", "notes"];
const problems = [];
const ids = new Set();

// Tests may hand a rejected promise to a broken implementation (e.g. the empty
// starter) that never handles it; that must not crash the whole check.
process.on("unhandledRejection", () => {});

// A wrong implementation can leave a test waiting forever (a callback that is
// never called) — cap every test so the script always finishes.
const withTimeout = (promise, ms = 3000) => {
  let timer;
  const limit = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout ${ms}ms`)), ms);
  });
  return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
};

for (const task of TASKS) {
  if (onlyId && task.id !== onlyId) continue;
  const tag = `[${task.id}]`;

  if (ids.has(task.id)) problems.push(`${tag} duplicate id`);
  ids.add(task.id);
  if (!LEVELS.has(task.level)) problems.push(`${tag} level must be easy|medium|hard, got "${task.level}"`);
  if (!task.fnName) problems.push(`${tag} missing fnName`);
  if (!task.starter?.includes(task.fnName)) problems.push(`${tag} starter does not declare ${task.fnName}`);
  if (!task.solution?.includes(task.fnName)) problems.push(`${tag} solution does not declare ${task.fnName}`);
  if (!Array.isArray(task.tests) || task.tests.length < 3) problems.push(`${tag} needs >= 3 tests`);
  if (!task.en) problems.push(`${tag} missing en`);
  else for (const f of EN_FIELDS) if (!task.en[f]) problems.push(`${tag} missing en.${f}`);

  // Run the solution through its own tests — same way LiveCoding.jsx runs user code.
  let fn;
  try {
    fn = new Function(`${task.solution}\nreturn ${task.fnName};`)();
    if (typeof fn !== "function") throw new Error(`${task.fnName} is not a function`);
  } catch (e) {
    problems.push(`${tag} solution does not compile: ${e.message}`);
    continue;
  }
  for (const t of task.tests) {
    try {
      await withTimeout(t.run(fn));
    } catch (e) {
      problems.push(`${tag} solution FAILS its own test "${t.name}": ${e.message}`);
    }
  }
  // The starter must NOT pass every test — otherwise the task is trivial.
  try {
    const starterFn = new Function(`${task.starter}\nreturn ${task.fnName};`)();
    let passed = 0;
    for (const t of task.tests) {
      try { await withTimeout(t.run(starterFn), 500); passed++; } catch { /* expected */ }
    }
    if (passed === task.tests.length) problems.push(`${tag} the STARTER already passes all tests`);
  } catch { /* starter may not compile — fine */ }
}

const checked = onlyId ? 1 : TASKS.length;
if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\n${problems.length} problem(s) in ${checked} task(s)`);
  process.exit(1);
}
console.log(`ok: ${checked} task(s), all solutions pass their own tests`);
