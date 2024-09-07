import React, { useState } from 'react';
import MachineSelection from './MachineSelection'; // Thêm lại MachineSelection
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorHistoryChart from './ErrorHistoryChart'; // Component biểu đồ lịch sử lỗi
import MachineStatusHistory from './MachineStatusHistory'; // Component lịch sử trạng thái máy
import { FaFilter } from 'react-icons/fa';
import { addDays } from 'date-fns';

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
  const [startDate, setStartDate] = useState(new Date()); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(addDays(new Date(), 7)); // Ngày kết thúc
  const [historyData, setHistoryData] = useState([]); // Dữ liệu lịch sử trạng thái máy

  const machineStatus = 'RUN'; // Trạng thái máy
  const machineMode = 'AUTO'; // Chế độ máy

  // Tạo màu sắc cho trạng thái máy
  const statusColor = machineStatus === 'RUN' ? 'bg-green-500' : machineStatus === 'STOP' ? 'bg-red-500' : 'bg-yellow-500';

  // Hàm cập nhật dữ liệu sau khi chọn ngày
  const applyDateFilter = () => {
    // Thực hiện lọc dữ liệu dựa trên startDate và endDate
    const newHistoryData = generateFakeData(startDate, endDate); // Dùng generateFakeData hoặc API thật
    setHistoryData(newHistoryData);
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
          <div className="mb-2"> {/* Giảm margin-bottom để thu hẹp khoảng cách */}
            <h3 className="font-semibold text-sm mb-1 text-left">Trạng Thái Máy</h3> {/* Giảm margin-bottom */}
            <div className={`py-4 px-3 rounded shadow text-white text-center text-xl font-bold ${statusColor}`}>
              {machineStatus}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1 text-left">Chế Độ Máy</h3> {/* Giảm margin-bottom */}
            <div className="py-4 px-3 rounded shadow text-center text-xl font-semibold text-black">
              {machineMode}
            </div>
          </div>
        </div>

        {/* Cột 4: Cycle Times + Bộ chọn ngày */}
        <div className="col-span-1 bg-white p-2 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Chọn Khoảng Ngày</h3>
          
        </div>
      </div>

      {/* Hàng dưới với 2 hàng cho Lịch sử trạng thái máy và Lịch sử lỗi */}
      <div className="bg-white p-2 rounded-lg shadow w-full max-h-96 overflow-y-auto">
        {/* Hàng cho tiêu đề và DatePicker + icon lọc */}
       <div className="mb-4 flex items-center justify-between gap-1"> {/* Sử dụng flex và gap nhỏ hơn */}
          
          <div className="flex items-center gap-1"> {/* Đặt bộ chọn ngày và icon gần nhau */}
          <h3 className="font-semibold mr-2">Lịch sử trạng thái máy</h3>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              className="p-1 border rounded-md w-[60%] "
              placeholderText="Từ ngày"
            />
            <span className="-translate-x-[72px]">-</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              className="p-1 border rounded-md w-[60%] -translate-x-16"
              placeholderText="Đến ngày"
            />
            <button onClick={applyDateFilter} className="p-1 -translate-x-32 bg-green-500 text-white rounded">
              <FaFilter />
            </button>
          </div>
        </div>


        {/* Biểu đồ lịch sử trạng thái máy */}
        <MachineStatusHistory historyData={historyData} /> 
        
        {/* Lịch sử lỗi */}
        <div>
          <h3 className="font-semibold mb-2">Lịch sử lỗi</h3>
          <ErrorHistoryChart /> 
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;
