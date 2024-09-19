import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

// Định nghĩa màu sắc cho các trạng thái
const colors = {
  "1": "#28a745",  // Chạy (Xanh lá)
  "2": "#ffc107",  // Chờ (Vàng)
  "3": "#dc3545",  // Lỗi (Đỏ)
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
          'http://103.77.215.18:3030/api/plugins/telemetry/DEVICE/9032a0e0-45bc-11ef-b8c3-a13625245eca/values/timeseries?keys=PLC:STATUS',
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXNzeXN0ZW1AZ21haWwuY29tIiwidXNlcklkIjoiZDQwNWQ2MDAtNDUwNS0xMWVmLWI4YzMtYTEzNjI1MjQ1ZWNhIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJiNDkzMjI1YS1jOWI5LTRjNTQtODg5Yy05YTUwMzYyNmZhMjkiLCJleHAiOjE3MjY3MjY2ODAsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzI2NzE3NjgwLCJmaXJzdE5hbWUiOiJNRVMiLCJsYXN0TmFtZSI6Ik9SUyIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI4MDc0MTkyMC00NTA1LTExZWYtYTkxMC05ZjYzZTY1ZjJhNzciLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.UQmvIN4nPWK8tiESHcEZJqXGJx1Oj8-rzy_5rY0dSAAJdA4DhIBobtEHeQgmQkCrLOD9mXSxsEWgnlkDhFEsjg`, // Thay thế bằng JWT Token của bạn
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
      telemetryData.forEach((entry, index) => {
        const startTime = new Date(entry.ts);  // Thời gian bắt đầu của trạng thái
        const nextEntry = telemetryData[index + 1];  // Trạng thái tiếp theo
        const endTime = nextEntry ? new Date(nextEntry.ts) : new Date();  // Nếu không có trạng thái tiếp theo, dùng thời gian hiện tại làm thời gian kết thúc

        const duration = (endTime - startTime) / 60000;  // Thời gian kéo dài (tính bằng phút)
        formattedData.push({
          time: startTime.getHours() * 60 + startTime.getMinutes(),  // Tính thời gian bắt đầu trong ngày (phút)
          key: entry.value,  // Giá trị của trạng thái (1, 2, hoặc 3)
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
      .style('background-color', '#f0f0f0');

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
        const xPos = xScale(d.time);  
        return xPos;
      })
      .attr('y', margin.top)
      .attr('width', d => {
        const barWidth = xScale(d.time + d.duration) - xScale(d.time);
        return barWidth > 0 ? barWidth : 0;
      })
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', d => colors[d.key] || '#000');  // Màu tương ứng với trạng thái chạy (1), chờ (2), lỗi (3)

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
