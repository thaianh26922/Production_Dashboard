import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import moment from 'moment-timezone';

// Status mapping for label and color
const statusMapping = {
  1: { label: "Chạy", color: "#4bc0c0" },   // Running (Green)
  0: { label: "Dừng", color: "#ff0137" },   // Stopped (Red)
};

const TimelineChart = ({ selectedDate }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dimensions = { width: 680, height: 440 };

  // Fetch timeseries data from the backend
  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/device-status/543ff470-54c6-11ef-8dd4-b74d24d26b24`, {
          params: { startDate, endDate },
        }
      );
      setData(response.data.history); // Use the 'history' array from backend response
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.length === 2) {
      const startDate = moment(selectedDate[0]).startOf('day').unix();  // Start of the day in UNIX timestamp
      const endDate = moment(selectedDate[1]).endOf('day').unix();      // End of the day in UNIX timestamp
      fetchData(startDate, endDate); // Fetch processed timeseries data from the backend
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 50, left: 35 };

    svg.selectAll('*').remove(); // Clear previous content

    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');
    const dateParse = d3.timeParse('%Y-%m-%d');
    const dateFormat = d3.timeFormat('%d/%m');

    // X and Y scales
    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('23:59')])
      .range([margin.left, width - margin.right]);

    const uniqueDates = [...new Set(data.map(d => d.date))];
    const yScale = d3
      .scaleBand()
      .domain(uniqueDates)
      .range([height - margin.bottom - 40, margin.top])
      .padding(0.6);

    // Color scale based on the status
    const colorScale = d3.scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#2cce00', '#ff0137']);

    // Draw X-axis (time)
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(0,0)rotate(0)")
      .style("text-anchor", "middle");

    // Draw Y-axis (dates)
    svg
      .append('g')
      .attr('transform', `translate(${margin.left - 1},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    // Draw horizontal bars based on the processed data from the backend
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(timeParse(d.startTime)))
      .attr('y', d => yScale(d.date))
      .attr('width', d => xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime)))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(statusMapping[d.status].label))
      .append('title')
      .text(d => `${statusMapping[d.status].label}: ${d.startTime} - ${d.endTime}`);

    // Add a legend to the chart
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom + 5})`);

    const legendData = ['Chạy', 'Dừng'];

    legend
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * 100}, 0)`)
      .call(g => {
        g.append('rect')
          .attr('width', 18)
          .attr('height', 5)
          .attr('fill', d => colorScale(d));
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
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
    </div>
  );
};

export default TimelineChart;
