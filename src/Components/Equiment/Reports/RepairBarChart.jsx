import React from 'react';
import { Bar } from 'react-chartjs-2';

const RepairBarChart = ({ data }) => {
  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value ; // Hiển thị đơn vị phút trên trục y
          },
        },
      },
    },
    plugins: {
        datalabels: {
          display: false,  // Disable datalabels here
        },
        legend: {
          display: false,
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
