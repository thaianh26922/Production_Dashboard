import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import TitleChart from '../../TitleChart/TitleChart'; // Giả định bạn đã có sẵn thành phần này

const ParetoTimeChart = ({ data, labels }) => {
  const chartRef = useRef(null); // Sử dụng ref để truy cập canvas

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Kiểm tra dữ liệu đầu vào
    if (!data || !labels || data.length === 0 || labels.length === 0) {
      console.error("Dữ liệu hoặc nhãn trống");
      return;
    }

    // Tính toán phần trăm tích lũy (cumulative percentage)
    let total = data.reduce((acc, value) => acc + value, 0);
    let cumulativeData = data.map((value, index) => {
      let cumulativeSum = data.slice(0, index + 1).reduce((acc, val) => acc + val, 0);
      return (cumulativeSum / total) * 100;
    });

    // Mảng màu cho từng thanh
    const barColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#66FF66', '#FF6666', '#6699FF', '#FFCC99'
    ];

    // Tạo biểu đồ
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // Nhãn của các cột
        datasets: [
          {
            label: 'Thời gian dừng máy (giờ)',
            data: data,
            backgroundColor: barColors, // Mỗi bar có một màu
            borderColor: barColors,
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
          x: {
            grid: {
              display: false, // Ẩn lưới trên trục x
            },
          },
          y: {
            beginAtZero: true,
            position: 'left',
            ticks: {
              callback: function (value) {
                return value + ' giờ'; // Đơn vị cho cột
              },
            },
            grid: {
              display: false, // Ẩn lưới trên trục y
            },
            title: {
              display: false, // Hiển thị tiêu đề trục y
              text: 'Thời gian dừng máy (giờ)',
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
              display: false, // Ẩn lưới trên trục y1
            },
            title: {
              display: false, // Hiển thị tiêu đề trục y1
              text: 'Tỷ lệ tích lũy (%)',
            },
          },
        },
        plugins: {
          title: {
            display: false,
            text: 'Phân bố Thời gian dừng máy (Pareto)',
          },
          legend: {
            display: false,
            position: 'top', // Đặt legend ở phía trên
          },
          datalabels: {
            display: false, // Ẩn nhãn dữ liệu
          },
        },
      },
    });

    return () => {
      chart.destroy(); // Cleanup biểu đồ khi component bị unmount
    };
  }, [data, labels]);

  // Hàm xử lý fullscreen và in (giả định đã có sẵn trong TitleChart)
  const handleFullscreen = () => {
    console.log("Fullscreen triggered");
  };

  const handlePrint = () => {
    console.log("Print triggered");
  };

  return (
    <div>
    
      <div>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default ParetoTimeChart;
