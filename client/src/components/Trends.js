import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { sortNewestFirst } from '../storage';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);
ChartJS.defaults.color = '#a1a1aa';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
ChartJS.defaults.font.family = 'Inter, ui-sans-serif, system-ui, sans-serif';

const RANGES = [
  { id: '7', label: '7 days', days: 7 },
  { id: '30', label: '30 days', days: 30 },
  { id: 'all', label: 'All time', days: null },
];

const average = (list) => {
  const nums = list.filter((n) => typeof n === 'number');
  return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : '–';
};

const Stat = ({ label, value, color }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
      {label}
    </p>
    <p className="mt-2 font-serif text-3xl text-zinc-50 tabular-nums">{value}</p>
  </div>
);

const Trends = ({ entries, onWrite }) => {
  const [range, setRange] = useState('7');

  const recent = useMemo(() => {
    const { days } = RANGES.find((r) => r.id === range);
    const cutoff = days ? Date.now() - days * 86400000 : 0;
    // chronological order for the chart
    return sortNewestFirst(entries)
      .filter((e) => new Date(e.timestamp).getTime() >= cutoff)
      .reverse();
  }, [entries, range]);

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-zinc-50">Trends</h1>
        <p className="mt-3 text-sm text-zinc-400">
          No saved entries yet. Save a reflection and your mood, energy and growth will show up here.
        </p>
        <button
          onClick={onWrite}
          className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-accent-soft"
        >
          Write an entry
        </button>
      </div>
    );
  }

  const series = (key, color, extra = {}) => ({
    label: key[0].toUpperCase() + key.slice(1),
    data: recent.map((e) => (e[key === 'growth' ? 'growthScore' : key] ?? null)),
    borderColor: color,
    backgroundColor: color,
    tension: 0.35,
    pointRadius: 3,
    spanGaps: true,
    ...extra,
  });

  const data = {
    labels: recent.map((e) =>
      new Date(e.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    ),
    datasets: [series('mood', '#e8b86d'), series('energy', '#7dd3fc'), series('growth', '#86efac')],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl text-zinc-50 sm:text-4xl">Trends</h1>
        <div role="group" aria-label="Date range" className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              aria-pressed={range === r.id}
              onClick={() => setRange(r.id)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                range === r.id ? 'bg-white/10 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Entries" value={recent.length} />
        <Stat label="Avg mood" value={average(recent.map((e) => e.mood))} color="#e8b86d" />
        <Stat label="Avg energy" value={average(recent.map((e) => e.energy))} color="#7dd3fc" />
        <Stat label="Avg growth" value={average(recent.map((e) => e.growthScore))} color="#86efac" />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        {recent.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-400">No entries in this period.</p>
        ) : (
          <Line
            data={data}
            options={{
              interaction: { mode: 'index', intersect: false },
              plugins: { legend: { labels: { usePointStyle: true, pointStyleWidth: 8, boxHeight: 8 } } },
              scales: { y: { min: 0, max: 10, ticks: { stepSize: 2 } }, x: { grid: { display: false } } },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Trends;
