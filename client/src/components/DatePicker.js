import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.css'; // after the library CSS so the dark overrides win

const addDays = (d, n) => {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
};
const isToday = (d) => d.toDateString() === new Date().toDateString();

const arrowClass =
  'flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent';

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const label = isToday(value)
    ? 'Today'
    : value.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div ref={ref} className="relative flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
      <button type="button" className={arrowClass} aria-label="Previous day" onClick={() => onChange(addDays(value, -1))}>
        ←
      </button>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="min-w-[7rem] rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-100 hover:bg-white/10"
      >
        {label}
      </button>
      <button
        type="button"
        className={arrowClass}
        aria-label="Next day"
        disabled={isToday(value)}
        onClick={() => onChange(addDays(value, 1))}
      >
        →
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className="absolute left-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] sm:left-auto sm:right-0 rounded-2xl border border-white/10 bg-ink-900 p-3 shadow-2xl"
        >
          <Calendar
            value={value}
            maxDate={new Date()}
            onChange={(d) => {
              onChange(d);
              setOpen(false);
            }}
            prevLabel="‹"
            nextLabel="›"
            prev2Label={null}
            next2Label={null}
            formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 1)}
          />
        </div>
      )}
    </div>
  );
}
