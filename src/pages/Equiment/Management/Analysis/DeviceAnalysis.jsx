import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Space } from 'antd';
import moment from 'moment';
import DeviceTable from '../../../../Components/Equiment/Analysis/DeviceTable';
import DowntimePieChart from '../../../../Components/Equiment/Analysis/DowntimePieChart';
import ParetoTimeChart from '../../../../Components/Equiment/Analysis/ParetoTimeChart';
import ParetoFrequencyChart from '../../../../Components/Equiment/Analysis/ParetoFrequencyChart'
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const DeviceAnalysis = () => {
  const [areas, setAreas] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [downtimeData, setDowntimeData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [productionData, setProductionData] = useState([]);

  // Fetch areas from API
  useEffect(() => {
    fetch(`${apiUrl}/areas`)
      .then((response) => response.json())
      .then((data) => setAreas(data))
      .catch((error) => console.error('Error fetching areas:', error));
  }, []);

  // Fetch devices when an area is selected
  const handleAreaSelect = async (areaId) => {
    setSelectedArea(areaId);
    console.log('Selected Area ID:', areaId); // Debug
  
    try {
      const response = await axios.get(`${apiUrl}/device?areaId=${areaId}`);
      console.log('API URL:', `${apiUrl}/device?areaId=${areaId}`); // Debug
      console.log('Fetched Devices:', response.data); // Debug
  
      if (response.data && response.data.length > 0) {
        const formattedDevices = response.data.map((device) => ({
          id: device.deviceId, // Lưu deviceId thay vì _id
          name: device.deviceName,
        }));
        setDevices(formattedDevices);
      } else {
        console.warn('No devices found for this area.');
        setDevices([]); // Đảm bảo xóa dữ liệu cũ nếu không tìm thấy thiết bị
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]); // Xóa dữ liệu cũ trong trường hợp lỗi
    }
  };
  
  
  const handleDeviceSelect = (deviceId) => {
    console.log('Selected Device ID:', deviceId); // Debug để kiểm tra
    setSelectedDevice(deviceId);
  
    if (selectedDateRange) {
      fetchDowntimeData(deviceId, selectedDateRange);
    }
  };
  
  
  // Hàm xử lý khi người dùng chọn ngày
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
  
      // Kiểm tra moment object và định dạng ngày
      console.log('Selected Start Date (moment):', startDate);
      console.log('Selected End Date (moment):', endDate);
  
      const formattedStartDate = startDate.format('YYYY-MM-DD');
      const formattedEndDate = endDate.format('YYYY-MM-DD');
  
      console.log('Formatted Start Date:', formattedStartDate);
      console.log('Formatted End Date:', formattedEndDate);
  
      // Cập nhật state ngày đã chọn
      setSelectedDateRange([formattedStartDate, formattedEndDate]);
  
      // Gọi API nếu đã có thiết bị được chọn
      if (selectedDevice) {
        fetchDowntimeData(selectedDevice, [formattedStartDate, formattedEndDate]);
        fetchEmployeeData(selectedDevice, [formattedStartDate, formattedEndDate]);
      }
    }
  };
  
  
  useEffect(() => {
    if (selectedDevice && selectedDateRange) {
      console.log('Triggering fetch with new data:', selectedDevice, selectedDateRange);
      fetchDowntimeData(selectedDevice, selectedDateRange);
      fetchEmployeeData(selectedDevice,selectedDateRange);
    }
  }, [selectedDevice, selectedDateRange]);
  
  
  const fetchDowntimeData = async (deviceId, [startDate, endDate]) => {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
    console.log(`Fetching with Device ID: ${deviceId}, Start: ${formattedStartDate}, End: ${formattedEndDate}`);
  
    try {
      const response = await axios.get(
        `${apiUrl}/downtime?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      setDowntimeData(response.data);
    } catch (error) {
      console.error('Error fetching downtime data:', error);
    }
  };
  const fetchEmployeeData = async (deviceId, [startDate, endDate]) => {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
    console.log(`Fetching with Device ID: ${deviceId}, Start: ${formattedStartDate}, End: ${formattedEndDate}`);
  
    try {
      const response = await axios.get(
        `${apiUrl}/productiontask?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching downtime data:', error);
    }
  };
 
  
  const aggregateDowntimeByReason = (data) => {
    const reasonCounts = data.reduce((acc, item) => {
      const reason = item.reasonName;
      
      // Count all intervals for the given reasonName
      const intervalCount = item.interval.length;
  
      acc[reason] = (acc[reason] || 0) + intervalCount;
      return acc;
    }, {});
  
    return {
      labels: Object.keys(reasonCounts),
      values: Object.values(reasonCounts),
    };
  };
  const aggregateDowntimeHoursByReason = (data) => {
  const reasonHours = data.reduce((acc, item) => {
    const reason = item.reasonName;
    const totalIntervalHours = item.interval.reduce((sum, interval) => {
      const [startHour, startMinute] = interval.startTime.split(':').map(Number);
      const [endHour, endMinute] = interval.endTime.split(':').map(Number);

      const startTime = startHour + startMinute / 60;
      const endTime = endHour + endMinute / 60;

      return sum + (endTime - startTime); // Calculate duration in hours
    }, 0);

    acc[reason] = (acc[reason] || 0) + totalIntervalHours;
    return acc;
  }, {});

  return {
    labels: Object.keys(reasonHours),
    values: Object.values(reasonHours),
  };
};
const aggregateFrequencyByReason = (data) => {
  const reasonCounts = data.reduce((acc, item) => {
    const reason = item.reasonName;
    const frequency = item.interval.length; // Each interval counts as one occurrence

    acc[reason] = (acc[reason] || 0) + frequency;
    return acc;
  }, {});

  return {
    labels: Object.keys(reasonCounts),
    values: Object.values(reasonCounts),
  };
};
console.log(employeeData.shift)
  const aggregatedData = aggregateDowntimeHoursByReason(downtimeData);
  console.log('data timepareto chart',aggregatedData)
  const aggregatedDowntimeData = aggregateDowntimeHoursByReason(downtimeData);
  const aggregatedFrequencytimeData = aggregateFrequencyByReason(downtimeData);
  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <Select
          value={selectedArea}
          onChange={handleAreaSelect}
          placeholder="Chọn khu vực"
          style={{ width: 200 }}
        >
          {areas.map((area) => (
            <Option key={area._id} value={area._id}>
              {area.areaName}
            </Option>
          ))}
        </Select>

        <Select
            value={selectedDevice} // deviceId được lưu trong state
            onChange={handleDeviceSelect} // Gọi khi người dùng chọn thiết bị
            placeholder="Chọn thiết bị"
            style={{ width: 200 }}
            disabled={!selectedArea}
          >
            {devices.map((device) => (
              <Option key={device.id} value={device.id}> 
                {device.name} {/* Hiển thị deviceName */}
              </Option>
            ))}
          </Select>



        <Space direction="vertical" size={12}>
          <RangePicker onChange={(dates) => {
        console.log('Raw Dates from RangePicker:', dates); // Kiểm tra giá trị
        handleDateChange(dates);
  }}  />
        </Space>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        <div className="col-span-1 bg-white p-3">
          <h4>Downtime Pie Chart</h4>
          <DowntimePieChart data={aggregatedDowntimeData} />
        </div>
        <div className="col-span-2 bg-white p-3">
          <h4>Pareto Time Chart</h4>
          <ParetoTimeChart data={aggregatedData} />
        </div>
        <div className="col-span-2 bg-white p-3">
          <h4>Pareto Frequency Chart</h4>
          <ParetoFrequencyChart data={aggregatedFrequencytimeData} />
        </div>
      </div>

      <div className="bg-white p-3 mt-2">
        <DeviceTable downtimeData={downtimeData} employeeData={employeeData} productionData={productionData} />
      </div>
    </div>
  );
};

export default DeviceAnalysis;
