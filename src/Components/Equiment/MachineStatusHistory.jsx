import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

// Định nghĩa màu sắc cho các keys
const colors = {
  "Run_Time": "#DAF7A6",
  "Lock_Number": "#FFC300",
  "CUR_Motor": "#581845",
  "RE_Botda": "#DAF7A6",
  "RE_DAU": "#FFC300",
  "RE_Lieu": "#FF5733",
  "Chot_VT": "#FF5738",
  
  
};

const MachineStatusHistory = () => {
  const [historyData, setHistoryData] = useState([]); // Lưu trữ dữ liệu lịch sử máy
  const svgRef = useRef();
  const legendRef = useRef();

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get(
          'http://172.104.177.67:3030/api/plugins/telemetry/DEVICE/1f94f820-2ef0-11ef-a0d4-19a5fffe4fcb/values/timeseries?keys=HMI_Mixing:Run_Time,HMI_Mixing:Lock_Number,HMI_Mixing:RE_DAU,HMI_Mixing:RE_Lieu,HMI_Mixing:Chot_VT',
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXNzeXN0ZW1AZ21haWwuY29tIiwidXNlcklkIjoiYTgzNDkyNjAtMmUyNS0xMWVmLWEwZDQtMTlhNWZmZmU0ZmNiIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJjOGI0MTkwZi1mNzljLTQ0MDctYmMwYS00YTlhYjYwM2ZjMmMiLCJleHAiOjE3MjY2NTY5ODMsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzI2NjQ3OTgzLCJmaXJzdE5hbWUiOiJNRVMiLCJsYXN0TmFtZSI6Ik9SUyIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI5YWE0NDgyMC0yZTI1LTExZWYtYTBkNC0xOWE1ZmZmZTRmY2IiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.zEb0Dr3j3tQ957kiVt5SK9m0a6UZrJNpJNUykQjzsDZ-nSyAPRJlyR2GR0CMAsR4ZmkzWHdXZ1SEmNjV7-bYQw`, // Thay thế bằng JWT Token của bạn
            },
          }
        );

        const rawData = response.data;
        const formattedData = formatHistoryData(rawData); // Xử lý dữ liệu API
        setHistoryData(formattedData); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchHistoryData(); // Gọi API khi component mount
  }, []);

  // Hàm xử lý dữ liệu thô từ API thành dữ liệu lịch sử máy
  const formatHistoryData = (rawData) => {
    const formattedData = []; // Kết quả xử lý
    const keys = Object.keys(rawData); // Các key từ API

    keys.forEach((key) => {
      const telemetryData = rawData[key]; // Dữ liệu telemetry theo key
      telemetryData.forEach((entry) => {
        const timeInMinutes = new Date(entry.ts).getHours() * 60 + new Date(entry.ts).getMinutes();
        const duration = parseFloat(entry.value); // Chuyển đổi giá trị thành thời gian
        formattedData.push({
          time: timeInMinutes,
          key, // Sử dụng key làm trạng thái
          duration,
        });
      });
    });

    return formattedData;
  };

  useEffect(() => {
    if (!historyData || historyData.length === 0) return;

    // Set kích thước của biểu đồ
    const width = 1000;
    const height = 100;  // Chiều cao của biểu đồ chính
    const margin = { top: 20, right: 30, bottom: 40, left: 20 };

    // Tạo SVG cho biểu đồ chính
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0000');

    // Tạo thang đo x cho trục thời gian từ 6:00 đến 06:00 hôm sau
    const totalMinutesInDay = 24 * 60; // Tổng số phút trong 24 giờ
    const startTime = 6 * 60; // 6:00 sáng, tính bằng phút
    const endTime = startTime + totalMinutesInDay; // 6:00 sáng hôm sau

    const xScale = d3.scaleLinear()
      .domain([startTime, endTime]) // Từ 06:00 (360 phút) đến 06:00 sáng hôm sau
      .range([margin.left, width - margin.right]);

    // Xóa các phần tử cũ
    svg.selectAll("*").remove();

    // Đặt lại tổng thời gian tích lũy
    let totalElapsedMinutes = startTime;  // Bắt đầu từ 6:00 sáng

    // Tạo nhóm thanh bars
    svg.selectAll('rect')
      .data(historyData)
      .join('rect')
      .attr('x', d => {
        const xPos = xScale(totalElapsedMinutes);  
        totalElapsedMinutes += d.duration;  // Tích lũy thời gian
        return xPos;
      })
      .attr('y', margin.top)
      .attr('width', d => {
        const barWidth = xScale(totalElapsedMinutes) - xScale(totalElapsedMinutes - d.duration);
        return barWidth > 0 ? barWidth : 0;
      })
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', d => colors[d.key] || '#000'); // Sử dụng màu theo key hoặc màu mặc định nếu không tìm thấy

    // Thêm trục x với các mốc thời gian chính từ 06:00 đến 06:00 hôm sau
    const xAxis = d3.axisBottom(xScale)
      .tickValues(d3.range(startTime, endTime + 60, 60))  // Mốc thời gian mỗi giờ
      .tickFormat(d => {
        let hour = Math.floor((d % totalMinutesInDay) / 60); // Đảm bảo không vượt qua 24 giờ
        return hour.toString().padStart(2, '0') + ":00";  // Hiển thị giờ dưới dạng HH:00
      });

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    // Cập nhật phần legend dựa trên dữ liệu đã lọc
    const totalDuration = d3.sum(historyData, d => d.duration); // Tính tổng thời gian từ dữ liệu hiện tại

    const legend = d3.select(legendRef.current)
      .attr('width', width)
      .attr('height', 100); // Tăng chiều cao legend để hiển thị 2 hàng

    // Xóa legend cũ trước khi thêm legend mới
    legend.selectAll('*').remove();

    const legendGroup = legend.selectAll('.legend')
      .data(Object.keys(colors))
      .join('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${(i % 9) * 150}, ${Math.floor(i / 9) * 30})`);  // Điều chỉnh vị trí thành 2 hàng

    legendGroup.append('rect')
      .attr('x', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => colors[d]);

    legendGroup.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.3em')
      .style('font-size', '12px')
      .text(d => {
        const statusDuration = d3.sum(historyData.filter(item => item.key === d), item => item.duration);
        const percentage = totalDuration > 0 ? ((statusDuration / totalDuration) * 100).toFixed(2) : 0;
        return `${d} (${percentage}%)`;
      });

  }, [historyData]); // Đảm bảo cập nhật khi historyData thay đổi

  return (
    <div>
      <svg ref={svgRef}></svg>
      <svg ref={legendRef}></svg>
    </div>
  );
};

export default MachineStatusHistory;
