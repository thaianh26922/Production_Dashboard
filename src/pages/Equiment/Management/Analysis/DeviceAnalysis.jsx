import React, { useState } from 'react';
import Select from 'react-select';
import Breadcrumb from '../../../../Components/Breadcrumb/Breadcrumb';
import DowntimePieChart from '../../../../Components/Equiment/Analysis/DowntimePieChart';
import ParetoTimeChart from '../../../../Components/Equiment/Analysis/ParetoTimeChart';
import ParetoFrequencyChart from '../../../../Components/Equiment/Analysis/ParetoFrequencyChart';
import DeviceTable from '../../../../Components/Equiment/Analysis/DeviceTable';

const DeviceAnalysis = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Dữ liệu mẫu về downtime, thời gian dừng máy và sản xuất
  const downtimeData = [
    { startTime: '08:00', endTime: '08:30', duration: '30 phút', reason: 'Lỗi kỹ thuật' },
    { startTime: '09:00', endTime: '09:15', duration: '15 phút', reason: 'Bảo trì' },
  ];

  const productionData = [
    { startTime: '08:00', endTime: '16:00', workTime: '8h', runTime: '7h', stopTime: '1h', maintenanceTime: '30 phút', runRate: '87%' },
  ];

  const downtimeChartData = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng'],
    values: [50, 20,30],
  };

  const paretoDataTime = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng'],
    values: [120, 80, 60],
  };

  const paretoDataFrequency = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng'],
    values: [10, 6, 4],
  };

  const machineOptions = [
    { value: 'CNC1', label: 'CNC 01' },
    { value: 'CNC2', label: 'CNC 02' },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb />
        {/* Bọc Select và Input vào một div flex để giữ cùng một hàng */}
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <Select
              options={machineOptions}
              value={selectedMachine}
              onChange={setSelectedMachine}
              placeholder="Chọn máy"
              classNamePrefix="select"
            />
          </div>
          <div className="w-64">
            <input
              type="date"
              className="border p-2 rounded-md w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      
        <>
          <div className="grid grid-cols-5 gap-2 mb-2">
            <div className="col-span-1 bg-white p-3"> <DowntimePieChart data={downtimeChartData} /></div>
            <div className="col-span-2 bg-white p-3"><ParetoTimeChart data={paretoDataTime.values} labels={paretoDataTime.labels} /></div>
            <div className="col-span-2 bg-white p-3"> <ParetoFrequencyChart data={paretoDataFrequency.values} labels={paretoDataFrequency.labels} /></div>
          </div>
           <div className="bg-white p-3">   <DeviceTable downtimeData={downtimeData} productionData={productionData} /></div>
       
        </>
      
    </>
  );
};

export default DeviceAnalysis;
