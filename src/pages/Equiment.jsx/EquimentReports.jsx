import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ErrorRateCharts from '../../Components/Equiment/Reports/ErrorRateCharts';

const EquimentReports = () => {
  const doughnutData = (value) => ({
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#4bc0c0', '#e5e5e5'],
        borderWidth: 0,
      },
    ],
    labels: ['Tỉ lệ', ''],
  });

  const doughnutOptions = {
    cutout: '80%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: true,
        color: 'black',
        formatter: function (value, context) {
          return context.chart.data.datasets[0].data[0] + '%';
        },
        font: {
          size: 14, 
          weight: 'bold',
        },
      },
    },
    maintainAspectRatio: false, 
  };

  return (
    <div className="">
     
      < ErrorRateCharts/>
       
       
    </div>
  );
};

export default EquimentReports;
