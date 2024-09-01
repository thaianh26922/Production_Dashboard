import React, { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilter } from 'react-icons/fa'; // Import icon filter từ react-icons
import 'chart.js/auto';
import { addDays, differenceInDays } from 'date-fns'; // Import các hàm từ date-fns

function ProductionChart() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 60)); // Thêm 60 ngày từ ngày hiện tại
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const chartRef = useRef(null);

  // Hàm tạo dữ liệu giả
  const generateFakeData = (start, end) => {
    const daysDifference = differenceInDays(end, start) + 1; // Số ngày giữa start và end
    const labels = [];
    const totalProduction = [];
    const defectProducts = [];

    for (let i = 0; i < daysDifference; i++) {
      const currentDate = addDays(start, i);
      labels.push(currentDate.toLocaleDateString('en-GB')); // Định dạng ngày
      totalProduction.push(Math.floor(Math.random() * 300 + 100)); // Số sản phẩm ngẫu nhiên từ 100 đến 400
      defectProducts.push(Math.floor(Math.random() * 20 + 5)); // Số sản phẩm lỗi ngẫu nhiên từ 5 đến 25
    }

    return {
      labels,
      datasets: [
        {
          label: 'Tổng sản lượng',
          data: totalProduction,
          borderColor: '#4A90E2',
          backgroundColor: '#0ea5e9',
          borderWidth: 1,
          barThickness: 'flex',
        },
        {
          label: 'Sản phẩm lỗi',
          data: defectProducts,
          borderColor: '#E94A4A',
          backgroundColor: '#ea580c',
          borderWidth: 1,
          barThickness: 'flex',
        },
      ],
    };
  };

  const filterDataByDate = () => {
    const newChartData = generateFakeData(startDate, endDate);
    setChartData(newChartData);
    console.log('Lọc dữ liệu từ:', startDate, 'đến', endDate);
  };

  useEffect(() => {
    filterDataByDate();
  }, []);

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#4A90E2',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.3)',
        },
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
        offset: true,
        categoryPercentage: 0.8,
        barPercentage: 0.7,
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="mb-6" style={{ width: '100%', height: '100%' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Phân tích sản lượng</h3>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="py-1 px-2 border rounded text-sm"
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày bắt đầu"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="p-1 border rounded text-sm"
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày kết thúc"
          />
          <button onClick={filterDataByDate} className="p-1 bg-green-500 text-white rounded">
            <FaFilter /> {/* Sử dụng icon filter */}
          </button>
        </div>
      </div>
      <div style={{ width: '100%', height: '100%', minHeight: '300px', maxHeight: '500px' }}>
        <Bar ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default ProductionChart;
