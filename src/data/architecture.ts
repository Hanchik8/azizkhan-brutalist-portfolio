import type { Node, Edge } from '@xyflow/react'

/* ─── Node detail tooltips ─── */
export interface ServiceDetail {
  description: string
  stack: string[]
  port?: string
}

export const serviceDetails: Record<string, ServiceDetail> = {
  client: {
    description: 'Browser / Mobile client making HTTP requests',
    stack: ['REST API', 'JSON', 'HTTPS'],
  },
  gateway: {
    description: 'Single entry point for all client requests. Routes, load-balances, and authenticates.',
    stack: ['Spring Cloud Gateway', 'Reactive', 'JWT Validation'],
    port: '8080',
  },
  discovery: {
    description: 'Service registry for dynamic service discovery and health checks.',
    stack: ['Spring Cloud Netflix Eureka', 'Heartbeat Monitor'],
    port: '8761',
  },
  config: {
    description: 'Centralized configuration management for all services.',
    stack: ['Spring Cloud Config', 'Git Backend', 'Encryption'],
    port: '8888',
  },
  auth: {
    description: 'Handles user authentication, JWT generation and validation.',
    stack: ['Spring Security', 'JWT', 'BCrypt', 'OAuth2'],
  },
  user: {
    description: 'User profile management, preferences, and account settings.',
    stack: ['Spring Boot 3', 'JPA / Hibernate', 'PostgreSQL'],
  },
  product: {
    description: 'Product catalog CRUD, search, filtering, and caching.',
    stack: ['Spring Boot 3', 'Redis Cache', 'Kafka Producer'],
  },
  cart: {
    description: 'Shopping cart management with session-based storage.',
    stack: ['Spring Boot 3', 'Redis', 'Session Store'],
  },
  inventory: {
    description: 'Real-time stock tracking, reservation, and quantity updates.',
    stack: ['Spring Boot 3', 'Kafka Consumer', 'PostgreSQL'],
  },
  order: {
    description: 'Order lifecycle management — creation, status, and fulfillment.',
    stack: ['Spring Boot 3', 'Kafka Producer', 'Saga Pattern'],
  },
  payment: {
    description: 'Payment processing, transaction records, and refund handling.',
    stack: ['Spring Boot 3', 'Stripe SDK', 'PostgreSQL'],
  },
  notification: {
    description: 'Email, SMS, and push notifications triggered by events.',
    stack: ['Spring Boot 3', 'Kafka Consumer', 'Redis Queue'],
  },
  postgres: {
    description: 'Primary relational database — logically separated per service.',
    stack: ['PostgreSQL 16', 'Logical Databases', 'JDBC'],
    port: '5432',
  },
  redis: {
    description: 'In-memory cache and session store for high-throughput reads.',
    stack: ['Redis 7', 'Cache / Session', 'TTL Policies'],
    port: '6379',
  },
  kafka: {
    description: 'Distributed event streaming for async inter-service communication.',
    stack: ['Apache Kafka', 'Zookeeper', 'Event Sourcing'],
    port: '9092',
  },
  zookeeper: {
    description: 'Coordination service for Kafka cluster management.',
    stack: ['Apache Zookeeper', 'Leader Election'],
    port: '2181',
  },
  zipkin: {
    description: 'Distributed tracing for request flow visualization.',
    stack: ['Zipkin Server', 'Brave Tracer', 'Span Collection'],
    port: '9411',
  },
  prometheus: {
    description: 'Metrics collection and time-series storage for monitoring.',
    stack: ['Prometheus', 'Micrometer', 'Scrape Config'],
    port: '9090',
  },
  grafana: {
    description: 'Dashboard visualization for metrics and alerting.',
    stack: ['Grafana', 'Prometheus DS', 'Alert Rules'],
    port: '3000',
  },
}

/* ─── Nodes ─── */
export const architectureNodes: Node[] = [
  // Entry
  { id: 'client', type: 'entryNode', position: { x: 420, y: 0 }, data: { label: 'Client', sublabel: 'Browser / Mobile' } },
  { id: 'gateway', type: 'gatewayNode', position: { x: 400, y: 110 }, data: { label: 'API Gateway', sublabel: ':8080' } },

  // Infrastructure (left side)
  { id: 'discovery', type: 'infraNode', position: { x: 30, y: 90 }, data: { label: 'Discovery Server', sublabel: 'Eureka :8761' } },
  { id: 'config', type: 'infraNode', position: { x: 30, y: 180 }, data: { label: 'Config Server', sublabel: ':8888' } },

  // Core microservices (center grid)
  { id: 'auth', type: 'serviceNode', position: { x: 100, y: 280 }, data: { label: 'Auth', sublabel: 'Security & JWT' } },
  { id: 'user', type: 'serviceNode', position: { x: 270, y: 280 }, data: { label: 'User', sublabel: 'Profiles' } },
  { id: 'product', type: 'serviceNode', position: { x: 440, y: 280 }, data: { label: 'Product', sublabel: 'Catalog' } },
  { id: 'cart', type: 'serviceNode', position: { x: 610, y: 280 }, data: { label: 'Cart', sublabel: 'Shopping' } },
  { id: 'inventory', type: 'serviceNode', position: { x: 155, y: 390 }, data: { label: 'Inventory', sublabel: 'Stock' } },
  { id: 'order', type: 'serviceNode', position: { x: 355, y: 390 }, data: { label: 'Order', sublabel: 'Processing' } },
  { id: 'payment', type: 'serviceNode', position: { x: 525, y: 390 }, data: { label: 'Payment', sublabel: 'Transactions' } },
  { id: 'notification', type: 'serviceNode', position: { x: 700, y: 390 }, data: { label: 'Notification', sublabel: 'Events' } },

  // Data layer
  { id: 'postgres', type: 'dbNode', position: { x: 120, y: 530 }, data: { label: 'PostgreSQL', sublabel: ':5432' } },
  { id: 'redis', type: 'dbNode', position: { x: 390, y: 530 }, data: { label: 'Redis', sublabel: ':6379' } },
  { id: 'kafka', type: 'brokerNode', position: { x: 610, y: 520 }, data: { label: 'Kafka', sublabel: ':9092' } },
  { id: 'zookeeper', type: 'brokerNode', position: { x: 810, y: 520 }, data: { label: 'Zookeeper', sublabel: ':2181' } },

  // Observability (right side)
  { id: 'zipkin', type: 'observeNode', position: { x: 820, y: 100 }, data: { label: 'Zipkin', sublabel: ':9411' } },
  { id: 'prometheus', type: 'observeNode', position: { x: 820, y: 190 }, data: { label: 'Prometheus', sublabel: ':9090' } },
  { id: 'grafana', type: 'observeNode', position: { x: 820, y: 280 }, data: { label: 'Grafana', sublabel: ':3000' } },
]

/* ─── Edges ─── */
export const architectureEdges: Edge[] = [
  // Client → Gateway
  { id: 'e-client-gw', source: 'client', target: 'gateway', type: 'animatedEdge', data: { connectionType: 'http' } },

  // Gateway → Services
  { id: 'e-gw-auth', source: 'gateway', target: 'auth', type: 'animatedEdge', data: { connectionType: 'http' } },
  { id: 'e-gw-user', source: 'gateway', target: 'user', type: 'animatedEdge', data: { connectionType: 'http' } },
  { id: 'e-gw-product', source: 'gateway', target: 'product', type: 'animatedEdge', data: { connectionType: 'http' } },
  { id: 'e-gw-cart', source: 'gateway', target: 'cart', type: 'animatedEdge', data: { connectionType: 'http' } },
  { id: 'e-gw-order', source: 'gateway', target: 'order', type: 'animatedEdge', data: { connectionType: 'http' } },
  { id: 'e-gw-payment', source: 'gateway', target: 'payment', type: 'animatedEdge', data: { connectionType: 'http' } },

  // Discovery connections (dashed)
  { id: 'e-disc-auth', source: 'discovery', target: 'auth', type: 'dashedEdge', animated: true },
  { id: 'e-disc-user', source: 'discovery', target: 'user', type: 'dashedEdge', animated: true },
  { id: 'e-disc-product', source: 'discovery', target: 'product', type: 'dashedEdge', animated: true },

  // Config connections (dashed)
  { id: 'e-conf-auth', source: 'config', target: 'auth', type: 'dashedEdge', animated: true },
  { id: 'e-conf-inventory', source: 'config', target: 'inventory', type: 'dashedEdge', animated: true },

  // Services → PostgreSQL
  { id: 'e-auth-pg', source: 'auth', target: 'postgres', type: 'animatedEdge', data: { connectionType: 'jdbc' } },
  { id: 'e-user-pg', source: 'user', target: 'postgres', type: 'animatedEdge', data: { connectionType: 'jdbc' } },
  { id: 'e-order-pg', source: 'order', target: 'postgres', type: 'animatedEdge', data: { connectionType: 'jdbc' } },
  { id: 'e-payment-pg', source: 'payment', target: 'postgres', type: 'animatedEdge', data: { connectionType: 'jdbc' } },
  { id: 'e-inventory-pg', source: 'inventory', target: 'postgres', type: 'animatedEdge', data: { connectionType: 'jdbc' } },

  // Services → Redis
  { id: 'e-product-redis', source: 'product', target: 'redis', type: 'animatedEdge', data: { connectionType: 'cache' } },
  { id: 'e-cart-redis', source: 'cart', target: 'redis', type: 'animatedEdge', data: { connectionType: 'cache' } },
  { id: 'e-notif-redis', source: 'notification', target: 'redis', type: 'animatedEdge', data: { connectionType: 'cache' } },

  // Services → Kafka (async)
  { id: 'e-product-kafka', source: 'product', target: 'kafka', type: 'kafkaEdge', data: { connectionType: 'async' } },
  { id: 'e-order-kafka', source: 'order', target: 'kafka', type: 'kafkaEdge', data: { connectionType: 'async' } },
  { id: 'e-inventory-kafka', source: 'inventory', target: 'kafka', type: 'kafkaEdge', data: { connectionType: 'async' } },
  { id: 'e-notif-kafka', source: 'notification', target: 'kafka', type: 'kafkaEdge', data: { connectionType: 'async' } },

  // Kafka → Zookeeper
  { id: 'e-kafka-zk', source: 'kafka', target: 'zookeeper', type: 'dashedEdge' },

  // Observability
  { id: 'e-prom-graf', source: 'prometheus', target: 'grafana', type: 'dashedEdge' },
  { id: 'e-zipkin-gw', source: 'gateway', target: 'zipkin', type: 'dashedEdge' },
  { id: 'e-prom-gw', source: 'gateway', target: 'prometheus', type: 'dashedEdge' },
]
