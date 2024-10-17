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
          key={machine._id} // Sử dụng `_id` làm key để đảm bảo duy nhất
          machineName={machine.deviceName} // Truyền tên thiết bị
          deviceCode={machine.deviceCode} // Truyền `deviceCode`
          selectedDate={new Date().toISOString().split('T')[0]} // Ngày hiện tại
          machineType={machineType} // Truyền loại máy hoặc khu vực
        />
      ))}
    </div>
  );
}

export default AvailableGrid;
