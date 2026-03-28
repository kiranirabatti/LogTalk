import { useState } from 'react';
import type { LogAnalysis } from './types';
import { analyzePaste, analyzeUpload, triggerDemo } from './api/logtalk';
import LogInput from './components/LogInput';
import LogViewer from './components/LogViewer';

const App = () => {
  const [analysis, setAnalysis] = useState<LogAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (logs: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzePaste(logs);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeUpload(file);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze uploaded file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerLive = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await triggerDemo();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger live demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            Log<span className="text-indigo-600">Talk</span>
          </h1>
          <span className="text-sm text-slate-500">AI-Powered Log Intelligence</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <LogInput
          onAnalyze={handleAnalyze}
          onUpload={handleUpload}
          onTriggerLive={handleTriggerLive}
          isLoading={isLoading}
        />

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 mx-auto rounded-full bg-slate-200" />
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 rounded-lg bg-slate-200" />
                <div className="h-20 rounded-lg bg-slate-200" />
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Analysis failed</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Results */}
        {analysis && !isLoading && <LogViewer analysis={analysis} />}
      </main>
    </div>
  );
};

export default App;
