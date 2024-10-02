import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

const MachineTimeline = () => {
  const fixedHeight = 150; // Đặt chiều cao cố định cho SVG
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: fixedHeight });

  // Hàm tạo dữ liệu giả lập chi tiết hơn với khoảng thời gian 30 phút
  const generateSimulatedData = () => {
    const simulatedData = [];
    let currentTime = moment().startOf('day'); // Bắt đầu từ 00:00 của ngày hiện tại

    // Tạo các khoảng thời gian xen kẽ giữa "Chạy", "Dừng" và "Chờ" mỗi 30 phút
    for (let i = 0; i < 48; i++) { // 48 khoảng thời gian 30 phút cho 24 giờ
      const randomStatus = Math.floor(Math.random() * 3); // Ngẫu nhiên chọn trạng thái "Chạy" (1), "Dừng" (0) hoặc "Chờ" (2)
      const status = randomStatus === 0 ? '0' : randomStatus === 1 ? '1' : '2';
      simulatedData.push({
        ts: currentTime.valueOf(),
        value: status,
      });
      currentTime = currentTime.add(30, 'minutes'); // Tăng thêm 30 phút
    }

    return simulatedData;
  };

  useEffect(() => {
    // Sử dụng dữ liệu giả lập chi tiết hơn
    const simulatedData = generateSimulatedData();
    setData(simulatedData);
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 35, bottom: 80, left: 50 };

    const processedData = data.map(d => ({
      startTime: moment(d.ts).format('HH:mm'),
      endTime: moment(d.ts + 1800000).format('HH:mm'), // Mỗi trạng thái kéo dài 30 phút
      status: d.value === '1' ? 'Chạy' : d.value === '0' ? 'Dừng' : 'Chờ',
    }));

    svg.selectAll('*').remove(); // Xóa các phần tử cũ

    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');

    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('23:59')])
      .range([margin.left, width - margin.right]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng', 'Chờ'])
      .range(['#4aea4a', '#f10401', '#ffcc00']); // Thêm màu vàng cho trạng thái "Chờ"

    // Thêm tooltip vào DOM
    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '4px')
      .style('display', 'none') // Ẩn tooltip ban đầu
      .style('pointer-events', 'none');

    // Vẽ trục X
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 30})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Vẽ các thanh ngang trên trục X và thêm sự kiện tooltip
    svg
      .selectAll('rect')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', height - margin.bottom - 60) // Đặt thanh ngang gần cuối SVG
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 0;
      })
      .attr('height', 30) // Đặt chiều cao của thanh
      .attr('fill', d => colorScale(d.status))
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .html(`Trạng thái: <b>${d.status}</b><br>Thời gian: ${d.startTime} - ${d.endTime}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mousemove', event => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none'); // Ẩn tooltip khi chuột rời khỏi thanh
      });

    // Tính tổng số giờ cho từng trạng thái
    const totalHours = processedData.length * 0.5; // Tổng số giờ (vì mỗi khoảng là 30 phút, nên mỗi phần là 0.5 giờ)
    const totalRunning = processedData.filter(d => d.status === 'Chạy').length * 0.5; // Số giờ máy chạy
    const totalStopped = processedData.filter(d => d.status === 'Dừng').length * 0.5; // Số giờ máy dừng
    const totalWaiting = processedData.filter(d => d.status === 'Chờ').length * 0.5; // Số giờ máy chờ
    const runningPercentage = ((totalRunning / totalHours) * 100).toFixed(2); // Tính tỷ lệ chạy

    // Vẽ phần chú thích (legend) với tổng thời gian
    const legendData = [
      { status: 'Chạy', hours: totalRunning, color: '#4aea4a' },
      { status: 'Dừng', hours: totalStopped, color: '#ff6384' },
      { status: 'Chờ', hours: totalWaiting, color: '#ffcc00' }, // Thêm chú thích cho "Chờ"
    ];

    const legend = svg
      .selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${margin.left + i * 150},${height - margin.bottom + 25})`);

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', -10)
      .attr('width', 20)
      .attr('height', 5)
      .style('fill', d => d.color);

    legend
      .append('text')
      .attr('x', 25)
      .attr('y', -5)
      .text(d => `${d.status}: ${d.hours} giờ`)
      .style('font-size', '10px')
      .style('text-anchor', 'start');

    // Thêm tiêu đề ở cuối (bottom) với tỷ lệ chạy
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10) // Đặt tiêu đề ở cuối SVG
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(`Tỷ lệ máy chạy: ${runningPercentage}%`);
  }, [data, dimensions]);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { clientWidth, clientHeight } = wrapperRef.current;
        setDimensions({ width: clientWidth, height: fixedHeight });
      }
    };
    
    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: `${fixedHeight}px` }}>
      <svg ref={svgRef} width={dimensions.width} height={fixedHeight}></svg>
    </div>
  );
};

export default MachineTimeline;
