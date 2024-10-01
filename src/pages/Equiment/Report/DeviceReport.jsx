import React, { useState } from 'react';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb';
import DowntimePieChart from '../../../Components/Equiment/Analysis/DowntimePieChart';
import TitleChart from '../../../Components/TitleChart/TitleChart';
import { Select, DatePicker } from 'antd'; 
import RuntimeTrendChart from '../../../Components/Equiment/Reports/RuntimeTrendChart';
import RepairBarChart from '../../../Components/Equiment/Reports/RepairBarChart'; // Import RepairBarChart
import StackedBarChart from '../../../Components/Equiment/Reports/StackedBarChart';
import TimelineChart from '../../../Components/Equiment/Reports/TimelineChart';

const { RangePicker } = DatePicker;
const { Option } = Select;

function DeviceReport() {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);  // Trạng thái để lưu khoảng thời gian được chọn

  const machineOptions = [
    { value: 'CNC1', label: 'CNC 01' },
    { value: 'CNC2', label: 'CNC 02' },
  ];

  const handleFullscreen = () => {
    console.log("Fullscreen chart");
  };

  const handlePrint = () => {
    console.log("Print chart");
  };

  // Xử lý khi người dùng chọn ngày
  const handleDateChange = (dates) => {
    setSelectedDate(dates); // Lưu ngày được chọn vào state
  };

  // Dữ liệu cho các biểu đồ khác (giữ nguyên)
  const runtimeChartData = {
    labels: ['Dừng', 'Chờ', 'Cài đặt', 'Tắt máy'],
    values: [50, 20, 20, 10],
  };

  const taskChartData = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng', 'Xước màn'],
    values: [50, 20, 20, 10],
  };

  const runtimeTrendData = {
    labels: ['22/09', '23/09', '24/09', '25/09'],
    datasets: [
      {
        label: "Tỷ lệ máy chạy (%)",
        data: [85, 90, 80, 75],
        fill: false,
        backgroundColor: 'green', // Màu nền
        borderColor: 'green',
        borderWidth: 2,
      }
    ],
  };

  // Dữ liệu cho bar chart thời gian dừng sửa chữa
  const repairDowntimeBarData = {
    labels: ['22/09', '23/09', '24/09', '25/09'], // Các ngày
    datasets: [
      {
        label: "", // Nhãn cho biểu đồ
        data: [1, 2, 1, 2,3,4,], // Dữ liệu thời gian dừng sửa chữa
        backgroundColor: [
          'rgba(5, 65, 151, 0.96)', // Màu cho cột đầu tiên
        ], // Mảng các màu cho từng cột
        borderColor: [
          'rgba(5, 65, 151, 1)', // Màu viền cho cột đầu tiên
        ], // Mảng các màu viền cho từng cột
        borderWidth: 1,
      }
    ],
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb />
        <div className="flex items-center space-x-4">
          <Select
            value={selectedMachine}
            onChange={setSelectedMachine}
            placeholder="Chọn máy"
            style={{ width: 200 }}
          >
            {machineOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          
          <RangePicker onChange={handleDateChange} /> {/* Lắng nghe sự thay đổi ngày */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 p-1">
        {/* Hàng 1: 4 biểu đồ (2 hàng, 2 cột) */}
        <div className="bg-white rounded-lg p-4 shadow-md col-span-2 ">
          <TitleChart
            title="Tỷ lệ máy chạy"
            timeWindow="Last 24 hours"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          <div className="h-28">
            <DowntimePieChart data={runtimeChartData} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md col-span-2 ">
          <TitleChart
            title="Phân bố nhiệm vụ"
            timeWindow="Last 24 hours"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          <div className="w-full h-full">
            <DowntimePieChart data={taskChartData} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md col-span-4 ">
          <TitleChart
            title="Xu hướng máy chạy"
            timeWindow="Last 24 hours"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          <div className="w-full h-full mt-1 ml-2 p-2">
            <RuntimeTrendChart data={runtimeTrendData} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 shadow-md col-span-4">
          <TitleChart
            title="Thời gian dừng sửa chữa"
            timeWindow="Last 24 hours"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          <div className="w-full h-full mt-12 ml-2 px-3">
            <RepairBarChart data={repairDowntimeBarData} />
          </div>
        </div>
      </div>

      {/* Hàng 2: Nội dung Timeline và các biểu đồ khác */}
      <div className="grid grid-cols-2 gap-2 p-1">
        <div className="bg-white p-3 col-span-1 rounded-lg">
          <TitleChart
            title="Ngăn xếp trạng thái"
            timeWindow="Last 24 hours"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          {/* Truyền ngày được chọn vào TimelineChart */}
          <TimelineChart selectedDate={selectedDate} />
        </div>
        <div className="bg-white p-3 col-span-1 rounded-lg">
          <TitleChart
            title="Thống kê trạng thái"
            timeWindow="Last 24 hours"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          <StackedBarChart selectedDate={selectedDate} />
        </div>
      </div>
    </>
  );
}

export default DeviceReport;
