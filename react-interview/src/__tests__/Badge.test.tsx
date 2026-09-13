import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Badge } from "../topics/SnapshotTests";

test("Badge не изменился", () => {
  const { container } = render(<Badge status="active" />);
  // Первый запуск создаст __snapshots__/Badge.test.tsx.snap,
  // следующие — сравнивают с ним. Обновить: npm test -- -u
  expect(container.firstChild).toMatchSnapshot();
});
