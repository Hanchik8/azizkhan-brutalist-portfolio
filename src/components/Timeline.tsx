import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { timeline } from '../data/timeline'

/* ── Animation variants ── */
const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2 + i * 0.15,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

/* ── Telemetry data ── */
const SERVICES = [
  { name: 'AUTH_SERVICE', port: 8081 },
  { name: 'PRODUCT_SERVICE', port: 8082 },
  { name: 'ORDER_SERVICE', port: 8083 },
  { name: 'INVENTORY_SERVICE', port: 8084 },
] as const

const KAFKA_EVENTS = [
  '{ "topic": "orders.v1", "type": "OrderCreated", "payload": { "id": 8472, "status": "PENDING" } }',
  '{ "topic": "inventory.v2", "type": "StockReserved", "payload": { "sku": "PRD-992", "qty": 1 } }',
  '{ "topic": "payments.v1", "type": "PaymentProcessed", "payload": { "orderId": 8472, "status": "SUCCESS" } }',
  '{ "topic": "notifications", "type": "EmailSent", "payload": { "userId": 102, "template": "ORDER_CONFIRM" } }',
  '{ "topic": "orders.v1", "type": "StatusUpdated", "payload": { "id": 8472, "status": "CONFIRMED" } }',
  '{ "topic": "cart.v1", "type": "CartCleared", "payload": { "userId": 102, "cartId": 441 } }',
  '{ "topic": "users.v1", "type": "UserLogin", "payload": { "userId": 102, "ip": "192.168.1.42" } }',
]

/* ── Fluctuating metric hook ── */
function useFluctuatingMetric(min: number, max: number, intervalMs: number) {
  const [value, setValue] = useState(
    Math.floor(Math.random() * (max - min + 1)) + min,
  )

  useEffect(() => {
    const id = setInterval(() => {
      setValue(Math.floor(Math.random() * (max - min + 1)) + min)
    }, intervalMs)
    return () => clearInterval(id)
  }, [min, max, intervalMs])

  return value
}

/* ── Animated counter on scroll ── */
function useScrollCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const start = performance.now()
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setCount(Math.round(eased * target))
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

/* ── Metric card ── */
function MetricCard({
  label,
  value,
  suffix = '',
  pulse = false,
}: {
  label: string
  value: string | number
  suffix?: string
  pulse?: boolean
}) {
  return (
    <div className="border border-border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-primary" />
          </span>
        )}
        <span className="font-mono text-xl text-primary">
          {value}
          {suffix}
        </span>
      </div>
    </div>
  )
}

/* ── Service status row ── */
function ServiceStatus({
  name,
  port,
}: {
  name: string
  port: number
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 bg-primary" />
        </span>
        <span className="font-mono text-xs text-secondary-foreground uppercase tracking-wider">
          {name}
        </span>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">
        :{port} UP
      </span>
    </div>
  )
}

/* ── Telemetry dashboard ── */
function TelemetryDashboard() {
  const latency = useFluctuatingMetric(28, 62, 1800)
  const cacheHit = useFluctuatingMetric(91, 96, 2200)
  const { count: kafkaTopics, ref: kafkaRef } = useScrollCounter(8)

  const repeatedEvents = [...KAFKA_EVENTS, ...KAFKA_EVENTS]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}
      className="hidden lg:flex flex-col gap-6 border-l border-primary/20 pl-10"
    >
      {/* Header */}
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
          03 // INFRA // METRICS // LIVE_VIEW
        </p>
        <h3 className="text-2xl xl:text-3xl font-bold uppercase tracking-tight text-foreground leading-none">
          SYSTEM_METRICS
        </h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
          Simulated telemetry panel — real-time view of microservices health,
          latency, and cache performance.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        <MetricCard label="GATEWAY_LATENCY" value={latency} suffix="ms" pulse />
        <MetricCard label="REDIS_HIT_RATIO" value={cacheHit} suffix="%" pulse />
        <div ref={kafkaRef}>
          <MetricCard label="KAFKA_TOPICS" value={kafkaTopics} />
        </div>
      </div>

      {/* Service status */}
      <div className="border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
            [SERVICE_HEALTH]
          </p>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            ALL SYSTEMS NOMINAL
          </span>
        </div>
        {SERVICES.map((s) => (
          <ServiceStatus key={s.name} name={s.name} port={s.port} />
        ))}
      </div>

      {/* Kafka Message Stream */}
      <div className="relative overflow-hidden border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
            [MESSAGE_BUS // KAFKA]
          </p>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            cluster: alive
          </span>
        </div>

        <div className="relative h-48 overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent z-10" />
          <motion.div
            animate={{ y: ['0%', '-50%'] }}
            transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
            className="space-y-3"
          >
            {repeatedEvents.map((event, index) => {
              const coloredEvent = event
                .replace(/"topic": "([^"]+)"/, '"topic": <span class="text-accent">""</span>')
                .replace(/"type": "([^"]+)"/, '"type": <span class="text-primary">""</span>')

              return (
                <p
                  key={`${event}-${index}`}
                  className="font-mono text-[11px] leading-relaxed text-muted-foreground break-all"
                  dangerouslySetInnerHTML={{ __html: coloredEvent }}
                />
              )
            })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main component ── */
export default function Timeline() {
  return (
    <section
      id="timeline"
      aria-label="Experience Timeline"
      className="py-24 px-6 md:px-12 lg:px-20"
    >
      {/* Section heading */}
      <div className="mb-16">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="font-mono text-sm tracking-widest text-primary uppercase block mb-3"
        >
          {'// 03'}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground"
        >
          JOURNEY
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 h-px w-full max-w-xs bg-primary origin-left"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(340px,0.45fr)]">
        {/* Left: Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative ml-4 md:ml-8"
        >
          <motion.div
            variants={lineVariants}
            className="absolute left-0 top-0 bottom-0 w-px bg-border origin-top"
          />

          <div className="flex flex-col gap-10 md:gap-12">
            {timeline.map((event, i) => (
              <motion.div
                key={`${event.year}-${event.title}`}
                variants={itemVariants}
                custom={i}
                className="relative pl-8 md:pl-12 group"
              >
                <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 border-2 border-border bg-background group-hover:border-primary group-hover:bg-primary transition-colors duration-200" />

                <span className="inline-block font-mono text-xs tracking-[0.3em] text-primary uppercase mb-2 border border-primary/30 px-2 py-0.5">
                  {event.year}
                </span>

                <h3 className="text-lg md:text-xl font-bold text-foreground uppercase tracking-tight mb-1">
                  {event.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {event.description}
                </p>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-mono border border-border text-muted-foreground uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Telemetry dashboard (desktop only) */}
        <TelemetryDashboard />
      </div>
    </section>
  )
}
