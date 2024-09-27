import React, { useState } from 'react';
import { Modal, Select, DatePicker, Space, Button, Input } from 'antd';
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb';
import MachineWorkScheduleCard from '../../../Components/Equiment/MachineSchedule/MachineWorkScheduleCard';
const { Option } = Select;

const MachineWorkScheduleList = () => {
  const [selectedArea, setSelectedArea] = useState('all'); // State to store selected area
  const [selectedMachine, setSelectedMachine] = useState(null); // Track the selected machine for editing
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  // Sample data for machines (can be fetched from an API)
  const machines = [
    { id: 1, name: 'CNC1', status: 'Chạy', area: 'area1', shift: 'Ca Sáng', employees: ['nv1', 'nv2'] },
    { id: 2, name: 'CNC2', status: 'Chờ', area: 'area1', shift: 'Ca Chiều', employees: ['nv3','nv2'] },
    { id: 3, name: 'CNC3', status: 'Lỗi', area: 'area1', shift: 'Ca Sáng', employees: ['nv3','nv2'] },
    { id: 4, name: 'CNC3', status: 'Lỗi', area: 'area1', shift: 'Ca Sáng', employees: ['nv3','nv2'] },
    
    { id: 5, name: 'CNC3', status: 'Lỗi', area: 'area1', shift: 'Ca Sáng', employees: ['nv3','nv2'] },
    
    { id: 6, name: 'CNC3', status: 'Lỗi', area: 'area2', shift: 'Ca Sáng', employees: ['nv3','nv2'] },
    { id: 7, name: 'CNC3', status: 'Lỗi', area: 'area2', shift: 'Ca Sáng', employees: ['nv3','nv2'] },
    
    { id: 8, name: 'CNC3', status: 'Lỗi', area: 'area2', shift: 'Ca Sáng', employees: ['nv3','nv2'] },
    
    { id: 9, name: 'CNC3', status: 'Lỗi', area: 'area2', shift: 'Ca Sáng', employees: ['nv3','nv2'] },
    
  ];

  // Options for selecting different areas (can be fetched from an API)
  const areaOptions = [
    { value: 'all', label: 'All' },
    { value: 'area1', label: 'Line 01' },
    { value: 'area2', label: 'Line 02' },
  ];

  // Shift and employee options (optional)
  const shiftOptions = [
    { value: 'Ca Sáng', label: 'Ca Sáng' },
    { value: 'Ca Chiều', label: 'Ca Chiều' },
    { value: 'Ca Tối', label: 'Ca Tối' },
  ];

  const employeeOptions = [
    { value: 'nv1', label: 'Nhân viên 1' },
    { value: 'nv2', label: 'Nhân viên 2' },
    { value: 'nv3', label: 'Nhân viên 3' },
    { value: 'nv4', label: 'Nhân viên 4' },
  ];

  // Filter machines based on the selected area
  const filteredMachines =
    selectedArea === 'all'
      ? machines // Show all machines if "All" is selected
      : machines.filter((machine) => machine.area === selectedArea);

  // Handle card click to open the modal for editing
  const handleCardClick = (machine) => {
    setSelectedMachine(machine);
    setIsModalVisible(true);
  };

  // Handle form submission to save the edited details
  const handleSave = () => {
    console.log('Updated machine details:', selectedMachine);
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Breadcrumb and Area Selection */}
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb />
        <div className="flex items-center space-x-1">
          {/* Select Dropdown for Area */}
          <Select
            value={selectedArea}
            onChange={(value) => setSelectedArea(value)} // Update selected area
            placeholder="Chọn khu vực"
            style={{ width: 100 }}
          >
            {areaOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          {/* DatePicker */}
          <Space direction="vertical">
            <DatePicker onChange={(date, dateString) => console.log(date, dateString)} />
          </Space>
        </div>
      </div>

      {/* Machine List */}
      <div className="grid grid-cols-4 gap-2">
        {filteredMachines.map((machine) => (
          <div key={machine.id} onClick={() => handleCardClick(machine)}>
            <MachineWorkScheduleCard
              machine={machine}
              shiftOptions={shiftOptions}
              employeeOptions={employeeOptions}
            />
          </div>
        ))}
      </div>

      {/* Modal for Editing */}
      {selectedMachine && (
        <Modal
          title={`Edit Machine: ${selectedMachine.name}`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary" onClick={handleSave}>
              Save
            </Button>,
          ]}
        >
          <div>
            <label>Status:</label>
            <Select
              value={selectedMachine.status}
              onChange={(value) => setSelectedMachine({ ...selectedMachine, status: value })}
              style={{ width: '100%' }}
            >
              <Option value="Chạy">Chạy</Option>
              <Option value="Chờ">Chờ</Option>
              <Option value="Lỗi">Lỗi</Option>
              <Option value="Tắt">Tắt</Option>
            </Select>
          </div>

          <div>
            <label>Shift:</label>
            <Select
              value={selectedMachine.shift}
              onChange={(value) => setSelectedMachine({ ...selectedMachine, shift: value })}
              style={{ width: '100%' }}
            >
              {shiftOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label>Employees:</label>
            <Select
              mode="multiple"
              value={selectedMachine.employees}
              onChange={(value) => setSelectedMachine({ ...selectedMachine, employees: value })}
              style={{ width: '100%' }}
            >
              {employeeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MachineWorkScheduleList;
