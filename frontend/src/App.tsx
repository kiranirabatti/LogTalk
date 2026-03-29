import { useState } from 'react';
import type { LogAnalysis, HistoryEntry } from './types';
import { analyzePaste, analyzeUpload, triggerDemo } from './api/logtalk';
import useDarkMode from './hooks/useDarkMode';
import LogInput from './components/LogInput';
import LogViewer from './components/LogViewer';
import HistoryPanel from './components/HistoryPanel';

const App = () => {
  const [analysis, setAnalysis] = useState<LogAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | undefined>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isDark, toggleDark] = useDarkMode();

  const addToHistory = (result: LogAnalysis, source: 'paste' | 'upload' | 'live', timeMs: number) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      analysis: result,
      source,
      responseTimeMs: timeMs,
      timestamp: new Date().toISOString(),
      label: result.root_cause.length > 50 ? result.root_cause.slice(0, 50) + '...' : result.root_cause,
    };
    setHistory((prev) => [entry, ...prev]);
    setActiveHistoryId(entry.id);
  };

  const runAnalysis = async <T,>(
    fn: () => Promise<T>,
    source: 'paste' | 'upload' | 'live',
    errorMsg: string,
  ) => {
    setIsLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const result = (await fn()) as LogAnalysis;
      const elapsed = performance.now() - start;
      setResponseTimeMs(elapsed);
      setAnalysis(result);
      addToHistory(result, source, elapsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = (logs: string) =>
    runAnalysis(() => analyzePaste(logs), 'paste', 'Failed to analyze logs');

  const handleUpload = (file: File) =>
    runAnalysis(() => analyzeUpload(file), 'upload', 'Failed to analyze uploaded file');

  const handleTriggerLive = () =>
    runAnalysis(() => triggerDemo(), 'live', 'Failed to trigger live demo');

  const handleHistorySelect = (entry: HistoryEntry) => {
    setAnalysis(entry.analysis);
    setResponseTimeMs(entry.responseTimeMs);
    setActiveHistoryId(entry.id);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md shadow-indigo-200 dark:shadow-indigo-900/50">
              <span className="text-sm font-bold text-white">LT</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Log<span className="text-indigo-600 dark:text-indigo-400">Talk</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">AI-Powered Log Intelligence</span>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀' : '☾'}
            </button>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" title="System online" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 lg:px-8">
        {/* Hero section — only show when no results */}
        {!analysis && !isLoading && !error && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Translate logs into business impact
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Paste your application logs and get instant analysis — toggle between Developer View and CEO View with one click.
            </p>
          </div>
        )}

        <div className={`gap-8 ${history.length > 0 && analysis ? 'lg:flex' : ''}`}>
          {/* Main column */}
          <div className="min-w-0 flex-1 space-y-8">
            <LogInput
              onAnalyze={handleAnalyze}
              onUpload={handleUpload}
              onTriggerLive={handleTriggerLive}
              isLoading={isLoading}
            />

            {/* Loading skeleton */}
            {isLoading && (
              <div className="space-y-6 animate-pulse">
                <div className="flex justify-center">
                  <div className="h-10 w-64 rounded-full bg-slate-200/80 dark:bg-slate-700" />
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="h-5 w-40 rounded-lg bg-slate-200/80 dark:bg-slate-700" />
                    <div className="h-7 w-20 rounded-full bg-slate-200/80 dark:bg-slate-700" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-full rounded-lg bg-slate-100 dark:bg-slate-700/50" />
                    <div className="h-4 w-4/5 rounded-lg bg-slate-100 dark:bg-slate-700/50" />
                    <div className="h-4 w-3/5 rounded-lg bg-slate-100 dark:bg-slate-700/50" />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-700/50" />
                    <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-700/50" />
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    <span className="text-sm text-red-600 dark:text-red-400">!</span>
                  </div>
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-200">Analysis could not be completed</p>
                    <p className="mt-1 text-sm leading-relaxed text-red-700 dark:text-red-300">{error}</p>
                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">Try again or check your logs for formatting issues.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {analysis && !isLoading && (
              <LogViewer analysis={analysis} responseTimeMs={responseTimeMs} />
            )}
          </div>

          {/* History sidebar — appears after first analysis on large screens */}
          {history.length > 0 && analysis && (
            <div className="mt-8 w-full shrink-0 lg:mt-0 lg:w-72">
              <HistoryPanel
                entries={history}
                activeId={activeHistoryId}
                onSelect={handleHistorySelect}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-600">
        <span>Powered by </span>
        <span className="font-semibold text-slate-500 dark:text-slate-400">ScriptsHub</span>
      </footer>
    </div>
  );
};

export default App;
