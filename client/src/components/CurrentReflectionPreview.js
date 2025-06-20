import React from 'react';
import EntryCard from './EntryCard';

const CurrentReflectionPreview = ({ entry, onArchive }) => {
  return (
    <section className="max-w-3xl mx-auto mt-10 text-center">
      <div className="bg-[#1a0034]/90 border border-indigo-600 p-5 rounded-xl shadow-inner ring-1 ring-indigo-500/30 text-indigo-200">
        <h2 className="text-xl font-bold mb-2 text-indigo-400">🧠 System Insight</h2>
        <EntryCard {...entry} />
        <button
          onClick={onArchive}
          className="mt-4 bg-indigo-700 hover:bg-indigo-600 px-5 py-2 rounded text-white font-semibold shadow-md transition"
        >
          Save to Past Logs
        </button>
      </div>
    </section>
  );
};

export default CurrentReflectionPreview;

