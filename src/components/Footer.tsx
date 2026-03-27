import { Code2, Mail } from 'lucide-react'

const socialLinks = [
  {
    icon: Code2,
    href: 'https://github.com/Hanchik8',
    label: 'GitHub',
  },
  {
    icon: Mail,
    href: 'mailto:azizkhan1232281@gmail.com',
    label: 'Email',
  },
]

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-background px-6 py-6 md:px-12 lg:px-20">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-mono text-sm tracking-widest text-muted-foreground">
          © 2025 AZIZKHAN
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className="flex h-9 w-9 items-center justify-center border-2 border-border text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
            >
              <link.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
