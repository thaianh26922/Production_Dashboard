import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ParetoFrequencyChart = ({ data, labels }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Tính toán phần trăm tích lũy (cumulative percentage)
    let total = data.reduce((acc, value) => acc + value, 0);
    let cumulativeData = data.map((value, index) => {
      let cumulativeSum = data.slice(0, index + 1).reduce((acc, val) => acc + val, 0);
      return (cumulativeSum / total) * 100;
    });

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // Nhãn của các cột
        datasets: [
          {
            label: 'Số lần dừng máy',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            label: 'Tỷ lệ tích lũy (%)',
            data: cumulativeData,
            type: 'line',
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            position: 'left',
            ticks: {
              callback: function (value) {
                return value + ' lần'; // Đơn vị cho cột
              },
            },
            title: {
              display: true,
              text: 'Số lần dừng máy',
            },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            ticks: {
              callback: function (value) {
                return value + '%'; // Thêm ký hiệu "%" cho đường tích lũy
              },
            },
            title: {
              display: true,
              text: 'Tỷ lệ tích lũy (%)',
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Tần suất dừng máy (Pareto)',
          },
          datalabels: {
            display: false,  
          },
        },
      },
    });

    return () => {
      chart.destroy(); // Cleanup chart on component unmount
    };
  }, [data, labels]);

  return <canvas ref={chartRef} />;
};

export default ParetoFrequencyChart;
