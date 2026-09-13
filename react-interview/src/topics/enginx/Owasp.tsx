import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function Owasp() {
  return (
    <>
      <InterviewQuestion en="OWASP for a frontend/RN developer — which risks do you actually defend against and how?">
        OWASP для фронтенд/RN-разработчика — от каких рисков реально защищаешься и как?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "OWASP Top 10 is the standard list of web risks; I answer through
            what a frontend dev actually controls. <b>XSS</b> — the main one:
            React escapes by default, so the danger concentrates in
            <b> dangerouslySetInnerHTML</b>, href with javascript: URLs, and
            third-party HTML — anything user-generated goes through
            <b> sanitization</b> (DOMPurify) plus a <b>CSP</b> header as the
            second layer. <b>Token storage</b>: localStorage is readable by
            any injected script, so sensitive sessions belong in
            <b> httpOnly cookies</b> (with SameSite against CSRF) or at least
            short-lived access tokens in memory with refresh rotation.
            <b> Supply chain</b> — the biggest practical risk: npm audit,
            Dependabot, lockfiles, caution with postinstall scripts and
            typosquatting. Plus: never trust client-side validation — it's
            UX, the server re-validates; don't leak secrets into the bundle —
            anything in JS is public, env vars starting with VITE_/EXPO_PUBLIC_
            ship to users. In <b>React Native</b>: tokens in
            Keychain/Keystore instead of AsyncStorage, SSL pinning for
            sensitive traffic, obfuscation is not security. The senior
            framing: the frontend can't be the security boundary — it reduces
            attack surface, the server enforces."
          </>
        }
      >
        «OWASP Top 10 — стандартный список веб-рисков; отвечаю через то, что
        фронтендер реально контролирует. <b>XSS</b> — главный: React
        экранирует по умолчанию, поэтому опасность концентрируется в
        <b> dangerouslySetInnerHTML</b>, href с javascript:-URL и стороннем
        HTML — весь пользовательский контент проходит <b>санитизацию</b>
        (DOMPurify), плюс <b>CSP</b>-заголовок вторым слоем. <b>Хранение
        токенов</b>: localStorage читается любым внедрённым скриптом, поэтому
        чувствительные сессии — в <b>httpOnly cookies</b> (с SameSite против
        CSRF) или хотя бы короткоживущий access-токен в памяти с ротацией
        refresh. <b>Supply chain</b> — крупнейший практический риск: npm
        audit, Dependabot, lockfile, осторожность с postinstall-скриптами и
        typosquatting. Плюс: клиентской валидации не доверяем — это UX,
        сервер перепроверяет; секреты не попадают в бандл — всё, что в JS,
        публично, переменные с VITE_/EXPO_PUBLIC_ уезжают пользователям.
        В <b>React Native</b>: токены в Keychain/Keystore вместо
        AsyncStorage, SSL pinning для чувствительного трафика, обфускация —
        не безопасность. Senior-рамка: фронтенд не может быть границей
        безопасности — он сокращает поверхность атаки, а гарантирует сервер.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="XSS во фронтенде на React" en="XSS on a React frontend" /></h3>
        <CodeBlock
          ru={`<div>{userInput}</div>                    // ✅ React экранирует сам

// Дыры, через которые XSS всё же заходит:
<div dangerouslySetInnerHTML={{ __html: comment }} />   // ❌ сырой HTML
<a href={userUrl}>link</a>       // ❌ href="javascript:alert(1)"
el.innerHTML = data;             // ❌ мимо React (рефы, легаси)

// Защита:
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }} />
const safeUrl = /^https?:\\/\\//.test(userUrl) ? userUrl : "#";

// Второй слой — CSP-заголовок (даже если XSS прошёл, скрипт не выполнится):
Content-Security-Policy: default-src 'self'; script-src 'self'`}
          en={`<div>{userInput}</div>                    // ✅ React escapes it automatically

// Holes XSS still gets in through:
<div dangerouslySetInnerHTML={{ __html: comment }} />   // ❌ raw HTML
<a href={userUrl}>link</a>       // ❌ href="javascript:alert(1)"
el.innerHTML = data;             // ❌ bypasses React (refs, legacy code)

// Defenses:
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }} />
const safeUrl = /^https?:\\/\\//.test(userUrl) ? userUrl : "#";

// Second layer — a CSP header (even if XSS gets through, the script won't run):
Content-Security-Policy: default-src 'self'; script-src 'self'`}
        />
      </div>

      <div className="card">
        <h3><L ru="Токены: где хранить и почему" en="Tokens: where to store them and why" /></h3>
        <CodeBlock
          ru={`localStorage.setItem("jwt", token)
// ❌ любой XSS-скрипт: localStorage.getItem("jwt") → токен угнан

Варианты по убыванию надёжности:
1. httpOnly + Secure + SameSite cookie   — JS вообще не видит токен;
   SameSite=Lax/Strict закрывает большую часть CSRF
2. access-токен в ПАМЯТИ (переменная) + refresh в httpOnly cookie
   короткий TTL: угнали — быстро протух
3. localStorage — только для нечувствительного (тема, язык)

React Native:
AsyncStorage = незашифрованный файл                → ❌ для токенов
Keychain (iOS) / Keystore (Android)                → ✅ (expo-secure-store)`}
          en={`localStorage.setItem("jwt", token)
// ❌ any XSS script: localStorage.getItem("jwt") → the token is stolen

Options, most to least reliable:
1. httpOnly + Secure + SameSite cookie   — JS can't see the token at all;
   SameSite=Lax/Strict blocks most CSRF
2. access token in MEMORY (a variable) + refresh in an httpOnly cookie
   short TTL: if stolen, it expires quickly
3. localStorage — only for non-sensitive data (theme, language)

React Native:
AsyncStorage = an unencrypted file                 → ❌ for tokens
Keychain (iOS) / Keystore (Android)                → ✅ (expo-secure-store)`}
        />
      </div>

      <div className="card">
        <h3><L ru="Supply chain и секреты в бандле" en="Supply chain and secrets in the bundle" /></h3>
        <CodeBlock
          ru={`Supply chain:
npm audit / Dependabot / Renovate      — известные CVE в зависимостях
lockfile в репозитории                  — воспроизводимость, защита от подмены
осторожно: postinstall-скрипты, typosquatting (reakt вместо react)

Секреты:
VITE_API_SECRET=...   // ❌ всё с префиксом VITE_/EXPO_PUBLIC_ попадает В БАНДЛ
// «спрятать ключ в приложении» невозможно: бандл читается любым желающим
// секретные операции — только через свой бэкенд-прокси

Клиентская валидация:
zod на форме — это UX (быстрая подсказка)
тот же zod НА СЕРВЕРЕ — это безопасность (клиент подделывается curl-ом)`}
          en={`Supply chain:
npm audit / Dependabot / Renovate      — known CVEs in dependencies
a lockfile in the repo                  — reproducibility, protection against tampering
be careful with: postinstall scripts, typosquatting (reakt instead of react)

Secrets:
VITE_API_SECRET=...   // ❌ everything prefixed VITE_/EXPO_PUBLIC_ ends up IN THE BUNDLE
// "hiding a key in the app" is impossible: the bundle is readable by anyone
// secret operations only go through your own backend proxy

Client-side validation:
zod on a form is UX (a fast hint)
the same zod ON THE SERVER is security (the client can be faked with curl)`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«React защищает от XSS полностью?»",
            code: `// React экранирует ТОЛЬКО интерполяцию {value}
// Не защищает: dangerouslySetInnerHTML, javascript:-href,
// innerHTML через ref, сторонние виджеты, старые сборки с SSR-инъекциями`,
            text: "Ответ «в React XSS невозможен» — red flag. Правильно: экранирование по умолчанию + перечислить обходные пути и защиту (санитизация, CSP).",
            en: {
              title: "“Does React fully protect against XSS?”",
              code: `// React escapes ONLY the {value} interpolation
// It doesn't protect: dangerouslySetInnerHTML, javascript: hrefs,
// innerHTML via a ref, third-party widgets, old SSR-injection setups`,
              text: "“XSS is impossible in React” is a red flag answer. Correct: escaping by default, plus listing the workarounds and defenses (sanitization, CSP).",
            },
          },
          {
            title: "«JWT в localStorage — все так делают»",
            code: `// XSS → localStorage.getItem → токен у атакующего до истечения
// httpOnly cookie: тот же XSS может слать запросы, но НЕ УКРАСТЬ токен`,
            text: "Честная формулировка: httpOnly не спасает от всего (запросы от имени юзера возможны), но кража и офлайн-использование токена отрезаны. Плюс SameSite против CSRF.",
            en: {
              title: "“JWT in localStorage — everyone does it”",
              code: `// XSS → localStorage.getItem → the attacker has the token until it expires
// httpOnly cookie: the same XSS can still send requests, but CANNOT STEAL the token`,
              text: "The honest phrasing: httpOnly doesn't save you from everything (requests can still be sent as the user), but it cuts off theft and offline use of the token. Plus SameSite against CSRF.",
            },
          },
          {
            title: "CSRF — почему вдруг «не проблема»?",
            code: `// классика: авто-отправка формы на bank.com/transfer с чужого сайта
// защита: SameSite=Lax (дефолт браузеров) + CSRF-токены + проверка Origin
// токен в заголовке Authorization CSRF не подвержен (браузер сам его не шлёт)`,
            text: "Проверяют понимание механики: CSRF работает потому, что cookie отправляются автоматически. SameSite сильно сузил атаку, но не отменил (GET-side effects, старые браузеры).",
            en: {
              title: "CSRF — why does it suddenly seem “not a problem”?",
              code: `// classic: a form auto-submits to bank.com/transfer from a different site
// defense: SameSite=Lax (the browser default) + CSRF tokens + Origin checks
// a token in the Authorization header isn't vulnerable to CSRF (the browser won't send it automatically)`,
              text: "This checks understanding of the mechanics: CSRF works because cookies are sent automatically. SameSite narrowed the attack a lot, but didn't eliminate it (GET side effects, older browsers).",
            },
          },
          {
            title: "RN: «обфускация = безопасность»",
            code: `// Hermes-байткод декомпилируется, строки видны
// API-ключ «спрятанный» в приложении достаётся за вечер
// правило то же: секретам в клиенте не место, чувствительное — за бэкендом`,
            text: "Мобильный бинарник у атакующего в руках. SSL pinning против MITM, Keychain для токенов — да; «никто не найдёт ключ в коде» — нет.",
            en: {
              title: "RN: “obfuscation equals security”",
              code: `// Hermes bytecode can be decompiled, strings are visible
// an API key "hidden" in the app is extracted in an evening
// same rule applies: secrets don't belong on the client, sensitive stuff stays behind the backend`,
              text: "The mobile binary is in the attacker's hands. SSL pinning against MITM, Keychain for tokens — yes; “nobody will find the key in the code” — no.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="XSS — санитизация + CSP (React экранирует не всё); токены — httpOnly cookie / Keychain, не localStorage; supply chain — audit + lockfile; секретов в бандле не бывает; клиент сокращает поверхность, границу держит сервер."
          en="XSS — sanitization + CSP (React doesn't escape everything); tokens — httpOnly cookie / Keychain, not localStorage; supply chain — audit + lockfile; there's no such thing as a secret in the bundle; the client reduces attack surface, the server holds the boundary."
        />
      </div>
    </>
  );
}
