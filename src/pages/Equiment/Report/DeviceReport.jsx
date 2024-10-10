import React, { useState } from 'react';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb';
import DowntimePieChart from '../../../Components/Equiment/Analysis/DowntimePieChart';
import TitleChart from '../../../Components/TitleChart/TitleChart';
import { Select, DatePicker } from 'antd'; 
import RuntimeTrendChart from '../../../Components/Equiment/Reports/RuntimeTrendChart';
import RepairBarChart from '../../../Components/Equiment/Reports/RepairBarChart'; // Import RepairBarChart
import StackedBarChart from '../../../Components/Equiment/Reports/StackedBarChart';
import TimelineChart from '../../../Components/Equiment/Reports/TimelineChart';
import { datastatus } from '../../../data/status'; 
const { RangePicker } = DatePicker;
const { Option } = Select;

function DeviceReport() {
  const [selectedMachines, setSelectedMachines] = useState([]);  // Now multiple selections
  const [selectedDate, setSelectedDate] = useState(null);

  const machineOptions = [
    
    // Add the rest of the CNC and PHAY machines
    ...Array.from({ length: 17 }, (_, i) => ({
      value: `CNC${i + 1}`,
      label: `CNC ${i + 1}`
    })),
    ...Array.from({ length: 18 }, (_, i) => ({
      value: `PHAY${i + 1}`,
      label: `PHAY ${i + 1}`
    }))
  ];

  const handleFullscreen = () => {
    console.log("Fullscreen chart");
  };

  const handlePrint = () => {
    console.log("Print chart");
  };

  const handleDateChange = (dates) => {
    setSelectedDate(dates);
  };

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
        backgroundColor: 'green',
        borderColor: 'green',
        borderWidth: 2,
      }
    ],
  };

  const repairDowntimeBarData = {
    labels: ['22/09', '23/09', '24/09', '25/09'],
    datasets: [
      {
        label: "",
        data: [1, 2, 1, 2, 3, 4],
        backgroundColor: 'rgba(5, 65, 151, 0.96)',
        borderColor: 'rgba(5, 65, 151, 1)',
        borderWidth: 1,
      }
    ],
  };

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        
        <div className="flex items-center space-x-4">
          <Select
            mode="multiple"  // Allow multiple selections
            value={selectedMachines}
            onChange={setSelectedMachines}
            placeholder="Chọn máy"
            style={{ width: 300 }}
          >
            {machineOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          
          <RangePicker onChange={handleDateChange} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 p-1">
        {/* Charts */}
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

      <div className="grid grid-cols-2 gap-2 p-1">
        <div className="bg-white p-3 col-span-1 rounded-lg">
          <TitleChart
            title="Ngăn xếp trạng thái"
            timeWindow="Last 24 hours"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          <TimelineChart data={datastatus.status} selectedDate={selectedDate} />
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
