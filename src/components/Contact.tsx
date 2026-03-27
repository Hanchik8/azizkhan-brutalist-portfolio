import { useState, forwardRef, type InputHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Phone, ExternalLink, Code2 } from 'lucide-react'
import { contactLinks as contactLinksData } from '../data/contacts'

const iconMap: Record<string, typeof Mail> = { Mail, Phone, ExternalLink, Code2 }

const contactLinks = contactLinksData.map(link => ({
  ...link,
  icon: iconMap[link.icon] || Mail,
}))

const contactSchema = z.object({
  name: z.string().min(2, 'Minimum 2 characters'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(3, 'Minimum 3 characters'),
  message: z.string().min(10, 'Minimum 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
}

/* ── Reusable brutalist form field ── */
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string
  error?: string
  multiline?: boolean
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, multiline, ...props }, ref) => {
    const baseClasses =
      'w-full border-2 border-border bg-secondary px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none'

    return (
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={5}
            className={`${baseClasses} resize-none`}
            {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={baseClasses}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <p className="font-mono text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

/* ── Contact Section ── */
export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = (_data: ContactFormData) => {
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" aria-label="Contact Information" className="relative py-24 px-6 md:px-12 lg:px-20">
      {/* Section heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        custom={0}
        className="mb-16"
      >
        <p className="font-mono text-sm tracking-widest text-primary uppercase mb-3">
          {'// contact'}
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-foreground">
          GET IN TOUCH
        </h2>
        <div className="mt-4 h-1 w-24 bg-primary" />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Contact info + social links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-8"
        >
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground text-lg leading-relaxed max-w-md"
          >
            Open to new projects and collaboration. Feel free to reach out through any convenient channel.
          </motion.p>

          <div className="flex flex-col gap-4">
            {contactLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                variants={fadeUp}
                custom={i + 2}
                className="group flex items-center gap-4 border-2 border-border bg-card p-4 transition-colors duration-200 hover:border-primary hover:bg-secondary"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-border bg-secondary text-muted-foreground transition-colors duration-200 group-hover:border-primary group-hover:text-primary">
                  <link.icon className="h-5 w-5" />
                </span>
                <span className="flex flex-col">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {link.label}
                  </span>
                  <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
                    {link.value}
                  </span>
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right: Contact form */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.form
            variants={fadeUp}
            custom={2}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6 border-2 border-border bg-card p-6 md:p-8"
          >
            <FormField
              label="Name"
              error={errors.name?.message}
              {...register('name')}
              placeholder="Your name"
            />
            <FormField
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
              placeholder="email@example.com"
            />
            <FormField
              label="Subject"
              error={errors.subject?.message}
              {...register('subject')}
              placeholder="Message subject"
            />
            <FormField
              label="Message"
              error={errors.message?.message}
              {...register('message')}
              placeholder="Tell me about your project..."
              multiline
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full border-2 border-primary bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center font-mono text-sm text-primary"
              >
                Message sent. Thank you!
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
