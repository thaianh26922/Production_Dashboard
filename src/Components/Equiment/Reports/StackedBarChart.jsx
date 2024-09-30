import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels); // Đăng ký plugin datalabels

const StackedBarChart = () => {
  const data = {
    labels: ['22/09', '21/09', '20/09', '19/09', '18/09', '17/09', '16/09'], // Ngày trên trục OY
    datasets: [
      {
        label: 'Chạy',
        data: [82.76, 81.84, 77.28, 78.33, 50.82, 78.95, 80.50],
        backgroundColor: '#4bc0c0',
        borderWidth: 1,
      },
      {
        label: 'Dừng',
        data: [8.80, 8.46, 10.76, 9.78, 4.36, 10.23, 11.21],
        backgroundColor: '#ff6384',
        borderWidth: 1,
      },
      {
        label: 'Chờ',
        data: [3.70, 4.49, 6.40, 5.94, 2.10, 4.89, 4.61],
        backgroundColor: '#ffcd56',
        borderWidth: 1,
      },
      {
        label: 'Tắt máy',
        data: [4.74, 5.21, 5.57, 5.94, 42.71, 5.87, 3.69],
        backgroundColor: '#c9cbcf',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Đổi hướng biểu đồ, trục Y là ngày
    plugins: {
        legends: {
            display: true,
            postion: 'bottom'
        },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
      datalabels: {
        anchor: 'start', // Đặt vị trí anchor bên trái các stack
        align: 'right', // Căn lề các datalabels về bên trái
        formatter: (value) => `${value}%`, // Hiển thị giá trị với ký hiệu %
        color: 'white', // Màu của datalabels, ở đây là màu trắng
        clip: true,
      },
    },
    responsive: true,
    datasets :{
      display : false,
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        max: 100, // Đặt trục OX max 100%
        ticks: {
          callback: function (value) {
            return value + '%'; // Hiển thị đơn vị phần trăm trên trục X
          },
        },
        grid: {
          display: false, // Ẩn lưới trục OX
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false, // Ẩn lưới trục OY
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default StackedBarChart;
