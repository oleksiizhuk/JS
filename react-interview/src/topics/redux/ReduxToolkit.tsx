import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useRenderCount } from "../helpers";
import { InterviewQuestion, ModelAnswer, SectionTitle, L, CodeBlock } from "../InterviewBlocks";
import { useLang } from "../../LangContext";

// ── Настоящий RTK: слайс = actions + reducer в одном месте
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as string[], discount: 0 },
  reducers: {
    // выглядит как мутация, но внутри Immer → на самом деле иммутабельно!
    itemAdded(state, action: PayloadAction<string>) {
      state.items.push(action.payload);
    },
    cleared(state) {
      state.items = [];
    },
    discountSet(state, action: PayloadAction<number>) {
      state.discount = action.payload;
    },
  },
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
type RootState = ReturnType<typeof store.getState>;
const { itemAdded, cleared, discountSet } = cartSlice.actions;

// Подписан ТОЛЬКО на количество — discount его не трогает
function CartBadge() {
  const count = useSelector((s: RootState) => s.cart.items.length);
  const renders = useRenderCount();
  return (
    <p>
      <L ru="🛒 товаров: " en="🛒 items: " /><b>{count}</b>{" "}
      <span className="badge"><L ru="рендеров: " en="renders: " />{renders}</span>
    </p>
  );
}

// Подписан ТОЛЬКО на скидку
function DiscountBadge() {
  const discount = useSelector((s: RootState) => s.cart.discount);
  const renders = useRenderCount();
  return (
    <p>
      <L ru="💸 скидка: " en="💸 discount: " /><b>{discount}%</b>{" "}
      <span className="badge"><L ru="рендеров: " en="renders: " />{renders}</span>
    </p>
  );
}

function Controls() {
  const lang = useLang();
  const dispatch = useDispatch();
  return (
    <>
      <button
        className="btn primary"
        onClick={() => dispatch(itemAdded(lang === "en" ? "item" : "товар"))}
      >
        dispatch(itemAdded())
      </button>
      <button className="btn" onClick={() => dispatch(discountSet(Math.floor(Math.random() * 50)))}>
        dispatch(discountSet())
      </button>
      <button className="btn" onClick={() => dispatch(cleared())}>
        dispatch(cleared())
      </button>
    </>
  );
}

export default function ReduxToolkit() {
  return (
    <Provider store={store}>
      <InterviewQuestion en="What is Redux Toolkit? Why does 'mutation' work inside createSlice?">
        Что такое Redux Toolkit? Почему в createSlice «работают мутации»?
      </InterviewQuestion>

      <ModelAnswer
        en={
          <>
            "RTK is the official, recommended way to write Redux — it removed
            about 70% of the classic boilerplate. <b>configureStore</b> wires
            up DevTools, thunk and dev checks for mutations and
            non-serializable values out of the box. <b>createSlice</b> puts
            actions and the reducer in one place and auto-generates action
            creators and types. The 'mutating' syntax inside createSlice works
            because of <b>Immer</b>: it proxies the state, records my
            'mutations' and produces a new immutable object — so mutation is
            still forbidden everywhere, Immer just translates the convenient
            syntax. Also in the box: createAsyncThunk with auto
            pending/fulfilled/rejected, <b>RTK Query</b> for server cache with
            hooks like useGetUserQuery, listener middleware and entityAdapter
            for normalized collections."
          </>
        }
      >
        «RTK — официальный стандарт написания Redux, убравший ~70%
        boilerplate. <b>configureStore</b> из коробки подключает DevTools,
        thunk и dev-проверки на мутации и несериализуемое. <b>createSlice</b>
        собирает actions и reducer в одном месте и автогенерирует action
        creators и типы. «Мутирующий» синтаксис внутри createSlice работает
        благодаря <b>Immer</b>: он проксирует state, записывает мои «мутации»
        и производит новый иммутабельный объект — то есть мутировать
        по-прежнему нельзя нигде, Immer лишь транслирует удобный синтаксис.
        Ещё в коробке: createAsyncThunk с автоматическими
        pending/fulfilled/rejected, <b>RTK Query</b> для серверного кэша с
        хуками вида useGetUserQuery, listener middleware и entityAdapter для
        нормализованных коллекций.»
      </ModelAnswer>

      <SectionTitle>Разбор с примерами</SectionTitle>

      <div className="card">
        <h3><L ru="createSlice — весь слайс в одном месте" en="createSlice — the whole slice in one place" /></h3>
        <CodeBlock
          ru={`const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], discount: 0 },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload); // "мутация"? Нет — внутри Immer,
    },                                  // он превратит это в иммутабельный апдейт
  },
});
// автоматически создались: action creator itemAdded(payload)
// с type "cart/itemAdded" + reducer, который его обрабатывает

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
// configureStore: сразу подключены DevTools, thunk,
// и dev-проверки на мутации и несериализуемое`}
          en={`const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], discount: 0 },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload); // a "mutation"? No — under the hood
    },                                  // Immer turns this into an immutable update
  },
});
// auto-generated: action creator itemAdded(payload)
// with type "cart/itemAdded" + a reducer that handles it

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
// configureStore: DevTools, thunk, and dev checks for
// mutations and non-serializable values are already wired up`}
        />
      </div>

      <div className="card">
        <h3><L ru="Живое демо: селекторы = точечные ре-рендеры" en="Live demo: selectors = targeted re-renders" /></h3>
        <Controls />
        <CartBadge />
        <DiscountBadge />
        <p className="hint">
          <L
            ru={
              <>
                Жми itemAdded — рендерится только CartBadge; discountSet —
                только DiscountBadge. useSelector сравнивает РЕЗУЛЬТАТ
                селектора и будит компонент только при его изменении. Это то,
                чего не умеет Context.
              </>
            }
            en={
              <>
                Click itemAdded — only CartBadge re-renders; discountSet —
                only DiscountBadge. useSelector compares the selector's
                RESULT and wakes the component only when it changes. That's
                something Context can't do.
              </>
            }
          />
        </p>
      </div>

      <div className="card">
        <h3><L ru="Что ещё в RTK" en="What else is in RTK" /></h3>
        <CodeBlock
          ru={`createAsyncThunk — генерирует pending/fulfilled/rejected за тебя
RTK Query        — серверный кэш: createApi + хуки useGetUserQuery(id)
listenerMiddleware — реакции на actions (лёгкая замена саг)
entityAdapter    — нормализация коллекций (byId + ids) с готовыми CRUD`}
          en={`createAsyncThunk — generates pending/fulfilled/rejected for you
RTK Query        — server cache: createApi + hooks like useGetUserQuery(id)
listenerMiddleware — reactions to actions (a lightweight replacement for sagas)
entityAdapter    — collection normalization (byId + ids) with ready-made CRUD`}
        />
      </div>

      <div className="redflag">
        <L
          ru={
            <>
              <b>⚠️ Red flag: «в Redux нельзя мутировать, а в RTK можно».</b>
              <br />Почему: мутировать нельзя нигде. В createSlice
              «мутирующий» синтаксис работает только потому, что под капотом
              <b> Immer</b>: он проксирует state, записывает твои «мутации» и
              производит НОВЫЙ иммутабельный объект. Снаружи reducer-а (в
              компонентах, в thunk-ах) мутация state так и осталась багом.
              Кандидат, который говорит «RTK разрешил мутации», не понимает,
              что происходит, и однажды напишет push вне слайса.
            </>
          }
          en={
            <>
              <b>⚠️ Red flag: "You can't mutate in Redux, but you can in RTK."</b>
              <br />Why it's wrong: mutation is forbidden everywhere. Inside
              createSlice the "mutating" syntax only works because under the
              hood there's <b>Immer</b>: it proxies state, records your
              "mutations", and produces a NEW immutable object. Outside the
              reducer (in components, in thunks) mutating state is still just
              as much a bug. A candidate who says "RTK allows mutations"
              doesn't understand what's actually happening, and will
              eventually write a push outside the slice.
            </>
          }
        />
      </div>

      <div className="explain">
        <L
          ru={
            <>
              <b>Резюме одной строкой:</b> RTK = configureStore + createSlice
              (Immer внутри!) + createAsyncThunk + RTK Query; «мутации» — это
              Immer, вне слайса мутировать по-прежнему нельзя.
            </>
          }
          en={
            <>
              <b>One-line summary:</b> RTK = configureStore + createSlice
              (Immer inside!) + createAsyncThunk + RTK Query; the "mutations"
              are Immer — outside a slice, mutating is still forbidden.
            </>
          }
        />
      </div>
    </Provider>
  );
}
