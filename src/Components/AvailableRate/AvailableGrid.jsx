import React from 'react';
import AvailableCard from './AvailableCard'; // Import AvailableCard

// Nhận danh sách các thẻ AvailableCard từ props
function AvailableGrid({ machines, machineType }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {machines.map((machine) => (
        <AvailableCard
          key={machine.value}
          machineName={machine.label}
          selectedDate={new Date().toISOString().split('T')[0]} // Giả sử hiển thị ngày hiện tại
          machineType={machineType} // Truyền loại máy (CNC hoặc PHAY)
        />
      ))}
    </div>
  );
}

export default AvailableGrid;
