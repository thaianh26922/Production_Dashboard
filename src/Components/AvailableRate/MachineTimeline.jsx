import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import moment from 'moment';

const MachineTimeline = ({ deviceCode, selectedDate }) => {
  const fixedHeight = 150;
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [deviceData, setDeviceData] = useState({}); // Đối tượng quản lý dữ liệu theo deviceCode
  const [dimensions, setDimensions] = useState({ width: 800, height: fixedHeight });
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const formatDateForAPI = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const fetchTelemetryData = async (code) => {
    try {
      const apiEndpoint = `${apiUrl}/telemetry?deviceId=${code}&startDate=${formatDateForAPI(selectedDate)}&endDate=${formatDateForAPI(selectedDate)}`;
      const response = await axios.get(apiEndpoint);
      console.log(`Full API Response for ${code}:`, response.data);

      // Kiểm tra xem response.data có tồn tại và có dữ liệu intervals không
      if (response.data && response.data.length > 0 && response.data[0].intervals) {
        const flatData = response.data[0].intervals.flatMap(interval => ({
          startTime: moment(interval.startTime, 'HH:mm').format('HH:mm'),
          endTime: moment(interval.endTime, 'HH:mm').format('HH:mm'),
          status: interval.status
        }));
        console.log(`Processed Data for ${code}:`, flatData);
        setDeviceData(prevData => ({ ...prevData, [code]: flatData }));
      } else {
        console.warn(`No intervals found or intervals is undefined for ${code}`);
        setDeviceData(prevData => ({ ...prevData, [code]: [] }));
      }
    } catch (error) {
      console.error(`Error fetching telemetry data for ${code}:`, error);
      setDeviceData(prevData => ({ ...prevData, [code]: [] }));
    }
  };

  useEffect(() => {
    if (deviceCode) {
      fetchTelemetryData(deviceCode);
    }
  }, [deviceCode, selectedDate]);

  useEffect(() => {
    if (!deviceData[deviceCode] || deviceData[deviceCode].length === 0) {
      console.log(`No data to render for ${deviceCode}`);
      return;
    }

    const data = deviceData[deviceCode];
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 35, bottom: 80, left: 50 };

    svg.selectAll('*').remove();

    const timeParse = d3.timeParse('%H:%M');
    const timeFormat = d3.timeFormat('%H:%M');

    const xScale = d3
      .scaleTime()
      .domain([timeParse('00:00'), timeParse('23:59')])
      .range([margin.left, width - margin.right]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#4aea4a', '#f10401']);

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '4px')
      .style('display', 'none')
      .style('pointer-events', 'none');

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 30})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', height - margin.bottom - 60)
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 1;
      })
      .attr('height', 30)
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
        tooltip.style('display', 'none');
      });

    // Tính tổng thời gian cho từng trạng thái
    const totalTime = {
      'Chạy': 0,
      'Dừng': 0
    };

    data.forEach(d => {
      const start = moment(d.startTime, 'HH:mm');
      const end = moment(d.endTime, 'HH:mm');
      const duration = moment.duration(end.diff(start));
      totalTime[d.status] += duration.asMinutes();
    });

    const totalRunningHours = Math.floor(totalTime['Chạy'] / 60);
    const totalRunningMinutes = totalTime['Chạy'] % 60;
    const totalStoppedHours = Math.floor(totalTime['Dừng'] / 60);
    const totalStoppedMinutes = totalTime['Dừng'] % 60;

    // Thêm legend hiển thị tổng thời gian
    const legendData = [
      { status: 'Chạy', time: `${totalRunningHours} giờ ${totalRunningMinutes} phút`, color: '#4aea4a' },
      { status: 'Dừng', time: `${totalStoppedHours} giờ ${totalStoppedMinutes} phút`, color: '#f10401' },
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
      .attr('height', 10)
      .style('fill', d => d.color);

    legend
      .append('text')
      .attr('x', 25)
      .attr('y', 0)
      .text(d => `${d.status}: ${d.time}`)
      .style('font-size', '12px')
      .style('text-anchor', 'start');
  }, [deviceData, dimensions, deviceCode]);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { clientWidth } = wrapperRef.current;
        setDimensions({ width: clientWidth, height: fixedHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: `${fixedHeight}px` }}>
      {!deviceData[deviceCode] || deviceData[deviceCode].length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p>Không có dữ liệu</p>
        </div>
      ) : (
        <svg ref={svgRef} width={dimensions.width} height={fixedHeight + 50}></svg>
      )}
    </div>
  );
};

export default MachineTimeline;
