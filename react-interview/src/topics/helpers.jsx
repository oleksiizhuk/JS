import { useRef, useState, useCallback } from "react";

// Счётчик рендеров: ref переживает ре-рендеры и не вызывает их
export function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}

// Экранный лог (вместо console.log, чтобы всё было видно в UI)
export function useLog() {
  const [lines, setLines] = useState([]);
  const log = useCallback(
    (msg) => setLines((l) => [...l, `${l.length + 1}. ${msg}`]),
    []
  );
  const clear = useCallback(() => setLines([]), []);
  return { lines, log, clear };
}

export function LogPanel({ lines }) {
  return <div className="log">{lines.length ? lines.join("\n") : "— лог пуст —"}</div>;
}
