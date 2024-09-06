import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, CartesianGrid, YAxis, Legend } from 'recharts';

// Dữ liệu trạng thái máy từ 8:00 đến 17:00
const data = [
  { time: '08:00', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
  { time: '08:30', Run: 0, ChangeLine: 1, Wait: 0, Error: 0 },
  { time: '09:00', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
  { time: '09:30', Run: 0, ChangeLine: 0, Wait: 1, Error: 0 },
  { time: '10:00', Run: 0, ChangeLine: 0, Wait: 0, Error: 1 },
  { time: '10:30', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
  { time: '11:00', Run: 0, ChangeLine: 1, Wait: 0, Error: 0 },
  { time: '11:30', Run: 0, ChangeLine: 0, Wait: 1, Error: 0 },
  { time: '12:00', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
  { time: '12:30', Run: 0, ChangeLine: 0, Wait: 0, Error: 1 },
  { time: '13:00', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
  { time: '13:30', Run: 0, ChangeLine: 1, Wait: 0, Error: 0 },
  { time: '14:00', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
  { time: '14:30', Run: 0, ChangeLine: 0, Wait: 1, Error: 0 },
  { time: '15:00', Run: 0, ChangeLine: 0, Wait: 0, Error: 1 },
  { time: '15:30', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
  { time: '16:00', Run: 0, ChangeLine: 1, Wait: 0, Error: 0 },
  { time: '16:30', Run: 0, ChangeLine: 0, Wait: 1, Error: 0 },
  { time: '17:00', Run: 1, ChangeLine: 0, Wait: 0, Error: 0 },
];

// Tạo biểu đồ thanh trạng thái duy nhất với chiều cao bằng nhau và liên tục từ 8:00 đến 17:00
const MachineStatusHistory = () => {
  return (
    <BarChart
      width={1000}
      height={150}  // Điều chỉnh chiều cao tổng thể để tập trung vào thanh duy nhất
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}  // Đặt khoảng cách cho Legend
      barGap={0}  // Không có khoảng cách giữa các thanh
      barCategoryGap="0%"  // Thanh sát nhau
    >
      <CartesianGrid strokeDasharray="3 3" />
      
      {/* Trục Ox với các mốc thời gian */}
      <XAxis 
        dataKey="time"
        interval={0}  // Hiển thị toàn bộ mốc thời gian
        tick={{ angle: 0, textAnchor: 'end' }}  // Không xoay mốc thời gian
      />
      
      {/* Trục Oy ẩn đi vì các thanh có chiều cao bằng nhau */}
      <YAxis hide />
      
      <Tooltip />
      aaaaaaa
      
      {/* Legend để giải thích các màu của trạng thái */}
      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      
      {/* Thanh trạng thái duy nhất với các màu khác nhau */}
      <Bar dataKey="Run" stackId="a" fill="#00FF00" name="Run" />
      <Bar dataKey="ChangeLine" stackId="a" fill="#0000FF" name="Change Line" />
      <Bar dataKey="Wait" stackId="a" fill="#FFFF00" name="Wait" />
      <Bar dataKey="Error" stackId="a" fill="#FF0000" name="Error" />
    </BarChart>
  );
};

export default MachineStatusHistory;
