/* ─── Mock API responses ─── */
export const API_ENDPOINTS = [
  { path: '/skills', method: 'GET', description: 'Technical skill set' },
  { path: '/projects', method: 'GET', description: 'Portfolio projects' },
  { path: '/status', method: 'GET', description: 'System health check' },
] as const

export const API_RESPONSES: Record<string, object> = {
  '/skills': {
    status: 200,
    data: [
      { name: 'Java 21', category: 'Language', level: 'Advanced', years: 3 },
      { name: 'Spring Boot 3', category: 'Framework', level: 'Advanced', years: 2 },
      { name: 'Spring Cloud', category: 'Framework', level: 'Intermediate', years: 1 },
      { name: 'Apache Kafka', category: 'Messaging', level: 'Intermediate', years: 1 },
      { name: 'Redis', category: 'Cache', level: 'Intermediate', years: 1 },
      { name: 'PostgreSQL', category: 'Database', level: 'Advanced', years: 2 },
      { name: 'Docker', category: 'DevOps', level: 'Advanced', years: 2 },
      { name: 'Spring Security', category: 'Security', level: 'Intermediate', years: 2 },
      { name: 'REST API Design', category: 'Architecture', level: 'Advanced', years: 3 },
    ],
    meta: { total: 9, endpoint: '/api/skills', timestamp: '2026-03-27T09:00:00Z' },
  },
  '/projects': {
    status: 200,
    data: [
      {
        id: 1,
        title: 'MegaSegaShop',
        type: 'Microservices E-Commerce',
        services: 9,
        stack: ['Spring Boot 3', 'Spring Cloud', 'Kafka', 'Redis', 'PostgreSQL', 'Docker'],
        patterns: ['API Gateway', 'Service Discovery', 'Saga Pattern', 'Event-Driven Architecture'],
        github: 'https://github.com/Hanchik8/MegaSegaShop_MicroServices',
      },
      {
        id: 2,
        title: 'Chess Web App',
        type: 'Monolith',
        stack: ['Spring Boot', 'Spring Security', 'PostgreSQL', 'BCrypt'],
        patterns: ['MVC', 'Repository Pattern', 'DTO Mapping'],
        github: 'https://github.com/Hanchik8/FSD_Project',
      },
      {
        id: 3,
        title: 'FastLearners',
        type: 'Desktop Application',
        stack: ['Java Swing', 'MVC Pattern'],
        patterns: ['Observer Pattern', 'Command Pattern'],
        github: null,
      },
    ],
    meta: { total: 3, endpoint: '/api/projects' },
  },
  '/status': {
    status: 200,
    services: {
      api_gateway: { status: 'UP', latency_ms: 42, port: 8080 },
      auth_service: { status: 'UP', latency_ms: 18, port: 8081 },
      user_service: { status: 'UP', latency_ms: 22, port: 8082 },
      product_service: { status: 'UP', latency_ms: 15, port: 8083 },
      order_service: { status: 'UP', latency_ms: 28, port: 8084 },
      inventory_service: { status: 'UP', latency_ms: 19, port: 8085 },
      cart_service: { status: 'UP', latency_ms: 12, port: 8086 },
      payment_service: { status: 'UP', latency_ms: 35, port: 8087 },
      notification_service: { status: 'UP', latency_ms: 21, port: 8088 },
    },
    infrastructure: {
      kafka: { status: 'UP', topics: 8, port: 9092 },
      redis: { status: 'UP', hit_ratio: '94.2%', port: 6379 },
      postgresql: { status: 'UP', connections: 47, port: 5432 },
      discovery: { status: 'UP', registered: 9, port: 8761 },
    },
    uptime: '14d 7h 23m',
    timestamp: '2026-03-27T09:00:00Z',
  },
}
