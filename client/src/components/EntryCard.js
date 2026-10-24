import React from 'react';



// EntryCard component displays a single journal entry, including GPT reflection and growth score
function EntryCard({ title, entry, mood, energy, sleepQuality, gratitude, goalProgress, distractions, timestamp, reflection, growthScore, onDelete }) {
  const formattedDate = new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-gray-800 border-l-4 border-purple-500 p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-cyan-300">{!title || title === 'player' ? 'Daily Reflection' : title}</h3>
        <span className="text-sm text-gray-400">{formattedDate}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300 mb-2">
        <p><span className="font-semibold text-cyan-400">Mood:</span> {mood}/10</p>
        <p><span className="font-semibold text-cyan-400">Energy:</span> {energy}/10</p>
        <p><span className="font-semibold text-cyan-400">Sleep:</span> {sleepQuality}/10</p>
        {gratitude && <p><span className="font-semibold text-cyan-400">Gratitude:</span> {gratitude}</p>}
        {goalProgress && <p><span className="font-semibold text-cyan-400">Goals:</span> {goalProgress}</p>}
        {distractions && <p><span className="font-semibold text-cyan-400">Distractions:</span> {distractions}</p>}
      </div>

      {entry && (
        <div className="mt-4 text-sm text-gray-200">
          <p className="font-semibold text-blue-300 mb-1">Journal Entry:</p>
          <p className="italic whitespace-pre-line">{entry}</p>
        </div>
      )}

      {reflection && (
        <div className="mt-4 text-sm bg-gray-900 border border-blue-600 p-3 rounded shadow-inner">
          <p className="font-semibold text-blue-400 mb-2"> Reflection:</p>
          <div className="whitespace-pre-line text-blue-200">{reflection}</div>
        </div>
      )}

      {growthScore != null && (
        <div className="mt-2 text-sm text-purple-300 font-semibold">
          Growth: {growthScore}/10
        </div>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="mt-3 text-xs text-red-300 hover:text-red-200 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 rounded"
        >
          Delete entry
        </button>
      )}
    </div>
  );
}

export default EntryCard;