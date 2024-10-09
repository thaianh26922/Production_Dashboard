import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import InfoCard from '../../Components/MachineCard/InfoCard'; // Import InfoCard
import '../../index.css'; // Tailwind CSS

// Hàm để lấy ngày hiện tại theo định dạng YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu < 10
  const day = String(today.getDate()).padStart(2, '0'); // Thêm số 0 nếu < 10
  return `${year}-${month}-${day}`;
};

const generateSimulatedData = (machineType) => {
  const cncMachines = ['CNC 1', 'CNC 2', 'CNC 3', 'CNC 4', 'CNC 5'];
  const phayMachines = ['PHAY 1', 'PHAY 2', 'PHAY 3', 'PHAY 4', 'PHAY 5'];

  if (machineType === 'ALL') {
    return [...cncMachines, ...phayMachines]; // Kết hợp cả CNC và Phay
  } else if (machineType === 'CNC') {
    return cncMachines;
  } else if (machineType === 'PHAY') {
    return phayMachines;
  }
  return [];
};

const Dashboard2 = () => {
  const [selectedMachineType, setSelectedMachineType] = useState('CNC'); // Giá trị mặc định là CNC
  const [data, setData] = useState(generateSimulatedData('CNC')); // Dữ liệu mặc định là CNC
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Thiết lập ngày mặc định là ngày hiện tại
  const [selectedMachine, setSelectedMachine] = useState(null); // Máy phụ trách được chọn
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Hàm xử lý khi chọn loại máy
  const handleMachineTypeSelect = (value) => {
    setSelectedMachineType(value); // Cập nhật loại máy được chọn
    setData(generateSimulatedData(value)); // Cập nhật dữ liệu biểu đồ khi thay đổi loại máy
  };

  // Hàm xử lý khi người dùng chọn ngày khác
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Cập nhật ngày khi người dùng chọn
  };

  // Hàm xử lý khi nhấn nút xác nhận
  const handleConfirm = () => {
    console.log('Nút Xác nhận được nhấn');
    if (!selectedMachine) {
      alert('Vui lòng chọn máy trước khi xác nhận');
      return;
      
    }
    console.log('/dashboard/mobile/issue')

    // Điều hướng sang router /dashboard/mobile/issue với các tham số được truyền đi
    return navigate('/dashboard/mobile/issue', {
      state: { selectedDate, selectedMachine }
    });
    
  };

  return (
    <div className="h-screen bg-gray-100 w-full">
      {/* Header */}
      <div className="flex justify-center items-center w-full bg-gradient-to-r from-blue-600 to-sky-500">
        <h1 className="h-32 items-center text-5xl text-white font-bold flex w-full justify-center">
          Thiết bị phụ trách
        </h1>
      </div>

      {/* Nội dung chính */}
      <div className="grid grid-flow-row w-full p-2">
        {/* Chọn ngày khai báo */}
        <div className="justify-start grid grid-flow-row p-8">
          <h1 className="text-center text-5xl font-semibold mt-4">Chọn ngày khai báo</h1>
        </div>

        <div>
          <input
            type="date"
            value={selectedDate} // Ngày mặc định là ngày hiện tại
            onChange={handleDateChange} // Xử lý khi thay đổi ngày
            className="block w-[90%] h-20 text-4xl ml-8 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Chọn khu vực sản xuất */}
        <div className="justify-start grid grid-flow-row p-8">
          <h1 className="text-center text-5xl font-semibold mt-4">Chọn khu vực sản xuất</h1>
        </div>

        <div>
          <select
            value={selectedMachineType}
            onChange={(e) => handleMachineTypeSelect(e.target.value)}
            className="block w-[90%] h-20 text-3xl ml-8 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CNC">Tổ Tiện (CNC)</option>
            <option value="PHAY">Tổ Phay</option>
            <option value="ALL">Toàn bộ nhà máy</option> {/* Thêm tùy chọn này */}
          </select>
        </div>

        {/* Danh sách máy phụ trách */}
        <div className="justify-start grid grid-flow-row p-8">
          <h1 className="text-center text-5xl font-semibold mt-2">Chọn máy phụ trách</h1>
        </div>

        <div className="bg-white rounded-lg grid grid-cols-3 gap-3 shadow-sm w-[90%] h-full ml-6 p-8">
          {/* Hiển thị danh sách InfoCard và chọn máy */}
          {data.map((machine, index) => (
            <div
              key={index}
              onClick={() => setSelectedMachine(machine)} // Chọn máy khi nhấn vào
              className={`cursor-pointer ${selectedMachine === machine ? 'border-2 border-blue-500' : ''}`}
            >
              <InfoCard machine={machine} />
            </div>
          ))}
        </div>

        {/* Nút xác nhận */}
        <button
          onClick={handleConfirm} // Gọi hàm handleConfirm khi nhấn nút xác nhận
          className="bg-gradient-to-r from-blue-600 to-sky-500 w-[90%] hover:bg-blue-700 p-8 rounded-lg shadow-lg text-white text-center ml-6 mt-2 text-4xl font-bold transition duration-300 ease-in-out"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default Dashboard2;
