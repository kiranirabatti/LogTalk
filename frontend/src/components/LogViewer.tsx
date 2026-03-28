import { useState } from 'react';
import type { LogAnalysis, ViewMode } from '../types';
import DeveloperView from './DeveloperView';
import CeoView from './CeoView';

interface LogViewerProps {
  analysis: LogAnalysis;
}

const LogViewer = ({ analysis }: LogViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('developer');

  return (
    <div className="space-y-6">
      {/* The Toggle — most important UI element */}
      <div className="flex items-center justify-center">
        <div className="relative inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setViewMode('developer')}
            className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              viewMode === 'developer'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Developer View
          </button>
          <button
            onClick={() => setViewMode('ceo')}
            className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              viewMode === 'ceo'
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            CEO View
          </button>
          {/* Sliding background pill */}
          <div
            className={`absolute top-1 h-[calc(100%-8px)] rounded-full shadow-sm transition-all duration-300 ease-in-out ${
              viewMode === 'developer'
                ? 'left-1 w-[calc(50%-2px)] bg-white'
                : 'left-[calc(50%+2px)] w-[calc(50%-4px)] bg-indigo-600'
            }`}
          />
        </div>
      </div>

      {/* View content with transition */}
      <div className="transition-opacity duration-300">
        {viewMode === 'developer' ? (
          <DeveloperView analysis={analysis} />
        ) : (
          <CeoView analysis={analysis} />
        )}
      </div>

      {/* Token usage stats */}
      {analysis.usage && analysis.usage.total_tokens > 0 && (
        <div className="flex items-center justify-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
          <span>Model: <span className="font-medium text-slate-700">{analysis.usage.model}</span></span>
          <span className="text-slate-300">|</span>
          <span>Input: <span className="font-medium text-slate-700">{analysis.usage.input_tokens.toLocaleString()}</span> tokens</span>
          <span className="text-slate-300">|</span>
          <span>Output: <span className="font-medium text-slate-700">{analysis.usage.output_tokens.toLocaleString()}</span> tokens</span>
          <span className="text-slate-300">|</span>
          <span>Total: <span className="font-medium text-slate-700">{analysis.usage.total_tokens.toLocaleString()}</span> tokens</span>
        </div>
      )}
    </div>
  );
};

export default LogViewer;
