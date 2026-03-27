import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import { stats } from '../data/stats'
import { motion } from 'framer-motion'

function StatCard({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { count, ref } = useAnimatedCounter(value, 1200)

  return (
    <div ref={ref} className="border border-border bg-card p-6 md:p-8 text-center group hover:border-primary transition-colors duration-200">
      <span className="block font-sans text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        {count}{suffix || ''}
      </span>
      <span className="block mt-2 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export default function Stats() {
  return (
    <section aria-label="Statistics" className="py-16 px-6 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
        ))}
      </motion.div>
    </section>
  )
}
