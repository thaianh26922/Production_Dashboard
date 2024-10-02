import React, { useState } from 'react';
import { Modal, Select, Button } from 'antd';
import { UserOutlined, PlusOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';

const ProductionTaskManagement = () => {
  // Simulated list of available employees
  const availableEmployees = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Thị D",
    "Hoàng Văn E"
  ];

  const shiftOptions = [
    { label: "Ca chính", value: "ca_chinh" },
    { label: "Ca phụ 1 giờ", value: "ca_phu_1h" },
    { label: "Ca phụ 2 giờ", value: "ca_phu_2h" },
    { label: "Ca phụ 3 giờ", value: "ca_phu_3h" }
  ];

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  const addEmployee = () => {
    if (selectedEmployee && !selectedEmployees.includes(selectedEmployee)) {
      setSelectedEmployees([...selectedEmployees, selectedEmployee]);
      setSelectedEmployee('');
    }
  };

  const removeEmployee = (employee) => {
    setSelectedEmployees(selectedEmployees.filter(e => e !== employee));
  };

  return (
    <div className="w-64 bg-white shadow-md rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Danh sách máy</span>
          <DownOutlined />
        </div>
        <span className="text-gray-600">'n Thiết bị</span>
      </div>
      
      <div className="p-4">
        <h2 className="font-semibold mb-2">Nhiệm vụ sản xuất</h2>
        <div className="bg-gray-100 rounded-md p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Ca làm việc</span>
            <CloseOutlined className="text-gray-600 cursor-pointer" />
          </div>
          <div className="mb-2 flex">
            <Select
              placeholder="Chọn ca làm việc"
              style={{ width: '100%', marginRight: '8px' }}
              value={selectedShift}
              onChange={(value) => setSelectedShift(value)}
            >
              {shiftOptions.map((shift, index) => (
                <Select.Option key={index} value={shift.value}>{shift.label}</Select.Option>
              ))}
            </Select>
          </div>
          <div className="mb-2 flex">
            <Select
              placeholder="Chọn nhân viên"
              value={selectedEmployee}
              onChange={(value) => setSelectedEmployee(value)}
              style={{ width: '100%', marginRight: '8px' }}
            >
              {availableEmployees.map((employee, index) => (
                <Select.Option key={index} value={employee}>{employee}</Select.Option>
              ))}
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={addEmployee}
            />
          </div>
          <div className="max-h-32 overflow-y-auto mb-2">
            {selectedEmployees.map((employee, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded mb-1">
                <div className="flex items-center">
                  <UserOutlined className="mr-2" />
                  <span>{employee}</span>
                </div>
                <CloseOutlined
                  className="text-gray-600 cursor-pointer"
                  onClick={() => removeEmployee(employee)}
                />
              </div>
            ))}
          </div>
          <div className="h-12 bg-white border border-black  rounded-lg overflow-hidden flex">
            <div className="w-1/3 border-l-red-600 border-l-4  border-r-8 border-r-[#FCFC00] "></div>
            <div className="w-1/3 border-r-green-500 border-r-4"></div>
            <div className="w-1/3 "></div>
          </div>
        </div>
        <Button className="w-full bg-gray-100 text-gray-600 flex items-center justify-center">
          <PlusOutlined className="mr-2" />
          Thêm nhiệm vụ sản xuất
        </Button>
      </div>
    </div>
  );
};

export default ProductionTaskManagement;
