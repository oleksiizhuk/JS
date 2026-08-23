import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function VsRest() {
  return (
    <>
      <InterviewQuestion en="How is GraphQL different from REST? Trade-offs?">
        Чем GraphQL отличается от REST? Какие трейд-оффы?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "REST is many endpoints, each returning a fixed shape; GraphQL is
            <b> one endpoint</b> where the <b>client declares exactly what
            data it needs</b>, and the shape of the response mirrors the
            query. That solves REST's two classic problems:
            <b> over-fetching</b> — getting fields you don't need — and
            <b> under-fetching</b> — the N+1 of round trips when one screen
            needs /user, then /user/posts, then /posts/comments; in GraphQL
            that's one query over the graph. Everything is typed by a
            <b> schema</b> (SDL) — it's a contract between front and back,
            enabling codegen and autocomplete. Trade-offs honestly: HTTP
            caching is harder (usually POST to one URL — normalized client
            caches like Apollo instead), file uploads and monitoring are less
            standard, the server must guard against expensive queries (depth
            limiting, complexity analysis), and for a simple CRUD REST is
            still simpler."
          </>
        }
      >
        «REST — много эндпоинтов с фиксированной формой ответа; GraphQL —
        <b> один эндпоинт</b>, где <b>клиент сам декларирует, какие данные
        нужны</b>, и форма ответа зеркалит запрос. Это решает две классические
        проблемы REST: <b>over-fetching</b> — получаешь ненужные поля — и
        <b> under-fetching</b> — каскад запросов, когда экрану нужны /user,
        потом /user/posts, потом /posts/comments; в GraphQL это один запрос по
        графу. Всё типизировано <b>схемой</b> (SDL) — это контракт между
        фронтом и бэком, на нём работают codegen и автокомплит. Трейд-оффы
        честно: HTTP-кэширование сложнее (обычно POST на один URL — вместо
        него нормализованные клиентские кэши вроде Apollo), загрузка файлов и
        мониторинг менее стандартны, сервер должен защищаться от дорогих
        запросов (depth limiting, complexity analysis), и для простого CRUD
        REST по-прежнему проще.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Одна и та же задача" en="The same task, two ways" /></h3>
        <CodeBlock
          ru={`REST (3 запроса, лишние поля):
GET /users/42          → { id, name, email, address, ... }
GET /users/42/posts    → [{ id, title, body, meta, ... }]
GET /posts/7/comments  → [...]

GraphQL (1 запрос, только нужное):
query {
  user(id: 42) {
    name
    posts(last: 10) {
      title
      comments { text author { name } }
    }
  }
}`}
          en={`REST (3 requests, extra fields):
GET /users/42          → { id, name, email, address, ... }
GET /users/42/posts    → [{ id, title, body, meta, ... }]
GET /posts/7/comments  → [...]

GraphQL (1 request, only what's needed):
query {
  user(id: 42) {
    name
    posts(last: 10) {
      title
      comments { text author { name } }
    }
  }
}`}
        />
      </div>

      <div className="card">
        <h3><L ru="Словарь GraphQL" en="GraphQL glossary" /></h3>
        <CodeBlock
          ru={`schema (SDL)  — типы и связи: контракт API
type Query    — точки чтения      type Mutation — записи
resolver      — функция на сервере, отдающая значение поля
fragment      — переиспользуемый набор полей
introspection — API описывает сам себя (питает GraphiQL/codegen)
клиенты       — Apollo Client, urql, Relay (нормализованный кэш)`}
          en={`schema (SDL)  — types and relations: the API contract
type Query    — read entry points  type Mutation — writes
resolver      — server-side function that returns a field's value
fragment      — reusable set of fields
introspection — the API describes itself (powers GraphiQL/codegen)
clients       — Apollo Client, urql, Relay (normalized cache)`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«GraphQL всегда быстрее REST?»",
            code: `// Нет: транспорт тот же HTTP.
// Быстрее — за счёт МЕНЬШЕГО ЧИСЛА round-trip'ов и меньшего payload.
// Медленнее может быть: сложные resolvers, N+1 на сервере`,
            text: "Ждут нюансов: GraphQL переносит N+1 с клиента на сервер — там его лечат DataLoader-ом (батчинг).",
            en: {
              title: "\"Is GraphQL always faster than REST?\"",
              code: `// No: it's the same HTTP transport underneath.
// It's faster because of FEWER round trips and a smaller payload.
// It can be slower: complex resolvers, N+1 on the server`,
              text: "They're listening for nuance: GraphQL shifts the N+1 problem from the client to the server — where it's solved with a DataLoader (batching).",
            },
          },
          {
            title: "«Как кэшировать, если всё POST?»",
            code: `// HTTP-кэш почти не работает →
// нормализованный кэш клиента: Apollo InMemoryCache
// объекты хранятся по __typename + id, экраны шарят данные`,
            text: "Проверяют знание клиентской стороны: кэш Apollo — главная причина брать тяжёлый клиент.",
            en: {
              title: "\"How do you cache when everything is POST?\"",
              code: `// HTTP caching barely works →
// client-side normalized cache: Apollo InMemoryCache
// objects are stored by __typename + id, screens share data`,
              text: "This checks client-side knowledge: Apollo's cache is the main reason to reach for a heavier client library.",
            },
          },
          {
            title: "Ошибки приходят с HTTP 200",
            code: `// { data: null, errors: [{ message, path, extensions }] }
// проверять errors в ответе, а не только статус-код`,
            text: "Классика интеграции: GraphQL-ошибки живут в теле ответа; обработка — на уровне клиента/линков.",
            en: {
              title: "Errors come back with HTTP 200",
              code: `// { data: null, errors: [{ message, path, extensions }] }
// check the errors field in the response, not just the status code`,
              text: "A classic integration gotcha: GraphQL errors live in the response body; handling them happens at the client/link layer.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> один эндпоинт + клиент декларирует
              поля = нет over/under-fetching; цена — кэширование, защита
              сервера и сложность; схема — типизированный контракт.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> one endpoint + client-declared fields =
              no over/under-fetching; the cost is caching, server protection,
              and complexity; the schema is the typed contract.
            </>
          }
        />
      </div>
    </>
  );
}
