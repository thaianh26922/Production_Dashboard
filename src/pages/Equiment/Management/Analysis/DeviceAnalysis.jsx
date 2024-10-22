import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Space } from 'antd';
import moment from 'moment';
import axios from 'axios';
import DeviceTable from '../../../../Components/Equiment/Analysis/DeviceTable';
import DowntimePieChart from '../../../../Components/Equiment/Analysis/DowntimePieChart';
import ParetoTimeChart from '../../../../Components/Equiment/Analysis/ParetoTimeChart';
import ParetoFrequencyChart from '../../../../Components/Equiment/Analysis/ParetoFrequencyChart';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DeviceAnalysis = () => {
  const apiUrl = 'http://192.168.1.9:5001/api/downtime'; // API URL

  const [areas, setAreas] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [downtimeData, setDowntimeData] = useState([]);
  const [productionData, setProductionData] = useState([]);

  // Lấy danh sách khu vực và thiết bị từ API
  useEffect(() => {
    const fetchAreasAndDevices = async () => {
      try {
        const areasResponse = await axios.get(`${apiUrl.replace('/downtimes', '')}/areas`);
        setAreas(areasResponse.data);

        const devicesResponse = await axios.get(`${apiUrl.replace('/downtimes', '')}/device`);
        setDevices(devicesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAreasAndDevices();
  }, []);

  const handleAreaSelect = (value) => {
    setSelectedArea(value);
    setSelectedDevice(null); // Reset thiết bị đã chọn

    const filtered = devices.filter((device) => device.areaName === value);
    setFilteredDevices(filtered);
  };

  const handleDeviceSelect = (value) => {
    setSelectedDevice(value);
  };

  const handleDateChange = (dates) => {
    setSelectedDateRange(dates);
  };

  const fetchDowntimeData = async () => {
    if (selectedDevice && selectedDateRange.length === 2) {
      const [startDate, endDate] = selectedDateRange.map((date) => date.format('YYYY-MM-DD'));
      try {
        const response = await axios.post(apiUrl, {
          deviceID: selectedDevice,
          startDate,
          endDate,
        });
        setDowntimeData(response.data); // Cập nhật dữ liệu downtime
      } catch (error) {
        console.error('Error fetching downtime data:', error);
      }
    } else {
      console.warn('Vui lòng chọn thiết bị và khoảng thời gian hợp lệ.');
    }
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-4 space-x-4">
        <Select
          value={selectedArea}
          onChange={handleAreaSelect}
          placeholder="Chọn khu vực"
          style={{ width: 200 }}
        >
          {areas.map((area) => (
            <Option key={area._id} value={area.areaName}>
              {area.areaName}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedDevice}
          onChange={handleDeviceSelect}
          placeholder="Chọn thiết bị"
          style={{ width: 200 }}
          disabled={!selectedArea}
        >
          {filteredDevices.map((device) => (
            <Option key={device._id} value={device.deviceId}>
              {device.deviceName}
            </Option>
          ))}
        </Select>

        <Space direction="vertical" size={12}>
          <RangePicker onChange={handleDateChange} />
        </Space>

        <button
          onClick={fetchDowntimeData}
          className="p-2 bg-blue-500 text-white rounded-lg"
          disabled={!selectedDevice || selectedDateRange.length < 2}
        >
          Lấy Dữ Liệu
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        <div className="col-span-1 bg-white p-3">
          <h4>Downtime Pie Chart</h4>
          <DowntimePieChart data={{ labels: ['Lỗi kỹ thuật', 'Bảo trì'], values: [40, 60] }} />
        </div>
        <div className="col-span-2 bg-white p-3">
          <h4>Pareto Time Chart</h4>
          <ParetoTimeChart data={[120, 80]} labels={['Lỗi kỹ thuật', 'Bảo trì']} />
        </div>
        <div className="col-span-2 bg-white p-3">
          <h4>Pareto Frequency Chart</h4>
          <ParetoFrequencyChart data={[10, 5]} labels={['Lỗi kỹ thuật', 'Bảo trì']} />
        </div>
      </div>

      <div className="bg-white p-3 mt-2">
        <DeviceTable downtimeData={downtimeData} productionData={productionData} />
      </div>
    </div>
  );
};

export default DeviceAnalysis;
