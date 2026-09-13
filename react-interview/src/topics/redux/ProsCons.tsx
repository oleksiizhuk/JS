import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "../InterviewBlocks";

export default function ProsCons() {
  return (
    <>
      <InterviewQuestion en="Pros and cons of Redux? When would you pick it and when not?">
        Плюсы и минусы Redux? Когда его брать, а когда нет?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Pros: <b>predictability</b> — one data flow and pure reducers;
            <b> devtools</b> with an action log and time-travel;
            <b> testability</b> — a reducer is input → output;
            <b> selectors</b> — subscribing to a slice with targeted
            re-renders; it scales to big teams and it's framework-agnostic.
            Cons: boilerplate — largely solved by RTK; entry threshold;
            overkill for small apps; and the temptation to put everything
            global. My decision rule splits state into three kinds:
            <b> local</b> UI state → useState; <b>shared client</b> state that
            changes often → Redux/Zustand; <b>server data</b> → RTK
            Query/TanStack Query, because that's a cache, not state. I take
            Redux when there's a lot of shared, frequently changing client
            state and the team needs strict conventions and debugging."
          </>
        }
      >
        «Плюсы: <b>предсказуемость</b> — один поток данных и чистые reducer-ы;
        <b> devtools</b> с логом action-ов и time-travel;
        <b> тестируемость</b> — reducer это вход → выход; <b>селекторы</b> —
        подписка на срез с точечными ре-рендерами; масштабируется на большие
        команды и не привязан к React. Минусы: boilerplate — во многом решён
        RTK; порог входа; оверкилл для малых приложений; соблазн тащить всё в
        глобальное. Моё правило выбора делит состояние на три вида:
        <b> локальный</b> UI-state → useState; <b>общий клиентский</b>, часто
        меняющийся → Redux/Zustand; <b>серверные данные</b> → RTK
        Query/TanStack Query, потому что это кэш, а не state. Redux беру,
        когда много общего часто меняющегося клиентского состояния и команде
        нужны жёсткие соглашения и отладка.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="row">
        <div className="card">
          <h3><L ru="✅ Плюсы" en="✅ Pros" /></h3>
          <ul style={{ paddingLeft: 18, lineHeight: 1.7 }}>
            <li>
              <L
                ru={<><b>Предсказуемость</b> — один поток данных, чистые reducer-ы</>}
                en={<><b>Predictability</b> — one data flow, pure reducers</>}
              />
            </li>
            <li>
              <L
                ru={<><b>DevTools</b> — лог всех action-ов, time-travel, diff state</>}
                en={<><b>DevTools</b> — a log of every action, time-travel, state diffs</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Тестируемость</b> — reducer это чистая функция: вход → выход</>}
                en={<><b>Testability</b> — a reducer is a pure function: input → output</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Селекторы</b> — подписка на срез, точечные ре-рендеры</>}
                en={<><b>Selectors</b> — subscribe to a slice, targeted re-renders</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Масштаб</b> — большая команда, много фич, единые правила</>}
                en={<><b>Scale</b> — large teams, many features, shared conventions</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Middleware</b> — централизованные side effects, логирование</>}
                en={<><b>Middleware</b> — centralized side effects, logging</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Отвязан от React</b> — можно использовать где угодно</>}
                en={<><b>Framework-agnostic</b> — can be used anywhere</>}
              />
            </li>
          </ul>
        </div>
        <div className="card">
          <h3><L ru="❌ Минусы" en="❌ Cons" /></h3>
          <ul style={{ paddingLeft: 18, lineHeight: 1.7 }}>
            <li>
              <L
                ru={<><b>Boilerplate</b> — actions/reducers/types (RTK сильно сократил)</>}
                en={<><b>Boilerplate</b> — actions/reducers/types (RTK cut this down a lot)</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Порог входа</b> — middleware, immutability, нормализация</>}
                en={<><b>Entry threshold</b> — middleware, immutability, normalization</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Оверкилл</b> для малых приложений — useState/Context хватает</>}
                en={<><b>Overkill</b> for small apps — useState/Context is enough</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Всё глобальное</b> — соблазн тащить в стор локальный state</>}
                en={<><b>Everything global</b> — the temptation to dump local state into the store</>}
              />
            </li>
            <li>
              <L
                ru={<><b>Серверные данные</b> — руками (кэш, рефетч) плохо; нужен RTK Query</>}
                en={<><b>Server data</b> — handling it by hand (cache, refetch) is painful; you need RTK Query</>}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3><L ru="Когда брать / не брать" en="When to use it / not" /></h3>
        <CodeBlock
          ru={`Брать Redux (RTK):
  • много общего часто меняющегося state между разными частями приложения
  • нужна отладка сложных сценариев (time-travel, лог действий)
  • большая команда — нужны жёсткие соглашения

Не брать:
  • state локален по фичам               → useState / useReducer
  • просто пробросить вниз тему/юзера    → Context
  • «глобальный state» = данные сервера  → TanStack Query / RTK Query
  • нужен лёгкий глобальный стор         → Zustand / Jotai`}
          en={`Use Redux (RTK) when:
  • there's a lot of shared, frequently changing state across parts of the app
  • you need to debug complex scenarios (time-travel, action log)
  • the team is large and needs strict conventions

Don't use it when:
  • state is local to a feature            → useState / useReducer
  • you just need to pass theme/user down  → Context
  • "global state" really means server data → TanStack Query / RTK Query
  • you want a lightweight global store    → Zustand / Jotai`}
        />
      </div>

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: «кладу ВСЁ состояние в Redux».</b>
              <br />Почему: локальный UI-state (открыт ли дропдаун, значение
              инпута) в глобальном сторе — это шум в devtools, лишние
              ре-рендеры и зацепленность компонента за стор без причины. И
              наоборот: серверные данные в самописных reducer-ах — это ручное
              изобретение кэша, который RTK Query/TanStack Query дают из
              коробки. Senior-ответ: state делится на локальный (useState),
              shared UI-state (стор) и серверный кэш (query-библиотека).
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: "I put ALL state in Redux."</b>
              <br />Why it's wrong: local UI state (is a dropdown open, an
              input's value) in the global store is noise in devtools,
              unnecessary re-renders, and coupling a component to the store
              for no reason. And the reverse: server data in hand-rolled
              reducers is reinventing a cache by hand, which RTK
              Query/TanStack Query give you out of the box. The senior answer:
              split state into local (useState), shared UI state (the store),
              and a server cache (a query library).
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> предсказуемость/devtools/тестируемость
              vs boilerplate/порог/оверкилл; зрелость = делить state на
              локальный / общий клиентский / серверный кэш и называть
              инструмент для каждого.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> predictability/devtools/testability vs
              boilerplate/entry threshold/overkill; maturity means splitting
              state into local / shared client / server cache and naming the
              right tool for each.
            </>
          }
        />
      </div>
    </>
  );
}
