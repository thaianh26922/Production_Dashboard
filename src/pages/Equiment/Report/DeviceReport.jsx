import React, { useState } from 'react';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb';
import DowntimePieChart from '../../../Components/Equiment/Analysis/DowntimePieChart';
import TitleChart from '../../../Components/TitleChart/TitleChart';
import { Select, DatePicker, Space } from 'antd'; 
import RuntimeTrendChart from '../../../Components/Equiment/Reports/RuntimeTrendChart';
import RepairBarChart from '../../../Components/Equiment/Reports/RepairBarChart'; // Import RepairBarChart
import StackedBarChart from '../../../Components/Equiment/Reports/StackedBarChart';
import TimelineChart from '../../../Components/Equiment/Reports/TimelineChart';

const { RangePicker } = DatePicker;
const { Option } = Select;

function DeviceReport() {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

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

  // Dữ liệu cho các biểu đồ khác
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
        label: "Thời gian dừng sửa chữa (giờ)", // Nhãn cho biểu đồ
        data: [1, 0.5, 1, 2], // Dữ liệu thời gian dừng sửa chữa
        backgroundColor: [
          'rgba(255, 99, 132, 0.9)', // Màu cho cột đầu tiên
          'rgba(54, 162, 235, 0.9)', // Màu cho cột thứ hai
          'rgba(255, 206, 86, 0.9)', // Màu cho cột thứ ba
          'rgba(75, 192, 192, 0.9)', // Màu cho cột thứ tư
        ], // Mảng các màu cho từng cột
        borderColor: [
          'rgba(255, 99, 132, 1)', // Màu viền cho cột đầu tiên
          'rgba(54, 162, 235, 1)', // Màu viền cho cột thứ hai
          'rgba(255, 206, 86, 1)', // Màu viền cho cột thứ ba
          'rgba(75, 192, 192, 1)', // Màu viền cho cột thứ tư
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
          <div className="">
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
          </div>
          <Space direction="vertical" size={20}>
            <RangePicker />
          </Space>
        </div>
      </div>

<div className="grid grid-cols-10 gap-2 p-3">
    {/* Hàng 1: 4 biểu đồ (2 hàng, 2 cột) */}
   
        <div className="bg-white rounded-lg p-4 shadow-md col-span-2 ">
            <TitleChart
                title="Tỷ lệ máy chạy"
                timeWindow="Last 24 hours"
                onFullscreen={handleFullscreen}
                onPrint={handlePrint}
            />
           <div className="h-28"><DowntimePieChart data={runtimeChartData} /></div>
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

        <div className="bg-white rounded-lg p-4 shadow-md col-span-3 ">
            <TitleChart
                title="Xu hướng máy chạy"
                timeWindow="Last 24 hours"
                onFullscreen={handleFullscreen}
                onPrint={handlePrint}
            />
            <div className="w-full h-full mt-8 ml-2">
                <RuntimeTrendChart data={runtimeTrendData} />
            </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md col-span-3">
            <TitleChart
                title="Thời gian dừng sửa chữa"
                timeWindow="Last 24 hours"
                onFullscreen={handleFullscreen}
                onPrint={handlePrint}
            />
            <div className="w-full h-full mt-8 ml-2">
                <RepairBarChart data={repairDowntimeBarData} />
            </div>
        </div>
    </div>

        {/* Hàng 2: Nội dung AA */}
            <div className="grid grid-cols-2 gap-2 p-3">
            
                <div className="bg-white p-3 col-span-1 rounded-lg">
                <TitleChart
                title="Thống kê trạng thái"
                timeWindow="Last 24 hours"
                onFullscreen={handleFullscreen}
                onPrint={handlePrint}
                     />
                    <StackedBarChart />
                </div>
                

                
                <div className="bg-white p-3 col-span-1 rounded-lg">
                <TitleChart
                title="Thống kê trạng thái"
                timeWindow="Last 24 hours"
                onFullscreen={handleFullscreen}
                onPrint={handlePrint}
                     /> 
                   <TimelineChart />
                </div>

                
                
             </div>




    </>
  );
}

export default DeviceReport;
