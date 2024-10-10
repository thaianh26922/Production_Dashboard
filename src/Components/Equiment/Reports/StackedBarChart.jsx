import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import moment from 'moment';

const StackedBarChart = ({ selectedDate }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(''); // Token sẽ được lưu ở đây

  // Hàm lấy token mới
  const getNewAccessToken = async () => {
    try {
      const response = await axios.post('http://cloud.datainsight.vn:8080/api/auth/login', {
        username: 'oee2024@gmail.com', 
        password: 'Oee@2124' 
      });
      const token = response.data.token;
      setAccessToken(token); // Lưu token vào state
      return token;
    } catch (error) {
      console.error('Error getting new access token:', error);
      throw new Error('Could not refresh access token');
    }
  };

  // Hàm lấy dữ liệu từ API và tự động làm mới token nếu hết hạn
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
      // Nếu gặp lỗi 401, tức là token hết hạn, gọi hàm refresh token
      if (error.response && error.response.status === 401) {
        const newToken = await getNewAccessToken();
        if (newToken) {
          // Nếu lấy token mới thành công, gọi lại API với token mới
          await fetchData(startDate, endDate, newToken);
        }
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  // Gọi API khi selectedDate thay đổi và token đã có
  useEffect(() => {
    const fetchDataWithToken = async () => {
      if (selectedDate && selectedDate.length === 2 && accessToken) {
        const startDate = Math.min(selectedDate[0].valueOf(), selectedDate[1].valueOf());
        const endDate = Math.max(selectedDate[0].valueOf(), selectedDate[1].valueOf());
        await fetchData(startDate, endDate, accessToken);
      }
    };

    if (accessToken) {
      fetchDataWithToken();
    } else {
      // Nếu không có token, lấy token mới
      getNewAccessToken().then(token => {
        if (token && selectedDate && selectedDate.length === 2) {
          const startDate = Math.min(selectedDate[0].valueOf(), selectedDate[1].valueOf());
          const endDate = Math.max(selectedDate[0].valueOf(), selectedDate[1].valueOf());
          fetchData(startDate, endDate, token);
        }
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Xóa biểu đồ cũ

    const margin = { top: 10, right: 30, bottom: 50, left: 40 };
    const width = 780 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Xử lý dữ liệu để tính tổng thời gian cho "Chạy" và "Dừng"
    const formattedData = data.map(d => ({
      date: moment(d.ts).format('YYYY-MM-DD'),
      status: d.value === '1' ? 'Chạy' : 'Dừng',
      duration: 1, // Mặc định mỗi bản ghi có 1 đơn vị thời gian
    }));

    const groupedData = {};
    formattedData.forEach(d => {
      if (!groupedData[d.date]) {
        groupedData[d.date] = { Chạy: 0, Dừng: 0 };
      }
      groupedData[d.date][d.status] += d.duration;
    });

    const labels = Object.keys(groupedData);

    // Tính phần trăm cho mỗi trạng thái
    const stackedData = labels.map(date => {
      const total = groupedData[date].Chạy + groupedData[date].Dừng;
      return {
        date,
        Chạy: (groupedData[date].Chạy / total) * 100,
        Dừng: (groupedData[date].Dừng / total) * 100,
      };
    });

    const stack = d3.stack().keys(['Chạy', 'Dừng']);
    const stackedSeries = stack(stackedData);

    // X Scale (Percentage)
    const xScale = d3.scaleLinear()
      .domain([0, 100]) // X là phần trăm từ 0 đến 100
      .range([0, width]);

    // Y Scale (Dates - sắp xếp ngày gần nhất lên trên và định dạng dd/mm)
    const uniqueDates = [...new Set(formattedData .map(d => d.date))];
    const yScale = d3
      .scaleBand()
      .domain(uniqueDates.sort())
      .range([height,0])
      .padding(0.1);

    const dateFormat = d3.timeFormat('%d/%m'); // Định dạng dd/mm cho trục Y

    // Color Scale
    const colorScale = d3.scaleOrdinal()
      .domain(['Chạy', 'Dừng'])
      .range(['#31e700', '#ff0137']); // Chạy: Xanh lá, Dừng: Đỏ

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Vẽ các thanh biểu đồ
    chart
      .selectAll('.serie')
      .data(stackedSeries)
      .enter()
      .append('g')
      .attr('fill', d => colorScale(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('y', d => yScale(d.data.date))
      .attr('x', d => xScale(d[0]))
      .attr('width', d => xScale(d[1]) - xScale(d[0]))
      .attr('height', yScale.bandwidth())
      .append('title') // Tooltip
      .text(d => `${d.data.date}: ${(d[1] - d[0]).toFixed(1)}%`);

    // Thêm nhãn phần trăm vào các thanh
    chart
      .selectAll('.serie')
      .data(stackedSeries)
      .enter()
      .append('g')
      .attr('fill', 'white')
      .selectAll('text')
      .data(d => d)
      .enter()
      .append('text')
      .attr('font-size', '12px')
      .attr('x', d => xScale(d[0]) + 10)
      .attr('y', d => yScale(d.data.date) + yScale.bandwidth() / 2)
      .attr('dy', '.30em')
      .attr('text-anchor', 'start')
      .text(d => `${(d[1] - d[0]).toFixed(1)}%`);

    // X Axis (Percentage)
    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d + '%'));

    // Y Axis (Dates)
    chart
      .append('g')
      .call(d3.axisLeft(yScale).tickFormat(date => dateFormat(new Date(date))));

    // Vẽ chú thích (Legend)
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.bottom - 5})`);

    const legendData = ['Chạy', 'Dừng'];

    legend
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * 100}, 0)`)
      .call(g => {
        // Hình chữ nhật cho chú thích
        g.append('rect')
          .attr('width', 18)
          .attr('height', 5)
          .attr('fill', colorScale);

        // Văn bản chú thích
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
    <svg ref={svgRef} width="800" height="450"></svg>
  );
};

export default StackedBarChart;
