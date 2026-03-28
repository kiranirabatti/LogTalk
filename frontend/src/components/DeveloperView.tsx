import type { LogAnalysis } from '../types';
import SeverityBadge from './SeverityBadge';

interface DeveloperViewProps {
  analysis: LogAnalysis;
}

const DeveloperView = ({ analysis }: DeveloperViewProps) => {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Technical Analysis</h3>
        <SeverityBadge severity={analysis.severity} />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Summary
          </h4>
          <p className="text-sm leading-relaxed text-slate-800">{analysis.technical_summary}</p>
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Root Cause
          </h4>
          <p className="text-sm leading-relaxed text-slate-800">{analysis.root_cause}</p>
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recommended Action
          </h4>
          <p className="text-sm leading-relaxed text-slate-800">{analysis.recommended_action}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Started At
            </h4>
            <p className="text-sm font-medium text-slate-800">{analysis.started_at}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Deploy Correlation
            </h4>
            <p className="text-sm font-medium text-slate-800">{analysis.deployment_correlation}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Analyzed: {new Date(analysis.analyzed_at).toLocaleString()}</span>
          <span>{analysis.log_line_count} lines processed</span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperView;
