import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ADR_SECTIONS, type ADRSection } from '../data/adr'

/* ─── Accordion Item ─── */
function ADRAccordion({ section, isOpen, onToggle }: {
  section: ADRSection
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-2 border-border bg-card overflow-hidden group">
      {/* Top accent */}
      <div
        className="h-[2px] transition-all duration-200 group-hover:h-[3px]"
        style={{ background: isOpen ? 'hsl(72, 90%, 62%)' : 'hsl(0, 0%, 15%)' }}
      />

      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150 hover:bg-secondary/30"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{section.number}</span>
          <span className="text-lg font-mono opacity-60">{section.icon}</span>
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
            {section.title}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-xl text-primary flex-shrink-0 ml-4"
        >
          +
        </motion.span>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-5 border-t border-border/50">
              <div className="pt-4 space-y-3">
                {section.content.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="font-mono text-[13px] leading-relaxed text-foreground/75"
                  >
                    <span className="text-primary/60 mr-2">{'>'}</span>
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main Component ─── */
export default function ProjectADR() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['context']))

  const toggle = useCallback((id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setOpenIds(new Set(ADR_SECTIONS.map(s => s.id)))
  }, [])

  const collapseAll = useCallback(() => {
    setOpenIds(new Set())
  }, [])

  const sectionAnim = useCallback((delay: number) => ({
    initial: { opacity: 0, y: 20 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-80px' as const },
    transition: { duration: 0.5, delay },
  }), [])

  return (
    <section id="adr" aria-label="Architecture Decision Records" className="py-24 px-6 md:px-12 lg:px-20">
      {/* Heading */}
      <div className="mb-12">
        <motion.span {...sectionAnim(0)} className="font-mono text-sm tracking-widest text-primary uppercase block mb-3">
          {'// 07'}
        </motion.span>
        <motion.h2 {...sectionAnim(0.1)} className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground">
          DESIGN DECISIONS
        </motion.h2>
        <motion.p {...sectionAnim(0.2)} className="mt-3 font-mono text-sm text-muted-foreground">
          ADR — MegaSegaShop Architecture Decision Records
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 h-px w-full max-w-xs bg-primary origin-left"
        />
      </div>

      {/* ADR Header Card */}
      <motion.div {...sectionAnim(0.3)} className="border-2 border-border bg-card p-5 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
              ADR-001 • MegaSegaShop
            </div>
            <div className="font-mono text-lg font-bold text-foreground uppercase tracking-wide">
              Microservices Architecture with Event-Driven Communication
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Spring Cloud', 'Kafka', 'Saga Pattern', 'Docker'].map((tag) => (
                <span key={tag} className="border border-primary/30 text-primary font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={expandAll}
              className="border border-border hover:border-primary text-muted-foreground hover:text-primary font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all duration-150"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="border border-border hover:border-primary text-muted-foreground hover:text-primary font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all duration-150"
            >
              Collapse All
            </button>
          </div>
        </div>
      </motion.div>

      {/* ADR Sections */}
      <div className="space-y-3">
        {ADR_SECTIONS.map((section, i) => (
          <motion.div key={section.id} {...sectionAnim(0.35 + i * 0.08)}>
            <ADRAccordion
              section={section}
              isOpen={openIds.has(section.id)}
              onToggle={() => toggle(section.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer meta */}
      <motion.div {...sectionAnim(0.7)} className="mt-3 border-2 border-border bg-card px-5 py-3 flex flex-wrap justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        <span>Status: Accepted</span>
        <span>Date: 2025-01-15</span>
        <span>Author: Azizkhan Nurlinov</span>
        <span>Supersedes: Monolithic Architecture</span>
      </motion.div>
    </section>
  )
}
