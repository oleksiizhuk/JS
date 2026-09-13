import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages отдаёт сайт с /JS/ (имя репозитория); dev остаётся на корне
  base: command === 'build' ? '/JS/' : '/',
  plugins: [
    react(
      // В dev рендерим JSX через why-did-you-render, чтобы он видел все компоненты.
      // В prod-сборке — обычный React (WDYR туда не попадает).
      command === 'serve'
        ? { jsxImportSource: '@welldone-software/why-did-you-render' }
        : {}
    ),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
}))
