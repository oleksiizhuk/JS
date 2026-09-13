// why-did-you-render — ДОЛЖЕН быть самым первым импортом приложения,
// до React-компонентов: он патчит React до того, как кто-то отрендерится.
// Работает только в dev-сборке.
import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";

if (import.meta.env.DEV) {
  whyDidYouRender(React, {
    trackAllPureComponents: true, // следить за всеми React.memo / PureComponent
    logOnDifferentValues: false,  // репортить только ЛИШНИЕ рендеры (equal by value)
  });
}
