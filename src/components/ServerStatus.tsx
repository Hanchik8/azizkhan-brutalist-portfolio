import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LOG_TEMPLATES, SERVICES } from '../data/serverStatus'

/* ─── Helpers ─── */
function rand(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min))
}
function generateLogLine() {
  const tpl = LOG_TEMPLATES[rand(0, LOG_TEMPLATES.length - 1)]
  const time = new Date().toISOString().slice(11, 23)
  const msg = tpl.msg
    .replace('{id}', String(rand(1000, 9999)))
    .replace('{sku}', String(rand(100, 999)))
    .replace('{amount}', String(rand(10, 500)))
  return { time, level: tpl.level, service: tpl.service, msg }
}

/* ─── Metric Card ─── */
function MetricCard({
  label, value, unit, color, subtitle,
}: {
  label: string; value: string | number; unit?: string; color: string; subtitle?: string
}) {
  return (
    <div className="border-2 border-border bg-card p-4 relative group">
      <div className="absolute top-0 left-0 w-full h-[2px] transition-all duration-200 group-hover:h-[3px]" style={{ background: color }} />
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl md:text-3xl font-bold" style={{ color }}>{value}</span>
        {unit && <span className="font-mono text-xs text-muted-foreground">{unit}</span>}
      </div>
      {subtitle && <div className="font-mono text-[10px] text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  )
}

/* ─── Status Dot ─── */
function StatusDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
    </span>
  )
}

/* ─── Log Level Badge ─── */
function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    INFO: 'text-primary',
    DEBUG: 'text-muted-foreground',
    WARN: 'text-accent',
  }
  return <span className={`${colors[level] || 'text-foreground'} font-bold`}>[{level}]</span>
}

/* ─── Main Component ─── */
export default function ServerStatus() {
  const [latency, setLatency] = useState(42)
  const [topics] = useState(8)
  const [cacheHit, setCacheHit] = useState(93.7)
  const [dbConns, setDbConns] = useState(47)
  const [logs, setLogs] = useState<ReturnType<typeof generateLogLine>[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  // Update metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(rand(30, 60))
      setCacheHit(+(92 + Math.random() * 3).toFixed(1))
      setDbConns(rand(38, 56))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Append logs
  useEffect(() => {
    // Initial batch
    setLogs(Array.from({ length: 6 }, generateLogLine))
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, generateLogLine()]
        return next.length > 50 ? next.slice(-50) : next
      })
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  const sectionAnim = useCallback((delay: number) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' as const },
    transition: { duration: 0.5, delay },
  }), [])

  return (
    <section id="server-status" aria-label="Server Status Dashboard" className="py-24 px-6 md:px-12 lg:px-20">
      {/* Heading */}
      <div className="mb-12">
        <motion.span {...sectionAnim(0)} className="font-mono text-sm tracking-widest text-primary uppercase block mb-3">
          {'// 05'}
        </motion.span>
        <motion.h2 {...sectionAnim(0.1)} className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground">
          SERVER STATUS
        </motion.h2>
        <motion.p {...sectionAnim(0.2)} className="mt-3 font-mono text-sm text-muted-foreground">
          Live Telemetry Dashboard — MegaSegaShop Infrastructure
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 h-px w-full max-w-xs bg-primary origin-left"
        />
      </div>

      {/* Metrics Grid */}
      <motion.div {...sectionAnim(0.3)} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Gateway Latency"
          value={latency}
          unit="ms"
          color="hsl(72, 90%, 62%)"
          subtitle="avg response time"
        />
        <MetricCard
          label="Kafka Topics"
          value={topics}
          unit="active"
          color="hsl(0, 72%, 51%)"
          subtitle="event streams"
        />
        <MetricCard
          label="Redis Cache Hit"
          value={cacheHit}
          unit="%"
          color="hsl(200, 80%, 55%)"
          subtitle="cache efficiency"
        />
        <MetricCard
          label="DB Connections"
          value={dbConns}
          unit="pool"
          color="hsl(280, 70%, 55%)"
          subtitle="PostgreSQL active"
        />
      </motion.div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-3">
        {/* Service Status */}
        <motion.div {...sectionAnim(0.4)} className="border-2 border-border bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center justify-between">
            <span>Service Registry</span>
            <span className="text-primary">{SERVICES.length} nodes</span>
          </div>
          <div className="space-y-2.5">
            {SERVICES.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2.5">
                  <StatusDot />
                  <span className="text-foreground">{svc.name}</span>
                </div>
                <span className="text-primary text-[10px] uppercase tracking-wider">{svc.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Log Console */}
        <motion.div {...sectionAnim(0.5)} className="border-2 border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-border bg-secondary/50">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                spring-boot.log
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/50">
              {logs.length} lines
            </span>
          </div>
          <div
            ref={logRef}
            className="p-4 h-[360px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-0.5 hide-scrollbar"
          >
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 text-muted-foreground hover:text-foreground transition-colors duration-100">
                <span className="text-muted-foreground/40 flex-shrink-0">{log.time}</span>
                <LevelBadge level={log.level} />
                <span className="text-foreground/60 flex-shrink-0">{log.service}:</span>
                <span className="text-foreground/80">{log.msg}</span>
              </div>
            ))}
            <div className="text-primary animate-pulse">█</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
