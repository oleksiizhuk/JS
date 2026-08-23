// Уровень MEDIUM: 20–30 строк, 3–4 неявных бага (stale closure, cleanup,
// race condition, мутация props, кэш без инвалидации, doubled submit...).
// Формат — см. ../exercises.js. Номера строк в issues — с 1 по строкам code.

export const MEDIUM_EXERCISES = [
  {
    id: "price-ticker",
    level: "medium",
    title: "PriceTicker (React)",
    context:
      "Тикер цены: раз в intervalMs миллисекунд опрашивает котировку по symbol и копит историю. PR: «добавил историю и максимум цены».",
    en: {
      title: "PriceTicker (React)",
      context:
        "A price ticker: polls the quote for a symbol every intervalMs and accumulates the history. PR: \"added history and max price.\"",
    },
    code: `function PriceTicker({ symbol, intervalMs }) {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setInterval(() => {
      const quote = getQuote(symbol);
      setPrice(quote);
      setHistory(history.concat(quote));
    }, intervalMs);
  }, [symbol]);

  const maxPrice = useMemo(
    () => Math.max(0, ...history),
    [history.length]
  );

  return (
    <section>
      <h3>{symbol}</h3>
      <p>now: {price}, max: {maxPrice}</p>
      <PriceChart points={history} />
    </section>
  );
}`,
    issues: [
      {
        lines: [6],
        severity: "blocker",
        title: "setInterval без cleanup",
        explain:
          "Эффект не возвращает функцию очистки: при смене symbol и при unmount старый интервал продолжает тикать. Накапливаются параллельные таймеры, setState после unmount, утечка.",
        fix: "const id = setInterval(...); return () => clearInterval(id);",
        en: {
          title: "setInterval with no cleanup",
          explain:
            "The effect returns no cleanup: when symbol changes or the component unmounts, the old interval keeps ticking. Parallel timers pile up, setState fires after unmount — a leak.",
          fix: "const id = setInterval(...); return () => clearInterval(id);",
        },
      },
      {
        lines: [9],
        severity: "major",
        title: "Stale closure: history из момента запуска эффекта",
        explain:
          "Колбэк интервала замкнул history таким, каким он был при запуске эффекта. concat всегда прибавляет к старому снимку — история не растёт длиннее одного элемента.",
        fix: "Функциональный апдейт: setHistory(h => h.concat(quote)).",
        en: {
          title: "Stale closure: history from when the effect ran",
          explain:
            "The interval callback closed over history as it was when the effect ran. concat always appends to that stale snapshot, so the history never grows past one element.",
          fix: "Functional update: setHistory(h => h.concat(quote)).",
        },
      },
      {
        lines: [11],
        severity: "major",
        title: "intervalMs нет в deps",
        explain:
          "Проп intervalMs используется в эффекте, но в зависимостях его нет: если родитель поменяет частоту опроса, интервал продолжит жить со старой задержкой до следующей смены symbol.",
        fix: "Добавить в deps: [symbol, intervalMs] — вместе с cleanup таймер корректно перезапустится.",
        en: {
          title: "intervalMs missing from deps",
          explain:
            "The effect uses the intervalMs prop, but it's not in the deps: if the parent changes the polling rate, the interval keeps running with the old delay until symbol changes.",
          fix: "Add it to the deps: [symbol, intervalMs] — combined with cleanup the timer restarts correctly.",
        },
      },
      {
        lines: [15],
        severity: "nit",
        title: "useMemo с deps по history.length",
        explain:
          "Работает случайно — длина всегда меняется. Но если элемент заменят при той же длине, memo отдаст устаревший максимум; exhaustive-deps такое ловит.",
        fix: "Честная зависимость: [history].",
        en: {
          title: "useMemo keyed on history.length",
          explain:
            "Works by accident — the length always changes here. But if an element is ever replaced at the same length, the memo serves a stale max; exhaustive-deps flags this.",
          fix: "Use the honest dependency: [history].",
        },
      },
    ],
  },
  {
    id: "article-preview",
    level: "medium",
    title: "ArticlePreview (React)",
    context:
      "Превью статьи подгружается по articleId; пользователь быстро листает статьи в списке. PR: «добавил обработку ошибок загрузки».",
    en: {
      title: "ArticlePreview (React)",
      context:
        "An article preview loaded by articleId; the user flips through articles quickly. PR: \"added load error handling.\"",
    },
    code: `function ArticlePreview({ articleId }) {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetch("/api/articles/" + articleId)
      .then((r) => r.json())
      .then((data) => setArticle(data))
      .catch(() => setError("Failed to load"));
  }, [articleId]);

  if (error) return <p>{error}</p>;
  if (!article) return <Spinner />;

  return (
    <article>
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <TagList tags={article.tags || []} />
    </article>
  );
}`,
    issues: [
      {
        lines: [7, 9],
        severity: "blocker",
        title: "Race condition при быстрой смене articleId",
        explain:
          "Запросы не отменяются и не помечаются устаревшими: если ответ для старого id придёт позже нового, setArticle перезапишет свежие данные старыми — на экране чужая статья.",
        fix: "AbortController + signal с abort() в cleanup, или флаг: let stale = false; return () => { stale = true; }; и проверка перед setArticle.",
        en: {
          title: "Race condition on rapid articleId changes",
          explain:
            "Requests are neither cancelled nor marked stale: if the response for an old id lands after the new one, setArticle overwrites fresh data with stale data — the wrong article on screen.",
          fix: "AbortController + signal with abort() in cleanup, or a flag: let stale = false; return () => { stale = true; }; checked before setArticle.",
        },
      },
      {
        lines: [8],
        severity: "major",
        title: "r.json() без проверки r.ok",
        explain:
          "fetch не reject-ится на 404/500 — тело ошибки распарсится и уедет в setArticle как «статья»: catch не сработает, пользователь увидит битый контент вместо сообщения об ошибке.",
        fix: "if (!r.ok) throw new Error(\"HTTP \" + r.status); перед r.json().",
        en: {
          title: "r.json() without checking r.ok",
          explain:
            "fetch doesn't reject on 404/500 — the error body gets parsed and lands in setArticle as an \"article\": catch never fires and the user sees broken content instead of an error message.",
          fix: "if (!r.ok) throw new Error(\"HTTP \" + r.status); before r.json().",
        },
      },
      {
        lines: [6],
        severity: "major",
        title: "Сбрасывается error, но не article",
        explain:
          "При смене articleId старая статья остаётся в state: пока грузится новая, на экране прежняя без единого намёка (article truthy — спиннер не покажется). Пользователь читает не тот контент.",
        fix: "Сбрасывать и данные: setArticle(null); либо единый state { status, data, error }.",
        en: {
          title: "error is reset, article is not",
          explain:
            "When articleId changes, the old article stays in state: while the new one loads, the previous one is displayed with no hint at all (article is truthy, so no spinner). The user reads the wrong content.",
          fix: "Reset the data too: setArticle(null); or a single { status, data, error } state.",
        },
      },
      {
        lines: [10],
        severity: "nit",
        title: "catch глотает причину",
        explain:
          "Реальная ошибка (сетевая или брошенная в .then) выбрасывается: в лог ничего не попадает, пользователь и разработчик видят одинаково бесполезное «Failed to load».",
        fix: ".catch((e) => { report(e); setError(...); }) — логировать причину и слать в мониторинг.",
        en: {
          title: "catch swallows the cause",
          explain:
            "The actual error (network or thrown inside .then) is discarded: nothing is logged, and both the user and the developer get the same useless \"Failed to load\".",
          fix: ".catch((e) => { report(e); setError(...); }) — log the cause and send it to monitoring.",
        },
      },
    ],
  },
  {
    id: "orders-screen",
    level: "medium",
    title: "OrdersScreen (RN)",
    context:
      "Экран заказов в React Native: pull-to-refresh и рефетч при возврате приложения из фона. PR: «добавил сортировку по дате».",
    en: {
      title: "OrdersScreen (RN)",
      context:
        "A React Native orders screen: pull-to-refresh plus a refetch when the app returns from background. PR: \"added sorting by date.\"",
    },
    code: `function OrdersScreen({ orders, onOpen }) {
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") refetchOrders();
    });
  }, []);

  const recent = orders.sort((a, b) => b.createdAt - a.createdAt);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchOrders();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <FlatList
      data={recent}
      refreshing={refreshing}
      onRefresh={onRefresh}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item }) => (
        <OrderCard order={item} onPress={() => onOpen(item.id)} />
      )}
    />
  );
}`,
    issues: [
      {
        lines: [4, 7],
        severity: "major",
        title: "Подписка на AppState без cleanup",
        explain:
          "sub.remove() никогда не вызывается: после unmount экрана слушатель жив, refetchOrders дёргается с уже закрытых экранов — утечка и лишние запросы при каждом возврате из фона.",
        fix: "В эффекте вернуть очистку: return () => sub.remove();",
        en: {
          title: "AppState subscription with no cleanup",
          explain:
            "sub.remove() is never called: after the screen unmounts the listener stays alive, and refetchOrders fires from screens that are long gone — a leak plus extra requests on every return from background.",
          fix: "Return a cleanup from the effect: return () => sub.remove();",
        },
      },
      {
        lines: [9],
        severity: "blocker",
        title: "sort мутирует props-массив orders",
        explain:
          "Array.prototype.sort сортирует на месте: портится массив родителя (или стора) в обход setState. У всех остальных потребителей orders порядок «сам собой» меняется, memo-сравнения молчат.",
        fix: "[...orders].sort(...) или orders.toSorted(...); дорого — обернуть в useMemo с deps [orders].",
        en: {
          title: "sort mutates the orders props array",
          explain:
            "Array.prototype.sort sorts in place: the parent's (or store's) array is corrupted behind setState's back. Every other consumer of orders sees the order change \"by itself\", and memo comparisons stay silent.",
          fix: "[...orders].sort(...) or orders.toSorted(...); if expensive, wrap in useMemo with [orders].",
        },
      },
      {
        lines: [24],
        severity: "major",
        title: "keyExtractor по index",
        explain:
          "Список пересортировывается и обновляется по refresh — индексы переезжают между рендерами: FlatList зря пере-рендерит и рециклит строки, локальный state строк липнет к позициям.",
        fix: "keyExtractor={(item) => String(item.id)}",
        en: {
          title: "Index-based keyExtractor",
          explain:
            "The list is re-sorted and refreshed — indexes shift between renders: FlatList re-renders and recycles rows for nothing, and per-row local state sticks to positions.",
          fix: "keyExtractor={(item) => String(item.id)}",
        },
      },
      {
        lines: [26],
        severity: "nit",
        title: "Инлайн-обработчик на каждый item",
        explain:
          "Новая стрелка onPress на каждый рендер каждой строки: если OrderCard обёрнут в memo, мемоизация не сработает. На длинных списках RN это заметно.",
        fix: "Передавать в OrderCard id и стабильный колбэк (useCallback), onPress звать внутри карточки.",
        en: {
          title: "Inline handler per item",
          explain:
            "A fresh onPress arrow for every row on every render: if OrderCard is wrapped in memo, the memoization is defeated. On long RN lists this is noticeable.",
          fix: "Pass the id and a stable callback (useCallback) into OrderCard and call onPress inside the card.",
        },
      },
    ],
  },
  {
    id: "user-cache",
    level: "medium",
    title: "getUser + cache (JS)",
    context:
      "Модуль профиля: getUser с кэшем, отрисовка профиля и обновление пользователя. PR: «добавил кэширование запросов».",
    en: {
      title: "getUser + cache (JS)",
      context:
        "A profile module: getUser with a cache, profile rendering, and a user update. PR: \"added request caching.\"",
    },
    code: `const cache = {};

async function getUser(id) {
  if (cache[id]) return cache[id];
  const res = await fetch("/api/users/" + id);
  const user = await res.json();
  cache[id] = user;
  return user;
}

async function renderProfile(id) {
  try {
    const user = await getUser(id);
    document.title = user.name;
    showProfile(user);
  } catch (e) {
    showError("Something went wrong");
  }
}

async function updateUser(id, patch) {
  const res = await fetch("/api/users/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return res.json();
}`,
    issues: [
      {
        lines: [4],
        severity: "major",
        title: "Кэшируется значение, а не promise",
        explain:
          "Пока первый запрос в полёте, cache[id] ещё пуст — параллельные вызовы getUser(тот же id) промахиваются мимо кэша и дублируют запрос (типично при монтировании нескольких компонентов).",
        fix: "Класть в кэш сам promise: cache[id] = fetch(...).then(...) — и возвращать его всем.",
        en: {
          title: "The value is cached, not the promise",
          explain:
            "While the first request is in flight, cache[id] is still empty — concurrent getUser calls for the same id miss the cache and duplicate the request (typical when several components mount at once).",
          fix: "Cache the promise itself: cache[id] = fetch(...).then(...) — and hand it to every caller.",
        },
      },
      {
        lines: [6],
        severity: "blocker",
        title: "res.json() без res.ok — отравление кэша",
        explain:
          "fetch не reject-ится на 404/500: тело ошибки распарсится и строкой ниже навсегда осядет в кэше как «пользователь». Все последующие вызовы получают мусор без единого запроса к серверу.",
        fix: "if (!res.ok) throw new Error(\"HTTP \" + res.status); кэшировать только успех (а при кэшировании promise — чистить кэш в catch).",
        en: {
          title: "res.json() without res.ok — cache poisoning",
          explain:
            "fetch doesn't reject on 404/500: the error body gets parsed and, one line below, settles into the cache forever as a \"user\". Every later call gets garbage without a single request to the server.",
          fix: "if (!res.ok) throw new Error(\"HTTP \" + res.status); cache only success (and when caching a promise, clear the cache in catch).",
        },
      },
      {
        lines: [7, 27],
        severity: "major",
        title: "Кэш без инвалидации",
        explain:
          "updateUser меняет пользователя на сервере, но cache[id] никто не трогает: getUser до конца сессии отдаёт устаревшие данные — пользователь сохранил имя, а на экране всюду старое.",
        fix: "После успешного PATCH: delete cache[id] (или положить свежий ответ сервера); в общем случае — TTL.",
        en: {
          title: "Cache with no invalidation",
          explain:
            "updateUser changes the user on the server, but nobody touches cache[id]: getUser serves stale data for the rest of the session — the user saved a new name, yet the old one shows everywhere.",
          fix: "After a successful PATCH: delete cache[id] (or store the server's fresh response); in general, add a TTL.",
        },
      },
      {
        lines: [16, 17],
        severity: "nit",
        title: "catch глотает причину и маскирует баги рендера",
        explain:
          "showProfile тоже внутри try: любое его исключение (обычный programmer error) превращается в «Something went wrong», а сам e никуда не логируется — дебажить нечем.",
        fix: "Логировать/репортить e; рендер вынести из try либо различать сетевые и прочие ошибки.",
        en: {
          title: "catch swallows the cause and masks render bugs",
          explain:
            "showProfile sits inside the try too: any exception it throws (a plain programmer error) becomes \"Something went wrong\", and e itself is never logged — nothing to debug with.",
          fix: "Log/report e; move rendering out of the try or distinguish network errors from the rest.",
        },
      },
    ],
  },
  {
    id: "feedback-form",
    level: "medium",
    title: "FeedbackForm (React, формы)",
    context:
      "Форма обратной связи с предзаполнением из пропса defaults. PR: «универсальный setField — меньше кода на поле».",
    en: {
      title: "FeedbackForm (React, forms)",
      context:
        "A feedback form prefilled from the defaults prop. PR: \"a generic setField — less code per field.\"",
    },
    code: `function FeedbackForm({ onSent, defaults }) {
  const [form, setForm] = useState(defaults);
  const [sending, setSending] = useState(false);

  const setField = (name) => (e) => {
    form[name] = e.target.value;
    setForm(form);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.sendFeedback(form);
      if (res.ok) onSent();
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.email} onChange={setField("email")} />
      <textarea value={form.message} onChange={setField("message")} />
      <button type="submit" disabled={!form.message}>
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}`,
    issues: [
      {
        lines: [6, 7],
        severity: "blocker",
        title: "Мутация state + setForm с той же ссылкой",
        explain:
          "form правится на месте, ссылка не меняется — React бэйлаутит такой setState: ре-рендера нет, контролируемые инпуты визуально «замерзают», хотя объект в памяти меняется.",
        fix: "setForm({ ...form, [name]: e.target.value }) — или функциональный апдейт setForm(f => ({ ...f, [name]: e.target.value })).",
        en: {
          title: "State mutation + setForm with the same reference",
          explain:
            "form is edited in place and the reference never changes — React bails out of such a setState: no re-render, the controlled inputs visually freeze even though the object in memory changes.",
          fix: "setForm({ ...form, [name]: e.target.value }) — or the functional form setForm(f => ({ ...f, [name]: e.target.value })).",
        },
      },
      {
        lines: [2],
        severity: "major",
        title: "В state кладётся сам объект пропса defaults",
        explain:
          "useState(defaults) сохраняет ссылку на объект родителя: вместе с мутацией в setField форма портит defaults у родителя и у всех, кто этот объект переиспользует (сброс формы вернёт уже грязные значения).",
        fix: "Копия при инициализации: useState(() => ({ ...defaults })).",
        en: {
          title: "The defaults prop object itself goes into state",
          explain:
            "useState(defaults) stores a reference to the parent's object: combined with the mutation in setField, the form corrupts defaults for the parent and everyone reusing that object (a form reset restores already-dirty values).",
          fix: "Copy on init: useState(() => ({ ...defaults })).",
        },
      },
      {
        lines: [25],
        severity: "major",
        title: "Doubled submit: disabled не учитывает sending",
        explain:
          "Кнопка блокируется только при пустом message: пока запрос в полёте, она активна («Sending...», но кликабельна) — нетерпеливый двойной клик отправляет фидбек дважды.",
        fix: "disabled={sending || !form.message}",
        en: {
          title: "Doubled submit: disabled ignores sending",
          explain:
            "The button is only disabled when message is empty: while the request is in flight it stays active (\"Sending...\", yet clickable) — an impatient double click submits the feedback twice.",
          fix: "disabled={sending || !form.message}",
        },
      },
      {
        lines: [23, 24],
        severity: "nit",
        title: "setField создаёт новые обработчики на каждый рендер",
        explain:
          "setField(\"email\") — новая замыкающая функция при каждом рендере: memo-обёртки полей не сработают. Мелочь здесь, но в больших формах заметно.",
        fix: "Один стабильный обработчик (useCallback) + имя поля из e.target.name или data-атрибута.",
        en: {
          title: "setField creates fresh handlers on every render",
          explain:
            "setField(\"email\") produces a new closure on each render: memo wrappers around fields won't help. Trivial here, but noticeable in large forms.",
          fix: "One stable handler (useCallback) + the field name from e.target.name or a data attribute.",
        },
      },
    ],
  },
];
