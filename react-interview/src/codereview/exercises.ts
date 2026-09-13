// Упражнения код-ревью: код с заложенными проблемами.
// issue: { lines: [номера строк с 1], severity: blocker|major|nit,
//          title, explain (чем грозит), fix (как чинить) }
// Строки кода без проблем — «чистые»: клик по ним = ложное срабатывание.
// level: easy (мало кода, явные баги) | medium | hard (много кода, неявные баги).
// Новые задачи — в ./levels/{easy,medium,hard}.js (по одному файлу на уровень).

export type Level = "easy" | "medium" | "hard";
export type Severity = "blocker" | "major" | "nit";
export type Issue = {
  lines: number[];
  severity: Severity;
  title: string;
  explain: string;
  fix: string;
  en: { title: string; explain: string; fix: string };
};
export type Exercise = {
  id: string;
  level: Level;
  title: string;
  context: string;
  en: { title: string; context: string };
  code: string;
  issues: Issue[];
};

import { EASY_EXERCISES } from "./levels/easy.ts";
import { MEDIUM_EXERCISES } from "./levels/medium.ts";
import { HARD_EXERCISES } from "./levels/hard.ts";

const BASE: Exercise[] = [
  {
    id: "user-list",
    level: "medium",
    title: "UserList (React)",
    context:
      "Компонент списка пользователей: поиск по имени, сортировка по возрасту, клик выбирает пользователя. PR от джуна: «починил фильтрацию».",
    en: {
      title: "UserList (React)",
      context:
        "A user list component: search by name, sort by age, click selects a user. PR from a junior: \"fixed the filtering.\"",
    },
    code: `function UserList({ users, onSelect }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(users.filter(u => u.name.includes(query)));
  }, [users, query]);

  const sorted = filtered.sort((a, b) => a.age - b.age);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {sorted.map((user, i) => (
        <UserRow
          key={i}
          user={user}
          style={{ padding: 8 }}
          onClick={() => onSelect(user.id)}
        />
      ))}
    </div>
  );
}`,
    issues: [
      {
        lines: [3, 5, 6, 7],
        severity: "major",
        title: "Производное состояние через useEffect",
        explain:
          "filtered вычисляется из users и query — это не state. Лишний рендер на каждое изменение + окно рассинхрона (кадр со старым filtered).",
        fix: "const filtered = users.filter(...) прямо в рендере; дорого — useMemo(() => ..., [users, query]).",
        en: {
          title: "Derived state via useEffect",
          explain:
            "filtered is computed from users and query — it isn't state. An extra render on every change, plus a window of desync (a frame with the stale filtered).",
          fix: "const filtered = users.filter(...) directly in render; if it's expensive, useMemo(() => ..., [users, query]).",
        },
      },
      {
        lines: [9],
        severity: "blocker",
        title: "sort мутирует массив из state",
        explain:
          "Array.prototype.sort сортирует НА МЕСТЕ — мутируется массив, лежащий в state (filtered). Ссылка не меняется → React может не заметить изменений; state правится в обход setState.",
        fix: "[...filtered].sort(...) или filtered.toSorted(...).",
        en: {
          title: "sort mutates the array from state",
          explain:
            "Array.prototype.sort sorts IN PLACE — it mutates the array living in state (filtered). The reference doesn't change → React may not notice the update; state gets edited around setState.",
          fix: "[...filtered].sort(...) or filtered.toSorted(...).",
        },
      },
      {
        lines: [16],
        severity: "major",
        title: "key={i} в сортируемом списке",
        explain:
          "Список фильтруется и сортируется — индексы «переезжают» между рендерами: state строк (если появится) прилипнет к позициям, DOM обновляется лишний раз.",
        fix: "key={user.id}.",
        en: {
          title: "key={i} in a sortable list",
          explain:
            "The list is filtered and sorted — indexes \"shift\" between renders: row state (if it ever appears) sticks to positions, and the DOM updates more than it should.",
          fix: "key={user.id}.",
        },
      },
      {
        lines: [18, 19],
        severity: "nit",
        title: "Инлайн-объект и инлайн-функция в props",
        explain:
          "Новые ссылки на каждом рендере: если UserRow обёрнут в memo — мемоизация не сработает. Для длинного списка ощутимо.",
        fix: "Вынести style в константу модуля; onClick — useCallback или передавать id и колбэк отдельно.",
        en: {
          title: "Inline object and inline function in props",
          explain:
            "New references on every render: if UserRow is wrapped in memo, the memoization won't work. Noticeable for a long list.",
          fix: "Move style out to a module-level constant; make onClick a useCallback or pass the id and the callback separately.",
        },
      },
    ],
  },
  {
    id: "load-dashboard",
    level: "easy",
    title: "loadDashboard (async)",
    context:
      "Функция загружает данные дашборда: пользователь, заказы, статистика — и рендерит. PR: «добавил аналитику и обработку ошибок».",
    en: {
      title: "loadDashboard (async)",
      context:
        "A function that loads dashboard data — user, orders, stats — and renders it. PR: \"added analytics and error handling.\"",
    },
    code: `async function loadDashboard(userId) {
  const user = await fetch("/api/users/" + userId)
    .then(r => r.json());
  const orders = await fetch("/api/orders?user=" + userId)
    .then(r => r.json());
  const stats = await fetch("/api/stats?user=" + userId)
    .then(r => r.json());

  try {
    render(user, orders, stats);
  } catch (e) {}

  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}`,
    issues: [
      {
        lines: [2, 4, 6],
        severity: "major",
        title: "Последовательные await независимых запросов",
        explain:
          "Три запроса не зависят друг от друга, но ждут по очереди: время = сумма вместо максимума. На медленной сети — секунды разницы.",
        fix: "const [user, orders, stats] = await Promise.all([...]).",
        en: {
          title: "Sequential await for independent requests",
          explain:
            "The three requests don't depend on each other but wait one after another: total time = sum instead of max. On a slow network that's seconds of difference.",
          fix: "const [user, orders, stats] = await Promise.all([...]).",
        },
      },
      {
        lines: [3, 5, 7],
        severity: "blocker",
        title: "Нет проверки r.ok",
        explain:
          "fetch НЕ реджектится на 404/500 — упадёт только на сетевой ошибке. Сервер вернул 500 с HTML — r.json() кинет невнятный SyntaxError или отрендерим мусор.",
        fix: "if (!r.ok) throw new Error(r.status) перед r.json() (обёртка-хелпер).",
        en: {
          title: "No r.ok check",
          explain:
            "fetch does NOT reject on 404/500 — it only fails on a network error. If the server returns 500 with HTML, r.json() throws an unhelpful SyntaxError, or we render garbage.",
          fix: "if (!r.ok) throw new Error(r.status) before r.json() (a wrapper helper).",
        },
      },
      {
        lines: [11],
        severity: "blocker",
        title: "Пустой catch глотает ошибку",
        explain:
          "Ошибка рендера исчезает бесследно: пустой экран без единого следа в логах — такие баги ищут днями.",
        fix: "Минимум logger.error(e) + показать пользователю состояние ошибки; или убрать try/catch и дать error boundary поймать.",
        en: {
          title: "Empty catch swallows the error",
          explain:
            "The render error vanishes without a trace: a blank screen with nothing in the logs — bugs like this take days to track down.",
          fix: "At minimum logger.error(e) plus showing the user an error state; or drop the try/catch and let an error boundary catch it.",
        },
      },
      {
        lines: [13, 14, 15, 16],
        severity: "nit",
        title: "Fire-and-forget без .catch",
        explain:
          "Аналитика без await — осознанно ок, но реджект уйдёт в unhandledrejection и зашумит мониторинг.",
        fix: '.catch(() => {}) с комментарием «аналитика не критична» — глотаем ЯВНО.',
        en: {
          title: "Fire-and-forget without .catch",
          explain:
            "Skipping await for analytics is fine on purpose, but a rejection will surface as an unhandledrejection and add noise to monitoring.",
          fix: '.catch(() => {}) with a comment like "analytics isn\'t critical" — swallow it EXPLICITLY.',
        },
      },
    ],
  },
  {
    id: "search-screen",
    level: "medium",
    title: "SearchScreen (React Native)",
    context:
      "Экран поиска в RN-приложении: инпут, запрос к API, список результатов, тап открывает карточку. PR: «поиск работает».",
    en: {
      title: "SearchScreen (React Native)",
      context:
        "A search screen in an RN app: an input, an API request, a results list, tap opens a detail card. PR: \"search works.\"",
    },
    code: `function SearchScreen({ navigation }) {
  const [results, setResults] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(API + "/search?q=" + text)
      .then(r => r.json())
      .then(setResults);
  }, [text]);

  return (
    <ScrollView>
      <TextInput value={text} onChangeText={setText} />
      {results.map(item => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Item", { item })}
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}`,
    issues: [
      {
        lines: [5, 6, 7, 8, 9],
        severity: "blocker",
        title: "Race condition: ответы приходят не по порядку",
        explain:
          "Печатаем «ab»: запрос для «a» может ответить ПОЗЖЕ запроса для «ab» — на экране результаты для «a» при тексте «ab». Плюс запрос на каждый символ без debounce.",
        fix: "Флаг отмены в cleanup эффекта (let cancelled) или AbortController; debounce ввода 300мс.",
        en: {
          title: "Race condition: responses arrive out of order",
          explain:
            "Typing \"ab\": the request for \"a\" can respond LATER than the request for \"ab\" — the screen ends up showing results for \"a\" while the text reads \"ab\". Plus a request on every keystroke with no debounce.",
          fix: "A cancellation flag in the effect cleanup (let cancelled) or an AbortController; debounce the input by 300ms.",
        },
      },
      {
        lines: [6],
        severity: "major",
        title: "Текст в URL без encodeURIComponent",
        explain:
          "Пользователь ввёл «кофе & чай» или «100%» — сломанный URL или неверный запрос; спецсимволы интерпретируются сервером.",
        fix: "API + '/search?q=' + encodeURIComponent(text) (или URLSearchParams).",
        en: {
          title: "Text in the URL without encodeURIComponent",
          explain:
            "The user typed \"coffee & tea\" or \"100%\" — a broken URL or a malformed request; special characters get interpreted by the server.",
          fix: "API + '/search?q=' + encodeURIComponent(text) (or URLSearchParams).",
        },
      },
      {
        lines: [14, 15],
        severity: "major",
        title: "Список в map без key + ScrollView вместо FlatList",
        explain:
          "map без key — warning и лишние перерисовки при обновлении результатов. ScrollView рендерит ВСЕ результаты сразу — на большом ответе скачок памяти и фризы.",
        fix: "FlatList с data={results}, keyExtractor={item => item.id}, renderItem.",
        en: {
          title: "A list in map without a key + ScrollView instead of FlatList",
          explain:
            "map without a key — a warning and extra re-renders when the results update. ScrollView renders ALL results at once — a large response causes a memory spike and freezes.",
          fix: "FlatList with data={results}, keyExtractor={item => item.id}, renderItem.",
        },
      },
      {
        lines: [16],
        severity: "nit",
        title: "Целый объект item в params навигации",
        explain:
          "Params должны быть сериализуемыми и лёгкими: большой объект ломает deep linking и восстановление state, данные могут устареть.",
        fix: "navigate('Item', { id: item.id }) — данные экран возьмёт из стора/кэша запросов.",
        en: {
          title: "The whole item object in navigation params",
          explain:
            "Params should be serializable and lightweight: a large object breaks deep linking and state restoration, and the data can go stale.",
          fix: "navigate('Item', { id: item.id }) — the screen fetches its data from the store/query cache.",
        },
      },
    ],
  },
  {
    id: "login-form",
    level: "easy",
    title: "LoginForm (безопасность)",
    context:
      "Форма логина в вебе: отправляет пароль, сохраняет токен, показывает приветствие с именем из URL (?name=...). PR: «логин готов».",
    en: {
      title: "LoginForm (security)",
      context:
        "A web login form: submits the password, stores the token, shows a greeting with a name taken from the URL (?name=...). PR: \"login done.\"",
    },
    code: `function LoginForm() {
  const [password, setPassword] = useState("");

  async function submit() {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    const { token } = await res.json();

    localStorage.setItem("token", token);
    console.log("Logged in, token:", token);

    const name = new URLSearchParams(location.search).get("name");
    document.getElementById("welcome").innerHTML =
      "Привет, " + name;
  }

  return <PasswordInput value={password} onChange={setPassword}
    onSubmit={submit} />;
}`,
    issues: [
      {
        lines: [14, 15, 16],
        severity: "blocker",
        title: "XSS: innerHTML с данными из URL",
        explain:
          "?name=<img src=x onerror=alert(document.cookie)> — исполнение чужого скрипта у пользователя. Данные из URL — недоверенный ввод.",
        fix: "Рендерить через React ({name} экранируется) или textContent; никогда innerHTML для недоверенного.",
        en: {
          title: "XSS: innerHTML with data from the URL",
          explain:
            "?name=<img src=x onerror=alert(document.cookie)> runs arbitrary script in the user's session. Data from the URL is untrusted input.",
          fix: "Render through React ({name} gets escaped) or use textContent; never innerHTML for untrusted input.",
        },
      },
      {
        lines: [11],
        severity: "major",
        title: "Токен в localStorage",
        explain:
          "Любой XSS (см. выше — он тут же есть!) читает localStorage и уносит токен — сессия угнана до истечения.",
        fix: "httpOnly + Secure + SameSite cookie с сервера; или access-токен в памяти + refresh в httpOnly.",
        en: {
          title: "Token in localStorage",
          explain:
            "Any XSS (see above — there's one right here!) can read localStorage and steal the token — the session is hijacked until it expires.",
          fix: "An httpOnly + Secure + SameSite cookie from the server; or an access token kept in memory with a refresh token in an httpOnly cookie.",
        },
      },
      {
        lines: [12],
        severity: "major",
        title: "Токен в console.log",
        explain:
          "Логи попадают в мониторинг/сессионные рекорды/скриншоты багрепортов — токен утекает по побочным каналам.",
        fix: "Убрать. Секреты не логируются никогда, даже «временно на отладку».",
        en: {
          title: "Token in console.log",
          explain:
            "Logs end up in monitoring/session recordings/bug-report screenshots — the token leaks through side channels.",
          fix: "Remove it. Secrets are never logged, not even \"temporarily for debugging.\"",
        },
      },
      {
        lines: [5, 6, 7, 8, 9],
        severity: "nit",
        title: "Нет Content-Type и обработки ошибок логина",
        explain:
          "Без headers: {'Content-Type': 'application/json'} часть бэкендов не распарсит тело; неверный пароль (401) даст падение на деструктуризации token.",
        fix: "Заголовок + проверка res.ok с показом ошибки формы.",
        en: {
          title: "No Content-Type and no login error handling",
          explain:
            "Without headers: {'Content-Type': 'application/json'} some backends won't parse the body; a wrong password (401) crashes at the token destructuring.",
          fix: "Add the header, plus a res.ok check that shows a form error.",
        },
      },
    ],
  },
];

const LEVEL_ORDER: Record<Level, number> = { easy: 0, medium: 1, hard: 2 };
export const EXERCISES: Exercise[] = [
  ...BASE,
  ...EASY_EXERCISES,
  ...MEDIUM_EXERCISES,
  ...HARD_EXERCISES,
].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);

export const LEVELS: Record<Level, { label: string; emoji: string; order: number }> = {
  easy: { label: "Easy", emoji: "🟢", order: 0 },
  medium: { label: "Medium", emoji: "🟡", order: 1 },
  hard: { label: "Hard", emoji: "🔴", order: 2 },
};

export const SEVERITY: Record<Severity, { label: string; emoji: string; order: number }> = {
  blocker: { label: "blocker", emoji: "🟥", order: 0 },
  major: { label: "major", emoji: "🟧", order: 1 },
  nit: { label: "nit", emoji: "🟨", order: 2 },
};
