import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function TestingPyramid() {
  return (
    <>
      <InterviewQuestion en="What is the testing pyramid? How do you decide what to test at which level?">
        Что такое пирамида тестирования? Как решаешь, что тестировать на каком уровне?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "The pyramid is a cost model: at the base — many <b>unit tests</b>,
            fast and cheap, isolated functions and hooks; in the middle —
            <b> integration tests</b>: several modules together, a component
            with its store and mocked network; at the top — few <b>e2e</b>:
            the real app driven like a user does, slow, expensive, flaky. The
            higher the level, the more <b>confidence</b> per test but the
            worse the speed and stability — hence the shape. For frontend I
            follow the <b>testing trophy</b> variation: the sweet spot is
            integration tests with Testing Library — render the component,
            click like a user, assert the visible result, mock only the
            network (MSW). The rule I use for choosing a level: test the
            <b> behavior contract</b>, not implementation — units for pure
            logic (utils, reducers), integration for user scenarios in a
            screen, e2e (Playwright, in RN — Detox or Maestro) only for
            critical paths: login, checkout, payment. And coverage is a
            byproduct, not a goal: 100% with assertion-free tests is worse
            than 60% of real scenarios."
          </>
        }
      >
        «Пирамида — модель стоимости: в основании много <b>unit-тестов</b>,
        быстрых и дешёвых — изолированные функции и хуки; в середине —
        <b> интеграционные</b>: несколько модулей вместе, компонент со стором
        и замоканной сетью; на вершине мало <b>e2e</b> — реальное приложение,
        управляемое как пользователем: медленно, дорого, флакует. Чем выше
        уровень, тем больше <b>уверенности</b> на тест, но хуже скорость и
        стабильность — отсюда форма. Для фронтенда я придерживаюсь вариации
        <b> testing trophy</b>: сладкое место — интеграционные тесты с Testing
        Library: рендерим компонент, кликаем как пользователь, проверяем
        видимый результат, мокаем только сеть (MSW). Правило выбора уровня:
        тестировать <b>контракт поведения</b>, а не реализацию — unit для
        чистой логики (utils, reducers), интеграция для пользовательских
        сценариев экрана, e2e (Playwright, в RN — Detox или Maestro) только
        для критических путей: логин, корзина, оплата. А покрытие — побочный
        продукт, не цель: 100% с тестами без осмысленных assert-ов хуже, чем
        60% реальных сценариев.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Уровни и инструменты" en="Levels and tools" /></h3>
        <CodeBlock
          ru={`        ▲  e2e (мало)        Playwright / Cypress; RN: Detox, Maestro
       ▲▲  критические пути: логин, оплата, регистрация
      ▲▲▲
     ▲▲▲▲  integration (ядро) Testing Library + vitest/jest + MSW
    ▲▲▲▲▲  «экран работает»: рендер + клики + видимый результат
   ▲▲▲▲▲▲
  ▲▲▲▲▲▲▲  unit (много)       vitest/jest
 ▲▲▲▲▲▲▲▲  utils, reducers, кастомные хуки (renderHook), валидации

скорость/стабильность растут ВНИЗ, уверенность «оно работает» — ВВЕРХ`}
          en={`        ▲  e2e (few)          Playwright / Cypress; RN: Detox, Maestro
       ▲▲  critical paths: login, payment, sign-up
      ▲▲▲
     ▲▲▲▲  integration (core) Testing Library + vitest/jest + MSW
    ▲▲▲▲▲  "the screen works": render + clicks + visible result
   ▲▲▲▲▲▲
  ▲▲▲▲▲▲▲  unit (many)        vitest/jest
 ▲▲▲▲▲▲▲▲  utils, reducers, custom hooks (renderHook), validation

speed/stability increase DOWNWARD, confidence "it works" increases UPWARD`}
        />
      </div>

      <div className="card">
        <h3><L ru="Интеграционный тест — сладкое место фронтенда" en="Integration tests — the frontend sweet spot" /></h3>
        <CodeBlock
          ru={`// тестируем ПОВЕДЕНИЕ, а не реализацию:
test("после добавления товар виден в корзине", async () => {
  server.use(http.post("/api/cart", () => HttpResponse.json({ ok: true })));

  render(<ProductPage id="42" />, { wrapper: Providers });

  await userEvent.click(screen.getByRole("button", { name: /в корзину/i }));

  expect(await screen.findByText(/добавлено/i)).toBeInTheDocument();
  // НЕ проверяем: state стора, вызовы функций, внутренности компонента
});

// плохой тест (реализация): expect(dispatch).toHaveBeenCalledWith(...)
// сломается при рефакторинге, хотя поведение не изменилось`}
          en={`// test BEHAVIOR, not implementation:
test("item appears in the cart after adding it", async () => {
  server.use(http.post("/api/cart", () => HttpResponse.json({ ok: true })));

  render(<ProductPage id="42" />, { wrapper: Providers });

  await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

  expect(await screen.findByText(/added/i)).toBeInTheDocument();
  // NOT checked: store state, function calls, component internals
});

// bad test (implementation): expect(dispatch).toHaveBeenCalledWith(...)
// breaks on refactoring even though behavior didn't change`}
        />
      </div>

      <div className="card">
        <h3><L ru="Что тестировать в React/RN-проекте" en="What to test in a React/RN project" /></h3>
        <CodeBlock
          ru={`unit         — чистые функции: форматтеры, валидаторы, selectors, reducers
             — кастомные хуки через renderHook
integration  — экраны: «пользователь делает X → видит Y» (RTL/RNTL)
             — формы с валидацией, условные состояния (loading/error/empty)
e2e          — 3-7 сценариев: auth-флоу, главный happy path, оплата
snapshot     — только мелкие презентационные листья (см. тему Snapshot tests)
contract     — типы из API: zod-схемы на границе + codegen`}
          en={`unit         — pure functions: formatters, validators, selectors, reducers
             — custom hooks via renderHook
integration  — screens: "user does X → sees Y" (RTL/RNTL)
             — forms with validation, conditional states (loading/error/empty)
e2e          — 3-7 scenarios: auth flow, the main happy path, payment
snapshot     — only small presentational leaves (see the Snapshot tests topic)
contract     — types from the API: zod schemas at the boundary + codegen`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Перевёрнутая пирамида («рожок мороженого»)",
            code: `// 200 e2e-тестов, 10 юнитов:
// прогон 40 минут, флаки 5%, каждый второй прогон красный
// → команда перестаёт верить тестам и жмёт rerun`,
            text: "Антипаттерн №1: уверенность e2e соблазняет, но цена — скорость и флаки. Чинится спуском сценариев на уровень интеграции с моками сети.",
            en: {
              title: "The inverted pyramid (“ice cream cone”)",
              code: `// 200 e2e tests, 10 unit tests:
// a 40-minute run, 5% flake rate, every other run is red
// → the team stops trusting tests and just hits rerun`,
              text: "Antipattern #1: e2e confidence is tempting, but the price is speed and flakiness. Fixed by pushing scenarios down to integration level with network mocks.",
            },
          },
          {
            title: "«У нас 100% покрытие»",
            code: `test("renders", () => { render(<App />); });
// покрыл 80% строк, не проверил НИЧЕГО (ни одного assert)`,
            text: "Coverage измеряет «код выполнился», а не «поведение проверено». Ответ senior: покрытие — сигнал для поиска дыр, а не KPI.",
            en: {
              title: "“We have 100% coverage”",
              code: `test("renders", () => { render(<App />); });
// covers 80% of lines, checks NOTHING (not a single assertion)`,
              text: "Coverage measures “the code ran,” not “the behavior was verified.” A senior answer: coverage is a signal for finding gaps, not a KPI.",
            },
          },
          {
            title: "Тест знает лишнее о реализации",
            code: `expect(component.state.isOpen).toBe(true);        // ❌ внутренности
expect(mockSetState).toHaveBeenCalledTimes(2);    // ❌ детали
expect(screen.getByRole("dialog")).toBeVisible(); // ✅ поведение`,
            text: "Тесты реализации ломаются от рефакторинга без изменения поведения — и наоборот, пропускают реальные баги. Девиз RTL: «тестируй так, как использует юзер».",
            en: {
              title: "A test knows too much about implementation",
              code: `expect(component.state.isOpen).toBe(true);        // ❌ internals
expect(mockSetState).toHaveBeenCalledTimes(2);    // ❌ details
expect(screen.getByRole("dialog")).toBeVisible(); // ✅ behavior`,
              text: "Implementation tests break on refactors that don't change behavior — and conversely miss real bugs. RTL's motto: “test the way a user would use it.”",
            },
          },
          {
            title: "Флакующий e2e хуже отсутствующего",
            code: `// тест падает в 1 прогоне из 20 →
// команда привыкает жать Rerun → однажды Rerun скрывает РЕАЛЬНЫЙ баг`,
            text: "Флаки разъедает доверие ко всему CI. Правило: флакующий тест чинится немедленно или выключается с тикетом — но не живёт «иногда красным».",
            en: {
              title: "A flaky e2e test is worse than no test",
              code: `// the test fails 1 run out of 20 →
// the team gets used to hitting Rerun → one day Rerun hides a REAL bug`,
              text: "Flakiness erodes trust in all of CI. Rule: a flaky test gets fixed immediately or disabled with a ticket — it never gets to live as “sometimes red.”",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="много unit → ядро в integration (RTL + MSW, тестируем поведение) → немного e2e на критические пути; покрытие — индикатор, не цель; флаки чинится немедленно."
          en="lots of unit tests → the core is integration (RTL + MSW, testing behavior) → a few e2e tests on critical paths; coverage is an indicator, not a goal; flakiness gets fixed immediately."
        />
      </div>
    </>
  );
}
