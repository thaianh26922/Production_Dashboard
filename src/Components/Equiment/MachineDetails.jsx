import React, { useState } from 'react';
import MachineSelection from './MachineSelection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MachineStatusHistory from './MachineStatusHistory';
import ErrorHistoryChart from './ErrorHistoryChart';
import { FaFilter } from 'react-icons/fa';
import { addDays } from 'date-fns';
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

// Hàm chuyển đổi thời gian (giờ:phút) sang phút tính từ đầu ngày
const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Hàm hợp nhất các khoảng thời gian trùng lặp giữa các ngày
const mergeIntervals = (data, startTime = 6 * 60, endTime = 30 * 60) => {
  const merged = [];
  data.sort((a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)); // Sắp xếp theo thời gian bắt đầu

  let prev = data[0];
  let prevEnd = convertTimeToMinutes(prev.time) + prev.duration;

  for (let i = 1; i < data.length; i++) {
    const currentStart = convertTimeToMinutes(data[i].time);
    const currentEnd = currentStart + data[i].duration;

    // Kiểm tra xem có trùng lặp không
    if (currentStart < prevEnd) {
      // Hợp nhất khoảng thời gian trùng lặp
      prev.duration = Math.max(prevEnd, currentEnd) - convertTimeToMinutes(prev.time);
    } else {
      // Nếu không trùng lặp, đẩy đoạn trước vào mảng và cập nhật khoảng mới
      merged.push(prev);
      prev = data[i];
    }
    prevEnd = Math.max(prevEnd, currentEnd);
  }
  merged.push(prev);

  // Đảm bảo rằng tổng thời gian nằm trong khoảng từ 6:00 đến 6:00 hôm sau
  return merged.map((interval) => {
    const intervalStart = Math.max(startTime, convertTimeToMinutes(interval.time));
    const intervalEnd = Math.min(endTime, intervalStart + interval.duration);
    return {
      ...interval,
      time: `${String(Math.floor(intervalStart / 60)).padStart(2, '0')}:${String(intervalStart % 60).padStart(2, '0')}`,
      duration: intervalEnd - intervalStart,
    };
  });
};

// Hàm sinh dữ liệu giả cho trạng thái máy từ ngày bắt đầu đến ngày kết thúc
// Hàm sinh dữ liệu giả cho trạng thái máy từ ngày bắt đầu đến ngày kết thúc
const generateFakeData = (startDate, endDate) => {
  const historyData = [];
  const oneDay = 24 * 60 * 60 * 1000; // Một ngày tính bằng mili giây

  const statuses = [
    { status: 'Chạy', weight: 0.7 },
    { status: 'Chờ', weight: 0.10 },
    { status: 'Dừng', weight: 0.05 },
    { status: 'Lỗi Máy', weight: 0.1 },
    { status: 'Thiếu đơn', weight: 0.05 },
  ];

  // Hàm chọn trạng thái dựa trên trọng số
  const chooseStatus = () => {
    const random = Math.random();
    let sum = 0;
    for (const item of statuses) {
      sum += item.weight;
      if (random < sum) return item.status;
    }
    return statuses[0].status;
  };

  // Sinh dữ liệu cho mỗi ngày từ ngày bắt đầu đến ngày kết thúc
  for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + oneDay)) {
    const formattedDate = d.toISOString().split('T')[0]; // Chuyển đổi ngày sang định dạng YYYY-MM-DD
    let currentTime = 6 * 60; // Bắt đầu từ 6:00 sáng (tính bằng phút)
    const dailyData = [];

    while (currentTime < (24 + 6) * 60) { // Dữ liệu từ 6:00 đến 6:00 hôm sau
      // Sinh ra các khoảng thời gian 2, 5 hoặc 10 phút ngẫu nhiên
      const duration = Math.floor(Math.random() * 11 + 5) * 5; // Thời lượng ngẫu nhiên từ 2 đến 10 phút
      if (currentTime + duration > (24 + 6) * 60) {
        break;
      }

      dailyData.push({
        time: `${String(Math.floor(currentTime / 60)).padStart(2, '0')}:${String(currentTime % 60).padStart(2, '0')}`,
        status: chooseStatus(),
        duration,
      });
      currentTime += duration;
    }

    // Hợp nhất các khoảng thời gian trùng lặp và đảm bảo chúng nằm trong 1440 phút
    const mergedData = mergeIntervals(dailyData, 6 * 60, 30 * 60);  
    historyData.push(...mergedData.map((entry) => ({
      ...entry,
      date: formattedDate,
    })));
  }

  return historyData;
};


// Component chính để hiển thị chi tiết máy
const MachineDetails = () => {
  const [currentMachine, setCurrentMachine] = useState('Máy Trộn'); // Lưu trạng thái máy hiện tại
  const [startDate, setStartDate] = useState(new Date()); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(addDays(new Date(), 7)); // Ngày kết thúc
  const [historyData, setHistoryData] = useState(generateFakeData(new Date(), addDays(new Date(), 7))); // Dữ liệu trạng thái máy

  // Trạng thái của máy
  const machineStatus = 'RUN';
  const machineMode = 'AUTO';

  // Định màu cho trạng thái của máy
  const statusColor = machineStatus === 'RUN' ? 'bg-green-500' : machineStatus === 'STOP' ? 'bg-red-500' : 'bg-yellow-500';

  // Hàm áp dụng bộ lọc ngày và cập nhật dữ liệu
  const applyDateFilter = () => {
    const newHistoryData = generateFakeData(startDate, endDate);
    setHistoryData(newHistoryData); // Cập nhật dữ liệu sau khi lọc ngày
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md grid gap-2 w-full grid-rows-auto">
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
  {/* Phần Cycles Times */}
  <div>
    <h3 className="font-semibold mb-2">Cycles Times</h3>
    <div className="text-center text-[2xl/3] text-blue-600">8 giờ 24 phút 47 giây</div>
  </div>
    <hr />
  {/* Phần Thông Số Máy */}
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
            <h3 className="font-semibold mr-2">Lịch sử trạng thái            máy</h3>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy" // Định dạng ngày
              className="p-1 border rounded-md w-[60%]" // Kiểu dáng của DatePicker
              placeholderText="Từ ngày" // Văn bản gợi ý trong DatePicker
            />
            <span className="-translate-x-[72px]">-</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)} // Hàm cập nhật ngày kết thúc
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate} // Không cho phép chọn ngày trước ngày bắt đầu
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

