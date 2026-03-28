/**
 * Error scenario generators for AcmeCorp demo.
 * Each scenario returns a realistic multi-line log string.
 */

const scenarios = [
  {
    name: "Payment Gateway Timeout",
    generate() {
      const ts = new Date().toISOString();
      return [
        `${ts} ERROR PaymentService: Connection to payment gateway timed out after 30000ms`,
        `${ts} ERROR PaymentService: Failed to process order ORD-88421 for cart value ₹2,340`,
        `${ts} CRITICAL PaymentService: Circuit breaker OPEN — 15 consecutive failures in 2 minutes`,
        `${ts} ERROR CheckoutController: POST /api/checkout returned 504 Gateway Timeout`,
        `${ts} WARN LoadBalancer: Upstream payment-svc unhealthy, removing from pool`,
        `${ts} ERROR PaymentService: Connection to payment gateway timed out after 30000ms`,
        `${ts} ERROR PaymentService: Failed to process order ORD-88422 for cart value ₹1,150`,
        `${ts} ERROR PaymentService: Failed to process order ORD-88423 for cart value ₹3,780`,
        `${ts} WARN MetricsCollector: payment_success_rate dropped to 0.12 (threshold: 0.95)`,
        `${ts} ERROR PaymentService: Connection to payment gateway timed out after 30000ms`,
        `${ts} CRITICAL AlertManager: P1 alert fired — payment pipeline down, 47 users affected`,
        `${ts} INFO DeployTracker: Last deploy was v2.3.1 at ${new Date(Date.now() - 1800000).toISOString()}`,
      ].join("\n");
    },
  },
  {
    name: "Database Connection Pool Exhaustion",
    generate() {
      const ts = new Date().toISOString();
      return [
        `${ts} WARN DatabasePool: Active connections 18/20 — approaching limit`,
        `${ts} WARN DatabasePool: Active connections 20/20 — pool exhausted`,
        `${ts} ERROR DatabasePool: Cannot acquire connection — pool exhausted, 12 requests queued`,
        `${ts} ERROR UserService: Query timeout after 15000ms — SELECT * FROM users WHERE session_id = ?`,
        `${ts} ERROR CartService: Failed to load cart for session — database unavailable`,
        `${ts} CRITICAL DatabasePool: 35 requests queued, oldest waiting 22s`,
        `${ts} ERROR OrderService: INSERT INTO orders failed — connection pool exhausted`,
        `${ts} ERROR API: GET /api/products returned 503 Service Unavailable`,
        `${ts} ERROR API: POST /api/cart/add returned 503 Service Unavailable`,
        `${ts} WARN HealthCheck: Database health check failed — timeout after 5000ms`,
        `${ts} CRITICAL IncidentBot: Auto-escalated to on-call — database pool saturated for 3 minutes`,
        `${ts} INFO DeployTracker: Last deploy was v4.1.0 at ${new Date(Date.now() - 3600000).toISOString()} (reduced pool from 50 to 20)`,
      ].join("\n");
    },
  },
  {
    name: "Memory Leak in Checkout Service",
    generate() {
      const ts = new Date().toISOString();
      return [
        `${ts} WARN CheckoutService: Heap usage 78% (1.56GB / 2GB)`,
        `${ts} WARN CheckoutService: Heap usage 85% (1.70GB / 2GB)`,
        `${ts} WARN GC: Full GC took 1200ms — stop-the-world pause`,
        `${ts} ERROR CheckoutService: Heap usage 92% (1.84GB / 2GB) — OOM imminent`,
        `${ts} ERROR CheckoutService: Request latency spike — p99 jumped from 120ms to 4500ms`,
        `${ts} WARN GC: Full GC took 3400ms — stop-the-world pause`,
        `${ts} ERROR API: POST /api/checkout response time 8200ms (SLA: 500ms)`,
        `${ts} CRITICAL CheckoutService: OutOfMemoryError — heap space exhausted`,
        `${ts} CRITICAL ProcessManager: checkout-svc-03 crashed, restarting...`,
        `${ts} ERROR LoadBalancer: Removed checkout-svc-03 from pool — health check failed`,
        `${ts} WARN MetricsCollector: checkout_error_rate 0.34 (threshold: 0.01)`,
        `${ts} INFO DeployTracker: checkout-svc image updated 6 hours ago — v3.8.2 (added in-memory session cache)`,
      ].join("\n");
    },
  },
  {
    name: "Null Pointer in Checkout Flow",
    generate() {
      const ts = new Date().toISOString();
      return [
        `${ts} ERROR CheckoutController: Unhandled NullPointerException at CheckoutService.java:142`,
        `${ts} ERROR CheckoutController: Stack trace:`,
        `  at com.acmecorp.checkout.CheckoutService.calculateDiscount(CheckoutService.java:142)`,
        `  at com.acmecorp.checkout.CheckoutService.processOrder(CheckoutService.java:87)`,
        `  at com.acmecorp.api.CheckoutController.submitOrder(CheckoutController.java:54)`,
        `${ts} ERROR CheckoutController: Request context: POST /api/checkout, user_id=u-29481, promo_code=null`,
        `${ts} ERROR CheckoutController: Unhandled NullPointerException at CheckoutService.java:142`,
        `${ts} ERROR CheckoutController: Unhandled NullPointerException at CheckoutService.java:142`,
        `${ts} WARN ErrorTracker: 23 occurrences of NullPointerException in last 10 minutes`,
        `${ts} ERROR API: POST /api/checkout returned 500 Internal Server Error — 23 times in 10 min`,
        `${ts} INFO DeployTracker: Last deploy was v5.0.1 at ${new Date(Date.now() - 7200000).toISOString()} (refactored discount engine)`,
      ].join("\n");
    },
  },
];

function getRandomScenario() {
  const idx = Math.floor(Math.random() * scenarios.length);
  return scenarios[idx];
}

module.exports = { scenarios, getRandomScenario };
