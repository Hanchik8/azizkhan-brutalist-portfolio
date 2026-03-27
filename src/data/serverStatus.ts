/* ─── Mock log templates ─── */
export const LOG_TEMPLATES = [
  { level: 'INFO', service: 'OrderService', msg: 'Saga transaction initiated for order #{id}' },
  { level: 'DEBUG', service: 'InventoryService', msg: 'Stock reserved for SKU-{sku}' },
  { level: 'INFO', service: 'PaymentService', msg: 'Payment processed: ${amount} via Stripe' },
  { level: 'DEBUG', service: 'ProductService', msg: 'Cache hit for product catalog query' },
  { level: 'INFO', service: 'NotificationService', msg: 'Email dispatched to user#{id}@mail.com' },
  { level: 'WARN', service: 'CartService', msg: 'Session TTL approaching for cart#{id}' },
  { level: 'INFO', service: 'AuthService', msg: 'JWT token issued for user#{id}' },
  { level: 'DEBUG', service: 'InventoryService', msg: 'Kafka event consumed: stock.updated' },
  { level: 'INFO', service: 'OrderService', msg: 'Compensating transaction rollback for order #{id}' },
  { level: 'INFO', service: 'GatewayService', msg: 'Route resolved: /api/v1/products -> ProductService' },
  { level: 'DEBUG', service: 'RedisCache', msg: 'SETEX product::{sku} TTL=3600s' },
  { level: 'INFO', service: 'DiscoveryServer', msg: 'Heartbeat received from ProductService instance-{id}' },
  { level: 'DEBUG', service: 'KafkaProducer', msg: 'Published event to topic: order.events' },
  { level: 'INFO', service: 'ConfigServer', msg: 'Configuration refreshed for InventoryService' },
  { level: 'WARN', service: 'PaymentService', msg: 'Retry attempt 2/3 for payment #{id}' },
  { level: 'INFO', service: 'OrderService', msg: 'Order #{id} status updated: PROCESSING -> SHIPPED' },
  { level: 'DEBUG', service: 'AuthService', msg: 'Token refresh for session #{id}' },
  { level: 'INFO', service: 'NotificationService', msg: 'Push notification sent: order_confirmed' },
] as const

export const SERVICES = [
  { name: 'Auth Service', status: 'UP' as const },
  { name: 'User Service', status: 'UP' as const },
  { name: 'Product Service', status: 'UP' as const },
  { name: 'Cart Service', status: 'UP' as const },
  { name: 'Order Service', status: 'UP' as const },
  { name: 'Inventory Service', status: 'UP' as const },
  { name: 'Payment Service', status: 'UP' as const },
  { name: 'Notification Service', status: 'UP' as const },
  { name: 'Discovery Server', status: 'UP' as const },
  { name: 'Config Server', status: 'UP' as const },
]
