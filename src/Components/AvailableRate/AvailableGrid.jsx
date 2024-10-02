import React from 'react';
import AvailableCard from './AvailableCard'; // Import AvailableCard

function AvailableGrid({ machines, machineType }) {
  return (
    <div
      className="grid grid-cols-2 gap-2 overflow-y-auto"
      style={{ maxHeight: 'calc(2 * 230px + 1rem)' }} // Giới hạn chiều cao (2 hàng + khoảng cách giữa)
    >
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
