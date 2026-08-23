import { createContext, useContext } from "react";

// 'ru' | 'en' — переключатель в сайдбаре (App.jsx)
export const LangContext = createContext("ru");

export function useLang() {
  return useContext(LangContext);
}
