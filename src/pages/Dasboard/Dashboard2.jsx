import React, { useState } from 'react';
import { DatePicker, Select } from 'antd';
import InfoCard from '../../Components/MachineCard/InfoCard'; // Import InfoCard
import '../../index.css'; // Import file CSS có sử dụng @apply của Tailwind CSS

const { Option } = Select;

const Dashboard2 = () => {
  const [size, setSize] = useState('large');
  const [selectedMachineType, setSelectedMachineType] = useState('CNC');

  // Hàm lấy dữ liệu dựa vào loại máy được chọn
  const generateSimulatedData = (machineType) => {
    if (machineType === 'CNC') {
      return [
        'CNC 1', 'CNC 2', 'CNC 3', 'CNC 4', 'CNC 5', 'CNC 6', 'CNC 7',
        'CNC 8', 'CNC 9', 'CNC 10', 'CNC 11', 'CNC 12', 'CNC 13', 'CNC 14', 'CNC 15', 'CNC 16', 'CNC 17'
      ];
    } else if (machineType === 'PHAY') {
      return [
        'PHAY 1', 'PHAY 2', 'PHAY 3', 'PHAY 4', 'PHAY 5', 'PHAY 6', 'PHAY 7', 'PHAY 8', 
        'PHAY 9', 'PHAY 10', 'PHAY 11', 'PHAY 12', 'PHAY 13', 'PHAY 14', 'PHAY 15', 'PHAY 16', 'PHAY 17', 'PHAY 18'
      ];
    }
    return [];
  };

  const handleMachineTypeSelect = (value) => {
    setSelectedMachineType(value); // Cập nhật loại máy được chọn
    setData(generateSimulatedData(value)); // Cập nhật dữ liệu biểu đồ khi thay đổi loại máy
  };

  const [data, setData] = useState(generateSimulatedData(selectedMachineType)); // Khởi tạo dữ liệu với CNC

  return (
    <>
      <div className="h-screen bg-gray-100 w-full">
        <div className="flex justify-center items-center w-full bg-gradient-to-r from-[#375BA9] via-sky-500">
          <h1 className="h-32 items-center text-5xl text-white font-bold flex w-full justify-center">
            Thiết bị phụ trách
          </h1>
        </div>

        <div className="grid grid-flow-row w-full p-2">
          <div className="justify-start grid grid-flow-row p-8">
            <h1 className="text-center text-5xl font-semibold mt-4">Chọn ngày khai báo</h1>
          </div>

          <div>
            {/* Áp dụng lớp tùy chỉnh để điều chỉnh DatePicker */}
            <DatePicker className="custom-datepicker w-[90%] p-6 text-2xl ml-8" size={size} />
          </div>

          <div className="justify-start grid grid-flow-row p-8">
            <h1 className="text-center text-5xl font-semibold mt-4">Chọn khu vực sản xuất</h1>
          </div>

          <div>
            {/* Áp dụng lớp tùy chỉnh để điều chỉnh Select */}
            <Select
              value={selectedMachineType}
              onChange={handleMachineTypeSelect}
              placeholder="Chọn loại máy"
              className="custom-select w-[90%] h-20 text-3xl ml-8"
            >
              <Option value="CNC">Tổ Tiện (CNC)</Option>
              <Option value="PHAY">Tổ Phay</Option>
            </Select>

            <div className="justify-start grid grid-flow-row p-8">
              <h1 className="text-center text-5xl font-semibold mt-2">Chọn máy phụ trách</h1>
            </div>

            <div className="bg-white rounded-lg grid grid-cols-3 gap-3 shadow-sm w-[90%] h-full ml-6 p-8">
              {/* Hiển thị danh sách InfoCard */}
              {data.map((machine, index) => (
                <InfoCard key={index} machine={machine} />
              ))}
            </div>

            <button className="bg-gradient-to-r from-[#375BA9] via-sky-500 w-[90%] hover:text-4xl p-8 rounded-lg shadow-lg text-white text-center ml-6 mt-2">
              <h3 className="text-4xl font-bold">Xác nhận</h3>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard2;
