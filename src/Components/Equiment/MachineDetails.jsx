import React from 'react';
import mayTronImage from '../../assets/image/May_tron.png';
import mayDinhHinhImage from '../../assets/image/May_Dinh_Hình.png';
import mayNuongImage from '../../assets/image/May_nuong_banh.webp';
import mayDongGoiImage from '../../assets/image/May-dong-goi.png';
import MachineStatusHistory from './MachineStatusHistory';
import ErrorHistoryChart from './ErrorHistoryChart';

const machineImages = {
  'Máy Trộn': mayTronImage,
  'Máy Định Hình': mayDinhHinhImage,
  'Máy Nướng': mayNuongImage,
  'Máy Đóng Gói': mayDongGoiImage,
};

const MachineDetails = ({ machineName }) => {
  // Thông tin trạng thái và chế độ máy
  const machineStatus = 'RUN'; // 'RUN', 'STOP', 'MAINTENANCE'
  const machineMode = 'AUTO'; // 'Remote', 'Handle'

  const statusColor = machineStatus === 'RUN' ? 'bg-green-500' : machineStatus === 'STOP' ? 'bg-red-500' : 'bg-yellow-500';

  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-md grid grid-cols-11 gap-2 h-full">
      {/* Hình ảnh máy */}
      <div className="col-span-2 flex flex-col items-center">
        <img
          src={machineImages[machineName]}
          alt={`${machineName} image`}
          className="w-40 h-48 object-contain object-center rounded"
        />
        <h2 className="text-center text-xl font-bold mt-1">{machineName}</h2>
      </div>

      {/* Trạng thái máy và Chế độ máy */}
      <div className="col-span-2 grid grid-rows-2 gap-1">
        <div className="bg-white p-1 rounded-lg shadow">
          <h3 className="font-semibold text-sm mb-2 text-left">Trạng Thái Máy</h3>
          <div className={`p-6 rounded shadow text-white text-center text-xl font-bold ${statusColor}`}>
            {machineStatus}
          </div>
        </div>
        <div className="bg-white p-1 rounded-lg shadow">
          <h3 className="font-semibold text-sm mb-2 text-left">Chế Độ Máy</h3>
          <div className="p-6 rounded shadow text-center text-xl font-semibold  text-black">
            {machineMode}
          </div>
        </div>
      </div>

      {/* Lịch sử trạng thái, Lịch sử lỗi, Cycle Times */}
      <div className="col-span-7 grid grid-rows-2 gap-2 ml-2">
      <div className="grid grid-cols-3 gap-4">
        {/* Lịch sử Trạng Thái Máy */}
        <div className="bg-white p-2 rounded-lg shadow col-span-2 h-full">
          <h3 className="font-semibold mb-2">Lịch sử trạng thái máy </h3>
           <MachineStatusHistory />
        </div>

        {/* Cycle Times */}  
        <div className="bg-white p-2 rounded-lg shadow h-full">
          <h3 className="font-semibold mb-2">CycleTimes</h3>
          <div className="text-center text-[2xl/3] text-blue-600">36 phút 47 giây</div>
        </div>
      </div>

      {/* Lịch sử Lỗi */}
      <div className="bg-white p-2 rounded-lg shadow h-full row-span-1">
        <h3 className="font-semibold mb-2">Lịch sử lỗi</h3>
        <ErrorHistoryChart />
        
      </div>
</div>

    </div>
  );
};

export default MachineDetails;