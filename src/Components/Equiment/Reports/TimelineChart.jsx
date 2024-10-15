import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import moment from 'moment';

const TimelineChart = ({ selectedDate }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  const deviceId = '543ff470-54c6-11ef-8dd4-b74d24d26b24'; // deviceId của ThingBoard

  // Hàm định dạng ngày tháng thành 'YYYY-MM-DD'
  const formatDateForAPI = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  // Fetch data từ API
  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const response = await axios.get(
        `http://192.168.1.9:5001/api/telemetry?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      // Sắp xếp dữ liệu ngay sau khi fetch về
      const sortedData = response.data.map(item => ({
        ...item,
        intervals: item.intervals.sort((a, b) => moment(a.startTime, 'HH:mm') - moment(b.startTime, 'HH:mm'))
      }));
      setData(sortedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi `selectedDate` thay đổi
  useEffect(() => {
    if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate.map(d => d.toDate()); 
      if (startDate && endDate) {
        fetchData(startDate, endDate);
      }
    }
  }, [selectedDate]);

  // Vẽ biểu đồ
  useEffect(() => {
    if (!data || data.length === 0 || error) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 35, bottom: 50, left: 50 };

    // Dọn dẹp SVG
    svg.selectAll('*').remove();

    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');
    const dateParse = d3.timeParse('%Y-%m-%d');
    const dateFormat = d3.timeFormat('%d/%m');

    const flattenedData = data.flatMap((item) =>
      item.intervals.map((interval) => ({
        date: item.date,
        startTime: interval.startTime,
        endTime: interval.endTime,
        status: interval.status,
      }))
    );

    if (flattenedData.length === 0) return;

    // Scale
    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('23:59')])
      .range([margin.left, width - margin.right]);

    const uniqueDates = [...new Set(flattenedData.map(d => d.date))];
    const yScale = d3
      .scaleBand()
      .domain(uniqueDates)
      .range([height - margin.bottom - 40, margin.top])
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#00f600', '#f60000']);

    // Vẽ các rect đại diện cho các khoảng thời gian
    svg
      .selectAll('rect.data')
      .data(flattenedData)
      .enter()
      .append('rect')
      .attr('class', 'data')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', d => yScale(d.date) + yScale.bandwidth() / 4)
      .attr('width', d => Math.max(xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime)), 0))
      .attr('height', Math.min(yScale.bandwidth() / 2, 20))
      .attr('fill', d => colorScale(d.status))
      .append('title')
      .text(d => `${d.status}: ${d.startTime} - ${d.endTime}`);

    // Vẽ trục thời gian và ngày
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    // Legend
    const legend = svg
      .selectAll('.legend')
      .data(['Chạy', 'Dừng'])
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${margin.left + i * 100},${height - margin.bottom + 20})`);

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 18)
      .attr('height', 5)
      .style('fill', d => colorScale(d));

    legend
      .append('text')
      .attr('x', 25)
      .attr('y', 5)
      .text(d => d)
      .style('font-size', '12px');
  }, [data, dimensions, error]);

  // Theo dõi sự thay đổi kích thước
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { clientWidth, clientHeight } = wrapperRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error || !data.length ? (
        <p>No data available for the selected date range.</p>
      ) : (
        <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
        </div>
      )}
    </div>
  );
};

export default TimelineChart;
