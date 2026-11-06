import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Swarm intro: cursors rebuild the page once React has mounted and fonts are ready
declare global {
  interface Window {
    Swarm?: { run: (opts?: Record<string, unknown>) => void }
  }
}

const unboot = () => document.documentElement.classList.remove('sw-boot')

const startSwarm = () => {
  const go = () => {
    try {
      if (window.Swarm && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        window.Swarm.run({ agents: 18, mobileAgents: 8, speed: 1.25, pace: 1.8, tour: true, returnToTop: true, targetSeconds: 30, maxSeconds: 70 })
      }
    } finally {
      unboot()
    }
  }
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
  Promise.race([fonts, new Promise((r) => setTimeout(r, 800))]).then(() => requestAnimationFrame(() => requestAnimationFrame(go)))
}

if (document.readyState === 'complete') startSwarm()
else window.addEventListener('load', startSwarm, { once: true })
