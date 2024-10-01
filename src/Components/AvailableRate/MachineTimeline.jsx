import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

const MachineTimeline = () => {
  const fixedHeight = 150; 
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  // Hàm tạo dữ liệu giả lập cho 24 giờ
  const generateSimulatedData = () => {
    const simulatedData = [];
    let currentTime = moment().startOf('day'); // Bắt đầu từ 00:00 của ngày hiện tại

    // Tạo các khoảng thời gian xen kẽ giữa "Chạy" và "Dừng" mỗi 1 giờ
    for (let i = 0; i < 24; i++) {
      const status = i % 2 === 0 ? '1' : '0'; // Xen kẽ trạng thái "Chạy" (1) và "Dừng" (0)
      simulatedData.push({
        ts: currentTime.valueOf(),
        value: status,
      });
      currentTime = currentTime.add(1, 'hour'); // Tăng thêm 1 giờ
    }

    return simulatedData;
  };

  useEffect(() => {
    // Sử dụng dữ liệu giả lập 24 giờ
    const simulatedData = generateSimulatedData();
    setData(simulatedData);
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 35, bottom: 50, left: 50 };

    const processedData = data.map(d => ({
      date: moment(d.ts).format('YYYY-MM-DD'),
      startTime: moment(d.ts).format('HH:mm'),
      endTime: moment(d.ts + 3600000).format('HH:mm'), // Mỗi trạng thái kéo dài 1 giờ
      status: d.value === '1' ? 'Chạy' : 'Dừng',
    }));

    svg.selectAll('*').remove();

    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');
    const dateParse = d3.timeParse('%Y-%m-%d');
    const dateFormat = d3.timeFormat('%d/%m');

    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('23:59')])
      .range([margin.left, width - margin.right]);

    const uniqueDates = [...new Set(processedData.map(d => d.date))];
    const yScale = d3
      .scaleBand()
      .domain(uniqueDates.sort())
      .range([height - margin.bottom - 40, margin.top])
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#4bc0c0', '#ff6384']);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    svg
      .selectAll('rect')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', d => yScale(d.date))
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 0;
      })
      .attr('height', Math.min(yScale.bandwidth() / 2, 20))
      .attr('fill', d => colorScale(d.status))
      .append('title')
      .text(d => `${d.status}: ${d.startTime} - ${d.endTime}`);

    const legendData = ['Chạy', 'Dừng'];

    const legend = svg
      .selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${margin.left + i * 70},${height - margin.bottom + 15})`);

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', -10)
      .attr('width', 20)
      .attr('height', 5)
      .style('fill', d => colorScale(d));

    legend
      .append('text')
      .attr('x', 25)
      .attr('y', -5)
      .text(d => d)
      .style('font-size', '10px')
      .style('text-anchor', 'start');
  }, [data, dimensions]);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { clientWidth, clientHeight } = wrapperRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };
    
    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} width={dimensions.width} height={fixedHeight}></svg>
    </div>
  );
};

export default MachineTimeline;
