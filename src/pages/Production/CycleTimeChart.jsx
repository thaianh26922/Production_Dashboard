import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const cycleTimeData = {
  labels: ['Chuẩn bị nguyên liệu', 'Trộn và nhồi bột', 'Định hình bánh', 'Nướng bánh', 'Làm mát và đóng gói'],
  datasets: [
    {
      label: 'Line 1',
      data: [60, 45, 30, 60, 40],  // Dữ liệu cycle time của Line 1
      backgroundColor: 'rgba(75, 192, 192, 1)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Line 2',
      data: [55, 50, 32, 58, 42],  // Dữ liệu cycle time của Line 2
      backgroundColor: 'rgba(54, 162, 235, 1)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
    {
      label: 'Line 3',
      data: [62, 48, 29, 65, 39],  // Dữ liệu cycle time của Line 3
      backgroundColor: 'rgba(255, 206, 86, 1)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,  // Biểu đồ sẽ tự động điều chỉnh kích thước
  maintainAspectRatio: false,  // Không giữ tỉ lệ mặc định để phù hợp với kích thước vùng chứa
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Thời gian (phút)',
      },
    },
    x: {
      title: {
        display: false,
        text: 'Công đoạn sản xuất',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.dataset.label}: ${tooltipItem.raw} phút`;
        },
      },
    },
  },
};

const CycleTimeChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '100%' }}>
      <h3 className="text-lg font-semibold mb-4">Cycle Time theo Line sản xuất</h3>
      <div style={{ height: '100%', minHeight: '300px' }}>
        <Bar data={cycleTimeData} options={chartOptions} />
      </div>
    </div>
  );
}

export default CycleTimeChart;
