import React from 'react';
import { Bar } from 'react-chartjs-2';

const RepairBarChart = ({ data }) => {
  const barChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true, // Enable stacked bars for the x-axis
      },
      y: {
        beginAtZero: true,
        stacked: true, // Enable stacked bars for the y-axis
        ticks: {
          callback: function(value) {
            return value + ' min'; // Display unit 'min' on the y-axis
          },
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,  // Disable datalabels here
      },
      legend: {
        display: true, // You can enable/disable based on your preference
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={barChartOptions} />
    </div>
  );
};

export default RepairBarChart;
