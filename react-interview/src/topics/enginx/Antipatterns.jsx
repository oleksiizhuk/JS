import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function Antipatterns() {
  return (
    <>
      <InterviewQuestion en="Which antipatterns do you look for in code review? Frontend-specific ones?">
        Какие антипаттерны высматриваешь на код-ревью? Специфичные для фронтенда?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "General ones first: <b>god object</b> — a 900-line component
            doing fetch, validation, three modals and analytics;
            <b> copy-paste</b> instead of extraction; <b>magic values</b>
            scattered around; premature optimization; and its opposite —
            <b> the wrong abstraction</b>: a shared helper bent by flags for
            every caller, where duplication would be cheaper. React-specific
            ones I actively hunt: <b>useEffect for derived state</b> — a
            second state plus effect to compute what a plain expression or
            useMemo derives from existing data, the top source of extra
            renders and loops; <b>effect chains</b> — effect sets state,
            which triggers the next effect; <b>state duplication</b> —
            copying props into state 'to edit later' and losing sync;
            everything from our red flags — key=index, mutations, inline
            objects into memo children, business logic inside components
            instead of hooks and the api layer. My criterion: an antipattern
            isn't 'ugly code', it's a structure that <b>predictably breeds
            bugs</b> — so in review I explain the future bug, not my taste."
          </>
        }
      >
        «Сначала общие: <b>god object</b> — компонент на 900 строк, который
        сам делает fetch, валидацию, три модалки и аналитику;
        <b> copy-paste</b> вместо выделения; <b>магические значения</b> по
        коду; преждевременная оптимизация; и её противоположность —
        <b> неправильная абстракция</b>: общий хелпер, погнутый флагами под
        каждого потребителя, где дублирование было бы дешевле.
        React-специфика, которую высматриваю активно: <b>useEffect для
        производного состояния</b> — второй state плюс эффект, чтобы посчитать
        то, что выводится выражением или useMemo из уже имеющихся данных, —
        главный источник лишних рендеров и циклов; <b>цепочки эффектов</b> —
        эффект ставит state, который триггерит следующий эффект;
        <b> дублирование состояния</b> — копирование props в state «чтобы
        редактировать», с потерей синхронизации; и всё из наших red flags —
        key=index, мутации, инлайн-объекты в memo-детей, бизнес-логика внутри
        компонентов вместо хуков и api-слоя. Мой критерий: антипаттерн — это
        не «некрасивый код», а структура, которая <b>предсказуемо порождает
        баги</b>, — поэтому на ревью я объясняю будущий баг, а не свой вкус.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="№1 фронтенда: useEffect для производного состояния" en="Frontend antipattern #1: useEffect for derived state" /></h3>
        <CodeBlock
          ru={`// ❌ антипаттерн: state + эффект для того, что ВЫЧИСЛЯЕТСЯ
const [items, setItems] = useState([]);
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter(i => i.active));   // лишний рендер + рассинхрон
}, [items]);

// ✅ производное — считается при рендере:
const filtered = items.filter(i => i.active);
// дорого? → useMemo(() => items.filter(...), [items])

// ❌ цепочка эффектов (каскад рендеров, порядок хрупкий):
useEffect(() => setB(f(a)), [a]);
useEffect(() => setC(g(b)), [b]);
// ✅ одно событие → один обработчик, производное — из рендера`}
          en={`// ❌ antipattern: state + effect for something that's COMPUTED
const [items, setItems] = useState([]);
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter(i => i.active));   // extra render + desync risk
}, [items]);

// ✅ derived value — computed during render:
const filtered = items.filter(i => i.active);
// expensive? → useMemo(() => items.filter(...), [items])

// ❌ effect chain (cascading renders, fragile ordering):
useEffect(() => setB(f(a)), [a]);
useEffect(() => setC(g(b)), [b]);
// ✅ one event → one handler, derived values come from render`}
        />
      </div>

      <div className="card">
        <h3><L ru="Дублирование состояния и god component" en="State duplication and the god component" /></h3>
        <CodeBlock
          ru={`// ❌ props скопированы в state — две правды:
function Profile({ user }) {
  const [name, setName] = useState(user.name);  // user обновился — name НЕТ
}
// ✅ либо контролируемый снаружи, либо key={user.id} для сброса формы

// ❌ god component: fetch + форма + модалки + аналитика в одном файле
// ✅ разложить по осям:
//    данные        → useUser() (хук / RTK Query)
//    бизнес-логика → utils/чистые функции (тестируются отдельно)
//    UI            → мелкие презентационные компоненты
//    оркестрация   → тонкий контейнер`}
          en={`// ❌ props copied into state — now there are two sources of truth:
function Profile({ user }) {
  const [name, setName] = useState(user.name);  // user updates — name doesn't
}
// ✅ either control it from outside, or key={user.id} to reset the form

// ❌ god component: fetch + form + modals + analytics in one file
// ✅ split along the real axes:
//    data          → useUser() (a hook / RTK Query)
//    business logic → utils/pure functions (tested separately)
//    UI            → small presentational components
//    orchestration → a thin container`}
        />
      </div>

      <div className="card">
        <h3><L ru="Wrong abstraction — дороже дублирования" en="The wrong abstraction costs more than duplication" /></h3>
        <CodeBlock
          ru={`// Шаг 1: два похожих места → выделили shared/Button
// Шаг 2: третьему нужно чуть иначе → <Button special />
// Шаг 3: через год:
<Button special compact legacy isAdmin noIcon variant="x" mode={7} />
// никто не понимает, какие комбинации валидны; править страшно

// Санди Метц: «дублирование дешевле неправильной абстракции»
// Выход: раз-инлайнить обратно и выделить ЗАНОВО по реальным осям
// Практика: правило трёх — абстрагируй после ТРЕТЬЕГО повторения`}
          en={`// Step 1: two similar places → extracted shared/Button
// Step 2: a third needs something slightly different → <Button special />
// Step 3: a year later:
<Button special compact legacy isAdmin noIcon variant="x" mode={7} />
// nobody understands which combinations are valid; too scary to touch

// Sandi Metz: "duplication is cheaper than the wrong abstraction"
// Fix: inline it back and extract it AGAIN along the real axes
// Practice: the rule of three — abstract after the THIRD repetition`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Найди антипаттерн» (частый формат на собесе)",
            code: `useEffect(() => {
  fetch("/api/items").then(r => r.json()).then(setItems);
}, [items]);   // ← items в deps + setItems внутри = бесконечный цикл`,
            text: "Эффект пишет в то, от чего зависит. Классика вопроса «почему приложение шлёт тысячи запросов». Фикс: deps — [], а лучше данные через query-библиотеку.",
            en: {
              title: "“Spot the antipattern” (a common interview format)",
              code: `useEffect(() => {
  fetch("/api/items").then(r => r.json()).then(setItems);
}, [items]);   // ← items in deps + setItems inside = infinite loop`,
              text: "The effect writes to the thing it depends on. The classic “why is my app sending thousands of requests” question. Fix: deps — [], or better yet, fetch data via a query library.",
            },
          },
          {
            title: "Сброс state по props: наивно vs канонично",
            code: `// ❌ наивно: затирает ЛЮБОЕ редактирование пользователя
if (v !== value) setV(value);
// юзер напечатал своё → v разошлось с value → правки перезаписаны

// ✅ канон (React docs): храним ПРЕДЫДУЩИЙ prop, сбрасываем по его смене
const [prev, setPrev] = useState(value);
if (prev !== value) { setPrev(value); setV(value); }
// ✅ или проще: <Editor key={itemId} /> — честный ремаунт`,
            text: "Условный setState во время рендера — легальный паттерн из доков React (без warning, если не зациклен). Баг наивной версии не в «лишних рендерах», а в затирании пользовательского ввода: сравнивать надо с прошлым PROPS, а не с текущим state.",
            en: {
              title: "Resetting state from props: naive vs canonical",
              code: `// ❌ naive: wipes out ANY edit the user made
if (v !== value) setV(value);
// user typed their own value → v drifts from value → edits get overwritten

// ✅ canonical (React docs): store the PREVIOUS prop, reset when it changes
const [prev, setPrev] = useState(value);
if (prev !== value) { setPrev(value); setV(value); }
// ✅ or simpler: <Editor key={itemId} /> — an honest remount`,
              text: "Conditional setState during render is a legal pattern straight from the React docs (no warning, as long as it isn't a loop). The naive version's bug isn't “extra renders” — it's wiping out user input: you need to compare against the previous PROPS, not the current state.",
            },
          },
          {
            title: "Магические значения и boolean-ловушка",
            code: `if (status === 3) ...                    // ❌ что такое 3?
<Modal open small danger noPadding />     // ❌ 4 булевых пропа
// ✅ enum/union: status === Status.Shipped; variant="danger-compact"`,
            text: "Числа-статусы и растущие булевые пропсы — сигнал отсутствующей модели. Union-типы из TS-темы решают это на уровне типов.",
            en: {
              title: "Magic values and the boolean trap",
              code: `if (status === 3) ...                    // ❌ what is 3?
<Modal open small danger noPadding />     // ❌ 4 boolean props
// ✅ enum/union: status === Status.Shipped; variant="danger-compact"`,
              text: "Numeric statuses and a growing pile of boolean props signal a missing model. Union types from the TS topic solve this at the type level.",
            },
          },
          {
            title: "Преждевременная оптимизация vs преждевременная абстракция",
            code: `// оба — «работа на будущее, которого может не быть»:
memo/useCallback везде «на всякий случай»     → шум и оверхед
Generic-фабрика-конфигуратор для одного кейса → wrong abstraction`,
            text: "Симметричная пара: оптимизируй по замеру (Profiler), абстрагируй по повторению (правило трёх). Обе «болезни» лечатся требованием доказательств.",
            en: {
              title: "Premature optimization vs premature abstraction",
              code: `// both are "work for a future that may never arrive":
memo/useCallback everywhere "just in case"       → noise and overhead
a generic factory/configurator for one use case  → wrong abstraction`,
              text: "A symmetric pair: optimize based on measurement (Profiler), abstract based on repetition (the rule of three). Both diseases are cured by demanding evidence.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="главные фронтенд-антипаттерны — useEffect для производного состояния, цепочки эффектов, копия props в state, god component, wrong abstraction; критерий — структура предсказуемо порождает баги, и на ревью называешь будущий баг."
          en="the main frontend antipatterns: useEffect for derived state, effect chains, copying props into state, god components, wrong abstraction; the criterion is a structure that predictably breeds bugs — in review, name the future bug."
        />
      </div>
    </>
  );
}
