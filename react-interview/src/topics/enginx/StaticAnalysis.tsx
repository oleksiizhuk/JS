import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function StaticAnalysis() {
  return (
    <>
      <InterviewQuestion en="Which static analysis tools do you use and what does each one catch?">
        Какие инструменты статического анализа используешь и что ловит каждый?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Static analysis is everything that finds problems <b>without
            running the code</b>, and I stack several layers. <b>TypeScript</b>
            — the strongest one: type errors, null-safety, dead branches.
            <b> ESLint</b> — rules about code correctness and patterns:
            unused vars, react-hooks/exhaustive-deps catching stale closures,
            a11y plugins; modern setups use typescript-eslint with
            type-aware rules. <b>Prettier</b> — formatting only, and it's
            deliberately separated: style debates disappear from reviews.
            The layers run at three moments: in the <b>editor</b> as you type,
            on <b>pre-commit</b> via husky + lint-staged — only staged files,
            so it's fast — and in <b>CI</b> as the source of truth, because
            local hooks can be skipped. On top: <b>knip</b> finds dead code
            and unused exports/dependencies, <b>npm audit</b> and Dependabot
            watch vulnerable packages, SonarQube-style tools track complexity
            and duplication. The principle: every class of bug that can be
            caught by a machine before review should be — reviewers' time is
            for architecture, not for missing semicolons."
          </>
        }
      >
        «Статический анализ — всё, что находит проблемы <b>без запуска
        кода</b>, и я собираю несколько слоёв. <b>TypeScript</b> — самый
        сильный: ошибки типов, null-safety, мёртвые ветки. <b>ESLint</b> —
        правила о корректности и паттернах: неиспользуемые переменные,
        react-hooks/exhaustive-deps, ловящий stale closures, a11y-плагины; в
        современных конфигах — typescript-eslint с type-aware правилами.
        <b> Prettier</b> — только форматирование, и он отделён намеренно:
        споры о стиле исчезают из ревью. Слои работают в три момента: в
        <b> редакторе</b> при наборе, на <b>pre-commit</b> через husky +
        lint-staged — только по staged-файлам, поэтому быстро — и в <b>CI</b>
        как источник правды, потому что локальные хуки можно обойти. Сверху:
        <b> knip</b> находит мёртвый код и неиспользуемые экспорты/зависимости,
        <b> npm audit</b> и Dependabot следят за уязвимыми пакетами,
        инструменты класса SonarQube — за сложностью и дублированием. Принцип:
        всё, что машина может поймать до ревью, должна ловить машина — время
        ревьюера тратится на архитектуру, а не на пропущенные точки с
        запятой.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Слои и что кто ловит" en="Layers and what each one catches" /></h3>
        <CodeBlock
          ru={`TypeScript   user.nmae          → опечатка в поле, null-доступ, мёртвый код
ESLint       useEffect(...,[])  → exhaustive-deps: забытая зависимость
             let x = 5 (не исп.) → no-unused-vars
             <img> без alt      → jsx-a11y/alt-text
Prettier     форматирование     → ширина строк, кавычки, запятые (НЕ ошибки!)
knip         export unusedFn    → мёртвые экспорты, лишние зависимости
npm audit    lodash@4.17.15     → известные CVE в зависимостях

Правило разделения: Prettier — КАК выглядит, ESLint — ЧТО написано.
eslint-config-prettier отключает стилевые правила ESLint, чтобы не воевали.`}
          en={`TypeScript   user.nmae          → a field typo, null access, dead code
ESLint       useEffect(...,[])  → exhaustive-deps: a forgotten dependency
             let x = 5 (unused) → no-unused-vars
             <img> without alt  → jsx-a11y/alt-text
Prettier     formatting         → line width, quotes, commas (NOT errors!)
knip         export unusedFn    → dead exports, unused dependencies
npm audit    lodash@4.17.15     → known CVEs in dependencies

The dividing line: Prettier is HOW it looks, ESLint is WHAT is written.
eslint-config-prettier disables ESLint's style rules so they don't fight.`}
        />
      </div>

      <div className="card">
        <h3><L ru="Три рубежа запуска" en="Three enforcement points" /></h3>
        <CodeBlock
          ru={`1. Редактор     мгновенная обратная связь (расширения VS Code/WebStorm)

2. Pre-commit   husky + lint-staged: проверяем ТОЛЬКО staged-файлы
   // package.json
   "lint-staged": {
     "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
   }

3. CI (источник правды — хуки можно обойти через --no-verify)
   - run: npm run lint && npx tsc --noEmit && npm test
   //     ↑ tsc --noEmit: проверить типы без сборки`}
          en={`1. Editor       instant feedback (VS Code/WebStorm extensions)

2. Pre-commit   husky + lint-staged: check ONLY staged files
   // package.json
   "lint-staged": {
     "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
   }

3. CI (the source of truth — hooks can be bypassed with --no-verify)
   - run: npm run lint && npx tsc --noEmit && npm test
   //     ↑ tsc --noEmit: type-check without building`}
        />
      </div>

      <div className="card">
        <h3><L ru="Состояние инструментов (2025+)" en="State of the tooling (2025+)" /></h3>
        <CodeBlock
          ru={`ESLint 9: flat config — дефолт. Один eslint.config.js вместо каскада
.eslintrc + extends; конфиг — обычный JS-массив объектов:

// eslint.config.js
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
export default [
  js.configs.recommended,
  { files: ["**/*.{ts,tsx}"], plugins: { "react-hooks": reactHooks },
    rules: { "react-hooks/exhaustive-deps": "error" } },
];

Biome — растущая альтернатива связке ESLint+Prettier: один инструмент
на Rust (линт + формат), на порядок быстрее; покрытие правил уже — для
больших легаси с кастомными плагинами пока чаще остаётся ESLint.`}
          en={`ESLint 9: flat config is the default now. A single eslint.config.js
instead of a cascade of .eslintrc + extends; the config is a plain JS
array of objects:

// eslint.config.js
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
export default [
  js.configs.recommended,
  { files: ["**/*.{ts,tsx}"], plugins: { "react-hooks": reactHooks },
    rules: { "react-hooks/exhaustive-deps": "error" } },
];

Biome — a growing alternative to the ESLint+Prettier combo: one Rust-based
tool (lint + format), an order of magnitude faster; rule coverage is
narrower still — large legacy codebases with custom plugins tend to stay
on ESLint for now.`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "eslint-disable без причины",
            code: `// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { sync(user); }, []);   // ← спрятали stale closure`,
            text: "Каждый disable — потенциальный закопанный баг. Правило команды: disable только с комментарием-обоснованием; массовые disable — сигнал, что правило либо чинит реальные баги, либо его надо выключить глобально.",
            en: {
              title: "eslint-disable with no reason",
              code: `// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { sync(user); }, []);   // ← a stale closure is hiding here`,
              text: "Every disable is a potential buried bug. Team rule: disable only with a justifying comment; mass disables signal the rule is either catching real bugs or needs to be turned off globally.",
            },
          },
          {
            title: "«Prettier — это линтер»",
            code: `Prettier: форматирует (кавычки, отступы) — мнений не имеет
ESLint:   находит ПРОБЛЕМЫ (неиспользуемое, deps, a11y)
// конфликт стилевых правил решает eslint-config-prettier`,
            text: "Путаница инструментов — маркер поверхностного опыта. Форматирование не бывает «ошибкой», оно либо автоматом применено, либо нет.",
            en: {
              title: "“Prettier is a linter”",
              code: `Prettier: formats (quotes, indentation) — has no opinions on correctness
ESLint:   finds PROBLEMS (unused code, deps, a11y)
// style-rule conflicts are resolved by eslint-config-prettier`,
              text: "Mixing up the tools is a sign of shallow experience. Formatting is never an “error” — it's either auto-applied or it isn't.",
            },
          },
          {
            title: "Хуки есть, а CI-проверки нет",
            code: `git commit --no-verify   // и все pre-commit проверки мимо
// или коллега без husky-установки`,
            text: "Локальные хуки — удобство, не гарантия. Источник правды всегда CI: те же команды обязаны бежать на каждый PR.",
            en: {
              title: "Hooks exist, but there's no CI check",
              code: `git commit --no-verify   // skips every pre-commit check
// or a teammate simply hasn't installed husky`,
              text: "Local hooks are a convenience, not a guarantee. The source of truth is always CI: the same commands must run on every PR.",
            },
          },
          {
            title: "Предупреждения копятся до бесполезности",
            code: `✖ 2431 problems (12 errors, 2419 warnings)
// warnings никто не читает уже полгода`,
            text: "Warning-и работают только около нуля. Стратегии: --max-warnings 0 в CI, или правила либо error, либо off. Легаси — гасить прогрессивно (bulk-suppressions).",
            en: {
              title: "Warnings pile up until they're useless",
              code: `✖ 2431 problems (12 errors, 2419 warnings)
// nobody has read the warnings in six months`,
              text: "Warnings only work near zero. Strategies: --max-warnings 0 in CI, or every rule is either error or off. For legacy code, suppress progressively (bulk suppressions).",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="TypeScript + ESLint (проблемы) + Prettier (формат, отдельно) на трёх рубежах — редактор, pre-commit (lint-staged), CI как источник правды; disable только с обоснованием."
          en="TypeScript + ESLint (problems) + Prettier (formatting, kept separate) enforced at three points — editor, pre-commit (lint-staged), and CI as the source of truth; disable only with a justification."
        />
      </div>
    </>
  );
}
