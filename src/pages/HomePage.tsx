import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import FloatingNav from '../components/FloatingNav'

/* ── Lazy-load below-fold sections ── */
const Timeline = lazy(() => import('../components/Timeline'))
const Contact = lazy(() => import('../components/Contact'))
const Footer = lazy(() => import('../components/Footer'))

function SectionFallback() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="animate-pulse font-mono text-xs text-muted-foreground tracking-widest uppercase">
        Loading...
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="noise-bg bg-background text-foreground">
      <a href="#skills" className="skip-link">Skip to content</a>
      <Hero />
      <Stats />
      <Skills />
      <Projects />
      <Suspense fallback={<SectionFallback />}>
        <Timeline />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Contact />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      <FloatingNav />
    </div>
  )
}
