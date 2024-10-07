import React, { useState } from 'react';
import { Select, DatePicker } from 'antd';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb'; // Đường dẫn tới Breadcrumb
import AvailableGrid from '../../../Components/AvailableRate/AvailableGrid'; // Import AvailableGrid
import MachineComparisonChart from '../../../Components/AvailableRate/MachineComparisonChart';


const onChange = (date, dateString) => {
  console.log(date, dateString);
};


const { Option } = Select;

function AvailableRate() {
  const [selectedMachineType, setSelectedMachineType] = useState('CNC'); // State cho loại máy
  const [selectedDate, setSelectedDate] = useState(null);

  // Danh sách máy CNC và PHAY
  const cncMachines = Array.from({ length: 17 }, (_, i) => ({ value: `CNC ${i + 1}`, label: `CNC ${i + 1}` }));
  const phayMachines = Array.from({ length: 18 }, (_, i) => ({ value: `PHAY ${i + 1}`, label: `PHAY ${i + 1}` }));

  // Dữ liệu giả lập cho máy CNC và PHAY
  const generateSimulatedData = (machineType) => {
    if (machineType === 'CNC') {
      return [
        { machine: 'CNC 1', percentage: 75 },
        { machine: 'CNC 2', percentage: 65 },
        { machine: 'CNC 3', percentage: 90 },
        { machine: 'CNC 4', percentage: 75 },
        { machine: 'CNC 5', percentage: 65 },
        { machine: 'CNC 6', percentage: 90 },
        { machine: 'CNC 7', percentage: 75 },
        { machine: 'CNC 8', percentage: 65 },
        { machine: 'CNC 9', percentage: 90 },
        { machine: 'CNC 10', percentage: 75 },
        { machine: 'CNC 11', percentage: 65 },
        { machine: 'CNC 12', percentage: 90 },
        { machine: 'CNC 13', percentage: 75 },
        { machine: 'CNC 14', percentage: 65 },
        { machine: 'CNC 15', percentage: 90 },
        { machine: 'CNC 16', percentage: 65 },
        { machine: 'CNC 17', percentage: 90 },
      ];
    } else if (machineType === 'PHAY') {
      return [
        { machine: 'PHAY 1', percentage: 80 },
        { machine: 'PHAY 2', percentage: 55 },
        { machine: 'PHAY 3', percentage: 70 },
        { machine: 'PHAY 1', percentage: 80 },
        { machine: 'PHAY 2', percentage: 55 },
        { machine: 'PHAY 3', percentage: 70 },
        { machine: 'PHAY 4', percentage: 80 },
        { machine: 'PHAY 5', percentage: 55 },
        { machine: 'PHAY 6', percentage: 70 },
        { machine: 'PHAY 7', percentage: 80 },
        { machine: 'PHAY 8', percentage: 90 },
        { machine: 'PHAY 9', percentage: 89 },
        { machine: 'PHAY 10', percentage: 80 },
        { machine: 'PHAY 11', percentage: 55 },
        { machine: 'PHAY 12', percentage: 70 },
        { machine: 'PHAY 13', percentage: 80 },
        { machine: 'PHAY 15', percentage: 55 },
        { machine: 'PHAY 16', percentage: 70 },
        { machine: 'PHAY 17', percentage: 55 },
        { machine: 'PHAY 18', percentage: 79 },

      ];
    }
    return [];
  };

  const [data, setData] = useState(generateSimulatedData(selectedMachineType));

  // Hàm xử lý khi chọn loại máy từ Select
  const handleMachineTypeSelect = (value) => {
    setSelectedMachineType(value);
    setData(generateSimulatedData(value)); // Cập nhật dữ liệu biểu đồ khi thay đổi loại máy
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex items-center space-x-2">
          {/* Lựa chọn loại máy CNC hoặc PHAY */}
          <Select
            value={selectedMachineType}
            onChange={handleMachineTypeSelect}
            placeholder="Chọn loại máy"
            style={{ width: 200 }}
          >
            <Option value="CNC">Tổ Tiện</Option>
            <Option value="PHAY">Tổ Phay</Option>
          </Select>
          <DatePicker onChange={onChange} needConfirm />
        </div>
      </div>
      {/* Hiển thị AvailableGrid */}
      <AvailableGrid
        machines={selectedMachineType === 'CNC' ? cncMachines : phayMachines} // Truyền danh sách máy CNC hoặc PHAY
        machineType={selectedMachineType} // Truyền loại máy
      />
      <div className="mt-2"><MachineComparisonChart data={data} machineType={selectedMachineType} /></div>

      {/* Sử dụng component MachineComparisonChart để hiển thị biểu đồ */}
      
    </div>
  );
}

export default AvailableRate;
