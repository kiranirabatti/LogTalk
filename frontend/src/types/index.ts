/**
 * LogTalk shared type contracts — mirrors backend/models.py exactly.
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unknown';

export type ViewMode = 'developer' | 'ceo';

export interface UsageStats {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  model: string;
}

export interface LogAnalysis {
  severity: Severity;
  affected_users: number;
  revenue_impact_inr: number;
  revenue_reasoning: string;
  technical_summary: string;
  business_summary: string;
  root_cause: string;
  recommended_action: string;
  started_at: string;
  deployment_correlation: string;
  analyzed_at: string;
  log_line_count: number;
  usage: UsageStats;
}
