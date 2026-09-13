import { createContext, useContext } from "react";

export type Lang = "ru" | "en";

// 'ru' | 'en' — переключатель в сайдбаре (App.tsx)
export const LangContext = createContext<Lang>("ru");

export function useLang(): Lang {
  return useContext(LangContext);
}
