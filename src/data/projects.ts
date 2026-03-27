import type { Project } from '../types'

export const projects: Project[] = [
  {
    number: '01',
    title: 'MegaSegaShop',
    slug: 'megasegashop',
    subtitle: 'Demo e-commerce on microservices',
    tech: ['Spring Boot', 'Docker Compose', 'Kafka', 'Redis', 'JWT'],
    description:
      'Microservices architecture (gateway, discovery, config). JWT authentication, event-driven communication via Kafka, Redis caching.',
    github: 'https://github.com/Hanchik8/MegaSegaShop_MicroServices',
    hasDetail: true,
  },
  {
    number: '02',
    title: 'Chess Web App',
    slug: 'chess-web-app',
    subtitle: 'Backend & Security focus',
    tech: ['Spring Boot', 'PostgreSQL', 'Spring Security', 'BCrypt'],
    description:
      'Application for users/matches/moves with statistics tracking. Authentication and security (BCrypt, CSRF, HttpOnly cookies).',
    github: 'https://github.com/Hanchik8/FSD_Project',
  },
  {
    number: '03',
    title: 'FastLearners',
    slug: 'fastlearners',
    subtitle: 'Paint & File Explorer',
    tech: ['Java Swing', 'MVC Pattern'],
    description:
      'Desktop Paint and File Explorer applications using the MVC pattern. Top ~28% out of ~40 participants.',
    github: null,
  },
]
