import type { LogAnalysis } from '../types';
import ImpactCard from './ImpactCard';
import SeverityBadge from './SeverityBadge';

interface CeoViewProps {
  analysis: LogAnalysis;
}

const formatINR = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
};

const CeoView = ({ analysis }: CeoViewProps) => {
  return (
    <div className="space-y-6 rounded-xl border border-indigo-200 bg-indigo-50/30 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-indigo-900">Business Impact</h3>
        <SeverityBadge severity={analysis.severity} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImpactCard
          icon="👥"
          value={analysis.affected_users.toLocaleString()}
          label="Users Affected"
        />
        <ImpactCard
          icon="💰"
          value={formatINR(analysis.revenue_impact_inr)}
          label="Est. Revenue Impact"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
            What Happened
          </h4>
          <p className="text-sm leading-relaxed text-indigo-900">{analysis.business_summary}</p>
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Revenue Reasoning
          </h4>
          <p className="text-sm leading-relaxed text-indigo-800">{analysis.revenue_reasoning}</p>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-100 p-4">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Recommended Next Step
          </h4>
          <p className="text-sm font-medium text-indigo-900">{analysis.recommended_action}</p>
        </div>
      </div>
    </div>
  );
};

export default CeoView;
