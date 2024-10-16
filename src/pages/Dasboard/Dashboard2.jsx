import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../../Components/MachineCard/InfoCard';
import axios from 'axios'; 
import '../../index.css'; 

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0'); 
  return `${year}-${month}-${day}`;
};

const Dashboard2 = () => {
  const [selectedMachineType, setSelectedMachineType] = useState('ALL'); // Mặc định là toàn bộ nhà máy
  const [data, setData] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); 
  const [selectedMachine, setSelectedMachine] = useState(null); 
  const [areas, setAreas] = useState([]); 
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  const fetchAreas = async () => {
    try {
      const response = await axios.get('http://192.168.1.9:5001/api/areas');
      setAreas(response.data);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://192.168.1.9:5001/api/device');
      setDevices(response.data);
      setData(response.data); // Mặc định hiển thị tất cả các thiết bị
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchDevices();
  }, []);

  // Hàm xử lý chọn khu vực
  const handleMachineTypeSelect = (value) => {
    setSelectedMachineType(value);
    if (value === 'ALL') {
      // Nếu chọn toàn bộ nhà máy, hiển thị tất cả thiết bị
      setData(devices);
    } else {
      // Lọc thiết bị theo khu vực được chọn
      const filteredDevices = devices.filter(device => device.areaName === value);
      setData(filteredDevices);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleConfirm = () => {
    if (!selectedMachine) {
      alert('Vui lòng chọn máy trước khi xác nhận');
      return;
    }

    // Lưu trạng thái selectedDate và selectedMachine vào localStorage
    localStorage.setItem('savedSelectedDate', selectedDate);
    localStorage.setItem('savedSelectedMachine', JSON.stringify(selectedMachine));

    // Điều hướng và truyền dữ liệu qua state
    return navigate('/dashboard/mobile/issue', {
      state: {
        selectedDate: selectedDate,
        selectedMachine: {
          deviceName: selectedMachine.deviceName,
          id: selectedMachine.id,
          areaName: selectedMachine.areaName,
        },
      },
    });
};

  
console.log(selectedMachine)

  return (
    <div className="h-screen bg-gray-100 w-full">
      <div className="flex justify-center items-center w-full bg-gradient-to-r from-blue-600 to-sky-500">
        <h1 className="h-32 items-center text-5xl text-white font-bold flex w-full justify-center">
          Thiết bị phụ trách
        </h1>
      </div>

      <div className="grid grid-flow-row w-full p-2">
        <div className="justify-start grid grid-flow-row p-8">
          <h1 className="text-center text-5xl font-semibold mt-4">Chọn ngày khai báo</h1>
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="block w-[90%] h-20 text-4xl ml-8 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="justify-start grid grid-flow-row p-8">
          <h1 className="text-center text-5xl font-semibold mt-4">Chọn khu vực sản xuất</h1>
        </div>

        <div>
          <select
            value={selectedMachineType}
            onChange={(e) => handleMachineTypeSelect(e.target.value)}
            className="block w-[90%] h-20 text-3xl ml-8 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Toàn bộ nhà máy</option> {/* Thêm tùy chọn cho toàn bộ nhà máy */}
            {areas.map((area, index) => (
              <option key={index} value={area.areaName}>
                {area.areaName}
              </option>
            ))}
          </select>
        </div>

        <div className="justify-start grid grid-flow-row p-8">
          <h1 className="text-center text-5xl font-semibold mt-2">Chọn máy phụ trách</h1>
        </div>

        <div className="bg-white rounded-lg grid grid-cols-3 gap-3 shadow-sm w-[90%] h-full ml-6 p-8">
          {data.map((device, index) => (
            <div
              key={index}
              onClick={() => setSelectedMachine(device)}
              className={`cursor-pointer ${selectedMachine === device ? 'border-2 border-blue-500' : ''}`}
            >
              {/* Hiển thị InfoCard với deviceName */}
              <InfoCard machine={device.deviceName} />
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className="bg-gradient-to-r from-blue-600 to-sky-500 w-[90%] hover:bg-blue-700 p-8 rounded-lg shadow-lg text-white text-center ml-6 mt-2 text-4xl font-bold transition duration-300 ease-in-out"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default Dashboard2;
