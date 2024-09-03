import React from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';

const MachineStatusHistory = () => {
  
  const data = {
    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
    datasets: [
      {
        label: 'Đang chạy',
        data: [
          { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, 
          { x: 3.5, y: 1 },{ x: 4, y: 1 }, { x: 5, y: 1 } ,{ x: 6, y: 1 }
          
        ],
        backgroundColor: 'green',
        pointRadius: 5,
      },
      {
        label: 'Sửa chữa',
        data: [
          { x: 3, y: 1 }, { x: 3.5, y: 1 },
         
        ],
        backgroundColor: 'yellow',
        pointRadius: 5,
      },
      {
        label: 'Dừng',
        data: [
          { x: 7, y: 1 }, { x: 8, y: 1 },
         
        ],
        backgroundColor: 'red',
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        ticks: {
          callback: (value) => `${value}:00`,
        },
        title: {
          display: false,
          text: 'Giờ trong ngày',
        },
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Giờ: ${tooltipItem.xLabel}:00`,
        },
      },
    },
  };

  return (
    <div className="w-full h-16"> {/* Chỉnh kích thước chiều cao tại đây */}
      <Scatter data={data} options={options} />
    </div>
  );
};

export default MachineStatusHistory;
