import React, { useState } from 'react';
import { fetchReflection } from './GPTService';
import DatePicker from './DatePicker';
import Scale from './Scale';
import ScoreRing from './ScoreRing';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const inputClass =
  'mt-1 w-full rounded-lg border border-white/10 bg-ink-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-accent/60';

function ReflectionCard({ result, onSave, onDiscard }) {
  return (
    <section
      aria-label="Your reflection"
      className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Reflection</p>
          <h2 className="mt-1 font-serif text-2xl text-zinc-100">Here is what I noticed</h2>
        </div>
        {result.growthScore != null && (
          <div className="flex items-center gap-3 text-right">
            <div className="hidden max-w-[14rem] text-xs text-zinc-400 sm:block">
              <span className="block text-zinc-300">Growth score</span>
              {result.scoreReason}
            </div>
            <ScoreRing score={result.growthScore} />
          </div>
        )}
      </div>

      {result.growthScore != null && result.scoreReason && (
        <p className="mt-3 text-xs text-zinc-400 sm:hidden">{result.scoreReason}</p>
      )}

      <div className="mt-5 space-y-4 font-serif text-lg leading-relaxed text-zinc-200">
        {result.reflection.split(/\n{2,}/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={onSave}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-accent-soft"
        >
          Save to timeline
        </button>
        <button
          onClick={onDiscard}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-zinc-300 hover:bg-white/10"
        >
          Discard
        </button>
      </div>
    </section>
  );
}

export default function Today({ onSave, onViewTimeline }) {
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState('');
  const [goals, setGoals] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [distraction, setDistraction] = useState('');
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading || !text.trim()) return;

    const entry = {
      title: 'Daily Reflection',
      entry: text,
      mood,
      energy,
      sleepQuality,
      gratitude,
      goalProgress: goals,
      distractions: distraction,
    };

    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const { reflection, growthScore, scoreReason } = await fetchReflection(entry);
      setResult({ ...entry, timestamp: date.toISOString(), reflection, growthScore, scoreReason });
      // Only clear the form once the reflection has arrived, so a failure never loses the writing.
      setText('');
      setGoals('');
      setGratitude('');
      setDistraction('');
      setMood(5);
      setEnergy(5);
      setSleepQuality(5);
    } catch (err) {
      console.error(err);
      setError('Could not get a reflection just now. Your writing is still here, so please try again.');
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    onSave(result);
    setResult(null);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">{greeting()}</p>
          <h1 className="font-serif text-3xl text-zinc-50 sm:text-4xl">How was your day?</h1>
        </div>
        <DatePicker value={date} onChange={setDate} />
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          <textarea
            aria-label="Journal entry"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write freely. Nobody is reading this but you."
            className="min-h-[20rem] w-full resize-y rounded-xl bg-transparent p-5 font-serif text-lg leading-relaxed text-zinc-100 placeholder-zinc-600 focus:outline-none"
          />
        </div>

        <aside className="space-y-6">
          <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Scale id="mood" label="Mood" value={mood} onChange={setMood} low="Low" high="Great" />
            <Scale id="energy" label="Energy" value={energy} onChange={setEnergy} low="Drained" high="Charged" />
            <Scale id="sleep" label="Sleep" value={sleepQuality} onChange={setSleepQuality} low="Poor" high="Restful" />
          </div>

          <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <summary className="flex cursor-pointer items-center justify-between text-sm text-zinc-300">
              Add context
              <span className="text-xs text-zinc-500 group-open:hidden">optional</span>
              <span className="hidden text-xs text-zinc-500 group-open:inline">hide</span>
            </summary>
            <div className="mt-4 space-y-4">
              <label className="block text-xs text-zinc-400">
                Goals, short and long term
                <input value={goals} onChange={(e) => setGoals(e.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs text-zinc-400">
                What are you grateful for?
                <input value={gratitude} onChange={(e) => setGratitude(e.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs text-zinc-400">
                Biggest distraction
                <input value={distraction} onChange={(e) => setDistraction(e.target.value)} className={inputClass} />
              </label>
            </div>
          </details>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-ink-950 transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Reflecting…' : 'Get my reflection'}
          </button>
        </aside>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-8 flex justify-center" role="status" aria-label="Generating reflection">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}

      {result && <ReflectionCard result={result} onSave={save} onDiscard={() => setResult(null)} />}

      {saved && (
        <p role="status" className="mt-6 text-sm text-zinc-400">
          Saved.{' '}
          <button onClick={onViewTimeline} className="text-accent underline underline-offset-4 hover:text-accent-soft">
            View your timeline
          </button>
        </p>
      )}
    </div>
  );
}
