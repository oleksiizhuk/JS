// PROP DRILLING и 3 решения (по возрастанию тяжести)
// Учебный файл — читать сверху вниз

import { createContext, useContext, useState } from "react";
import { create } from "zustand"; // npm i zustand (для примера 3)

const user = { name: "Olex" };

// ════════════════════════════════════════════════
// ПРОБЛЕМА: prop drilling
// user нужен только Avatar, но его тащат через всех
// ════════════════════════════════════════════════

function App0() {
  return <Layout0 user={user} />;
}
function Layout0({ user }) {          // курьер — сам user не использует
  return <Sidebar0 user={user} />;
}
function Sidebar0({ user }) {         // курьер — сам user не использует
  return <Avatar0 user={user} />;
}
function Avatar0({ user }) {          // единственный настоящий потребитель
  return <img alt={user.name} />;
}
// Минусы: шум, хрупкость (переименовал проп — правишь цепочку),
// посредники ре-рендерятся при изменении user

// ════════════════════════════════════════════════
// РЕШЕНИЕ 1: Composition (children) — самое лёгкое
// Собираем готовый компонент НАВЕРХУ, посредники — просто рамки с дыркой
// ════════════════════════════════════════════════

function App1() {
  return (
    <Layout1>
      <Sidebar1>
        <Avatar0 user={user} />   {/* user из App попадает сюда НАПРЯМУЮ */}
      </Sidebar1>
    </Layout1>
  );
}
function Layout1({ children }) {      // не знает про user вообще
  return <div className="layout">{children}</div>;
}
function Sidebar1({ children }) {     // не знает про user вообще
  return <aside>{children}</aside>;
}

// Вариант slot-props: несколько "дырок"
function Layout1b({ sidebar, content }) {
  return (
    <div>
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}
// <Layout1b sidebar={<Avatar0 user={user} />} content={<Feed />} />

// ════════════════════════════════════════════════
// РЕШЕНИЕ 2: Context — для РЕДКО меняющихся данных
// (тема, локаль, авторизованный юзер)
// ════════════════════════════════════════════════

const UserContext = createContext(null);

function App2() {
  return (
    <UserContext.Provider value={user}>
      <Layout2 />                 {/* никто ничего не прокидывает */}
    </UserContext.Provider>
  );
}
function Layout2() {
  return <Sidebar2 />;
}
function Sidebar2() {
  return <Avatar2 />;
}
function Avatar2() {
  const user = useContext(UserContext);  // "телепорт": достали напрямую
  return <img alt={user.name} />;
}
// ⚠️ При смене value ре-рендерятся ВСЕ читатели контекста —
// поэтому не годится для данных, меняющихся каждую секунду

// ════════════════════════════════════════════════
// РЕШЕНИЕ 3: Внешний стор — для ЧАСТО меняющегося глобального состояния
// (корзина, живые данные). Пример на Zustand
// ════════════════════════════════════════════════

const useCart = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}));

function CartBadge() {
  // подписка на КУСОЧЕК стора: ре-рендер только когда изменился items.length
  const count = useCart((s) => s.items.length);
  return <span>{count}</span>;
}
function AddButton() {
  const add = useCart((s) => s.add);
  return <button onClick={() => add({ id: 1 })}>+</button>;
}
// Отличие от Context: селектор → точечные ре-рендеры; логика вне компонентов

// ════════════════════════════════════════════════
// РЕЗЮМЕ (для собеседования)
// ════════════════════════════════════════════════
// Prop drilling — протаскивание props через компоненты, которым они не нужны.
// 1. Composition (children/slots) — первым делом, решает 80% случаев
// 2. Context — данные нужны много где, меняются РЕДКО
// 3. Внешний стор (Zustand/Redux) — глобальное, меняется ЧАСТО
// Правило: бери самое лёгкое решение, которого хватает.
