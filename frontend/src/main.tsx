import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/App'
import { initDemoData } from './shared/lib/demo'
import './index.css'

declare global {
  interface Window {
    global?: typeof globalThis
  }
}

// Polyfill for SockJS in Vite environment
if (typeof window !== 'undefined' && window.global === undefined) {
  window.global = window
}

// Initialize demo data for frontend-only demonstration
initDemoData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
