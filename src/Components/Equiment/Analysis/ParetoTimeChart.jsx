import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ParetoTimeChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Ensure data contains labels and values
    const { labels, values } = data || {};
    console.log('Received Labels:', labels); // Debugging
    console.log('Received Values:', values); // Debugging

    if (!labels || !values || labels.length === 0 || values.length === 0) {
      console.error('No data or labels available');
      return;
    }

    // Calculate cumulative percentages
    const total = values.reduce((acc, value) => acc + value, 0);
    const cumulativeData = values.map((value, index) => {
      const cumulativeSum = values.slice(0, index + 1).reduce((acc, val) => acc + val, 0);
      return (cumulativeSum / total) * 100;
    });

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Downtime Hours (hrs)',
            data: values,
            backgroundColor: '#0e5d93',
            borderColor: '#0e5d93',
            borderWidth: 1,
            yAxisID: 'y', // Assign to first y-axis
          },
          {
            label: 'Cumulative Percentage (%)',
            data: cumulativeData,
            type: 'line',
            borderColor: '#c21224',
            backgroundColor: '#c21224',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1', // Assign to second y-axis
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
            title: {
              display: false,
              text: 'Reason Names',
            },
          },
          y: {
            beginAtZero: true,
            position: 'left',
            ticks: {
              callback: (value) => `${value} hrs`,
            },
            title: {
              display: false,
              text: 'Downtime Hours (hrs)',
            },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            ticks: {
              callback: (value) => `${value}%`,
            },
            title: {
              display: false,
              text: 'Cumulative Percentage (%)',
            },
            grid: {
              drawOnChartArea: false, // Prevent grid lines from overlapping with y-axis grid
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: 'top',
            labels: {
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });

    // Cleanup on component unmount
    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default ParetoTimeChart;
