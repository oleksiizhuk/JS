import { useEffect, useState } from "react";
import "./App.css";
import { LangContext } from "./LangContext.jsx";
import { highlightAll } from "./highlight.js";

import Lifecycle from "./topics/Lifecycle.jsx";
import RenderPhases from "./topics/RenderPhases.jsx";
import PropsDrilling from "./topics/PropsDrilling.jsx";
import Hooks from "./topics/Hooks.jsx";
import Hocs from "./topics/Hocs.jsx";
import Forms from "./topics/Forms.jsx";
import ContextDemo from "./topics/ContextDemo.jsx";
import Reconciliation from "./topics/Reconciliation.jsx";
import Fiber from "./topics/Fiber.jsx";
import FunctionalProgramming from "./topics/FunctionalProgramming.jsx";
import Performance from "./topics/Performance.jsx";
import SnapshotTests from "./topics/SnapshotTests.jsx";
import I18n from "./topics/I18n.jsx";

import LetVarConst from "./topics/js/LetVarConst.jsx";
import Hoisting from "./topics/js/Hoisting.jsx";
import Tdz from "./topics/js/Tdz.jsx";
import ScopeDemo from "./topics/js/ScopeDemo.jsx";
import Closure from "./topics/js/Closure.jsx";
import Destructuring from "./topics/js/Destructuring.jsx";
import FirstClass from "./topics/js/FirstClass.jsx";
import Coercion from "./topics/js/Coercion.jsx";
import ObjectsJs from "./topics/js/ObjectsJs.jsx";
import ArrayMethods from "./topics/js/ArrayMethods.jsx";
import EventLoop from "./topics/js/EventLoop.jsx";
import BindCallApply from "./topics/js/BindCallApply.jsx";
import Classes from "./topics/js/Classes.jsx";
import Collections from "./topics/js/Collections.jsx";
import Iterators from "./topics/js/Iterators.jsx";
import PromisesErrors from "./topics/js/PromisesErrors.jsx";
import Modules from "./topics/js/Modules.jsx";

import SuspenseLazy from "./topics/SuspenseLazy.jsx";
import Concurrent from "./topics/Concurrent.jsx";
import RefsPortals from "./topics/RefsPortals.jsx";
import ServerComponents from "./topics/ServerComponents.jsx";

import ThreePrinciples from "./topics/redux/ThreePrinciples.jsx";
import CoreConcepts from "./topics/redux/CoreConcepts.jsx";
import SideEffects from "./topics/redux/SideEffects.jsx";
import ProsCons from "./topics/redux/ProsCons.jsx";
import ReduxToolkit from "./topics/redux/ReduxToolkit.jsx";

import Pipeline from "./topics/native/Pipeline.jsx";
import StylingComponents from "./topics/native/StylingComponents.jsx";
import Lists from "./topics/native/Lists.jsx";
import NavigationOs from "./topics/native/NavigationOs.jsx";
import ModulesMonitoring from "./topics/native/ModulesMonitoring.jsx";

import VsRest from "./topics/graphql/VsRest.jsx";
import QueryPage from "./topics/graphql/QueryPage.jsx";
import MutationPage from "./topics/graphql/MutationPage.jsx";
import SubscriptionPage from "./topics/graphql/SubscriptionPage.jsx";

import TsGeneral from "./topics/ts/General.jsx";
import VsPropTypes from "./topics/ts/VsPropTypes.jsx";
import TypeVsInterface from "./topics/ts/TypeVsInterface.jsx";
import UtilityTypes from "./topics/ts/UtilityTypes.jsx";
import ConditionalMapped from "./topics/ts/ConditionalMapped.jsx";

import Sdlc from "./topics/enginx/Sdlc.jsx";
import TestingPyramid from "./topics/enginx/TestingPyramid.jsx";
import StaticAnalysis from "./topics/enginx/StaticAnalysis.jsx";
import Branching from "./topics/enginx/Branching.jsx";
import DesignPatterns from "./topics/enginx/DesignPatterns.jsx";
import Antipatterns from "./topics/enginx/Antipatterns.jsx";
import CiCd from "./topics/enginx/CiCd.jsx";
import Owasp from "./topics/enginx/Owasp.jsx";
import HttpAuth from "./topics/enginx/HttpAuth.jsx";
import CodeReviewTopic from "./topics/enginx/CodeReviewTopic.jsx";
import CodeReviewTrainer from "./codereview/CodeReviewTrainer.jsx";

import Quiz from "./quiz/Quiz.jsx";
import LiveCoding from "./livecoding/LiveCoding.jsx";
import ClaudeAi from "./topics/ClaudeAi.jsx";
import EnglishTrainer from "./english/EnglishTrainer.jsx";

const SECTIONS = [
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

export default function App() {
  const [topicId, setTopicId] = useState("letvarconst");
  const [lang, setLang] = useState("ru");
  const [menuOpen, setMenuOpen] = useState(false); // мобильное меню (≤768px)
  const topic = ALL_TOPICS.find((t) => t.id === topicId);
  const Current = topic.C;

  // На телефоне контент под верхней панелью: при смене темы — к началу,
  // а меню закрываем и не даём странице скроллиться под ним.
  const pickTopic = (id) => {
    setTopicId(id);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };
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
    <LangContext.Provider value={lang}>
    <div className="app">
      <header className="topbar">
        <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? "✕" : "☰"}
        </button>
        <span className="topbar-title">{lang === "en" && topic.title_en ? topic.title_en : topic.title}</span>
        <button className="topbar-lang" onClick={() => setLang(lang === "ru" ? "en" : "ru")}>
          {lang.toUpperCase()}
        </button>
      </header>
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
      <nav className={"sidebar" + (menuOpen ? " open" : "")}>
        <h2>{lang === "en" ? "Interview Trainer" : "Собес-тренажёр"}</h2>
        <div className="lang-toggle">
          {["ru", "en"].map((l) => (
            <button
              key={l}
              className={lang === l ? "active" : ""}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {SECTIONS.map((section) => (
          <div key={section.name}>
            <div className="section-title">{lang === "en" && section.name_en ? section.name_en : section.name}</div>
            {section.topics.map((t) => (
              <button
                key={t.id}
                className={t.id === topicId ? "active" : ""}
                onClick={() => pickTopic(t.id)}
              >
                {lang === "en" && t.title_en ? t.title_en : t.title}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <main className="content">
        <h1>{topic.title}</h1>
        {/* key заставляет демо размонтироваться при смене темы — чистый старт */}
        <Current key={topic.id} />
      </main>
    </div>
    </LangContext.Provider>
  );
}
