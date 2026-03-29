import type { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
}

const SEVERITY_CONFIG: Record<Severity, { bg: string; text: string; dot: string; border: string }> = {
  critical: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500', border: 'border-red-200 dark:border-red-800/50' },
  high: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-500 dark:text-orange-400', dot: 'bg-orange-400', border: 'border-orange-200 dark:border-orange-800/50' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-400', border: 'border-amber-200 dark:border-amber-800/50' },
  low: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-800/50' },
  unknown: { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400', border: 'border-slate-200 dark:border-slate-700' },
};

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.unknown;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {severity}
    </span>
  );
};

export default SeverityBadge;
