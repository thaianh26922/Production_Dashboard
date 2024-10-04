import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import moment from 'moment';

const StackedBarChart = ({ selectedDate }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/device-status/543ff470-54c6-11ef-8dd4-b74d24d26b24`, {
          params: { startDate, endDate },
        }
      );
      setData(response.data.statuses); // Lưu dữ liệu lấy từ API
    } catch (error) {
      setError(error.message || 'Failed to fetch data');
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

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const margin = { top: 10, right: 30, bottom: 50, left: 40 };
    const width = 680 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Format data
    const formattedData = data.map(d => ({
      date: moment(d.ts).format('YYYY-MM-DD'),
      status: d.value === '1' ? 'Chạy' : 'Dừng',
      duration: 1, // Assuming equal duration for each status, adjust if needed
    }));

    const groupedData = {};
    formattedData.forEach(d => {
      if (!groupedData[d.date]) {
        groupedData[d.date] = { Chạy: 0, Dừng: 0 };
      }
      groupedData[d.date][d.status] += d.duration;
    });

    const labels = Object.keys(groupedData);

    // Calculate percentage for each status
    const stackedData = labels.map(date => {
      const total = groupedData[date].Chạy + groupedData[date].Dừng;
      return {
        date,
        Chạy: (groupedData[date].Chạy / total) * 100,
        Dừng: (groupedData[date].Dừng / total) * 100,
      };
    });

    const stack = d3.stack().keys(['Chạy', 'Dừng']);
    const stackedSeries = stack(stackedData);

    // X Scale (Percentage)
    const xScale = d3.scaleLinear()
      .domain([0, 100]) // X is percentage from 0 to 100
      .range([0, width]);

    // Y Scale (Dates - recent dates at the top)
    const yScale = d3.scaleBand()
      .domain(labels) // Most recent dates first
      .range([0, height])
      .padding(0.6);

    const dateFormat = d3.timeFormat('%d/%m');

    // Color Scale
    const colorScale = d3.scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#31e700', '#ff0137']); // Chạy: Green, Dừng: Red

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw bars
    chart
      .selectAll('.serie')
      .data(stackedSeries)
      .enter()
      .append('g')
      .attr('fill', d => colorScale(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('y', d => yScale(d.data.date))
      .attr('x', d => xScale(d[0]))
      .attr('width', d => xScale(d[1]) - xScale(d[0]))
      .attr('height', yScale.bandwidth())
      .append('title') // Tooltip
      .text(d => `${d.data.date}: ${(d[1] - d[0]).toFixed(1)}%`);

    // Add data labels inside the bars
    chart
      .selectAll('.serie')
      .data(stackedSeries)
      .enter()
      .append('g')
      .attr('fill', 'white')
      .selectAll('text')
      .data(d => d)
      .enter()
      .append('text')
      .attr('font-size', '12px')
      .attr('x', d => xScale(d[0]) + 10)
      .attr('y', d => yScale(d.data.date) + yScale.bandwidth() / 2)
      .attr('dy', '.30em')
      .attr('text-anchor', 'start')
      .text(d => `${(d[1] - d[0]).toFixed(1)}%`);

    // X Axis (Percentage)
    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d + '%'));

    // Y Axis (Formatted Dates)
    chart
      .append('g')
      .call(d3.axisLeft(yScale)
        .tickFormat(d => dateFormat(new Date(d)))
      );

    // Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.bottom - 5})`);

    const legendData = ['Chạy', 'Dừng'];

    legend
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * 100}, 0)`)
      .call(g => {
        // Legend rectangle
        g.append('rect')
          .attr('width', 18)
          .attr('height', 5)
          .attr('fill', colorScale);

        // Legend text
        g.append('text')
          .attr('x', 24)
          .attr('y', 3)
          .attr('dy', '0.1em')
          .attr('font-size', '10px')
          .text(d => d);
      });

  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No data available for the selected date range.</p>;

  return (
    <svg ref={svgRef} width="800" height="450"></svg>
  );
};

export default StackedBarChart;
