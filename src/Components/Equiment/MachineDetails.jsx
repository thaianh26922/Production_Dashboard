import React, { useState } from 'react';
import MachineSelection from './MachineSelection'; // Thêm lại MachineSelection
import { Doughnut } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorHistoryChart from './ErrorHistoryChart'; // Component biểu đồ lịch sử lỗi
import MachineStatusHistory from './MachineStatusHistory'; // Component lịch sử trạng thái máy

// Định nghĩa hình ảnh cho các loại máy
const machineImages = {
  'Máy Trộn': '../../src/assets/image/May_tron.png',
  'Máy Định Hình': '../../src/assets/image/May_Dinh_Hinh.png',
  'Máy Nướng': '../../src/assets/image/May_nuong_banh.webp',
  'Máy Đóng Gói': '../../src/assets/image/May-dong-goi.png',
};

const MachineDetails = () => {
  // Khai báo state cho máy hiện tại và ngày được chọn
  const [currentMachine, setCurrentMachine] = useState('Máy Trộn'); // Trạng thái máy hiện tại
  const [selectedDate, setSelectedDate] = useState(null); // Ngày được chọn

  const machineStatus = 'RUN'; // Trạng thái máy
  const machineMode = 'AUTO'; // Chế độ máy

  // Tạo màu sắc cho trạng thái máy
  const statusColor = machineStatus === 'RUN' ? 'bg-green-500' : machineStatus === 'STOP' ? 'bg-red-500' : 'bg-yellow-500';

  // Dữ liệu giả cho Cycle Times theo trạng thái "Chạy", "Dừng", "Chờ"
  const cycleTimeData = {
    '2023-09-05': { run: 120, stop: 30, wait: 15 }, // Dữ liệu theo phút
    '2023-09-06': { run: 90, stop: 45, wait: 30 },
    '2023-09-07': { run: 100, stop: 50, wait: 20 },
  };

  // Hàm xử lý khi chọn ngày
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Lấy dữ liệu Cycle Times cho ngày được chọn
  const getCycleTimeForDate = () => {
    if (!selectedDate) {
      return { run: 0, stop: 0, wait: 0 };
    }
    const formattedDate = selectedDate.toISOString().split('T')[0];
    return cycleTimeData[formattedDate] || { run: 0, stop: 0, wait: 0 };
  };

  // Tạo dữ liệu cho biểu đồ Donut
  const cycleTimesForSelectedDate = getCycleTimeForDate();
  const doughnutData = {
    labels: ['Chạy', 'Dừng', 'Chờ'],
    datasets: [
      {
        data: [cycleTimesForSelectedDate.run, cycleTimesForSelectedDate.stop, cycleTimesForSelectedDate.wait],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md grid gap-4 w-full grid-rows-auto">
      
      {/* Hàng trên với 4 cột */}
      <div className="grid grid-cols-4 gap-4">
        
        {/* Cột 1: Lựa chọn máy */}
        <div className="col-span-1 bg-white p-2 rounded-lg shadow">
          <MachineSelection currentMachine={currentMachine} setCurrentMachine={setCurrentMachine} />
        </div>
        
        {/* Cột 2: Hình ảnh máy */}
        <div className="col-span-1 flex flex-col items-center bg-white p-2 rounded-lg shadow">
          <img
            src={machineImages[currentMachine]} // Hiển thị hình ảnh dựa vào máy đang chọn
            alt={`${currentMachine} image`}
            className="w-40 h-48 object-contain object-center rounded"
          />
          <h2 className="text-center text-xl font-bold mt-1">{currentMachine}</h2>
        </div>

        {/* Cột 3: Trạng thái máy và chế độ máy */}
        <div className="col-span-1 bg-white p-2 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2 text-left">Trạng Thái Máy</h3>
            <div className={`py-6 px-4 rounded shadow text-white text-center text-xl font-bold ${statusColor}`}>
              {machineStatus}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2 text-left">Chế Độ Máy</h3>
            <div className="py-6 px-4 rounded shadow text-center text-xl font-semibold text-black">
              {machineMode}
            </div>
          </div>
        </div>

        {/* Cột 4: Cycle Times + Biểu đồ Donut */}
        <div className="col-span-1 bg-white p-2 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Cycle Times</h3>
          
          
        </div>
      </div>

      {/* Hàng dưới với 2 hàng cho Lịch sử trạng thái máy và Lịch sử lỗi */}
      <div className="bg-white p-2 rounded-lg shadow w-full max-h-96 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Lịch sử trạng thái máy</h3>
          <MachineStatusHistory /> {/* Hiển thị Lịch sử trạng thái máy */}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Lịch sử lỗi</h3>
          <ErrorHistoryChart /> {/* Hiển thị biểu đồ Lịch sử lỗi */}
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;
