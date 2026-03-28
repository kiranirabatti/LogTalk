import { useState } from 'react';

interface LogInputProps {
  onAnalyze: (logs: string) => void;
  isLoading: boolean;
}

const LogInput = ({ onAnalyze, isLoading }: LogInputProps) => {
  const [logs, setLogs] = useState('');

  const handleSubmit = () => {
    const trimmed = logs.trim();
    if (trimmed) {
      onAnalyze(trimmed);
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="log-input" className="block text-sm font-medium text-slate-700">
        Paste your logs
      </label>
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
  );
};

export default LogInput;
