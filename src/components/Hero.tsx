import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useMousePosition } from '../hooks/useMousePosition'

/* ─── Constants ─── */
const NAME = 'AZIZKHAN'
const ROLE = 'JAVA BACKEND DEVELOPER'
const CONTACT_LINKS = [
  { label: 'GH', fullLabel: 'GitHub', href: 'https://github.com/Hanchik8' },
  { label: 'EM', fullLabel: 'Email', href: 'mailto:azizkhan1232281@gmail.com' },
  { label: 'PH', fullLabel: 'Phone', href: 'tel:+996702800063' },
] as const

const SPRING_CONFIG = { stiffness: 150, damping: 20, mass: 0.5 }
const CURSOR_SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

/* ─── Scroll Indicator ─── */
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
        Scroll
      </span>
      <motion.div
        className="w-px h-8 bg-primary origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 2.3, duration: 0.6, ease: 'easeOut' }}
      />
    </motion.div>
  )
}

/* ─── Cursor Follower (MotionValue-driven, zero re-renders) ─── */
function CursorFollower({ mouseX, mouseY, containerRef }: {
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  containerRef: React.RefObject<HTMLElement | null>
}) {
  const relX = useMotionValue(0)
  const relY = useMotionValue(0)
  const springX = useSpring(relX, CURSOR_SPRING)
  const springY = useSpring(relY, CURSOR_SPRING)

  useEffect(() => {
    const unsubX = mouseX.on('change', (vx) => {
      const el = containerRef.current
      if (!el) return
      relX.set(vx - el.getBoundingClientRect().left)
    })
    const unsubY = mouseY.on('change', (vy) => {
      const el = containerRef.current
      if (!el) return
      relY.set(vy - el.getBoundingClientRect().top)
    })
    return () => { unsubX(); unsubY() }
  }, [mouseX, mouseY, containerRef, relX, relY])

  return (
    <motion.div
      className="pointer-events-none absolute z-50 hidden md:block"
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 h-10 w-10 border border-primary"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-primary"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />
    </motion.div>
  )
}

/* ─── Kinetic Name (MotionValue-driven, zero re-renders) ─── */
function KineticName({ mouseX, mouseY, containerRef }: {
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  containerRef: React.RefObject<HTMLElement | null>
}) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const smoothX = useSpring(rawX, SPRING_CONFIG)
  const smoothY = useSpring(rawY, SPRING_CONFIG)

  const translateX = useTransform(smoothX, [-1, 1], [-18, 18])
  const translateY = useTransform(smoothY, [-1, 1], [-8, 8])
  const skewX = useTransform(smoothX, [-1, 1], [2, -2])
  const skewY = useTransform(smoothY, [-1, 1], [1, -1])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Subscribe to MotionValue changes — no React state, no re-renders
    const unsubX = mouseX.on('change', (latestX) => {
      const rect = container.getBoundingClientRect()
      const nx = ((latestX - rect.left) / rect.width) * 2 - 1
      rawX.set(Math.max(-1, Math.min(1, nx)))
    })

    const unsubY = mouseY.on('change', (latestY) => {
      const rect = container.getBoundingClientRect()
      const ny = ((latestY - rect.top) / rect.height) * 2 - 1
      rawY.set(Math.max(-1, Math.min(1, ny)))
    })

    return () => {
      unsubX()
      unsubY()
    }
  }, [containerRef, mouseX, mouseY, rawX, rawY])

  return (
    <motion.h1
      className="font-sans font-bold leading-[0.85] tracking-tighter text-foreground select-none"
      style={{
        fontSize: 'clamp(4rem, 15vw, 12rem)',
        x: translateX,
        y: translateY,
        skewX,
        skewY,
      }}
      initial={{ opacity: 0, y: 60, skewY: 6 }}
      animate={{ opacity: 1, y: 0, skewY: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {NAME.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3 + i * 0.06,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  )
}

/* ─── Contact Pill ─── */
function ContactPill({ label, fullLabel, href, delay }: {
  label: string
  fullLabel: string
  href: string
  delay: number
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={fullLabel}
      className="border border-border px-3 py-1.5 font-mono text-xs tracking-widest text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {label}
    </motion.a>
  )
}

/* ─── Hero ─── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { x: mouseX, y: mouseY, handleMouseMove } = useMousePosition()

  return (
      <section
        ref={sectionRef}
        id="hero"
        aria-label="Introduction"
        onMouseMove={handleMouseMove}
        className="relative min-h-screen overflow-hidden bg-background grid-lines"
      >
        <CursorFollower mouseX={mouseX} mouseY={mouseY} containerRef={sectionRef} />
        {/* ── Top bar: role + contacts ── */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
          <motion.span
            className="font-mono text-xs tracking-[0.25em] text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            PORTFOLIO / 2025
          </motion.span>

          <div className="flex items-center gap-3">
            {CONTACT_LINKS.map((link, i) => (
              <ContactPill
                key={link.label}
                label={link.label}
                fullLabel={link.fullLabel}
                href={link.href}
                delay={1.4 + i * 0.1}
              />
            ))}
          </div>
        </div>

        {/* ── Main content grid ── */}
        <div className="relative z-[1] flex min-h-screen flex-col justify-center px-6 md:px-10 lg:px-20">
          <motion.div
            className="absolute left-6 top-[15%] bottom-[15%] w-px bg-accent md:left-10 lg:left-20"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />

          <div className="ml-6 max-w-5xl md:ml-12">
            <motion.span
              className="mb-4 block font-mono text-xs tracking-[0.4em] text-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              aria-hidden="true"
            >
              001
            </motion.span>

            <KineticName mouseX={mouseX} mouseY={mouseY} containerRef={sectionRef} />

            <motion.p
              className="mt-4 font-mono text-sm tracking-[0.3em] text-primary md:text-base"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {ROLE}
            </motion.p>

            <motion.div
              className="my-6 h-px w-32 bg-border"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
              aria-hidden="true"
            />

            <motion.p
              className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              Java backend intern, 2nd year student at AIU.
              <br />
              I learn technologies quickly and apply them immediately.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <a
                href="https://github.com/Hanchik8"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 border-2 border-primary bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:bg-background hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
              >
                <span>View GitHub</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="mailto:azizkhan1232281@gmail.com"
                className="border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
              >
                Contact
              </a>
            </motion.div>
          </div>

          <motion.span
            className="pointer-events-none absolute -right-4 bottom-[10%] select-none font-sans text-[clamp(6rem,20vw,18rem)] font-bold leading-none text-foreground/[0.03] md:right-8"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            01
          </motion.span>
        </div>

        {/* ── Bottom status bar ── */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-border px-6 py-3 md:px-10">
          <motion.span
            className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            Based in Bishkek, KG
          </motion.span>
          <motion.span
            className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.5 }}
          >
            +996 702 800 063
          </motion.span>
        </div>

        <ScrollIndicator />
      </section>
  )
}
