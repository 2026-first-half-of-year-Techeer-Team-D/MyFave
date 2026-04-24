import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Polyfill for SockJS in Vite environment
if (typeof window !== 'undefined' && (window as any).global === undefined) {
  ;(window as any).global = window
}

import App from './app/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
