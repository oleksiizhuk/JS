import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function QueryPage() {
  return (
    <>
      <InterviewQuestion en="What is a Query in GraphQL? How do you use it from React?">
        Что такое Query в GraphQL? Как используешь его из React?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Query is the <b>read</b> operation. I declare the fields I need —
            the response mirrors that shape. Queries take <b>variables</b>
            ($id: ID!), can alias fields, reuse field sets via
            <b> fragments</b>, and by convention are <b>idempotent</b> — no
            side effects, like GET in REST. Sibling query fields may resolve
            <b> in parallel</b> on the server. From React I use a client —
            Apollo or urql: the useQuery hook gives{" "}
            {"{ data, loading, error }"}, caches the result in a normalized store by __typename
            + id, so a second screen asking for the same user renders from
            cache; fetchPolicy controls cache-first vs network. Pagination is
            standardized by the Relay connection spec — edges/nodes/cursor —
            or simpler offset/limit with fetchMore."
          </>
        }
      >
        «Query — операция <b>чтения</b>. Декларирую нужные поля — ответ
        зеркалит эту форму. Запросы принимают <b>переменные</b> ($id: ID!),
        умеют алиасы, переиспользуют наборы полей через <b>фрагменты</b>, и по
        конвенции <b>идемпотентны</b> — без сайд-эффектов, как GET в REST.
        Соседние поля запроса на сервере могут резолвиться
        <b> параллельно</b>. Из React использую клиент — Apollo или urql: хук
        useQuery отдаёт {"{ data, loading, error }"}, кладёт результат в
        нормализованный кэш по __typename + id, поэтому второй экран с тем же
        юзером рендерится из кэша; fetchPolicy управляет cache-first vs
        network. Пагинация — по Relay connection spec (edges/nodes/cursor)
        или проще offset/limit с fetchMore.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Query: переменные, алиасы, фрагменты" en="Query: variables, aliases, fragments" /></h3>
        <CodeBlock
          ru={`fragment UserCard on User {   # переиспользуемый набор полей
  id
  name
  avatar(size: 64)
}

query GetUser($id: ID!) {      # именованная операция + переменная
  user(id: $id) {
    ...UserCard
    friends(first: 5) { ...UserCard }
  }
  me: user(id: "self") { name }   # алиас: два user в одном запросе
}`}
          en={`fragment UserCard on User {   # reusable set of fields
  id
  name
  avatar(size: 64)
}

query GetUser($id: ID!) {      # named operation + variable
  user(id: $id) {
    ...UserCard
    friends(first: 5) { ...UserCard }
  }
  me: user(id: "self") { name }   # alias: two user fields in one query
}`}
        />
      </div>

      <div className="card">
        <h3><L ru="useQuery в React (Apollo)" en="useQuery in React (Apollo)" /></h3>
        <CodeBlock
          ru={`const GET_USER = gql\`query GetUser($id: ID!) {
  user(id: $id) { id name avatar }
}\`;

function Profile({ id }) {
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { id },
    fetchPolicy: "cache-first",   // дефолт: сначала кэш
  });
  if (loading) return <Spinner />;
  if (error) return <ErrorView error={error} />;
  return <UserCard user={data.user} />;
}`}
          en={`const GET_USER = gql\`query GetUser($id: ID!) {
  user(id: $id) { id name avatar }
}\`;

function Profile({ id }) {
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { id },
    fetchPolicy: "cache-first",   // default: cache first
  });
  if (loading) return <Spinner />;
  if (error) return <ErrorView error={error} />;
  return <UserCard user={data.user} />;
}`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Почему у каждого запроса просят id и __typename?»",
            code: `// нормализованный кэш строит ключ: __typename + id
// нет id в query → объект не нормализуется → кэш-промахи,
// экраны не обновляются после мутаций`,
            text: "Маркер понимания Apollo-кэша: id в каждом фрагменте — не привычка, а требование нормализации.",
            en: {
              title: "\"Why does every query need id and __typename?\"",
              code: `// the normalized cache builds its key from __typename + id
// no id in the query → the object isn't normalized → cache misses,
// screens don't update after mutations`,
              text: "A signal of understanding the Apollo cache: id in every fragment isn't a habit — it's a requirement for normalization.",
            },
          },
          {
            title: "N+1 на сервере",
            code: `// query { users { posts { title } } }
// наивный resolver: 1 запрос users + N запросов posts
// фикс: DataLoader — батчит и кэширует внутри одного запроса`,
            text: "Даже фронтендера спрашивают: куда делся N+1 из REST? Он переехал в resolvers и лечится DataLoader-ом.",
            en: {
              title: "N+1 on the server",
              code: `// query { users { posts { title } } }
// naive resolver: 1 users query + N posts queries
// fix: DataLoader — batches and caches within a single request`,
              text: "Even frontend candidates get asked this: where did REST's N+1 go? It moved into resolvers, and DataLoader fixes it.",
            },
          },
          {
            title: "Query с сайд-эффектом",
            code: `query { registerVisit { ok } }  // ❌ формально сработает,
// но ломает конвенцию: query = чистое чтение (кэшируемо, retry-safe)`,
            text: "Клиенты позволяют, но кэш и ретраи рассчитаны на идемпотентность query — эффекты только в mutation.",
            en: {
              title: "A query with a side effect",
              code: `query { registerVisit { ok } }  // ❌ technically works,
// but breaks convention: query = pure read (cacheable, retry-safe)`,
              text: "Clients will let you do it, but caching and retries assume query idempotency — side effects belong in mutation only.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> query = типизированное чтение с
              переменными/фрагментами; useQuery → data/loading/error +
              нормализованный кэш (всегда запрашивай id).
            </>
          }
          en={
            <>
              <b>One-line summary:</b> query = typed reads with
              variables/fragments; useQuery → data/loading/error + a
              normalized cache (always request id).
            </>
          }
        />
      </div>
    </>
  );
}
