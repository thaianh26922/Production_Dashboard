import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DatePicker } from 'antd';

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const MachineComparisonChart = ({ data, machineType }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear old chart before drawing a new one

    const width = svgRef.current.clientWidth || 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.machine))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yMax = d3.max(data, d => d.percentage);
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    // Draw X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Draw Y axis
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    // Draw bars
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.machine))
      .attr('y', d => yScale(d.percentage))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d.percentage))
      .attr('fill', '#4bc0c0');

    // Add percentage labels above bars
    svg
      .selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.machine) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.percentage) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `${d.percentage}%`);
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
        <header className="flex justify-between items-center mb-4"> <h3 className="text-lg font-bold">Tỷ lệ máy chạy ({machineType})</h3>
        <DatePicker onChange={onChange} needConfirm /> </header>
      
      <svg ref={svgRef} width="100%" height="300"></svg>
    </div>
  );
};

export default MachineComparisonChart;
