import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment'; // Để xử lý thời gian

const TimelineChart = ({ selectedDate }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm gọi API lấy dữ liệu từ server dựa vào selectedDate
  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://back-end-production.onrender.com/api/device-status/543ff470-54c6-11ef-8dd4-b74d24d26b24?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const result = await response.json();
      setData(result.statuses); // Cập nhật dữ liệu
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.length === 2) {
      const startDate = selectedDate[0].valueOf(); // Chuyển đổi ngày bắt đầu sang timestamp
      const endDate = selectedDate[1].valueOf();   // Chuyển đổi ngày kết thúc sang timestamp
      fetchData(startDate, endDate); // Gọi API để lấy dữ liệu
    }
  }, [selectedDate]); // Chỉ gọi lại khi selectedDate thay đổi

  useEffect(() => {
    if (!data || data.length === 0) return; // Nếu không có dữ liệu, không render biểu đồ

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 450;
    const margin = { top: 20, right: 35, bottom: 50, left: 35 };

    // Xử lý dữ liệu nhận được từ API
    const processedData = data.map(d => ({
      date: moment(d.ts).format('YYYY-MM-DD'), // Chuyển đổi timestamp sang định dạng ngày
      startTime: moment(d.ts).format('HH:mm'), // Thời gian bắt đầu từ timestamp
      endTime: moment(d.ts + 3600000).format('HH:mm'), // Giả sử trạng thái kéo dài 1 giờ (có thể thay đổi)
      status: d.value === '1' ? 'Chạy' : 'Dừng', // Chuyển đổi 1 -> Chạy, 0 -> Dừng
    }));

    // Cleanup previous rendering before re-rendering
    svg.selectAll('*').remove();

    // Parse time và date
    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');
    const dateParse = d3.timeParse('%Y-%m-%d');
    const dateFormat = d3.timeFormat('%d/%m');

    // X scale for time (00:00 - 24:00)
    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('24:00')])
      .range([margin.left, width - margin.right]);

    // Y scale for dates (filtered by selectedDate)
    const uniqueDates = [...new Set(processedData.map(d => d.date))];
    const yScale = d3
      .scaleBand()
      .domain(uniqueDates.sort())
      .range([margin.top, height - margin.bottom - 40])
      .padding(0.2);

    // Define color scale for different statuses
    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#4bc0c0', '#ff6384']);

    // Add X axis (Time)
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat));

    // Add Y axis (Dates filtered by selectedDate)
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    // Create the timeline bars
    svg
      .selectAll('rect')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', d => yScale(d.date))
      .attr('width', d => xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime)))
      .attr('height', yScale.bandwidth() / 2)
      .attr('fill', d => colorScale(d.status))
      .append('title')
      .text(d => `${d.status}: ${d.startTime} - ${d.endTime}`);

    // Add legend
    const legendData = ['Chạy', 'Dừng'];

    const legend = svg
      .selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${margin.left + i * 150},${height - margin.bottom})`);

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
  }, [data]); // Cập nhật khi dữ liệu thay đổi

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No data available for the selected date range.</p>;

  return <svg ref={svgRef}></svg>;
};

export default TimelineChart;
