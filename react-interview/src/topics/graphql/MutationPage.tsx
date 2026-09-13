import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function MutationPage() {
  return (
    <>
      <InterviewQuestion en="What is a Mutation? How do you update the UI after one?">
        Что такое Mutation? Как обновляешь UI после неё?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Mutation is the <b>write</b> operation — create, update, delete.
            Unlike query fields, mutation fields run <b>sequentially</b>, not
            in parallel. Best practice: take an <b>input object</b> and return
            a <b>payload</b> containing the changed entity — the client
            re-requests its fields right in the mutation. UI update paths,
            from simple to advanced: if the mutation returns an object with
            the same <b>id and __typename</b>, the normalized cache updates
            every screen automatically; for lists (create/delete) that's not
            enough — either <b>refetchQueries</b> (simple, an extra round
            trip) or a manual <b>cache update</b> function; and for instant UX
            an <b>optimistic response</b> — the UI updates immediately and
            rolls back on error. Always handle both error layers: network and
            the errors array in the response."
          </>
        }
      >
        «Mutation — операция <b>записи</b>: создать, обновить, удалить.
        В отличие от query, поля мутации выполняются <b>последовательно</b>,
        не параллельно. Best practice: принимать <b>input-объект</b> и
        возвращать <b>payload</b> с изменённой сущностью — клиент прямо в
        мутации перезапрашивает её поля. Пути обновления UI от простого к
        продвинутому: если мутация вернула объект с теми же <b>id и
        __typename</b>, нормализованный кэш обновит все экраны автоматически;
        для списков (создание/удаление) этого мало — либо
        <b> refetchQueries</b> (просто, но лишний round trip), либо ручной
        <b> update</b> кэша; а для мгновенного UX — <b>optimistic
        response</b>: UI обновляется сразу и откатывается при ошибке.
        Обрабатывать оба слоя ошибок: сетевой и массив errors в ответе.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Схема и вызов" en="Schema and call" /></h3>
        <CodeBlock
          ru={`type Mutation {
  addTodo(input: AddTodoInput!): AddTodoPayload!
}
type AddTodoPayload { todo: Todo, errors: [UserError!]! }

mutation AddTodo($input: AddTodoInput!) {
  addTodo(input: $input) {
    todo { id text done }     # вернувшиеся поля обновят кэш
    errors { field message }
  }
}`}
          en={`type Mutation {
  addTodo(input: AddTodoInput!): AddTodoPayload!
}
type AddTodoPayload { todo: Todo, errors: [UserError!]! }

mutation AddTodo($input: AddTodoInput!) {
  addTodo(input: $input) {
    todo { id text done }     # returned fields will update the cache
    errors { field message }
  }
}`}
        />
      </div>

      <div className="card">
        <h3><L ru="useMutation + оптимистичное обновление" en="useMutation + optimistic updates" /></h3>
        <CodeBlock
          ru={`const [addTodo, { loading }] = useMutation(ADD_TODO, {
  optimisticResponse: {
    addTodo: { todo: { __typename: "Todo", id: "tmp", text, done: false } },
  },
  update(cache, { data }) {          // ручное добавление в список
    cache.modify({
      fields: {
        todos(existing = []) {
          const ref = cache.writeFragment({ data: data.addTodo.todo, ... });
          return [...existing, ref];
        },
      },
    });
  },
  // или проще: refetchQueries: [{ query: GET_TODOS }]
});`}
          en={`const [addTodo, { loading }] = useMutation(ADD_TODO, {
  optimisticResponse: {
    addTodo: { todo: { __typename: "Todo", id: "tmp", text, done: false } },
  },
  update(cache, { data }) {          // manually add to the list
    cache.modify({
      fields: {
        todos(existing = []) {
          const ref = cache.writeFragment({ data: data.addTodo.todo, ... });
          return [...existing, ref];
        },
      },
    });
  },
  // or simpler: refetchQueries: [{ query: GET_TODOS }]
});`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Обновил сущность — почему список не обновился?»",
            code: `// UPDATE существующего объекта: кэш обновит сам (id совпал)
// CREATE/DELETE: кэш НЕ знает, в какие списки положить/убрать
// → update-функция или refetchQueries`,
            text: "Ключевое различие: автомагия нормализации работает только для изменённых полей существующих объектов.",
            en: {
              title: "\"I updated an entity — why didn't the list update?\"",
              code: `// UPDATE of an existing object: the cache updates itself (id matched)
// CREATE/DELETE: the cache doesn't know which lists to add to/remove from
// → an update function or refetchQueries`,
              text: "The key distinction: cache normalization's automagic only applies to changed fields on existing objects.",
            },
          },
          {
            title: "Мутация не вернула изменённые поля",
            code: `mutation { toggleTodo(id: 5) { ok } }   // ❌ кэш не обновится
mutation { toggleTodo(id: 5) { todo { id done } } } // ✅`,
            text: "Payload должен содержать сущность с id — иначе клиент не узнает, что поменялось.",
            en: {
              title: "The mutation didn't return the changed fields",
              code: `mutation { toggleTodo(id: 5) { ok } }   // ❌ cache won't update
mutation { toggleTodo(id: 5) { todo { id done } } } // ✅`,
              text: "The payload must include the entity with its id — otherwise the client has no way to know what changed.",
            },
          },
          {
            title: "Optimistic UI: что при ошибке?",
            code: `// Apollo автоматически ОТКАТИТ оптимистичную запись,
// но UX-обработку (toast, восстановление формы) пишешь сам`,
            text: "Проверяют, что понимаешь механику: optimistic - это временная запись в кэш, откатываемая при reject.",
            en: {
              title: "Optimistic UI: what happens on error?",
              code: `// Apollo automatically ROLLS BACK the optimistic write,
// but the UX handling (toast, restoring the form) is on you`,
              text: "This checks that you understand the mechanics: optimistic is a temporary cache write that's rolled back on rejection.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> mutation = запись (последовательная), voзвращай
              сущность с id; UI: авто-мердж кэша → refetch/update для списков →
              optimisticResponse для мгновенности.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> mutation = writes (sequential), return
              the entity with its id; UI: auto cache merge → refetch/update
              for lists → optimisticResponse for instant feedback.
            </>
          }
        />
      </div>
    </>
  );
}
