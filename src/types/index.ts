export interface Project {
  number: string
  title: string
  slug: string
  subtitle: string
  tech: string[]
  description: string
  github: string | null
  hasDetail?: boolean
}

export interface Skill {
  name: string
  category: string
  description: string
  featured?: boolean
  familiar?: boolean
}

export interface ContactLink {
  icon: string
  label: string
  value: string
  href: string
}

export interface TimelineEvent {
  year: string
  title: string
  description: string
  tags?: string[]
}

export interface Stat {
  value: number
  suffix?: string
  label: string
}
