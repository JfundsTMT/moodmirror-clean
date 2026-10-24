import React, { useState } from 'react';
import JournalFormUI from './JournalFormUI';
import { fetchReflection } from './GPTService';
import CurrentReflectionPreview from './CurrentReflectionPreview';
import LogsSection from './LogsSection';
import { loadEntries, saveEntries } from '../storage';

const Journal = ({ selectedDate }) => {
  // All *archived* logs, loaded up front so archiving never overwrites saved entries
  const [entries, setEntries] = useState(loadEntries);
  // Current journal reflection/analysis (not yet archived)
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  // Control archive visibility
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Save to localStorage when user confirms archiving a journal
  const archiveCurrentAnalysis = () => {
    if (!currentAnalysis) return;
    const updated = [currentAnalysis, ...entries];
    saveEntries(updated);
    setEntries(updated);
    setCurrentAnalysis(null);
  };

  const deleteEntry = (timestamp, idx) => {
    const updated = entries.filter((e, i) => i !== idx);
    saveEntries(updated);
    setEntries(updated);
  };

  // When user submits form, analyze with GPT and preview below form
  const addNewEntry = async (entry) => {
    setIsLoading(true);
    setError('');
    try {
      const { reflection, growthScore, scoreReason } = await fetchReflection(entry);

      setCurrentAnalysis({
        ...entry,
        timestamp: selectedDate.toISOString(),
        reflection,
        growthScore,
        scoreReason,
      });
    } catch (err) {
      setError('Could not get an AI reflection. Your entry was not lost: please try again.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  return (
    <div className="bg-transparent text-white">

      {/* Journal Entry Form */}
      <section className="max-w-3xl mx-auto px-4">
        <JournalFormUI onSubmit={addNewEntry} disabled={isLoading} date={selectedDate} />
      </section>

      {error && (
        <p role="alert" className="max-w-3xl mx-auto mt-4 text-center text-red-300">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center mt-6" role="status" aria-label="Generating reflection">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-fuchsia-400 border-t-transparent shadow-lg shadow-fuchsia-500/30" />
        </div>
      )}

      {/* Current Reflection Preview (never in past logs until archived) */}
      {currentAnalysis && (
        <CurrentReflectionPreview
          entry={currentAnalysis}
          onArchive={archiveCurrentAnalysis}
        />
      )}

      <LogsSection
        entries={entries}
        showLogs={showLogs}
        toggleLogs={() => setShowLogs((v) => !v)}
        onDelete={deleteEntry}
      />

    </div>
  );
};

export default Journal;
