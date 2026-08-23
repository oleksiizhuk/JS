// Лёгкая подсветка синтаксиса для всех блоков <pre class="code">.
// Работает по всему приложению из одного места: App вызывает highlightAll()
// после каждой смены темы — обходить и править ~60 блоков в JSX не нужно.

const KEYWORDS =
  "const|let|var|function|return|if|else|for|while|do|class|extends|super|new|" +
  "import|from|export|default|async|await|try|catch|finally|throw|switch|case|" +
  "break|continue|typeof|instanceof|in|of|delete|void|yield|this|null|undefined|" +
  "true|false|interface|type|enum|implements|readonly|keyof|infer|satisfies|as|" +
  "declare|namespace|public|private|protected|static|abstract|is|never|unknown|any";

// Один общий regex: что совпало раньше — то и токен (иначе подсветка полезла бы
// внутрь строк и комментариев).
const TOKEN = new RegExp(
  [
    "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/|#[^\\n]*)", // 1 комментарии (и # для Kotlin/схем)
    "(\"[^\"\\n]*\"|'[^'\\n]*'|`[^`]*`)", // 2 строки
    "\\b(" + KEYWORDS + ")\\b", // 3 ключевые слова
    "\\b([A-Z][A-Za-z0-9_]*)\\b", // 4 компоненты, классы, типы
    "\\b([a-z_$][\\w$]*)(?=\\s*\\()", // 5 вызовы функций
    "\\b(\\d+(?:\\.\\d+)?)\\b", // 6 числа
  ].join("|"),
  "g"
);

const CLASS_BY_GROUP = ["", "c-com", "c-str", "c-kw", "c-type", "c-fn", "c-num"];

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function highlight(code) {
  return escapeHtml(code).replace(TOKEN, (match, ...groups) => {
    const idx = groups.findIndex((g) => g !== undefined);
    const cls = CLASS_BY_GROUP[idx + 1];
    return cls ? `<span class="${cls}">${match}</span>` : match;
  });
}

export function highlightAll() {
  document.querySelectorAll("pre.code:not([data-hl])").forEach((el) => {
    el.dataset.hl = "1"; // не подсвечивать повторно
    el.innerHTML = highlight(el.textContent);
  });
}
