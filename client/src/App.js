// App.js
import { useState } from 'react';
import Today from './components/Today';
import Timeline from './components/Timeline';
import Trends from './components/Trends';
import { loadEntries, saveEntries } from './storage';

const VIEWS = [
  { id: 'today', label: 'Today' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'trends', label: 'Trends' },
];

function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash.slice(1);
    return VIEWS.some((v) => v.id === hash) ? hash : 'today';
  });
  // Saved entries, newest first. Loaded once so saving never overwrites existing logs.
  const [entries, setEntries] = useState(loadEntries);

  const addEntry = (entry) => {
    const updated = [entry, ...entries];
    saveEntries(updated);
    setEntries(updated);
  };

  const deleteEntry = (entry) => {
    const updated = entries.filter((e) => e !== entry);
    saveEntries(updated);
    setEntries(updated);
  };

  return (
    <div className="min-h-screen bg-ink-950 pb-24 text-zinc-200">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => setView('today')} className="flex items-center gap-2 font-serif text-lg text-zinc-50 sm:text-xl">
            <span aria-hidden="true" className="inline-block h-4 w-4 rounded-full border-2 border-accent" />
            MoodMirror
          </button>
          <nav aria-label="Views" className="flex gap-0.5 sm:gap-1">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                aria-current={view === v.id ? 'page' : undefined}
                className={`rounded-lg px-2.5 py-1.5 text-sm transition sm:px-3 ${
                  view === v.id ? 'bg-white/10 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {v.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="pt-10">
        {view === 'today' && <Today onSave={addEntry} onViewTimeline={() => setView('timeline')} />}
        {view === 'timeline' && (
          <Timeline entries={entries} onDelete={deleteEntry} onWrite={() => setView('today')} />
        )}
        {view === 'trends' && <Trends entries={entries} onWrite={() => setView('today')} />}
      </main>
    </div>
  );
}

export default App;
