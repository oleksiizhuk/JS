import { useEffect, useState, type ComponentType } from "react";
import "./App.css";
import { LangContext, type Lang } from "./LangContext";
import { highlightAll } from "./highlight";

import Lifecycle from "./topics/Lifecycle";
import RenderPhases from "./topics/RenderPhases";
import PropsDrilling from "./topics/PropsDrilling";
import Hooks from "./topics/Hooks";
import Hocs from "./topics/Hocs";
import Forms from "./topics/Forms";
import ContextDemo from "./topics/ContextDemo";
import Reconciliation from "./topics/Reconciliation";
import Fiber from "./topics/Fiber";
import FunctionalProgramming from "./topics/FunctionalProgramming";
import Performance from "./topics/Performance";
import SnapshotTests from "./topics/SnapshotTests";
import I18n from "./topics/I18n";

import LetVarConst from "./topics/js/LetVarConst";
import Hoisting from "./topics/js/Hoisting";
import Tdz from "./topics/js/Tdz";
import ScopeDemo from "./topics/js/ScopeDemo";
import Closure from "./topics/js/Closure";
import Destructuring from "./topics/js/Destructuring";
import FirstClass from "./topics/js/FirstClass";
import Coercion from "./topics/js/Coercion";
import ObjectsJs from "./topics/js/ObjectsJs";
import ArrayMethods from "./topics/js/ArrayMethods";
import EventLoop from "./topics/js/EventLoop";
import BindCallApply from "./topics/js/BindCallApply";
import Classes from "./topics/js/Classes";
import Collections from "./topics/js/Collections";
import Iterators from "./topics/js/Iterators";
import PromisesErrors from "./topics/js/PromisesErrors";
import Modules from "./topics/js/Modules";

import SuspenseLazy from "./topics/SuspenseLazy";
import Concurrent from "./topics/Concurrent";
import RefsPortals from "./topics/RefsPortals";
import ServerComponents from "./topics/ServerComponents";

import ThreePrinciples from "./topics/redux/ThreePrinciples";
import CoreConcepts from "./topics/redux/CoreConcepts";
import SideEffects from "./topics/redux/SideEffects";
import ProsCons from "./topics/redux/ProsCons";
import ReduxToolkit from "./topics/redux/ReduxToolkit";

import Pipeline from "./topics/native/Pipeline";
import StylingComponents from "./topics/native/StylingComponents";
import Lists from "./topics/native/Lists";
import NavigationOs from "./topics/native/NavigationOs";
import ModulesMonitoring from "./topics/native/ModulesMonitoring";

import VsRest from "./topics/graphql/VsRest";
import QueryPage from "./topics/graphql/QueryPage";
import MutationPage from "./topics/graphql/MutationPage";
import SubscriptionPage from "./topics/graphql/SubscriptionPage";

import TsGeneral from "./topics/ts/General";
import VsPropTypes from "./topics/ts/VsPropTypes";
import TypeVsInterface from "./topics/ts/TypeVsInterface";
import UtilityTypes from "./topics/ts/UtilityTypes";
import ConditionalMapped from "./topics/ts/ConditionalMapped";

import Sdlc from "./topics/enginx/Sdlc";
import TestingPyramid from "./topics/enginx/TestingPyramid";
import StaticAnalysis from "./topics/enginx/StaticAnalysis";
import Branching from "./topics/enginx/Branching";
import DesignPatterns from "./topics/enginx/DesignPatterns";
import Antipatterns from "./topics/enginx/Antipatterns";
import CiCd from "./topics/enginx/CiCd";
import Owasp from "./topics/enginx/Owasp";
import HttpAuth from "./topics/enginx/HttpAuth";
import CodeReviewTopic from "./topics/enginx/CodeReviewTopic";
import CodeReviewTrainer from "./codereview/CodeReviewTrainer";

import Quiz from "./quiz/Quiz";
import LiveCoding from "./livecoding/LiveCoding";
import ClaudeAi from "./topics/ClaudeAi";
import EnglishTrainer from "./english/EnglishTrainer";

type Topic = { id: string; title: string; title_en?: string; C: ComponentType };
type Section = { name: string; name_en?: string; topics: Topic[] };
type Mode = "rn" | "eng";

const SECTIONS: Section[] = [
  {
    name: "JS Core",
    topics: [
      { id: "letvarconst", title: "Let / var / const", C: LetVarConst },
      { id: "hoisting", title: "Hoisting", C: Hoisting },
      { id: "tdz", title: "TDZ", C: Tdz },
      { id: "scope", title: "Scope", C: ScopeDemo },
      { id: "closure", title: "Closure", C: Closure },
      { id: "destructuring", title: "Destructuring", C: Destructuring },
      { id: "firstclass", title: "First-class functions", C: FirstClass },
      { id: "coercion", title: "Coercion", C: Coercion },
      { id: "objects", title: "Objects in JS", C: ObjectsJs },
      { id: "arrays", title: "Array methods", C: ArrayMethods },
      { id: "eventloop", title: "Event loop", C: EventLoop },
      { id: "promises", title: "Promises & ошибки", title_en: "Promises & errors", C: PromisesErrors },
      { id: "bindcallapply", title: "Bind / call / apply", C: BindCallApply },
      { id: "classes", title: "Классы", title_en: "Classes", C: Classes },
      { id: "collections", title: "Map / Set / WeakMap", C: Collections },
      { id: "iterators", title: "Итераторы и генераторы", title_en: "Iterators & generators", C: Iterators },
      { id: "modules", title: "Модули: ESM vs CJS", title_en: "Modules: ESM vs CJS", C: Modules },
    ],
  },
  {
    name: "React",
    topics: [
      { id: "lifecycle", title: "Component lifecycle", C: Lifecycle },
      { id: "render", title: "Component render", C: RenderPhases },
      { id: "drilling", title: "Props drilling", C: PropsDrilling },
      { id: "hooks", title: "Hooks", C: Hooks },
      { id: "hocs", title: "HOCs", C: Hocs },
      { id: "forms", title: "Forms", C: Forms },
      { id: "context", title: "Context", C: ContextDemo },
      { id: "reconciliation", title: "Reconciliation", C: Reconciliation },
      { id: "fiber", title: "React Fiber", C: Fiber },
      { id: "fp", title: "Functional Programming", C: FunctionalProgramming },
      { id: "refs", title: "Refs & порталы", title_en: "Refs & portals", C: RefsPortals },
      { id: "suspense", title: "Suspense & lazy", C: SuspenseLazy },
      { id: "concurrent", title: "useTransition / Deferred", C: Concurrent },
      { id: "perf", title: "Performance", C: Performance },
      { id: "rsc", title: "Server Components", C: ServerComponents },
      { id: "i18n", title: "i18n / i18next", C: I18n },
      { id: "snapshot", title: "Snapshot tests", C: SnapshotTests },
    ],
  },
  {
    name: "Redux",
    topics: [
      { id: "rx-principles", title: "Three principles", C: ThreePrinciples },
      { id: "rx-core", title: "Core concepts", C: CoreConcepts },
      { id: "rx-effects", title: "Side effects", C: SideEffects },
      { id: "rx-proscons", title: "Pros vs Cons", C: ProsCons },
      { id: "rx-rtk", title: "Redux Toolkit", C: ReduxToolkit },
    ],
  },
  {
    name: "React Native",
    topics: [
      { id: "rn-pipeline", title: "Generic pipeline", C: Pipeline },
      { id: "rn-styling", title: "Styling & Components", C: StylingComponents },
      { id: "rn-lists", title: "FlatList vs ScrollView", C: Lists },
      { id: "rn-nav", title: "Navigation & OS-specific", C: NavigationOs },
      { id: "rn-modules", title: "Native Modules & Monitoring", C: ModulesMonitoring },
    ],
  },
  {
    name: "GraphQL",
    topics: [
      { id: "gql-rest", title: "Difference from REST", C: VsRest },
      { id: "gql-query", title: "Query", C: QueryPage },
      { id: "gql-mutation", title: "Mutation", C: MutationPage },
      { id: "gql-subscription", title: "Subscription", C: SubscriptionPage },
    ],
  },
  {
    name: "TypeScript",
    topics: [
      { id: "ts-general", title: "General", C: TsGeneral },
      { id: "ts-proptypes", title: "TS vs PropTypes", C: VsPropTypes },
      { id: "ts-typeiface", title: "Type vs Interface", C: TypeVsInterface },
      { id: "ts-utility", title: "Utility Types", C: UtilityTypes },
      { id: "ts-condmapped", title: "Conditional / Mapped", C: ConditionalMapped },
    ],
  },
  {
    name: "EnginX",
    topics: [
      { id: "ex-sdlc", title: "SDLC", C: Sdlc },
      { id: "ex-pyramid", title: "Testing pyramid", C: TestingPyramid },
      { id: "ex-static", title: "Static analysis", C: StaticAnalysis },
      { id: "ex-branching", title: "Branching strategies", C: Branching },
      { id: "ex-patterns", title: "Design patterns", C: DesignPatterns },
      { id: "ex-antipatterns", title: "Antipatterns", C: Antipatterns },
      { id: "ex-cicd", title: "CI/CD/CD", C: CiCd },
      { id: "ex-owasp", title: "OWASP", C: Owasp },
      { id: "ex-http", title: "HTTP, кэш и авторизация", title_en: "HTTP, caching & auth", C: HttpAuth },
      { id: "ex-codereview", title: "Code review ⭐", C: CodeReviewTopic },
    ],
  },
  {
    name: "Тренировка",
    name_en: "Practice",
    topics: [
      { id: "quiz", title: "🎯 Квиз", title_en: "🎯 Quiz", C: Quiz },
      { id: "livecoding", title: "🧑‍💻 Live coding", C: LiveCoding },
      { id: "review-trainer", title: "🔍 Code review тренажёр ⭐", title_en: "🔍 Code review trainer ⭐", C: CodeReviewTrainer },
    ],
  },
  {
    name: "English",
    name_en: "English",
    topics: [
      { id: "english-vocab", title: "🇬🇧 Словарь курса: Sections 2–5", title_en: "🇬🇧 Course vocabulary: Sections 2–5", C: EnglishTrainer },
    ],
  },
  {
    name: "Разное",
    name_en: "Misc",
    topics: [{ id: "claude-ai", title: "Claude AI 🤖", C: ClaudeAi }],
  },
];

const ALL_TOPICS = SECTIONS.flatMap((s) => s.topics);
const sectionOf = (topicId: string) => SECTIONS.find((s) => s.topics.some((t) => t.id === topicId))?.name ?? "";

// Два верхних таба: RN — собес-тренажёр (с переключателем RU/EN),
// ENG — тренажёр английского (язык интерфейса там не нужен).
const MODES: { id: Mode; label: string; sections: Section[] }[] = [
  { id: "rn", label: "RN", sections: SECTIONS.filter((s) => s.name !== "English") },
  { id: "eng", label: "ENG", sections: SECTIONS.filter((s) => s.name === "English") },
];
const modeOf = (id: string): Mode => (MODES[1].sections.some((s) => s.topics.some((t) => t.id === id)) ? "eng" : "rn");

export default function App() {
  const [topicId, setTopicId] = useState("letvarconst");
  const [lang, setLang] = useState<Lang>("ru");
  const [lastTopic, setLastTopic] = useState<Record<Mode, string>>({ rn: "letvarconst", eng: "english-vocab" }); // куда вернуться при смене таба
  const mode = modeOf(topicId);
  const isRn = mode === "rn";
  // Таб ENG — всегда английский интерфейс (RU/EN живёт только в RN)
  const uiLang: Lang = isRn ? lang : "en";
  const modeSections = MODES.find((m) => m.id === mode)?.sections ?? [];
  const [menuOpen, setMenuOpen] = useState(false); // мобильное меню (≤768px)
  // Секции сайдбара — аккордеон: открыта та, где текущая тема, остальные по клику
  const [openSections, setOpenSections] = useState(() => new Set([sectionOf("letvarconst")]));
  const toggleSection = (name: string) =>
    setOpenSections((s) => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const topic = ALL_TOPICS.find((t) => t.id === topicId) ?? ALL_TOPICS[0];
  const Current = topic.C;
  const title = uiLang === "en" && topic.title_en ? topic.title_en : topic.title;

  // На телефоне контент под верхней панелью: при смене темы — к началу,
  // а меню закрываем и не даём странице скроллиться под ним.
  const pickTopic = (id: string) => {
    setTopicId(id);
    setLastTopic((prev) => ({ ...prev, [modeOf(id)]: id }));
    setOpenSections((s) => (s.has(sectionOf(id)) ? s : new Set(s).add(sectionOf(id))));
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };
  const pickMode = (m: Mode) => {
    if (m !== mode) pickTopic(lastTopic[m]);
  };
  const modeTabs = (cls: string) => (
    <div className={cls}>
      {MODES.map((m) => (
        <button key={m.id} className={mode === m.id ? "active" : ""} onClick={() => pickMode(m.id)}>
          {m.label}
        </button>
      ))}
    </div>
  );
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  // Подсветка всех блоков кода после смены темы/языка и после интерактивных
  // изменений (новые pre.code, например при раскрытии демо)
  useEffect(() => {
    highlightAll();
    const observer = new MutationObserver(highlightAll);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [topicId, lang]);

  return (
    <LangContext.Provider value={uiLang}>
    <div className="app">
      <header className="topbar">
        <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? "✕" : "☰"}
        </button>
        <span className="topbar-title">{title}</span>
        {modeTabs("topbar-modes")}
        {isRn && (
          <button className="topbar-lang" onClick={() => setLang(lang === "ru" ? "en" : "ru")}>
            {lang.toUpperCase()}
          </button>
        )}
      </header>
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
      <nav className={"sidebar" + (menuOpen ? " open" : "")}>
        {modeTabs("mode-tabs")}
        <h2>{isRn ? (lang === "en" ? "Interview Trainer" : "Собес-тренажёр") : "English"}</h2>
        {isRn && (
          <div className="lang-toggle">
            {(["ru", "en"] as const).map((l) => (
              <button
                key={l}
                className={lang === l ? "active" : ""}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        {modeSections.map((section) => {
          const open = openSections.has(section.name);
          return (
            <div key={section.name}>
              <button
                className={"section-title" + (open ? " open" : "")}
                aria-expanded={open}
                onClick={() => toggleSection(section.name)}
              >
                <span>{uiLang === "en" && section.name_en ? section.name_en : section.name}</span>
                <span className="chev">▸</span>
              </button>
              {open &&
                section.topics.map((t) => (
                  <button
                    key={t.id}
                    className={t.id === topicId ? "active" : ""}
                    onClick={() => pickTopic(t.id)}
                  >
                    {uiLang === "en" && t.title_en ? t.title_en : t.title}
                  </button>
                ))}
            </div>
          );
        })}
      </nav>
      <main className="content">
        <h1>{title}</h1>
        {/* key заставляет демо размонтироваться при смене темы — чистый старт */}
        <Current key={topic.id} />
      </main>
    </div>
    </LangContext.Provider>
  );
}
