import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ShadowCalendar = ({ value, onChange }) => {
  return (
    <div className="fixed top-24 right-6 z-40 w-64 bg-[#1b002c] border border-purple-700 p-4 rounded-xl shadow-lg ring-1 ring-purple-500/20">
      <h2 className="text-lg font-bold text-purple-300 text-center mb-2">🗓️  Calendar</h2>
      <Calendar
  onChange={onChange}
  value={value}
  className="!bg-transparent !text-white !border-none"
  prevLabel="←"
  nextLabel="→"
  formatShortWeekday={(locale, date) =>
    date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 1)
  }
  navigationLabel={({ label }) => (
    <span className="text-purple-400 font-semibold text-sm">{label}</span>
  )}
  tileClassName={({ date, view }) =>
    view === 'month'
      ? 'text-sm hover:bg-purple-600/30 rounded-lg transition text-center'
      : undefined
  }
  tileContent={({ date, view }) =>
    view === 'month' && date.toDateString() === new Date().toDateString() ? (
      <div className="text-cyan-400 font-bold text-[10px] text-center">Today</div>
    ) : null
  }
/>

    </div>
  );
};

export default ShadowCalendar;
