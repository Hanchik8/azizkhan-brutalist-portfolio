import { motion } from 'framer-motion'
import { timeline } from '../data/timeline'

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function Timeline() {
  return (
    <section id="timeline" aria-label="Experience Timeline" className="py-24 px-6 md:px-12 lg:px-20">
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

      {/* Timeline */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative ml-4 md:ml-8"
      >
        {/* Vertical line */}
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
              {/* Dot on the line */}
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 border-2 border-border bg-background group-hover:border-primary group-hover:bg-primary transition-colors duration-200" />

              {/* Year badge */}
              <span className="inline-block font-mono text-xs tracking-[0.3em] text-primary uppercase mb-2 border border-primary/30 px-2 py-0.5">
                {event.year}
              </span>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-foreground uppercase tracking-tight mb-1">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                {event.description}
              </p>

              {/* Tags */}
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
    </section>
  )
}
