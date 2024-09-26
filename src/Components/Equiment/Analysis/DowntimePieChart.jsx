import plugin from 'chartjs-plugin-datalabels';
import React from 'react';
import { Pie } from 'react-chartjs-2';

const DowntimePieChart = ({ data }) => {
  const chartData = {
    
    labels: data.labels,
    plugins : {
        
        datalabels: {
          display: false,  
        },
      },
    datasets: [
      {
        label: 'Phân bố Downtime',
        data: data.values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div>
      <h3>Phân bố Downtime</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default DowntimePieChart;
