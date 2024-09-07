import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Định nghĩa màu sắc cho các trạng thái
const colors = {
  'Chạy': '#00FF00',
  'Chờ': '#FFFF00',
  'Lỗi Máy': '#FF0000',
  'Dừng': '#0000FF',
  'Thiếu đơn': '#FF6600',
};

const MachineStatusHistory = ({ historyData }) => {
  const svgRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    if (!historyData || historyData.length === 0) return;

    // Set kích thước của biểu đồ
    const width = 1000;
    const height = 100;  // Chiều cao của biểu đồ chính
    const margin = { top: 20, right: 30, bottom: 40, left: 20 };

    // Tạo SVG cho biểu đồ chính
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0000');

    // Tạo thang đo x cho trục thời gian từ 6:00 đến 06:00 hôm sau
    const totalMinutesInDay = 24 * 60; // Tổng số phút trong 24 giờ
    const startTime = 6 * 60; // 6:00 sáng, tính bằng phút
    const endTime = startTime + totalMinutesInDay; // 6:00 sáng hôm sau

    const xScale = d3.scaleLinear()
      .domain([startTime, endTime]) // Từ 06:00 (360 phút) đến 06:00 sáng hôm sau
      .range([margin.left, width - margin.right]);

    // Xóa các phần tử cũ
    svg.selectAll("*").remove();

    // Đặt lại tổng thời gian tích lũy
    let totalElapsedMinutes = startTime;  // Bắt đầu từ 6:00 sáng

    // Tạo nhóm thanh bars
    svg.selectAll('rect')
      .data(historyData)
      .join('rect')
      .attr('x', d => {
        // Giới hạn vị trí thời gian để đảm bảo không bị vượt qua 06:00 sáng hôm sau
        const xPos = xScale(totalElapsedMinutes);  
        totalElapsedMinutes += d.duration;  // Tích lũy thời gian
        return xPos;
      })
      .attr('y', margin.top)
      .attr('width', d => {
        // Đảm bảo không vượt quá giới hạn 06:00 sáng hôm sau
        const barWidth = xScale(totalElapsedMinutes) - xScale(totalElapsedMinutes - d.duration);
        return barWidth > 0 ? barWidth : 0;  // Đảm bảo chiều rộng không âm
      })
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', d => colors[d.status]);

    // Thêm trục x với các mốc thời gian chính từ 06:00 đến 06:00 hôm sau
    const xAxis = d3.axisBottom(xScale)
      .tickValues(d3.range(startTime, endTime + 60, 60))  // Mốc thời gian mỗi giờ
      .tickFormat(d => {
        let hour = Math.floor((d % totalMinutesInDay) / 60); // Đảm bảo không vượt qua 24 giờ
        return hour.toString().padStart(2, '0') + ":00";  // Hiển thị giờ dưới dạng HH:00
      });

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    // Cập nhật phần legend dựa trên dữ liệu đã lọc
    const totalDuration = d3.sum(historyData, d => d.duration); // Tính tổng thời gian từ dữ liệu hiện tại

    const legend = d3.select(legendRef.current)
      .attr('width', width)
      .attr('height', 50);

    // Xóa legend cũ trước khi thêm legend mới
    legend.selectAll('*').remove();

    const legendGroup = legend.selectAll('.legend')
      .data(Object.keys(colors))
      .join('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${i * 150}, 10)`);

    legendGroup.append('rect')
      .attr('x', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => colors[d]);

    legendGroup.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.3em')
      .style('font-size', '12px')
      .text(d => {
        const statusDuration = d3.sum(historyData.filter(item => item.status === d), item => item.duration);
        const percentage = totalDuration > 0 ? ((statusDuration / totalDuration) * 100).toFixed(2) : 0;
        return `${d} (${percentage}%)`;
      });

  }, [historyData]); // Đảm bảo cập nhật khi historyData thay đổi

  return (
    <div>
      <svg ref={svgRef}></svg>
      <svg ref={legendRef}></svg>
    </div>
  );
};

export default MachineStatusHistory;
