import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { projects } from '../data/projects'
import type { Project } from '../types'

function ProjectCard({
  project,
  progress,
  index,
}: {
  project: Project
  progress?: ReturnType<typeof useScroll>['scrollYProgress']
  index: number
}) {
  const numberY = progress
    ? useTransform(progress, [0, 1], [index * 40, index * -60])
    : undefined

  return (
    <div className="min-w-[85vw] sm:min-w-[500px] w-[85vw] sm:w-[500px] flex-shrink-0 snap-center md:snap-align-none">
      <div className="relative h-full bg-card border border-border p-6 sm:p-8 overflow-hidden group">
        {numberY ? (
          <motion.span
            style={{ y: numberY }}
            className="absolute -top-6 -right-4 font-mono text-[10rem] sm:text-[14rem] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none"
            aria-hidden="true"
          >
            {project.number}
          </motion.span>
        ) : (
          <span
            className="absolute -top-6 -right-4 font-mono text-[10rem] sm:text-[14rem] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none"
            aria-hidden="true"
          >
            {project.number}
          </span>
        )}

        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 group-hover:bg-primary transition-colors duration-300" />

        <div className="relative z-10 flex flex-col h-full gap-5 sm:gap-6">
          <div>
            <span className="font-mono text-xs text-primary tracking-widest uppercase">
              Project {project.number}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-2 uppercase">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {project.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-xs font-mono border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-200 uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-secondary-foreground flex-1">
            {project.description}
          </p>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors duration-200 group/link w-fit focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <span className="border-b border-current pb-0.5 group-hover/link:border-primary">
                View on GitHub
              </span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <div className="absolute bottom-0 right-0 w-12 h-12 border-t border-l border-border/50 group-hover:border-primary/30 transition-colors duration-300" />
      </div>
    </div>
  )
}

/* ── Mobile: native horizontal scroll with snap ── */
function MobileProjects() {
  return (
    <div className="md:hidden">
      <div className="px-6 pt-16 pb-6">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-3"
        >
          // Selected Work
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-foreground uppercase tracking-tighter"
        >
          PROJECTS
        </motion.h2>
      </div>

      <div className="overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8">
        <div className="flex gap-4 px-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.number} project={project} index={i} />
          ))}
          <div className="min-w-[60vw] flex-shrink-0 flex items-center justify-center snap-center">
            <div className="text-center space-y-4">
              <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">
                More coming soon
              </p>
              <div className="w-12 h-[1px] bg-border mx-auto" />
              <p className="font-mono text-xs text-muted-foreground/60">
                &#123; ...exploring &#125;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Desktop: scroll-linked horizontal animation ── */
function DesktopProjects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66%'])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={sectionRef} className="hidden md:block relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="px-6 sm:px-12 lg:px-20 pt-16 sm:pt-20 pb-6 sm:pb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-3"
              >
                // Selected Work
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground uppercase tracking-tighter"
              >
                PROJECTS
              </motion.h2>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="hidden sm:block font-mono text-xs text-muted-foreground tracking-wider pb-2"
            >
              SCROLL ↓
            </motion.span>
          </div>

          <div className="mt-6 h-[1px] bg-border relative">
            <motion.div
              style={{ width: progressWidth }}
              className="absolute top-0 left-0 h-full bg-primary"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center px-6 sm:px-12 lg:px-20 pb-12 sm:pb-16">
          <motion.div style={{ x }} className="flex gap-6 sm:gap-8">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={i}
                progress={scrollYProgress}
              />
            ))}
            <div className="min-w-[280px] sm:min-w-[400px] flex-shrink-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">
                  More coming soon
                </p>
                <div className="w-12 h-[1px] bg-border mx-auto" />
                <p className="font-mono text-xs text-muted-foreground/60">
                  &#123; ...exploring &#125;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" aria-label="Projects">
      <MobileProjects />
      <DesktopProjects />
    </section>
  )
}
