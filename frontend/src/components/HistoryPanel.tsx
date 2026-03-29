import type { HistoryEntry } from '../types';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  activeId: string | null;
  onSelect: (entry: HistoryEntry) => void;
}

const severityDot: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-amber-400',
  low: 'bg-emerald-500',
  unknown: 'bg-slate-400',
};

const HistoryPanel = ({ entries, activeId, onSelect }: HistoryPanelProps) => {
  if (entries.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          History ({entries.length})
        </h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className={`flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 ${
              activeId === entry.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
            }`}
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[entry.analysis.severity] || severityDot.unknown}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">{entry.label}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                <span>{entry.source}</span>
                <span>·</span>
                <span>{(entry.responseTimeMs / 1000).toFixed(1)}s</span>
                <span>·</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
