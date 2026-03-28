import type { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-600 border-red-200',
  high: 'bg-orange-100 text-orange-500 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-500 border-yellow-200',
  low: 'bg-green-100 text-green-500 border-green-200',
  unknown: 'bg-slate-100 text-slate-500 border-slate-200',
};

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const styles = SEVERITY_STYLES[severity] || SEVERITY_STYLES.unknown;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}
    >
      {severity}
    </span>
  );
};

export default SeverityBadge;
