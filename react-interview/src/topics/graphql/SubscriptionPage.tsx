import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function SubscriptionPage() {
  return (
    <>
      <InterviewQuestion en="What is a Subscription? How does it work and when would you use it?">
        Что такое Subscription? Как работает и когда её использовать?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Subscription is the third operation type — the server
            <b> pushes</b> events to the client over a persistent connection,
            usually <b>WebSocket</b> (graphql-ws protocol) or SSE. The client
            subscribes with a query-like document; each event delivers data in
            the declared shape. On the server it's backed by a pub/sub —
            Redis or similar. Use it for genuinely real-time things:
            <b> chat</b>, live notifications, collaborative editing, tickers.
            Honest caveat: subscriptions are operationally expensive —
            stateful connections, scaling across instances needs a shared
            broker, reconnect/auth handling — so for "data that just gets
            stale" <b>polling or refetch is often enough</b>, and in Apollo a
            common pattern is one query + <b>subscribeToMore</b> that merges
            incremental events into the cached list."
          </>
        }
      >
        «Subscription — третий тип операций: сервер <b>пушит</b> события
        клиенту по постоянному соединению, обычно <b>WebSocket</b> (протокол
        graphql-ws) или SSE. Клиент подписывается документом, похожим на
        query; каждое событие приносит данные в задекларированной форме.
        На сервере под этим pub/sub — Redis или аналог. Использовать для
        по-настоящему realtime-вещей: <b>чат</b>, живые уведомления,
        совместное редактирование, котировки. Честная оговорка: подписки
        операционно дороги — stateful-соединения, масштабирование между
        инстансами требует общего брокера, reconnect и auth — поэтому для
        данных, которые «просто устаревают», часто <b>хватает polling или
        refetch</b>, а в Apollo типовой паттерн — один query +
        <b> subscribeToMore</b>, который мерджит инкрементальные события в
        закэшированный список.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Схема и клиент" en="Schema and client" /></h3>
        <CodeBlock
          ru={`type Subscription {
  messageAdded(chatId: ID!): Message!
}

subscription OnMessage($chatId: ID!) {
  messageAdded(chatId: $chatId) { id text author { name } }
}

// Apollo: query + subscribeToMore
const { data, subscribeToMore } = useQuery(GET_MESSAGES, { variables });
useEffect(() =>
  subscribeToMore({
    document: ON_MESSAGE,
    variables: { chatId },
    updateQuery: (prev, { subscriptionData }) => ({
      messages: [...prev.messages, subscriptionData.data.messageAdded],
    }),
  }), [chatId]);`}
        />
      </div>

      <div className="card">
        <h3>Query vs Mutation vs Subscription</h3>
        <CodeBlock
          ru={`               Query        Mutation       Subscription
что            чтение       запись         поток событий
транспорт      HTTP         HTTP           WebSocket/SSE
инициатор      клиент       клиент         СЕРВЕР (push)
выполнение     параллельно  последовательно долгоживущее
REST-аналог    GET          POST/PUT       WebSocket/SSE`}
          en={`               Query        Mutation       Subscription
what           read         write          event stream
transport      HTTP         HTTP           WebSocket/SSE
initiator      client       client         SERVER (push)
execution      parallel     sequential     long-lived
REST analog    GET          POST/PUT       WebSocket/SSE`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Зачем subscription, если есть polling?»",
            code: `// polling: проще, stateless, но latency = интервал + лишние запросы
// subscription: мгновенно, но stateful-инфраструктура
// правило: подписка — когда секунды задержки ломают UX (чат, торги)`,
            text: "Ждут взвешенного ответа с трейд-оффами, а не «подписки всегда лучше».",
            en: {
              title: "\"Why use subscriptions when you have polling?\"",
              code: `// polling: simpler, stateless, but latency = interval + extra requests
// subscription: instant, but stateful infrastructure
// rule of thumb: use subscriptions when seconds of delay break the UX (chat, trading)`,
              text: "They want a balanced trade-off answer, not \"subscriptions are always better.\"",
            },
          },
          {
            title: "Разрыв соединения",
            code: `// graphql-ws клиент реконнектится, НО события за время разрыва ПОТЕРЯНЫ
// паттерн: на reconnect → refetch query, потом продолжать подписку`,
            text: "Маркер прод-опыта: подписка ≠ гарантированная доставка; нужен план восстановления состояния.",
            en: {
              title: "Connection drops",
              code: `// the graphql-ws client reconnects, BUT events during the outage are LOST
// pattern: on reconnect → refetch the query, then resume the subscription`,
              text: "A signal of production experience: a subscription is not guaranteed delivery; you need a state-recovery plan.",
            },
          },
          {
            title: "Авторизация в WebSocket",
            code: `// заголовков как в HTTP-запросах нет →
// токен передаётся в connectionParams при установке соединения
// и валидируется в onConnect на сервере`,
            text: "Практический вопрос: auth для подписок устроен иначе, чем для query/mutation.",
            en: {
              title: "Authorization over WebSocket",
              code: `// there are no headers like in HTTP requests →
// the token is passed in connectionParams when the connection is established
// and validated in onConnect on the server`,
              text: "A practical question: auth for subscriptions works differently than for query/mutation.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> subscription = server push по WebSocket
              для realtime (чат, уведомления); дорога в эксплуатации — для просто
              «устаревающих» данных хватает polling/refetch.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> subscription = server push over
              WebSocket for realtime (chat, notifications); expensive to
              operate — for data that's just going stale, polling/refetch is
              usually enough.
            </>
          }
        />
      </div>
    </>
  );
}
