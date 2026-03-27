/* ─── ADR sections for MegaSegaShop ─── */
export interface ADRSection {
  id: string
  number: string
  title: string
  icon: string
  content: string[]
}

export const ADR_SECTIONS: ADRSection[] = [
  {
    id: 'context',
    number: '01',
    title: 'Context',
    icon: '◆',
    content: [
      'MegaSegaShop is an e-commerce platform with complex business logic spanning product catalog management, user authentication, cart operations, order processing, inventory tracking, payment handling, and real-time notifications.',
      'A monolithic architecture was considered initially but rejected due to: tight coupling between domains, inability to scale individual services independently, and deployment bottlenecks where a single change requires redeploying the entire application.',
      'The system must handle concurrent operations — e.g., multiple users purchasing the same limited-stock item — requiring robust consistency guarantees across service boundaries.',
    ],
  },
  {
    id: 'decision',
    number: '02',
    title: 'Decision',
    icon: '▶',
    content: [
      'Adopted a microservices architecture built on Spring Boot 3 and Spring Cloud ecosystem. Each bounded context (Auth, User, Product, Cart, Inventory, Order, Payment, Notification) is deployed as an independent service.',
      'Infrastructure services include: API Gateway (Spring Cloud Gateway) as the single entry point handling routing and JWT validation, Discovery Server (Eureka) for dynamic service registration, and Config Server for centralized configuration management.',
      'For distributed transactions spanning multiple services (e.g., placing an order involves Cart → Order → Inventory → Payment → Notification), implemented the Saga Pattern with compensating transactions. If payment fails after inventory is reserved, the system automatically triggers a compensating "unreserve" operation.',
      'All services are containerized with Docker and orchestrated via Docker Compose, ensuring environment parity from development to production.',
    ],
  },
  {
    id: 'communication',
    number: '03',
    title: 'Communication',
    icon: '⇄',
    content: [
      'Adopted Event-Driven Architecture (EDA) via Apache Kafka as the primary inter-service communication mechanism instead of synchronous HTTP REST calls between services.',
      'Synchronous communication is limited to: Client → API Gateway → Target Service. All service-to-service communication is asynchronous through Kafka topics (e.g., order.events, inventory.updates, notification.triggers).',
      'This decouples services temporally — the Order Service publishes an "OrderCreated" event without waiting for Inventory or Payment to process it. Consumer groups ensure at-least-once delivery with idempotent handlers.',
      'Redis serves dual purposes: caching frequently accessed data (product catalog, session data) and as a distributed lock mechanism for inventory reservation to prevent overselling.',
    ],
  },
  {
    id: 'tradeoffs',
    number: '04',
    title: 'Trade-offs',
    icon: '⚖',
    content: [
      'Eventual Consistency over Strong Consistency: By choosing async communication via Kafka, the system achieves high availability and fault isolation, but at the cost of eventual consistency. There is a brief window where data across services may be out of sync (e.g., order created but inventory not yet reserved).',
      'Operational Complexity: 9 microservices + infrastructure services (Kafka, Zookeeper, Redis, PostgreSQL) significantly increase deployment and debugging complexity compared to a monolith. Mitigated through Docker Compose for local dev and comprehensive logging.',
      'Debugging Distributed Transactions: Tracing a single user request across multiple services is non-trivial. Solved by integrating Zipkin for distributed tracing — each request carries a trace ID propagated through all service calls and Kafka events.',
      'Infrastructure Overhead: Running Kafka + Zookeeper + Redis + PostgreSQL requires significant resources. Accepted as a necessary trade-off for demonstrating production-grade patterns. Prometheus + Grafana added for observability.',
    ],
  },
]
