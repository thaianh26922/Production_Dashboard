import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels); // Đăng ký plugin datalabels

const StackedBarChart = ({ selectedDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://back-end-production.onrender.com/api/device-status/543ff470-54c6-11ef-8dd4-b74d24d26b24?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const result = await response.json();
      setData(result.statuses);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.length === 2) {
      const startDate = Math.min(selectedDate[0].valueOf(), selectedDate[1].valueOf());
      const endDate = Math.max(selectedDate[0].valueOf(), selectedDate[1].valueOf());
      fetchData(startDate, endDate);
    }
  }, [selectedDate]);

  const processDataForChart = () => {
    if (data.length === 0) return {};

    const formattedData = data.map(d => ({
      date: moment(d.ts).format('YYYY-MM-DD'),
      status: d.value === '1' ? 'Chạy' : d.value === '0' ? 'Dừng' : 'Tắt máy',
      duration: 1, // Giả sử mỗi trạng thái có thời gian bằng nhau, bạn có thể thay đổi nếu có dữ liệu thời gian cụ thể
    }));

    // Tính tổng thời gian cho mỗi ngày
    const groupedData = {};
    formattedData.forEach(d => {
      if (!groupedData[d.date]) {
        groupedData[d.date] = { Chạy: 0, Dừng: 0, 'Tắt máy': 0 };
      }
      groupedData[d.date][d.status] += d.duration;
    });

    const labels = Object.keys(groupedData);
    const chạyData = labels.map(date => groupedData[date].Chạy);
    const dừngData = labels.map(date => groupedData[date].Dừng);
    const tắtMáyData = labels.map(date => groupedData[date]['Tắt máy']);

    // Tính tổng trạng thái trong ngày và tính phần trăm
    const tổngPhầnTrăm = labels.map(date => {
      const total = chạyData[labels.indexOf(date)] + dừngData[labels.indexOf(date)] + tắtMáyData[labels.indexOf(date)];
      return {
        chạy: (chạyData[labels.indexOf(date)] / total) * 100,
        dừng: (dừngData[labels.indexOf(date)] / total) * 100,
        tắtMáy: (tắtMáyData[labels.indexOf(date)] / total) * 100,
      };
    });

    return {
      labels,
      datasets: [
        {
          label: 'Chạy',
          data: tổngPhầnTrăm.map(d => d.chạy),
          backgroundColor: '#4bc0c0',
          borderWidth: 1,
        },
        {
          label: 'Dừng',
          data: tổngPhầnTrăm.map(d => d.dừng),
          backgroundColor: '#ff6384',
          borderWidth: 1,
        },
        {
          label: 'Tắt máy',
          data: tổngPhầnTrăm.map(d => d.tắtMáy),
          backgroundColor: '#c9cbcf',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = processDataForChart();

  const options = {
    indexAxis: 'y', // Đổi hướng biểu đồ, trục Y là ngày
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
      datalabels: {
        anchor: 'start',
        align: 'right',
        formatter: (value) => `${value.toFixed(2)}%`,
        color: 'white',
        clip: true,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        max: 100, // Trục OX max 100%
        ticks: {
          callback: function (value) {
            return value + '%'; // Hiển thị đơn vị %
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!chartData.labels || chartData.labels.length === 0) return <p>No data available for the selected date range.</p>;

  return <Bar data={chartData} options={options} />;
};

export default StackedBarChart;
