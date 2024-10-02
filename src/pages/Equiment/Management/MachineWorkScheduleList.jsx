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
  const [selectedDates, setSelectedDates] = useState([]); // Track selected dates
  const [selectedMachines, setSelectedMachines] = useState([]); // Track selected machines
  const [isSelecting, setIsSelecting] = useState(false); // Track if the user is selecting devices
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Modal visibility for update confirmation
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false); // Custom modal visibility for the final confirmation

  // Handle saving the selected dates
  const handleSaveDates = () => {
    console.log('Saved dates:', selectedDates); // Log or process the saved dates
    setIsCustomModalOpen(false); // Close modal after saving
  };

  // Handle canceling the selected dates
  const handleCancelDates = () => {
    setSelectedDates([]); // Clear selected dates on cancel
    setIsCustomModalOpen(false); // Close the modal
  };

  // Toggle machine selection mode
  const toggleSelecting = () => {
    if (isSelecting) {
      setSelectedMachines([]); // Clear selected machines when switching to "Bỏ Chọn"
    }
    setIsSelecting(!isSelecting);
  };

  // Toggle machine selection when clicking a card
  const handleMachineClick = (machine) => {
    if (!isSelecting) {
      setIsSelecting(true); // Automatically enable selection mode if not already enabled
    }

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

  // Handle form submission to save the edited details
  const handleSave = () => {
    console.log('Updated machine details:', selectedMachines);
    setIsUpdateModalOpen(false); // Close the modal after saving
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
    setIsUpdateModalOpen(false); // Close the update confirmation modal
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

          {/* Toggle "Chọn Thiết Bị" or "Bỏ Chọn Thiết Bị" */}
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
            className={`relative cursor-pointer transition duration-300 ease-in-out h-full
              ${isSelecting && selectedMachines.includes(machine.id) ? 'border-2 border-blue-700 round-lg bg-gray-600 ' : ''}`}
            onClick={() => handleMachineClick(machine)} // Handle card click
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
            {/* Green tick for selected machines, only visible when a machine is selected */}
            {isSelecting && selectedMachines.includes(machine.id) && (
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
        open={isUpdateModalOpen}
        onCancel={handleCancelUpdate}
        onOk={handleConfirmUpdate}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có muốn cập nhật nhiệm vụ sản xuất cho các thiết bị đã chọn?</p>
      </Modal>

      {/* Custom Modal after Update Confirmation */}
      <CustomUpdateModal
        open={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onCancel={handleCancelDates} // Clear dates and close modal
        onSave={handleSaveDates} // Save the selected dates
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
    </>
  );
};

export default MachineWorkScheduleList;
