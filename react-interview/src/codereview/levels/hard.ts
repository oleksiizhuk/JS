// Уровень HARD: 35–50 строк правдоподобного продакшн-кода, 4–6 неявных багов
// (race conditions, TOCTOU, утечки, тонкая иммутабельность, StrictMode,
// security, стабильность ссылок...). Формат — см. ../exercises.js.
// Номера строк в issues — с 1 по строкам code.

import type { Exercise } from "../exercises";

export const HARD_EXERCISES: Exercise[] = [
  {
    id: "infinite-feed-hook",
    level: "hard",
    title: "useInfiniteFeed (React)",
    context:
      "Хук бесконечной ленты: поиск по query, пагинация через loadMore, дедупликация по id. PR: «стабилизировал loadMore через useCallback и добавил дедупликацию».",
    en: {
      title: "useInfiniteFeed (React)",
      context:
        "An infinite-feed hook: search by query, pagination via loadMore, dedup by id. PR: \"stabilized loadMore with useCallback and added dedup.\"",
    },
    code: `function useInfiniteFeed(query) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const seenIds = useRef(new Set());

  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = "/api/feed?q=" + encodeURIComponent(query) + "&page=" + page;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const fresh = data.items.filter((it) => !seenIds.current.has(it.id));
        fresh.forEach((it) => seenIds.current.add(it.id));
        setItems(items.concat(fresh));
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  const loadMore = useCallback(() => {
    if (!loading) setPage(page + 1);
  }, []);

  return { items, loading, error, loadMore };
}`,
    issues: [
      {
        lines: [27, 37],
        severity: "blocker",
        title: "Stale closure: items из старого рендера (нет в deps)",
        explain:
          "items не входит в deps эффекта — замыкание держит массив из рендера, в котором эффект запустился. Конкретная гонка: query сменился при page === 1 → fetch-эффект перезапустился по query, замкнув items ещё ДО того, как reset-эффект их очистил; setItems([]) уже произошёл, но замыкание держит СТАРЫЙ массив → ответ нового query конкатенируется к элементам прошлого поиска. В ленте — мусор.",
        fix: "Функциональное обновление: setItems((prev) => prev.concat(fresh)) — тогда items из замыкания не нужен.",
        en: {
          title: "Stale closure: items from an old render (missing from deps)",
          explain:
            "items is not in the effect deps — the closure captures the array from the render where the effect ran. Concrete race: query changes while page === 1 → the fetch effect re-runs for query, closing over items BEFORE the reset effect cleared them; setItems([]) has already happened, but the closure still holds the OLD array → the new query's response gets concatenated onto the previous search's items. The feed shows garbage.",
          fix: "Use a functional update: setItems((prev) => prev.concat(fresh)) — then the closed-over items is no longer needed.",
        },
      },
      {
        lines: [8, 9, 10, 11],
        severity: "major",
        title: "Сброс состояния через отдельный эффект",
        explain:
          "Сброс на смену query выполняется асинхронно, отдельным эффектом. Если page > 1, в том же коммите успевает запуститься fetch-эффект с НОВЫМ query и СТАРОЙ page — лишний сетевой запрос, который тут же отменяется после setPage(1). Плюс лишний промежуточный рендер с несогласованным состоянием (новый query, старые items/page).",
        fix: "Свести к одному источнику: сбрасывать внутри fetch-эффекта (или useReducer с action RESET, или key на компоненте-потребителе).",
        en: {
          title: "State reset via a separate effect",
          explain:
            "The reset on query change happens asynchronously in its own effect. If page > 1, the fetch effect still fires in the same commit with the NEW query and the OLD page — a wasted network request that gets cancelled right after setPage(1). Plus an extra intermediate render with inconsistent state (new query, old items/page).",
          fix: "Keep a single source of truth: reset inside the fetch effect (or a useReducer with a RESET action, or a key on the consuming component).",
        },
      },
      {
        lines: [6, 25, 26],
        severity: "major",
        title: "seenIds никогда не очищается",
        explain:
          "Set с id живёт в ref и не сбрасывается при смене query: если новый запрос возвращает элементы с теми же id (обычное дело — та же лента с другим фильтром), они будут отфильтрованы как «дубликаты» и лента окажется пустой/дырявой. Заодно Set растёт неограниченно — утечка памяти на долгой сессии.",
        fix: "В reset по query делать seenIds.current = new Set(); либо вообще дедуплицировать от items, а не от вечного ref.",
        en: {
          title: "seenIds is never cleared",
          explain:
            "The Set of ids lives in a ref and is not reset when query changes: if the new request returns items with the same ids (common — same feed, different filter), they get filtered out as \"duplicates\" and the feed ends up empty or full of holes. The Set also grows without bound — a memory leak over a long session.",
          fix: "On the query reset do seenIds.current = new Set(); or better, dedup against items instead of an everlasting ref.",
        },
      },
      {
        lines: [30, 31, 32],
        severity: "major",
        title: "catch игнорирует флаг cancelled",
        explain:
          "В then есть if (cancelled) return, а в catch — нет: ошибка отменённого/устаревшего запроса (например, отклонение fetch после ухода со страницы) вызовет setError/setLoading после cleanup — перетрёт состояние актуального запроса или сработает после unmount.",
        fix: "В catch первым делом if (cancelled) return; (и различать AbortError, когда появится AbortController).",
        en: {
          title: "catch ignores the cancelled flag",
          explain:
            "then has if (cancelled) return, but catch doesn't: an error from a cancelled/stale request (e.g. a fetch rejection after navigating away) calls setError/setLoading after cleanup — clobbering the state of the current request or firing after unmount.",
          fix: "First thing in catch: if (cancelled) return; (and distinguish AbortError once an AbortController is added).",
        },
      },
      {
        lines: [39, 40, 41],
        severity: "blocker",
        title: "useCallback с пустыми deps заморозил page и loading",
        explain:
          "Замыкание loadMore создано один раз: page в нём навсегда 1, loading навсегда false. Каждый вызов делает setPage(2) — пагинация навсегда застревает на второй странице, а guard по loading не защищает от параллельных запросов. «Стабилизация» из PR сломала фичу.",
        fix: "setPage((p) => p + 1) внутри; guard по loading — через ref или включить loading в deps.",
        en: {
          title: "useCallback with empty deps froze page and loading",
          explain:
            "The loadMore closure is created once: page is forever 1 and loading is forever false inside it. Every call does setPage(2) — pagination is stuck on page two forever, and the loading guard doesn't protect against parallel requests. The PR's \"stabilization\" broke the feature.",
          fix: "Use setPage((p) => p + 1) inside; guard on loading via a ref, or include loading in the deps.",
        },
      },
      {
        lines: [18],
        severity: "nit",
        title: "Флаг cancelled не отменяет сам запрос",
        explain:
          "Флаг лишь игнорирует ответ — сетевой запрос продолжает жить, тратит трафик и слот браузерного лимита соединений; при быстром вводе query их копится очередь.",
        fix: "AbortController: fetch(url, { signal }), в cleanup — controller.abort().",
        en: {
          title: "The cancelled flag doesn't cancel the request itself",
          explain:
            "The flag only ignores the response — the network request stays alive, wasting bandwidth and a browser connection slot; with fast typing in query they pile up.",
          fix: "AbortController: fetch(url, { signal }), and controller.abort() in cleanup.",
        },
      },
    ],
  },
  {
    id: "settings-provider",
    level: "hard",
    title: "SettingsProvider (React)",
    context:
      "Провайдер настроек приложения с персистом в localStorage и мемоизированным тумблером уведомлений. PR: «настройки переживают перезагрузку, тумблеры не перерисовывают всё дерево».",
    en: {
      title: "SettingsProvider (React)",
      context:
        "An app settings provider persisted to localStorage, with a memoized notifications toggle. PR: \"settings survive reloads, toggles don't re-render the whole tree.\"",
    },
    code: `const SettingsContext = createContext(null);

function readSettings() {
  const raw = localStorage.getItem("app.settings");
  if (!raw) {
    return { theme: "light", notifications: { email: true, push: false } };
  }
  return JSON.parse(raw);
}

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readSettings());

  useEffect(() => {
    localStorage.setItem("app.settings", JSON.stringify(settings));
  }, [settings]);

  const setTheme = (theme) => {
    setSettings({ ...settings, theme: theme });
  };

  const toggleChannel = (channel) => {
    const next = { ...settings };
    next.notifications[channel] = !next.notifications[channel];
    setSettings(next);
  };

  return (
    <SettingsContext.Provider value={{ settings, setTheme, toggleChannel }}>
      {children}
    </SettingsContext.Provider>
  );
}

const ChannelToggle = memo(function ChannelToggle({ config, onToggle }) {
  return (
    <label>
      <input
        type="checkbox"
        checked={config.email}
        onChange={() => onToggle("email")}
      />
      Email notifications
    </label>
  );
});`,
    issues: [
      {
        lines: [12],
        severity: "major",
        title: "useState(readSettings()) — не ленивая инициализация",
        explain:
          "readSettings() вызывается на КАЖДОМ рендере провайдера (результат после первого выбрасывается): синхронное чтение localStorage + JSON.parse на каждый рендер всего приложения. Аргумент useState вычисляется всегда — ленивость даёт только функция-инициализатор.",
        fix: "useState(readSettings) — передать саму функцию, а не результат вызова.",
        en: {
          title: "useState(readSettings()) — initializer isn't lazy",
          explain:
            "readSettings() runs on EVERY render of the provider (the result is discarded after the first): a synchronous localStorage read plus JSON.parse on every app render. The useState argument is always evaluated — only passing an initializer function makes it lazy.",
          fix: "useState(readSettings) — pass the function itself, not the call result.",
        },
      },
      {
        lines: [8],
        severity: "major",
        title: "JSON.parse без защиты — перманентный крэш",
        explain:
          "Одно битое значение в localStorage (обрезанная запись, другая версия схемы, ручная правка) — и JSON.parse бросает на каждом старте: приложение падает при монтировании провайдера и НЕ чинится перезагрузкой, пока пользователь не почистит storage.",
        fix: "try/catch вокруг parse с возвратом дефолта (и валидация формы данных/версии схемы).",
        en: {
          title: "JSON.parse unguarded — a permanent crash",
          explain:
            "One corrupted localStorage value (a truncated write, an older schema version, manual editing) and JSON.parse throws on every startup: the app crashes while mounting the provider and a reload does NOT fix it until the user clears storage.",
          fix: "try/catch around the parse, falling back to defaults (plus validating the data shape / schema version).",
        },
      },
      {
        lines: [23, 24, 25],
        severity: "blocker",
        title: "Спред верхнего уровня + мутация вложенного объекта",
        explain:
          "{ ...settings } копирует только верхний уровень — next.notifications это ТОТ ЖЕ объект, что и в предыдущем state. Строка 24 мутирует его напрямую: предыдущий state испорчен задним числом — сравнения «было/стало», devtools и откаты врут. А как только хендлеры стабилизируют (что и обещает PR), memo-компонент с config={settings.notifications} увидит прежнюю ссылку и перестанет обновляться — «залипший» чекбокс.",
        fix: "Копировать каждый изменяемый уровень: setSettings((s) => ({ ...s, notifications: { ...s.notifications, [channel]: !s.notifications[channel] } })).",
        en: {
          title: "Top-level spread + mutation of a nested object",
          explain:
            "{ ...settings } copies only the top level — next.notifications is the SAME object as in the previous state. Line 24 mutates it in place: the previous state is corrupted retroactively — before/after comparisons, devtools and undo all lie. And the moment the handlers get stabilized (which is exactly what the PR promises), a memo component receiving config={settings.notifications} sees the old reference and stops updating — a \"stuck\" checkbox.",
          fix: "Copy every level you change: setSettings((s) => ({ ...s, notifications: { ...s.notifications, [channel]: !s.notifications[channel] } })).",
        },
      },
      {
        lines: [29],
        severity: "major",
        title: "Инлайн-объект в value контекста",
        explain:
          "value={{ ... }} — новая ссылка на каждом рендере провайдера, а setTheme/toggleChannel и сами пересоздаются. Любой рендер провайдера (в т.ч. из-за children) перерисовывает ВСЕХ потребителей контекста, memo на них бесполезен — заявка PR про «не перерисовывает дерево» не выполняется.",
        fix: "useCallback для setTheme/toggleChannel + useMemo для value с deps [settings, setTheme, toggleChannel]; ещё лучше — разделить контексты данных и действий.",
        en: {
          title: "Inline object as the context value",
          explain:
            "value={{ ... }} is a new reference on every provider render, and setTheme/toggleChannel are recreated too. Any provider render (including via children) re-renders ALL context consumers; memo on them is useless — the PR's \"doesn't re-render the tree\" claim doesn't hold.",
          fix: "useCallback for setTheme/toggleChannel plus useMemo for value with deps [settings, setTheme, toggleChannel]; better yet, split state and actions into separate contexts.",
        },
      },
      {
        lines: [18, 19],
        severity: "nit",
        title: "Обновление от settings из замыкания",
        explain:
          "setSettings({ ...settings, ... }) читает settings из рендера: два обновления в одном тике (setTheme + toggleChannel подряд) — второе перетрёт первое. Сейчас воспроизводится редко, но паттерн хрупкий.",
        fix: "Функциональная форма: setSettings((s) => ({ ...s, theme })).",
        en: {
          title: "Update built from closed-over settings",
          explain:
            "setSettings({ ...settings, ... }) reads settings from the render: two updates in one tick (setTheme + toggleChannel back to back) — the second clobbers the first. Rarely reproduces today, but the pattern is fragile.",
          fix: "Functional form: setSettings((s) => ({ ...s, theme })).",
        },
      },
    ],
  },
  {
    id: "chat-screen-ws",
    level: "hard",
    title: "ChatScreen (React Native)",
    context:
      "Экран чата: WebSocket на комнату, реконнект при возврате из фона, лимит истории 200 сообщений, композер поднимается над клавиатурой. PR: «реконнект и лимит памяти».",
    en: {
      title: "ChatScreen (React Native)",
      context:
        "A chat screen: a WebSocket per room, reconnect on returning from background, a 200-message history cap, the composer lifts above the keyboard. PR: \"reconnect and a memory cap.\"",
    },
    code: `function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const socketRef = useRef(null);
  useEffect(() => {
    const socket = new WebSocket(WS_URL + route.params.roomId);
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => {
        if (prev.length >= 200) prev.shift();
        return [...prev, msg];
      });
    };
    socketRef.current = socket;
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && socketRef.current.readyState !== 1) {
        socketRef.current = new WebSocket(WS_URL + route.params.roomId);
      }
    });
    return () => {
      sub.remove();
      socket.close();
    };
  }, [route.params.roomId]);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
    Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));
  }, []);

  const send = () => {
    if (!draft || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ text: draft }));
    setDraft("");
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => <MessageBubble message={item} />}
      />
      <View style={keyboardOpen ? styles.composerRaised : styles.composer}>
        <TextInput value={draft} onChangeText={setDraft} />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}`,
    issues: [
      {
        lines: [11],
        severity: "major",
        title: "prev.shift() мутирует предыдущий state",
        explain:
          "Внутри функционального апдейтера prev — это ТЕКУЩИЙ массив из state, а не копия. shift() удаляет элемент прямо из него: массив, на который ссылаются прошлый рендер, memo-строки и FlatList, меняется под ногами. Возвращаемый [...prev, msg] — новый, но исходный уже испорчен; возможны пропавшие сообщения и расхождение UI с данными.",
        fix: "Не мутировать: const next = prev.length >= 200 ? prev.slice(1) : prev; return [...next, msg]; (или prev.slice(-199).concat(msg)).",
        en: {
          title: "prev.shift() mutates the previous state",
          explain:
            "Inside a functional updater, prev is the CURRENT state array, not a copy. shift() removes an element from it in place: the array referenced by the previous render, memoized rows and the FlatList changes under their feet. The returned [...prev, msg] is new, but the original is already corrupted; messages can vanish and the UI can drift from the data.",
          fix: "Don't mutate: const next = prev.length >= 200 ? prev.slice(1) : prev; return [...next, msg]; (or prev.slice(-199).concat(msg)).",
        },
      },
      {
        lines: [17, 18, 23],
        severity: "blocker",
        title: "Реконнект создаёт «глухой» сокет, а cleanup его не закрывает",
        explain:
          "Новому WebSocket на строке 18 никто не вешает onmessage — после возврата из фона соединение открыто, но сообщения молча перестают приходить. Старый сокет перед заменой не закрывается. А cleanup (строка 23) закрывает socket из замыкания — ПЕРВЫЙ сокет, не socketRef.current: пересозданный сокет при unmount/смене комнаты остаётся жить — утечка соединения и обработчиков.",
        fix: "Вынести connect() с навешиванием onmessage; при реконнекте закрывать старый; в cleanup закрывать socketRef.current.",
        en: {
          title: "Reconnect creates a deaf socket, and cleanup doesn't close it",
          explain:
            "Nobody attaches onmessage to the new WebSocket on line 18 — after returning from background the connection is open but messages silently stop arriving. The old socket isn't closed before being replaced. And cleanup (line 23) closes the closed-over socket — the FIRST one, not socketRef.current: on unmount/room change the recreated socket stays alive — a connection and handler leak.",
          fix: "Extract a connect() that attaches onmessage; close the old socket on reconnect; close socketRef.current in cleanup.",
        },
      },
      {
        lines: [2, 25],
        severity: "major",
        title: "messages не сбрасываются при смене комнаты",
        explain:
          "Deps [route.params.roomId] декларируют, что комната может смениться без ремоунта: сокет пересоздаётся, а история — нет. Сообщения новой комнаты допишутся к чужой истории, и пользователь видит смешанный чат.",
        fix: "В эффекте по roomId сбрасывать историю: setMessages([]) перед подключением (или держать messages в состоянии, ключёванном по roomId).",
        en: {
          title: "messages aren't reset when the room changes",
          explain:
            "The [route.params.roomId] deps declare the room can change without a remount: the socket is recreated, but the history isn't. The new room's messages get appended to the old room's history, and the user sees a mixed-up chat.",
          fix: "Reset the history in the roomId effect: setMessages([]) before connecting (or key the messages state by roomId).",
        },
      },
      {
        lines: [26, 27, 28, 29],
        severity: "major",
        title: "Keyboard-подписки без cleanup",
        explain:
          "Возвращаемые подписки игнорируются, эффект не возвращает cleanup: при unmount экрана слушатели остаются — setState на размонтированном компоненте, а при каждом повторном заходе на экран подписки дублируются.",
        fix: "Сохранить обе подписки и вернуть () => { show.remove(); hide.remove(); }.",
        en: {
          title: "Keyboard subscriptions without cleanup",
          explain:
            "The returned subscriptions are ignored and the effect returns no cleanup: after the screen unmounts the listeners stay — setState on an unmounted component, and every re-entry to the screen duplicates the subscriptions.",
          fix: "Keep both subscriptions and return () => { show.remove(); hide.remove(); }.",
        },
      },
      {
        lines: [9],
        severity: "major",
        title: "JSON.parse входящего кадра без try/catch",
        explain:
          "Один невалидный кадр от сервера (ping-текст, обрезанное сообщение, HTML-ошибка прокси) — исключение в onmessage и красный экран у пользователя. Внешние данные нельзя парсить без защиты.",
        fix: "try/catch вокруг parse; невалидные кадры логировать и пропускать.",
        en: {
          title: "JSON.parse of an incoming frame without try/catch",
          explain:
            "A single invalid frame from the server (a text ping, a truncated message, a proxy's HTML error) throws inside onmessage — a red screen for the user. Never parse external data unguarded.",
          fix: "try/catch around the parse; log and skip invalid frames.",
        },
      },
      {
        lines: [41],
        severity: "major",
        title: "keyExtractor по индексу при «скользящем окне»",
        explain:
          "Как только история упирается в лимит 200, каждый новый месседж сдвигает ВСЕ индексы: элемент с key=\"5\" становится другим сообщением. FlatList переиспользует строки неправильно — перерисовка всего списка на каждое сообщение, мигающие/чужие сообщения при recycle.",
        fix: "keyExtractor={(item) => item.id} (серверный id сообщения).",
        en: {
          title: "keyExtractor by index with a sliding window",
          explain:
            "Once the history hits the 200 cap, every new message shifts ALL indexes: the item with key=\"5\" becomes a different message. FlatList recycles rows incorrectly — the whole list re-renders on every message, with flickering or mismatched messages during recycling.",
          fix: "keyExtractor={(item) => item.id} (the server-side message id).",
        },
      },
      {
        lines: [42],
        severity: "nit",
        title: "Инлайн renderItem",
        explain:
          "Новая функция renderItem на каждом рендере экрана (то есть на каждое сообщение и каждый символ в draft) — FlatList хуже мемоизирует строки; вместе с key-по-индексу это заметно на длинном списке.",
        fix: "Вынести в useCallback (deps []) и обернуть MessageBubble в memo.",
        en: {
          title: "Inline renderItem",
          explain:
            "A new renderItem function on every screen render (i.e. on every message and every keystroke in draft) — FlatList memoizes rows less effectively; combined with index keys it's noticeable on a long list.",
          fix: "Move it into useCallback (deps []) and wrap MessageBubble in memo.",
        },
      },
    ],
  },
  {
    id: "api-cache-module",
    level: "hard",
    title: "createApiCache (JS)",
    context:
      "Модуль кэша API-запросов с TTL, дедупликацией in-flight запросов, префетчем и инвалидацией по префиксу. PR: «общий кэш для всех экранов + статистика хитов».",
    en: {
      title: "createApiCache (JS)",
      context:
        "An API request cache module with a TTL, in-flight dedup, prefetch and prefix invalidation. PR: \"a shared cache for all screens plus hit stats.\"",
    },
    code: `function createApiCache(fetcher, ttl) {
  const cache = {};
  let hits = 0;
  let misses = 0;

  async function get(key) {
    const entry = cache[key];
    if (entry && Date.now() - entry.time < ttl) {
      hits++;
      return entry.promise;
    }
    misses++;
    const promise = fetcher(key);
    cache[key] = { promise: promise, time: Date.now() };
    return promise;
  }

  async function preload(keys) {
    const results = await Promise.all(keys.map((k) => get(k)));
    return results;
  }

  function invalidate(prefix) {
    for (const key in cache) {
      if (key.indexOf(prefix) === 0) {
        delete cache[key];
      }
    }
  }

  function stats() {
    return { hits: hits, misses: misses, size: Object.keys(cache).length };
  }

  return { get: get, preload: preload, invalidate: invalidate, stats: stats };
}`,
    issues: [
      {
        lines: [2, 7],
        severity: "major",
        title: "Обычный объект как словарь с внешними ключами",
        explain:
          "key приходит снаружи (часто из URL/ввода пользователя), а {} наследует Object.prototype. cache[\"__proto__\"] = entry не сохраняет запись, а ПОДМЕНЯЕТ прототип: запись невидима для Object.keys — stats().size врёт, invalidate её не удалит, зато cache[\"promise\"]/[\"time\"] начинают «находиться» для любых ключей через прототип. Ключи вида \"toString\" спасает только случайность (TTL-проверка на унаследованной функции даёт NaN < ttl = false) — хрупко.",
        fix: "new Map() (или хотя бы Object.create(null)); с Map — map.get/map.set/map.delete.",
        en: {
          title: "A plain object as a dictionary with external keys",
          explain:
            "key comes from outside (often from a URL or user input), and {} inherits Object.prototype. cache[\"__proto__\"] = entry doesn't store an entry — it REPLACES the prototype: the entry is invisible to Object.keys — stats().size lies, invalidate can't delete it, while cache[\"promise\"]/[\"time\"] start \"existing\" for arbitrary keys via the prototype. Keys like \"toString\" are saved only by accident (the TTL check on an inherited function yields NaN < ttl = false) — fragile.",
          fix: "new Map() (or at least Object.create(null)); with a Map — map.get/map.set/map.delete.",
        },
      },
      {
        lines: [13, 14],
        severity: "blocker",
        title: "Отклонённый promise кэшируется на весь TTL",
        explain:
          "В кэш кладётся promise ДО того, как известен исход. Если fetcher упал (таймаут, 500, обрыв сети), rejected promise остаётся в кэше до истечения ttl — все вызовы этого ключа получают ту же самую ошибку без единого нового запроса. Один сбой «отравляет» ключ на весь TTL.",
        fix: "promise.catch(() => { if (cache[key] && cache[key].promise === promise) delete cache[key]; }) — при ошибке убирать запись, оставляя дедупликацию in-flight.",
        en: {
          title: "A rejected promise is cached for the full TTL",
          explain:
            "The promise is stored BEFORE its outcome is known. If the fetcher fails (timeout, 500, dropped connection), the rejected promise stays cached until the ttl expires — every caller of that key gets the very same error with no new request. One failure poisons the key for the whole TTL.",
          fix: "promise.catch(() => { if (cache[key] && cache[key].promise === promise) delete cache[key]; }) — drop the entry on failure while keeping in-flight dedup.",
        },
      },
      {
        lines: [8, 32],
        severity: "major",
        title: "Протухшие записи никогда не удаляются",
        explain:
          "Проверка TTL только читает — просроченная запись перезаписывается лишь при следующем get этого же ключа. Ключи, к которым перестали обращаться (ушли с экрана, сменился пользователь), живут в кэше вечно; лимита размера нет — в долгоживущем SPA это утечка памяти, а stats().size показывает завышенный размер с учётом трупов.",
        fix: "Удалять запись при обнаружении просрочки + ограничить размер (LRU / max entries) или периодическая уборка.",
        en: {
          title: "Expired entries are never removed",
          explain:
            "The TTL check only reads — an expired entry is overwritten only on the next get of the same key. Keys nobody asks about anymore (screen left, user switched) live in the cache forever; there is no size cap — in a long-lived SPA this is a memory leak, and stats().size reports a number inflated by the corpses.",
          fix: "Delete the entry when expiry is detected, plus cap the size (LRU / max entries) or run periodic cleanup.",
        },
      },
      {
        lines: [19],
        severity: "major",
        title: "Promise.all в preload: одна ошибка хоронит все результаты",
        explain:
          "Первый же rejected ключ отклоняет весь preload, хотя остальные запросы продолжают выполняться и даже закэшируются. Вызывающий код считает, что префетч не удался целиком, и теряет успешные результаты; в связке с кэшированием rejection (строка 14) один флаки-ключ ломает префетч стабильно.",
        fix: "Promise.allSettled и обработка частичных отказов (вернуть успешные, залогировать упавшие).",
        en: {
          title: "Promise.all in preload: one failure buries all results",
          explain:
            "The first rejected key rejects the whole preload even though the other requests keep running and even get cached. The caller believes the entire prefetch failed and loses the successful results; combined with rejection caching (line 14), one flaky key breaks the prefetch reliably.",
          fix: "Promise.allSettled with partial-failure handling (return the successes, log the failures).",
        },
      },
      {
        lines: [24, 25],
        severity: "nit",
        title: "for..in + indexOf вместо Object.keys + startsWith",
        explain:
          "for..in перебирает и унаследованные enumerable-свойства (особенно опасно в паре с загрязнённым прототипом из проблемы выше), а key.indexOf(prefix) === 0 — архаичная запись «начинается с».",
        fix: "for (const key of Object.keys(cache)) + key.startsWith(prefix); с Map — итерация по map.keys().",
        en: {
          title: "for..in + indexOf instead of Object.keys + startsWith",
          explain:
            "for..in also walks inherited enumerable properties (especially dangerous alongside the polluted prototype from the issue above), and key.indexOf(prefix) === 0 is the archaic way to spell \"starts with\".",
          fix: "for (const key of Object.keys(cache)) + key.startsWith(prefix); with a Map — iterate map.keys().",
        },
      },
    ],
  },
  {
    id: "payment-return-page",
    level: "hard",
    title: "PaymentReturnPage (React)",
    context:
      "Страница, на которую платёжный шлюз возвращает пользователя: проверяет статус заказа, подтверждает оплату и уводит дальше. PR: «добавил ретрай при сетевых сбоях».",
    en: {
      title: "PaymentReturnPage (React)",
      context:
        "The page the payment gateway redirects the user back to: it checks the order status, confirms the payment and sends the user on. PR: \"added a retry for network failures.\"",
    },
    code: `function PaymentReturnPage() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const next = params.get("next") || "/orders";
    if (!orderId) return;
    console.log("payment return for order", orderId);
    window.history.replaceState(null, "", "/payment/return");

    async function finalize() {
      const res = await fetch("/api/orders/" + orderId);
      const order = await res.json();
      if (order.status === "paid") {
        window.location.href = next;
        return;
      }
      await fetch("/api/orders/" + orderId + "/confirm", {
        method: "POST",
      });
      window.location.href = next;
    }

    finalize().catch(() => {
      setStatus("retrying");
      setTimeout(finalize, 2000);
    });
  }, []);

  if (status === "retrying") {
    return <Spinner label="Retrying payment confirmation" />;
  }
  return <Spinner label="Confirming your payment" />;
}`,
    issues: [
      {
        lines: [7, 16, 22],
        severity: "blocker",
        title: "Open redirect через параметр next",
        explain:
          "next берётся из query как есть и подставляется в window.location.href: ссылка вида /payment/return?orderId=1&next=https://evil.example уводит пользователя на фишинговый сайт СРАЗУ после оплаты — идеальный момент для «введите карту ещё раз». Классическая уязвимость open redirect.",
        fix: "Разрешать только same-origin относительные пути: new URL(next, location.origin).origin === location.origin и next начинается с \"/\" (не \"//\"); иначе — дефолт \"/orders\". Лучше — allowlist маршрутов.",
        en: {
          title: "Open redirect via the next parameter",
          explain:
            "next is taken from the query as-is and fed into window.location.href: a link like /payment/return?orderId=1&next=https://evil.example sends the user to a phishing site RIGHT after paying — the perfect moment for \"please re-enter your card\". A classic open redirect.",
          fix: "Allow only same-origin relative paths: new URL(next, location.origin).origin === location.origin and next starting with \"/\" (not \"//\"); otherwise fall back to \"/orders\". Better yet — an allowlist of routes.",
        },
      },
      {
        lines: [10, 19, 20, 21],
        severity: "blocker",
        title: "Неидемпотентный POST /confirm + replaceState до завершения",
        explain:
          "Мутирующий запрос без защиты от повторов: второй таб или повторное открытие ссылки шлюза (из письма/истории) прогонит confirm ещё раз, и каждый ретрай (строка 27) снова выполняет ВЕСЬ finalize, включая POST — для платёжки это потенциально двойное подтверждение. А replaceState на строке 10 стирает параметры ДО завершения операции: упавший confirm + перезагрузка = вечный спиннер без orderId и без шанса повторить.",
        fix: "Idempotency-Key (orderId + попытка) + серверная защита; replaceState — только ПОСЛЕ успешного подтверждения.",
        en: {
          title: "A non-idempotent POST /confirm + replaceState before completion",
          explain:
            "A mutating request with no replay protection: a second tab or re-opening the gateway link (from email/history) runs confirm again, and every retry (line 27) re-runs ALL of finalize including the POST — for a payment flow that's a potential double confirmation. And the replaceState on line 10 wipes the params BEFORE the operation completes: a failed confirm + a reload = an endless spinner with no orderId and no way to retry.",
          fix: "An Idempotency-Key (orderId + attempt) plus a server-side guard; do the replaceState only AFTER a successful confirmation.",
        },
      },
      {
        lines: [15],
        severity: "major",
        title: "TOCTOU: check-then-act по статусу заказа",
        explain:
          "Между GET статуса и POST /confirm статус может измениться: вебхук шлюза уже подтвердил заказ, второй таб сделал то же самое, заказ отменили. Клиентская проверка даёт ложную уверенность — решение «подтверждать или нет» обязан принимать сервер атомарно.",
        fix: "Убрать клиентский check-then-act: один идемпотентный endpoint подтверждения, который сам атомарно проверяет состояние и возвращает итоговый статус.",
        en: {
          title: "TOCTOU: check-then-act on the order status",
          explain:
            "Between the status GET and the POST /confirm the status can change: the gateway's webhook already confirmed the order, a second tab did the same, or the order was cancelled. The client-side check gives false confidence — the confirm-or-not decision must be made atomically by the server.",
          fix: "Drop the client-side check-then-act: a single idempotent confirm endpoint that atomically checks state itself and returns the final status.",
        },
      },
      {
        lines: [8, 27],
        severity: "major",
        title: "Сломанный ретрай и вечный спиннер без error-state",
        explain:
          "У повторного вызова finalize в setTimeout нет .catch: вторая ошибка — unhandled rejection, цепочка обрывается, пользователь навсегда смотрит на «Retrying» без сообщения об ошибке (как и при !orderId на строке 8 — молчаливый вечный спиннер). Таймер не сохраняется и не чистится в cleanup: ретрай стрельнёт и после ухода со страницы — с POST /confirm и жёстким redirect с чужого экрана.",
        fix: "Рекурсивный attempt() с .catch, лимитом попыток, backoff и терминальным error-state; id таймера в ref + очистка в cleanup; для !orderId — показать ошибку, а не return.",
        en: {
          title: "A broken retry and an endless spinner with no error state",
          explain:
            "The finalize call inside setTimeout has no .catch: a second failure is an unhandled rejection, the chain stops, and the user stares at \"Retrying\" forever with no error message (same for !orderId on line 8 — a silent endless spinner). The timer is neither stored nor cleared in cleanup: the retry can fire after the user left the page — issuing a POST /confirm and a hard redirect from a different screen.",
          fix: "A recursive attempt() with .catch, an attempt cap, backoff and a terminal error state; keep the timer id in a ref and clear it in cleanup; for !orderId show an error instead of returning.",
        },
      },
      {
        lines: [9],
        severity: "nit",
        title: "console.log с данными заказа в проде",
        explain:
          "Отладочный лог с orderId уходит в прод-консоль (и нередко в сборщики логов) — лишняя утечка идентификаторов платёжного флоу.",
        fix: "Убрать или заменить на logger с уровнями, отключённый в production.",
        en: {
          title: "console.log with order data in production",
          explain:
            "A debug log with the orderId lands in the production console (and often in log collectors) — a needless leak of payment-flow identifiers.",
          fix: "Remove it, or use a leveled logger disabled in production.",
        },
      },
      {
        lines: [14],
        severity: "nit",
        title: "res.json() без проверки res.ok",
        explain:
          "На 500-й со страницей ошибки (HTML) json() бросит невнятный SyntaxError, который маскирует реальную причину; отличить «сеть моргнула» от «заказа нет» невозможно.",
        fix: "if (!res.ok) throw new Error(\"HTTP \" + res.status); перед json().",
        en: {
          title: "res.json() without checking res.ok",
          explain:
            "On a 500 with an HTML error page, json() throws an opaque SyntaxError that masks the real cause; you can't tell \"network blip\" from \"order doesn't exist\".",
          fix: "if (!res.ok) throw new Error(\"HTTP \" + res.status); before json().",
        },
      },
    ],
  },
];
