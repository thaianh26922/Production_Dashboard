import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import moment from 'moment';

const TimelineChart = ({ selectedDate }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dimensions = { width: 800, height: 440 };

  // Hàm gọi API
  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/device-status/543ff470-54c6-11ef-8dd4-b74d24d26b24`, {
          params: { startDate, endDate },
        }
      );
      setData(response.data.statuses); // Lưu dữ liệu từ API
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.length === 2) {
      const startDate = Math.min(selectedDate[0].valueOf(), selectedDate[1].valueOf());
      const endDate = Math.max(selectedDate[0].valueOf(), selectedDate[1].valueOf());
      fetchData(startDate, endDate); // Gọi API khi có ngày được chọn
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 50, left: 100 };

    const processedData = data.map(d => ({
      date: moment(d.ts).format('YYYY-MM-DD'),
      startTime: moment(d.ts).format('HH:mm'),
      endTime: moment(d.ts + 3600000).format('HH:mm'), // Giả sử mỗi phiên kéo dài 1 giờ
      status: d.value === '1' ? 'Chạy' : 'Dừng',
    }));

    svg.selectAll('*').remove(); // Xóa biểu đồ cũ

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
      .padding(0.6); // Giảm padding nếu cần để không gian giữa các thanh bar hẹp hơn

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#4bc0c0', '#ff6384']);

    // Vẽ trục X (thời gian)
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(0,0)rotate(0)")
      .style("text-anchor", "middle");

    // Vẽ trục Y (ngày tháng)
    svg
      .append('g')
      .attr('transform', `translate(${margin.left-1},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    // Vẽ các thanh ngang (horizontal bars)
    svg
      .selectAll('rect')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(timeParse(d.startTime))) // Bắt đầu từ xScale, không đè lên trục Y
      .attr('y', d => yScale(d.date))
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 0;
      })
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.status))
      .append('title')
      .text(d => `${d.status}: ${d.startTime} - ${d.endTime}`);

    // Thêm Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom })`);

    const legendData = ['Chạy', 'Dừng'];

    legend
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * 100}, 0)`)
      .call(g => {
        // Legend rectangles
        g.append('rect')
          .attr('width', 18)
          .attr('height', 5)
          .attr('fill', colorScale);

        // Legend text
        g.append('text')
          .attr('x', 24)
          .attr('y', 1)
          .attr('dy', '0.35em')
          .text(d => d)
          .attr('font-size', '10px'); // Điều chỉnh kích thước font chữ nếu cần
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
