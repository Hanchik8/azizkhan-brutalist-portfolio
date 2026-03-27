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

/**
 * Assigns grid placement classes for the bento layout.
 * Featured cards get asymmetric spans; the rest fill 1×1.
 */
function getBentoClasses(skill: Skill, index: number): string {
  if (!skill.featured) return ''

  // Each featured card gets a unique shape for asymmetry
  const featuredPatterns = [
    'md:col-span-2',                    // Java Core — wide
    'md:col-span-2 md:row-span-2',     // Spring Boot — large square
    'md:row-span-2',                    // PostgreSQL — tall
    'md:col-span-2',                    // Docker — wide
  ]

  const featuredIndex = skills
    .filter((s) => s.featured)
    .indexOf(skill)

  return featuredPatterns[featuredIndex] ?? ''
}

export default function Skills() {
  return (
    <section id="skills" aria-label="Skills and Technology Stack" className="relative py-24 px-6 md:px-12 lg:px-20">
      {/* Section heading */}
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

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[minmax(140px,auto)]"
      >
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            variants={cardVariants}
            className={`group relative border border-border bg-card p-6 flex flex-col justify-between
              transition-all duration-200 ease-out
              hover:border-primary hover:scale-[1.03] hover:z-10
              ${skill.familiar ? 'border-dashed' : ''}
              ${getBentoClasses(skill, i)}`}
          >
            {/* Category label */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {skill.category}
              </span>
              {skill.familiar && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5">
                  Familiar
                </span>
              )}
              {skill.featured && (
                <span className="inline-block h-2 w-2 bg-primary" />
              )}
            </div>

            {/* Skill name */}
            <h3 className="text-lg md:text-xl font-bold text-foreground uppercase tracking-tight mb-2">
              {skill.name}
            </h3>

            {/* Description — revealed on hover */}
            <p className="text-sm text-muted-foreground leading-relaxed opacity-0 max-h-0 overflow-hidden transition-all duration-200 ease-out group-hover:opacity-100 group-hover:max-h-24">
              {skill.description}
            </p>

            {/* Decorative corner accent on featured cards */}
            {skill.featured && (
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-10 font-mono text-xs text-muted-foreground tracking-wider"
      >
        {'* Dashed borders = familiar / exploring'}
      </motion.p>
    </section>
  )
}
