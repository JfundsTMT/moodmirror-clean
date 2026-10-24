import React from 'react';

export default function Scale({ id, label, value, onChange, low, high }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm text-zinc-300">
          {label}
        </label>
        <span className="font-serif text-2xl text-accent tabular-nums">
          {value}
          <span className="text-sm text-zinc-500">/10</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer accent-accent"
      />
      <div className="mt-1 flex justify-between text-xs text-zinc-500">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}
