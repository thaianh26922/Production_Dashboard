import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Dữ liệu với các trạng thái mới: Chạy, Chờ, Lỗi Máy, Dừng, Thiếu đơn
const data = [
  { time: '09:00', status: 'Chạy', duration: 1 },      // Chạy từ 9:00 đến 9:01 (1 phút)
  { time: '09:01', status: 'Lỗi Máy', duration: 19 },  // Lỗi Máy từ 9:01 đến 9:20 (19 phút)
  { time: '09:20', status: 'Chờ', duration: 5 },       // Chờ từ 9:20 đến 9:25 (5 phút)
  { time: '09:25', status: 'Chạy', duration: 2 },      // Chạy từ 9:25 đến 9:27 (2 phút)
  { time: '09:27', status: 'Lỗi Máy', duration: 1 },   // Lỗi Máy từ 9:27 đến 9:28 (1 phút)
  { time: '09:28', status: 'Chờ', duration: 2 },       // Chờ từ 9:28 đến 9:30 (2 phút)
  { time: '09:30', status: 'Chạy', duration: 5 },      // Chạy từ 9:30 đến 9:35 (5 phút)
  { time: '09:35', status: 'Dừng', duration: 5 },      // Dừng từ 9:35 đến 9:40 (5 phút)
  { time: '09:40', status: 'Chạy', duration: 2 },      // Chạy từ 9:40 đến 9:42 (2 phút)
  { time: '09:42', status: 'Lỗi Máy', duration: 1 },   // Lỗi Máy từ 9:42 đến 9:43 (1 phút)
  { time: '09:43', status: 'Chờ', duration: 2 },       // Chờ từ 9:43 đến 9:45 (2 phút)
  { time: '09:45', status: 'Chạy', duration: 15 },     // Chạy từ 9:45 đến 10:00 (15 phút)
  { time: '10:00', status: 'Thiếu đơn', duration: 10 },// Thiếu đơn từ 10:00 đến 10:10 (10 phút)
  { time: '10:10', status: 'Chạy', duration: 50 },     // Chạy từ 10:10 đến 11:00 (50 phút)
  { time: '11:00', status: 'Dừng', duration: 10 },     // Dừng từ 11:00 đến 11:10 (10 phút)
  { time: '11:10', status: 'Chờ', duration: 30 },      // Chờ từ 11:10 đến 11:40 (30 phút)
  { time: '11:40', status: 'Lỗi Máy', duration: 5 },   // Lỗi Máy từ 11:40 đến 11:45 (5 phút)
  { time: '11:45', status: 'Chạy', duration: 2 },      // Chạy từ 11:45 đến 11:47 (2 phút)
  { time: '11:47', status: 'Dừng', duration: 1 },      // Dừng từ 11:47 đến 11:48 (1 phút)
  { time: '11:48', status: 'Chờ', duration: 2 },       // Chờ từ 11:48 đến 11:50 (2 phút)
  { time: '11:50', status: 'Chạy', duration: 10 },     // Chạy từ 11:50 đến 12:00 (10 phút)
  { time: '12:00', status: 'Dừng', duration: 15 },     // Dừng từ 12:00 đến 12:15 (15 phút)
  { time: '12:15', status: 'Chờ', duration: 25 },      // Chờ từ 12:15 đến 12:40 (25 phút)
  { time: '12:40', status: 'Lỗi Máy', duration: 10 },  // Lỗi Máy từ 12:40 đến 12:50 (10 phút)
  { time: '12:50', status: 'Chạy', duration: 20 },     // Chạy từ 12:50 đến 13:10 (20 phút)
  { time: '13:10', status: 'Dừng', duration: 5 },      // Dừng từ 13:10 đến 13:15 (5 phút)
  { time: '13:15', status: 'Chờ', duration: 15 },      // Chờ từ 13:15 đến 13:30 (15 phút)
  { time: '13:30', status: 'Lỗi Máy', duration: 10 },  // Lỗi Máy từ 13:30 đến 13:40 (10 phút)
  { time: '13:40', status: 'Chạy', duration: 20 },     // Chạy từ 13:40 đến 14:00 (20 phút)
];

// Màu sắc tương ứng cho các trạng thái mới
const colors = {
  'Chạy': '#00FF00',
  'Chờ': '#FFFF00',
  'Lỗi Máy': '#FF0000',
  'Dừng': '#0000FF',
  'Thiếu đơn': '#FF6600',
};

const MachineStatusHistory = () => {
  const svgRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    // Set kích thước của biểu đồ
    const width = 1200;
    const height = 100;  // Chiều cao của biểu đồ chính
    const margin = { top: 20, right: 30, bottom: 40, left: 0 };

    // Tạo SVG cho biểu đồ chính
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0000');

    // Tạo thang đo x cho trục thời gian
    const xScale = d3.scaleLinear()
      .domain([9 * 60, 14 * 60]) // Chuyển đổi giờ sang phút, giới hạn từ 9:00 đến 14:00
      .range([margin.left, width - margin.right]);

    // Tính toán tổng thời gian
    const totalMinutes = d3.sum(data, d => d.duration);

    // Tạo nhóm thanh bars
    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, i) => xScale((9 * 60) + d3.sum(data.slice(0, i), d => d.duration))) // Tính toán vị trí x dựa trên phút
      .attr('y', margin.top)
      .attr('width', d => xScale(d.duration) - xScale(0)) // Tính toán chiều rộng dựa trên thời lượng
      .attr('height', height - margin.top - margin.bottom )  // Để chừa không gian cho phần legend
      .attr('fill', d => colors[d.status]);

    // Thêm trục x với các mốc thời gian lớn (9:00, 10:00, 11:00, ...)
    const xAxis = d3.axisBottom(xScale)
      .ticks(6) // Chỉ hiển thị các mốc giờ chính
      .tickFormat(d => `${Math.floor(d / 60)}:00`); // Hiển thị dạng giờ (9:00, 10:00,...)

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    // Thêm đường lưới (grid lines)
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .ticks(6) // Tạo các đường lưới theo các ticks quan trọng
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#ccc')
      .attr('stroke-dasharray', '4');

    // Tạo phần legend trong một SVG riêng biệt
    const legend = d3.select(legendRef.current)
      .attr('width', width)
      .attr('height', 50); // Chiều cao của phần legend

    const legendGroup = legend.selectAll('.legend')
      .data(Object.keys(colors))
      .join('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${i * 150}, 10)`);  // Điều chỉnh vị trí của legend

    // Vẽ ô vuông màu cho mỗi trạng thái
    legendGroup.append('rect')
      .attr('x', 0)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => colors[d]);

    // Thêm tên trạng thái và tỷ lệ phần trăm
    legendGroup.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .text(d => {
        const durationSum = d3.sum(data.filter(item => item.status === d), item => item.duration);
        const percentage = ((durationSum / totalMinutes) * 100).toFixed(2);
        return `${d} (${percentage}%)`;
      });

  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <svg ref={legendRef}></svg>
    </div>
  );
};

export default MachineStatusHistory;
