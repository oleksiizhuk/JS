import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import ContextDemo from "../topics/ContextDemo";

test("контекст будит только своих читателей", () => {
  render(<ContextDemo />);
  const badges = () => screen.getAllByText(/рендеров:/).map((n) => n.textContent);

  const before = badges();
  fireEvent.click(screen.getByText(/Переключить тему/));
  fireEvent.click(screen.getByText(/Переключить тему/));
  const after = badges();

  // порядок в DOM: посредник, ThemedBox, IgnorantBox, ThemedBox
  expect(after[0]).toBe("рендеров: 1");   // посредник — не рендерится
  expect(after[1]).toBe("рендеров: 3");   // ThemedBox — рендерится
  expect(after[2]).toBe("рендеров: 1");   // IgnorantBox — не рендерится
  expect(after[3]).toBe("рендеров: 3");   // ThemedBox — рендерится
  console.log("до:", before, "\nпосле 2 кликов:", after);
});
