import type { LogAnalysis } from '../types';

export const mockAnalysis: LogAnalysis = {
  severity: 'critical',
  affected_users: 47,
  revenue_impact_inr: 82000,
  revenue_reasoning: '47 users unable to checkout during peak hours at avg cart value ₹1,744',
  technical_summary: 'Payment gateway timeout. Connection pool exhausted after deploy v2.3.1.',
  business_summary: 'Customers cannot complete purchases. An estimated 47 users were affected during a 45-minute window.',
  root_cause: 'Database connection pool limit reached after deploy v2.3.1 reduced pool size from 20 to 5.',
  recommended_action: 'Rollback to v2.3.0 and increase connection pool size to 25.',
  started_at: '2026-03-28T15:15:00Z',
  deployment_correlation: 'v2.3.1 deployed 30 minutes before incident started',
  analyzed_at: '2026-03-28T16:00:00Z',
  log_line_count: 142,
};
