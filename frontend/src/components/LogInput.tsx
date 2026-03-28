import { useRef, useState } from 'react';
import { demoSamples } from '../data/demo-logs';

type InputTab = 'paste' | 'upload' | 'live';

interface LogInputProps {
  onAnalyze: (logs: string) => void;
  onUpload: (file: File) => void;
  onTriggerLive: () => void;
  isLoading: boolean;
}

const LogInput = ({ onAnalyze, onUpload, onTriggerLive, isLoading }: LogInputProps) => {
  const [activeTab, setActiveTab] = useState<InputTab>('paste');
  const [logs, setLogs] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = logs.trim();
    if (trimmed) {
      onAnalyze(trimmed);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset so the same file can be re-uploaded
      e.target.value = '';
    }
  };

  const loadDemo = (sampleLogs: string) => {
    setLogs(sampleLogs);
    setActiveTab('paste');
  };

  const tabs: { key: InputTab; label: string }[] = [
    { key: 'paste', label: 'Paste' },
    { key: 'upload', label: 'Upload' },
    { key: 'live', label: 'Live' },
  ];

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Paste tab */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="log-input" className="block text-sm font-medium text-slate-700">
              Paste your logs
            </label>
            {/* Demo sample buttons */}
            <div className="flex gap-2">
              {demoSamples.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => loadDemo(sample.logs)}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  title={sample.description}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
          <textarea
            id="log-input"
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            placeholder={`Paste application logs here...\n\nExample:\n2026-03-28 10:00:00 ERROR PaymentService: Connection timeout after 30s\n2026-03-28 10:00:01 CRITICAL DatabasePool: No available connections`}
            rows={10}
            className="w-full rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !logs.trim()}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Logs'}
          </button>
        </div>
      )}

      {/* Upload tab */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.json"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 transition-colors hover:border-indigo-400 hover:bg-indigo-50/30"
          >
            <div className="mb-3 text-4xl text-slate-400">+</div>
            <p className="text-sm font-medium text-slate-700">
              Click to upload a log file
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Supports .log, .txt, .json (max 1 MB)
            </p>
          </div>
          {isLoading && (
            <p className="text-center text-sm text-slate-500">Analyzing uploaded file...</p>
          )}
        </div>
      )}

      {/* Live tab */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="mb-2 text-sm text-slate-700">
              Trigger a live error from the AcmeCorp sandbox
            </p>
            <p className="mb-4 text-xs text-slate-500">
              The sandbox generates a random error scenario and sends it via webhook
            </p>
            <button
              onClick={onTriggerLive}
              disabled={isLoading}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {isLoading ? 'Triggering...' : 'Trigger Live Error'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogInput;
