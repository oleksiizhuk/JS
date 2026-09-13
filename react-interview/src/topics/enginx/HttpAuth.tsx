import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  CodeBlock,
  Gotchas,
  L,
} from "../InterviewBlocks";

export default function HttpAuth() {
  return (
    <>
      <InterviewQuestion en="How does HTTP caching work, what is CORS really for, and where do you store auth tokens?">
        Как работает HTTP-кэширование, зачем на самом деле нужен CORS и где
        хранить токены авторизации?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Three pillars. <b>Caching</b>: the server controls it with{" "}
            <b>Cache-Control</b> — max-age and immutable mean 'serve from
            cache without asking', no-cache means 'revalidate first'
            (conditional request with <b>ETag / If-None-Match</b> → a cheap{" "}
            <b>304</b>), no-store means don't cache at all. The SPA pattern:
            hashed assets get max-age=1y, immutable, while index.html gets
            no-cache. <b>CORS</b> is a browser mechanism protecting the{" "}
            <b>user</b>, not the server: scripts from another origin can't
            read responses unless the server opts in via
            Access-Control-Allow-* headers; non-simple requests trigger a{" "}
            <b>preflight OPTIONS</b> first. It's not server security — curl
            doesn't care about CORS. <b>Tokens</b>: localStorage is readable
            by any XSS, so the robust scheme is a short-lived access token{" "}
            <b>in memory</b> plus a refresh token in an{" "}
            <b>httpOnly, Secure, SameSite cookie</b>; on 401 the client calls
            /refresh and retries. And remember a stateless JWT can't be
            revoked — hence short TTLs and refresh-token rotation."
          </>
        }
      >
        «Три кита. <b>Кэширование</b>: сервер управляет им через{" "}
        <b>Cache-Control</b> — max-age и immutable значат «бери из кэша не
        спрашивая», no-cache — «сначала ревалидируй» (условный запрос с{" "}
        <b>ETag / If-None-Match</b> → дешёвый <b>304</b>), no-store — не
        кэшировать вовсе. Паттерн SPA: захэшированные ассеты — max-age=1y,
        immutable, а index.html — no-cache. <b>CORS</b> — браузерный
        механизм, защищающий <b>пользователя</b>, а не сервер: скрипт с
        чужого origin не прочитает ответ, пока сервер явно не разрешит через
        заголовки Access-Control-Allow-*; «непростые» запросы сначала летят{" "}
        <b>preflight OPTIONS</b>-ом. Это не защита сервера — curl-у CORS
        безразличен. <b>Токены</b>: localStorage читается любым XSS, поэтому
        надёжная схема — короткоживущий access-токен <b>в памяти</b> плюс
        refresh-токен в <b>httpOnly, Secure, SameSite cookie</b>; на 401
        клиент зовёт /refresh и повторяет запрос. И помню, что stateless-JWT
        нельзя отозвать — отсюда короткие TTL и ротация refresh-токенов.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>
          <L ru="HTTP-кэширование: директивы и 304" en="HTTP caching: directives and 304" />
        </h3>
        <CodeBlock
          ru={`Cache-Control: max-age=31536000, immutable   // год не спрашивать вовсе
Cache-Control: no-cache                      // кэшируй, но РЕВАЛИДИРУЙ
Cache-Control: no-store                      // не кэшировать (личные данные)
Cache-Control: private / public              // только браузер / можно CDN

// Ревалидация (работает в паре с no-cache или протухшим max-age):
// 1-й ответ:  ETag: "abc123"
// повторный:  If-None-Match: "abc123"
// не менялось → 304 Not Modified БЕЗ тела — берём из кэша
// (Last-Modified / If-Modified-Since — то же самое по времени)

// Паттерн SPA (наш Vite-сайт так и работает):
// /assets/index-BhEtC5DT.js  → max-age=1y, immutable  // hash в имени!
// /index.html                → no-cache               // всегда свежие ссылки
// Деплой = новые хэши в свежем index.html; старые чанки не мешают`}
          en={`Cache-Control: max-age=31536000, immutable   // don't even ask for a year
Cache-Control: no-cache                      // cache it, but REVALIDATE
Cache-Control: no-store                      // don't cache at all (private data)
Cache-Control: private / public              // browser only / CDN allowed

// Revalidation (pairs with no-cache or an expired max-age):
// 1st response:  ETag: "abc123"
// next request:  If-None-Match: "abc123"
// unchanged → 304 Not Modified with NO body — served from cache
// (Last-Modified / If-Modified-Since — the same idea, by time)

// The SPA pattern (our Vite site works exactly like this):
// /assets/index-BhEtC5DT.js  → max-age=1y, immutable  // hash in the name!
// /index.html                → no-cache               // always fresh links
// A deploy = new hashes in a fresh index.html; old chunks don't interfere`}
        />
      </div>

      <div className="card">
        <h3>
          <L ru="CORS: кого он защищает и как устроен" en="CORS: whom it protects and how it works" />
        </h3>
        <CodeBlock
          ru={`// Same-origin policy: скрипт с app.com не может ЧИТАТЬ ответы api.bank.com.
// CORS — способ сервера ОСЛАБИТЬ этот запрет для конкретных origin.

// «Простой» запрос (GET/POST + простые заголовки) летит сразу,
// браузер лишь проверяет ответ:
Access-Control-Allow-Origin: https://app.com

// «Непростой» (Content-Type: application/json, Authorization, PUT/DELETE) —
// сначала preflight:
OPTIONS /api/users
  Origin: https://app.com
  Access-Control-Request-Method: PUT
← Access-Control-Allow-Origin: https://app.com
← Access-Control-Allow-Methods: PUT
← Access-Control-Max-Age: 86400        // кэш preflight — меньше OPTIONS

// С куками (credentials: "include") жёстче:
← Access-Control-Allow-Credentials: true
← Access-Control-Allow-Origin: https://app.com   // «*» НЕЛЬЗЯ`}
          en={`// Same-origin policy: a script on app.com cannot READ api.bank.com responses.
// CORS is how a server RELAXES that ban for specific origins.

// A "simple" request (GET/POST + simple headers) goes out immediately,
// the browser only checks the response:
Access-Control-Allow-Origin: https://app.com

// A "non-simple" one (Content-Type: application/json, Authorization,
// PUT/DELETE) — a preflight goes first:
OPTIONS /api/users
  Origin: https://app.com
  Access-Control-Request-Method: PUT
← Access-Control-Allow-Origin: https://app.com
← Access-Control-Allow-Methods: PUT
← Access-Control-Max-Age: 86400        // preflight cache — fewer OPTIONS

// With cookies (credentials: "include") it's stricter:
← Access-Control-Allow-Credentials: true
← Access-Control-Allow-Origin: https://app.com   // "*" is FORBIDDEN`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Токены: где хранить и как обновлять"
            en="Tokens: where to store them and how to refresh"
          />
        </h3>
        <CodeBlock
          ru={`// Варианты хранения:
// localStorage    ❌ читается ЛЮБЫМ XSS — window.localStorage.getItem(...)
// обычная cookie  ❌ XSS читает document.cookie + уязвима к CSRF
// httpOnly cookie ✅ JS её НЕ видит; браузер шлёт сам
//   Set-Cookie: refresh=...; HttpOnly; Secure; SameSite=Strict; Path=/auth
// в памяти (перем.) ✅ для access-токена: умирает с вкладкой — и пусть

// Рабочая схема:
// access  — JWT на 5-15 минут, живёт В ПАМЯТИ, уходит в Authorization
// refresh — в httpOnly cookie, принимается ТОЛЬКО эндпоинтом /auth/refresh
// поток: 401 → POST /auth/refresh (cookie уйдёт сама) → новый access →
//        повторить исходный запрос; refresh-ротация: старый отзывается

// Почему не «просто JWT навсегда»: stateless-токен НЕЛЬЗЯ отозвать —
// украденный работает до истечения. Короткий TTL + ротация ограничивают ущерб`}
          en={`// Storage options:
// localStorage    ❌ readable by ANY XSS — window.localStorage.getItem(...)
// plain cookie    ❌ XSS reads document.cookie + CSRF-prone
// httpOnly cookie ✅ JS can NOT see it; the browser sends it itself
//   Set-Cookie: refresh=...; HttpOnly; Secure; SameSite=Strict; Path=/auth
// in memory (var) ✅ for the access token: dies with the tab — fine

// The working scheme:
// access  — a 5-15 min JWT, lives IN MEMORY, sent via Authorization
// refresh — in an httpOnly cookie, accepted ONLY by /auth/refresh
// flow: 401 → POST /auth/refresh (the cookie rides along) → new access →
//       retry the original request; refresh rotation: the old one is revoked

// Why not "one JWT forever": a stateless token CANNOT be revoked —
// a stolen one works until expiry. Short TTLs + rotation cap the damage`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«no-cache значит не кэшировать?»",
            code: `Cache-Control: no-cache   // кэшировать МОЖНО, отдавать — после 304-проверки
Cache-Control: no-store   // вот это — «не кэшировать вовсе»`,
            text: "Самая частая путаница темы. no-cache = «ревалидируй перед использованием» (с ETag это быстрый 304), no-store = «не сохранять» (страницы с личными данными).",
            en: {
              title: '"Does no-cache mean don\'t cache?"',
              code: `Cache-Control: no-cache   // caching IS allowed; serve only after a 304 check
Cache-Control: no-store   // THIS one means "don't cache at all"`,
              text: "The most common mixup in the topic. no-cache = \"revalidate before use\" (a fast 304 with ETag), no-store = \"don't persist\" (pages with personal data).",
            },
          },
          {
            title: "«Почему у меня перед POST летит OPTIONS?»",
            code: `fetch(url, { method: "POST",
  headers: { "Content-Type": "application/json" } })
// application/json — НЕ «простой» заголовок → preflight OPTIONS
// (простые: text/plain, form-urlencoded, multipart/form-data)`,
            text: "Preflight появляется от «непростых» заголовков/методов — чаще всего от Content-Type: application/json или Authorization. Лечится не удалением JSON, а Access-Control-Max-Age и правильной настройкой сервера.",
            en: {
              title: '"Why does an OPTIONS fly before my POST?"',
              code: `fetch(url, { method: "POST",
  headers: { "Content-Type": "application/json" } })
// application/json is NOT a "simple" header → preflight OPTIONS
// (simple ones: text/plain, form-urlencoded, multipart/form-data)`,
              text: "Preflights come from non-simple headers/methods — most often Content-Type: application/json or Authorization. The cure isn't dropping JSON but Access-Control-Max-Age and proper server config.",
            },
          },
          {
            title: "«CORS защищает мой API от чужих запросов?»",
            code: `curl -H "Origin: https://evil.com" https://api.mysite.com/users
// 200 OK — curl-у и серверным скриптам CORS безразличен.
// CORS исполняет БРАУЗЕР, защищая пользователя и его cookie-сессии`,
            text: "Нет: это защита пользователя браузера (его cookies/сессий) от чужих сайтов. Защита API — аутентификация, авторизация и rate limiting, а не CORS.",
            en: {
              title: '"Does CORS protect my API from foreign requests?"',
              code: `curl -H "Origin: https://evil.com" https://api.mysite.com/users
// 200 OK — curl and server-side scripts don't care about CORS.
// CORS is enforced by the BROWSER, protecting the user and their cookie sessions`,
              text: "No: it protects the browser user (their cookies/sessions) from other sites. API protection is authentication, authorization and rate limiting — not CORS.",
            },
          },
          {
            title: "«SameSite=Lax уже спасает от CSRF — зачем ещё что-то?»",
            code: `Set-Cookie: session=...; SameSite=Lax
// Lax НЕ шлёт cookie в чужих POST/iframe — но ШЛЁТ в top-level GET
// (переход по ссылке). GET, меняющий состояние, — всё ещё дыра.
// Плюс поддомены и старые браузеры.`,
            text: "SameSite сильно сужает CSRF, но не отменяет правила «GET не мутирует» и CSRF-токенов для чувствительных операций. Ответ уровня senior — «слои защиты», а не одна галочка.",
            en: {
              title: '"SameSite=Lax already stops CSRF — why anything else?"',
              code: `Set-Cookie: session=...; SameSite=Lax
// Lax does NOT send the cookie on cross-site POST/iframe — but DOES on
// top-level GET (link navigation). A state-changing GET is still a hole.
// Plus subdomains and legacy browsers.`,
              text: "SameSite narrows CSRF a lot, but doesn't cancel the \"GET never mutates\" rule or CSRF tokens for sensitive operations. The senior answer is layered defenses, not one checkbox.",
            },
          },
          {
            title: "«Разлогиним пользователя — удалим JWT на клиенте»",
            code: `logout() { localStorage.removeItem("token"); }
// Токен-то удалили У СЕБЯ — но украденная копия валидна до exp.
// Stateless-JWT сервер не «забывает»: он его вообще не хранит`,
            text: "Отзыв stateless-токена невозможен по определению. Реальные рычаги: короткий TTL access, ротация refresh с отзывом семейства при повторном использовании, deny-list на крайний случай.",
            en: {
              title: '"To log the user out we\'ll just delete the JWT client-side"',
              code: `logout() { localStorage.removeItem("token"); }
// You deleted YOUR copy — a stolen one stays valid until exp.
// A stateless JWT can't be "forgotten" by the server: it never stored it`,
              text: "Revoking a stateless token is impossible by definition. The real levers: a short access TTL, refresh rotation that revokes the family on reuse, and a deny-list as the last resort.",
            },
          },
        ]}
      />

      <div className="redflag">
        <b>
          <L
            ru="⚠️ Red flag: «поставим Access-Control-Allow-Origin: * и CORS не будет мешать»."
            en={`⚠️ Red flag: "we'll set Access-Control-Allow-Origin: * and CORS will stop bothering us".`}
          />
        </b>
        <br />
        <L
          ru={
            <>
              Почему: «*» превращает приватный API в публичный для чтения любым
              сайтом, а с credentials он вообще запрещён спекой — значит, кто-то
              «починит» это отражением Origin без проверки, что ещё хуже.
              Правильная формулировка: «allowlist конкретных origin, отдельно
              осознанное решение про credentials; CORS настраивается точечно, а
              не выключается».
            </>
          }
          en={
            <>
              Why: "*" turns a private API into one readable by any site, and
              with credentials it's outright forbidden by the spec — so someone
              "fixes" that by reflecting Origin unchecked, which is even worse.
              The right phrasing: "an allowlist of specific origins, a separate
              conscious decision about credentials; CORS gets configured
              precisely, not switched off."
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> кэш — Cache-Control + ETag/304
              (ассеты immutable, index.html no-cache); CORS защищает
              пользователя, а не сервер (непростые запросы → preflight);
              токены — access в памяти + refresh в httpOnly cookie, 401 →
              refresh → retry.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> caching — Cache-Control + ETag/304
              (assets immutable, index.html no-cache); CORS protects the user,
              not the server (non-simple requests → preflight); tokens —
              access in memory + refresh in an httpOnly cookie, 401 → refresh →
              retry.
            </>
          }
        />
      </div>
    </>
  );
}
