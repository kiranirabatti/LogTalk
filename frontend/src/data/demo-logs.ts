/**
 * Pre-loaded demo log samples for VibeCon hackathon demo.
 * These produce compelling AI analysis with clear business impact.
 */

export interface DemoSample {
  name: string;
  description: string;
  logs: string;
}

export const demoSamples: DemoSample[] = [
  {
    name: 'Payment Gateway Failure',
    description: 'Critical — high revenue impact',
    logs: `2026-03-28T15:15:00Z ERROR PaymentService: Connection to payment gateway timed out after 30000ms
2026-03-28T15:15:01Z ERROR PaymentService: Failed to process order ORD-88421 for cart value ₹2,340
2026-03-28T15:15:02Z CRITICAL PaymentService: Circuit breaker OPEN — 15 consecutive failures in 2 minutes
2026-03-28T15:15:03Z ERROR CheckoutController: POST /api/checkout returned 504 Gateway Timeout
2026-03-28T15:15:05Z WARN LoadBalancer: Upstream payment-svc unhealthy, removing from pool
2026-03-28T15:15:08Z ERROR PaymentService: Failed to process order ORD-88422 for cart value ₹1,150
2026-03-28T15:15:10Z ERROR PaymentService: Failed to process order ORD-88423 for cart value ₹3,780
2026-03-28T15:15:12Z WARN MetricsCollector: payment_success_rate dropped to 0.12 (threshold: 0.95)
2026-03-28T15:15:15Z ERROR PaymentService: Connection to payment gateway timed out after 30000ms
2026-03-28T15:15:18Z CRITICAL AlertManager: P1 alert fired — payment pipeline down, 47 users affected
2026-03-28T15:15:20Z INFO DeployTracker: Last deploy was v2.3.1 at 2026-03-28T14:45:00Z`,
  },
  {
    name: 'Slow API Response',
    description: 'Medium — many users impacted',
    logs: `2026-03-28T12:00:00Z WARN API: GET /api/products response time 2100ms (SLA: 500ms)
2026-03-28T12:00:05Z WARN API: GET /api/products response time 3400ms (SLA: 500ms)
2026-03-28T12:00:10Z WARN API: GET /api/search response time 4200ms (SLA: 300ms)
2026-03-28T12:00:15Z ERROR CacheService: Redis connection timeout after 5000ms — falling back to database
2026-03-28T12:00:20Z WARN DatabasePool: Active connections 18/20 — approaching limit
2026-03-28T12:00:25Z WARN API: GET /api/products response time 5800ms (SLA: 500ms)
2026-03-28T12:00:30Z ERROR API: GET /api/cart returned 503 Service Unavailable
2026-03-28T12:00:35Z WARN MetricsCollector: p99_latency 5200ms (threshold: 1000ms)
2026-03-28T12:00:40Z INFO LoadBalancer: 312 active connections across 3 nodes
2026-03-28T12:00:45Z WARN BounceTracker: Exit rate spiked to 34% (baseline: 8%)
2026-03-28T12:00:50Z INFO DeployTracker: No recent deploys — last was v3.2.0 on 2026-03-25`,
  },
  {
    name: 'Database Connection Issue',
    description: 'High — deployment correlation',
    logs: `2026-03-28T09:30:00Z WARN DatabasePool: Active connections 20/20 — pool exhausted
2026-03-28T09:30:01Z ERROR DatabasePool: Cannot acquire connection — pool exhausted, 12 requests queued
2026-03-28T09:30:02Z ERROR UserService: Query timeout after 15000ms — SELECT * FROM users WHERE session_id = ?
2026-03-28T09:30:05Z ERROR CartService: Failed to load cart for session — database unavailable
2026-03-28T09:30:08Z CRITICAL DatabasePool: 35 requests queued, oldest waiting 22s
2026-03-28T09:30:10Z ERROR OrderService: INSERT INTO orders failed — connection pool exhausted
2026-03-28T09:30:12Z ERROR API: GET /api/products returned 503 Service Unavailable
2026-03-28T09:30:15Z ERROR API: POST /api/cart/add returned 503 Service Unavailable
2026-03-28T09:30:18Z WARN HealthCheck: Database health check failed — timeout after 5000ms
2026-03-28T09:30:20Z CRITICAL IncidentBot: Auto-escalated to on-call — database pool saturated for 3 minutes
2026-03-28T09:30:22Z INFO DeployTracker: Last deploy was v4.1.0 at 2026-03-28T08:30:00Z (reduced pool from 50 to 20)`,
  },
];
