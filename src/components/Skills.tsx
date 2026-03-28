import { motion } from 'framer-motion'
import { skills } from '../data/skills'
import type { Skill } from '../types'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number] },
  },
}

const manifestoPrinciples = [
  'SOLID // maintainable service boundaries',
  'ЧИСТАЯ АРХИТЕКТУРА // domain first, framework second',
  'МИКРОСЕРВИСЫ // autonomy, observability, resilience',
  'CQRS / SAGA // eventual consistency for real systems',
]

const systemLogLines = [
  '[INFO ] o.s.b.StartupInfoLogger        : Starting portfolio-core on port 8080',
  '[INFO ] c.a.p.config.ConfigServer      : Property sources resolved successfully',
  '[INFO ] c.a.p.user.UserService         : Bean initialized -> UserService',
  '[INFO ] c.a.p.order.OrderService       : Bean initialized -> OrderService',
  '[DEBUG] c.a.p.cart.CartService         : Waiting for Kafka topic cart.events.v1',
  '[DEBUG] c.a.p.auth.JwtFilter           : JwtFilter registered for /api/**',
  '[INFO ] c.a.p.kafka.KafkaHealthProbe   : Consumer group portfolio-backend is stable',
  '[INFO ] c.a.p.redis.RedisBootstrap     : Redis cache warmed with 14 keys',
  '[DEBUG] c.a.p.metrics.TraceExporter    : Publishing spans to observability pipeline',
  '[INFO ] c.a.p.gateway.ApiGateway       : Routes mapped for /users, /orders, /metrics',
  '[INFO ] o.s.b.w.e.tomcat.TomcatWebServer: Tomcat started on port 8080 (http)',
  '[INFO ] c.a.p.PortfolioApplication     : Started PortfolioApplication in 3.481 seconds',
]

function getBentoClasses(skill: Skill): string {
  if (!skill.featured) return ''

  const featuredPatterns = [
    'md:col-span-2',
    'md:col-span-2 md:row-span-2',
    'md:row-span-2',
    'md:col-span-2',
  ]

  const featuredIndex = skills.filter((s) => s.featured).indexOf(skill)

  return featuredPatterns[featuredIndex] ?? ''
}

export default function Skills() {
  const repeatedLogLines = [...systemLogLines, ...systemLogLines]

  return (
    <section
      id="skills"
      aria-label="Skills and Technology Stack"
      className="relative py-24 px-6 md:px-12 lg:px-20"
    >
      <div className="mb-16">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.0, 0.0, 0.2, 1] }}
          className="font-mono text-sm tracking-widest text-primary uppercase mb-3"
        >
          {'// 02'}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.0, 0.0, 0.2, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground"
        >
          SKILLS &amp; STACK
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1], delay: 0.2 }}
          className="mt-4 h-px w-full max-w-xs bg-primary origin-left"
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(320px,0.38fr)_minmax(0,0.62fr)] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}
          className="flex h-full flex-col gap-8 lg:pr-10"
        >
          <div className="border border-border bg-card p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              02 // BACKEND_PHILOSOPHY
            </p>
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground leading-none">
              THE_MANIFESTO
            </h3>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-secondary-foreground">
              Проектирую backend-системы так, чтобы они выдерживали рост нагрузки, команд и
              бизнес-логики без хаоса в коде и инфраструктуре.
            </p>
          </div>

          <div className="border border-border bg-card p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-5">
              [ENGINEERING_RULESET]
            </p>
            <div className="space-y-3">
              {manifestoPrinciples.map((principle) => (
                <div
                  key={principle}
                  className="flex items-start gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 bg-primary" />
                  <p className="font-mono text-xs sm:text-sm uppercase tracking-wide text-secondary-foreground">
                    {principle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden border border-border bg-card p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
                [SYSTEM_LOG // RUNNING]
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                spring-boot/runtime
              </span>
            </div>

            <div className="relative h-64 overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-card to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent z-10" />
              <motion.div
                animate={{ y: ['0%', '-50%'] }}
                transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
                className="space-y-3"
              >
                {repeatedLogLines.map((line, index) => (
                  <p
                    key={`${line}-${index}`}
                    className="font-mono text-[11px] sm:text-xs leading-relaxed text-muted-foreground/90"
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="lg:border-l lg:border-primary/20 lg:pl-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[minmax(140px,auto)]"
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={cardVariants}
                className={`group relative border border-border bg-card p-6 flex flex-col justify-between transition-all duration-200 ease-out hover:border-primary hover:scale-[1.03] hover:z-10 ${skill.familiar ? 'border-dashed' : ''} ${getBentoClasses(skill)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {skill.category}
                  </span>
                  {skill.familiar && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5">
                      Familiar
                    </span>
                  )}
                  {skill.featured && <span className="inline-block h-2 w-2 bg-primary" />}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-foreground uppercase tracking-tight mb-2">
                  {skill.name}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed opacity-0 max-h-0 overflow-hidden transition-all duration-200 ease-out group-hover:opacity-100 group-hover:max-h-24">
                  {skill.description}
                </p>

                {skill.featured && (
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 font-mono text-xs text-muted-foreground tracking-wider"
          >
            {'* Dashed borders = familiar / exploring'}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
