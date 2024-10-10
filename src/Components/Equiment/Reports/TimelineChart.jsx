import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import axios from 'axios';

const TimelineChart = ({ selectedDate }) => {

  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(''); // Thêm state cho token
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  const getNewAccessToken = async () => {
    try {
      const response = await axios.post('http://cloud.datainsight.vn:8080/api/auth/login', {
        username: 'oee2024@gmail.com',
        password: 'Oee@2124'
      });
      const newToken = response.data.token;
      setAccessToken(newToken); 
      return newToken; 
    } catch (error) {
      setError('Error refreshing access token');
      console.error('Error refreshing access token:', error);
      return null;
    }
  };

  const fetchData = async (startDate, endDate, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://cloud.datainsight.vn:8080/api/plugins/telemetry/DEVICE/543ff470-54c6-11ef-8dd4-b74d24d26b24/values/timeseries?keys=status&interval=36000&limit=10000&startTs=${startDate}&endTs=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.status);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await getNewAccessToken();
        if (newToken) {
          await fetchData(startDate, endDate, newToken);
        }
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.length === 2) {
      const startDate = Math.min(selectedDate[0].valueOf(), selectedDate[1].valueOf());
      const endDate = Math.max(selectedDate[0].valueOf(), selectedDate[1].valueOf());
      fetchData(startDate, endDate, accessToken);
    }
  }, [selectedDate, accessToken]);

  useEffect(() => {
    const fetchInitialToken = async () => {
      const token = await getNewAccessToken();
      setAccessToken(token);
    };
    fetchInitialToken();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const margin = { top: 20, right: 35, bottom: 50, left: 50 };

    const processedData = data.map(d => ({
      date: moment(d.ts).format('YYYY-MM-DD'),
      startTime: moment(d.ts).format('HH:mm'),
      endTime: moment(d.ts + 3600000).format('HH:mm'),
      status: d.value === '1' ? 'Chạy' : 'Dừng',
    }));

    svg.selectAll('*').remove();

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
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Chạy', 'Dừng', 'Offline'])
      .range(['#00f600', '#f60000', '#d3d3d3']);

    const OfflineData = [];
    uniqueDates.forEach(date => {
      const dateData = processedData.filter(d => d.date === date);
      dateData.sort((a, b) => timeParse(a.startTime) - timeParse(b.startTime));

      for (let i = 0; i < dateData.length - 1; i++) {
        const currentEnd = timeParse(dateData[i].endTime);
        const nextStart = timeParse(dateData[i + 1].startTime);
        if (nextStart - currentEnd > 0) {
          OfflineData.push({
            date: date,
            startTime: timeFormat(currentEnd),
            endTime: timeFormat(nextStart),
            status: 'Offline',
          });
        }
      }

      const firstStart = timeParse(dateData[0].startTime);
      const lastEnd = timeParse(dateData[dateData.length - 1].endTime);

      if (firstStart > timeParse('00:00')) {
        OfflineData.push({
          date: date,
          startTime: timeFormat(timeParse('00:00')),
          endTime: timeFormat(firstStart),
          status: 'Offline',
        });
      }
      if (lastEnd < timeParse('23:59')) {
        OfflineData.push({
          date: date,
          startTime: timeFormat(lastEnd),
          endTime: timeFormat(timeParse('23:59')),
          status: 'Offline',
        });
      }
    });

    svg
      .selectAll('rect.Offline')
      .data(OfflineData)
      .enter()
      .append('rect')
      .attr('class', 'Offline')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', d => yScale(d.date) + yScale.bandwidth() / 4) // Đặt giữa các tick date
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 0;
      })
      .attr('height', Math.min(yScale.bandwidth() / 2, 20))
      .attr('fill', d => colorScale(d.status));

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 40})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(2)).tickFormat(timeFormat))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => dateFormat(dateParse(d))));

    svg
      .selectAll('rect.data')
      .data(processedData)
      .enter()
      .append('rect')
      .attr('class', 'data')
      .attr('x', d => xScale(timeParse(d.startTime)) + 1)
      .attr('y', d => yScale(d.date) + yScale.bandwidth() / 4) // Đặt giữa các tick date
      .attr('width', d => {
        const width = xScale(timeParse(d.endTime)) - xScale(timeParse(d.startTime));
        return width > 0 ? width : 0;
      })
      .attr('height', Math.min(yScale.bandwidth() / 2, 20))
      .attr('fill', d => colorScale(d.status))
      .append('title')
      .text(d => `${d.status}: ${d.startTime} - ${d.endTime}`);

    const legendData = ['Chạy', 'Dừng', 'Offline'];

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
