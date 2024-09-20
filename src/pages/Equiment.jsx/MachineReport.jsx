import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import MachineTabs from '../../Components/Equiment/Analysis/MachineTabs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, ChartDataLabels);

const MachineReport = () => {
  const [currentMachine, setCurrentMachine] = useState('Tham Số Máy Cắt');

  // Cấu hình chung để tắt datalabels và đặt legend dưới trục Ox
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Đặt legend dưới trục Ox
      },
      datalabels: {
        display: false, // Tắt datalabels
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Dữ liệu mẫu cho các biểu đồ
  const chartData = {
    labels: ['Aug 24', 'Aug 27', 'Aug 30', 'Sep 02', 'Sep 05', 'Sep 08', 'Sep 11', 'Sep 14', 'Sep 17', 'Sep 20'],
    datasets: [
      {
        label: 'OEE',
        data: [80, 85, 83, 82, 81, 84, 79, 82, 83, 79],
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Availability',
        data: [90, 92, 91, 89, 88, 89, 90, 88, 89, 88],
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Performance',
        data: [88, 89, 90, 87, 86, 85, 86, 87, 88, 89],
        borderColor: 'orange',
        fill: false,
      },
    ],
  };

  const productionData = {
    labels: ['Aug 24', 'Aug 27', 'Aug 30', 'Sep 02', 'Sep 05', 'Sep 08', 'Sep 11', 'Sep 14', 'Sep 17', 'Sep 20'],
    datasets: [
      {
        label: 'Sản Lượng',
        data: [60, 80, 90, 100, 70, 92, 85, 87, 91, 92],
        backgroundColor: 'purple',
      },
    ],
  };

  const energyData = {
    labels: ['Aug 24', 'Aug 27', 'Aug 30', 'Sep 02', 'Sep 05', 'Sep 08', 'Sep 11', 'Sep 14', 'Sep 17', 'Sep 20'],
    datasets: [
      {
        label: 'Điện Năng',
        data: [757, 800, 820, 900, 750, 1000, 950, 1100, 1050, 1156],
        backgroundColor: 'green',
      },
    ],
  };

  const runtimeData = {
    labels: ['Aug 24', 'Aug 27', 'Aug 30', 'Sep 02', 'Sep 05', 'Sep 08', 'Sep 11', 'Sep 14', 'Sep 17', 'Sep 20'],
    datasets: [
      {
        label: 'Run Time',
        data: [18, 20, 19, 18, 20, 19, 18, 19, 18, 20],
        backgroundColor: 'green',
      },
      {
        label: 'Idle Time',
        data: [2, 3, 2, 2, 1, 2, 3, 2, 2, 1],
        backgroundColor: 'yellow',
      },
    ],
  };

  const tableData = [
    { timestamp: '2024-09-20 03:39:18', sanLuong: '60 pcs', dienNang: '757.00 kWh', thoiGianMayChay: '20 giờ 29 phút 15 giây' },
    { timestamp: '2024-09-19 03:39:18', sanLuong: '92 pcs', dienNang: '1156.00 kWh', thoiGianMayChay: '19 giờ 16 phút 24 giây' },
    { timestamp: '2024-09-18 03:39:18', sanLuong: '99 pcs', dienNang: '1242.00 kWh', thoiGianMayChay: '18 giờ 28 phút 14 giây' },
  ];

  return (
    <div className="p-2 space-y-4">
      {/* Hàng 1: Tabs máy */}
      <div className="grid grid-cols-3 gap-2">
        <MachineTabs currentMachine={currentMachine} setCurrentMachine={setCurrentMachine} />
      </div>

      {/* Hàng 2: Ba biểu đồ */}
      <div className="grid grid-cols-3 gap-2">
        {/* Biểu đồ 1: Xu Hướng Hiệu Suất OEE */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Xu Hướng Hiệu Suất OEE</h3>
          <Line data={chartData} options={commonOptions} />
        </div>

        {/* Biểu đồ 2: Biểu Đồ Sản Lượng */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Biểu Đồ Sản Lượng</h3>
          <Bar data={productionData} options={commonOptions} />
        </div>

        {/* Biểu đồ 3: Biểu Đồ Năng Lượng */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Biểu Đồ Năng Lượng</h3>
          <Bar data={energyData} options={commonOptions} />
        </div>
      </div>

      {/* Hàng 3: 1 Biểu đồ + Bảng */}
      <div className="grid grid-cols-5 gap-2">
        {/* Biểu đồ 4: Biểu Đồ Tổng Thời Gian */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Biểu Đồ Tổng Thời Gian</h3>
          <Bar data={runtimeData} options={commonOptions} />
        </div>

        {/* Bảng Thống Kê */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-2">Thống Kê</h3>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Timestamp</th>
                <th className="p-2">Sản Lượng</th>
                <th className="p-2">Điện Năng</th>
                <th className="p-2">Thời Gian Máy Chạy</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{row.timestamp}</td>
                  <td className="p-2">{row.sanLuong}</td>
                  <td className="p-2">{row.dienNang}</td>
                  <td className="p-2">{row.thoiGianMayChay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MachineReport;
