import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks";

export default function StylingComponents() {
  return (
    <>
      <InterviewQuestion en="How does styling work in React Native? Which core components do you use?">
        Как устроена стилизация в React Native? Какие базовые компоненты используешь?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "There's no CSS — styles are <b>JS objects</b> via
            StyleSheet.create, a subset of CSS properties in camelCase.
            Layout is <b>flexbox only</b> (Yoga engine) with different
            defaults: flexDirection is <b>column</b>, everything is
            display:flex. No cascade, no inheritance (except inside nested
            Text), units are density-independent points, not px. Styles
            compose with arrays: style={"{[base, isActive && active]}"}.
            Core components map to native views: <b>View</b> (div),
            <b> Text</b> — all text must be inside it, <b>Image</b>,
            <b> ScrollView</b>, <b>FlatList</b>, <b>TextInput</b>,
            <b> Pressable</b> (modern touchable), plus platform ones like
            KeyboardAvoidingView and SafeAreaView. For themes — either
            StyleSheet + context, or libraries: styled-components/native,
            NativeWind (Tailwind), Tamagui."
          </>
        }
      >
        «CSS нет — стили это <b>JS-объекты</b> через StyleSheet.create,
        подмножество CSS-свойств в camelCase. Раскладка — <b>только flexbox</b>
        (движок Yoga) с другими дефолтами: flexDirection — <b>column</b>, всё
        display:flex. Нет каскада и наследования (кроме вложенных Text),
        единицы — density-independent points, не px. Стили компонуются
        массивами: style={"{[base, isActive && active]}"}. Базовые компоненты
        маппятся в нативные вью: <b>View</b> (аналог div), <b>Text</b> — весь
        текст только внутри него, <b>Image</b>, <b>ScrollView</b>,
        <b> FlatList</b>, <b>TextInput</b>, <b>Pressable</b> (современный
        touchable), плюс платформенные KeyboardAvoidingView и SafeAreaView.
        Для тем — StyleSheet + контекст, либо библиотеки:
        styled-components/native, NativeWind (Tailwind), Tamagui.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="StyleSheet и композиция" en="StyleSheet and composition" /></h3>
        <CodeBlock
          ru={`const styles = StyleSheet.create({
  card: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: "#fff" },
  active: { borderColor: "#4f6ef7", borderWidth: 2 },
});

<View style={[styles.card, isActive && styles.active]}>
  <Text style={{ fontWeight: "600" }}>Заголовок</Text>
</View>

// Отличия от веба:
// flexDirection: "column" по умолчанию (в вебе row)
// нет каскада: стиль родителя НЕ наследуется (кроме Text внутри Text)
// нет единиц: { padding: 16 } — просто число (dp/pt)`}
          en={`const styles = StyleSheet.create({
  card: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: "#fff" },
  active: { borderColor: "#4f6ef7", borderWidth: 2 },
});

<View style={[styles.card, isActive && styles.active]}>
  <Text style={{ fontWeight: "600" }}>Title</Text>
</View>

// Differences from the web:
// flexDirection: "column" by default (row on the web)
// no cascade: a parent's style is NOT inherited (except Text inside Text)
// no units: { padding: 16 } is just a number (dp/pt)`}
        />
      </div>

      <div className="card">
        <h3><L ru="Маппинг компонентов" en="Component mapping" /></h3>
        <CodeBlock
          ru={`RN            iOS            Android         web-аналог
View          UIView         ViewGroup       div
Text          UILabel        TextView        p/span
Image         UIImageView    ImageView       img
TextInput     UITextField    EditText        input
ScrollView    UIScrollView   ScrollView      overflow: scroll
Pressable     (жесты)        (жесты)         button`}
          en={`RN            iOS            Android         web equivalent
View          UIView         ViewGroup       div
Text          UILabel        TextView        p/span
Image         UIImageView    ImageView       img
TextInput     UITextField    EditText        input
ScrollView    UIScrollView   ScrollView      overflow: scroll
Pressable     (gestures)     (gestures)      button`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "Текст вне <Text>",
            code: `<View>Привет</View>
// ❌ Invariant Violation: Text strings must be rendered
// within a <Text> component`,
            text: "В вебе текст можно кинуть в div, в RN — только внутри Text. Частая ошибка при переходе с React.",
            en: {
              title: "Text outside <Text>",
              code: `<View>Hello</View>
// ❌ Invariant Violation: Text strings must be rendered
// within a <Text> component`,
              text: "On the web you can drop text straight into a div; in RN it must be inside Text. A common mistake when coming from React.",
            },
          },
          {
            title: "«Почему инлайн-стили плохо?»",
            code: `<View style={{ padding: 16 }} />  // новый объект каждый рендер
// StyleSheet.create: объект создан один раз + ссылка стабильна`,
            text: "Инлайн-объект — новая ссылка каждый рендер (ломает memo-детей). StyleSheet ещё и валидирует свойства в dev.",
            en: {
              title: "\"Why are inline styles bad?\"",
              code: `<View style={{ padding: 16 }} />  // new object on every render
// StyleSheet.create: object created once, reference stays stable`,
              text: "An inline object is a new reference on every render (breaks memoized children). StyleSheet also validates properties in dev.",
            },
          },
          {
            title: "Тени: iOS vs Android",
            code: `shadowColor/shadowOffset/shadowOpacity  // только iOS
elevation: 4                            // только Android
// кроссплатформенно: задавать оба (или boxShadow в новой арх.)`,
            text: "Классика OS-specific: одна тень — два API. Проверяют реальный опыт вёрстки.",
            en: {
              title: "Shadows: iOS vs Android",
              code: `shadowColor/shadowOffset/shadowOpacity  // iOS only
elevation: 4                            // Android only
// cross-platform: set both (or boxShadow on the new architecture)`,
              text: "A classic OS-specific gotcha: one shadow, two APIs. Tests real hands-on styling experience.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="StyleSheet-объекты + только flexbox (column по умолчанию), без каскада; текст только в Text; композиция стилей массивами."
          en="StyleSheet objects + flexbox only (column by default), no cascade; text only inside Text; styles compose with arrays."
        />
      </div>
    </>
  );
}
