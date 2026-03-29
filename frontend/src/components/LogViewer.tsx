import { useState } from 'react';
import type { LogAnalysis, ViewMode } from '../types';
import DeveloperView from './DeveloperView';
import CeoView from './CeoView';

interface LogViewerProps {
  analysis: LogAnalysis;
  responseTimeMs?: number;
}

// claude-sonnet-4-6 pricing: $3/1M input, $15/1M output
const estimateCost = (input: number, output: number): string => {
  const cost = (input * 3 + output * 15) / 1_000_000;
  if (cost < 0.01) return `₹${(cost * 85).toFixed(2)}`;
  return `₹${(cost * 85).toFixed(2)}`;
};

const LogViewer = ({ analysis, responseTimeMs }: LogViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('developer');

  return (
    <div className="space-y-6">
      {/* The Toggle — hero feature */}
      <div className="flex items-center justify-center">
        <div className="relative inline-flex items-center rounded-full border border-slate-200 bg-slate-100/80 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <button
            onClick={() => setViewMode('developer')}
            className={`relative z-10 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ease-out ${
              viewMode === 'developer'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Developer View
          </button>
          <button
            onClick={() => setViewMode('ceo')}
            className={`relative z-10 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ease-out ${
              viewMode === 'ceo'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            CEO View
          </button>
          {/* Sliding pill */}
          <div
            className={`absolute top-1 h-[calc(100%-8px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              viewMode === 'developer'
                ? 'left-1 w-[calc(50%-2px)] bg-white shadow-sm dark:bg-slate-700'
                : 'left-[calc(50%+2px)] w-[calc(50%-4px)] bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-md shadow-indigo-200 dark:shadow-indigo-900/50'
            }`}
          />
        </div>
      </div>

      {/* View content */}
      <div key={viewMode} className="animate-[fadeIn_300ms_ease-out]">
        {viewMode === 'developer' ? (
          <DeveloperView analysis={analysis} />
        ) : (
          <CeoView analysis={analysis} />
        )}
      </div>

      {/* Stats bar: response time + token usage + cost */}
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-2.5 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
        {responseTimeMs !== undefined && (
          <>
            <span>
              Analyzed in <span className="tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">{(responseTimeMs / 1000).toFixed(1)}s</span>
            </span>
            <span className="text-slate-200 dark:text-slate-700">|</span>
          </>
        )}
        {analysis.usage && analysis.usage.total_tokens > 0 && (
          <>
            <span className="font-medium text-slate-500 dark:text-slate-400">{analysis.usage.model}</span>
            <span className="text-slate-200 dark:text-slate-700">|</span>
            <span><span className="tabular-nums font-medium text-slate-500 dark:text-slate-400">{analysis.usage.input_tokens.toLocaleString()}</span> in</span>
            <span className="text-slate-200 dark:text-slate-700">|</span>
            <span><span className="tabular-nums font-medium text-slate-500 dark:text-slate-400">{analysis.usage.output_tokens.toLocaleString()}</span> out</span>
            <span className="text-slate-200 dark:text-slate-700">|</span>
            <span>
              Cost: <span className="tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
                {estimateCost(analysis.usage.input_tokens, analysis.usage.output_tokens)}
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
