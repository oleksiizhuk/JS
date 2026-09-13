import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function CiCd() {
  return (
    <>
      <InterviewQuestion en="CI/CD — explain the difference between the two CDs. What does your pipeline look like?">
        CI/CD — объясни разницу между двумя CD. Как выглядит твой пайплайн?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "<b>CI</b> — continuous integration: every push runs an automated
            gate — install, lint, types, tests, build — so integration
            problems surface in minutes, not at release time. Then two
            different CDs. <b>Continuous Delivery</b>: every green build is
            <b> ready</b> to deploy — packaged, versioned, deployable by
            pressing a button; the release moment stays a human decision.
            <b> Continuous Deployment</b> goes further: green main deploys to
            production <b>automatically</b>, no button at all. That difference
            is exactly what interviewers check. A typical web pipeline: PR —
            lint + tsc + tests + preview deploy; merge to main — build,
            e2e smoke, deploy to staging, then production via canary or
            blue-green with automatic rollback on error-rate spikes. For
            <b> React Native</b> it's different: you can't 'deploy' a binary —
            store review takes days, so the pipeline builds via EAS/Fastlane,
            ships to TestFlight/internal tracks, and JS-only fixes go through
            <b> OTA</b> (CodePush/EAS Update) instantly. Prerequisites that
            make any CD real: fast trustworthy tests, feature flags, and
            monitoring good enough to detect a bad release before users
            report it."
          </>
        }
      >
        «<b>CI</b> — continuous integration: каждый push проходит
        автоматический шлюз — install, lint, типы, тесты, сборка — чтобы
        проблемы интеграции всплывали за минуты, а не при релизе. Дальше два
        разных CD. <b>Continuous Delivery</b>: каждый зелёный билд
        <b> готов</b> к деплою — собран, версионирован, выкатывается нажатием
        кнопки; момент релиза остаётся решением человека. <b>Continuous
        Deployment</b> идёт дальше: зелёный main деплоится в прод
        <b> автоматически</b>, кнопки нет вообще. Именно эту разницу и
        проверяют. Типовой веб-пайплайн: PR — lint + tsc + тесты +
        preview-деплой; merge в main — сборка, e2e-смоук, staging, затем прод
        через canary или blue-green с автооткатом по скачку ошибок. Для
        <b> React Native</b> всё иначе: бинарник нельзя «задеплоить» — ревью
        стора занимает дни, поэтому пайплайн собирает через EAS/Fastlane,
        раскатывает в TestFlight/internal tracks, а JS-фиксы едут через
        <b> OTA</b> (CodePush/EAS Update) мгновенно. Предпосылки, делающие
        любой CD реальным: быстрые тесты, которым доверяют, feature-флаги и
        мониторинг, замечающий плохой релиз раньше пользователей.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="CI / Delivery / Deployment" en="CI / Delivery / Deployment" /></h3>
        <CodeBlock
          ru={`CI                     каждый push:  lint → типы → тесты → build
                       цель: интеграционные проблемы видны за минуты

Continuous Delivery    каждый зелёный билд ГОТОВ к продакшену
                       деплой = НАЖАТИЕ КНОПКИ (решает человек)

Continuous Deployment  зелёный main → прод АВТОМАТИЧЕСКИ
                       кнопки нет; требует флагов, canary, мониторинга

Мнемоника: Delivery доставляет ДО двери, Deployment заносит В дом.`}
          en={`CI                     every push:  lint → types → tests → build
                       goal: integration problems visible within minutes

Continuous Delivery    every green build is READY for production
                       deploy = PRESSING A BUTTON (a human decides)

Continuous Deployment  green main → production AUTOMATICALLY
                       no button; requires flags, canary, monitoring

Mnemonic: Delivery gets it TO the door, Deployment carries it IN.`}
        />
      </div>

      <div className="card">
        <h3><L ru="Пайплайн: веб vs React Native" en="Pipeline: web vs React Native" /></h3>
        <CodeBlock
          ru={`Веб (GitHub Actions, схематично):
on: pull_request  → install (кэш) → lint + tsc --noEmit → unit/integration
                  → build → preview-деплой (уникальный URL для ревью)
on: push to main  → всё то же + e2e smoke → staging
                  → prod: canary 5% → метрики ок? → 100% (иначе автооткат)

React Native:
PR                → lint + типы + тесты + сборка dev-клиента
merge             → EAS Build / Fastlane: подпись, номера версий
                  → TestFlight / Play internal track → QA
release           → отправка на ревью стора (дни!) → постепенный rollout
JS-фикс           → OTA (EAS Update / CodePush) — минуя стор, за минуты
                  ⚠️ OTA только для JS/ассетов; нативка — снова через стор`}
          en={`Web (GitHub Actions, schematic):
on: pull_request  → install (cache) → lint + tsc --noEmit → unit/integration
                  → build → preview deploy (a unique URL for review)
on: push to main  → same, plus e2e smoke → staging
                  → prod: canary 5% → metrics ok? → 100% (else auto-rollback)

React Native:
PR                → lint + types + tests + build a dev client
merge             → EAS Build / Fastlane: signing, version numbers
                  → TestFlight / Play internal track → QA
release           → submit for store review (days!) → gradual rollout
JS fix            → OTA (EAS Update / CodePush) — bypasses the store, minutes
                  ⚠️ OTA only covers JS/assets; native changes go through the store again`}
        />
      </div>

      <div className="card">
        <h3><L ru="Стратегии выката" en="Rollout strategies" /></h3>
        <CodeBlock
          ru={`blue-green   два прода: переключаем трафик разом; откат = переключить назад
canary       новая версия на 1-5% пользователей → метрики → расширяем
rolling      постепенная замена инстансов
feature flag выкат кода ≠ включение фичи: включаем без деплоя, по сегментам

Общий принцип: деплой должен быть СКУЧНЫМ — маленьким, частым, обратимым.
Редкий большой релиз = большой риск + страшный откат.

Build once, promote everywhere: артефакт собирается ОДИН раз и продвигается
dev → staging → prod без пересборки (различия — только конфиг/env).
Пересборка «под прод» = тестировали один бинарник, выкатили другой.

DORA-метрики — мера зрелости процесса:
  deployment frequency   как часто деплоим
  lead time for changes  коммит → прод
  change failure rate    доля деплоев с инцидентом
  MTTR                   время восстановления после сбоя
Элитные команды: деплой по требованию, lead time < день, MTTR < час.`}
          en={`blue-green   two prod environments: switch traffic at once; rollback = switch back
canary       the new version to 1-5% of users → check metrics → expand
rolling      gradually replacing instances
feature flag shipping code ≠ enabling a feature: turn it on without a deploy, by segment

General principle: deployment should be BORING — small, frequent, reversible.
A rare, big release = big risk + a scary rollback.

Build once, promote everywhere: an artifact is built ONCE and promoted
dev → staging → prod without rebuilding (only config/env differ).
Rebuilding "for prod" means you tested one binary and shipped a different one.

DORA metrics — a measure of process maturity:
  deployment frequency   how often you deploy
  lead time for changes  commit → production
  change failure rate    share of deploys causing an incident
  MTTR                   time to recover after a failure
Elite teams: deploy on demand, lead time < a day, MTTR < an hour.`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«У нас CD» — а какой из двух?",
            code: `// Спрашивают: «континиус деплоймент?»
// Отвечаешь: «делимся: delivery — кнопка есть, deployment — кнопки нет»`,
            text: "Смешение Delivery и Deployment — самый частый прокол по теме. Умение развести их одним предложением — маркер, что ты работал с процессом, а не читал аббревиатуру.",
            en: {
              title: "“We have CD” — but which of the two?",
              code: `// they ask: "continuous deployment?"
// you answer: "let's split it: delivery has a button, deployment doesn't"`,
              text: "Confusing Delivery and Deployment is the most common slip on this topic. Being able to separate them in one sentence signals you've actually worked with the process, not just read the acronym.",
            },
          },
          {
            title: "CI, которому не верят",
            code: `// пайплайн 35 минут, флаки 8% →
// «прогони ещё раз», мерджи без зелёного, красный main неделю`,
            text: "Скорость и стабильность CI — продуктовые требования: медленный или флакующий шлюз люди начинают обходить, и он перестаёт защищать. Бюджет: ~10 минут на PR-гейт.",
            en: {
              title: "CI nobody trusts",
              code: `// a 35-minute pipeline, 8% flake rate →
// "just rerun it", merges without green, a red main for a week`,
              text: "CI speed and stability are product requirements: a slow or flaky gate gets worked around by people, and it stops protecting anything. Budget: about 10 minutes for the PR gate.",
            },
          },
          {
            title: "Секреты в пайплайне",
            code: `ENV API_KEY=sk-live-...        # ❌ в Dockerfile/репозитории
echo \${{ secrets.KEY }}        # ❌ утёк в логи CI
// ✅ secret-хранилище CI, маскирование, OIDC вместо долгоживущих ключей`,
            text: "Практический вопрос безопасности пайплайна: секреты — только через механизм секретов CI, ротация, минимальные права токенов.",
            en: {
              title: "Secrets inside the pipeline",
              code: `ENV API_KEY=sk-live-...        # ❌ in a Dockerfile/repo
echo \${{ secrets.KEY }}        # ❌ leaked into CI logs
// ✅ CI's secret store, masking, OIDC instead of long-lived keys`,
              text: "A practical pipeline-security question: secrets only go through CI's secrets mechanism, with rotation and minimal token permissions.",
            },
          },
          {
            title: "RN: «зачем стор, если есть OTA?»",
            code: `// OTA обновляет ТОЛЬКО JS-бандл и ассеты
// новая нативная зависимость / permissions / SDK → полный релиз
// + правила сторов ограничивают, ЧТО можно менять по OTA`,
            text: "Проверка знания мобильной специфики: OTA — канал для фиксов, а не замена релизного цикла. Несовместимость нативной части и OTA-бандла — источник крашей.",
            en: {
              title: "RN: “why bother with the store if we have OTA?”",
              code: `// OTA only updates the JS bundle and assets
// a new native dependency / permissions / SDK → a full release is needed
// + store policies restrict WHAT can be changed via OTA`,
              text: "A check on mobile-specific knowledge: OTA is a channel for fixes, not a replacement for the release cycle. A mismatch between the native side and the OTA bundle is a common source of crashes.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="CI — автоматический шлюз на каждый push; Delivery — зелёный билд готов, деплой кнопкой; Deployment — прод автоматически; выкат через canary/blue-green + флаги; RN — EAS/Fastlane в сторы, OTA только для JS."
          en="CI is an automated gate on every push; Delivery means every green build is ready, deploy by button; Deployment means production automatically; rollout via canary/blue-green + flags; RN ships to stores via EAS/Fastlane, OTA covers JS only."
        />
      </div>
    </>
  );
}
