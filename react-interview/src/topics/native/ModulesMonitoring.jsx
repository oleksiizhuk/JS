import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function ModulesMonitoring() {
  return (
    <>
      <InterviewQuestion en="What are Native Modules and when do you need them? How do you monitor an RN app in production?">
        Что такое Native Modules и когда они нужны? Как мониторишь RN-приложение в проде?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "A native module is platform code — Swift/Objective-C or
            Kotlin/Java — exposed to JS. You need one when there's no JS API:
            Bluetooth, HealthKit, a vendor SDK, heavy crypto, background
            tasks. In the old architecture modules went through the bridge; in
            the new one they're <b>TurboModules</b> — lazy-loaded, typed via
            codegen, callable through JSI without serialization; native UI
            components go through <b>Fabric</b> the same way. In practice I
            first look for a community module, then Expo Modules API as the
            easiest way to write my own. <b>Monitoring</b>: crashes and JS
            errors — Sentry or Crashlytics (with source maps so stacks are
            readable, plus an ErrorBoundary at the root); performance — TTI,
            JS thread FPS vs UI thread FPS, ANR on Android; product
            analytics — Amplitude/Firebase; OTA updates via CodePush/EAS
            Update; dev-time debugging — React Native DevTools."
          </>
        }
      >
        «Нативный модуль — платформенный код (Swift/Objective-C или
        Kotlin/Java), выставленный в JS. Нужен, когда нет JS API: Bluetooth,
        HealthKit, вендорский SDK, тяжёлая криптография, фоновые задачи.
        В старой архитектуре модули ходили через bridge; в новой это
        <b> TurboModules</b> — грузятся лениво, типизируются codegen-ом,
        вызываются через JSI без сериализации; нативные UI-компоненты так же
        идут через <b>Fabric</b>. На практике сначала ищу community-модуль,
        потом Expo Modules API как самый простой способ написать свой.
        <b> Мониторинг</b>: краши и JS-ошибки — Sentry или Crashlytics
        (с source maps, чтобы стеки читались, плюс ErrorBoundary в корне);
        производительность — TTI, FPS JS-потока vs UI-потока, ANR на Android;
        продуктовая аналитика — Amplitude/Firebase; OTA-обновления —
        CodePush/EAS Update; отладка в dev — React Native DevTools.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="TurboModule: минимальный контур" en="TurboModule: the minimal shape" /></h3>
        <CodeBlock
          ru={`// spec (TypeScript) → codegen генерирует биндинги
export interface Spec extends TurboModule {
  getBatteryLevel(): Promise<number>;
}
export default TurboModuleRegistry.get<Spec>("BatteryModule");

// Kotlin:
class BatteryModule(ctx: ReactApplicationContext) :
  NativeBatteryModuleSpec(ctx) {
  override fun getBatteryLevel(promise: Promise) {
    promise.resolve(getBattery(ctx))
  }
}

// JS: const level = await BatteryModule.getBatteryLevel();`}
          en={`// spec (TypeScript) → codegen generates the bindings
export interface Spec extends TurboModule {
  getBatteryLevel(): Promise<number>;
}
export default TurboModuleRegistry.get<Spec>("BatteryModule");

// Kotlin:
class BatteryModule(ctx: ReactApplicationContext) :
  NativeBatteryModuleSpec(ctx) {
  override fun getBatteryLevel(promise: Promise) {
    promise.resolve(getBattery(ctx))
  }
}

// JS: const level = await BatteryModule.getBatteryLevel();`}
        />
      </div>

      <div className="card">
        <h3><L ru="Мониторинг: чем и что мерить" en="Monitoring: tools and metrics" /></h3>
        <CodeBlock
          ru={`Краши/ошибки   Sentry / Crashlytics (+ source maps, ErrorBoundary в корне)
Перформанс     TTI, JS FPS vs UI FPS, ANR (Android), memory; Perf Monitor в dev
Аналитика      Amplitude / Firebase Analytics
OTA            CodePush / EAS Update — JS-фиксы без релиза в сторы
Логи/сеть      Sentry breadcrumbs, Reactotron/DevTools в dev`}
          en={`Crashes/errors  Sentry / Crashlytics (+ source maps, ErrorBoundary at the root)
Performance     TTI, JS FPS vs UI FPS, ANR (Android), memory; Perf Monitor in dev
Analytics       Amplitude / Firebase Analytics
OTA             CodePush / EAS Update — JS fixes without a store release
Logs/network    Sentry breadcrumbs, Reactotron/DevTools in dev`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«JS FPS 60, а приложение лагает» (и наоборот)",
            code: `// Два потока — два FPS:
// лагает UI-поток → тяжёлые нативные вью, оверлеи, тени
// лагает JS-поток → рендеры, JSON.parse, тяжёлые вычисления`,
            text: "Проверяют, знаешь ли ты, что смотреть НАДО оба графика: диагноз определяет лечение (Reanimated/мемоизация/InteractionManager).",
            en: {
              title: "\"JS FPS is 60 but the app still lags\" (and vice versa)",
              code: `// Two threads — two FPS graphs:
// UI thread lags → heavy native views, overlays, shadows
// JS thread lags → renders, JSON.parse, heavy computation`,
              text: "Tests whether you know you need to watch BOTH graphs: the diagnosis determines the fix (Reanimated/memoization/InteractionManager).",
            },
          },
          {
            title: "Стектрейсы в проде нечитаемы",
            code: `// минифицированный Hermes-байткод → мусор в краш-репортах
// фикс: загружать source maps в Sentry при каждом релизе (CI)`,
            text: "Маркер реального прод-опыта: без source maps мониторинг бесполезен.",
            en: {
              title: "Stack traces in production are unreadable",
              code: `// minified Hermes bytecode → garbage in crash reports
// fix: upload source maps to Sentry on every release (CI)`,
              text: "A marker of real production experience: without source maps, monitoring is useless.",
            },
          },
          {
            title: "«Что можно выкатить через OTA?»",
            code: `// CodePush/EAS Update: ТОЛЬКО JS-бандл и ассеты
// изменил нативный код/зависимость → полноценный релиз в сторы`,
            text: "Классика: OTA не обновляет нативную часть. Плюс сторы ограничивают, ЧТО можно менять по OTA.",
            en: {
              title: "\"What can you ship via OTA?\"",
              code: `// CodePush/EAS Update: ONLY the JS bundle and assets
// changed native code/dependency → needs a full store release`,
              text: "Classic gotcha: OTA doesn't update the native side. Plus the app stores restrict WHAT can be changed via OTA.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="нативные модули — когда нет JS API (теперь TurboModules через JSI); мониторинг — Sentry + source maps, два FPS (JS/UI), TTI, OTA только для JS."
          en="native modules — when there's no JS API (now TurboModules via JSI); monitoring — Sentry + source maps, two FPS graphs (JS/UI), TTI, OTA for JS only."
        />
      </div>
    </>
  );
}
