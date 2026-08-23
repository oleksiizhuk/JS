import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function Lists() {
  return (
    <>
      <InterviewQuestion en="FlatList vs ScrollView — difference? How do you optimize long lists?">
        FlatList vs ScrollView — в чём разница? Как оптимизируешь длинные списки?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "<b>ScrollView</b> renders <b>all</b> children at once — fine for
            a screen of known small content (a form, a settings page).
            <b> FlatList</b> is <b>virtualized</b>: it renders only the window
            around the viewport, recycles rows, and takes data/renderItem —
            for any dynamic or long list it's the only right choice; hundreds
            of items in a ScrollView means memory spikes and a frozen JS
            thread. Tuning FlatList: stable <b>keyExtractor</b>,
            <b> getItemLayout</b> when row height is fixed — skips async
            measurement, windowSize/initialNumToRender to size the window,
            removeClippedSubviews, memoized renderItem components without
            inline closures. If it's still not smooth — <b>FlashList</b> from
            Shopify: view recycling, an order faster on heavy lists. Related
            props to mention: onEndReached for pagination, ListHeaderComponent,
            refreshControl."
          </>
        }
      >
        «<b>ScrollView</b> рендерит <b>все</b> дочерние элементы сразу —
        годится для экрана с заведомо небольшим контентом (форма, настройки).
        <b> FlatList</b> — <b>виртуализированный</b>: рендерит только окно
        вокруг вьюпорта, переиспользует строки, принимает data/renderItem —
        для любого динамического или длинного списка это единственный
        правильный выбор; сотни элементов в ScrollView — это скачок памяти и
        замёрзший JS-поток. Тюнинг FlatList: стабильный <b>keyExtractor</b>,
        <b> getItemLayout</b> при фиксированной высоте строки — убирает
        асинхронные замеры, windowSize/initialNumToRender для размера окна,
        removeClippedSubviews, мемоизированные renderItem-компоненты без
        инлайн-замыканий. Если всё ещё не гладко — <b>FlashList</b> от
        Shopify: recycling вью, на порядок быстрее на тяжёлых списках.
        Смежные пропсы: onEndReached для пагинации, ListHeaderComponent,
        refreshControl.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="Правильный FlatList" en="A properly tuned FlatList" /></h3>
        <CodeBlock
          ru={`const Row = memo(function Row({ item }) {        // мемо-строка
  return <Text style={styles.row}>{item.title}</Text>;
});

<FlatList
  data={items}
  keyExtractor={(item) => item.id}               // стабильный id, НЕ index
  renderItem={({ item }) => <Row item={item} />}
  getItemLayout={(_, i) => (                     // если высота фиксированная
    { length: ROW_H, offset: ROW_H * i, index: i }
  )}
  initialNumToRender={10}
  windowSize={7}                                 // окон вьюпорта в памяти
  removeClippedSubviews
  onEndReached={loadMore}                        // пагинация
  onEndReachedThreshold={0.5}
/>`}
          en={`const Row = memo(function Row({ item }) {        // memoized row
  return <Text style={styles.row}>{item.title}</Text>;
});

<FlatList
  data={items}
  keyExtractor={(item) => item.id}               // stable id, NOT index
  renderItem={({ item }) => <Row item={item} />}
  getItemLayout={(_, i) => (                     // when row height is fixed
    { length: ROW_H, offset: ROW_H * i, index: i }
  )}
  initialNumToRender={10}
  windowSize={7}                                 // viewport windows kept in memory
  removeClippedSubviews
  onEndReached={loadMore}                        // pagination
  onEndReachedThreshold={0.5}
/>`}
        />
      </div>

      <div className="card">
        <h3><L ru="Когда что" en="Which one, when" /></h3>
        <CodeBlock
          ru={`ScrollView — статичный небольшой контент: форма, детали, онбординг
FlatList   — динамические списки: лента, поиск, чат (inverted)
SectionList— списки с заголовками секций
FlashList  — тяжёлые ленты, когда FlatList уже затюнен и всё равно лагает`}
          en={`ScrollView — static, small, known content: a form, a details screen, onboarding
FlatList   — dynamic lists: feeds, search results, chat (inverted)
SectionList— lists with section headers
FlashList  — heavy feeds, when FlatList is already tuned and still lags`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "FlatList внутри ScrollView",
            code: `<ScrollView>
  <FlatList ... />  // ⚠️ VirtualizedLists should never be nested
</ScrollView>
// виртуализация ломается: FlatList получает "бесконечную" высоту`,
            text: "Классика. Фикс: ListHeaderComponent/ListFooterComponent у самого FlatList вместо обёртки ScrollView.",
            en: {
              title: "FlatList inside a ScrollView",
              code: `<ScrollView>
  <FlatList ... />  // ⚠️ VirtualizedLists should never be nested
</ScrollView>
// virtualization breaks: FlatList gets an "infinite" height`,
              text: "A classic. Fix: use ListHeaderComponent/ListFooterComponent on the FlatList itself instead of wrapping it in a ScrollView.",
            },
          },
          {
            title: "«Список мигает пустотой при скролле»",
            code: `// быстрый скролл обгоняет рендер окна (blank cells)
// фиксы: getItemLayout, ↑windowSize/maxToRenderPerBatch,
// упростить/мемоизировать Row, FlashList`,
            text: "Проверяют, понимаешь ли механику виртуализации, а не просто «использую FlatList».",
            en: {
              title: "\"The list flashes blank cells while scrolling\"",
              code: `// fast scrolling outruns window rendering (blank cells)
// fixes: getItemLayout, ↑windowSize/maxToRenderPerBatch,
// simplify/memoize Row, FlashList`,
              text: "Tests whether you understand the mechanics of virtualization, not just \"I use FlatList\".",
            },
          },
          {
            title: "Инлайн renderItem с замыканием",
            code: `renderItem={({ item }) => (
  <Row item={item} onPress={() => nav(item.id)} />  // новая fn каждый рендер
)}
// → memo у Row бесполезен; выносить обработчик, передавать id`,
            text: "Та же referential equality, что в вебе: инлайн-функции ломают мемоизацию строк.",
            en: {
              title: "Inline renderItem with a closure",
              code: `renderItem={({ item }) => (
  <Row item={item} onPress={() => nav(item.id)} />  // new fn every render
)}
// → memo on Row is useless; hoist the handler out, pass id instead`,
              text: "Same referential-equality issue as on the web: inline functions break row memoization.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="ScrollView рендерит всё, FlatList — виртуализирует; тюнинг: keyExtractor + getItemLayout + windowSize + memo-строки; тяжёлое — FlashList."
          en="ScrollView renders everything, FlatList virtualizes; tuning: keyExtractor + getItemLayout + windowSize + memoized rows; for heavy lists — FlashList."
        />
      </div>
    </>
  );
}
