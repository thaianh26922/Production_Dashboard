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
    if (!date) {
      console.error('Date is not defined or invalid:', date);
      return null;
    }
    return moment(date).format('YYYY-MM-DD'); // Định dạng thành YYYY-MM-DD
  };

  // Fetch data từ API với deviceId đã cứng và selectedDate là ngày
  const fetchData = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      console.error('Invalid startDate or endDate:', startDate, endDate);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      if (!formattedStartDate || !formattedEndDate) {
        console.error('Formatted dates are invalid:', formattedStartDate, formattedEndDate);
        return;
      }

      const response = await axios.get(
        `http://192.168.1.13:5000/api/telemetry?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra xem `selectedDate` có hợp lệ không (mảng gồm 2 phần tử)
  useEffect(() => {
    if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate.map(d => d.toDate()); // Chuyển từ Moment object sang Date object
      if (startDate && endDate) {
        fetchData(startDate, endDate);
      } else {
        console.error('Start date or end date is invalid:', selectedDate);
      }
    } else {
      console.error('Selected date array is invalid:', selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 35, bottom: 50, left: 50 };

    // Làm sạch SVG trước khi vẽ
    svg.selectAll('*').remove();

    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');
    const dateParse = d3.timeParse('%Y-%m-%d');
    const dateFormat = d3.timeFormat('%d/%m');

    // Xử lý dữ liệu trước khi vẽ
    const flattenedData = data.flatMap((item) => {
      if (item.intervals) {
        return item.intervals.map((interval) => ({
          date: item.date,
          startTime: interval.startTime,
          endTime: interval.endTime,
          status: interval.status,
        }));
      }
      return [];
    });

    if (flattenedData.length === 0) return;

    // Tạo các scale cho trục
    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('23:59')])
      .range([margin.left, width - margin.right]);

    const uniqueDates = [...new Set(flattenedData.map(d => d.date))];
    const yScale = d3
      .scaleBand()
      .domain(uniqueDates.sort())
      .range([height - margin.bottom - 40, margin.top])
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#00f600', '#f60000']);

    // Chỉ cập nhật những phần tử cần thiết thay vì vẽ lại toàn bộ
    const rects = svg
      .selectAll('rect.data')
      .data(flattenedData);

    // Enter: Thêm phần tử mới
    rects.enter()
      .append('rect')
      .attr('class', 'data')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', d => yScale(d.date) + yScale.bandwidth() / 4)
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 0;
      })
      .attr('height', Math.min(yScale.bandwidth() / 2, 20))
      .attr('fill', d => colorScale(d.status))
      .append('title')
      .text(d => `${d.status}: ${d.startTime} - ${d.endTime}`);

    // Update: Cập nhật những phần tử đã có
    rects.attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', d => yScale(d.date) + yScale.bandwidth() / 4)
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 0;
      })
      .attr('height', Math.min(yScale.bandwidth() / 2, 20))
      .attr('fill', d => colorScale(d.status));

    // Exit: Xóa những phần tử không còn cần thiết
    rects.exit().remove();

    // Vẽ trục thời gian ở dưới cùng
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Vẽ trục dọc đại diện cho ngày
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    // Thêm legend cho màu sắc trạng thái
    const legendData = ['Chạy', 'Dừng'];

    const legend = svg
      .selectAll('.legend')
      .data(legendData)
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
      .style('font-size', '12px')
      .style('text-anchor', 'start');
  }, [data, dimensions]);

  // Đảm bảo vẽ lại khi kích thước thay đổi
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
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
        </div>
      )}
    </div>
  );
};

export default TimelineChart;
