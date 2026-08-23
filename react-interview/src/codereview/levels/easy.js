// Уровень EASY: мало кода (10–16 строк), баги явные — видны при внимательном чтении.
// Формат см. ../exercises.js

export const EASY_EXERCISES = [
  {
    id: "profile-card",
    level: "easy",
    title: "ProfileCard (React)",
    context:
      "Карточка профиля: загружает пользователя по userId и позволяет переименовать. PR от джуна: «добавил переименование». Card умеет показывать загрузку при user = null.",
    en: {
      title: "ProfileCard (React)",
      context:
        "A profile card: loads the user by userId and lets you rename them. PR from a junior: \"added renaming.\" Card knows how to show a loading state while user is null.",
    },
    code: `function ProfileCard({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []);

  function rename(newName) {
    user.name = newName;
    setUser(user);
  }

  return <Card user={user} onRename={rename} />;
}`,
    issues: [
      {
        lines: [9, 10],
        severity: "blocker",
        title: "Мутация объекта из state + setState с той же ссылкой",
        explain:
          "user.name = ... правит объект, лежащий в state, в обход React. setUser(user) передаёт ТУ ЖЕ ссылку — Object.is видит «ничего не изменилось», ре-рендера не будет: имя на экране не обновится (или обновится случайно, при чужом рендере).",
        fix: "setUser({ ...user, name: newName }) — новый объект, без мутации.",
        en: {
          title: "Mutating the state object + setState with the same reference",
          explain:
            "user.name = ... edits the object living in state behind React's back. setUser(user) passes the SAME reference — Object.is sees \"nothing changed\", so there is no re-render: the name on screen won't update (or will update by accident, on some unrelated render).",
          fix: "setUser({ ...user, name: newName }) — a new object, no mutation.",
        },
      },
      {
        lines: [6],
        severity: "major",
        title: "Забытая зависимость userId в useEffect",
        explain:
          "Эффект с [] выполняется один раз: если проп userId изменится, новый пользователь не загрузится — на экране останется старый. Линтер react-hooks/exhaustive-deps это ловит.",
        fix: "}, [userId]); — эффект перезапускается при смене userId.",
        en: {
          title: "Missing userId dependency in useEffect",
          explain:
            "An effect with [] runs once: if the userId prop changes, the new user is never fetched — the old one stays on screen. The react-hooks/exhaustive-deps lint rule catches this.",
          fix: "}, [userId]); — the effect re-runs when userId changes.",
        },
      },
      {
        lines: [5],
        severity: "nit",
        title: "Нет обработки ошибок запроса",
        explain:
          ".then(setUser) без .catch: если запрос упадёт, будет unhandled rejection, а user навсегда останется null — пользователь видит вечную загрузку без сообщения об ошибке.",
        fix: "Добавить .catch(...) и состояние ошибки (или try/catch в async-функции внутри эффекта).",
        en: {
          title: "No error handling for the request",
          explain:
            ".then(setUser) with no .catch: if the request fails you get an unhandled rejection and user stays null forever — the user sees an endless loading state with no error message.",
          fix: "Add .catch(...) and an error state (or try/catch in an async function inside the effect).",
        },
      },
    ],
  },
  {
    id: "todo-panel",
    level: "easy",
    title: "TodoPanel (React)",
    context:
      "Панель задач: кнопка добавляет задачу, клик по задаче переключает её статус через onToggle. PR: «сделал добавление задач».",
    en: {
      title: "TodoPanel (React)",
      context:
        "A todo panel: the button adds a todo, clicking a todo toggles its status via onToggle. PR: \"implemented adding todos.\"",
    },
    code: `function TodoPanel({ onToggle }) {
  const [items, setItems] = useState(new Array());
  function addItem(text) {
    items.push({ id: Date.now(), text: text });
    setItems(items);
  }

  return (
    <div>
      <button onClick={() => addItem("New")}>Add</button>
      {items.map((item, index) => (
        <p key={index} onClick={() => onToggle(item.id)}>{item.text}</p>
      ))}
    </div>
  );
}`,
    issues: [
      {
        lines: [4, 5],
        severity: "blocker",
        title: "push мутирует массив из state",
        explain:
          "push меняет массив НА МЕСТЕ, а setItems(items) передаёт ту же ссылку — React сравнит через Object.is и пропустит ре-рендер: новая задача не появится на экране, пока что-то другое не перерисует компонент.",
        fix: "setItems([...items, { id: Date.now(), text }]) — новый массив; надёжнее через updater: setItems(prev => [...prev, ...]).",
        en: {
          title: "push mutates the array from state",
          explain:
            "push changes the array IN PLACE, and setItems(items) passes the same reference — React compares with Object.is and skips the re-render: the new todo won't show up until something else re-renders the component.",
          fix: "setItems([...items, { id: Date.now(), text }]) — a new array; safer with an updater: setItems(prev => [...prev, ...]).",
        },
      },
      {
        lines: [12],
        severity: "major",
        title: "key={index} в изменяемом списке",
        explain:
          "Список пополняется и может переупорядочиваться — индексы «переезжают»: React переиспользует не те элементы, локальный state строк (если появится) прилипнет к позициям, лишние обновления DOM.",
        fix: "key={item.id} — стабильный ключ уже есть в данных.",
        en: {
          title: "key={index} in a mutable list",
          explain:
            "The list grows and may get reordered — indexes \"shift\": React reuses the wrong elements, per-row local state (if it ever appears) sticks to positions, and the DOM updates more than needed.",
          fix: "key={item.id} — a stable key already exists in the data.",
        },
      },
      {
        lines: [2],
        severity: "nit",
        title: "new Array() вместо литерала",
        explain:
          "Работает, но не идиоматично; конструктор Array ещё и коварен: new Array(5) — это массив с 5 «дырками», а не [5].",
        fix: "useState([]).",
        en: {
          title: "new Array() instead of a literal",
          explain:
            "It works, but it isn't idiomatic; the Array constructor is also treacherous: new Array(5) is an array with 5 holes, not [5].",
          fix: "useState([]).",
        },
      },
    ],
  },
  {
    id: "settings-screen-rn",
    level: "easy",
    title: "SettingsScreen (RN)",
    context:
      "Экран настроек в React Native: тумблер тёмной темы и переход на профиль. PR: «добавил переход на профиль и индикатор темы».",
    en: {
      title: "SettingsScreen (RN)",
      context:
        "A React Native settings screen: a dark-theme switch and navigation to the profile. PR: \"added profile navigation and a theme indicator.\"",
    },
    code: `function SettingsScreen({ navigation }) {
  const [dark, setDark] = useState(false);

  return (
    <View style={styles.root}>
      {dark && "Dark mode is on"}
      <Switch value={dark} onValueChange={(v) => setDark(v)} />
      <TouchableOpacity onPress={navigation.navigate("Profile")}>
        <Text>Open profile</Text>
      </TouchableOpacity>
    </View>
  );
}`,
    issues: [
      {
        lines: [6],
        severity: "blocker",
        title: "Текст вне <Text> — краш в React Native",
        explain:
          "В RN голую строку нельзя рендерить внутри <View>: как только dark станет true, приложение упадёт с ошибкой «Text strings must be rendered within a <Text> component». На вебе такое прощается, в RN — нет.",
        fix: "{dark && <Text>Dark mode is on</Text>}.",
        en: {
          title: "Text outside <Text> — a crash in React Native",
          explain:
            "In RN a bare string can't be rendered inside a <View>: the moment dark becomes true, the app crashes with \"Text strings must be rendered within a <Text> component\". The web forgives this, RN does not.",
          fix: "{dark && <Text>Dark mode is on</Text>}.",
        },
      },
      {
        lines: [8],
        severity: "major",
        title: "onPress вызывается прямо при рендере",
        explain:
          "navigation.navigate(\"Profile\") — это ВЫЗОВ, а не колбэк: переход выполнится на каждом рендере экрана, а в onPress попадёт undefined (кнопка перестанет работать).",
        fix: "onPress={() => navigation.navigate(\"Profile\")}.",
        en: {
          title: "onPress is invoked right during render",
          explain:
            "navigation.navigate(\"Profile\") is a CALL, not a callback: the navigation fires on every render of the screen, and onPress receives undefined (the button stops working).",
          fix: "onPress={() => navigation.navigate(\"Profile\")}.",
        },
      },
      {
        lines: [7],
        severity: "nit",
        title: "Лишняя стрелка-обёртка вокруг setDark",
        explain:
          "(v) => setDark(v) — обёртка, которая просто пробрасывает аргумент; к тому же это новая функция на каждый рендер.",
        fix: "onValueChange={setDark}.",
        en: {
          title: "Redundant arrow wrapper around setDark",
          explain:
            "(v) => setDark(v) is a wrapper that merely forwards the argument; it's also a new function on every render.",
          fix: "onValueChange={setDark}.",
        },
      },
    ],
  },
  {
    id: "calc-total",
    level: "easy",
    title: "calcTotal (JS)",
    context:
      "Функция считает сумму корзины и применяет купон со скидкой в процентах. PR: «добавил поддержку купонов».",
    en: {
      title: "calcTotal (JS)",
      context:
        "A function that sums up the cart and applies a percentage-discount coupon. PR: \"added coupon support.\"",
    },
    code: `function calcTotal(items, coupon) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  if (!coupon) {
    return total;
  }
  const discount = parseInt(coupon.percent);
  if (discount === NaN) {
    return total;
  }
  return total - (total * discount) / 100;
}`,
    issues: [
      {
        lines: [3, 4],
        severity: "blocker",
        title: "Off-by-one: i <= items.length",
        explain:
          "Последняя итерация обращается к items[items.length] — это undefined, и undefined.price бросает TypeError: функция падает на ЛЮБОМ непустом массиве.",
        fix: "i < items.length (или items.reduce((sum, it) => sum + it.price, 0)).",
        en: {
          title: "Off-by-one: i <= items.length",
          explain:
            "The last iteration accesses items[items.length] — that's undefined, and undefined.price throws a TypeError: the function crashes on ANY non-empty array.",
          fix: "i < items.length (or items.reduce((sum, it) => sum + it.price, 0)).",
        },
      },
      {
        lines: [10],
        severity: "major",
        title: "discount === NaN всегда false",
        explain:
          "NaN не равен ничему, включая самого себя — эта проверка никогда не срабатывает. Кривой купон даст discount = NaN, и итоговая сумма станет NaN.",
        fix: "Number.isNaN(discount) (или isNaN, но Number.isNaN строже).",
        en: {
          title: "discount === NaN is always false",
          explain:
            "NaN is not equal to anything, including itself — this check never fires. A malformed coupon yields discount = NaN, and the final total becomes NaN.",
          fix: "Number.isNaN(discount) (or isNaN, though Number.isNaN is stricter).",
        },
      },
      {
        lines: [9],
        severity: "nit",
        title: "parseInt без radix",
        explain:
          "parseInt(coupon.percent) без второго аргумента — привычка, которая аукается на строках вида \"08\" в старых движках и на \"0x...\"; к тому же parseInt молча отрежет дробную часть.",
        fix: "parseInt(coupon.percent, 10), а лучше Number(coupon.percent).",
        en: {
          title: "parseInt without a radix",
          explain:
            "parseInt(coupon.percent) without the second argument is a habit that bites on strings like \"08\" in old engines and on \"0x...\"; parseInt also silently drops the fractional part.",
          fix: "parseInt(coupon.percent, 10), or better Number(coupon.percent).",
        },
      },
    ],
  },
  {
    id: "sync-photos",
    level: "easy",
    title: "syncPhotos (async)",
    context:
      "Функция загружает фотографии на сервер, пропуская слишком большие, и сообщает о завершении. PR: «сделал синхронизацию фото».",
    en: {
      title: "syncPhotos (async)",
      context:
        "A function that uploads photos to the server, skipping oversized ones, and reports completion. PR: \"implemented photo sync.\"",
    },
    code: `async function syncPhotos(photos, onDone) {
  const results = [];
  photos.forEach(async (photo) => {
    if (photo.size > 5000000) {
      return;
    }
    const uploaded = await upload(photo);
    results.push(uploaded);
  });
  onDone(results.length);
  return results;
}`,
    issues: [
      {
        lines: [3, 10, 11],
        severity: "blocker",
        title: "forEach не ждёт async-колбэки",
        explain:
          "forEach игнорирует возвращаемые промисы: onDone(results.length) и return выполняются СРАЗУ, до завершения загрузок — наружу уходит пустой массив и «done: 0», а загрузки доезжают в фоне неизвестно когда.",
        fix: "await Promise.all(photos.map(async (photo) => ...)) — параллельно; или for..of с await — последовательно.",
        en: {
          title: "forEach doesn't wait for async callbacks",
          explain:
            "forEach ignores the returned promises: onDone(results.length) and the return run IMMEDIATELY, before the uploads finish — an empty array and \"done: 0\" escape, while the uploads land in the background at some unknown time.",
          fix: "await Promise.all(photos.map(async (photo) => ...)) for parallel; or for..of with await for sequential.",
        },
      },
      {
        lines: [7],
        severity: "major",
        title: "await без обработки ошибок в «отвязанном» колбэке",
        explain:
          "Если upload отклонится, промис колбэка никто не держит — получится unhandled promise rejection (в Node может уронить процесс), и часть фото молча не загрузится.",
        fix: "Обернуть в try/catch (или собирать промисы и обрабатывать через Promise.allSettled).",
        en: {
          title: "await with no error handling in a fire-and-forget callback",
          explain:
            "If upload rejects, nobody holds the callback's promise — you get an unhandled promise rejection (which can kill the process in Node), and some photos silently fail to upload.",
          fix: "Wrap it in try/catch (or collect the promises and handle them via Promise.allSettled).",
        },
      },
      {
        lines: [4],
        severity: "nit",
        title: "Магическое число 5000000",
        explain:
          "Что это — 5 МБ? Байты? Почему именно столько? Без имени константы намерение приходится угадывать, а менять лимит — искать по коду.",
        fix: "const MAX_PHOTO_SIZE = 5 * 1000 * 1000; и сравнивать с ним.",
        en: {
          title: "Magic number 5000000",
          explain:
            "What is this — 5 MB? Bytes? Why exactly this much? Without a named constant the intent has to be guessed, and changing the limit means hunting through the code.",
          fix: "const MAX_PHOTO_SIZE = 5 * 1000 * 1000; and compare against it.",
        },
      },
    ],
  },
  {
    id: "signup-form",
    level: "easy",
    title: "SignupForm (React)",
    context:
      "Форма регистрации: email и пароль, по сабмиту данные уходят наверх, под формой показывается приветствие. PR: «форма регистрации с приветствием».",
    en: {
      title: "SignupForm (React)",
      context:
        "A signup form: email and password, on submit the data goes up to the parent, and a greeting is shown below the form. PR: \"signup form with a greeting.\"",
    },
    code: `function SignupForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(e) {
    console.log("signup", email, password);
    onSubmit({ email, password });
    document.getElementById("hint").innerHTML = "Hi, " + email;
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Sign up</button>
    </form>
  );
}`,
    issues: [
      {
        lines: [5],
        severity: "blocker",
        title: "Пароль в console.log",
        explain:
          "Пароль в открытом виде попадает в консоль, а из неё — в системы сбора логов/ошибок (Sentry ловит breadcrumbs консоли), скриншоты и записи экрана. Утечка чувствительных данных.",
        fix: "Удалить строку; секреты не логировать никогда, даже «временно для отладки».",
        en: {
          title: "Password in console.log",
          explain:
            "The plaintext password ends up in the console, and from there in log/error collection systems (Sentry captures console breadcrumbs), screenshots, and screen recordings. A sensitive-data leak.",
          fix: "Delete the line; never log secrets, not even \"temporarily, for debugging\".",
        },
      },
      {
        lines: [7],
        severity: "major",
        title: "innerHTML с пользовательским вводом (XSS) + DOM в обход React",
        explain:
          "Значение из инпута вставляется как HTML: строка вида <img src=x onerror=...> в поле email выполнит скрипт (а если приветствие уйдёт другим пользователям — это полноценный stored XSS). Плюс прямая правка DOM в обход React: при следующем рендере её молча затрёт.",
        fix: "Хранить приветствие в state и рендерить как {\"Hi, \" + email} — React экранирует текст сам; innerHTML с вводом пользователя не использовать.",
        en: {
          title: "innerHTML with user input (XSS) + DOM manipulation behind React's back",
          explain:
            "The input value is inserted as HTML: a string like <img src=x onerror=...> in the email field executes script (and if the greeting is ever shown to other users, that's full-blown stored XSS). Plus a direct DOM edit behind React's back: the next render will silently wipe it.",
          fix: "Keep the greeting in state and render it as {\"Hi, \" + email} — React escapes text for you; never feed user input to innerHTML.",
        },
      },
      {
        lines: [4],
        severity: "major",
        title: "Нет e.preventDefault() на сабмите",
        explain:
          "Браузер выполнит нативный submit: страница перезагрузится, state SPA потеряется — данные могут не успеть уйти. Аргумент e объявлен, но не используется — заметный намёк.",
        fix: "Первой строкой обработчика: e.preventDefault();",
        en: {
          title: "Missing e.preventDefault() on submit",
          explain:
            "The browser performs a native submit: the page reloads and the SPA state is lost — the data may never make it out. The e argument is declared but unused — a visible hint.",
          fix: "First line of the handler: e.preventDefault();",
        },
      },
    ],
  },
];
