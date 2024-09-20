import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';

// Đăng ký các thành phần cần thiết trong Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartDataLabels);

const ChartSection = ({ downtimeData, errorData, errorTimeData }) => {
  // Cấu hình dữ liệu cho biểu đồ Donut
  const downtimeChartData = {
    labels: ['Bảo Trì Máy', 'Bảo Trì Khuôn', 'Thiếu Vật Tư', 'Thiếu Nhân Lực', 'Thiết Bị Hỏng', 'Đào Tạo'],
    datasets: [
      {
        data: [10, 15, 7, 5, 20, 12],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverOffset: 4,
      },
    ],
  };

  const downtimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Tắt chú thích bên ngoài
      },
      datalabels: {
        color: '#fff', // Màu chữ
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}\n${value}%`; // Hiển thị nhãn và giá trị bên trong Donut
        },
        font: {
          size: 10, // Kích thước chữ
        },
        align: 'center', // Căn giữa nhãn trong Donut
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = downtimeChartData.labels[tooltipItem.dataIndex];
            const currentValue = downtimeChartData.datasets[0].data[tooltipItem.dataIndex];
            const total = downtimeChartData.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((currentValue / total) * 100).toFixed(2);

            return `${label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Dữ liệu mẫu cho biểu đồ Pareto (Số Lần Xảy Ra Lỗi)
  const errorOccurrenceLabels = ['Kiểm Tra Chất Lượng', 'Ăn Phụ', 'Thiếu Vật Tư', 'Bảo Trì Máy', 'Thay Khuôn'];
  const errorOccurrenceData = [3, 7, 2, 5, 4];

  // Sắp xếp dữ liệu từ lớn đến nhỏ
  const sortedData = [...errorOccurrenceData].sort((a, b) => b - a);

  // Tính tổng để tính phần trăm tích lũy
  const totalErrorOccurrence = sortedData.reduce((a, b) => a + b, 0);

  // Tính phần trăm tích lũy
  const cumulativePercentages = sortedData.map((value, index) => {
    const cumulativeSum = sortedData.slice(0, index + 1).reduce((a, b) => a + b, 0);
    return (cumulativeSum / totalErrorOccurrence) * 100;
  });

  // Cấu hình dữ liệu cho biểu đồ Pareto
  const paretoChartData = {
    labels: errorOccurrenceLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Số Lần Xảy Ra Lỗi',
        data: sortedData,
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Tỷ Lệ Tích Lũy (%)',
        data: cumulativePercentages,
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  const paretoOptions = {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: false,
          text: 'Số Lần Xảy Ra Lỗi',
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        ticks: {
          beginAtZero: true,
          max: 100,
        },
        title: {
          display: false   ,
          text: 'Tỷ Lệ Tích Lũy (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        display: false,  // Tắt datalabels cho biểu đồ Bar này
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            if (tooltipItem.dataset.type === 'line') {
              return `Tỷ Lệ Tích Lũy: ${tooltipItem.raw.toFixed(2)}%`;
            }
            return `Số Lần Xảy Ra Lỗi: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  // Cấu hình dữ liệu cho biểu đồ Bar (Thời Gian Xảy Ra Lỗi)
  const errorTimeChartData = {
    labels: ['Bảo Trì Máy', 'Kiểm Tra Chất Lượng', 'Thiết Bị Hỏng', 'Thiếu Vật Tư'],
    datasets: [
      {
        label: 'Thời Gian Xảy Ra Lỗi (giây)',
        data: [6000, 4000, 8000, 2000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const errorTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,  // Tắt datalabels cho biểu đồ Bar này
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataIndex = tooltipItem.dataIndex;
            const dataset = tooltipItem.dataset;
            const currentValue = dataset.data[dataIndex];
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((currentValue / total) * 100).toFixed(2);

            return `${dataset.label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="grid grid-cols-5 gap-2 mb-2">
      {/* Biểu đồ Donut (Phân Bố Tỷ Lệ DownTime) */}
      <div className="bg-white col-span-1 p-4 rounded-lg shadow">
        <h3 className="text-left text-sm font-semibold mb-2">Phân Bố Tỷ Lệ DownTime</h3>
        <Doughnut data={downtimeChartData} options={downtimeOptions} />
      </div>

      {/* Biểu đồ Pareto (Số Lần Xảy Ra Lỗi) */}
      <div className="bg-white p-4 col-span-2 rounded-lg shadow">
        <h3 className="text-left text-sm  font-semibold mb-2">Số Lần Xảy Ra Lỗi </h3>
        <Bar data={paretoChartData} options={paretoOptions} />
      </div>

      {/* Biểu đồ Thời Gian Xảy Ra Lỗi */}
      <div className="bg-white p-4 col-span-2 rounded-lg shadow">
        <h3 className="text-left text-sm font-semibold mb-2">Thời Gian Xảy Ra Lỗi</h3>
        <Bar data={errorTimeChartData} options={errorTimeOptions} />
      </div>
    </div>
  );
};

export default ChartSection;
