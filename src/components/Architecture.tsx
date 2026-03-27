import { motion } from 'framer-motion'

interface ServiceNode {
  id: string
  label: string
  sublabel: string
  x: number
  y: number
  color: 'primary' | 'accent' | 'muted'
}

const services: ServiceNode[] = [
  { id: 'gateway', label: 'API Gateway', sublabel: 'Routing & Auth', x: 50, y: 8, color: 'primary' },
  { id: 'discovery', label: 'Discovery', sublabel: 'Eureka Server', x: 50, y: 28, color: 'muted' },
  { id: 'config', label: 'Config Server', sublabel: 'Centralized Config', x: 85, y: 28, color: 'muted' },
  { id: 'product', label: 'Product Service', sublabel: 'CRUD & Catalog', x: 15, y: 52, color: 'primary' },
  { id: 'order', label: 'Order Service', sublabel: 'Processing', x: 50, y: 52, color: 'primary' },
  { id: 'user', label: 'User Service', sublabel: 'Auth & JWT', x: 85, y: 52, color: 'primary' },
  { id: 'kafka', label: 'Kafka', sublabel: 'Event Bus', x: 32, y: 76, color: 'accent' },
  { id: 'redis', label: 'Redis', sublabel: 'Cache Layer', x: 68, y: 76, color: 'accent' },
]

const connections: [string, string][] = [
  ['gateway', 'product'],
  ['gateway', 'order'],
  ['gateway', 'user'],
  ['discovery', 'product'],
  ['discovery', 'order'],
  ['discovery', 'user'],
  ['config', 'product'],
  ['config', 'order'],
  ['config', 'user'],
  ['product', 'kafka'],
  ['order', 'kafka'],
  ['order', 'redis'],
  ['user', 'redis'],
]

function getCenter(node: ServiceNode) {
  return { cx: node.x, cy: node.y + 4 }
}

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.3 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 0.3,
    transition: { delay: 0.1 + i * 0.04, duration: 0.6, ease: 'easeOut' as const },
  }),
}

export default function Architecture() {
  return (
    <section aria-label="System Architecture" className="py-24 px-6 md:px-12 lg:px-20">
      {/* Section heading */}
      <div className="mb-12">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="font-mono text-sm tracking-widest text-primary uppercase block mb-3"
        >
          {'// 04'}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground"
        >
          ARCHITECTURE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 font-mono text-sm text-muted-foreground"
        >
          MegaSegaShop — Microservices System Design
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 h-px w-full max-w-xs bg-primary origin-left"
        />
      </div>

      {/* Diagram */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative border border-border bg-card p-4 md:p-8 overflow-hidden"
      >
        <svg
          viewBox="0 0 100 90"
          className="w-full max-w-3xl mx-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          {connections.map(([fromId, toId], i) => {
            const from = services.find((s) => s.id === fromId)!
            const to = services.find((s) => s.id === toId)!
            const fc = getCenter(from)
            const tc = getCenter(to)
            return (
              <motion.line
                key={`${fromId}-${toId}`}
                x1={fc.cx}
                y1={fc.cy}
                x2={tc.cx}
                y2={tc.cy}
                stroke="hsl(var(--border))"
                strokeWidth="0.3"
                variants={lineVariants}
                custom={i}
              />
            )
          })}

          {/* Service nodes */}
          {services.map((service, i) => {
            const colorClass =
              service.color === 'primary'
                ? 'hsl(var(--primary))'
                : service.color === 'accent'
                ? 'hsl(var(--accent))'
                : 'hsl(var(--muted-foreground))'

            return (
              <motion.g key={service.id} variants={nodeVariants} custom={i}>
                {/* Node box */}
                <rect
                  x={service.x - 10}
                  y={service.y}
                  width="20"
                  height="8"
                  fill="hsl(var(--card))"
                  stroke={colorClass}
                  strokeWidth="0.3"
                  className="transition-all duration-200"
                />
                {/* Label */}
                <text
                  x={service.x}
                  y={service.y + 3.2}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: '2px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                >
                  {service.label}
                </text>
                {/* Sublabel */}
                <text
                  x={service.x}
                  y={service.y + 5.8}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: '1.5px', fontFamily: 'var(--font-mono)' }}
                >
                  {service.sublabel}
                </text>
              </motion.g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 border border-primary bg-card" />
            <span>Core Services</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 border border-accent bg-card" />
            <span>Infrastructure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 border border-muted-foreground bg-card" />
            <span>Support</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
