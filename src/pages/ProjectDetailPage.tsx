import { lazy, Suspense, useEffect } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { projects } from '../data/projects'
import NotFoundPage from './NotFoundPage'

/* ── Lazy-load heavy components ── */
const Architecture = lazy(() => import('../components/Architecture'))
const ServerStatus = lazy(() => import('../components/ServerStatus'))
const ApiPlayground = lazy(() => import('../components/ApiPlayground'))
const ProjectADR = lazy(() => import('../components/ProjectADR'))

function SectionFallback() {
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-primary animate-pulse" />
        <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
          Loading component...
        </span>
      </div>
    </div>
  )
}

/* ── Section navigation for detail page ── */
const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'server-status', label: 'Telemetry' },
  { id: 'api-playground', label: 'API' },
  { id: 'adr', label: 'ADR' },
]

function DetailNav() {
  return (
    <nav aria-label="Project sections" className="sticky top-0 z-30 border-b-2 border-border bg-background/90 backdrop-blur-sm">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 text-muted-foreground hover:text-primary border border-transparent hover:border-border transition-all duration-150 flex-shrink-0"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams({ from: '/projects/$slug' })
  const project = projects.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    if (!project?.hasDetail) return
    const prev = document.title
    document.title = `${project.title} — Azizkhan Nurlanov`
    return () => { document.title = prev }
  }, [project])

  // Only projects with a case study have a page; the rest are cards on the home page
  if (!project || !project.hasDetail) {
    return <NotFoundPage message="Project not found" />
  }

  const isMegaSega = slug === 'megasegashop'

  return (
    <div className="noise-bg bg-background text-foreground min-h-screen">
      {/* Top bar */}
      <header className="border-b-2 border-border px-6 md:px-12 lg:px-20 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-150 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="uppercase tracking-widest">Back to Portfolio</span>
          </Link>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="uppercase tracking-widest hidden sm:inline">GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </header>

      {isMegaSega && <DetailNav />}

      <main>
      {/* Project Overview */}
      <section id="overview" className="py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-sm tracking-widest text-primary uppercase block mb-3">
            Project {project.number}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-foreground break-words">
            {project.title}
          </h1>
          <p className="mt-3 font-mono text-base text-muted-foreground max-w-2xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 text-xs font-mono border-2 border-border text-muted-foreground uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 h-px w-full max-w-md bg-primary origin-left"
          />
        </motion.div>
      </section>

      {/* MegaSegaShop-specific sections */}
      {isMegaSega && (
        <>
          <Suspense fallback={<SectionFallback />}>
            <Architecture />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ServerStatus />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ApiPlayground />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ProjectADR />
          </Suspense>
        </>
      )}
      </main>

      {/* Back to portfolio footer */}
      <footer className="border-t-2 border-border px-6 md:px-12 lg:px-20 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="uppercase tracking-widest">Back to Portfolio</span>
        </Link>
      </footer>
    </div>
  )
}
