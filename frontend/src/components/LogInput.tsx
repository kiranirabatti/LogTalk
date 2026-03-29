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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  const loadDemo = (sampleLogs: string) => {
    setLogs(sampleLogs);
    setActiveTab('paste');
  };

  const tabs: { key: InputTab; label: string; icon: string }[] = [
    { key: 'paste', label: 'Paste', icon: '>' },
    { key: 'upload', label: 'Upload', icon: '+' },
    { key: 'live', label: 'Live', icon: '*' },
  ];

  // Count log levels for the stats bar
  const lineCount = logs.trim() ? logs.trim().split('\n').length : 0;
  const errorCount = (logs.match(/\b(ERROR|CRITICAL|FATAL)\b/gi) || []).length;
  const warnCount = (logs.match(/\bWARN(ING)?\b/gi) || []).length;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200/80 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex-1 px-4 py-3.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className={`font-mono text-xs ${activeTab === tab.key ? 'text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}>
                {tab.icon}
              </span>
              {tab.label}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="p-5">
        {/* Paste tab */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Quick load:</span>
              {demoSamples.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => loadDemo(sample.logs)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                  title={sample.description}
                >
                  {sample.name}
                </button>
              ))}
            </div>

            {/* Textarea with syntax-highlighted overlay */}
            <div className="relative">
              <textarea
                id="log-input"
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Paste application logs here...\n\n# Supports any format: nginx, JSON, plaintext\n# Example:\n2026-03-28 10:00:00 ERROR PaymentService: Connection timeout\n2026-03-28 10:00:01 WARN  RetryHandler: Retrying (attempt 2/3)\n{"level":"CRITICAL","msg":"Database pool exhausted"}`}
                rows={8}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-[13px] leading-relaxed text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-600 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                disabled={isLoading}
              />
              {/* Syntax highlight overlay — rendered below textarea for log level coloring */}
              {logs && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl p-4 font-mono text-[13px] leading-relaxed">
                  {logs.split('\n').map((line, i) => {
                    let color = 'text-transparent';
                    if (/\b(ERROR|CRITICAL|FATAL)\b/i.test(line)) color = 'text-red-500/20';
                    else if (/\bWARN(ING)?\b/i.test(line)) color = 'text-amber-500/15';
                    return (
                      <div key={i} className={`${color} whitespace-pre`}>
                        {color !== 'text-transparent' ? (
                          <span className={`${color === 'text-red-500/20' ? 'bg-red-500/8' : 'bg-amber-500/8'} -mx-4 block px-4`}>
                            {line || '\u00A0'}
                          </span>
                        ) : (
                          <span>{line || '\u00A0'}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stats bar + submit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
                {errorCount > 0 && (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                    {errorCount} error{errorCount > 1 ? 's' : ''}
                  </span>
                )}
                {warnCount > 0 && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    {warnCount} warning{warnCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-[11px] text-slate-300 sm:block dark:text-slate-600">Ctrl+Enter</span>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !logs.trim()}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-300 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none dark:shadow-indigo-900/30"
                >
                  <span className="relative">
                    {isLoading ? 'Analyzing...' : 'Analyze Logs'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload tab */}
        {activeTab === 'upload' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".log,.txt,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-8 py-14 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-600 dark:bg-slate-900/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/10"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/80 dark:bg-indigo-900/40">
                <span className="text-2xl text-indigo-600 dark:text-indigo-400">+</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Click to upload a log file
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                Supports .log, .txt, .json &mdash; max 1 MB
              </p>
            </div>
            {isLoading && (
              <p className="mt-4 text-center text-sm text-slate-500">Analyzing uploaded file...</p>
            )}
          </div>
        )}

        {/* Live tab */}
        {activeTab === 'live' && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/30 px-8 py-14 dark:from-slate-800 dark:to-indigo-950/20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/80 dark:bg-indigo-900/40">
              <span className="text-xl text-indigo-600 dark:text-indigo-400">*</span>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              AcmeCorp Sandbox
            </p>
            <p className="mb-5 mt-1.5 max-w-xs text-center text-xs leading-relaxed text-slate-400">
              Trigger a live error scenario. The sandbox generates a random incident and streams it via webhook.
            </p>
            <button
              onClick={onTriggerLive}
              disabled={isLoading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-300 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none dark:shadow-indigo-900/30"
            >
              {isLoading ? 'Triggering...' : 'Trigger Live Error'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogInput;
