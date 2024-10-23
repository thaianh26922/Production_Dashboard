import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Space } from 'antd';
import moment from 'moment';
import DeviceTable from '../../../../Components/Equiment/Analysis/DeviceTable';
import DowntimePieChart from '../../../../Components/Equiment/Analysis/DowntimePieChart';
import ParetoTimeChart from '../../../../Components/Equiment/Analysis/ParetoTimeChart';
import ParetoFrequencyChart from '../../../../Components/Equiment/Analysis/ParetoFrequencyChart';

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
  const [productionData, setProductionData] = useState([]);

  // Fetch areas from API
  useEffect(() => {
    fetch(`${apiUrl}/areas`)
      .then((response) => response.json())
      .then((data) => setAreas(data))
      .catch((error) => console.error('Error fetching areas:', error));
  }, []);

  // Fetch devices when an area is selected
  const handleAreaSelect = (areaId) => {
    setSelectedArea(areaId);
    fetch(`${apiUrl}/device?areaId=${areaId}`)
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error('Error fetching devices:', error));
  };

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
    if (selectedDateRange) {
      fetchDowntimeData(deviceId, selectedDateRange);
    }
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const [startDate, endDate] = dates;
      console.log('Selected Start Date:', startDate); // Debugging
      console.log('Selected End Date:', endDate); // Debugging
  
      setSelectedDateRange(dates);
      if (selectedDevice) {
        fetchDowntimeData(selectedDevice, dates);
      }
    }
  };
  useEffect(() => {
    console.log('Selected Device:', selectedDevice);
    console.log('Selected Date Range:', selectedDateRange);
  }, [selectedDevice, selectedDateRange]);
  
  const fetchDowntimeData = (deviceId, dates) => {
    const [startDate, endDate] = dates;
    
    const formattedStartDate = moment(startDate).utc().format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).utc().format('YYYY-MM-DD');
 
    console.log('Formatted Start Date:', formattedStartDate); // Debugging
    console.log('Formatted End Date:', formattedEndDate); // Debugging
  
    fetch(`${apiUrl}/downtime?deviceId=${deviceId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched Downtime Data:', data); // Debugging
        setDowntimeData(data);
      })
      .catch((error) => console.error('Error fetching downtime data:', error));
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


  
  const aggregatedData = aggregateDowntimeHoursByReason(downtimeData);
  console.log('data timepareto chart',aggregatedData)
  const aggregatedDowntimeData = aggregateDowntimeByReason(downtimeData);
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
          value={selectedDevice}
          onChange={handleDeviceSelect}
          placeholder="Chọn thiết bị"
          style={{ width: 200 }}
          disabled={!selectedArea}
        >
          {devices.map((device) => (
            <Option key={device.id} value={device.id}>
              {device.deviceName}
            </Option>
          ))}
        </Select>

        <Space direction="vertical" size={12}>
          <RangePicker onChange={handleDateChange} />
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
        <DeviceTable downtimeData={downtimeData} productionData={productionData} />
      </div>
    </div>
  );
};

export default DeviceAnalysis;
