import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import moment from 'moment';

const MachineTimeline = ({ deviceCode, selectedDate }) => {
  const fixedHeight = 150;
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [deviceData, setDeviceData] = useState({});
  const [dimensions, setDimensions] = useState({ width: 800, height: fixedHeight });
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const formatDateForAPI = (date) => moment(date).format('YYYY-MM-DD');

  const addOfflineIntervals = (data) => {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      const currentInterval = data[i];
      newData.push(currentInterval);
      if (i < data.length - 1) {
        const nextInterval = data[i + 1];
        const currentEndTime = moment(currentInterval.endTime, 'HH:mm');
        const nextStartTime = moment(nextInterval.startTime, 'HH:mm');

        if (currentEndTime.isBefore(nextStartTime)) {
          newData.push({
            startTime: currentEndTime.format('HH:mm'),
            endTime: nextStartTime.format('HH:mm'),
            status: 'Offline'
          });
        }
      }
    }
    return newData;
  };

  const fetchTelemetryData = async (code) => {
    try {
      const formattedStartDate = formatDateForAPI(selectedDate);
      const formattedEndDate = formatDateForAPI(selectedDate);
      const apiEndpoint = `${apiUrl}/telemetry?deviceId=${code}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const response = await axios.get(apiEndpoint);
      console.log(`Full API Response for ${code}:`, response.data);

      if (response.data && response.data.length > 0 && response.data[0].intervals) {
        const flatData = response.data[0].intervals.flatMap(interval => ({
          startTime: moment(interval.startTime, 'HH:mm').format('HH:mm'),
          endTime: moment(interval.endTime, 'HH:mm').format('HH:mm'),
          status: interval.status
        }));
        const processedData = addOfflineIntervals(flatData);
        console.log(`Processed Data with Offline Intervals for ${code}:`, processedData);
        setDeviceData(prevData => ({ ...prevData, [code]: processedData }));
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
    console.log(`Selected Date Changed: ${selectedDate}`); // Log selectedDate changes
    if (deviceCode) {
      fetchTelemetryData(deviceCode); // Gọi lại API khi selectedDate thay đổi
    }
  }, [deviceCode, selectedDate]); // Đảm bảo selectedDate có trong mảng phụ thuộc

  useEffect(() => {
    const drawChart = () => {
      if (!deviceData[deviceCode] || deviceData[deviceCode].length === 0) {
        console.log(`No data to render for ${deviceCode}`);
        return;
      }

      const data = deviceData[deviceCode];
      const svg = d3.select(svgRef.current);
      const { width, height } = dimensions;
      const margin = { top: 20, right: 35, bottom: 80, left: 50 };

      svg.selectAll('*').remove(); // Xóa biểu đồ cũ

      const timeParse = d3.timeParse('%H:%M');
      const timeFormat = d3.timeFormat('%H:%M');

      const xScale = d3
        .scaleTime()
        .domain([timeParse('00:00'), timeParse('23:59')])
        .range([margin.left, width - margin.right]);

      const colorScale = d3
        .scaleOrdinal()
        .domain(['Chạy', 'Dừng', 'Offline'])
        .range(['#4aea4a', '#f10401', '#d3d3d3']);

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

      const totalTime = {
        'Chạy': 0,
        'Dừng': 0,
        'Offline': 0
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
      const totalOfflineHours = Math.floor(totalTime['Offline'] / 60);
      const totalOfflineMinutes = totalTime['Offline'] % 60;

      const legendData = [
        { status: 'Chạy', time: `${totalRunningHours} giờ ${totalRunningMinutes} phút`, color: '#4aea4a' },
        { status: 'Dừng', time: `${totalStoppedHours} giờ ${totalStoppedMinutes} phút`, color: '#f10401' },
        { status: 'Offline', time: `${totalOfflineHours} giờ ${totalOfflineMinutes} phút`, color: '#d3d3d3' },
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
    };

    drawChart(); // Vẽ lại biểu đồ khi có dữ liệu mới
  }, [deviceData, dimensions, deviceCode]);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { clientWidth } = wrapperRef.current;
        setDimensions({ width: clientWidth, height: fixedHeight });
      }
    };

    handleResize(); // Đặt kích thước ban đầu
    window.addEventListener('resize', handleResize); // Thêm sự kiện resize

    return () => window.removeEventListener('resize', handleResize); // Dọn dẹp
  }, []);

  return (
    <div ref={wrapperRef} style={{ overflowX: 'auto' }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default MachineTimeline;
