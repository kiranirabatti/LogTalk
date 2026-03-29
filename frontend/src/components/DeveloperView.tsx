import type { LogAnalysis } from '../types';
import SeverityBadge from './SeverityBadge';

interface DeveloperViewProps {
  analysis: LogAnalysis;
}

const DeveloperView = ({ analysis }: DeveloperViewProps) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">&gt;_</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Technical Analysis</h3>
        </div>
        <SeverityBadge severity={analysis.severity} />
      </div>

      {/* Body */}
      <div className="space-y-5 p-6">
        <div>
          <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Summary
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{analysis.technical_summary}</p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/40 p-4 dark:border-red-900/30 dark:bg-red-950/20">
          <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-red-400">
            Root Cause
          </h4>
          <p className="text-sm font-medium leading-relaxed text-red-900 dark:text-red-200">{analysis.root_cause}</p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
            Recommended Action
          </h4>
          <p className="text-sm font-medium leading-relaxed text-emerald-900 dark:text-emerald-200">{analysis.recommended_action}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/30">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Incident Start
            </h4>
            <p className="font-mono text-sm font-medium text-slate-800 dark:text-slate-200">{analysis.started_at}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/30">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Deploy Correlation
            </h4>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{analysis.deployment_correlation}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-700">
          <span>{analysis.log_line_count} lines processed</span>
          <span>{new Date(analysis.analyzed_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperView;
