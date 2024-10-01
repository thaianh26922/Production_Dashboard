import React, { useState } from 'react';
import { Select, DatePicker } from 'antd';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb'; // Đường dẫn tới Breadcrumb
import AvailableGrid from '../../../Components/AvailableRate/AvailableGrid';// Import AvailableGrid

const { RangePicker } = DatePicker;
const { Option } = Select;

function AvailableRate() {
  const [selectedMachineType, setSelectedMachineType] = useState('CNC'); // State cho loại máy
  const [selectedDate, setSelectedDate] = useState(null);

  // Danh sách máy CNC và PHAY
  const cncMachines = Array.from({ length: 17 }, (_, i) => ({ value: `CNC ${i + 1}`, label: `CNC ${i + 1}` }));
  const phayMachines = Array.from({ length: 18 }, (_, i) => ({ value: `PHAY ${i + 1}`, label: `PHAY ${i + 1}` }));

  // Hàm xử lý khi chọn loại máy từ Select
  const handleMachineTypeSelect = (value) => {
    setSelectedMachineType(value);
  };

  // Hàm xử lý khi chọn ngày
  const handleDateChange = (dates) => {
    setSelectedDate(dates);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb />
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
        </div>
      </div>

      {/* Hiển thị AvailableGrid */}
      <AvailableGrid
        machines={selectedMachineType === 'CNC' ? cncMachines : phayMachines} // Truyền danh sách máy CNC hoặc PHAY
        machineType={selectedMachineType} // Truyền loại máy
      />
    </div>
  );
}

export default AvailableRate;
