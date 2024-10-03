import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import moment from 'moment-timezone';

// Định nghĩa màu sắc và trạng thái cho các giá trị PLC:STATUS
const statusMapping = {
  1: { label: "Chạy", color: "#4bc0c0" },   // Chạy (Xanh)
  0: { label: "Dừng", color: "#ff0137" },   // Dừng (Đỏ)
};

const TimelineChart = ({ selectedDate }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dimensions = { width: 800, height: 440 }; // Tăng chiều cao để có đủ không gian cho legend

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

  // Hàm xử lý dữ liệu thô từ API thành dữ liệu lịch sử máy
  const formatHistoryData = (rawData) => {
    const formattedData = [];

    // Sắp xếp dữ liệu theo timestamp
    const sortedData = rawData.sort((a, b) => a.ts - b.ts);

    // Duyệt qua dữ liệu và tính duration giữa các trạng thái liên tiếp
    for (let i = 0; i < sortedData.length - 1; i++) {
      const telemetryData = sortedData[i];
      const nextTelemetryData = sortedData[i + 1];  // Lấy dữ liệu tiếp theo

      // Lấy timestamp của trạng thái hiện tại và tiếp theo
      const startTime = moment(telemetryData.ts).tz('Asia/Bangkok');
      const endTime = moment(nextTelemetryData.ts).tz('Asia/Bangkok');

      const duration = endTime.diff(startTime, 'minutes');  // Tính thời gian kéo dài (phút)

      // Parse key để đảm bảo giá trị đúng
      const key = parseInt(telemetryData.value);
      
      // Thêm dữ liệu đã xử lý vào mảng formattedData
      formattedData.push({
        date: startTime.format('YYYY-MM-DD'),
        startTime: startTime.format('HH:mm'),
        endTime: endTime.format('HH:mm'),
        key: !isNaN(key) && statusMapping[key] ? key : 'default',
        duration,
      });
    }

    // Xử lý trạng thái cuối cùng (không có trạng thái tiếp theo để tính duration)
    const lastTelemetryData = sortedData[sortedData.length - 1];
    const lastStartTime = moment(lastTelemetryData.ts).tz('Asia/Bangkok');
    const lastKey = parseInt(lastTelemetryData.value);

    if (!isNaN(lastKey) && statusMapping[lastKey]) {
      formattedData.push({
        date: lastStartTime.format('YYYY-MM-DD'),
        startTime: lastStartTime.format('HH:mm'),
        endTime: '23:59', // Kết thúc cuối ngày
        key: lastKey,
        duration: moment('23:59', 'HH:mm').diff(lastStartTime, 'minutes'),
      });
    }

    return formattedData;
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 50, left: 100 };

    // Chuẩn bị dữ liệu với thời gian liên tiếp (tính duration giữa các trạng thái)
    const processedData = formatHistoryData(data);

    // Thêm điểm bắt đầu 00:00 nếu dữ liệu không bắt đầu từ đầu ngày
    if (processedData.length > 0 && processedData[0].startTime !== '00:00') {
      const firstDate = moment(processedData[0].date, 'YYYY-MM-DD').tz('Asia/Bangkok');
      processedData.unshift({
        date: firstDate.format('YYYY-MM-DD'),
        startTime: '00:00',
        endTime: processedData[0].startTime,
        key: 'default',
        duration: moment(processedData[0].startTime, 'HH:mm').diff(moment('00:00', 'HH:mm'), 'minutes'),
      });
    }

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

    // Đảm bảo ánh xạ chính xác nhãn "Chạy" và "Dừng" vào `colorScale`
    const colorScale = d3.scaleOrdinal()
      .domain(['Chạy', 'Dừng']) // Đảm bảo đúng nhãn
      .range(['#2cce00', '#ff0137']); // Màu sắc tương ứng

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

    // Vẽ các thanh ngang (horizontal bars) dựa trên thời gian giữa các timestamp
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
      .attr('fill', d => {
        const label = statusMapping[d.key]?.label;
        return colorScale(label); // Sử dụng nhãn để ánh xạ vào `colorScale`
      })
      .append('title')
      .text(d => `${statusMapping[d.key]?.label || 'Unknown'}: ${d.startTime} - ${d.endTime}`);

    // Thêm Legend giống StackedBarChart
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom + 5})`);

    const legendData = ['Chạy', 'Dừng'];

    // Sắp xếp lại legend với khoảng cách giữa các phần tử
    legend
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * 100}, 0)`) // Khoảng cách giữa các phần tử legend
      .call(g => {
        // Hình chữ nhật cho legend
        g.append('rect')
          .attr('width', 18)
          .attr('height', 5)
          .attr('fill', d => colorScale(d)); // Dùng nhãn "Chạy", "Dừng" để ánh xạ màu

        // Văn bản trong legend
        g.append('text')
          .attr('x', 24)
          .attr('y', 3)
          .attr('dy', '0.1em')
          .attr('font-size', '10px')
          .text(d => d);
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
