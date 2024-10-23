import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ParetoFrequencyChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const { labels, values } = data || {};
    console.log('Received Labels:', labels); // Debugging
    console.log('Received Values:', values); // Debugging

    if (!labels || !values || labels.length === 0 || values.length === 0) {
      console.error('No data or labels available');
      return;
    }

    // Calculate cumulative percentage
    const total = values.reduce((acc, value) => acc + value, 0);
    const cumulativeData = values.map((value, index) => {
      const cumulativeSum = values.slice(0, index + 1).reduce((acc, val) => acc + val, 0);
      return (cumulativeSum / total) * 100;
    });

    const barColors = [
      '#410278', 
    ];

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Frequency',
            data: values,
            backgroundColor: barColors,
            borderColor: barColors,
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            label: '',
            data: cumulativeData,
            type: 'line',
            borderColor: '#c21224',
            backgroundColor: '#c21224',
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: { display: false },
            title: { display: false, text: 'Reason Names' },
          },
          y: {
            beginAtZero: true,
            position: 'left',
            ticks: {
              callback: (value) => `${value} lần`,
            },
            
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            ticks: {
              callback: (value) => `${value}%`,
            },
            grid: { drawOnChartArea: false },
            
          },
        },
        plugins: {
          legend: { display: false, position: 'top' },
        },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default ParetoFrequencyChart;
