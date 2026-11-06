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

const startSwarm = () => {
  const go = () => window.Swarm?.run({ agents: 24, mobileAgents: 10, speed: 1.2, tour: true, returnToTop: true, targetSeconds: 12 })
  const ready = document.fonts ? document.fonts.ready : Promise.resolve()
  ready.then(() => requestAnimationFrame(() => setTimeout(go, 400)))
}

if (document.readyState === 'complete') startSwarm()
else window.addEventListener('load', startSwarm, { once: true })
