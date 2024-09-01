import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';

function EquipmentPerformance() {
  const doughnutData = {
    labels: ['Achieved', 'Remaining'],
    datasets: [
      {
        data: [67, 33],
        backgroundColor: ['#4A90E2', '#ECEFF1'],
        hoverBackgroundColor: ['#4A90E2', '#ECEFF1'],
      },
    ],
  };

  const barData = {
    labels: ['Machine 1', 'Machine 2', 'Machine 3'],
    datasets: [
      {
        label: 'Performance',
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
        borderWidth: 1,
        data: [80, 85, 90],
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y', // Configures the bar chart to be horizontal
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false, // Ensures the chart adjusts properly
    responsive: true,
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Doughnut charts */}
        <div>
          <Doughnut data={doughnutData} />
          <p className="text-center font-semibold mt-2">Target 1</p>
        </div>
        <div>
          <Doughnut data={doughnutData} />
          <p className="text-center font-semibold mt-2">Target 2</p>
        </div>
        <div>
          <Doughnut data={doughnutData} />
          <p className="text-center font-semibold mt-2">Target 3</p>
        </div>
      </div>

      {/* Horizontal Bar chart */}
      <div className="mt-6 h-64">
        <Bar data={barData} options={barOptions} />
        <p className="text-center font-semibold mt-2">Machine Performance</p>
      </div>
    </div>
  );
}

export default EquipmentPerformance;
