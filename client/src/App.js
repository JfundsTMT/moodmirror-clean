// App.js
import Journal from './components/Journal';
import ShadowCalendar from './components/ShadowCalendar';
import Trends from './components/Trends';
import { useState } from 'react';

function App() {
  const [showTrends, setShowTrends] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100015] via-[#1b0030] to-[#2c0057] text-white font-mono">
      <ShadowCalendar value={selectedDate} onChange={setSelectedDate} />

      <div className="flex justify-center mt-4">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowTrends(prev => !prev)}
        >
          {showTrends ? 'Back to Journal' : 'View Trends'}
        </button>
      </div>

      {showTrends ? <Trends /> : <Journal selectedDate={selectedDate} />}
    </div>
  );
}

export default App;
