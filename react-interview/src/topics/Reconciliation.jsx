import { useState } from "react";
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "./InterviewBlocks.jsx";
import { useLang } from "../LangContext.jsx";

let nextId = 4;
const initial = [
  { id: 1, name: "Яблоко" },
  { id: 2, name: "Банан" },
  { id: 3, name: "Вишня" },
];
// Отображаемые имена для en — сами данные (ru) не трогаем
const NAME_EN = { "Яблоко": "Apple", "Банан": "Banana", "Вишня": "Cherry" };

// Демо бага: у каждой строки есть НЕконтролируемый input.
// При key=index React считает «строка №0 осталась строкой №0» и переиспользует
// её DOM (вместе с введённым текстом), хотя данные сдвинулись.
function List({ items, useIndexKey }) {
  const lang = useLang();
  return (
    <ul style={{ paddingLeft: 18 }}>
      {items.map((item, index) => (
        <li key={useIndexKey ? index : item.id} style={{ marginBottom: 6 }}>
          {lang === "en" ? NAME_EN[item.name] ?? item.name : item.name}{" "}
          <input className="inp" placeholder={lang === "en" ? "note..." : "заметка..."} style={{ width: 120 }} />
        </li>
      ))}
    </ul>
  );
}

export default function Reconciliation() {
  const lang = useLang();
  const [items, setItems] = useState(initial);

  const addToTop = () =>
    setItems([
      { id: nextId++, name: lang === "en" ? `New ${nextId}` : `Новый ${nextId}` },
      ...items,
    ]);
  const shuffle = () => setItems([...items].sort(() => Math.random() - 0.5));

  return (
    <>
      <InterviewQuestion en="How does reconciliation work? Why are keys needed?">
        Как работает reconciliation? Зачем нужны key?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "Reconciliation is diffing the new element tree against the fiber
            tree to apply the minimum of DOM changes, with O(n) heuristics:
            a <b>different element type</b> (div → span) — the subtree is torn
            down and rebuilt, children lose state; the <b>same type</b> — only
            props are updated; and in lists <b>key defines the identity</b> of
            an element between renders. Keys must be stable and unique — ids
            from data. key=index breaks on insert/delete/reorder — state
            sticks to the position; a random key is even worse: a full remount
            every render. Underneath it all is <b>Fiber</b> — a unit of work
            in a linked list that lets React interrupt, prioritize and resume
            rendering (the basis of concurrent features), with double
            buffering: current and work-in-progress trees. Bonus: deliberately
            changing a key is a legit way to reset a component's state."
          </>
        }
      >
        «Reconciliation — сравнение нового дерева элементов с fiber-деревом,
        чтобы применить к DOM минимум изменений, эвристики за O(n):
        <b> разный тип элемента</b> (div → span) — поддерево сносится и
        строится заново, дети теряют state; <b>одинаковый тип</b> —
        обновляются только props; а в списках <b>key определяет идентичность</b>
        элемента между рендерами. Key должен быть стабильным и уникальным —
        id из данных. key=index ломается при вставке/удалении/сортировке —
        state прилипает к позиции; случайный key ещё хуже — полный ремаунт
        каждый рендер. Под капотом — <b>Fiber</b>: единица работы в связном
        списке, позволяющая прерывать, приоритизировать и возобновлять рендер
        (основа concurrent features), с double buffering: current и
        work-in-progress деревья. Бонус: намеренная смена key — легитимный
        способ сбросить state компонента.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <p>
          <L
            ru={<>1. Впиши текст в «заметки» у пары строк → 2. жми кнопки → 3. смотри,
            к каким строкам прилипли заметки</>}
            en={<>1. Type text into the "note" field on a couple of rows → 2. click the
            buttons → 3. watch which rows the notes stick to</>}
          />
        </p>
        <button className="btn primary" onClick={addToTop}>
          {lang === "en" ? "Add to TOP" : "Добавить В НАЧАЛО"}
        </button>
        <button className="btn" onClick={shuffle}>{lang === "en" ? "Shuffle" : "Перемешать"}</button>
        <button className="btn" onClick={() => setItems(initial)}>{lang === "en" ? "Reset" : "Сброс"}</button>
      </div>

      <div className="row">
        <div className="card">
          <h3>❌ key={"{index}"}</h3>
          <List items={items} useIndexKey={true} />
          <p className="hint"><L ru="заметки остаются на позициях, а не на своих строках" en="notes stay on positions, not on their own rows" /></p>
        </div>
        <div className="card">
          <h3>✅ key={"{item.id}"}</h3>
          <List items={items} useIndexKey={false} />
          <p className="hint"><L ru="заметки переезжают вместе со своими строками" en="notes move together with their rows" /></p>
        </div>
      </div>

      <div className="explain">
        <L
          ru={<><b>Резюме одной строкой:</b> diff по эвристикам (тип элемента + key в
          списках); key — стабильный id из данных, не index и не random; смена
          key = сброс state.</>}
          en={<><b>One-line summary:</b> diffing by heuristics (element type + key in
          lists); key — a stable id from the data, not index and not random; changing
          the key = resetting state.</>}
        />
      </div>

      <div className="redflag">
        <L
          ru={<>
            <b>⚠️ Red flag: key={"{index}"} или key={"{Math.random()}"}.</b>
            <br /><b>index:</b> key говорит React «это ТОТ ЖЕ элемент, что в прошлом
            рендере». При удалении первого элемента индексы сдвигаются — React решает,
            что элемент 0 остался (обновит props), а удалился последний. Состояние
            (текст инпутов, фокус, анимации) прилипает к ПОЗИЦИИ, а не к данным —
            ровно то, что показывает демо. Index допустим только для статичных
            списков без вставки/удаления/сортировки.
            <br /><b>random:</b> каждый рендер — новые ключи → React считает весь
            старый список удалённым → полный ремаунт всех элементов каждый раз.
            Хуже, чем вообще без key.
            <br />Бонус-знание: НАМЕРЕННАЯ смена key — легитимный трюк для сброса
            state компонента (мы так делаем в App.jsx при переключении тем).
          </>}
          en={<>
            <b>⚠️ Red flag: key={"{index}"} or key={"{Math.random()}"}.</b>
            <br /><b>index:</b> key tells React "this is the SAME element as in the
            previous render". When the first element is deleted, indexes shift —
            React decides that element 0 stayed (and updates its props), and the
            last one was removed. State (input text, focus, animations) sticks to
            the POSITION, not the data — exactly what the demo shows. Index is only
            acceptable for static lists with no insert/delete/reorder.
            <br /><b>random:</b> every render gets new keys → React thinks the
            entire old list was removed → a full remount of every element, every
            time. Worse than having no key at all.
            <br />Bonus knowledge: DELIBERATELY changing a key is a legitimate trick
            for resetting a component's state (that's what we do in App.jsx when
            switching themes).
          </>}
        />
      </div>
    </>
  );
}
