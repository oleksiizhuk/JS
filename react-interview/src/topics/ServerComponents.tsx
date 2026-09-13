import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "./InterviewBlocks";

export default function ServerComponents() {
  return (
    <>
      <InterviewQuestion en="What are React Server Components? How do they differ from SSR?">
        Что такое React Server Components? Чем отличаются от SSR?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Server Components run <b>only on the server</b> and never ship to
            the browser: their code isn't in the bundle at all, they can await
            data directly — hit the database or the filesystem — and they send
            the client a serialized description of the rendered UI, not HTML and
            not JS. The difference from classic <b>SSR</b> is the key point:
            SSR renders the <b>same</b> components on the server into HTML and
            then <b>hydrates</b> them in the browser, so their code is shipped
            twice, effectively; RSC removes that code from the client entirely
            and there's nothing to hydrate. Practically they split
            responsibilities: server components fetch data and render static
            markup, client components — marked <b>'use client'</b> — hold state,
            effects and event handlers. Constraints follow from that: a server
            component can't use useState, useEffect or onClick, and can't be
            imported into a client component's code — but it can be passed
            through as children, which is the standard composition pattern. The
            win is bundle size and data proximity; the cost is a framework
            (Next.js App Router) and a genuinely more complex mental model of
            the boundary."
          </>
        }
      >
        «Server Components выполняются <b>только на сервере</b> и никогда не
        попадают в браузер: их кода вообще нет в бандле, они могут напрямую
        await-ить данные — ходить в базу или файловую систему — и отправляют
        клиенту сериализованное описание отрендеренного UI, не HTML и не JS.
        Отличие от классического <b>SSR</b> — ключевой момент: SSR рендерит
        <b> те же самые</b> компоненты на сервере в HTML, а потом
        <b> гидрирует</b> их в браузере, то есть их код по сути едет дважды;
        RSC убирает этот код с клиента совсем, и гидрировать нечего. На практике
        они разделяют ответственность: серверные компоненты загружают данные и
        рендерят статичную разметку, клиентские — помеченные <b>'use client'</b> —
        держат state, эффекты и обработчики событий. Отсюда ограничения: в
        серверном компоненте нельзя useState, useEffect и onClick, и его нельзя
        импортировать в код клиентского — но можно передать через children, это
        стандартный паттерн композиции. Выигрыш — размер бандла и близость к
        данным; цена — нужен фреймворк (Next.js App Router) и заметно более
        сложная ментальная модель границы.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3>
          <L
            ru="Server component: данные без useEffect и без API-роута"
            en="Server component: data without useEffect and without an API route"
          />
        </h3>
        <CodeBlock
          ru={`// app/posts/page.jsx — по умолчанию СЕРВЕРНЫЙ компонент
import { db } from "@/lib/db";

export default async function Posts() {     // async-компонент!
  const posts = await db.post.findMany();   // прямо в базу, без fetch к своему API

  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
// в бандл клиента не попадает НИЧЕГО из этого файла:
// ни db, ни ORM, ни секреты, ни сам компонент`}
          en={`// app/posts/page.jsx — a SERVER component by default
import { db } from "@/lib/db";

export default async function Posts() {     // an async component!
  const posts = await db.post.findMany();   // straight to the DB, no fetch to your own API

  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
// NOTHING from this file ends up in the client bundle:
// not db, not the ORM, not secrets, not even the component itself`}
        />
      </div>

      <div className="card">
        <h3>
          <L ru="Граница 'use client' и композиция" en="The 'use client' boundary and composition" />
        </h3>
        <CodeBlock
          ru={`// LikeButton.jsx
"use client";                       // ← отсюда и ниже по импортам — клиент
import { useState } from "react";

export function LikeButton({ initial }) {
  const [likes, setLikes] = useState(initial);   // state можно только тут
  return <button onClick={() => setLikes(l => l + 1)}>❤️ {likes}</button>;
}

// Post.jsx — серверный, использует клиентский как «остров»
export default async function Post({ id }) {
  const post = await db.post.findUnique({ where: { id } });
  return (
    <article>
      <h1>{post.title}</h1>          {/* статика — сервер */}
      <LikeButton initial={post.likes} />  {/* интерактив — клиент */}
    </article>
  );
}

// ❌ нельзя: import ServerThing from "./ServerThing" внутри "use client"-файла
// ✅ можно: передать серверный компонент как children/проп
<ClientLayout><ServerContent /></ClientLayout>`}
          en={`// LikeButton.jsx
"use client";                       // ← from here down the import graph — client
import { useState } from "react";

export function LikeButton({ initial }) {
  const [likes, setLikes] = useState(initial);   // state is only allowed here
  return <button onClick={() => setLikes(l => l + 1)}>❤️ {likes}</button>;
}

// Post.jsx — server component, uses the client one as an "island"
export default async function Post({ id }) {
  const post = await db.post.findUnique({ where: { id } });
  return (
    <article>
      <h1>{post.title}</h1>          {/* static — server */}
      <LikeButton initial={post.likes} />  {/* interactive — client */}
    </article>
  );
}

// ❌ not allowed: import ServerThing from "./ServerThing" inside a "use client" file
// ✅ allowed: pass a server component through as children/a prop
<ClientLayout><ServerContent /></ClientLayout>`}
        />
      </div>

      <div className="card">
        <h3>
          <L ru="Сравнение подходов" en="Comparing the approaches" />
        </h3>
        <CodeBlock
          ru={`                    CSR            SSR              RSC
где рендер          браузер        сервер+браузер   сервер (клиент — острова)
код в бандле        весь           весь             только клиентские компоненты
гидратация          —              всего дерева     только островов
доступ к БД         через API      через API        напрямую в компоненте
интерактивность     везде          везде            только в "use client"
state/эффекты       да             да               только в клиентских

Смежное: Server Actions — функции с "use server", вызываемые из формы/клиента,
выполняются на сервере (мутации без ручного API-роута).`}
          en={`                    CSR            SSR              RSC
where it renders    browser        server+browser   server (client — islands)
code in the bundle  all of it      all of it        only client components
hydration           —              the whole tree    only the islands
DB access           via API        via API          directly in the component
interactivity       everywhere     everywhere       only in "use client"
state/effects        yes            yes             only in client components

Related: Server Actions — functions marked "use server", called from a form
or the client, run on the server (mutations without a hand-rolled API route).`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«RSC — это то же самое, что SSR»",
            code: `SSR:  компонент выполняется на сервере → HTML → тот же код едет
      на клиент → hydrate (навешивание обработчиков)
RSC:  компонент выполняется ТОЛЬКО на сервере → его кода на клиенте нет
      → гидрировать нечего`,
            text: "Самый частый вопрос по теме. Ключевое различие — попадает ли код компонента в бандл. RSC и SSR при этом сочетаются, а не исключают друг друга.",
            en: {
              title: "\"RSC is the same thing as SSR\"",
              code: `SSR:  the component runs on the server → HTML → the same code ships
      to the client → hydrate (attaching event handlers)
RSC:  the component runs ONLY on the server → its code never reaches
      the client → there's nothing to hydrate`,
              text: "The most common question on this topic. The key difference is whether the component's code ends up in the bundle. RSC and SSR combine — they don't exclude each other.",
            },
          },
          {
            title: "«Тогда помечу 'use client' на всякий случай везде»",
            code: `// "use client" заразен вниз по ИМПОРТАМ:
// всё, что клиентский файл импортирует, становится клиентским.
// НО: {children}, переданные ПРОПОМ, остаются серверными —
// поэтому клиентский layout не «отравляет» вложенные роуты`,
            text: "Директива распространяется по графу импортов, а не по JSX-дереву — children как проп это лазейка для композиции. Правильно: клиентские островки на листьях, серверное — внутрь через children.",
            en: {
              title: "\"Then I'll just mark 'use client' everywhere, just in case\"",
              code: `// "use client" is contagious down the IMPORT graph:
// everything a client file imports becomes client too.
// BUT: {children} passed in as a PROP stay server components —
// so a client layout doesn't "poison" the nested routes`,
              text: "The directive propagates through the import graph, not the JSX tree — children as a prop is the escape hatch for composition. The right approach: client islands at the leaves, server content passed inward via children.",
            },
          },
          {
            title: "Пропсы через границу должны быть сериализуемы",
            code: `<ClientComp onSave={() => {...}} />   // ❌ функцию передать нельзя
<ClientComp data={new Map()} />       // ❌ и Map тоже
<ClientComp items={plainArray} />     // ✅ JSON-совместимое`,
            text: "Через границу сервер→клиент едет сериализованное описание. Исключение — Server Actions: их (и только их) можно передать как проп-функцию.",
            en: {
              title: "Props crossing the boundary must be serializable",
              code: `<ClientComp onSave={() => {...}} />   // ❌ can't pass a function
<ClientComp data={new Map()} />       // ❌ or a Map either
<ClientComp items={plainArray} />     // ✅ JSON-compatible`,
              text: "A serialized description travels across the server → client boundary. The exception is Server Actions: they — and only they — can be passed as a function prop.",
            },
          },
          {
            title: "Где вообще это работает",
            code: `// RSC требует поддержки бандлера и рантайма:
// Next.js App Router, React Router v7 framework mode, Waku
// В обычном Vite+React SPA (как этот проект) RSC нет`,
            text: "Честный ответ на собесе: RSC — не «новый хук», а архитектура уровня фреймворка. Знать концепцию и границу нужно, но в SPA её не включишь.",
            en: {
              title: "Where this actually works",
              code: `// RSC requires bundler and runtime support:
// Next.js App Router, React Router v7 framework mode, Waku
// A plain Vite+React SPA (like this project) has no RSC`,
              text: "The honest interview answer: RSC isn't 'a new hook', it's a framework-level architecture. You need to know the concept and the boundary, but you can't switch it on in an SPA.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> RSC выполняются только на сервере и не
              попадают в бандл (в отличие от SSR, где тот же код едет на клиент и
              гидрируется); state и события — только в островах 'use client', пропсы
              через границу сериализуемы.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> RSC run only on the server and never
              enter the bundle (unlike SSR, where the same code ships to the
              client and gets hydrated); state and events live only in 'use
              client' islands, and props crossing the boundary must be
              serializable.
            </>
          }
        />
      </div>
    </>
  );
}
