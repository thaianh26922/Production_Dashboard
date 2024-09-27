import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimelineChart = () => {
  const svgRef = useRef();

  // Dữ liệu mẫu với nhiều trạng thái hơn cho mỗi ngày
  const data = [
    { date: '2023-09-22', machine: 'CNC1', status: 'Chạy', startTime: '00:00', endTime: '10:00' },
    { date: '2023-09-22', machine: 'CNC1', status: 'Cài Đặt', startTime: '10:00', endTime: '10:40' },
    { date: '2023-09-22', machine: 'CNC1', status: 'Dừng', startTime: '10:40', endTime: '11:00' },
    { date: '2023-09-22', machine: 'CNC1', status: 'Chờ', startTime: '11:00', endTime: '12:00' },
    { date: '2023-09-22', machine: 'CNC1', status: 'Tắt máy', startTime: '12:00', endTime: '17:00' },
    { date: '2023-09-21', machine: 'CNC2', status: 'Chạy', startTime: '00:00', endTime: '11:30' },
    { date: '2023-09-21', machine: 'CNC2', status: 'Dừng', startTime: '11:30', endTime: '13:00' },
    { date: '2023-09-21', machine: 'CNC2', status: 'Tắt máy', startTime: '13:00', endTime: '17:00' },
    { date: '2023-09-20', machine: 'CNC3', status: 'Chạy', startTime: '00:00', endTime: '12:00' },
    { date: '2023-09-20', machine: 'CNC3', status: 'Dừng', startTime: '12:00', endTime: '14:00' },
    { date: '2023-09-20', machine: 'CNC3', status: 'Tắt máy', startTime: '14:00', endTime: '17:00' },
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500; // Tăng chiều cao để có không gian cho legend
    const margin = { top: 20, right: 35, bottom: 50, left: 35 }; // Tăng margin bottom để đủ chỗ cho legend

    // Parse time
    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');
    const dateParse = d3.timeParse('%Y-%m-%d');
    const dateFormat = d3.timeFormat('%d/%m');

    // Set dimensions of the SVG element
    svg.attr('width', width).attr('height', height);

    // X scale for time (08:00 - 17:00)
    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('24:00')])
      .range([margin.left, width - margin.right]);

    // Y scale for dates (sorted in ascending order)
    const uniqueDates = [...new Set(data.map(d => d.date))]; // Unique dates
    const yScale = d3
      .scaleBand()
      .domain(uniqueDates.sort())
      .range([margin.top, height - margin.bottom - 40]) // Trừ thêm khoảng để thêm legend
      .padding(0.2);

    // Define color scale for different statuses
    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng', 'Cài Đặt','Chờ', 'Tắt máy'])
      .range(['#4bc0c0', '#ff6384', '#ffcd56','#ffcd56', '#c9cbcf']);

    // Add X axis (Time)
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat));

    // Add Y axis (Dates formatted as dd/mm)
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    // Create the timeline bars
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1) // Add padding to avoid overlap with Y axis
      .attr('y', d => yScale(d.date))
      .attr('width', d => xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime)))
      .attr('height', yScale.bandwidth() / 2) // Adjust height to fit multiple bars for one date
      .attr('fill', d => colorScale(d.status))
      .append('title') // Tooltip
      .text(d => `${d.machine} (${d.status}): ${d.startTime} - ${d.endTime}`);

    // Add legend
    const legendData = ['Chạy', 'Dừng', 'Cài Đặt','Chờ', 'Tắt máy'];

    const legend = svg
      .selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${margin.left + i * 150},${height - margin.bottom})`); // Adjust legend position

    legend
      .append('rect')
      .attr('x', 2)
      .attr('y', 0)
      .attr('width', 18)
      .attr('height', 5)
      .style('fill', d => colorScale(d));
     

    legend
      .append('text')
      .attr('x', 30)
      .attr('y', 8)
      .text(d => d)
      .style('text-anchor', 'start')
      .style('font-size', '12px');
    
    // Cleanup previous rendering when re-rendering
    return () => svg.selectAll('*').remove();
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default TimelineChart;
