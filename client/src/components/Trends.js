// Trends.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Trends = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const recent = entries.slice(-7); // last 7 entries
    const labels = recent.map((entry, idx) => `Entry ${idx + 1}`);
    const moodData = recent.map(entry => entry.mood || 0);
    const energyData = recent.map(entry => entry.energy || 0);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Mood',
          data: moodData,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.4,
        },
        {
          label: 'Energy',
          data: energyData,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.4,
        },
      ],
    });
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Mood & Energy Trends (Last 7 Entries)</h2>
      <Line data={chartData} />
    </div>
  );
};

export default Trends;
