import { useState } from "react";
import i18next from "i18next";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from "react-i18next";
import {
  InterviewQuestion,
  ModelAnswer,
  SectionTitle,
  CodeBlock,
  Gotchas,
  L,
} from "./InterviewBlocks";

// Отдельный инстанс i18next ТОЛЬКО для демо на этой странице —
// не конфликтует ни с чем и не трогает RU/EN-тумблер тренажёра.
// (экспорт — для регрессионного теста)
export const demoI18n = i18next.createInstance();
demoI18n.use(initReactI18next).init({
  lng: "ru",
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React сам экранирует
  react: { useSuspense: false },
  resources: {
    ru: {
      translation: {
        greeting: "Привет, {{name}}!",
        cart_one: "В корзине {{count}} товар",
        cart_few: "В корзине {{count}} товара",
        cart_many: "В корзине {{count}} товаров",
        cart_other: "В корзине {{count}} товара",
      },
    },
    en: {
      translation: {
        greeting: "Hello, {{name}}!",
        cart_one: "{{count}} item in the cart",
        cart_other: "{{count}} items in the cart",
      },
    },
  },
});

// Живое демо: интерполяция + плюрализация + смена языка на лету
function DemoInner() {
  const { t, i18n } = useTranslation();
  const [count, setCount] = useState(1);
  return (
    <div>
      <p style={{ margin: "6px 0" }}>
        {["ru", "en"].map((lng) => (
          <button
            key={lng}
            className="btn"
            style={
              i18n.language === lng
                ? { background: "#4f6ef7", color: "#fff", borderColor: "#4f6ef7" }
                : {}
            }
            onClick={() => i18n.changeLanguage(lng)}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </p>
      <p style={{ fontSize: 18, margin: "8px 0" }}>
        {t("greeting", { name: "Olex" })}
      </p>
      <p style={{ fontSize: 18, margin: "8px 0" }}>
        <b>{t("cart", { count })}</b>
      </p>
      <p style={{ margin: "6px 0" }}>
        {[0, 1, 1.5, 2, 5, 21, 22, 25].map((n) => (
          <button key={n} className="btn" onClick={() => setCount(n)}>
            {n}
          </button>
        ))}
      </p>
      <p className="hint">
        <L
          ru="Пощёлкай числа на русском: 1 товар / 2 товара / 5 товаров / 21 товар / 1.5 товара (дробные — категория other) — i18next сам выбирает форму по правилам CLDR (Intl.PluralRules)."
          en="Click through the numbers in RU: 1 товар / 2 товара / 5 товаров / 21 товар / 1.5 товара (fractions hit the other category) — i18next picks the form itself via CLDR rules (Intl.PluralRules)."
        />
      </p>
    </div>
  );
}

export default function I18n() {
  return (
    <>
      <InterviewQuestion en="How do you internationalize a React app? Tell me about i18next.">
        Как устроена интернационализация (i18n) в React-приложении? Расскажи
        про i18next.
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "i18n means no hardcoded strings in components: all texts live in
            per-language <b>resource files</b>, and the code references them by{" "}
            <b>key</b>. The de-facto standard in React is{" "}
            <b>i18next + react-i18next</b>: the useTranslation hook gives you
            t(), <b>i18n.changeLanguage()</b> switches the language and
            subscribed components re-render on their own. Out of the box it
            covers what naive approaches get wrong: <b>interpolation</b>{" "}
            ({"{{name}}"}), <b>pluralization</b> by CLDR rules — Russian has
            one/few/many forms, so a count===1 ternary is simply wrong — plus
            fallback language, <b>namespaces with lazy loading</b> so you don't
            ship every translation up front, and language detection. For
            translations containing JSX (links, bold) there's the{" "}
            <b>Trans</b> component — you can't concatenate sentence fragments
            because word order differs across languages. Dates, numbers and
            currencies are formatted not with translation strings but with
            native <b>Intl</b> (DateTimeFormat / NumberFormat). And an
            architectural point: i18n should be baked in from day one —
            extracting hardcoded strings from a mature app is expensive."
          </>
        }
      >
        «i18n — это когда в компонентах нет захардкоженных строк: все тексты
        лежат в <b>ресурсных файлах</b> по языкам, а код ссылается на них по{" "}
        <b>ключу</b>. Стандарт де-факто в React — <b>i18next +
        react-i18next</b>: хук useTranslation даёт t(),{" "}
        <b>i18n.changeLanguage()</b> переключает язык, и подписанные
        компоненты ререндерятся сами. Из коробки решены вещи, на которых
        ломаются наивные подходы: <b>интерполяция</b> ({"{{name}}"}),{" "}
        <b>плюрализация</b> по правилам CLDR — в русском формы one/few/many,
        поэтому тернарник count===1 просто неверен, — плюс fallback-язык,{" "}
        <b>неймспейсы с ленивой загрузкой</b>, чтобы не грузить все переводы
        сразу, и определение языка. Для переводов с JSX внутри (ссылки,
        жирный) есть компонент <b>Trans</b> — конкатенировать куски
        предложения нельзя, порядок слов в языках разный. Даты, числа и
        валюты форматируются не строками переводов, а нативным <b>Intl</b>{" "}
        (DateTimeFormat / NumberFormat). И архитектурное: i18n закладывают с
        первого дня — выдирать hardcoded-строки из зрелого приложения
        дорого.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3>
          <L
            ru="Живое демо: настоящий i18next (интерполяция + плюрализация)"
            en="Live demo: real i18next (interpolation + pluralization)"
          />
        </h3>
        <I18nextProvider i18n={demoI18n}>
          <DemoInner />
        </I18nextProvider>
        <CodeBlock
          ru={`// Ресурсы: ключ → перевод; для count-ключей — CLDR-формы
resources: {
  ru: { translation: {
    greeting: "Привет, {{name}}!",
    cart_one:  "В корзине {{count}} товар",    // 1, 21, 31...
    cart_few:  "В корзине {{count}} товара",   // 2-4, 22-24...
    cart_many: "В корзине {{count}} товаров",  // 0, 5-20, 25...
    cart_other: "В корзине {{count}} товара",  // дробные: 1.5 товара
  }},
  en: { translation: {
    greeting: "Hello, {{name}}!",
    cart_one:   "{{count}} item in the cart",
    cart_other: "{{count}} items in the cart", // у английского форм две
  }},
}

// В компоненте:
const { t, i18n } = useTranslation();
t("greeting", { name: "Olex" });   // подставит {{name}}
t("cart", { count: 21 });          // САМ выберет форму: "21 товар"
i18n.changeLanguage("en");         // подписчики ререндерятся сами`}
          en={`// Resources: key → translation; count keys use CLDR forms
resources: {
  ru: { translation: {
    greeting: "Привет, {{name}}!",
    cart_one:  "В корзине {{count}} товар",    // 1, 21, 31...
    cart_few:  "В корзине {{count}} товара",   // 2-4, 22-24...
    cart_many: "В корзине {{count}} товаров",  // 0, 5-20, 25...
    cart_other: "В корзине {{count}} товара",  // fractions: 1.5 товара
  }},
  en: { translation: {
    greeting: "Hello, {{name}}!",
    cart_one:   "{{count}} item in the cart",
    cart_other: "{{count}} items in the cart", // English has two forms
  }},
}

// In a component:
const { t, i18n } = useTranslation();
t("greeting", { name: "Olex" });   // fills in {{name}}
t("cart", { count: 21 });          // picks the form ITSELF: "21 товар"
i18n.changeLanguage("en");         // subscribers re-render on their own`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Что ещё есть у i18next (называй на собесе)"
            en="What else i18next offers (name these in the interview)"
          />
        </h3>
        <CodeBlock
          ru={`// Trans — перевод С JSX внутри (нельзя резать предложение на куски):
// "Прочитай <1>правила</1> перед стартом" / "Read the <1>rules</1> first"
<Trans i18nKey="readRules">
  Прочитай <a href="/rules">правила</a> перед стартом
</Trans>

// Неймспейсы + ленивая загрузка: переводы страницы едут отдельным чанком
useTranslation("checkout");        // подгрузит locales/ru/checkout.json
// (i18next-http-backend), а не весь словарь приложения сразу

// Определение языка: i18next-browser-languagedetector
// (querystring → cookie → localStorage → sessionStorage → navigator → htmlTag)

// Даты/числа/валюты — НЕ переводы, а нативный Intl:
new Intl.NumberFormat("ru-RU",
  { style: "currency", currency: "UAH" }).format(1500);  // "1 500,00 ₴"
new Intl.DateTimeFormat("ru-RU",
  { dateStyle: "long" }).format(new Date());
new Intl.RelativeTimeFormat("ru").format(-2, "day");     // "2 дня назад"`}
          en={`// Trans — translating text WITH JSX inside (you can't slice a sentence):
// "Прочитай <1>правила</1> перед стартом" / "Read the <1>rules</1> first"
<Trans i18nKey="readRules">
  Read the <a href="/rules">rules</a> before you start
</Trans>

// Namespaces + lazy loading: a page's translations ship as their own chunk
useTranslation("checkout");        // loads locales/en/checkout.json
// (i18next-http-backend) instead of the whole app dictionary at once

// Language detection: i18next-browser-languagedetector
// (querystring → cookie → localStorage → sessionStorage → navigator → htmlTag)

// Dates/numbers/currency are NOT translations — they're native Intl:
new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD" }).format(1500);  // "$1,500.00"
new Intl.DateTimeFormat("en-US",
  { dateStyle: "long" }).format(new Date());
new Intl.RelativeTimeFormat("en").format(-2, "day");     // "2 days ago"`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Trade-off: i18next против самодельного переключателя"
            en="Trade-off: i18next vs a hand-rolled toggle"
          />
        </h3>
        <CodeBlock
          ru={`// Этот тренажёр НАМЕРЕННО живёт на самодельном <L ru en> + Context:
// - языка два, контент — большие JSX-блоки и код с переводными комментариями;
// - ключи для тысяч абзацев дали бы JSON-файлы длиннее самих страниц.
//
// i18next выигрывает, когда:
// - языков 3+ и/или переводит отдельная команда/сервис (ключи = контракт);
// - нужны плюрализация, форматирование, ленивые неймспейсы;
// - строки короткие и их много (UI-тексты, а не статьи).
//
// Ответ уровня senior — не «всегда i18next», а критерии выбора.`}
          en={`// This trainer DELIBERATELY runs on a hand-rolled <L ru en> + Context:
// - two languages, and the content is big JSX blocks and code samples
//   with translated comments;
// - keys for thousands of paragraphs would make the JSON files longer
//   than the pages themselves.
//
// i18next wins when:
// - there are 3+ languages and/or a separate team/service translates
//   (keys = the contract);
// - you need pluralization, formatting, lazy-loaded namespaces;
// - strings are short and numerous (UI texts, not articles).
//
// The senior-level answer isn't "always i18next" — it's the criteria.`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Плюрализация тернарником",
            code: `// ❌ count === 1 ? "товар" : "товаров"
// 2 товара? 21 товар? 22 товара? — тернарник врёт на русском
// ✅ t("cart", { count }) + cart_one / cart_few / cart_many`,
            text: "В английском 2 формы, в русском 3 (плюс other для дробных), в арабском 6. CLDR-категории one/few/many/other — ровно та проблема, которую руками решать не надо.",
            en: {
              title: "Pluralizing with a ternary",
              code: `// ❌ count === 1 ? "item" : "items"
// works for English — and lies in Russian: 2 товара? 21 товар?
// ✅ t("cart", { count }) + cart_one / cart_few / cart_many`,
              text: "English has 2 forms, Russian has 3 (plus other for fractions), Arabic has 6. The CLDR categories one/few/many/other are exactly the problem you shouldn't solve by hand.",
            },
          },
          {
            title: "Конкатенация кусков предложения",
            code: `// ❌ t("hello") + ", " + name + "! " + t("youHave") + count
// порядок слов в языках РАЗНЫЙ — собранная фраза не переводится
// ✅ один ключ с интерполяцией: t("helloYouHave", { name, count })
// ✅ с JSX внутри — <Trans>`,
            text: "Переводчик должен видеть предложение целиком: в немецком глагол уедет в конец, в арабском изменится направление. Кусочная сборка делает нормальный перевод невозможным.",
            en: {
              title: "Concatenating sentence fragments",
              code: `// ❌ t("hello") + ", " + name + "! " + t("youHave") + count
// word order DIFFERS across languages — a glued phrase can't be translated
// ✅ one key with interpolation: t("helloYouHave", { name, count })
// ✅ with JSX inside — <Trans>`,
              text: "The translator must see the whole sentence: German pushes the verb to the end, Arabic flips direction. Piecewise assembly makes a proper translation impossible.",
            },
          },
          {
            title: "Даты и валюты строками переводов",
            code: `// ❌ ключи вида "date_format": "DD.MM.YYYY" и ручная подстановка
// ✅ Intl.DateTimeFormat / NumberFormat — локаль сама знает формат:
new Intl.NumberFormat("de-DE",
  { style: "currency", currency: "EUR" }).format(9999.5);
// "9.999,50 €" — разделители, позиция символа, пробелы — всё из локали`,
            text: "Форматирование — не перевод. Нативный Intl знает про разделители, порядок дня/месяца и позицию валютного символа больше, чем любой JSON с шаблонами.",
            en: {
              title: "Dates and currency as translation strings",
              code: `// ❌ keys like "date_format": "DD.MM.YYYY" + manual substitution
// ✅ Intl.DateTimeFormat / NumberFormat — the locale knows the format:
new Intl.NumberFormat("de-DE",
  { style: "currency", currency: "EUR" }).format(9999.5);
// "9.999,50 €" — separators, symbol position, spaces all come from the locale`,
              text: "Formatting is not translation. Native Intl knows more about separators, day/month order and currency-symbol position than any JSON of patterns ever will.",
            },
          },
          {
            title: "Интерполяция и XSS",
            code: `// i18next по умолчанию ЭКРАНИРУЕТ {{значения}} (escapeValue: true).
// В React его выключают (escapeValue: false) — React экранирует сам.
// ❌ опасно ТОЛЬКО одно сочетание:
<div dangerouslySetInnerHTML={{ __html: t("richText", { userInput }) }} />`,
            text: "Классический вопрос-связка с безопасностью: двойного экранирования избегаем, но перевод + dangerouslySetInnerHTML + пользовательский ввод = XSS. Для разметки в переводах — Trans, не innerHTML.",
            en: {
              title: "Interpolation and XSS",
              code: `// i18next ESCAPES {{values}} by default (escapeValue: true).
// In React you turn that off (escapeValue: false) — React escapes itself.
// ❌ only ONE combination is dangerous:
<div dangerouslySetInnerHTML={{ __html: t("richText", { userInput }) }} />`,
              text: "A classic security cross-question: you avoid double escaping, but translation + dangerouslySetInnerHTML + user input = XSS. For markup inside translations use Trans, not innerHTML.",
            },
          },
          {
            title: "Все переводы одним бандлом",
            code: `// ❌ import ru from "./locales/ru.json"; import en, de, fr, es...
// весь словарь всех языков едет каждому пользователю при первой загрузке
// ✅ i18next-http-backend + неймспейсы: язык и страница подгружаются
//    по требованию; fallbackLng страхует недопереведённые ключи`,
            text: "На больших приложениях словари весят мегабайты. Ленивые неймспейсы — тот же принцип, что code splitting: грузим то, что нужно сейчас.",
            en: {
              title: "Shipping every translation in one bundle",
              code: `// ❌ import ru from "./locales/ru.json"; import en, de, fr, es...
// every user downloads every language's dictionary on first load
// ✅ i18next-http-backend + namespaces: a language and a page load
//    on demand; fallbackLng covers not-yet-translated keys`,
              text: "In large apps dictionaries weigh megabytes. Lazy namespaces are the same principle as code splitting: load what's needed right now.",
            },
          },
          {
            title: "i18n.language может быть «ru-RU», а не «ru»",
            code: `// с languagedetector язык приходит КАК ОПРЕДЕЛИЛСЯ: "ru-RU", "en-US"
className={i18n.language === "ru" ? "active" : ""} // ❌ "ru-RU" !== "ru"
// ✅ для UI — i18n.resolvedLanguage: язык, чьи переводы реально
//    применились (с учётом fallback и region-кодов)`,
            text: "В нашем демо lng задан фиксированно, поэтому сравнение честное. В реальном приложении с детектором подсветка кнопок и условия по языку — только через resolvedLanguage. Хороший каверзный вопрос уровня senior.",
            en: {
              title: "i18n.language can be \"ru-RU\", not \"ru\"",
              code: `// with a language detector the language arrives AS DETECTED: "ru-RU", "en-US"
className={i18n.language === "ru" ? "active" : ""} // ❌ "ru-RU" !== "ru"
// ✅ for UI use i18n.resolvedLanguage: the language whose translations
//    actually applied (fallback and region codes accounted for)`,
              text: "Our demo pins lng, so the strict comparison is honest. In a real app with a detector, button highlighting and per-language conditions go through resolvedLanguage only. A great senior-level trick question.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> i18n = ключи вместо строк
              (i18next/react-i18next: t(), интерполяция, CLDR-плюрализация,
              ленивые неймспейсы, Trans для JSX) + нативный Intl для
              дат/чисел/валют; закладывается с первого дня.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> i18n = keys instead of strings
              (i18next/react-i18next: t(), interpolation, CLDR plurals, lazy
              namespaces, Trans for JSX) + native Intl for
              dates/numbers/currency; baked in from day one.
            </>
          }
        />
      </div>
    </>
  );
}
