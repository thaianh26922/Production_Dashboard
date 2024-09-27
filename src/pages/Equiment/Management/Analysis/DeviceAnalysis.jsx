import React, { useState } from 'react';
import { Select, DatePicker, Space } from 'antd'; // Thêm Select từ antd
import Breadcrumb from '../../../../Components/Breadcrumb/Breadcrumb';
import DowntimePieChart from '../../../../Components/Equiment/Analysis/DowntimePieChart';
import ParetoTimeChart from '../../../../Components/Equiment/Analysis/ParetoTimeChart';
import ParetoFrequencyChart from '../../../../Components/Equiment/Analysis/ParetoFrequencyChart';
import DeviceTable from '../../../../Components/Equiment/Analysis/DeviceTable';
import TitleChart from '../../../../Components/TitleChart/TitleChart'; 
const { RangePicker } = DatePicker;
const { Option } = Select; 

const DeviceAnalysis = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Sample data for downtime, production, and charts
  const downtimeData = [
    { startTime: '08:00', endTime: '08:30', duration: '30 phút', reason: 'Lỗi kỹ thuật' },
    { startTime: '09:00', endTime: '09:15', duration: '15 phút', reason: 'Bảo trì' },
  ];

  const productionData = [
    { startTime: '08:00', endTime: '16:00', workTime: '8h', runTime: '7h', stopTime: '1h', maintenanceTime: '30 phút', runRate: '87%' },
  ];

  const downtimeChartData = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng', 'Xước màn'],
    values: [50, 20, 20, 10],
  };

  const paretoDataTime = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng', 'Xước màn'],
    values: [120, 80, 60, 3],
  };

  const paretoDataFrequency = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng'],
    values: [10, 6, 4],
  };

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

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb />
        {/* Wrap Select and Input in a flex div to keep them in the same row */}
        <div className="flex items-center space-x-4">
          <div className="">
            <Select
              value={selectedMachine}
              onChange={setSelectedMachine}
              placeholder="Chọn máy"
              style={{ width: 200 }} // Sử dụng style của antd
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

      
    <div className="grid grid-cols-5 gap-2 ">
          <div className="col-span-1 bg-white p-3">
            <TitleChart
              title="Downtime Pie Chart"
              timeWindow="Last 24 hours"
              onFullscreen={handleFullscreen}
              onPrint={handlePrint}
            />
            <div className=""><DowntimePieChart data={downtimeChartData} /></div>
          </div>

          <div className="col-span-2 bg-white p-3">
            <TitleChart
              title="Pareto Time Chart"
              timeWindow="Last 7 days"
              onFullscreen={handleFullscreen}
              onPrint={handlePrint}
            />
            <ParetoTimeChart data={paretoDataTime.values} labels={paretoDataTime.labels} />
          </div>
          <div className="col-span-2 bg-white p-3">
            <TitleChart
              title="Pareto Frequency Chart"
              timeWindow="Last 30 days"
              onFullscreen={handleFullscreen}
              onPrint={handlePrint}
            />
            <div className=""> <ParetoFrequencyChart data={paretoDataFrequency.values} labels={paretoDataFrequency.labels} /></div>
          </div>
     </div>
    <div className="bg-white p-3 mt-2">
          <TitleChart
            title="Device Downtime and Production"
            timeWindow="Last 7"
            onFullscreen={handleFullscreen}
            onPrint={handlePrint}
          />
          <DeviceTable downtimeData={downtimeData} productionData={productionData} />
    </div>
      
    </>
  );
};

export default DeviceAnalysis;
