import type { Skill } from '../types'

export const skills: Skill[] = [
  {
    name: 'Java Core',
    category: 'Language',
    description: 'Strong foundation in OOP, collections, concurrency, streams, and JVM internals.',
    featured: true,
  },
  {
    name: 'Spring Boot',
    category: 'Framework',
    description: 'Building production-grade microservices with auto-configuration and embedded servers.',
    featured: true,
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    description: 'Complex queries, indexing strategies, performance tuning, and schema design.',
    featured: true,
  },
  {
    name: 'Docker',
    category: 'DevOps',
    description: 'Containerizing applications, multi-stage builds, and orchestrating services with Compose.',
    featured: true,
  },
  {
    name: 'SQL',
    category: 'Database',
    description: 'Advanced querying, joins, subqueries, aggregations, and data manipulation.',
  },
  {
    name: 'Spring Security',
    category: 'Framework',
    description: 'Authentication, authorization, JWT tokens, and OAuth2 integration.',
  },
  {
    name: 'Spring Data JPA',
    category: 'Framework',
    description: 'Repository abstractions, custom queries, pagination, and specifications.',
  },
  {
    name: 'REST API',
    category: 'Architecture',
    description: 'Designing clean, versioned RESTful endpoints with proper HTTP semantics.',
  },
  {
    name: 'Hibernate',
    category: 'ORM',
    description: 'Entity mapping, lazy loading, caching strategies, and query optimization.',
  },
  {
    name: 'Git / GitHub',
    category: 'VCS',
    description: 'Branching strategies, pull requests, code reviews, and CI/CD workflows.',
  },
  {
    name: 'Maven',
    category: 'Build Tool',
    description: 'Dependency management, multi-module projects, and build lifecycle plugins.',
  },
  {
    name: 'Linux',
    category: 'OS',
    description: 'Shell scripting, server administration, process management, and networking.',
  },
  {
    name: 'Postman',
    category: 'Testing',
    description: 'API testing, collection runners, environment variables, and automated tests.',
  },
  {
    name: 'Spring Cloud',
    category: 'Framework',
    description: 'Service discovery, config server, circuit breakers, and API gateways.',
    familiar: true,
  },
  {
    name: 'Kafka',
    category: 'Messaging',
    description: 'Event-driven architecture, topics, consumer groups, and stream processing.',
    familiar: true,
  },
  {
    name: 'Redis',
    category: 'Cache',
    description: 'In-memory caching, session management, pub/sub, and data structures.',
    familiar: true,
  },
  {
    name: 'Datadog',
    category: 'Monitoring',
    description: 'Application monitoring, distributed tracing, log aggregation, and alerting.',
    familiar: true,
  },
]
