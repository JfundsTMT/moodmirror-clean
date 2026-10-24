import React from 'react';
import EntryCard from './EntryCard';

const LogsSection = ({ entries, showLogs, toggleLogs, onDelete }) => {
  return (
    <section className="max-w-4xl mx-auto mt-10 px-4 text-center">
      <button
        onClick={toggleLogs}
        aria-expanded={showLogs}
        className="bg-cyan-700 hover:bg-cyan-600 text-white px-6 py-2 rounded transition"
      >
        {showLogs ? 'Hide Past Logs 📜' : 'Show Past Logs 📜'}
      </button>

      {showLogs && (
        <div className="mt-6 space-y-4 overflow-y-auto max-h-[500px] px-2 text-left">
          {entries.length === 0 ? (
            <div className="text-gray-500 italic">No past logs yet.</div>
          ) : (
            entries.map((entry, idx) => (
              <EntryCard
                key={`${entry.timestamp}-${idx}`}
                {...entry}
                onDelete={() => {
                  if (window.confirm('Delete this entry? This cannot be undone.')) onDelete(entry.timestamp, idx);
                }}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default LogsSection;

