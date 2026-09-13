import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  CodeBlock,
  Gotchas,
  L,
} from "./InterviewBlocks";

export default function ClaudeAi() {
  return (
    <>
      <InterviewQuestion en="Do you use AI tools? How would you integrate an LLM like Claude into a frontend app?">
        Используешь ли AI-инструменты? Как бы ты интегрировал LLM вроде Claude
        во frontend-приложение?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Claude is Anthropic's family of LLMs. The current lineup is the
            Claude 5 generation — <b>Fable 5</b> (the most capable),{" "}
            <b>Opus 5</b> (the workhorse for agentic coding), <b>Sonnet 5</b>{" "}
            (speed/intelligence balance) — plus the fast and cheap{" "}
            <b>Haiku 4.5</b>. Integration-wise everything goes through one
            endpoint — the <b>Messages API</b> (POST /v1/messages) via the
            official SDK. Key architectural rule for a frontend dev:{" "}
            <b>never call the API from the browser</b> — the API key would
            leak, so requests go through your backend (a thin proxy or BFF).
            For UX I'd use <b>streaming</b> so tokens render as they arrive,
            like ChatGPT does. For features beyond chat there's{" "}
            <b>tool use</b>: the model doesn't execute anything itself — it
            returns a structured request "call this function with these
            arguments", my code executes it and sends the result back; that
            loop is what an agent is. For reliability and cost there are{" "}
            <b>structured outputs</b> (schema-valid JSON) and{" "}
            <b>prompt caching</b> (~10× cheaper repeated context). Day to day
            I also use <b>Claude Code</b> — a terminal agent that reads the
            repo, edits files and runs tests itself."
          </>
        }
      >
        «Claude — семейство LLM от Anthropic. Актуальная линейка — поколение
        Claude 5: <b>Fable 5</b> (самая способная), <b>Opus 5</b> (рабочая
        лошадка для агентного кодинга), <b>Sonnet 5</b> (баланс
        скорость/интеллект) — плюс быстрая и дешёвая <b>Haiku 4.5</b>. С точки
        зрения интеграции всё идёт через один эндпоинт — <b>Messages API</b>{" "}
        (POST /v1/messages) через официальный SDK. Ключевое архитектурное
        правило для фронтендера: <b>никогда не звать API из браузера</b> —
        утечёт ключ, поэтому запросы идут через свой бэкенд (тонкий прокси или
        BFF). Для UX использую <b>стриминг</b> — токены рендерятся по мере
        прихода, как в ChatGPT. Для фич сложнее чата есть <b>tool use</b>:
        модель сама ничего не исполняет — она возвращает структурированный
        запрос «вызови такую-то функцию с такими аргументами», мой код её
        исполняет и шлёт результат обратно; этот цикл и есть агент. За
        надёжность и экономию отвечают <b>structured outputs</b> (JSON строго
        по схеме) и <b>prompt caching</b> (повторяющийся контекст ~в 10 раз
        дешевле). В ежедневной работе использую <b>Claude Code</b> — агент в
        терминале, который сам читает репозиторий, правит файлы и гоняет
        тесты.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>
          <L ru="Семейство моделей (лето 2026)" en="The model family (summer 2026)" />
        </h3>
        <CodeBlock
          ru={`// Модель          | model id          | Контекст | Зачем
// ----------------|-------------------|----------|--------------------------------
// Claude Fable 5  | claude-fable-5    | 1M       | самая умная: сложнейший research,
//                 |                   |          | долгие автономные агентные задачи
// Claude Opus 5   | claude-opus-5     | 1M       | дефолт для agentic coding
// Claude Sonnet 5 | claude-sonnet-5   | 1M       | баланс цена/скорость/интеллект
// Claude Haiku 4.5| claude-haiku-4-5  | 200K     | быстрые дешёвые задачи:
//                 |                   |          | классификация, автокомплит, чат

// Правило выбора: начинай с самой умной, которая укладывается в бюджет,
// и спускайся вниз там, где evals показывают «качество не падает».
// 1M токенов контекста ≈ целый средний репозиторий в одном запросе.`}
          en={`// Model           | model id          | Context | What for
// ----------------|-------------------|---------|--------------------------------
// Claude Fable 5  | claude-fable-5    | 1M      | most capable: hardest research,
//                 |                   |         | long autonomous agentic runs
// Claude Opus 5   | claude-opus-5     | 1M      | the default for agentic coding
// Claude Sonnet 5 | claude-sonnet-5   | 1M      | price/speed/intelligence balance
// Claude Haiku 4.5| claude-haiku-4-5  | 200K    | fast cheap tasks:
//                 |                   |         | classification, autocomplete, chat

// Selection rule: start with the smartest model that fits the budget,
// then step down wherever evals show quality holds.
// A 1M-token context ≈ an entire mid-size repo in a single request.`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Базовый вызов: Messages API + стриминг"
            en="The basic call: Messages API + streaming"
          />
        </h3>
        <CodeBlock
          ru={`// На БЭКЕНДЕ (Node) — ключ живёт в process.env, не в браузере
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();   // читает ANTHROPIC_API_KEY из env

// Обычный запрос: одна пара запрос-ответ
const res = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 16000,
  system: "Ты — ассистент службы поддержки интернет-магазина.",
  messages: [{ role: "user", content: "Где мой заказ #1234?" }],
});
// res.content — массив блоков; текст — в блоках с type: "text"

// Стриминг — для чат-UI (токены летят сразу, TTFB маленький)
const messages = [{ role: "user", content: "Расскажи про доставку" }];
const stream = client.messages.stream({ model: "claude-opus-5",
  max_tokens: 16000, messages });
for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta")
    sendToFrontend(event.delta.text);   // на фронт — через SSE/WebSocket
}
// API stateless: каждый запрос несёт ВСЮ историю messages —
// как иммутабельный state в React: append, а не мутация на сервере`}
          en={`// On the BACKEND (Node) — the key lives in process.env, not the browser
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();   // reads ANTHROPIC_API_KEY from env

// A plain request: one request/response pair
const res = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 16000,
  system: "You are a support assistant for an online store.",
  messages: [{ role: "user", content: "Where is my order #1234?" }],
});
// res.content is an array of blocks; text lives in blocks with type: "text"

// Streaming — for chat UIs (tokens arrive immediately, tiny TTFB)
const messages = [{ role: "user", content: "Tell me about shipping" }];
const stream = client.messages.stream({ model: "claude-opus-5",
  max_tokens: 16000, messages });
for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta")
    sendToFrontend(event.delta.text);   // to the frontend via SSE/WebSocket
}
// The API is stateless: every request carries the ENTIRE messages history —
// like immutable state in React: append, never server-side mutation`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Tool use: как LLM превращается в агента"
            en="Tool use: how an LLM becomes an agent"
          />
        </h3>
        <CodeBlock
          ru={`// 1. Описываю функции JSON-схемой — модель их НЕ исполняет,
//    она лишь просит их вызвать
const tools = [{
  name: "get_order_status",
  description: "Возвращает статус заказа по его номеру",
  input_schema: {
    type: "object",
    properties: { orderId: { type: "string" } },
    required: ["orderId"],
  },
}];

// 2. Агентный цикл: запрос → tool_use → исполняю у себя → tool_result → ...
let res = await client.messages.create({ model, max_tokens, tools, messages });
let steps = 0;
while (res.stop_reason === "tool_use" && steps++ < 10) { // лимит итераций!
  // блоков tool_use может быть НЕСКОЛЬКО (parallel tool use)
  const calls = res.content.filter((b) => b.type === "tool_use");
  const results = await Promise.all(calls.map(async (call) => ({
    type: "tool_result",
    tool_use_id: call.id,
    content: JSON.stringify(await runTool(call)), // исполняет МОЙ код
  })));
  messages.push({ role: "assistant", content: res.content });
  messages.push({ role: "user", content: results }); // ВСЕ результаты — одним
  res = await client.messages.create({ model, max_tokens, tools, messages });
}
// Цикл крутится, пока модель просит инструменты; SDK умеет крутить его сам
// (tool runner). Агент = LLM + инструменты + цикл. Всё.`}
          en={`// 1. I describe functions with a JSON schema — the model does NOT run them,
//    it only asks for them to be called
const tools = [{
  name: "get_order_status",
  description: "Returns the status of an order by its id",
  input_schema: {
    type: "object",
    properties: { orderId: { type: "string" } },
    required: ["orderId"],
  },
}];

// 2. The agent loop: request → tool_use → I execute it → tool_result → ...
let res = await client.messages.create({ model, max_tokens, tools, messages });
let steps = 0;
while (res.stop_reason === "tool_use" && steps++ < 10) { // iteration cap!
  // there can be SEVERAL tool_use blocks (parallel tool use)
  const calls = res.content.filter((b) => b.type === "tool_use");
  const results = await Promise.all(calls.map(async (call) => ({
    type: "tool_result",
    tool_use_id: call.id,
    content: JSON.stringify(await runTool(call)), // MY code executes it
  })));
  messages.push({ role: "assistant", content: res.content });
  messages.push({ role: "user", content: results }); // ALL results in ONE msg
  res = await client.messages.create({ model, max_tokens, tools, messages });
}
// The loop spins while the model keeps requesting tools; the SDK can drive it
// for you (tool runner). Agent = LLM + tools + loop. That's it.`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Что ещё стоит назвать на собесе"
            en="What else is worth naming in an interview"
          />
        </h3>
        <CodeBlock
          ru={`// Structured outputs — гарантированный JSON по схеме (не «попроси JSON
// в промпте и парси с молитвой»):
output_config: { format: { type: "json_schema", schema: MY_SCHEMA } }

// Prompt caching — префикс промпта (system, инструменты, документы)
// кэшируется: чтение из кэша ≈ 10% цены input-токенов
system: [{ type: "text", text: BIG_DOC, cache_control: { type: "ephemeral" } }]

// MCP (Model Context Protocol) — открытый стандарт «USB-порта» для LLM:
// один протокол подключает модель к GitHub, Jira, Figma, своей БД...

// Claude Code — агент в терминале/IDE: читает репо, правит файлы,
// запускает тесты; управляется через CLAUDE.md и скиллы проекта.

// Adaptive thinking — модель сама решает, сколько «думать» перед ответом;
// глубина — параметром effort (low / medium / high / xhigh / max), не промптом.`}
          en={`// Structured outputs — guaranteed schema-valid JSON (not "ask for JSON
// in the prompt and parse with fingers crossed"):
output_config: { format: { type: "json_schema", schema: MY_SCHEMA } }

// Prompt caching — the prompt prefix (system, tools, documents)
// gets cached: cache reads cost ≈ 10% of the input-token price
system: [{ type: "text", text: BIG_DOC, cache_control: { type: "ephemeral" } }]

// MCP (Model Context Protocol) — an open "USB port" standard for LLMs:
// one protocol connects the model to GitHub, Jira, Figma, your DB...

// Claude Code — an agent in the terminal/IDE: reads the repo, edits files,
// runs tests; steered via CLAUDE.md and project skills.

// Adaptive thinking — the model decides how much to "think" before answering;
// depth = the effort parameter (low / medium / high / xhigh / max), not the prompt.`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "API-ключ во frontend-коде",
            code: `// ❌ утечка: ключ виден каждому в DevTools → Network
const client = new Anthropic({ apiKey: "sk-ant-...", dangerouslyAllowBrowser: true });

// ✅ браузер → мой /api/chat → Anthropic; ключ только на сервере`,
            text: "Флаг называется dangerouslyAllowBrowser не просто так. Любой ключ, попавший в бандл, — скомпрометирован. На собесе это вопрос про архитектуру: тонкий бэкенд-прокси (BFF), rate limiting, авторизация — на своей стороне.",
            en: {
              title: "An API key in frontend code",
              code: `// ❌ a leak: the key is visible to anyone in DevTools → Network
const client = new Anthropic({ apiKey: "sk-ant-...", dangerouslyAllowBrowser: true });

// ✅ browser → my /api/chat → Anthropic; the key stays on the server`,
              text: "The flag is called dangerouslyAllowBrowser for a reason. Any key that ships in the bundle is compromised. In an interview this is an architecture question: a thin backend proxy (BFF), rate limiting and auth live on your side.",
            },
          },
          {
            title: "«Модель запомнит наш диалог»",
            code: `// API — stateless. У модели НЕТ памяти между запросами.
// «Память» чата — это твой код, который шлёт историю целиком:
messages: [...вся история диалога, новоеСообщение]
// Растёт история → растёт цена каждого запроса → нужна
// суммаризация/компакция старых сообщений`,
            text: "Классическое заблуждение. Каждый запрос независим: контекст — это то, что ты прислал в messages, и ничего больше. Отсюда же и приём prompt caching: неизменный префикс не пересчитывается за полную цену.",
            en: {
              title: "\"The model will remember our conversation\"",
              code: `// The API is stateless. The model has NO memory between requests.
// A chat's "memory" is your code sending the full history:
messages: [...entireDialogHistory, newMessage]
// History grows → every request gets pricier → you need
// summarization/compaction of older messages`,
              text: "A classic misconception. Every request is independent: the context is exactly what you sent in messages, nothing more. This is also why prompt caching works: the unchanged prefix isn't re-billed at full price.",
            },
          },
          {
            title: "«Агент сам исполняет код»",
            code: `// Модель возвращает НАМЕРЕНИЕ, а не исполняет его:
{ type: "tool_use", name: "delete_user", input: { id: 42 } }
// Исполняет ТВОЙ код — значит, твой код и отвечает за:
// валидацию input, права доступа, подтверждение опасных действий`,
            text: "Tool use — это структурированный вывод, а не удалённое исполнение. Безопасность агента = безопасность твоего цикла: gate на разрушительные операции, allowlist инструментов, human-in-the-loop для необратимого.",
            en: {
              title: "\"The agent executes code itself\"",
              code: `// The model returns an INTENT, it doesn't execute it:
{ type: "tool_use", name: "delete_user", input: { id: 42 } }
// YOUR code executes it — so your code is responsible for:
// input validation, permissions, confirmation of dangerous actions`,
              text: "Tool use is structured output, not remote execution. An agent's security = your loop's security: gate destructive operations, allowlist tools, keep a human in the loop for anything irreversible.",
            },
          },
          {
            title: "Галлюцинации: LLM уверенно ошибается",
            code: `// LLM — вероятностная модель текста, а не база фактов.
// Митигации в продукте:
// 1) grounding: дай источники в контекст (RAG, tool use) и проси цитировать
// 2) structured outputs + валидация на своей стороне
// 3) не давать модели «последнее слово» в критичных сценариях`,
            text: "Вопрос «как бороться с галлюцинациями» — почти обязательный. Ответ уровня senior: не «промптом попросить не врать», а архитектурно — источники в контексте, проверяемый вывод, человек в петле там, где цена ошибки высока.",
            en: {
              title: "Hallucinations: an LLM is confidently wrong",
              code: `// An LLM is a probabilistic text model, not a fact database.
// Product-level mitigations:
// 1) grounding: put sources in context (RAG, tool use) and ask for citations
// 2) structured outputs + validation on your side
// 3) don't give the model the final word in critical flows`,
              text: "\"How do you deal with hallucinations\" is a near-mandatory question. The senior-level answer isn't \"prompt it not to lie\" — it's architectural: sources in context, verifiable output, a human in the loop where mistakes are expensive.",
            },
          },
          {
            title: "Токены = деньги и задержка",
            code: `// Платишь за input + output токены; контекст 1M ≠ «бесплатно шли всё».
// Рычаги экономии:
// - модель по задаче (Haiku для классификации, Opus для кодинга)
// - prompt caching для повторяющегося префикса (~0.1× цены чтения)
// - стриминг: не дешевле, но UX «мгновенного» ответа
// - batch API: −50% для нечувствительных к задержке фоновых задач`,
            text: "Хороший кандидат думает про цену запроса как про перфоманс-бюджет: измеряет (usage в ответе), кэширует, выбирает модель по задаче — как выбирают структуру данных.",
            en: {
              title: "Tokens = money and latency",
              code: `// You pay for input + output tokens; a 1M context ≠ "send everything free".
// Cost levers:
// - model per task (Haiku for classification, Opus for coding)
// - prompt caching for the repeated prefix (~0.1× price on reads)
// - streaming: not cheaper, but the UX of an "instant" answer
// - batch API: −50% for latency-insensitive background jobs`,
              text: "A good candidate treats request cost like a performance budget: measure it (the usage field in the response), cache, pick the model per task — the way you'd pick a data structure.",
            },
          },
        ]}
      />

      <div className="redflag">
        <b>
          <L
            ru="⚠️ Red flag: «положу ключ в .env фронтенда — он же в env»."
            en={`⚠️ Red flag: "I'll put the key in the frontend .env — it's env after all".`}
          />
        </b>
        <br />
        <L
          ru={
            <>
              Почему: всё, что во frontend-«env» (VITE_*, REACT_APP_*,
              NEXT_PUBLIC_*), <b>инлайнится в бандл при сборке</b> — это
              публичный текст, а не секрет. «Env» на фронте — механизм
              конфигурации, а не хранилище секретов. Правильная формулировка:
              «секреты живут только на сервере; фронтовый env — для публичной
              конфигурации (URL API, фичефлаги), а запросы к LLM идут через мой
              бэкенд с авторизацией и rate limiting'ом».
            </>
          }
          en={
            <>
              Why: anything in a frontend "env" (VITE_*, REACT_APP_*,
              NEXT_PUBLIC_*) <b>gets inlined into the bundle at build time</b> —
              it's public text, not a secret. Frontend env is a configuration
              mechanism, not a secret store. The right phrasing: "secrets live
              only on the server; frontend env is for public config (API URLs,
              feature flags), and LLM requests go through my backend with auth
              and rate limiting."
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> Claude = семейство моделей (Fable /
              Opus / Sonnet / Haiku) за одним stateless Messages API; ключ — на
              бэкенде, стриминг — для UX, tool use — модель просит, твой код
              исполняет; structured outputs и prompt caching — надёжность и
              экономия.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> Claude = a family of models (Fable /
              Opus / Sonnet / Haiku) behind one stateless Messages API; the key
              lives on the backend, streaming is for UX, in tool use the model
              asks and your code executes; structured outputs and prompt
              caching buy reliability and savings.
            </>
          }
        />
      </div>
    </>
  );
}
