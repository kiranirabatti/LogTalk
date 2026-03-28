const App = () => {
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

      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-center text-slate-500">
          Paste your logs to get started. Dev view and CEO view coming soon.
        </p>
      </main>
    </div>
  );
};

export default App;
