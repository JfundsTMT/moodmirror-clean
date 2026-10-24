import React from 'react';

export default function ScoreRing({ score, size = 72 }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 10);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Growth score ${score} out of 10`}
    >
      <svg viewBox="0 0 64 64" className="-rotate-90" width={size} height={size}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#e8b86d"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-xl text-zinc-100 tabular-nums">
        {score}
      </span>
    </div>
  );
}
