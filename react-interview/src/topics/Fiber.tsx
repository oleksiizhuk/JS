import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, L, CodeBlock } from "./InterviewBlocks";

export default function Fiber() {
  return (
    <>
      <InterviewQuestion en="What is React Fiber? What problem did it solve and how does it work?">
        Что такое React Fiber? Какую проблему он решил и как устроен?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Fiber is the <b>reconciler architecture</b> React has used since
            v16. The old stack reconciler walked the tree <b>recursively</b>:
            once a render started, it couldn't stop until the whole tree was
            done — a heavy update froze the main thread and input. Fiber
            re-implements the same work as a <b>linked list of fiber nodes</b>
            (child / sibling / return): each fiber is one <b>unit of work</b>.
            In a concurrent render — transitions, deferred values — React can
            pause after any unit, yield the thread to urgent work like typing
            or a click, then resume or <b>throw the work away</b>; urgent
            updates still render in one synchronous pass. A fiber node holds
            the component type, props, state (for hooks — their own linked
            list, which is why hook order matters), pending effects and its
            priority <b>lane</b>. Two trees exist at once — <b>current</b> and
            <b> workInProgress</b>, linked by alternate (double buffering):
            the interruptible <b>render phase</b> builds the new tree in
            memory, while <b>commit</b> is synchronous and non-interruptible —
            it applies the changes to the DOM and flips the root.current
            pointer. The key point: Fiber didn't make rendering faster — it
            made it <b>interruptible and prioritizable</b>, and that is the
            foundation everything concurrent stands on: useTransition,
            Suspense, streaming."
          </>
        }
      >
        «Fiber — это <b>архитектура reconciler-а</b>, на которой React живёт
        с 16-й версии. Старый stack reconciler обходил дерево
        <b> рекурсивно</b>: начав рендер, он не мог остановиться, пока не
        пройдёт всё дерево — тяжёлое обновление замораживало главный поток и
        ввод. Fiber переделывает ту же работу в <b>связный список
        fiber-узлов</b> (child / sibling / return): каждый fiber — одна
        <b> единица работы</b>. В конкурентном рендере — transitions,
        deferred — React может остановиться после любой единицы, отдать поток
        срочному (вводу, клику), а потом продолжить или <b>выбросить
        работу</b>; срочные же обновления по-прежнему рендерятся одним
        синхронным проходом. Fiber-узел хранит тип компонента, props, state
        (для хуков — их собственный связный список, поэтому порядок хуков
        важен), отложенные эффекты и приоритет-<b>lane</b>. Деревьев
        одновременно два — <b>current</b> и <b>workInProgress</b>, связанные
        через alternate (double buffering): прерываемая <b>render-фаза</b>{" "}
        строит новое дерево в памяти, а <b>commit</b> — синхронный и
        непрерываемый — применяет изменения к DOM и переставляет указатель
        root.current. Ключевая мысль: Fiber не сделал рендер быстрее — он
        сделал его <b>прерываемым и приоритизируемым</b>, и на этом стоит всё
        конкурентное: useTransition, Suspense, стриминг.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3>
          <L
            ru="Проблема: рекурсия, которую нельзя прервать"
            en="The problem: recursion you can't interrupt"
          />
        </h3>
        <CodeBlock
          ru={`// Stack reconciler (React ≤15) — по сути рекурсия:
function reconcile(element) {
  updateComponent(element);
  element.children.forEach(reconcile);   // весь стек вызовов занят,
}                                        // прерваться НЕЛЬЗЯ

// Дерево на 3000 компонентов × 0.1мс = 300мс блокировки:
// кадр = 16мс → 18 пропущенных кадров, ввод заморожен.
// Единственный способ «прерваться» у рекурсии — раскрутить стек, т.е. закончить.`}
          en={`// Stack reconciler (React ≤15) — essentially recursion:
function reconcile(element) {
  updateComponent(element);
  element.children.forEach(reconcile);   // the call stack is occupied,
}                                        // pausing is IMPOSSIBLE

// A 3000-component tree × 0.1ms = 300ms of blocking:
// a frame = 16ms → 18 dropped frames, input frozen.
// The only way recursion can "pause" is to unwind the stack — i.e. finish.`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Решение: дерево как связный список единиц работы"
            en="The solution: the tree as a linked list of work units"
          />
        </h3>
        <CodeBlock
          ru={`// Fiber-узел (упрощённо):
{
  type: App,                // компонент / 'div' / текст
  memoizedProps,            // props прошлого рендера
  memoizedState,            // state; у функц. компонента — СПИСОК хуков:
                            //   hook1 → hook2 → ... (порядок вызова важен!)
  child, sibling, return,   // ← вместо рекурсии: указатели для обхода
  alternate,                // пара из другого дерева (double buffering)
  lanes,                    // приоритет отложенной работы
  flags,                    // что делать в commit (Placement/Update/Deletion)
}

// Конкурентный цикл вместо рекурсии (transitions, deferred):
while (workInProgress !== null && !shouldYield()) {
  workInProgress = performUnitOfWork(workInProgress);  // один fiber за шаг
}
// shouldYield(): тайм-слайс (~5мс) истёк → отдать главный поток браузеру;
// указатель workInProgress ПОМНИТ, где остановились — продолжим позже.
// Срочный ввод вклинивается через приоритеты lanes, а НЕ внутри shouldYield.
// Обычный setState рендерится синхронным циклом БЕЗ shouldYield.`}
          en={`// A fiber node (simplified):
{
  type: App,                // component / 'div' / text
  memoizedProps,            // props from the last render
  memoizedState,            // state; for a function component — the LIST
                            //   of hooks: hook1 → hook2 → ... (call order!)
  child, sibling, return,   // ← instead of recursion: traversal pointers
  alternate,                // its twin in the other tree (double buffering)
  lanes,                    // priority of the pending work
  flags,                    // what to do in commit (Placement/Update/Deletion)
}

// The concurrent loop instead of recursion (transitions, deferred):
while (workInProgress !== null && !shouldYield()) {
  workInProgress = performUnitOfWork(workInProgress);  // one fiber per step
}
// shouldYield(): the ~5ms time slice ran out → yield the main thread back;
// the workInProgress pointer REMEMBERS where we stopped — resume later.
// Urgent input cuts in via lane priorities, NOT inside shouldYield.
// A regular setState renders in a synchronous loop WITHOUT shouldYield.`}
        />
        <p className="hint">
          <L
            ru="Указатели child/sibling/return позволяют пройти дерево циклом с паузой в любой точке — стек вызовов свободен. Это и есть ключевой трюк Fiber."
            en="The child/sibling/return pointers let React walk the tree with a loop, pausable at any point — the call stack stays free. That's the core Fiber trick."
          />
        </p>
      </div>

      <div className="card">
        <h3>
          <L
            ru="Double buffering и приоритеты (lanes)"
            en="Double buffering and priorities (lanes)"
          />
        </h3>
        <CodeBlock
          ru={`current ──alternate──▶ workInProgress
      (на экране)              (строится в памяти, с паузами)

// commit — СИНХРОННЫЙ и непрерываемый: применяет flags к реальному DOM,
// вызывает layout-эффекты и переставляет root.current = workInProgress.
// Прерываема только render-фаза. Пользователь никогда не видит
// полусобранное дерево; брошенная работа = просто не дошли до commit.

Lanes — приоритеты обновлений (битовая маска):
SyncLane          discrete-события (клик)  — нельзя прерывать
TransitionLane    startTransition          — прерываемо, можно выбросить
IdleLane          фоновое                  — когда совсем нечего делать
// срочная lane ВЫТЕСНЯЕТ transition-рендер: его fiber-дерево
// выбрасывается и строится заново после срочного`}
          en={`current ──alternate──▶ workInProgress
      (on screen)               (built in memory, with pauses)

// commit is SYNCHRONOUS and non-interruptible: it applies flags to the
// real DOM, runs layout effects and flips root.current = workInProgress.
// Only the render phase is interruptible. The user never sees
// a half-built tree; discarded work = simply never reaching commit.

Lanes — update priorities (a bitmask):
SyncLane          discrete events (click)  — cannot be interrupted
TransitionLane    startTransition          — interruptible, discardable
IdleLane          background               — when there's nothing else to do
// an urgent lane PREEMPTS a transition render: its fiber tree
// is thrown away and rebuilt after the urgent work`}
        />
      </div>

      <div className="card">
        <h3>
          <L
            ru="Что Fiber сделал возможным"
            en="What Fiber made possible"
          />
        </h3>
        <CodeBlock
          ru={`Прерываемость      → useTransition / useDeferredValue (тема Concurrent)
Возобновляемость   → Suspense: показали fallback, дождались данных,
                     перерендерили приостановленное поддерево
Приоритеты (lanes) → ввод отзывчив во время тяжёлого рендера
Double buffering   → атомарная подмена дерева, брошенные рендеры без следов
Хуки на fiber      → useState «помнит» state между вызовами функции
Error boundaries   → раскрутка по return-указателям до ближайшей границы

Связь тем: reconciliation (diff по типам и key) РАБОТАЕТ НА fiber-дереве;
StrictMode дважды вызывает рендер, проверяя чистоту — иначе
прерывание/повтор были бы небезопасны (тема FP).`}
          en={`Interruptibility   → useTransition / useDeferredValue (Concurrent topic)
Resumability       → Suspense: show the fallback, wait for data,
                     re-render the suspended subtree
Priorities (lanes) → input stays responsive during a heavy render
Double buffering   → atomic tree swap, discarded renders leave no traces
Hooks on the fiber → useState "remembers" state between function calls
Error boundaries   → unwinding via return pointers to the nearest boundary

Topic links: reconciliation (diff by type and key) RUNS ON the fiber tree;
StrictMode double-invokes renders to verify purity — otherwise
interrupting/replaying wouldn't be safe (see the FP topic).`}
        />
        <p className="hint">
          <L
            ru="Пощупать прерываемость вживую можно на странице «useTransition / Deferred» (секция React) — там демо с тяжёлым рендером."
            en="You can feel interruptibility live on the “useTransition / Deferred” page (React section) — it has a heavy-render demo."
          />
        </p>
      </div>

      <Gotchas
        items={[
          {
            title: "«Fiber — это новый virtual DOM?»",
            code: `// Virtual DOM — ИДЕЯ (описание UI объектами + diff)
// Fiber — РЕАЛИЗАЦИЯ reconciler-а, который этот diff исполняет
// fiber-узел ≈ vDOM-узел, расширенный работой: указатели обхода,
// state, эффекты, приоритет`,
            text: "Частая путаница уровней. Ответ: virtual DOM — концепция, Fiber — архитектура её вычисления, добавившая прерываемость.",
            en: {
              title: '"Is Fiber a new virtual DOM?"',
              code: `// Virtual DOM is an IDEA (describe UI as objects + diff)
// Fiber is the reconciler IMPLEMENTATION that executes that diff
// a fiber node ≈ a vDOM node extended with work: traversal pointers,
// state, effects, priority`,
              text: "A common level-of-abstraction mixup. Answer: virtual DOM is the concept; Fiber is the architecture that computes it, adding interruptibility.",
            },
          },
          {
            title: "«Fiber ускорил React?»",
            code: `// Объём работы ТОТ ЖЕ (даже чуть больше — накладные расходы).
// Изменилось РАСПРЕДЕЛЕНИЕ: работа нарезана, срочное вклинивается.
// Метрика улучшилась не throughput, а отзывчивость (INP)`,
            text: "Ответ «стало быстрее» — минус. Правильно: рендер стал прерываемым и приоритизируемым; сумма работы не уменьшилась.",
            en: {
              title: '"Did Fiber make React faster?"',
              code: `// The amount of work is THE SAME (slightly more — bookkeeping overhead).
// What changed is SCHEDULING: work is sliced, urgent work cuts in line.
// The metric that improved isn't throughput — it's responsiveness (INP)`,
              text: "Answering \"it got faster\" costs points. Correct: rendering became interruptible and prioritizable; the total work didn't shrink.",
            },
          },
          {
            title: "Почему хуки нельзя вызывать условно — ответ через Fiber",
            code: `fiber.memoizedState → hook1 → hook2 → hook3
// у хуков НЕТ имён: React идёт по списку по порядку вызова.
// if пропустил hook2 → React отдаст hook3 состояние hook2`,
            text: "Правило хуков — прямое следствие хранения хуков связным списком на fiber-узле. Связка двух тем в одном ответе — сильный ход на собесе.",
            en: {
              title: "Why hooks can't be called conditionally — the Fiber answer",
              code: `fiber.memoizedState → hook1 → hook2 → hook3
// hooks have NO names: React walks the list in call order.
// an if skipped hook2 → React hands hook3 the state of hook2`,
              text: "The rules of hooks are a direct consequence of hooks living as a linked list on the fiber node. Connecting the two topics in one answer is a strong interview move.",
            },
          },
          {
            title: "«Прерываемость = рендер в другом потоке?»",
            code: `// НЕТ: всё в одном (главном) потоке.
// Fiber — КООПЕРАТИВНАЯ многозадачность: работа нарезана на куски,
// между кусками главный поток отдаётся браузеру (scheduler + shouldYield)`,
            text: "Web Workers тут ни при чём. Уместная аналогия — event loop: длинная работа нарезается, чтобы не блокировать очередь.",
            en: {
              title: '"Interruptible = rendering on another thread?"',
              code: `// NO: everything runs on one (main) thread.
// Fiber is COOPERATIVE multitasking: work is sliced into chunks,
// and between chunks the main thread is yielded back to the browser
// (scheduler + shouldYield)`,
              text: "Web Workers are not involved. The apt analogy is the event loop: long work is sliced so it doesn't block the queue.",
            },
          },
          {
            title: "«Fiber работает на requestIdleCallback?»",
            code: `// НЕТ: React использует собственный пакет scheduler.
// Планирование — macrotask через MessageChannel, тайм-слайс ~5мс.
// rIC отвергли: вызывается слишком редко и нестабильно между браузерами.
// Проверка «есть ли ввод» внутри shouldYield в стабильном React
// не используется — срочное вклинивается через lanes.`,
            text: "Частый вопрос-подлянка. Ответ: не rIC и не rAF, а свой scheduler; shouldYield проверяет истечение тайм-слайса, а приоритеты разруливают lanes.",
            en: {
              title: '"Does Fiber run on requestIdleCallback?"',
              code: `// NO: React ships its own scheduler package.
// Scheduling = a macrotask via MessageChannel, ~5ms time slices.
// rIC was rejected: it fires too rarely and inconsistently across browsers.
// An "is input pending" check inside shouldYield is not used
// in stable React — urgency cuts in through lanes instead.`,
              text: "A classic trick question. The answer: neither rIC nor rAF but React's own scheduler; shouldYield checks time-slice expiry, and priorities are handled by lanes.",
            },
          },
          {
            title: "«Компонент отрендерился дважды — это баг Fiber?»",
            code: `// Прерванный/выброшенный рендер может ПОВТОРИТЬСЯ —
// это законно, ПОТОМУ ЧТО render обязан быть чистым.
// Мутация в теле рендера + повтор = двойной сайд-эффект (лови в StrictMode)`,
            text: "Отсюда требование чистоты render-фазы: React вправе вызвать её сколько угодно раз. Сайд-эффектам место в эффектах и обработчиках.",
            en: {
              title: '"My component rendered twice — a Fiber bug?"',
              code: `// An interrupted/discarded render may be REPLAYED —
// which is legal PRECISELY BECAUSE render must be pure.
// A mutation in the render body + a replay = a doubled side effect
// (StrictMode exists to catch this)`,
              text: "Hence the render-phase purity requirement: React may invoke it any number of times. Side effects belong in effects and handlers.",
            },
          },
        ]}
      />

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> Fiber = reconciler на связном списке
              единиц работы вместо рекурсии: пауза после любого узла, lanes для
              приоритетов, два дерева (current/workInProgress) с атомарным
              commit; не быстрее — прерываемее, и на этом стоят все
              concurrent-фичи.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> Fiber = a reconciler built on a linked
              list of work units instead of recursion: pause after any node,
              lanes for priorities, two trees (current/workInProgress) with an
              atomic commit; not faster — interruptible, and every concurrent
              feature stands on it.
            </>
          }
        />
      </div>
    </>
  );
}
