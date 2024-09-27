import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';


const DowntimePieChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '',
        data: data.values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#ed0905'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#ed0905'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    
    plugins: {
    
      datalabels: {
        display: false,  // Disable datalabels here
      },
    },
  };

  return (
    <div>
     
          <div ><Pie data={chartData} options={chartOptions} /> </div>
    
    </div>
  );
};

export default DowntimePieChart;
