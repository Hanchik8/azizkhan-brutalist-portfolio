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
    __swarmIntro?: boolean
  }
}

const unboot = () => document.documentElement.classList.remove('sw-boot')

const startSwarm = () => {
  const go = () => {
    try {
      if (window.Swarm && window.__swarmIntro) {
        try { localStorage.setItem('sw-intro-seen', String(Date.now())) } catch { /* private mode */ }
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        window.Swarm.run({ agents: 18, mobileAgents: 8, speed: 2, pace: 1.8, tour: true, returnToTop: true, targetSeconds: 20, maxSeconds: 70 })
      }
    } finally {
      unboot()
    }
  }
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
  // Lazy sections (Timeline, Contact, Footer) must be in the page before the swarm scans it,
  // otherwise they skip the build and simply appear.
  const lazyReady = new Promise<void>((resolve) => {
    const t0 = performance.now()
    const check = () => {
      const home = document.querySelector('#hero')
      const mounted = document.getElementById('root')?.children.length && !document.querySelector('[data-swarm-fallback]') && (!home || document.querySelector('footer'))
      if (mounted || performance.now() - t0 > 5000) resolve()
      else setTimeout(check, 50)
    }
    check()
  })
  Promise.all([Promise.race([fonts, new Promise((r) => setTimeout(r, 800))]), lazyReady]).then(() => requestAnimationFrame(() => requestAnimationFrame(go)))
}

if (document.readyState === 'complete') startSwarm()
else window.addEventListener('load', startSwarm, { once: true })
