// Snapshot-тесты не показать «вживую» в браузере — они запускаются тест-раннером.
// Эта страница объясняет механику; рабочий пример: src/__tests__/Badge.test.jsx
// Запуск: npm test
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "./InterviewBlocks.jsx";

export function Badge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function SnapshotTests() {
  return (
    <>
      <InterviewQuestion en="What are snapshot tests? Strengths, weaknesses, where do they fit?">
        Что такое snapshot-тесты? Сильные и слабые стороны, где их место?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "A snapshot test serializes the component's rendered tree into a
            file on the first run; subsequent runs diff against it and fail on
            any change. Strengths: nearly free to write, quickly catches
            <b> unintended</b> markup changes. Weaknesses: <b>fragile</b> —
            they fail on every refactor; they don't test <b>behavior</b>; and
            there's snapshot blindness — people run -u without looking, and
            then the test protects nothing. Their place: small presentational
            leaf components and UI kits, as a regression net; logic and
            interactions — explicit assertions with Testing Library
            (getByRole, fireEvent), inline snapshots for tiny fragments; and
            visual regression (Storybook + Chromatic) does the visual part
            better. Snapshots complement behaviour tests, never replace them."
          </>
        }
      >
        «Snapshot-тест сериализует отрендеренное дерево компонента в файл при
        первом запуске; следующие прогоны сравнивают с ним и падают при любом
        изменении. Сильные стороны: почти бесплатно писать, быстро ловит
        <b> ненамеренные</b> изменения разметки. Слабые: <b>хрупкие</b> —
        падают от любого рефакторинга; не проверяют <b>поведение</b>; и
        «снапшот-слепота» — люди жмут -u не глядя, и тест перестаёт защищать.
        Место: маленькие презентационные компоненты-листья и UI-кит как сеть
        от регрессий; логика и взаимодействия — явные assert-ы через Testing
        Library (getByRole, fireEvent), inline-снапшоты для мелких фрагментов;
        а визуальную часть лучше закрывает visual regression (Storybook +
        Chromatic). Снапшоты дополняют behaviour-тесты, а не заменяют.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3><L ru="Компонент под тестом" en="The component under test" /></h3>
        <p>
          <Badge status="active" /> <Badge status="banned" />
        </p>
        <pre className="code">{`function Badge({ status }) {
  return <span className={\`badge badge-\${status}\`}>{status}</span>;
}`}</pre>
      </div>

      <div className="card">
        <h3><L ru="Тест (src/__tests__/Badge.test.jsx)" en="The test (src/__tests__/Badge.test.jsx)" /></h3>
        <CodeBlock
          ru={`import { render } from "@testing-library/react";

test("Badge не изменился", () => {
  const { container } = render(<Badge status="active" />);
  expect(container.firstChild).toMatchSnapshot();
});`}
          en={`import { render } from "@testing-library/react";

test("Badge hasn't changed", () => {
  const { container } = render(<Badge status="active" />);
  expect(container.firstChild).toMatchSnapshot();
});`}
        />
        <p className="hint">
          <L
            ru="Первый запуск СОЗДАЁТ файл __snapshots__/Badge.test.jsx.snap с «фотографией» разметки. Следующие запуски СРАВНИВАЮТ с ней."
            en={`The first run CREATES the file __snapshots__/Badge.test.jsx.snap with a "snapshot" of the markup. Subsequent runs COMPARE against it.`}
          />
        </p>
        <CodeBlock
          ru={`// __snapshots__/Badge.test.jsx.snap (коммитится в git!)
exports[\`Badge не изменился 1\`] = \`
<span class="badge badge-active">
  active
</span>
\`;`}
          en={`// __snapshots__/Badge.test.jsx.snap (committed to git!)
exports[\`Badge hasn't changed 1\`] = \`
<span class="badge badge-active">
  active
</span>
\`;`}
        />
      </div>

      <div className="card">
        <h3><L ru="Жизненный цикл" en="Lifecycle" /></h3>
        <CodeBlock
          ru={`изменил разметку → тест упал с diff'ом
  ├─ изменение ЖЕЛАННОЕ  → npm test -- -u  (обновить снапшот)
  └─ изменение СЛУЧАЙНОЕ → нашли регрессию, чиним код`}
          en={`changed the markup → the test fails with a diff
  ├─ INTENTIONAL change → npm test -- -u  (update the snapshot)
  └─ ACCIDENTAL change  → found a regression, fix the code`}
        />
      </div>

      <div className="explain">
        <L
          ru={<><b>Резюме одной строкой:</b> снапшоты — дешёвая сеть от случайных
          изменений разметки для компонентов-листьев; поведение — Testing
          Library; -u только глядя на diff.</>}
          en={<><b>One-line summary:</b> snapshots are a cheap net against
          accidental markup changes for leaf components; behavior — Testing
          Library; -u only after looking at the diff.</>}
        />
      </div>

      <div className="redflag">
        <L
          ru={<>
            <b>⚠️ Red flag: «упали снапшоты — запускаю с -u».</b>
            <br />Почему: снапшот существует ровно для того, чтобы человек посмотрел
            diff и подтвердил, что изменение НАМЕРЕННОЕ. Рефлекторное -u превращает
            тест в пустышку: он ничего не ловит, только создаёт ложное чувство
            покрытия и шум в PR. Это red flag про инженерную культуру, а не про
            знание Jest. Правильно: смотреть diff; намеренное изменение — обновить
            осознанно; если снапшоты падают постоянно от мелочей — они слишком
            большие, заменить на behaviour-тесты или inline-снапшоты фрагментов.
          </>}
          en={<>
            <b>⚠️ Red flag: "snapshots failed — I'll just run with -u".</b>
            <br />Why: a snapshot exists for exactly one reason — so a human looks
            at the diff and confirms the change is INTENTIONAL. Reflexive -u turns
            the test into a rubber stamp: it catches nothing, and only creates a
            false sense of coverage and noise in the PR. This is a red flag about
            engineering culture, not Jest knowledge. The right approach: look at
            the diff; update deliberately for an intentional change; if snapshots
            keep failing over trivial things, they're too large — replace them with
            behavior tests or inline snapshots of small fragments.
          </>}
        />
      </div>
    </>
  );
}
