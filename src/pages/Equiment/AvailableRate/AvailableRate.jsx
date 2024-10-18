import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Spin, Alert } from 'antd';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb';
import AvailableGrid from '../../../Components/AvailableRate/AvailableGrid';
import MachineComparisonChart from '../../../Components/AvailableRate/MachineComparisonChart';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

function AvailableRate() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [areaData, setAreaData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const areaResponse = await axios.get(`${apiUrl}/areas`);
        setAreaData(areaResponse.data);

        const deviceResponse = await axios.get(`${apiUrl}/device`);
        setDeviceData(deviceResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.'); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  const getFilteredDevices = (area) => {
    return !area || area === 'all' ? deviceData : deviceData.filter(device => device.areaName === area);
  };

  const handleAreaSelect = (value) => {
    setSelectedArea(value);
  };

  

const handleDateChange = (newDate) => {
  const formattedDate = moment(newDate).format('YYYY-MM-DD');
  setSelectedDate(formattedDate); // Giả sử setSelectedDate là một hàm để cập nhật state
}


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div><Breadcrumb /></div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedArea}
            onChange={handleAreaSelect}
            placeholder="Chọn khu vực"
            style={{ width: 200 }}
            allowClear
          >
            <Option value="all">Toàn nhà máy</Option>
            {areaData.map(area => (
              <Option key={area._id} value={area.areaName}>{area.areaName}</Option>
            ))}
          </Select>
          <DatePicker 
            onChange={handleDateChange} 
            value={selectedDate} // Use value instead of defaultValue
          />
        </div>
      </div>

      {loading ? ( // Show loading spinner while fetching data
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : error ? ( // Show error message if fetching fails
        <Alert message={error} type="error" />
      ) : (
        <>
          <AvailableGrid
            machines={getFilteredDevices(selectedArea)}
            machineType={selectedArea}
            selectedDate={selectedDate}
          />
          <div className="mt-2">
            <MachineComparisonChart 
              data={getFilteredDevices(selectedArea)} 
              machineType={selectedArea} 
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AvailableRate;
