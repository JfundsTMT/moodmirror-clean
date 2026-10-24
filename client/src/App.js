// App.js
import Journal from './components/Journal';
import ShadowCalendar from './components/ShadowCalendar';
import Trends from './components/Trends';
import { useState } from 'react';

const tabClass = (active) =>
  `px-4 py-2 rounded font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
    active ? 'bg-purple-600 text-white' : 'bg-purple-950/60 text-purple-200 hover:bg-purple-800/60'
  }`;

function App() {
  const [showTrends, setShowTrends] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100015] via-[#1b0030] to-[#2c0057] text-white font-mono pb-16">
      <header className="pt-8 text-center">
        <h1 className="text-4xl font-bold text-cyan-400">MoodMirror</h1>
        <p className="mt-1 text-sm text-purple-300">Write it out. See yourself clearly.</p>
      </header>

      <nav aria-label="Views" className="flex justify-center gap-2 mt-6">
        <button className={tabClass(!showTrends)} aria-pressed={!showTrends} onClick={() => setShowTrends(false)}>
          Journal
        </button>
        <button className={tabClass(showTrends)} aria-pressed={showTrends} onClick={() => setShowTrends(true)}>
          Trends
        </button>
      </nav>

      <ShadowCalendar value={selectedDate} onChange={setSelectedDate} />

      <main className="mt-8">
        {showTrends ? <Trends /> : <Journal selectedDate={selectedDate} />}
      </main>
    </div>
  );
}

export default App;
