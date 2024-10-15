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

  const formatDateForAPI = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const response = await axios.get(
        `http://192.168.1.9:5001/api/telemetry?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
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

  useEffect(() => {
    if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate.map(d => d.toDate());
      if (startDate && endDate) {
        fetchData(startDate, endDate);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!data || data.length === 0 || error) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 35, bottom: 50, left: 50 };

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

    const colorScale = d3.scaleOrdinal()
      .domain(['Chạy', 'Dừng', 'Offline'])
      .range(['#00f600', '#f60000', '#d3d3d3']);

    uniqueDates.forEach(date => {
      const intervals = flattenedData.filter(d => d.date === date);
      let previousEndTime = timeParse('00:00');

      intervals.forEach(interval => {
        const startTime = timeParse(interval.startTime);

        if (startTime > previousEndTime) {
          svg
            .append('rect')
            .attr('x', xScale(previousEndTime))
            .attr('y', yScale(date) + yScale.bandwidth() / 4)
            .attr('width', xScale(startTime) - xScale(previousEndTime))
            .attr('height', Math.min(yScale.bandwidth() / 2, 20))
            .attr('fill', '#d3d3d3');
        }

        previousEndTime = timeParse(interval.endTime);
      });

      const endOfDay = timeParse('23:59');
      if (previousEndTime < endOfDay) {
        svg
          .append('rect')
          .attr('x', xScale(previousEndTime))
          .attr('y', yScale(date) + yScale.bandwidth() / 4)
          .attr('width', xScale(endOfDay) - xScale(previousEndTime))
          .attr('height', Math.min(yScale.bandwidth() / 2, 20))
          .attr('fill', '#d3d3d3');
      }
    });

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
      svg.append('defs')
      .append('marker')
      .attr('id', 'arrow-up')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', '13')
      .attr('refY', '13') // Điều chỉnh vị trí mũi tên chỉ thẳng lên
      .attr('markerWidth', '6')
      .attr('markerHeight', '6')
      .attr('orient', '90') // Xoay mũi tên để chỉ thẳng lên
      .append('path')
      .attr('d', 'M 0 10 L 5 0 L 10 10 Z')
      .attr('fill', 'black')
  
  svg.append('defs')
    .append('marker')
    .attr('id', 'arrow-right')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', '0')
    .attr('refY', '0')
    .attr('markerWidth', '6')
    .attr('markerHeight', '6')
    .attr('orient', '-90') // Hướng mũi tên sang phải
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
    .attr('fill', 'black')
    svg.append('g')
  .attr('transform', `translate(0,${height - margin.bottom - 40})`)
  .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
  .call(g => g.select('.domain').attr('marker-end', 'url(#arrow-up)')) // Sử dụng mũi tên chỉ thẳng lên
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Thêm trục y và gán mũi tên chỉ sang phải
svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))))
  .call(g => g.select('.domain').attr('marker-end', 'url(#arrow-right)')); 
    // Thêm trục x và y
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5]) // Giới hạn mức độ zoom
      .translateExtent([[0, 0], [width, height]]) // Giới hạn khu vực kéo
      .on('zoom', function (event) {
        // Áp dụng sự kiện zoom cho trục x
        const newXScale = event.transform.rescaleX(xScale);
        xAxis.call(d3.axisBottom(newXScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat));

        // Cập nhật vị trí của các rect theo scale mới
        svg.selectAll('rect.data')
          .attr('x', d => newXScale(timeParse(d.startTime)) + 1)
          .attr('width', d => Math.max(newXScale(timeParse(d.endTime)) - newXScale(timeParse(d.startTime)), 0));
      });

    // Gắn behavior zoom vào SVG
    svg.call(zoom);

    const legend = svg
      .selectAll('.legend')
      .data(['Chạy', 'Dừng', 'Offline'])
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
