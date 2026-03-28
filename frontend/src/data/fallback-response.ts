/**
 * Cached fallback response for demo resilience.
 * Used when Claude API is unavailable or too slow during live demo.
 * Matches the "Payment Gateway Failure" demo sample.
 */

import type { LogAnalysis } from '../types';

export const fallbackAnalysis: LogAnalysis = {
  severity: 'critical',
  affected_users: 47,
  revenue_impact_inr: 82000,
  revenue_reasoning:
    '47 users unable to complete checkout during 45-minute outage window. Average cart value ₹1,744 based on recent AcmeCorp data.',
  technical_summary:
    'Payment gateway connection timeout triggered circuit breaker after 15 consecutive failures. Connection pool to upstream payment-svc exhausted within 2 minutes of deploy v2.3.1.',
  business_summary:
    'Customers could not complete purchases for approximately 45 minutes. An estimated 47 users were blocked at checkout, resulting in roughly ₹82,000 in lost revenue.',
  root_cause:
    'Deploy v2.3.1 introduced a misconfigured timeout on the payment gateway client, causing all payment requests to fail after 30 seconds.',
  recommended_action:
    'Immediately rollback to v2.3.0 and increase payment gateway timeout to 60s. Post-incident: add circuit breaker health metrics to the deploy canary check.',
  started_at: '2026-03-28T15:15:00Z',
  deployment_correlation:
    'v2.3.1 deployed at 14:45 — 30 minutes before the first failure. No other deploys in the preceding 24 hours.',
  analyzed_at: new Date().toISOString(),
  log_line_count: 11,
  usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0, model: 'cached-fallback' },
};
