// Регрессия для живого демо i18next на странице i18n:
// CLDR-формы русского и смена языка должны реально работать.
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { LangContext } from "../LangContext.jsx";
import I18n, { demoI18n } from "../topics/I18n.jsx";

// demoI18n — модульный singleton: сбрасываем язык, чтобы тесты
// не зависели от порядка выполнения
beforeEach(() => demoI18n.changeLanguage("ru"));

const renderPage = () =>
  render(
    <LangContext.Provider value="ru">
      <I18n />
    </LangContext.Provider>
  );

describe("i18next demo", () => {
  test("плюрализация по CLDR: 1 товар / 2 товара / 5 товаров / 21 товар", () => {
    renderPage();
    expect(screen.getByText("В корзине 1 товар")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("В корзине 2 товара")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "5" }));
    expect(screen.getByText("В корзине 5 товаров")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "21" }));
    expect(screen.getByText("В корзине 21 товар")).toBeTruthy();

    // дробные — категория other
    fireEvent.click(screen.getByRole("button", { name: "1.5" }));
    expect(screen.getByText("В корзине 1.5 товара")).toBeTruthy();
  });

  test("changeLanguage переключает демо на английский и обратно", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByText("Hello, Olex!")).toBeTruthy();
    expect(screen.getByText("1 item in the cart")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "RU" }));
    expect(screen.getByText("Привет, Olex!")).toBeTruthy();
  });
});
