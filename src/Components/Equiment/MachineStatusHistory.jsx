import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

// Định nghĩa màu sắc và trạng thái cho các giá trị PLC:STATUS
const statusMapping = {
  1: { label: "Run", color: "#28a745" },   // Chạy (Xanh lá)
  2: { label: "Stop", color: "#ffc107" },  // Dừng (Vàng)
  3: { label: "Failed", color: "#dc3545" },// Lỗi (Đỏ)
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
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXNzeXN0ZW1AZ21haWwuY29tIiwidXNlcklkIjoiZDQwNWQ2MDAtNDUwNS0xMWVmLWI4YzMtYTEzNjI1MjQ1ZWNhIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiI2Mzk0NzBlNy00MDY1LTQ4ODQtYTlkOS03NTU0ZjE3NTVlNzUiLCJleHAiOjE3MjY3MzcxMjcsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzI2NzI4MTI3LCJmaXJzdE5hbWUiOiJNRVMiLCJsYXN0TmFtZSI6Ik9SUyIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI4MDc0MTkyMC00NTA1LTExZWYtYTkxMC05ZjYzZTY1ZjJhNzciLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.plZH-_utg-xyT3LtoNsMWQzgSuV3zOSf6D4W7qSShRUbdMNVPGtz8kmF-fGim8u0Q1i4gRvHP9WN-yRV_irgIw`, // Thay bằng JWT Token của bạn
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
        const startTime = new Date(entry.ts);  // Chuyển timestamp Unix thành đối tượng Date
        const nextEntry = telemetryData[index + 1];  // Trạng thái tiếp theo
        const endTime = nextEntry ? new Date(nextEntry.ts) : new Date();  // Nếu không có trạng thái tiếp theo, dùng thời gian hiện tại làm thời gian kết thúc

        const duration = (endTime - startTime) / 60000;  // Thời gian kéo dài (tính bằng phút)

        // Lấy giờ và phút từ timestamp hiện tại
        const hours = startTime.getHours(); 
        const minutes = startTime.getMinutes();
        const timeInMinutes = hours * 60 + minutes;  // Tính tổng số phút từ đầu ngày

        formattedData.push({
          time: timeInMinutes,  // Thời gian (phút trong ngày)
          key: parseInt(entry.value),  // Giá trị của trạng thái (1, 2, hoặc 3)
          duration,  // Thời gian kéo dài của trạng thái
        });
      });
    });

    return formattedData;
  };

  useEffect(() => {
    if (!historyData || historyData.length === 0) return;
  
    // Set kích thước của biểu đồ
    const width = 1200;
    const height = 120;  // Chiều cao của biểu đồ chính
    const margin = { top: 20, right: 30, bottom: 60, left: 20 };  // Thêm padding cho trục
  
    // Tạo SVG cho biểu đồ chính
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0000'); // Đặt màu nền nhạt
  
    // Tạo thang đo x cho trục thời gian từ 00:00 đến 23:59
    const totalMinutesInDay = 24 * 60; // Tổng số phút trong 24 giờ
    const startTime = 0; // Bắt đầu từ 00:00 (phút đầu tiên của ngày)
    const endTime = totalMinutesInDay; // Kết thúc lúc 23:59 (1440 phút)
  
    const xScale = d3.scaleLinear()
      .domain([startTime, endTime]) // Trục thời gian từ startTime đến endTime
      .range([margin.left, width - margin.right]);
  
    // Xóa các phần tử cũ
    svg.selectAll("*").remove();
  
    // Đặt lại tổng thời gian tích lũy
    let totalElapsedMinutes = startTime;  // Bắt đầu từ 00:00
  
    // Tạo nhóm thanh bars
    svg.selectAll('rect')
      .data(historyData)
      .join('rect')
      .attr('x', d => {
        const xPos = xScale(d.time);  // Xác định vị trí x theo thời gian
        return xPos;
      })
      .attr('y', margin.top)
      .attr('width', d => {
        const barWidth = xScale(d.time + d.duration) - xScale(d.time); // Xác định chiều rộng của thanh
        return barWidth > 0 ? barWidth : 0;
      })
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', d => statusMapping[d.key].color); // Sử dụng màu theo trạng thái (1, 2, 3)
  
    // Thêm trục x với các mốc thời gian chính từ 00:00 đến 23:59
    const xAxis = d3.axisBottom(xScale)
      .tickValues(d3.range(startTime, endTime + 60, 60))  // Mốc thời gian mỗi giờ
      .tickFormat(d => {
        let hour = Math.floor((d % totalMinutesInDay) / 60); // Đảm bảo không vượt qua 24 giờ
        return hour.toString().padStart(2, '0') + ":00";  // Hiển thị giờ dưới dạng HH:00
      });
  
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style('font-size', '12px'); // Cải thiện kích thước chữ trục x
  
    // Tính tổng thời gian hoạt động của từng trạng thái
    const statusDurations = historyData.reduce((acc, d) => {
      const status = statusMapping[d.key].label;
      acc[status] = (acc[status] || 0) + d.duration;
      return acc;
    }, {});
  
    // Đảm bảo tất cả các trạng thái đều có trong statusDurations với giá trị mặc định là 0 nếu không có dữ liệu
    Object.keys(statusMapping).forEach(key => {
      const label = statusMapping[key].label;
      if (!statusDurations[label]) {
        statusDurations[label] = 0;
      }
    });
  
    const totalDuration = d3.sum(historyData, d => d.duration); // Tính tổng thời gian từ dữ liệu hiện tại
  
    // Cập nhật phần legend dựa trên dữ liệu đã lọc
    const legend = d3.select(legendRef.current)
      .attr('width', width)
      .attr('height', 40); // Tăng chiều cao legend
    legend.attr('transform', 'translate(15, 0)');
  
    // Xóa legend cũ trước khi thêm legend mới
    legend.selectAll('*').remove();
  
    // Tạo nhóm cho từng mục legend
    const legendGroup = legend.selectAll('.legend')
      .data(Object.entries(statusDurations)) // Lấy giá trị và thời gian của Run, Stop, Failed
      .join('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${i * 150}, 0)`);  // Sắp xếp legend ngang hàng
  
    // Thêm hình chữ nhật vào legend
    legendGroup.append('rect')
      .attr('x', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => statusMapping[d[0] === 'Run' ? 1 : d[0] === 'Stop' ? 2 : 3].color); // Sử dụng màu từ statusMapping
  
    // Thêm nhãn và phần trăm thời gian
    legendGroup.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('dy', '0.2em')
      .style('font-size', '12px')
      .text(d => {
        const percent = totalDuration > 0 ? ((d[1] / totalDuration) * 100).toFixed(2) : "0.00"; // Tính phần trăm
        return `${d[0]}: ${percent}%`; // Hiển thị nhãn và phần trăm
      });
  
  }, [historyData]);
  

  return (
    <div>
      <svg ref={svgRef}></svg>
      <svg ref={legendRef}></svg>
    </div>
  );
};

export default MachineStatusHistory;
