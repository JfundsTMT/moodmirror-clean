// components/JournalFormUI.js
import React, { useState } from 'react';

export default function JournalFormUI({ onSubmit, name = 'player', avatarUrl }) {
  const [journalText, setJournalText] = useState('');
  const [goals, setGoals] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [distraction, setDistraction] = useState('');
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: name,
      entry: journalText,
      mood,
      energy,
      sleepQuality,
      gratitude,
      goalProgress: goals,
      distractions: distraction,
    

    });
    setJournalText('');
    setGoals('');
    setGratitude('');
    setDistraction('');
    setMood(5);
    setEnergy(5);
    setSleepQuality(5);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#170022]/80 backdrop-blur-md border border-fuchsia-700 p-6 rounded-xl shadow-lg ring-1 ring-fuchsia-500/40 space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-fuchsia-400">{name}</h2>
        <span className="text-sm text-gray-400">{new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="text-fuchsia-300 text-sm">
          What are your long-term and short-term goals?
          <input
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Enter goals here"
            className="mt-1 w-full p-2 bg-gray-800 border border-fuchsia-700 rounded focus:ring-2 focus:ring-fuchsia-500"
          />
        </label>
        <label className="text-fuchsia-300 text-sm">
          What are you happy about?
          <input
            type="text"
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="Enter gratitude here"
            className="mt-1 w-full p-2 bg-gray-800 border border-fuchsia-700 rounded focus:ring-2 focus:ring-fuchsia-500"
          />
        </label>
        <label className="text-fuchsia-300 text-sm">
          What would you say your biggest distraction is and was?
          <input
            type="text"
            value={distraction}
            onChange={(e) => setDistraction(e.target.value)}
            placeholder="Enter distractions here"
            className="mt-1 w-full p-2 bg-gray-800 border border-fuchsia-700 rounded focus:ring-2 focus:ring-fuchsia-500"
          />
        </label>
      </div>

      <textarea
        className="w-full h-40 p-3 bg-gray-800 border border-fuchsia-600 rounded text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-fuchsia-500"
        placeholder="Write your journal entry..."
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
        <div>
          <label className="block mb-1">Mood: {mood}/10</label>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full accent-fuchsia-500"
          />
        </div>
        <div>
          <label className="block mb-1">Energy: {energy}/10</label>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-fuchsia-500"
          />
        </div>
        <div>
          <label className="block mb-1">Sleep Quality: {sleepQuality}/10</label>
          <input
            type="range"
            min="1"
            max="10"
            value={sleepQuality}
            onChange={(e) => setSleepQuality(Number(e.target.value))}
            className="w-full accent-fuchsia-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 text-lg font-semibold text-gray-900 bg-fuchsia-400 rounded hover:bg-fuchsia-500 transition"
      >
        Submit
      </button>
    </form>
  );
}
