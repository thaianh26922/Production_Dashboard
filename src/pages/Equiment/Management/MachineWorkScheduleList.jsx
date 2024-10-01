import React, { useState } from 'react';
import { Modal, Select, DatePicker, Button } from 'antd';
import MachineWorkScheduleCard from '../../../Components/Equiment/MachineSchedule/MachineWorkScheduleCard';
import CustomUpdateModal from '../../../Components/Modal/CustomUpdateModal'; // Import custom modal component
const { Option } = Select;

function onChange(date, dateString) {
  console.log(date, dateString);
}

const MachineWorkScheduleList = () => {
  const [selectedArea, setSelectedArea] = useState('all'); // State to store selected area
  const [selectedMachines, setSelectedMachines] = useState([]); // Track selected machines
  const [isSelecting, setIsSelecting] = useState(false); // Track if the user is selecting devices
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Modal visibility for update confirmation
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false); // Custom modal visibility for the final confirmation

  // Toggle machine selection mode
  const toggleSelecting = () => {
    if (isSelecting) {
      // Clear selected machines when switching to "Bỏ Chọn"
      setSelectedMachines([]);
    }
    setIsSelecting(!isSelecting);
  };

  // Toggle machine selection
  const handleMachineClick = (machine) => {
    if (!isSelecting) return; // If not in selection mode, do nothing

    if (selectedMachines.includes(machine.id)) {
      // Unselect the machine if it's already selected
      setSelectedMachines(selectedMachines.filter((mId) => mId !== machine.id));
    } else {
      // Select the machine
      setSelectedMachines([...selectedMachines, machine.id]);
    }
  };

  // Dynamic machines generation based on selected area
  const generateMachines = () => {
    if (selectedArea === 'area1') {
      // Generate 17 CNC machines for KHU VỰC TIỆN
      return Array.from({ length: 17 }, (_, index) => ({
        id: index + 1,
        name: `CNC - ${index + 1}`,
        status: 'Chạy',
        area: 'area1',
        shift: 'Ca Sáng',
        employees: ['nv1', 'nv2'],
      }));
    } else if (selectedArea === 'area2') {
      // Generate 18 PHAY machines for KHU VỰC PHAY
      return Array.from({ length: 18 }, (_, index) => ({
        id: index + 1,
        name: `PHAY - ${index + 1}`,
        status: 'Chờ',
        area: 'area2',
        shift: 'Ca Chiều',
        employees: ['nv3', 'nv4'],
      }));
    } else {
      // Show all machines (combination of CNC and PHAY)
      const cncMachines = Array.from({ length: 17 }, (_, index) => ({
        id: index + 1,
        name: `CNC - ${index + 1}`,
        status: 'Chạy',
        area: 'area1',
        shift: 'Ca Sáng',
        employees: ['nv1', 'nv2'],
      }));
      const phayMachines = Array.from({ length: 18 }, (_, index) => ({
        id: index + 18 + 1,
        name: `PHAY - ${index + 1}`,
        status: 'Chờ',
        area: 'area2',
        shift: 'Ca Chiều',
        employees: ['nv3', 'nv4'],
      }));
      return [...cncMachines, ...phayMachines];
    }
  };

  // Handle card click to open the modal for editing
  const handleCardClick = (machine) => {
    if (!isSelecting) return; // Prevent modal from opening if selecting mode is active
  };

  // Handle form submission to save the edited details
  const handleSave = () => {
    console.log('Updated machine details:', selectedMachines);
    setIsUpdateModalOpen(false);
  };

  // Handle "Cập nhật nhiệm vụ sản xuất" button click
  const handleUpdateClick = () => {
    setIsUpdateModalOpen(true); // Show update confirmation modal
  };

  // Handle modal confirmation
  const handleConfirmUpdate = () => {
    setIsUpdateModalOpen(false); // Close modal on confirm
    setIsCustomModalOpen(true); // Show custom modal after confirmation
  };

  // Handle canceling the update (close modal and clear selections)
  const handleCancelUpdate = () => {
    setIsUpdateModalOpen(false);
    setSelectedMachines([]); // Clear selected machines on cancel
  };

  return (
    <>
      {/* Area Selection */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1">
          {/* Select Dropdown for Area */}
          <Select
            value={selectedArea}
            onChange={(value) => setSelectedArea(value)} // Update selected area
            placeholder="Chọn khu vực"
            style={{ width: 160 }}
          >
            {/* Area options */}
            <Option value="all">Toàn nhà máy</Option>
            <Option value="area1">KHU VỰC TIỆN</Option>
            <Option value="area2">KHU VỰC PHAY</Option>
          </Select>
          <Button onClick={toggleSelecting}>
            {isSelecting ? 'Bỏ Chọn Thiết Bị' : 'Chọn Thiết Bị'}
          </Button>

          {/* DatePicker */}
          <DatePicker onChange={onChange} />

          {/* Conditionally render "Cập nhật nhiệm vụ sản xuất" */}
          {selectedMachines.length > 0 && (
            <Button type="primary" className="ml-2" onClick={handleUpdateClick}>
              Cập nhật nhiệm vụ sản xuất
            </Button>
          )}
        </div>
      </div>

      {/* Machine List */}
      <div className="grid grid-cols-4 gap-2">
        {generateMachines().map((machine) => (
          <div
            key={machine.id}
            className={`relative cursor-pointer ${isSelecting && selectedMachines.includes(machine.id) ? 'border-2 border-blue-500' : ''}`}
            onClick={() => handleMachineClick(machine)}
          >
            <MachineWorkScheduleCard
              machine={machine}
              shiftOptions={[
                { value: 'Ca Sáng', label: 'Ca Sáng' },
                { value: 'Ca Chiều', label: 'Ca Chiều' },
                { value: 'Ca Tối', label: 'Ca Tối' },
              ]}
              employeeOptions={[
                { value: 'nv1', label: 'Nhân viên 1' },
                { value: 'nv2', label: 'Nhân viên 2' },
                { value: 'nv3', label: 'Nhân viên 3' },
                { value: 'nv4', label: 'Nhân viên 4' },
              ]}
            />
            {selectedMachines.includes(machine.id) && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Update Confirmation Modal */}
      <Modal
        title="Xác nhận cập nhật"
        open={isUpdateModalOpen} // Use 'open' instead of 'visible'
        onCancel={handleCancelUpdate} // Clear selections on cancel
        onOk={handleConfirmUpdate}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có muốn cập nhật nhiệm vụ sản xuất cho các thiết bị đã chọn?</p>
      </Modal>

      {/* Custom Modal after Update Confirmation */}
      <CustomUpdateModal
        open={isCustomModalOpen} // Use 'open' instead of 'visible'
        onClose={() => setIsCustomModalOpen(false)}
        selectedMachines={selectedMachines}
      />
    </>
  );
};

export default MachineWorkScheduleList;
