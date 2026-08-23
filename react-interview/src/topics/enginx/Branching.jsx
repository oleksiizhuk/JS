import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function Branching() {
  return (
    <>
      <InterviewQuestion en="Which branching strategies do you know? What would you pick for a team and why?">
        Какие стратегии ветвления знаешь? Что выберешь для команды и почему?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Three main models. <b>Git Flow</b> — long-lived develop + main,
            release and hotfix branches: heavy ceremony, fits products with
            <b> versioned releases</b> — mobile apps in stores, on-prem
            software. <b>GitHub Flow</b> — short-lived feature branches off
            main, PR with review and green CI, merge means deployable: the
            default for web teams. <b>Trunk-based</b> — everyone merges into
            main at least daily, branches live hours; it demands a strong CI
            gate and <b>feature flags</b> so unfinished work ships dark, and
            it's what actually enables continuous deployment. My choice logic:
            web with frequent deploys — GitHub Flow, moving to trunk-based as
            CI and flag culture matures; React Native — flow with release
            branches, because a store release is a real event you stabilize
            (plus OTA for JS fixes). Supporting conventions matter as much as
            the model: <b>conventional commits</b> give automated changelogs
            and semver, rebase for local cleanup but never rewriting shared
            history, squash-merge to keep main linear, and short-lived
            branches above all — merge hell grows with branch age."
          </>
        }
      >
        «Три основные модели. <b>Git Flow</b> — долгоживущие develop + main,
        release- и hotfix-ветки: тяжёлая церемония, подходит продуктам с
        <b> версионными релизами</b> — мобильные приложения в сторах, on-prem
        софт. <b>GitHub Flow</b> — короткие feature-ветки от main, PR с ревью
        и зелёным CI, смерджено = деплоябельно: дефолт для веб-команд.
        <b> Trunk-based</b> — все вливаются в main минимум раз в день, ветки
        живут часы; требует сильного CI-гейта и <b>feature-флагов</b>, чтобы
        недоделанное уезжало выключенным, и именно он делает возможным
        continuous deployment. Моя логика выбора: веб с частыми деплоями —
        GitHub Flow с движением к trunk-based по мере зрелости CI и культуры
        флагов; React Native — flow с release-ветками, потому что релиз в
        стор — реальное событие, которое стабилизируют (плюс OTA для
        JS-фиксов). Конвенции вокруг важны не меньше модели:
        <b> conventional commits</b> дают автоматический changelog и semver,
        rebase для локальной чистки, но никогда — переписывание общей истории,
        squash-merge для линейного main, и главное — короткоживущие ветки:
        merge hell растёт с возрастом ветки.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Три модели на одной схеме" en="Three models, side by side" /></h3>
        <CodeBlock
          ru={`Git Flow (версионные релизы):
main     ──●────────────●──────▶   только релизы (теги v1.0, v1.1)
release      ╲──●──●──╱            стабилизация перед релизом
develop  ──●──●──●──●──●──▶        интеграционная ветка
feature      ╲●──●╱                от develop, в develop

GitHub Flow (веб):
main     ──●──●──●──●──▶           всегда деплоябелен
feature     ╲●──●╱  PR+CI+review   ветки живут дни

Trunk-based (continuous deployment):
main     ●●●●●●●●●●▶               мерджи каждый день, мелкими порциями
             ↑ недоделанное — за feature-флагом, выключено в проде`}
          en={`Git Flow (versioned releases):
main     ──●────────────●──────▶   releases only (tags v1.0, v1.1)
release      ╲──●──●──╱            stabilization before release
develop  ──●──●──●──●──●──▶        integration branch
feature      ╲●──●╱                off develop, back into develop

GitHub Flow (web):
main     ──●──●──●──●──▶           always deployable
feature     ╲●──●╱  PR+CI+review   branches live for days

Trunk-based (continuous deployment):
main     ●●●●●●●●●●▶               merged daily, in small chunks
             ↑ unfinished work sits behind a feature flag, off in prod`}
        />
      </div>

      <div className="card">
        <h3><L ru="Конвенции вокруг веток" en="Conventions around branching" /></h3>
        <CodeBlock
          ru={`Conventional commits → автоматика:
  feat: add cart badge        → минорная версия, строка в changelog
  fix: cart count on delete   → патч
  feat!: new checkout API     → мажор (breaking)

Rebase vs merge:
  rebase СВОЮ локальную ветку на свежий main — чистая история     ✅
  rebase ОБЩЕЙ ветки (переписывание чужой истории)                ❌
  squash-merge PR → один осмысленный коммит в main                ✅

Feature-флаги — спутник trunk-based:
  if (flags.newCheckout) return <NewCheckout />;
  // код в проде, но выключен; включение — без деплоя; canary по 5% юзеров`}
          en={`Conventional commits → automation:
  feat: add cart badge        → minor version, a changelog line
  fix: cart count on delete   → patch
  feat!: new checkout API     → major (breaking)

Rebase vs merge:
  rebase YOUR OWN local branch onto fresh main — clean history      ✅
  rebase a SHARED branch (rewriting someone else's history)         ❌
  squash-merge a PR → one meaningful commit on main                 ✅

Feature flags — trunk-based's companion:
  if (flags.newCheckout) return <NewCheckout />;
  // code is in prod but off; enabling it needs no deploy; canary to 5% of users`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Ветка жила три недели",
            code: `git merge main
# CONFLICT (content): 47 files
# полдня разруливания, регрессии из-за неверных резолвов`,
            text: "Стоимость мерджа растёт нелинейно с возрастом ветки. Лечение: резать задачи мельче, вливать чаще, недоделанное прятать за флагом.",
            en: {
              title: "A branch lived for three weeks",
              code: `git merge main
# CONFLICT (content): 47 files
# half a day of untangling, regressions from bad resolutions`,
              text: "Merge cost grows nonlinearly with branch age. The cure: cut tasks smaller, merge more often, hide unfinished work behind a flag.",
            },
          },
          {
            title: "«Git Flow всем и всегда»",
            code: `// веб-команда, деплой 5 раз в день, и... develop, release-ветки,
// двойные мерджи каждого фикса (в develop И в main через release)`,
            text: "Git Flow создан для версионных релизов. Для continuous delivery его церемония — чистые накладные расходы. Выбор модели — от процесса релизов, а не «как привыкли».",
            en: {
              title: "“Git Flow for everyone, always”",
              code: `// a web team, deploying 5 times a day, and... develop, release branches,
// double merges for every fix (into develop AND into main via release)`,
              text: "Git Flow was built for versioned releases. For continuous delivery its ceremony is pure overhead. The model choice follows the release process, not habit.",
            },
          },
          {
            title: "force push в общую ветку",
            code: `git push --force origin main        # ❌ переписал историю коллег
git push --force-with-lease origin my-feature  # ✅ своя ветка + защита`,
            text: "Переписывать можно только то, что ещё никто не забрал. --force-with-lease откажется пушить, если удалёнка ушла вперёд. На main/develop — branch protection.",
            en: {
              title: "force push to a shared branch",
              code: `git push --force origin main        # ❌ rewrote teammates' history
git push --force-with-lease origin my-feature  # ✅ your own branch + protection`,
              text: "You can only rewrite what nobody else has pulled yet. --force-with-lease refuses to push if the remote has moved forward. main/develop should have branch protection.",
            },
          },
          {
            title: "Trunk-based без предпосылок",
            code: `// «переходим на trunk-based» при: CI 40 минут, флаки 10%,
// feature-флагов нет → в main постоянно едет сломанное`,
            text: "Trunk-based — не «просто мерджим в main»: он стоит на быстром надёжном CI и культуре флагов. Без них это хаос, а не стратегия.",
            en: {
              title: "Trunk-based without the prerequisites",
              code: `// "let's switch to trunk-based" while: CI takes 40 minutes, 10% flake rate,
// no feature flags → main is constantly shipping broken code`,
              text: "Trunk-based isn't “just merge into main”: it rests on fast, reliable CI and a flag culture. Without those it's chaos, not a strategy.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="Git Flow — версионные релизы (сторы), GitHub Flow — дефолт для веба, trunk-based — вершина зрелости (CI + флаги); ветки короткие, conventional commits, force только со своей веткой."
          en="Git Flow is for versioned releases (app stores), GitHub Flow is the web default, trunk-based is the maturity peak (CI + flags); keep branches short, use conventional commits, force-push only your own branch."
        />
      </div>
    </>
  );
}
