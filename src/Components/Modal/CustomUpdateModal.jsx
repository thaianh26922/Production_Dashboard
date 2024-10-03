import React from 'react';
import { Modal, Button } from 'antd';
import CustomCalendar from '../../Components/Calendar/CustomCalendar';
import ProductionTaskManagement from './ProductionTaskManagement'; // Import your custom task management component

const CustomUpdateModal = ({ open, onClose, onCancel, selectedDates, setSelectedDates,selectedMachines }) => {
  
  // Function to handle saving dates
  const handleSave = () => {
    console.log('Saved Dates:', selectedDates);
    setSelectedDates([]); // Clear selected dates after saving (removes blue background)
    onClose(); // Close the modal after saving
  };

  // Function to handle cancel action
  const handleCancel = () => {
    setSelectedDates([]); // Clear selected dates when cancel is clicked
    onCancel(); // Call the onCancel prop function if provided
    onClose(); // Close the modal
  };

  return (
    <Modal
      title="Nhiệm vụ sản xuất"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy bỏ
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu kế hoạch
        </Button>,
      ]}
      width={1200}
    >
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 col-span-3">
          {/* Pass selectedDates and setSelectedDates to CustomCalendar */}
          <CustomCalendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
        </div>
        <div className="p-2 col-span-1">
          {/* Production Task Management */}
          <ProductionTaskManagement selectedMachines={selectedMachines}  />
        </div>
      </div>
    </Modal>
  );
};

export default CustomUpdateModal;
