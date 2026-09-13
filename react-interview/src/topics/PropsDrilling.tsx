import { createContext, useContext, useState, type ReactNode } from "react";
import { useRenderCount } from "./helpers";
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "./InterviewBlocks";

function Badge() {
  const renders = useRenderCount();
  return <span className="badge"><L ru={<>рендеров: {renders}</>} en={<>renders: {renders}</>} /></span>;
}

type User = { name: string };

// ── ПРОБЛЕМА: user тащат через Layout и Sidebar, которым он не нужен
function BadLayout({ user }: { user: User }) {
  return (
    <div>
      <L ru="Layout (курьер)" en="Layout (courier)" /> <Badge />
      <BadSidebar user={user} />
    </div>
  );
}
function BadSidebar({ user }: { user: User }) {
  return (
    <div style={{ paddingLeft: 16 }}>
      <L ru="Sidebar (курьер)" en="Sidebar (courier)" /> <Badge />
      <Avatar user={user} />
    </div>
  );
}
function Avatar({ user }: { user: User }) {
  return (
    <div style={{ paddingLeft: 32 }}>
      🧑 Avatar: <b>{user.name}</b> <Badge />
    </div>
  );
}

// ── РЕШЕНИЕ 1: composition — посредники получают children
function GoodLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <L ru="Layout (рамка)" en="Layout (frame)" /> <Badge />
      {children}
    </div>
  );
}
function GoodSidebar({ children }: { children: ReactNode }) {
  return (
    <div style={{ paddingLeft: 16 }}>
      <L ru="Sidebar (рамка)" en="Sidebar (frame)" /> <Badge />
      {children}
    </div>
  );
}

// ── РЕШЕНИЕ 2: context — «телепорт» мимо посредников
const UserContext = createContext<User | null>(null);
function CtxLayout() {
  return (
    <div>
      <L ru="Layout (чистый)" en="Layout (clean)" /> <Badge />
      <CtxSidebar />
    </div>
  );
}
function CtxSidebar() {
  return (
    <div style={{ paddingLeft: 16 }}>
      <L ru="Sidebar (чистый)" en="Sidebar (clean)" /> <Badge />
      <CtxAvatar />
    </div>
  );
}
function CtxAvatar() {
  const user = useContext(UserContext)!; // всегда рендерится внутри Provider
  return (
    <div style={{ paddingLeft: 32 }}>
      🧑 Avatar: <b>{user.name}</b> <Badge />
    </div>
  );
}

export default function PropsDrilling() {
  const [name, setName] = useState("Olex");
  const user = { name };

  return (
    <>
      <InterviewQuestion en="What is prop drilling and how do you deal with it?">
        Что такое prop drilling и как с ним бороться?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Prop drilling is passing props through components that don't need
            them — just couriers. Problems: coupling, noise, and every level
            re-renders. Solutions in order of increasing weight. First,
            <b> composition</b> — assemble the component at the top and pass it
            through children or slot props; the intermediate components stop
            knowing about the data, and this covers most cases for free.
            Second, <b>Context</b> — for rarely changing data like theme, auth
            or locale; it's not free: every consumer re-renders on any value
            change. Third, an <b>external store</b> — Redux or Zustand — for
            frequently changing global state, with selector subscriptions and
            targeted re-renders. My rule: take the lightest tool that's
            enough, and composition comes first, not Context."
          </>
        }
      >
        «Prop drilling — прокидывание props через компоненты, которым они не
        нужны — просто курьеры. Проблемы: связанность, шум, ре-рендер каждого
        уровня. Решения по возрастанию тяжести. Первое — <b>composition</b>:
        собрать компонент наверху и передать через children или slot-props —
        посредники перестают знать о данных, и это бесплатно закрывает
        большинство случаев. Второе — <b>Context</b> для редко меняющегося:
        тема, auth, локаль; он не бесплатен — любое изменение value рендерит
        всех consumer-ов. Третье — <b>внешний стор</b> (Redux/Zustand) для
        часто меняющегося глобального состояния, с подпиской селекторами и
        точечными ре-рендерами. Правило: беру самое лёгкое, чего хватает, и
        первым называю composition, а не Context.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <input className="inp" value={name} onChange={(e) => setName(e.target.value)} />
        <span className="hint"><L ru="меняй имя и смотри, кто рендерится" en="change the name and watch who re-renders" /></span>
      </div>

      <div className="row">
        <div className="card">
          <h3>❌ Drilling</h3>
          <CodeBlock
            ru={`// user тащат через двух курьеров
function App() {
  return <Layout user={user} />;
}
function Layout({ user }) {        // ← не нужен, но принимает
  return <Sidebar user={user} />;
}
function Sidebar({ user }) {       // ← не нужен, но принимает
  return <Avatar user={user} />;
}
function Avatar({ user }) {        // ← единственный потребитель
  return <b>{user.name}</b>;
}`}
            en={`// user is dragged through two couriers
function App() {
  return <Layout user={user} />;
}
function Layout({ user }) {        // ← doesn't need it, but accepts it
  return <Sidebar user={user} />;
}
function Sidebar({ user }) {       // ← doesn't need it, but accepts it
  return <Avatar user={user} />;
}
function Avatar({ user }) {        // ← the only consumer
  return <b>{user.name}</b>;
}`}
          />
          <BadLayout user={user} />
        </div>
        <div className="card">
          <h3>✅ Composition</h3>
          <CodeBlock
            ru={`// Avatar собран НАВЕРХУ и передан как children
function App() {
  return (
    <Layout>
      <Sidebar>
        <Avatar user={user} />   {/* user попал сюда напрямую */}
      </Sidebar>
    </Layout>
  );
}
function Layout({ children }) {    // ← просто рамка
  return <div>{children}</div>;
}
function Sidebar({ children }) {   // ← просто рамка
  return <aside>{children}</aside>;
}`}
            en={`// Avatar is assembled AT THE TOP and passed as children
function App() {
  return (
    <Layout>
      <Sidebar>
        <Avatar user={user} />   {/* user landed here directly */}
      </Sidebar>
    </Layout>
  );
}
function Layout({ children }) {    // ← just a frame
  return <div>{children}</div>;
}
function Sidebar({ children }) {   // ← just a frame
  return <aside>{children}</aside>;
}`}
          />
          <GoodLayout>
            <GoodSidebar>
              <Avatar user={user} />
            </GoodSidebar>
          </GoodLayout>
        </div>
        <div className="card">
          <h3>✅ Context</h3>
          <CodeBlock
            ru={`// «телепорт» мимо посредников
const UserContext = createContext(null);

function App() {
  return (
    <UserContext.Provider value={user}>
      <Layout />                 {/* ничего не передаём */}
    </UserContext.Provider>
  );
}
function Layout() { return <Sidebar />; }   // ← чистый
function Sidebar() { return <Avatar />; }   // ← чистый
function Avatar() {
  const user = useContext(UserContext);     // достали напрямую
  return <b>{user.name}</b>;
}`}
            en={`// a "teleport" past the intermediaries
const UserContext = createContext(null);

function App() {
  return (
    <UserContext.Provider value={user}>
      <Layout />                 {/* passing nothing down */}
    </UserContext.Provider>
  );
}
function Layout() { return <Sidebar />; }   // ← clean
function Sidebar() { return <Avatar />; }   // ← clean
function Avatar() {
  const user = useContext(UserContext);     // grabbed directly
  return <b>{user.name}</b>;
}`}
          />
          <UserContext.Provider value={user}>
            <CtxLayout />
          </UserContext.Provider>
        </div>
      </div>
      <p className="hint">
        <L
          ru={<>
            Счётчики рендеров тут одинаковые во всех трёх колонках — и это честно:
            имя меняется в самом верху, поэтому поддерево рендерится целиком в любом
            случае. Разница не в рендерах, а в <b>связанности</b>: слева Layout и
            Sidebar обязаны знать про user и передавать его дальше, справа — нет.
          </>}
          en={<>
            The render counters are identical across all three columns — and that's
            fair: the name changes at the very top, so the subtree re-renders in
            full either way. The difference isn't in renders but in <b>coupling</b>:
            on the left, Layout and Sidebar have to know about user and pass it
            along; on the right, they don't.
          </>}
        />
      </p>

      <div className="explain">
        <L
          ru={<><b>Резюме одной строкой:</b> drilling лечится по возрастанию тяжести:
          composition (children/slots) → Context (редкое) → внешний стор (частое);
          первым всегда composition.</>}
          en={<><b>One-line summary:</b> drilling is treated in increasing order of
          weight: composition (children/slots) → Context (rare changes) → external
          store (frequent changes); composition always comes first.</>}
        />
      </div>

      <div className="redflag">
        <L
          ru={<>
            <b>⚠️ Red flag: первым решением называть Context.</b>
            <br />Почему: Context меняет одну проблему на другую. Drilling — проблема
            читаемости и связанности; Context добавляет проблему производительности
            (ВСЕ consumer-ы ре-рендерятся при любом изменении value) и скрытую
            зависимость — компонент больше нельзя переиспользовать без Provider.
            Composition решает большинство случаев бесплатно: собрал компонент
            наверху, передал через children — посредники вообще не знают о данных.
            Интервьюер проверяет, есть ли у тебя этот инструмент, или в голове только
            «props или глобальный стейт».
          </>}
          en={<>
            <b>⚠️ Red flag: naming Context as your first solution.</b>
            <br />Why: Context trades one problem for another. Drilling is a
            readability and coupling problem; Context adds a performance problem
            (ALL consumers re-render on any value change) and a hidden dependency —
            the component can no longer be reused without a Provider. Composition
            solves most cases for free: assemble the component at the top, pass it
            through children — the intermediaries don't know about the data at all.
            The interviewer is checking whether you have this tool, or whether your
            mental model is just "props or global state".
          </>}
        />
      </div>
    </>
  );
}
