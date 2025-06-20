import React, { useState, useEffect } from 'react';
import JournalFormUI from './JournalFormUI';
import { fetchReflection } from './GPTService';
import { buildPromptFromEntry } from './promptBuilder';
import CurrentReflectionPreview from './CurrentReflectionPreview';
import LogsSection from './LogsSection';
import ShadowCalendar from './ShadowCalendar';



const LOCAL_KEY = 'journalEntries';

const Journal = () => {
  // All *archived* logs
  const [entries, setEntries] = useState([]);
  // Current journal reflection/analysis (not yet archived)
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  // Control archive visibility
  const [showLogs, setShowLogs] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  <ShadowCalendar value={selectedDate} onChange={setSelectedDate} />




  // Always load logs from localStorage on showLogs toggle or mount
  useEffect(() => {
    if (showLogs) {
      const saved = localStorage.getItem(LOCAL_KEY);
      setEntries(saved ? JSON.parse(saved) : []);
    }
  }, [showLogs]);

  // Save to localStorage when user confirms archiving a journal
  const archiveCurrentAnalysis = () => {
    if (!currentAnalysis) return;
    const updated = [currentAnalysis, ...entries];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    setEntries(updated);
    setCurrentAnalysis(null);
  };

  // When user submits form, analyze with GPT and preview below form
  const addNewEntry = async (entry) => {
  setIsLoading(true);
  try {
    const prompt = buildPromptFromEntry(entry);
    const { reflection, growthScore } = await fetchReflection(prompt);

    setCurrentAnalysis({
      ...entry,
      timestamp: selectedDate.toISOString(),
      reflection,
      growthScore,
    });
  } catch (err) {
    alert('Could not get AI reflection. Try again.');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-transparent text-white">

      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-10">MoodMirror</h1>

      {/* Journal Entry Form */}
      <section className="max-w-3xl mx-auto bg-gray-900 border border-cyan-700 p-6 rounded-xl shadow-lg ring-1 ring-cyan-500/30">
      <JournalFormUI onSubmit={addNewEntry} />
      </section>

{isLoading && (
  <div className="flex justify-center mt-6">
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
/>

    </div>
  );
};

export default Journal;
