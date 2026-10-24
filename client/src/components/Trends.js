// Trends.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { loadEntries } from '../storage';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);
ChartJS.defaults.color = '#e9d5ff';
ChartJS.defaults.borderColor = 'rgba(192, 132, 252, 0.2)';

const Trends = () => {
  const chartData = useMemo(() => {
    // Stored newest-first: take the 7 most recent, then flip to chronological order
    const recent = loadEntries().slice(0, 7).reverse();
    if (recent.length === 0) return null;

    return {
      labels: recent.map((entry) =>
        new Date(entry.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      ),
      datasets: [
        {
          label: 'Mood',
          data: recent.map((entry) => entry.mood ?? null),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
          tension: 0.4,
        },
        {
          label: 'Energy',
          data: recent.map((entry) => entry.energy ?? null),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgb(54, 162, 235)',
          tension: 0.4,
        },
      ],
    };
  }, []);

  if (!chartData) {
    return (
      <p className="p-4 text-center text-gray-400">
        No saved entries yet. Save a reflection from the journal to see your trends.
      </p>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl mb-4 text-center text-purple-200">Mood & Energy Trends (Last 7 Entries)</h2>
      <Line
        data={chartData}
        options={{
          scales: { y: { min: 0, max: 10, ticks: { stepSize: 1 } } },
        }}
      />
    </div>
  );
};

export default Trends;
