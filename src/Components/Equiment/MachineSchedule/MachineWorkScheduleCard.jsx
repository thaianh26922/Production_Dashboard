import React, { useState } from 'react';
import Select from 'react-select';

// Hàm để lấy màu đèn tín hiệu
const getSignalLightColors = (status) => {
  if (status === 'Chạy') return { red: 'white', yellow: 'white', green: '#8ff28f' };
  if (status === 'Chờ' || status === 'Cài Đặt') return { red: 'white', yellow: '#fafa98', green: 'white' };
  if (status === 'Lỗi') return { red: 'red', yellow: 'white', green: 'white' };
  if (status === 'Tắt') return { red: 'white', yellow: 'white', green: 'white' };
  if (status === 'Vệ Sinh') return { red: 'white', yellow: 'white', green: '#807e7e' }; // Màu xám cho Vệ Sinh
  return { red: 'white', yellow: 'white', green: 'white' }; // Default case
};

// Thẻ hiển thị lịch làm việc của máy
const MachineWorkScheduleCard = ({ machine, shiftOptions, employeeOptions }) => {
  const [activeStatus, setActiveStatus] = useState(machine.status); // Trạng thái đèn hiện tại

  const signalLightColors = getSignalLightColors(activeStatus); // Lấy màu đèn theo trạng thái máy

  // Apply the blink class if status is "Lỗi"
  const blinkClass = activeStatus === 'Lỗi' ? 'animate-blinkError' : '';

  return (
    <div className="p-4 shadow-md bg-white rounded-md w-full mb-4">
      {/* Tiêu đề tên máy */}
      <h2 className="text-xl font-bold mb-2 flex justify-center">CNC {machine.id}</h2>

      <div className="items-center mb-4 grid grid-cols-4 gap-1">
        {/* Đèn tín hiệu */}
        <div className="col-span-1 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            {/* Thùng chứa đèn tín hiệu */}
            <div className="w-14 h-40 border border-black rounded-lg ml-4">
              <div
                style={{ backgroundColor: signalLightColors.red, height: '25%' }}
                className={`rounded-t-lg  border-l-red-600 border-l-4  border-b-2 border-b-red-600`}
              ></div>
              <div
                style={{ backgroundColor: signalLightColors.yellow, height: '25%' }}
                className="border-[#FCFC00] border-l-4 border-b-2"
              ></div>
              <div
                style={{ backgroundColor: signalLightColors.green, height: '25%' }}
                className="border-[#38F338] border-l-4 border-b-[#38F338] border-b-2 "
              ></div>
              <div
                style={{ backgroundColor: signalLightColors.gray, height: '25%' }}
                className="border-[#807e7e] border-l-4 rounded-b-lg items-center flex justify-center text-sm"
              > <span>Vệ sinh</span></div>
            </div>
          </div>
        </div>

        <div className="col-span-3 justify-center items-center">
          {/* Cột hiển thị ngày */}
          
          {/* Cột hiển thị ca */}
          <div className="ml-8">
            <label className="block text-sm font-bold mb-2">Ca làm việc:</label>
            <p className="border p-2 rounded-md w-full bg-gray-100">
              {machine.shift || 'Chưa chọn ca'}
            </p>
          </div>

          {/* Cột hiển thị nhân viên */}
          <div className="flex-1 ml-8">
            <label className="block text-sm font-bold mb-2">Nhân viên:</label>
            <div className="border p-2 rounded-md w-full bg-gray-100">
              {machine.employees && machine.employees.length > 0
                ? machine.employees.map((employee) => employee.label).join(', ')
                : 'Chưa chọn nhân viên'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineWorkScheduleCard;
