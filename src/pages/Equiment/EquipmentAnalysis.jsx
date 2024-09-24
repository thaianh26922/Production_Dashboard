import React, { useState, useEffect } from 'react';
import MachineTabs from '../../Components/Equiment/Analysis/MachineTabs';
import ChartSection from '../../Components/Equiment/Analysis/ChartSection';
import DowntimeTable from '../../Components/Equiment/Analysis/DowntimeTable';

const EquipmentAnalysis = () => {
  const [currentMachine, setCurrentMachine] = useState('Tham Số Máy Cắt');
  const [downtimeData, setDowntimeData] = useState({});
  const [errorOccurrenceData, setErrorOccurrenceData] = useState({});
  const [errorTimeData, setErrorTimeData] = useState({});
  const [historyData, setHistoryData] = useState([]);

  // Giả lập dữ liệu
  useEffect(() => {
    const generateMockData = () => {
      // Giả lập dữ liệu Downtime
      const downtimeMockData = {
        labels: ['Bảo Trì Máy', 'Bảo Trì Khuôn', 'Thiếu Vật Tư', 'Thiếu Nhân Lực', 'Thiết Bị Hỏng', 'Đào Tạo'],
        data: [10, 15, 7, 5, 20, 12],
      };

      // Giả lập dữ liệu Số Lần Xảy Ra Lỗi
      const errorOccurrenceMockData = {
        labels: ['Kiểm Tra Chất Lượng', 'Ăn Phụ', 'Thiếu Vật Tư', 'Bảo Trì Máy', 'Thay Khuôn'],
        data: [3, 7, 2, 5, 4],
      };

      // Giả lập dữ liệu Thời Gian Xảy Ra Lỗi
      const errorTimeMockData = {
        labels: ['Bảo Trì Máy', 'Kiểm Tra Chất Lượng', 'Thiết Bị Hỏng', 'Thiếu Vật Tư'],
        data: [6000, 4000, 8000, 2000], // Thời gian tính theo giây
      };

      // Giả lập dữ liệu lịch sử Downtime
      const historyMockData = [
        { timestamp: '2024-09-20 11:17:26', reason: 'Sản Xuất', duration: '0 giờ 1 phút 5 giây' },
        { timestamp: '2024-09-20 11:16:21', reason: 'Bảo Trì Khuôn', duration: '0 giờ 3 phút 15 giây' },
        { timestamp: '2024-09-20 11:13:06', reason: 'Sản Xuất', duration: '0 giờ 2 phút 10 giây' },
        { timestamp: '2024-09-20 11:10:56', reason: 'Thay Khuôn', duration: '0 giờ 1 phút 50 giây' },
        { timestamp: '2024-09-20 11:09:51', reason: 'Sản Xuất', duration: '0 giờ 5 phút 30 giây' },
      ];

      setDowntimeData(downtimeMockData);
      setErrorOccurrenceData(errorOccurrenceMockData);
      setErrorTimeData(errorTimeMockData);
      setHistoryData(historyMockData);
    };

    generateMockData();
  }, [currentMachine]);

  return (
    <div className="p-2 space-y-4">
      {/* Hàng đầu tiên: Tab chọn máy */}
      <div className="grid grid-cols-3 gap-2">
        <MachineTabs currentMachine={currentMachine} setCurrentMachine={setCurrentMachine} />
      </div>
      
      {/* Hàng thứ hai: Khu vực biểu đồ */}
      <div className="">
        <ChartSection 
          downtimeData={downtimeData} 
          errorOccurrenceData={errorOccurrenceData} 
          errorTimeData={errorTimeData} 
        />
      </div>

      {/* Hàng thứ ba: Bảng thống kê lịch sử Downtime */}
      <div className="bg-white p-2 rounded-lg shadow">
        <DowntimeTable historyData={historyData} />
      </div>
    </div>
  );
};

export default EquipmentAnalysis;
