import React, { useState, useEffect } from 'react';
import { Select, DatePicker } from 'antd';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb';
import AvailableGrid from '../../../Components/AvailableRate/AvailableGrid'; // Import AvailableGrid
import MachineComparisonChart from '../../../Components/AvailableRate/MachineComparisonChart';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

function AvailableRate() {
  const [selectedArea, setSelectedArea] = useState('all'); // State mặc định là 'all' để hiển thị toàn bộ nhà máy
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [areaData, setAreaData] = useState([]); // Dữ liệu khu vực từ API
  const [deviceData, setDeviceData] = useState([]); // Dữ liệu thiết bị từ API
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Gọi API để lấy dữ liệu khu vực và thiết bị
    const fetchData = async () => {
      try {
        // Gọi API lấy dữ liệu khu vực
        const areaResponse = await axios.get(`${apiUrl}/areas`);
        setAreaData(areaResponse.data); // Lưu dữ liệu khu vực vào state

        // Gọi API lấy dữ liệu thiết bị
        const deviceResponse = await axios.get(`${apiUrl}/device`);
        setDeviceData(deviceResponse.data); // Lưu dữ liệu thiết bị vào state

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Hàm lọc thiết bị theo khu vực
  const getFilteredDevices = (area) => {
    // Trả về tất cả thiết bị nếu `selectedArea` là 'all' hoặc rỗng
    if (!area || area === 'all') {
      return deviceData;
    }
    // Lọc thiết bị theo `areaName` nếu `selectedArea` có giá trị
    return deviceData.filter(device => device.areaName === area);
  };

  // Hàm xử lý khi chọn khu vực từ Select
  const handleAreaSelect = (value) => {
    setSelectedArea(value);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(date); 
    console.log(date, dateString);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div><Breadcrumb /></div>
        <div className="flex items-center space-x-2">
          {/* Lựa chọn khu vực */}
          <Select
            value={selectedArea}
            onChange={handleAreaSelect}
            placeholder="Chọn khu vực"
            style={{ width: 200 }}
            allowClear // Cho phép xóa lựa chọn để hiển thị toàn bộ thiết bị
          >
            <Option value="all">Toàn nhà máy</Option> {/* Thêm tùy chọn Toàn nhà máy */}
            {areaData.map(area => (
              <Option key={area._id} value={area.areaName}>{area.areaName}</Option>
            ))}
          </Select>
          <DatePicker onChange={handleDateChange} 
            value={selectedDate} 
            defaultValue={dayjs()} 
             />
        </div>
      </div>
      {/* Hiển thị AvailableGrid */}
      <AvailableGrid
        machines={getFilteredDevices(selectedArea)} // Truyền danh sách máy lọc theo khu vực
        machineType={selectedArea} // Truyền loại máy là khu vực đã chọn
      />
      <div className="mt-2">
        <MachineComparisonChart 
          data={getFilteredDevices(selectedArea)} 
          machineType={selectedArea} 
        />
      </div>
    </div>
  );
}

export default AvailableRate;
