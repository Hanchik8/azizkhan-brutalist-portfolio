import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage({ message = 'Page not found' }: { message?: string }) {
  useEffect(() => {
    const prev = document.title
    document.title = '404 — Azizkhan'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.title = prev
      meta.remove()
    }
  }, [])

  return (
    <main className="noise-bg bg-background text-foreground min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="font-mono text-6xl text-primary">404</div>
        <h1 className="font-mono text-sm text-muted-foreground">{message}</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-primary border border-primary px-4 py-2 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Portfolio
        </Link>
      </div>
    </main>
  )
}
