import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function CodeReviewTopic() {
  return (
    <>
      <InterviewQuestion en="How do you approach code review? What do you look for and how do you communicate findings?">
        Как подходишь к код-ревью? Что проверяешь и как сообщаешь о находках?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "I review in <b>priority order</b>, not line by line. First —
            does it <b>work</b>: correctness, edge cases (empty, null, error
            paths), race conditions, security. Second — <b>design</b>: does
            the change fit the architecture, right layer, no wrong
            abstraction. Third — <b>performance</b> where it matters, and
            <b> tests</b>: do they cover the behavior, not implementation.
            Style and formatting I don't review at all — that's the linter's
            job; a human arguing about commas is wasted review budget.
            Communication matters as much as findings: comments are about
            <b> code, not the author</b>; questions over commands — 'what
            happens if the list is empty?' teaches more than 'rewrite this';
            I mark severity explicitly — <b>blocker</b> vs <b>nit:</b> — so
            the author knows what must change versus what's optional; and I
            say what's good too. As an author I make review possible: small
            PRs, self-review first, context in the description. The goal of
            review is a shared one: <b>catch bugs and spread knowledge</b>,
            not win an argument."
          </>
        }
      >
        «Ревью я делаю <b>по приоритетам</b>, а не построчно. Сначала —
        <b> работает ли</b>: корректность, краевые случаи (пусто, null,
        ошибки), гонки, безопасность. Потом — <b>дизайн</b>: вписывается ли
        изменение в архитектуру, тот ли слой, нет ли неправильной абстракции.
        Дальше — <b>производительность</b> там, где она важна, и <b>тесты</b>:
        покрывают ли они поведение, а не реализацию. Стиль и форматирование
        не ревьюю вообще — это работа линтера; человек, спорящий о запятых, —
        потраченный бюджет ревью. Коммуникация важна не меньше находок:
        комментарии — про <b>код, а не про автора</b>; вопросы вместо
        команд — «а что будет с пустым списком?» учит лучше, чем «перепиши»;
        явно помечаю серьёзность — <b>blocker</b> против <b>nit:</b> — чтобы
        автор знал, что обязательно, а что опционально; и хорошее тоже
        отмечаю. Как автор я делаю ревью возможным: маленькие PR,
        self-review перед отправкой, контекст в описании. Цель ревью общая:
        <b> поймать баги и распространить знание</b>, а не выиграть спор.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Порядок проверки (и почему именно такой)" en="Review order (and why this order)" /></h3>
        <CodeBlock
          ru={`1. КОРРЕКТНОСТЬ И БЕЗОПАСНОСТЬ (блокеры)
   краевые случаи: пусто / null / ошибка сети / гонки / двойной клик
   мутации state, stale closures, утечки (подписки без отписки)
   XSS, секреты в коде, невалидированный ввод

2. ДИЗАЙН (важное)
   тот ли слой? (запрос в компоненте vs api-слой)
   не создаёт ли wrong abstraction / дублирование
   обратная совместимость, миграции

3. ПРОИЗВОДИТЕЛЬНОСТЬ (где реально важно)
   N+1, лишние ре-рендеры у ГОРЯЧИХ путей, размер бандла
   ⚠️ не гонять автора за микрооптимизациями без замеров

4. ТЕСТЫ
   есть ли на новое поведение? тестируют поведение, а не реализацию?

5. ЧИТАЕМОСТЬ (nit)
   имена, мёртвый код, комментарии-«что» вместо «почему»

0. СТИЛЬ — НЕ РЕВЬЮИТСЯ ЛЮДЬМИ. Prettier/ESLint в CI. Точка.`}
          en={`1. CORRECTNESS AND SECURITY (blockers)
   edge cases: empty / null / network error / races / double click
   state mutations, stale closures, leaks (subscriptions without cleanup)
   XSS, secrets in code, unvalidated input

2. DESIGN (important)
   is this the right layer? (a request inside a component vs the api layer)
   does it create a wrong abstraction / duplication?
   backward compatibility, migrations

3. PERFORMANCE (where it genuinely matters)
   N+1, extra re-renders on HOT paths, bundle size
   ⚠️ don't chase the author over micro-optimizations without measurements

4. TESTS
   is the new behavior covered? do they test behavior, not implementation?

5. READABILITY (nit)
   naming, dead code, "what" comments instead of "why"

0. STYLE — NOT REVIEWED BY HUMANS. Prettier/ESLint in CI. Full stop.`}
        />
      </div>

      <div className="card">
        <h3><L ru="Как формулировать комментарии" en="How to phrase comments" /></h3>
        <CodeBlock
          ru={`❌ «Это неправильно, переделай»            → про человека, без причины
✅ «blocker: при пустом users упадём на [0].name — добавить guard?»

❌ «Я бы написал через reduce»              → вкусовщина без пользы
✅ «nit: map+filter здесь дважды проходит массив; не критично,
    но reduce сделал бы за один — на твоё усмотрение»

❌ «Зачем ты так сделал?»                   → звучит как наезд
✅ «Подскажи контекст: почему запрос здесь, а не в api-слое?
    Возможно, есть причина, которую я не вижу»

Разметка серьёзности (общепринятая):
  blocker:  — не смержим, пока не исправлено (баг, безопасность)
  major:/suggestion: — стоит исправить, обсуждаемо
  nit:      — мелочь, можно игнорировать
  praise:/👍 — хорошее тоже отмечать (это не «мягкость», это калибровка)

Правило: на КАЖДЫЙ комментарий — «почему» и, где можно, предложение фикса.`}
          en={`❌ "This is wrong, redo it"                 → about the person, no reason given
✅ "blocker: this crashes on [0].name when users is empty — add a guard?"

❌ "I would've written it with reduce"      → taste with no payoff
✅ "nit: map+filter walks the array twice here; not critical,
    but reduce would do it in one pass — your call"

❌ "Why did you do it this way?"            → reads as an attack
✅ "Can you give me context: why is the request here instead of the api layer?
    There might be a reason I'm not seeing"

Severity markers (widely used convention):
  blocker:  — won't merge until fixed (bug, security)
  major:/suggestion: — worth fixing, open to discussion
  nit:      — minor, safe to ignore
  praise:/👍 — call out the good stuff too (not "softness" — it's calibration)

Rule: every comment gets a "why," and a suggested fix where possible.`}
        />
      </div>

      <div className="card">
        <h3><L ru="Собеседование в формате код-ревью: как проходить" en="A code-review-format interview: how to approach it" /></h3>
        <CodeBlock
          ru={`Тебе дают код и просят отревьюить. Алгоритм:

1. СНАЧАЛА ПОНЯТЬ, потом критиковать (1-2 минуты):
   «Это компонент поиска: инпут, запрос, список. Верно?»
   — вопрос о контексте/требованиях сразу даёт +балл

2. ПРОГОВАРИВАТЬ ВСЛУХ по приоритетам (то, что молча, — не засчитают):
   «Начну с корректности... вижу race condition: ответы могут прийти
    не по порядку — нужен AbortController или флаг отмены»

3. На каждую находку — ТРИ ЧАСТИ:
   что не так → чем грозит (конкретный сценарий) → как чинить

4. РАЗМЕЧАТЬ вес: «это блокер», «а вот это nit, не настаиваю»
   — интервьюер проверяет калибровку не меньше, чем зоркость

5. Сказать и ХОРОШЕЕ: «типизация аккуратная, ошибки обработаны»

6. Не выдумывать проблемы там, где их нет: ложные срабатывания
   («а вдруг тут...») минусуют сильнее, чем пропуск мелочи`}
          en={`You're handed code and asked to review it. The algorithm:

1. UNDERSTAND FIRST, criticize later (1-2 minutes):
   "This is a search component: input, request, list. Correct?"
   — asking about context/requirements immediately earns a point

2. THINK OUT LOUD in priority order (silent reading doesn't count):
   "Starting with correctness... I see a race condition: responses can
    arrive out of order — needs an AbortController or a cancel flag"

3. For every finding, THREE PARTS:
   what's wrong → what it risks (a concrete scenario) → how to fix it

4. MARK the severity: "this is a blocker," "this one's a nit, not insisting"
   — the interviewer checks calibration as much as sharp eyes

5. Say what's GOOD too: "the typing is careful, errors are handled"

6. Don't invent problems that aren't there: false positives
   ("what if this...") cost more than missing a minor issue`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Ревью — это проверка стиля и форматирования»",
            code: `// 40 комментариев про кавычки и отступы,
// а мутация state и гонка запросов — не замечены`,
            text: "Главный red flag формата: стиль автоматизирован (Prettier/ESLint), человек ищет то, что машина не видит — логику, краевые случаи, дизайн. Начал с запятых — провалил калибровку.",
            en: {
              title: "“Review means checking style and formatting”",
              code: `// 40 comments about quotes and indentation,
// while a state mutation and a request race go unnoticed`,
              text: "The main format red flag: style is automated (Prettier/ESLint); a human looks for what the machine can't see — logic, edge cases, design. Starting with commas fails the calibration check.",
            },
          },
          {
            title: "«LGTM» за 30 секунд на 800 строк",
            code: `// исследования сходятся: качество ревью падает
// после ~400 строк за сессию; 800 строк «одобрено мгновенно» =
// ревью не было`,
            text: "Как автор — дели PR на маленькие; как ревьюер — честно говори «слишком большой, давай частями». На собесе упомянуть лимит размера — плюс.",
            en: {
              title: "A 30-second “LGTM” on 800 lines",
              code: `// research converges on this: review quality drops
// past roughly 400 lines per session; 800 lines "approved instantly" =
// no review actually happened`,
              text: "As an author, split PRs into small ones; as a reviewer, say honestly “this is too big, let's split it.” Mentioning a size limit in an interview is a plus.",
            },
          },
          {
            title: "«Я бы переписал по-своему» на каждый PR",
            code: `// вкусовщина ≠ проблема. Вопрос-фильтр:
// «изменится ли ПОВЕДЕНИЕ или поддерживаемость,
//  или это просто другой валидный способ?»`,
            text: "Ревьюер, продавливающий свой стиль, разрушает ревью: авторы начинают писать «под него», а не хорошо. Валидное, но «не как я» — approve.",
            en: {
              title: "“I would've written it my way” on every PR",
              code: `// taste ≠ a problem. Filter question:
// "would this change BEHAVIOR or maintainability,
//  or is it just another valid way to do it?"`,
              text: "A reviewer pushing their own style breaks review: authors start writing for the reviewer instead of writing well. Valid but “not how I'd do it” gets approved.",
            },
          },
          {
            title: "Найдено много — сообщено в лоб",
            code: `// 30 blocker-комментариев подряд без единого «почему» и
// без предложений — автор в обороне, ревью превратилось в бой`,
            text: "Тон — часть навыка: вопросы вместо утверждений, «мы» вместо «ты», предложение фикса рядом с проблемой, хорошее — тоже вслух. На собесе это оценивается явно.",
            en: {
              title: "Lots found, delivered bluntly",
              code: `// 30 blocker comments in a row with not a single "why" and
// no suggestions — the author gets defensive, review turns into a fight`,
              text: "Tone is part of the skill: questions over statements, “we” over “you,” a suggested fix next to every problem, good things said out loud too. Interviews grade this explicitly.",
            },
          },
          {
            title: "Пропуск контекста: ревью без вопросов",
            code: `// «Зачем тут setTimeout(0)?» — может, костыль,
// а может, обход бага сафари, описанный в тикете
// Вопрос ДО вердикта — признак зрелости`,
            text: "Код существует в контексте требований и истории. Ревьюер, который спрашивает «какую задачу это решает?», ошибается реже, чем тот, кто сразу выносит вердикт.",
            en: {
              title: "Skipping context: review without questions",
              code: `// "Why is there a setTimeout(0) here?" — could be a hack,
// or could be a Safari bug workaround documented in a ticket
// Asking BEFORE the verdict is a sign of maturity`,
              text: "Code exists in the context of requirements and history. A reviewer who asks “what task does this solve?” is wrong less often than one who jumps straight to a verdict.",
            },
          },
        ]}
      />

      <div className="redflag">
        <b>
          <L
            ru="⚠️ Red flag на собесе-ревью: молчаливое чтение."
            en="⚠️ Red flag in a review interview: reading silently."
          />
        </b>
        <br />
        <L
          ru={
            <>
              Почему: интервьюер оценивает процесс мышления, а он виден только
              через проговаривание. Правильный формат каждой находки: «Вот здесь
              <i> [что]</i> — это приведёт к <i>[конкретный сценарий бага]</i> —
              я бы <i>[фикс]</i> — по весу это <i>[blocker/nit]</i>». Тренируйся
              произносить это вслух — в тренажёре Code review (секция Тренировка)
              ровно такие задания.
            </>
          }
          en={
            <>
              Why: the interviewer is evaluating your thinking process, and that's
              only visible if you say it out loud. The right format for every
              finding: "Here <i>[what]</i> — this leads to <i>[a concrete bug
              scenario]</i> — I'd <i>[fix]</i> — severity-wise it's a
              <i> [blocker/nit]</i>." Practice saying this out loud — the Code
              review trainer (Practice section) has exactly this kind of exercise.
            </>
          }
        />
      </div>

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="приоритеты: корректность/безопасность → дизайн → перф → тесты → читаемость (стиль — линтеру); комментарий = что + чем грозит + как чинить + вес (blocker/nit); вопросы вместо команд, маленькие PR, хорошее — вслух."
          en="priorities: correctness/security → design → performance → tests → readability (style is the linter's job); a comment = what + the risk + the fix + severity (blocker/nit); questions over commands, small PRs, and say what's good out loud."
        />
      </div>
    </>
  );
}
