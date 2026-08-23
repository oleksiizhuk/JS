import { InterviewQuestion, ModelAnswer, SectionTitle, Gotchas, CodeBlock, L } from "../InterviewBlocks.jsx";

export default function NavigationOs() {
  return (
    <>
      <InterviewQuestion en="How is navigation done in React Native? How do you handle OS-specific code?">
        Как делается навигация в React Native? Как решаешь OS-специфичные задачи?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "The standard is <b>React Navigation</b>: navigators as
            components — Stack (native-stack uses real UINavigationController /
            Fragments), Tab, Drawer — nested into each other; screens get
            navigation and route props, params via navigate('Screen',
            {"{ id }"}), typed with TypeScript. Expo Router adds file-based
            routing on top. Deep linking is configured declaratively.
            For <b>OS-specific</b> code, three levels: the <b>Platform</b>
            module — Platform.OS and Platform.select for small forks;
            <b> file extensions</b> — Button.ios.tsx / Button.android.tsx,
            the bundler picks automatically; and knowing platform behavioral
            differences: shadows vs elevation, KeyboardAvoidingView behavior
            ('padding' on iOS, 'height' on Android), permissions flows, back
            button on Android (BackHandler), safe areas via
            react-native-safe-area-context."
          </>
        }
      >
        «Стандарт — <b>React Navigation</b>: навигаторы как компоненты —
        Stack (native-stack использует настоящие UINavigationController /
        Fragments), Tab, Drawer — вкладываются друг в друга; экраны получают
        пропсы navigation и route, параметры через navigate('Screen',
        {"{ id }"}), типизируются TypeScript-ом. Expo Router добавляет сверху
        файловый роутинг. Deep linking настраивается декларативно.
        Для <b>OS-специфики</b> три уровня: модуль <b>Platform</b> —
        Platform.OS и Platform.select для мелких развилок; <b>расширения
        файлов</b> — Button.ios.tsx / Button.android.tsx, бандлер подберёт
        сам; и знание поведенческих отличий платформ: тени vs elevation,
        behavior у KeyboardAvoidingView ('padding' на iOS, 'height' на
        Android), пермишены, кнопка «назад» на Android (BackHandler),
        safe areas через react-native-safe-area-context.»
      </ModelAnswer>

      <SectionTitle>Разбор</SectionTitle>

      <div className="card">
        <h3><L ru="React Navigation: скелет" en="React Navigation: the skeleton" /></h3>
        <CodeBlock
          ru={`const Stack = createNativeStackNavigator();

<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Feed" component={Feed} />
    <Stack.Screen name="Post" component={Post} />
  </Stack.Navigator>
</NavigationContainer>

// из экрана:
navigation.navigate("Post", { id: 42 });   // push если нет в стеке
navigation.goBack();
const { id } = route.params;

// вложенность: Tab внутри Stack (или наоборот) — обычное дело
// native-stack vs stack: нативные переходы vs JS-анимации`}
          en={`const Stack = createNativeStackNavigator();

<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Feed" component={Feed} />
    <Stack.Screen name="Post" component={Post} />
  </Stack.Navigator>
</NavigationContainer>

// from a screen:
navigation.navigate("Post", { id: 42 });   // push if not already on the stack
navigation.goBack();
const { id } = route.params;

// nesting: Tab inside Stack (or vice versa) is completely normal
// native-stack vs stack: native transitions vs JS-driven animations`}
        />
      </div>

      <div className="card">
        <h3><L ru="OS-specific: три уровня" en="OS-specific code: three levels" /></h3>
        <CodeBlock
          ru={`// 1. Мелкие развилки — Platform
const pad = Platform.OS === "ios" ? 12 : 8;
const styles = Platform.select({ ios: {...}, android: {...} });

// 2. Разные реализации — расширения файлов
// DatePicker.ios.tsx  DatePicker.android.tsx
import DatePicker from "./DatePicker"; // бандлер выберет сам

// 3. Поведение платформ
<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
BackHandler.addEventListener("hardwareBackPress", handler) // Android`}
          en={`// 1. Small forks — Platform
const pad = Platform.OS === "ios" ? 12 : 8;
const styles = Platform.select({ ios: {...}, android: {...} });

// 2. Different implementations — file extensions
// DatePicker.ios.tsx  DatePicker.android.tsx
import DatePicker from "./DatePicker"; // the bundler picks automatically

// 3. Platform behavior
<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
BackHandler.addEventListener("hardwareBackPress", handler) // Android`}
        />
      </div>

      <Gotchas
        items={[
          {
            title: "«Экран не размонтируется после navigate»",
            code: `// Stack ДЕРЖИТ прошлые экраны в памяти (это стек!)
// уходишь с экрана ≠ unmount → useEffect cleanup не сработал
// фикс: useFocusEffect / слушатели focus/blur`,
            text: "Главный сюрприз после веба: таймеры и подписки экрана живут, пока экран в стеке. Знание useFocusEffect — маркер реального опыта.",
            en: {
              title: "\"The screen doesn't unmount after navigate\"",
              code: `// Stack KEEPS previous screens in memory (it's a stack!)
// leaving a screen ≠ unmount → useEffect cleanup never ran
// fix: useFocusEffect / focus/blur listeners`,
              text: "The biggest surprise after coming from the web: a screen's timers and subscriptions stay alive as long as it's on the stack. Knowing useFocusEffect is a marker of real experience.",
            },
          },
          {
            title: "Params — не место для объектов",
            code: `navigate("Post", { post });   // ⚠️ несериализуемое → warning,
                              // ломает deep links и state restore
navigate("Post", { id });     // ✅ id, а данные — из стора/запроса`,
            text: "Параметры должны быть сериализуемыми: передавать id, а не целые объекты/колбэки.",
            en: {
              title: "Params are not the place for objects",
              code: `navigate("Post", { post });   // ⚠️ not serializable → warning,
                              // breaks deep links and state restore
navigate("Post", { id });     // ✅ id, data comes from the store/a query`,
              text: "Params must be serializable: pass an id, not a whole object or callback.",
            },
          },
          {
            title: "Тестировал только на одной платформе",
            code: `// у Text разный лайн-хайт, у TextInput разные паддинги,
// тени только iOS, elevation только Android,
// клавиатура ведёт себя по-разному`,
            text: "Ответ «пишу один код и всё работает» — red flag: кроссплатформенность = регулярная проверка на обеих ОС.",
            en: {
              title: "Only tested on one platform",
              code: `// Text has different line-height, TextInput has different padding,
// shadows are iOS-only, elevation is Android-only,
// the keyboard behaves differently`,
              text: "\"I write one codebase and it just works\" is a red flag: cross-platform means regularly checking both OSes.",
            },
          },
        ]}
      />

      <div className="explain">
        <b><L ru="Резюме одной строкой:" en="One-line summary:" /></b>{" "}
        <L
          ru="React Navigation (stack/tab/drawer, params сериализуемые, useFocusEffect); OS-специфика: Platform.select → .ios/.android файлы → знание поведенческих отличий."
          en="React Navigation (stack/tab/drawer, serializable params, useFocusEffect); OS specifics: Platform.select → .ios/.android files → knowing the behavioral differences."
        />
      </div>
    </>
  );
}
