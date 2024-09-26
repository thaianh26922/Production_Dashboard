import React, { useState } from 'react';
import Select from 'react-select';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb';
import MachineWorkScheduleCard from '../../../Components/Equiment/MachineSchedule/MachineWorkScheduleCard';

const MachineWorkScheduleList = () => {
  const [selectedArea, setSelectedArea] = useState({ value: 'all', label: 'Toàn nhà máy' });

  // Dữ liệu mẫu cho các máy (có thể lấy từ API)
  const machines = [
    { id: 1, name: 'CNC1', status: 'Chạy', area: 'area1' },
    { id: 2, name: 'CNC2', status: 'Chờ', area: 'area1' },
    { id: 3, name: 'CNC3', status: 'Lỗi', area: 'area1' },
    { id: 4, name: 'CNC4', status: 'Tắt', area: 'area1' },
    { id: 5, name: 'CNC5', status: 'Chạy', area: 'area1' },
    { id: 6, name: 'CNC6', status: 'Chờ', area: 'area1' },
    { id: 7, name: 'CNC7', status: 'Lỗi', area: 'area2' },
    { id: 8, name: 'CNC8', status: 'Tắt', area: 'area2' },
    { id: 9, name: 'CNC9', status: 'Chạy', area: 'area1' },
    { id: 10, name: 'CNC10', status: 'Chờ', area: 'area2' },
    { id: 11, name: 'CNC11', status: 'Lỗi', area: 'area2' },
    { id: 12, name: 'CNC12', status: 'Tắt', area: 'area2' },
  ];

  // Dữ liệu mẫu cho các khu vực (có thể lấy từ API)
  const areaOptions = [
    { value: 'all', label: 'Toàn nhà máy' },
    { value: 'area1', label: 'Line 01' },
    { value: 'area2', label: 'Line 02' },
  ];

  // Dữ liệu mẫu cho các ca làm việc
  const shiftOptions = [
    { value: 'morning', label: 'Ca Sáng' },
    { value: 'afternoon', label: 'Ca Chiều' },
    { value: 'night', label: 'Ca Tối' },
  ];

  // Dữ liệu mẫu về nhân viên
  const employeeOptions = [
    { value: 'nv1', label: 'Nhân viên 1' },
    { value: 'nv2', label: 'Nhân viên 2' },
    { value: 'nv3', label: 'Nhân viên 3' },
    { value: 'nv4', label: 'Nhân viên 4' },
  ];

  // Lọc máy theo khu vực được chọn
  const filteredMachines =
    selectedArea.value === 'all'
      ? machines // Hiển thị tất cả máy nếu chọn "Toàn nhà máy"
      : machines.filter((machine) => machine.area === selectedArea.value);

  return (
    <>
      {/* Breadcrumb và chọn khu vực trên cùng hàng */}
      <div className="flex justify-between items-center mb-2">
        <Breadcrumb />
        <div className="w-[10%] p-4">
          <Select
            options={areaOptions}
            value={selectedArea}
            onChange={setSelectedArea}
            placeholder="Chọn khu vực"
            classNamePrefix="select"
          />
        </div>
      </div>

      {/* Danh sách lịch làm việc của máy */}
      <div className="grid grid-cols-4 gap-2">
        {filteredMachines.map((machine) => (
          <MachineWorkScheduleCard
            key={machine.id}
            machine={machine}
            shiftOptions={shiftOptions}
            employeeOptions={employeeOptions}
          />
        ))}
      </div>
    </>
  );
};

export default MachineWorkScheduleList;
