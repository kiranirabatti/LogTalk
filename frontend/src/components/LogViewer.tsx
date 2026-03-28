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
    </div>
  );
};

export default LogViewer;
