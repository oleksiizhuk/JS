import { createContext, useContext, useState, type ReactNode } from "react";
import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";
import { useLang } from "../../LangContext";

// ── Живой compound component: Tabs ──
type TabsCtxValue = { active: string; setActive: (id: string) => void };
const TabsCtx = createContext<TabsCtxValue | null>(null);

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
Tabs.Tab = function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs.Tab вне <Tabs>");
  const { active, setActive } = ctx;
  return (
    <button
      className="btn"
      style={active === id ? { background: "#4f6ef7", color: "#fff", borderColor: "#4f6ef7" } : {}}
      onClick={() => setActive(id)}
    >
      {children}
    </button>
  );
};
Tabs.Panel = function Panel({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs.Panel вне <Tabs>");
  const { active } = ctx;
  return active === id ? (
    <div style={{ padding: "10px 4px", borderTop: "1px solid #e3e5ec", marginTop: 8 }}>
      {children}
    </div>
  ) : null;
};

// «Обычный» компонент с пропом items — для контраста
type ConfigTabItem = { id: string; title: ReactNode; content: ReactNode };
function ConfigTabs({ items, defaultTab }: { items: ConfigTabItem[]; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <>
      {items.map((it) => (
        <button
          key={it.id}
          className="btn"
          style={active === it.id ? { background: "#4f6ef7", color: "#fff", borderColor: "#4f6ef7" } : {}}
          onClick={() => setActive(it.id)}
        >
          {it.title}
        </button>
      ))}
      <div style={{ padding: "10px 4px", borderTop: "1px solid #e3e5ec", marginTop: 8 }}>
        {items.find((it) => it.id === active)?.content}
      </div>
    </>
  );
}

export default function DesignPatterns() {
  const lang = useLang();
  const t = (ru: string, en: string) => (lang === "en" ? en : ru);
  return (
    <>
      <InterviewQuestion en="Which design patterns do you actually use in JS/React? Show where they live in real code.">
        Какие паттерны проектирования реально используешь в JS/React? Где они живут в настоящем коде?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "I answer through patterns I can point to in a codebase, not
            textbook UML. <b>Observer / pub-sub</b> — the most alive one:
            addEventListener, store.subscribe in Redux, useSyncExternalStore —
            'many listeners react to a change'. <b>Module + singleton</b> —
            every ES module is a natural singleton: the store instance, an api
            client. <b>Factory</b> — functions producing configured objects:
            createSlice, createApi, a makeCounter closure. <b>Strategy</b> —
            swapping behavior via a passed function or a map: sort comparator,
            Record&lt;Status, Renderer&gt; instead of if-chains.
            <b> Adapter / facade</b> — the api layer hiding fetch details and
            normalizing responses. <b>Decorator</b> — HOCs and function
            wrappers like withRetry(fetchUser), debounce. React-specific
            composition patterns: <b>compound components</b> —
            Tabs.List/Tabs.Panel sharing state through context, <b>render
            props</b> and hooks as the modern replacement, and <b>dependency
            injection via Context</b>. The senior point: patterns are
            vocabulary for solutions that already emerged — I don't 'apply
            Strategy', I notice an if-chain over behaviors and refactor it to
            a map, and only then it has a name."
          </>
        }
      >
        «Отвечаю через паттерны, на которые могу показать пальцем в кодовой
        базе, а не через учебный UML. <b>Observer / pub-sub</b> — самый
        живой: addEventListener, store.subscribe в Redux,
        useSyncExternalStore — «многие слушатели реагируют на изменение».
        <b> Module + singleton</b> — каждый ES-модуль это естественный
        синглтон: экземпляр стора, api-клиент. <b>Factory</b> — функции,
        производящие настроенные объекты: createSlice, createApi, замыкание
        makeCounter. <b>Strategy</b> — подмена поведения через переданную
        функцию или map: компаратор sort, Record&lt;Status, Renderer&gt;
        вместо цепочек if. <b>Adapter / facade</b> — api-слой, прячущий
        детали fetch и нормализующий ответы. <b>Decorator</b> — HOC и
        обёртки функций вроде withRetry(fetchUser), debounce. React-специфика
        композиции: <b>compound components</b> — Tabs.List/Tabs.Panel с общим
        состоянием через контекст, <b>render props</b> и хуки как их
        современная замена, и <b>DI через Context</b>. Senior-мысль: паттерны —
        это словарь для уже возникших решений: я не «применяю Strategy», я
        вижу цепочку if по поведениям и рефакторю её в map — и только потом у
        этого появляется имя.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Паттерны, которые ты уже используешь" en="Patterns you're already using" /></h3>
        <CodeBlock
          ru={`// Observer (pub/sub) — Redux-стор из нашей темы Core concepts:
const listeners = new Set();
dispatch(action) { state = reducer(state, action); listeners.forEach(l => l()); }
subscribe(l) { listeners.add(l); return () => listeners.delete(l); }

// Singleton через ES-модуль (без классов и getInstance):
// api.js
export const api = createClient({ baseUrl });   // один экземпляр на всё приложение

// Factory — функция производит настроенный объект:
const cartSlice = createSlice({ name: "cart", ... });

// Strategy — map вместо if-цепочки:
const renderers: Record<Status, () => JSX.Element> = {
  loading: () => <Spinner />, error: () => <Retry />, ready: () => <List />,
};
return renderers[status]();

// Decorator — обёртка с тем же контрактом:
const fetchWithRetry = withRetry(fetchUser, { attempts: 3 });
const search = debounce(rawSearch, 300);`}
          en={`// Observer (pub/sub) — the Redux store from our Core concepts topic:
const listeners = new Set();
dispatch(action) { state = reducer(state, action); listeners.forEach(l => l()); }
subscribe(l) { listeners.add(l); return () => listeners.delete(l); }

// Singleton via an ES module (no classes, no getInstance):
// api.js
export const api = createClient({ baseUrl });   // one instance for the whole app

// Factory — a function that produces a configured object:
const cartSlice = createSlice({ name: "cart", ... });

// Strategy — a map instead of an if-chain:
const renderers: Record<Status, () => JSX.Element> = {
  loading: () => <Spinner />, error: () => <Retry />, ready: () => <List />,
};
return renderers[status]();

// Decorator — a wrapper with the same contract:
const fetchWithRetry = withRetry(fetchUser, { attempts: 3 });
const search = debounce(rawSearch, 300);`}
        />
      </div>

      <div className="card">
        <h3><L ru="Compound components: живое демо и проблема, которую решает" en="Compound components: a live demo and the problem it solves" /></h3>
        <CodeBlock
          ru={`// ❌ ПРОБЛЕМА: компонент-«конфиг» с пропом items
<Tabs items={[
  { id: "a", title: "Профиль", content: <Profile /> },
  { id: "b", title: "Заказы",  content: <Orders /> },
]} />
// Хочешь бейдж на вкладке? Разделитель между табами? Иконку только
// у второй? → каждый раз ковыряешь ЧУЖОЙ компонент, добавляя пропы:
// items[].badge, items[].icon, separatorAfter... — конфиг разбухает`}
          en={`// ❌ THE PROBLEM: a "config" component with an items prop
<Tabs items={[
  { id: "a", title: "Profile", content: <Profile /> },
  { id: "b", title: "Orders",  content: <Orders /> },
]} />
// Want a badge on a tab? A separator between tabs? An icon only
// on the second one? → every time you poke at SOMEONE ELSE'S component,
// adding props: items[].badge, items[].icon, separatorAfter... — the config bloats`}
        />
        <p style={{ fontWeight: 600, margin: "8px 0 4px" }}>
          <L ru="❌ Вариант с items (жёсткий):" en="❌ The items variant (rigid):" />
        </p>
        <ConfigTabs
          defaultTab="a"
          items={[
            { id: "a", title: t("Профиль", "Profile"), content: t("Содержимое профиля", "Profile content") },
            { id: "b", title: t("Заказы", "Orders"), content: t("Список заказов", "Order list") },
          ]}
        />
        <CodeBlock
          ru={`// ✅ РЕШЕНИЕ: compound components — состояние общее (Context),
//    а РАСКЛАДКУ собирает потребитель как обычный JSX
const TabsCtx = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
Tabs.Tab = ({ id, children }) => {          // читает active из контекста
  const { active, setActive } = useContext(TabsCtx);
  return <button aria-selected={active === id} onClick={() => setActive(id)}>{children}</button>;
};
Tabs.Panel = ({ id, children }) => {
  const { active } = useContext(TabsCtx);
  return active === id ? <div>{children}</div> : null;
};

// бейдж, разделитель, что угодно — БЕЗ изменения Tabs:
<Tabs defaultTab="a">
  <Tabs.Tab id="a">Профиль</Tabs.Tab>
  <Tabs.Tab id="b">Заказы <span className="badge">3</span></Tabs.Tab>
  <span> | </span>
  <Tabs.Tab id="c">Настройки</Tabs.Tab>
  <Tabs.Panel id="a">...</Tabs.Panel>
  ...
</Tabs>`}
          en={`// ✅ THE FIX: compound components — state is shared (Context),
//    but the LAYOUT is assembled by the consumer as regular JSX
const TabsCtx = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
Tabs.Tab = ({ id, children }) => {          // reads active from context
  const { active, setActive } = useContext(TabsCtx);
  return <button aria-selected={active === id} onClick={() => setActive(id)}>{children}</button>;
};
Tabs.Panel = ({ id, children }) => {
  const { active } = useContext(TabsCtx);
  return active === id ? <div>{children}</div> : null;
};

// a badge, a separator, anything — WITHOUT changing Tabs:
<Tabs defaultTab="a">
  <Tabs.Tab id="a">Profile</Tabs.Tab>
  <Tabs.Tab id="b">Orders <span className="badge">3</span></Tabs.Tab>
  <span> | </span>
  <Tabs.Tab id="c">Settings</Tabs.Tab>
  <Tabs.Panel id="a">...</Tabs.Panel>
  ...
</Tabs>`}
        />
        <p style={{ fontWeight: 600, margin: "8px 0 4px" }}>
          <L
            ru="✅ Compound (гибкий — бейдж и разделитель добавлены потребителем):"
            en="✅ Compound (flexible — the badge and separator were added by the consumer):"
          />
        </p>
        <Tabs defaultTab="a">
          <Tabs.Tab id="a">{t("Профиль", "Profile")}</Tabs.Tab>
          <Tabs.Tab id="b">
            {t("Заказы", "Orders")} <span className="badge">3</span>
          </Tabs.Tab>
          <span style={{ margin: "0 6px", color: "#aab" }}>|</span>
          <Tabs.Tab id="c">{t("Настройки", "Settings")}</Tabs.Tab>
          <Tabs.Panel id="a">{t("Содержимое профиля", "Profile content")}</Tabs.Panel>
          <Tabs.Panel id="b">
            {t(
              "Список заказов (бейдж на вкладке — просто children!)",
              "Order list (the tab badge is just children!)"
            )}
          </Tabs.Panel>
          <Tabs.Panel id="c">{t("Настройки аккаунта", "Account settings")}</Tabs.Panel>
        </Tabs>
        <p className="hint">
          <L
            ru={
              <>
                Пощёлкай вкладки: оба варианта работают, но в compound-версии бейдж
                «3» и разделитель добавлены снаружи, без единого нового пропа у Tabs.
                Состояние (какая вкладка активна) связывает части через Context,
                а структуру диктует использующий код. Так устроены Radix UI,
                Headless UI, компоненты вроде &lt;select&gt;/&lt;option&gt; в HTML.
              </>
            }
            en={
              <>
                Click through the tabs: both variants work, but in the compound
                version the "3" badge and the separator were added from the outside,
                without a single new prop on Tabs. State (which tab is active) links
                the parts together via Context, while the consuming code dictates the
                structure. That's how Radix UI, Headless UI, and components like
                &lt;select&gt;/&lt;option&gt; in HTML are built.
              </>
            }
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="Карта соответствий «классика → JS/React»" en="Mapping: “classic pattern → JS/React”" /></h3>
        <CodeBlock
          ru={`Observer     store.subscribe, addEventListener, useSyncExternalStore
Singleton    ES-модуль с экспортом экземпляра
Factory      createSlice/createApi/createStore, фабричные функции
Strategy     компаратор sort, map по ключу, проп-функция
Adapter      api-слой над fetch, маппинг DTO → модель
Facade       один hooks-фасад над несколькими сторами/запросами
Decorator    HOC, withRetry/debounce/memoize-обёртки
Proxy        Proxy-объект (реактивность MobX/Vue, Immer draft)
Command      объекты-действия Redux (action = команда)
DI           Context как контейнер зависимостей (тема Props drilling)`}
          en={`Observer     store.subscribe, addEventListener, useSyncExternalStore
Singleton    an ES module exporting an instance
Factory      createSlice/createApi/createStore, factory functions
Strategy     a sort comparator, a map keyed by value, a prop function
Adapter      an api layer over fetch, mapping DTO → model
Facade       a single hooks facade over several stores/requests
Decorator    HOCs, withRetry/debounce/memoize wrappers
Proxy        a Proxy object (MobX/Vue reactivity, an Immer draft)
Command      Redux action objects (action = command)
DI           Context as a dependency container (see the Props drilling topic)`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Напиши синглтон» — ждут не Java-класс",
            code: `// ❌ карго-культ из Java:
class Api { static #instance; static getInstance() {...} }
// ✅ идиоматичный JS: модуль импортируется один раз и кэшируется
export const api = new ApiClient();`,
            text: "ES-модули выполняются однократно — система модулей уже даёт синглтон. getInstance в JS — сигнал переноса чужих идиом.",
            en: {
              title: "“Write a singleton” — they're not expecting a Java class",
              code: `// ❌ Java cargo-culting:
class Api { static #instance; static getInstance() {...} }
// ✅ idiomatic JS: the module is imported once and cached
export const api = new ApiClient();`,
              text: "ES modules execute exactly once — the module system already gives you a singleton. getInstance in JS signals a foreign idiom was carried over.",
            },
          },
          {
            title: "Паттерн ради паттерна",
            code: `// AbstractButtonFactoryProvider для двух кнопок
// 4 файла, 3 интерфейса — вместо <Button variant="primary" />`,
            text: "Red flag: усложнение без давления требований. Паттерн оправдан, когда боль уже есть (третий дублирующий if, второй транспорт данных), а не «на вырост».",
            en: {
              title: "A pattern for the pattern's sake",
              code: `// AbstractButtonFactoryProvider for two buttons
// 4 files, 3 interfaces — instead of <Button variant="primary" />`,
              text: "A red flag: added complexity with no pressure from requirements. A pattern is justified once the pain already exists (a third duplicated if, a second data transport), not preemptively.",
            },
          },
          {
            title: "«Наследование или композиция в React?»",
            code: `class PrimaryButton extends Button {}   // ❌ так в React не делают
<Button variant="primary" />            // ✅ композиция + props
{children} / хуки / HOC                 // ✅ переиспользование`,
            text: "React явно топит за композицию: официальная документация не имеет ни одного кейса для наследования компонентов.",
            en: {
              title: "“Inheritance or composition in React?”",
              code: `class PrimaryButton extends Button {}   // ❌ that's not how React works
<Button variant="primary" />            // ✅ composition + props
{children} / hooks / HOC                // ✅ reuse`,
              text: "React explicitly champions composition: the official docs don't have a single use case for component inheritance.",
            },
          },
          {
            title: "Observer без отписки",
            code: `useEffect(() => {
  emitter.on("event", handler);
  return () => emitter.off("event", handler);   // забыли → утечка
}, []);`,
            text: "Каждая подписка обязана возвращать отписку — то самое правило cleanup из темы lifecycle. Проверяется StrictMode-ремаунтом.",
            en: {
              title: "Observer without cleanup",
              code: `useEffect(() => {
  emitter.on("event", handler);
  return () => emitter.off("event", handler);   // forgot it → a leak
}, []);`,
              text: "Every subscription must return its unsubscribe — the same cleanup rule from the lifecycle topic. Caught by a StrictMode remount.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="называй паттерны через реальный код (observer=subscribe, singleton=модуль, factory=createX, strategy=map, decorator=HOC/обёртка) + compound components; паттерн — имя для возникшего решения, не самоцель."
          en="name patterns through real code (observer=subscribe, singleton=module, factory=createX, strategy=map, decorator=HOC/wrapper) + compound components; a pattern is a name for a solution that already emerged, not a goal in itself."
        />
      </div>
    </>
  );
}
