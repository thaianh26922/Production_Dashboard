import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Space, Radio, Tabs } from 'antd';
import moment from 'moment';  // Sử dụng để so sánh ngày và sinh dữ liệu
import DeviceTable from '../../../../Components/Equiment/Analysis/DeviceTable'; // Đường dẫn tới file DeviceTable
import DowntimePieChart from '../../../../Components/Equiment/Analysis/DowntimePieChart'; // Đường dẫn tới biểu đồ Downtime
import ParetoTimeChart from '../../../../Components/Equiment/Analysis/ParetoTimeChart';  // Đường dẫn tới biểu đồ Pareto Time
import ParetoFrequencyChart from '../../../../Components/Equiment/Analysis/ParetoFrequencyChart'; // Đường dẫn tới biểu đồ Pareto Frequency
import Breadcrumb from '../../../../Components/Breadcrumb/Breadcrumb'; // Đường dẫn tới Breadcrumb
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DeviceAnalysis = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedMachineType, setSelectedMachineType] = useState('CNC'); // Thêm state cho lựa chọn loại máy
  const [selectedMachine, setSelectedMachine] = useState(null); // Thêm state cho lựa chọn máy cụ thể
  const [downtimeData, setDowntimeData] = useState([]);
  const [productionData, setProductionData] = useState([]);

  function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours} tiếng ${formattedMinutes} phút`;
}
  const fetchData = async (startDate, endDate) => {

    
    try {
      const response = await axios.get(
        `http://192.168.1.11:5001/api/getprocessdata?deviceId=543ff470-54c6-11ef-8dd4-b74d24d26b24&startDate=${startDate}&endDate=${endDate}`
      );
      console.log(response.data.productionTasks)
      const newData = [{
        date : response.data.productionTasks[0].date.split('T')[0],
        startTime : response.data.productionTasks[0].shifts[0].shiftDetails.startTime,
        endTime: response.data.productionTasks[0].shifts[0].shiftDetails.endTime,
        workTime : response.data.productionTasks[0].date.split('T')[0],
        planeTime : response.data.productionTasks[0].date.split('T')[0],
        runTime : secondsToTime(Number(response.data.availabilityData.runtime)),
        downTime : secondsToTime(Number(response.data.availabilityData.stopTime)),
        maintenanceTime : response.data.productionTasks[0].date.split('T')[0],
        runRate : (Number(response.data.availabilityData.runtime)/86400*100).toFixed(2) 
      },{
        date : response.data.productionTasks[0].date.split('T')[0],
        startTime : response.data.productionTasks[1].shifts[0].shiftDetails.startTime,
        endTime: response.data.productionTasks[1].shifts[0].shiftDetails.endTime,
        workTime : response.data.productionTasks[1].date.split('T')[0],
        planeTime : response.data.productionTasks[1].date.split('T')[0],
        runTime : secondsToTime(Number(response.data.availabilityData.runtime)),
        downTime : secondsToTime(Number(response.data.availabilityData.stopTime)),
        maintenanceTime : response.data.productionTasks[1].date.split('T')[0],
        runRate : (Number(response.data.availabilityData.runtime)/86400*100).toFixed(2) 
      }
    ]
      console.log(response.data.stopTime)
      setProductionData(newData)

    } catch (error) {
      console.log(error)
    } 
  };



  // Danh sách máy CNC và PHAY
  const cncMachines = Array.from({ length: 17 }, (_, i) => ({ value: `CNC ${i + 1}`, label: `CNC ${i + 1}` }));
  const phayMachines = Array.from({ length: 18 }, (_, i) => ({ value: `PHAY ${i + 1}`, label: `PHAY ${i + 1}` }));

  // Dữ liệu cố định cho các biểu đồ (không thay đổi)
  const downtimeChartData = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng', 'Xước màn'],
    values: [50, 20, 20, 10],
  };

  const paretoDataTime = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng', 'Xước màn'],
    values: [120, 80, 60, 3],
  };

  const paretoDataFrequency = {
    labels: ['Lỗi kỹ thuật', 'Lỗi sensor', 'Lỗi chất lượng'],
    values: [10, 6, 4],
  };

  // Hàm sinh dữ liệu Downtime ngẫu nhiên dựa trên khoảng ngày được chọn
  const generateDowntimeData = (startDate, endDate) => {
    const reasons = ['Lỗi kỹ thuật', 'Bảo trì', 'Lỗi sensor', 'Lỗi chất lượng'];
    const operators = ['Nguyễn Văn A', 'Trần Văn B', 'Lê Thị C'];
    const randomData = [];

    for (let i = 0; i < 5; i++) {
      const randomStartTime = moment(startDate).add(Math.floor(Math.random() * endDate.diff(startDate, 'hours')), 'hours');
      const randomEndTime = moment(randomStartTime).add(Math.floor(Math.random() * 60), 'minutes');
      const duration = moment.duration(randomEndTime.diff(randomStartTime)).humanize();

      randomData.push({
        startTime: randomStartTime.format('YYYY-MM-DD HH:mm'),
        endTime: randomEndTime.format('YYYY-MM-DD HH:mm'),
        duration: duration,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        operator: operators[Math.floor(Math.random() * operators.length)],
      });
    }

    return randomData;
  };

  // Hàm sinh dữ liệu Production ngẫu nhiên dựa trên khoảng ngày được chọn
  const generateProductionData = (startDate, endDate) => {
    const randomData = []; 

    for (let i = 0; i < 3; i++) {
      const randomStartTime = moment(startDate).add(Math.floor(Math.random() * endDate.diff(startDate, 'hours')), 'hours');
      const randomEndTime = moment(randomStartTime).add(8, 'hours');  // Giả sử mỗi ca làm việc là 8 giờ

      randomData.push({
        startTime: randomStartTime.format('YYYY-MM-DD HH:mm'),
        endTime: randomEndTime.format('YYYY-MM-DD HH:mm'),
        workTime: `${Math.floor(Math.random() * 8)}h`,
        planeTime: `${Math.floor(Math.random() * 8)}h`,
        runTime: `${Math.floor(Math.random() * 8)}h`,
        downTime: `${Math.floor(Math.random() * 2)}h`,
        offTime: `${Math.floor(Math.random() * 2)}h`,
        maintenanceTime: `${Math.floor(Math.random() * 60)} phút`,
        runRate: `${Math.floor(Math.random() * 100)}%`,
      });
    }

    return randomData;
  };
  useEffect(() => {
   if(selectedDateRange != null){
    const startDate = new Date(selectedDateRange[0].$d);
    const endDate = new Date(selectedDateRange[1].$d);
    const yearS = startDate.getFullYear();
    const yearE = endDate.getFullYear();
    const monthS = String(startDate.getMonth() + 1).padStart(2, '0'); 
    const monthE = String(endDate.getMonth() + 1).padStart(2, '0'); 

    const dayS = String(startDate.getDate()).padStart(2, '0');
    const dayE = String(endDate.getDate()).padStart(2, '0');

    const formattedDateS = `${yearS}-${monthS}-${dayS}`;
    const formattedDateE = `${yearE}-${monthE}-${dayE}`;
    fetchData(formattedDateS, formattedDateE);
   }

  }, [selectedDateRange]);
  // Hàm xử lý khi người dùng chọn ngày
  const handleDateChange = (dates) => {

    if(dates != null){
       setSelectedDateRange(dates)

    }
    // if (dates) {
    //   const [startDate, endDate] = dates;
    //   console.log(startDate)

    //   const newDowntimeData = generateDowntimeData(startDate, endDate);
    //   // const newProductionData = generateProductionData(startDate, endDate);
    //   setDowntimeData(newDowntimeData);
    //   // setProductionData(newProductionData);
    // } else {
    //   setDowntimeData([]);
    //   setProductionData([]);
    // }
  };

  // Hàm xử lý khi chọn loại máy từ Select
  const handleMachineTypeSelect = (value) => {
    setSelectedMachineType(value); // Cập nhật loại máy khi người dùng chọn
    setSelectedMachine(null); // Reset máy cụ thể khi thay đổi loại máy
  };

  // Hàm xử lý khi chọn máy cụ thể
  const handleMachineSelect = (value) => {
    setSelectedMachine(value);
  };

  return (
    <div>
      {/* Breadcrumb */}


      {/* Lựa chọn loại máy và chọn máy cụ thể */}
      <div className="flex justify-end items-center mb-4">

        <div className="flex items-center space-x-4">
          {/* Lựa chọn loại máy CNC hoặc PHAY */}
          <Select
            value={selectedMachineType}
            onChange={handleMachineTypeSelect}
            placeholder="Chọn loại máy"
            style={{ width: 200 }} // Sử dụng style của Ant Design
          >
            <Option value="CNC">Tổ Tiện</Option>
            <Option value="PHAY">Tổ Phay</Option>
          </Select>

          {/* Lựa chọn máy cụ thể */}
          <Select
            value={selectedMachine}
            onChange={handleMachineSelect}
            placeholder={`Chọn máy ${selectedMachineType}`}
            style={{ width: 200 }}
            disabled={!selectedMachineType} // Vô hiệu hóa nếu chưa chọn loại máy
          >
            {(selectedMachineType === 'CNC' ? cncMachines : phayMachines).map(machine => (
              <Option key={machine.value} value={machine.value}>
                {machine.label}
              </Option>
            ))}
          </Select>

          {/* Chọn ngày */}
          <Space direction="vertical" size={12}>
            <RangePicker onChange={handleDateChange} />
          </Space>
        </div>
      </div>

      {/* Hiển thị nội dung dựa trên loại máy được chọn */}
      {selectedMachineType === 'CNC' && (
        <>
          {/* Hiển thị biểu đồ giữ nguyên dữ liệu cho Máy CNC */}
          <div className="grid grid-cols-5 gap-2 mt-4">

            <div className="col-span-1 bg-white p-3">
              <h4 className="mb-4">Downtime Pie Chart - Máy CNC</h4>
              <DowntimePieChart data={downtimeChartData} />
            </div>

            <div className="col-span-2 bg-white p-3">
              <h4 className="mb-4">Pareto Time Chart - Máy CNC</h4>
              <ParetoTimeChart data={paretoDataTime.values} labels={paretoDataTime.labels} />
            </div>

            <div className="col-span-2 bg-white p-3">
              <h4 className="mb-4">Pareto Frequency Chart - Máy CNC</h4>
              <ParetoFrequencyChart data={paretoDataFrequency.values} labels={paretoDataFrequency.labels} />
            </div>
          </div>

          {/* Hiển thị bảng cho Máy CNC */}
          <div className="bg-white p-3 mt-2">
            <DeviceTable downtimeData={downtimeData} productionData={productionData} />
          </div>
        </>
      )}

      {selectedMachineType === 'PHAY' && (
        <>
          {/* Hiển thị biểu đồ giữ nguyên dữ liệu cho Máy PHAY */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            <div className="col-span-1 bg-white p-3">
              <h4>Downtime Pie Chart - Máy PHAY</h4>
              <DowntimePieChart data={downtimeChartData} />
            </div>

            <div className="col-span-2 bg-white p-3">
              <h4>Pareto Time Chart - Máy PHAY</h4>
              <ParetoTimeChart data={paretoDataTime.values} labels={paretoDataTime.labels} />
            </div>

            <div className="col-span-2 bg-white p-3">
              <h4>Pareto Frequency Chart - Máy PHAY</h4>
              <ParetoFrequencyChart data={paretoDataFrequency.values} labels={paretoDataFrequency.labels} />
            </div>
          </div>

          {/* Hiển thị bảng cho Máy PHAY */}
          <div className="bg-white p-3 mt-2">
            <DeviceTable downtimeData={downtimeData} productionData={productionData} />
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceAnalysis;
