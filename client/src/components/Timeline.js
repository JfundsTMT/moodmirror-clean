import React from 'react';
import { sortNewestFirst } from '../storage';

const monthLabel = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

const dayLabel = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

const Chip = ({ label, value, color }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    {label} {value}
  </span>
);

function Detail({ label, children }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-zinc-300">{children}</dd>
    </div>
  );
}

function EntryRow({ entry, onDelete }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/[0.03] open:bg-white/[0.05]">
      <summary className="cursor-pointer p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100">{dayLabel(entry.timestamp)}</p>
            <p className="mt-1 line-clamp-2 font-serif text-base text-zinc-400 group-open:hidden">{entry.entry}</p>
          </div>
          {entry.growthScore != null && (
            <span
              className="shrink-0 rounded-full border border-accent/40 px-2.5 py-1 text-xs font-medium text-accent"
              title={entry.scoreReason || 'Growth score'}
            >
              Growth {entry.growthScore}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip label="Mood" value={entry.mood} color="#e8b86d" />
          <Chip label="Energy" value={entry.energy} color="#7dd3fc" />
          <Chip label="Sleep" value={entry.sleepQuality} color="#a1a1aa" />
        </div>
      </summary>

      <div className="space-y-5 border-t border-white/10 p-4 sm:p-5">
        <p className="whitespace-pre-line font-serif text-base leading-relaxed text-zinc-300">{entry.entry}</p>

        <dl className="grid gap-4 sm:grid-cols-3">
          <Detail label="Goals">{entry.goalProgress}</Detail>
          <Detail label="Grateful for">{entry.gratitude}</Detail>
          <Detail label="Distraction">{entry.distractions}</Detail>
        </dl>

        {entry.reflection && (
          <div className="rounded-xl bg-ink-950/60 p-4">
            <p className="text-xs uppercase tracking-widest text-accent">Reflection</p>
            <div className="mt-2 space-y-3 font-serif text-base leading-relaxed text-zinc-300">
              {entry.reflection.split(/\n{2,}/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {entry.scoreReason && <p className="mt-3 text-xs text-zinc-500">{entry.scoreReason}</p>}
          </div>
        )}

        <button
          onClick={onDelete}
          className="text-xs text-red-300/80 underline underline-offset-4 hover:text-red-200"
        >
          Delete entry
        </button>
      </div>
    </details>
  );
}

export default function Timeline({ entries, onDelete, onWrite }) {
  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-zinc-50">Your timeline</h1>
        <p className="mt-3 text-sm text-zinc-400">Nothing here yet. Your saved reflections will gather here.</p>
        <button
          onClick={onWrite}
          className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-accent-soft"
        >
          Write your first entry
        </button>
      </div>
    );
  }

  const sorted = sortNewestFirst(entries);
  const groups = [];
  sorted.forEach((entry) => {
    const label = monthLabel(entry.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(entry);
    else groups.push({ label, items: [entry] });
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <h1 className="font-serif text-3xl text-zinc-50 sm:text-4xl">Your timeline</h1>
      <p className="mt-1 text-sm text-zinc-400">
        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
      </p>

      {groups.map((g) => (
        <section key={g.label} className="mt-8" aria-label={g.label}>
          <h2 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">{g.label}</h2>
          <div className="space-y-3">
            {g.items.map((entry) => (
              <EntryRow
                key={`${entry.timestamp}-${entry.entry.slice(0, 20)}`}
                entry={entry}
                onDelete={() => {
                  if (window.confirm('Delete this entry? This cannot be undone.')) onDelete(entry);
                }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
