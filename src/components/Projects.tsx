import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    number: '01',
    title: 'MegaSegaShop',
    subtitle: 'Demo e-commerce on microservices',
    tech: ['Spring Boot', 'Docker Compose', 'Kafka', 'Redis', 'JWT'],
    description:
      'Микросервисная архитектура (gateway, discovery, config). JWT-аутентификация, события через Kafka, кеширование Redis.',
    github: 'https://github.com/Hanchik8/MegaSegaShop_MicroServices',
  },
  {
    number: '02',
    title: 'Chess Web App',
    subtitle: 'Backend & Security focus',
    tech: ['Spring Boot', 'PostgreSQL', 'Spring Security', 'BCrypt'],
    description:
      'Приложение для пользователей/партий/ходов с хранением статистики. Аутентификация и защита (BCrypt, CSRF, HttpOnly cookies).',
    github: 'https://github.com/Hanchik8/FSD_Project',
  },
  {
    number: '03',
    title: 'FastLearners',
    subtitle: 'Paint & File Explorer',
    tech: ['Java Swing', 'MVC Pattern'],
    description:
      'Desktop-приложения Paint и File Explorer по паттерну MVC. Топ ~28% из ~40 участников.',
    github: null,
  },
]

function ProjectCard({
  project,
  index,
  progress,
}: {
  project: (typeof projects)[number]
  index: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  // Each card's number drifts at a different parallax rate
  const numberY = useTransform(
    progress,
    [0, 1],
    [index * 40, index * -60],
  )

  return (
    <div className="min-w-[320px] sm:min-w-[500px] w-[320px] sm:w-[500px] flex-shrink-0">
      <div className="relative h-full bg-card border border-border p-6 sm:p-8 overflow-hidden group">
        {/* Huge faded background number */}
        <motion.span
          style={{ y: numberY }}
          className="absolute -top-6 -right-4 font-mono text-[10rem] sm:text-[14rem] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none"
        >
          {project.number}
        </motion.span>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 group-hover:bg-primary transition-colors duration-300" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full gap-5 sm:gap-6">
          {/* Number + title */}
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

          {/* Tech tags */}
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

          {/* Description */}
          <p className="text-sm sm:text-base leading-relaxed text-secondary-foreground flex-1">
            {project.description}
          </p>

          {/* GitHub link */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors duration-200 group/link w-fit"
            >
              <span className="border-b border-current pb-0.5 group-hover/link:border-primary">
                View on GitHub
              </span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Bottom corner decoration */}
        <div className="absolute bottom-0 right-0 w-12 h-12 border-t border-l border-border/50 group-hover:border-primary/30 transition-colors duration-300" />
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Map vertical scroll to horizontal translation — 3 cards means translate -66.66%
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66%'])

  // Progress bar width
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="projects" ref={sectionRef} className="relative h-[300vh]">
      {/* Sticky container that stays in viewport */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Section header */}
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

          {/* Progress bar */}
          <div className="mt-6 h-[1px] bg-border relative">
            <motion.div
              style={{ width: progressWidth }}
              className="absolute top-0 left-0 h-full bg-primary"
            />
          </div>
        </div>

        {/* Horizontal scrolling cards */}
        <div className="flex-1 flex items-center px-6 sm:px-12 lg:px-20 pb-12 sm:pb-16">
          <motion.div
            style={{ x }}
            className="flex gap-6 sm:gap-8"
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={i}
                progress={scrollYProgress}
              />
            ))}

            {/* End spacer card with CTA */}
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
    </section>
  )
}
