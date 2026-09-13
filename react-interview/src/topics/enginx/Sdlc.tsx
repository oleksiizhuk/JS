import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function Sdlc() {
  return (
    <>
      <InterviewQuestion en="Walk me through the SDLC. How does it map to how your team actually works?">
        Расскажи про SDLC. Как он ложится на реальную работу твоей команды?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "SDLC — software development life cycle — is the set of phases any
            change goes through: <b>requirements → design → implementation →
            testing → deployment → maintenance</b>. The phases are constant;
            methodologies differ in how you traverse them. <b>Waterfall</b> —
            strictly once and sequentially: works when requirements are truly
            fixed (contracts, regulated domains), fails where they evolve.
            <b> Agile</b> traverses all phases in <b>short iterations</b>:
            in Scrum — sprints with planning, daily, review and retro, roles
            of PO and scrum master; in <b>Kanban</b> — continuous flow with
            WIP limits, better for support and stream-like work. How it looks
            for me as a developer per ticket: refine the requirement (and push
            back with questions — the cheapest place to catch a mistake is
            before code), design — API contract, component breakdown, edge
            cases; implement in a short-lived branch; tests at the levels from
            the pyramid; PR review and green CI as the quality gate; deploy
            via the pipeline with flags; then maintenance — monitoring,
            Sentry, and the feedback loop back into the backlog. Definition
            of Done for us includes tests, review, docs updated and the flag
            plan — not just 'code merged'."
          </>
        }
      >
        «SDLC — жизненный цикл разработки ПО — это набор фаз, через которые
        проходит любое изменение: <b>требования → проектирование → реализация
        → тестирование → развёртывание → сопровождение</b>. Фазы постоянны;
        методологии различаются тем, как их проходят. <b>Waterfall</b> —
        строго один раз и последовательно: работает при действительно
        зафиксированных требованиях (контракты, регулируемые области), ломается
        там, где они уточняются. <b>Agile</b> проходит все фазы <b>короткими
        итерациями</b>: в Scrum — спринты с планированием, дейли, ревью и
        ретро, роли PO и скрам-мастера; в <b>Kanban</b> — непрерывный поток с
        WIP-лимитами, лучше для саппорта и поточных задач. Как это выглядит
        для меня как разработчика на каждой задаче: уточнить требование (и
        задавать вопросы — дешевле всего поймать ошибку до кода);
        спроектировать — контракт API, разбивка на компоненты, edge cases;
        реализовать в короткоживущей ветке; тесты по уровням пирамиды; PR-ревью
        и зелёный CI как шлюз качества; деплой через пайплайн с флагами; и
        сопровождение — мониторинг, Sentry, обратная связь в бэклог.
        Definition of Done у нас включает тесты, ревью, обновлённую доку и
        план по флагу — а не просто "код смержен".»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Фазы и артефакты" en="Phases and artifacts" /></h3>
        <CodeBlock
          ru={`Фаза              Что происходит                Артефакт
Requirements      что и зачем строим            user story + критерии приёмки
Design            как строим                    API-контракт, схема компонентов,
                                                тех-решение (ADR), макеты
Implementation    код в короткой ветке          PR
Testing           уровни пирамиды + QA          зелёный CI, отчёт QA
Deployment        пайплайн, флаги, canary       релиз/версия
Maintenance       мониторинг, фиксы, техдолг    инциденты → бэклог

Ключевая экономика: цена ошибки растёт на порядок с каждой фазой.
Кривой контракт API, пойманный на design, — 30 минут разговора;
он же в проде — миграция данных и хотфиксы.`}
          en={`Phase             What happens                  Artifact
Requirements      what & why we're building     user story + acceptance criteria
Design            how we're building it         API contract, component diagram,
                                                tech solution (ADR), mockups
Implementation    code in a short-lived branch  PR
Testing           pyramid levels + QA           green CI, QA report
Deployment        pipeline, flags, canary       release/version
Maintenance       monitoring, fixes, tech debt  incidents → backlog

Key economics: the cost of a mistake grows by an order of magnitude with each phase.
A bad API contract caught at design — a 30-minute conversation;
the same one in production — a data migration and hotfixes.`}
        />
      </div>

      <div className="card">
        <h3><L ru="Waterfall vs Scrum vs Kanban" en="Waterfall vs Scrum vs Kanban" /></h3>
        <CodeBlock
          ru={`Waterfall: Requirements → Design → Build → Test → Deploy (один проход)
  + предсказуемость, фикс-контракты   − обратная связь в самом конце

Scrum: [спринт 1-2 нед: план → работа+дейли → review → retro] × N
  роли: Product Owner (что), команда (как), Scrum Master (процесс)
  оценки: story points, velocity — для планирования, не для KPI
  + ритм, регулярная обратная связь   − церемонии могут стать карго-культом

Kanban: непрерывный поток, доска, WIP-лимиты («не больше 3 In Progress»)
  метрики: lead time / cycle time
  + гибкость, нет искусственных рамок − нужна дисциплина лимитов

На практике у большинства команд гибрид: спринты + доска + непрерывный деплой.`}
          en={`Waterfall: Requirements → Design → Build → Test → Deploy (one pass)
  + predictability, fixed contracts   − feedback only at the very end

Scrum: [1-2 week sprint: plan → work+daily → review → retro] × N
  roles: Product Owner (what), team (how), Scrum Master (process)
  estimates: story points, velocity — for planning, not for KPIs

  + rhythm, regular feedback   − ceremonies can become cargo cult

Kanban: continuous flow, a board, WIP limits ("no more than 3 In Progress")
  metrics: lead time / cycle time
  + flexibility, no artificial structure   − requires limit discipline

In practice most teams run a hybrid: sprints + a board + continuous deployment.`}
        />
      </div>

      <div className="card">
        <h3><L ru="Где в SDLC живут остальные темы секции" en="Where the other topics in this section fit into the SDLC" /></h3>
        <CodeBlock
          ru={`Requirements   ← вопросы разработчика, edge cases (самая дешёвая фаза!)
Design         ← паттерны, API-контракты, ADR
Implementation ← branching-стратегии, static analysis, антипаттерны на ревью
Testing        ← пирамида тестирования
Deployment     ← CI/CD, feature-флаги, canary
Maintenance    ← мониторинг (Sentry), OWASP, работа с техдолгом

SDLC — рамка, в которую вкладываются все инженерные практики.`}
          en={`Requirements   ← developer questions, edge cases (the cheapest phase!)
Design         ← patterns, API contracts, ADR
Implementation ← branching strategies, static analysis, antipatterns in review
Testing        ← testing pyramid
Deployment     ← CI/CD, feature flags, canary
Maintenance    ← monitoring (Sentry), OWASP, working off tech debt

The SDLC is the frame every engineering practice nests inside.`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Agile — это когда без документации и планов»",
            code: `// Манифест: «работающий продукт ВАЖНЕЕ исчерпывающей документации»
// важнее ≠ вместо: контракты API, ADR и критерии приёмки — пишутся`,
            text: "Классическое передёргивание манифеста. Agile убирает документы, которые никто не читает, а не проектирование как таковое.",
            en: {
              title: "“Agile means no documentation and no planning”",
              code: `// Manifesto: "working software over comprehensive documentation"
// over ≠ instead of: API contracts, ADRs and acceptance criteria still get written`,
              text: "A classic misreading of the manifesto. Agile drops documents nobody reads, not design work itself.",
            },
          },
          {
            title: "«Разработчик подключается на фазе Implementation»",
            code: `// три вопроса на refinement:
// «что при пустом списке?», «а если запрос упал?», «это же ломает офлайн?»
// — дешевле, чем неделя переделок после QA`,
            text: "Senior-маркер: участие в requirements/design — где ошибки стоят копейки. «Мне дали таску — я кодирую» звучит как mid-.",
            en: {
              title: "“A developer joins at the Implementation phase”",
              code: `// three questions during refinement:
// "what about an empty list?", "what if the request fails?", "doesn't this break offline?"
// — cheaper than a week of rework after QA`,
              text: "A senior marker: engagement in requirements/design, where mistakes cost pennies. “I got a ticket, I code it” reads as mid-level.",
            },
          },
          {
            title: "Story points превратили в KPI",
            code: `// «команда А делает 40 поинтов, команда Б — 25, Б работает хуже»
// → инфляция оценок, поинты теряют смысл за квартал`,
            text: "Поинты — внутренняя валюта команды для планирования ёмкости, несравнимая между командами. Сравнение и таргеты убивают их калибровку.",
            en: {
              title: "Story points turned into a KPI",
              code: `// "team A does 40 points, team B does 25, so B is underperforming"
// → estimate inflation, points lose meaning within a quarter`,
              text: "Points are a team's internal currency for capacity planning — not comparable across teams. Comparing them or targeting them destroys their calibration.",
            },
          },
          {
            title: "Definition of Done = «код смержен»",
            code: `DoD здоровой команды:
✓ критерии приёмки выполнены   ✓ тесты написаны и зелёные
✓ ревью пройдено               ✓ фича за флагом / раскатана
✓ мониторинг не покраснел      ✓ документация/чейнджлог обновлены`,
            text: "«Готово» без тестов и мониторинга — это «готово наполовину», долг копится молча. DoD — общий контракт, а не формальность.",
            en: {
              title: "Definition of Done = “code is merged”",
              code: `A healthy team's DoD:
✓ acceptance criteria met      ✓ tests written and green
✓ review passed                ✓ feature is flagged / rolled out
✓ monitoring stays clean       ✓ docs/changelog updated`,
              text: "“Done” without tests and monitoring is “half done” — debt piles up silently. DoD is a shared contract, not a formality.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="SDLC = требования → дизайн → код → тесты → деплой → сопровождение; методологии (waterfall/Scrum/Kanban) — способ обхода фаз; цена ошибки растёт по фазам, поэтому senior вкладывается в первые две."
          en="SDLC = requirements → design → code → tests → deploy → maintenance; methodologies (waterfall/Scrum/Kanban) are ways to traverse the phases; the cost of a mistake grows with each phase, so a senior invests in the first two."
        />
      </div>
    </>
  );
}
