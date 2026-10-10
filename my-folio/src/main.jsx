import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './theme.jsx'
import { runWhenIdle } from './utils/perf.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

// Analytics / Speed Insights — idle-deferred so they never compete with LCP/INP.
runWhenIdle(() => {
  Promise.all([
    import('@vercel/analytics/react'),
    import('@vercel/speed-insights/react'),
  ]).then(([{ Analytics }, { SpeedInsights }]) => {
    const mount = document.createElement('div')
    mount.setAttribute('data-vercel-insights', '')
    document.body.appendChild(mount)
    createRoot(mount).render(
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
      </Suspense>
    )
  }).catch(() => {})
}, 2500)
