import React, { useState, useEffect } from 'react';
import MachineSelection from './MachineSelection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MachineStatusHistory from './MachineStatusHistory';
import ErrorHistoryChart from './ErrorHistoryChart';
import { FaFilter } from 'react-icons/fa';
import { addDays } from 'date-fns';
import axios from 'axios';

import MayTron from '../../assets/image/May_tron.png';
import MayDinhHinh from '../../assets/image/May_Dinh_Hinh.png';
import MayNuong from '../../assets/image/May_nuong_banh.webp';
import MayDongGoi from '../../assets/image/May-dong-goi.png';

const machineImages = {
  'Máy Trộn': MayTron,
  'Máy Định Hình': MayDinhHinh,
  'Máy Nướng': MayNuong,
  'Máy Đóng Gói': MayDongGoi,
};

// Hàm lấy dữ liệu từ API
const fetchMachineData = async (startDate, endDate) => {
  try {
    // Thay thế API_URL và JWT_TOKEN bằng giá trị thật của bạn
    const response = await axios.get('API_URL', {
      headers: {
        Authorization: `Bearer YOUR_JWT_TOKEN`, // Sử dụng token hợp lệ
      },
    });
    return response.data; // Trả về dữ liệu đã lấy
  } catch (error) {
    console.error('Error fetching machine data:', error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

// Component chính để hiển thị chi tiết máy
const MachineDetails = () => {
  const [currentMachine, setCurrentMachine] = useState('Máy Trộn'); // Lưu trạng thái máy hiện tại
  const [startDate, setStartDate] = useState(new Date()); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(addDays(new Date(), 7)); // Ngày kết thúc
  const [historyData, setHistoryData] = useState([]); // Dữ liệu trạng thái máy từ API

  // Hàm áp dụng bộ lọc ngày và cập nhật dữ liệu
  const applyDateFilter = async () => {
    const newHistoryData = await fetchMachineData(startDate, endDate); // Lấy dữ liệu từ API
    setHistoryData(newHistoryData); // Cập nhật dữ liệu mới sau khi lọc
  };

  // Khởi tạo dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      const initialHistoryData = await fetchMachineData(new Date(), addDays(new Date(), 7)); // Lấy dữ liệu mặc định
      setHistoryData(initialHistoryData); // Lưu dữ liệu vào state
    };

    loadData(); // Gọi hàm lấy dữ liệu khi component được mount
  }, []);

  // Trạng thái của máy (có thể lấy từ API nếu cần)
  const machineStatus = 'RUN';
  const machineMode = 'AUTO';

  // Định màu cho trạng thái của máy
  const statusColor = machineStatus === 'RUN' ? 'bg-green-500' : machineStatus === 'STOP' ? 'bg-red-500' : 'bg-yellow-500';

  return (
    <div className="bg-gray-100 p-1 rounded-lg shadow-md grid gap-2 w-full grid-rows-auto">
      {/* Phần trên hiển thị trạng thái máy và lựa chọn máy */}
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1 bg-white p-2 rounded-lg shadow">
          <MachineSelection currentMachine={currentMachine} setCurrentMachine={setCurrentMachine} />
        </div>

        <div className="col-span-1 flex flex-col items-center bg-white p-2 rounded-lg shadow">
          <img
            src={machineImages[currentMachine]}
            alt={`${currentMachine} image`}
            className="w-40 h-48 object-contain object-center rounded"
          />
          <h2 className="text-center text-xl font-bold mt-1">{currentMachine}</h2>
        </div>

        <div className="col-span-1 bg-white p-2 rounded-lg shadow">
          <div className="mb-2">
            <h3 className="font-semibold text-sm mb-1 text-left">Trạng Thái Máy</h3>
            <div className={`py-8 px-3 rounded shadow text-white text-center text-xl font-bold ${statusColor}`}>
              {machineStatus}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1 text-left">Chế Độ Máy</h3>
            <div className="py-8 px-3 rounded shadow text-center text-xl font-semibold text-black">
              {machineMode}
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-white p-2 rounded-lg shadow grid grid-cols-1 gap-2">
          <div>
            <h3 className="font-semibold mb-2">Cycles Times</h3>
            <div className="text-center text-[2xl/3] text-blue-600">8 giờ 24 phút 47 giây</div>
          </div>
          <hr />
          <div className="bg-white rounded-lg">
            <h3 className="font-semibold mb-2">Thông Số Máy</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="font-semibold">Tốc độ:</span>
                <span className="text-blue-600">50 RPM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Áp suất:</span>
                <span className="text-blue-600">120 PSI</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Nhiệt độ:</span>
                <span className="text-blue-600">200°C</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Công suất:</span>
                <span className="text-blue-600">15 kW</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Trạng thái:</span>
                <span className="text-blue-600">Hoạt động</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần dưới hiển thị lịch sử trạng thái máy và biểu đồ */}
      <div className="bg-white p-2 rounded-lg shadow w-full max-h-96 overflow-y-auto">
        <div className="mb-4 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold mr-2">Lịch sử trạng thái máy</h3>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              className="p-1 border rounded-md w-[60%]"
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
              <FaFilter /> {/* Icon lọc */}
            </button>
          </div>
        </div>

        {/* Hiển thị lịch sử trạng thái máy */}
        <MachineStatusHistory historyData={historyData} />

        {/* Hiển thị biểu đồ lỗi (giả lập) */}
        <div>
          <h3 className="font-semibold mb-2">Lịch sử lỗi</h3>
          <ErrorHistoryChart />
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;
