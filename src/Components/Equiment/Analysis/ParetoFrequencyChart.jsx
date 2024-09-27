import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import TitleChart from '../../TitleChart/TitleChart';

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

    // Mảng màu sắc cho mỗi thanh bar
    const barColors = [
      '#410278', '#186e15', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#66FF66', '#FF6666', '#6699FF', '#FFCC99'
    ];

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // Nhãn của các cột
        datasets: [
          {
            label: '', // Ẩn label của các bar
            data: data,
            backgroundColor: barColors, // Mỗi bar có một màu riêng
            borderColor: barColors, // Màu viền của các thanh cũng theo từng màu
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            label: '', // Ẩn label của đường tích lũy
            data: cumulativeData,
            type: 'line',
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 1)',
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false, // Ẩn lưới trục x
            },
          },
          y: {
            beginAtZero: true,
            position: 'left',
            ticks: {
              callback: function (value) {
                return value + ' lần'; // Đơn vị cho cột
              },
            },
            grid: {
              display: false, // Ẩn lưới trục y
            },
            title: {
              display: false,
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
            grid: {
              display: false, // Ẩn lưới trục y1
            },
            title: {
              display: false,
              text: 'Tỷ lệ tích lũy (%)',
            },
          },
        },
        plugins: {
          title: {
            display: false,
            text: 'Tần suất dừng máy (Pareto)',
          },
          legend: {
            display: false, // Ẩn legend
          },
          datalabels: {
            display: false, // Ẩn nhãn dữ liệu
          },
        },
      },
    });

    return () => {
      chart.destroy(); // Cleanup chart on component unmount
    };
  }, [data, labels]);
  const handleFullscreen = () => {
    console.log("Fullscreen triggered");
  };

  const handlePrint = () => {
    console.log("Print triggered");
  };

  return   (
    <div>
      
      <div>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default ParetoFrequencyChart;
