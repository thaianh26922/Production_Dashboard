import React, { useState } from 'react';
import Select from 'react-select';

// Hàm để lấy màu đèn tín hiệu
const getSignalLightColor = (status, isActive) => {
  const colors = {
    Chạy: 'green',
    Chờ: 'yellow',
    Lỗi: 'red',
    Tắt: 'gray',
  };

  return isActive ? colors[status] : `${colors[status]}50`; 
  console.log('${colors[status]}50')
};

const MachineWorkScheduleCard = ({ machine, shiftOptions, employeeOptions }) => {
  const [selectedDate, setSelectedDate] = useState(''); // Ngày chọn
  const [selectedShift, setSelectedShift] = useState(''); // Ca làm việc chọn
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Nhân viên chọn
  const [activeStatus, setActiveStatus] = useState(''); // Trạng thái đèn hiện tại

  // Hàm xử lý khi chọn đèn tín hiệu
  const handleSignalLightClick = (status) => {
    setActiveStatus(status); // Cập nhật đèn tín hiệu được chọn
  };

  return (
    <div className="p-4 shadow-md bg-white rounded-md w-full mb-4">
      {/* Tiêu đề tên máy */}
      <h2 className="text-xl font-bold mb-2 flex justify-center">CNC {machine.id}</h2>

      <div className="items-center mb-4 grid grid-cols-4 gap-1">
        {/* Đèn tín hiệu */}
        <div className="col-span-1 justify-center items-center">
          <div className="grid grid-rows-4 gap-2 w-14 h-40 border  ml-4">
            {/* Nút đèn tín hiệu: Xanh - Chạy */}
            <div
              className={` cursor-pointer`}
              style={{ backgroundColor: getSignalLightColor('Chạy', activeStatus === 'Chạy') }}
              onClick={() => handleSignalLightClick('Chạy')}
            ></div>
            {/* Nút đèn tín hiệu: Vàng - Chờ */}
            <div
              className={` cursor-pointer`}
              style={{ backgroundColor: getSignalLightColor('Chờ', activeStatus === 'Chờ') }}
              onClick={() => handleSignalLightClick('Chờ')}
            ></div>
            {/* Nút đèn tín hiệu: Đỏ - Lỗi */}
            <div
              className={` cursor-pointer`}
              style={{ backgroundColor: getSignalLightColor('Lỗi', activeStatus === 'Lỗi') }}
              onClick={() => handleSignalLightClick('Lỗi')}
            ></div>
            {/* Nút đèn tín hiệu: Xám - Tắt */}
            <div
              className={` cursor-pointer`}
              style={{ backgroundColor: getSignalLightColor('Tắt', activeStatus === 'Tắt') }}
              onClick={() => handleSignalLightClick('Tắt')}
            ></div>
          </div>
        </div>

        <div className="col-span-3 justify-center items-center">
          {/* Cột chọn ngày */}
          <div className="col-span-1 ml-8">
            <label className="block text-sm font-bold mb-2">Chọn ngày:</label>
            <input
              type="date"
              className="border p-2 rounded-md w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Cột chọn ca */}
          <div className="ml-8">
            <label className="block text-sm font-bold mb-2">Chọn ca:</label>
            <select
              className="border p-2 rounded-md w-full"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option value="">Chọn ca</option>
              {shiftOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cột chọn nhân viên */}
          <div className="flex-1 ml-8">
            <label className="block text-sm font-bold mb-2">Chọn nhân viên:</label>
            <Select
              options={employeeOptions}
              isMulti
              value={selectedEmployees}
              onChange={setSelectedEmployees}
              className="basic-multi-select"
              classNamePrefix="Chọn nhân viên"
              autoFocus
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mx-auto justify-center rounded-sm bg-green-400 p-2 w-2/3"> <button > Xác nhận giao việc
         </button></div>
    </div>
  );
};

export default MachineWorkScheduleCard;
