import './wdyr.js' // why-did-you-render — обязательно ПЕРВЫМ
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode убран НАМЕРЕННО: в dev он вызывает render и эффекты ДВАЖДЫ
// (проверка на чистоту), что путает при изучении порядка жизненного цикла.
// В реальных проектах StrictMode оставляют включённым.
createRoot(document.getElementById('root')).render(<App />)
