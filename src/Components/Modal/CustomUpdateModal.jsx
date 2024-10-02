import React from 'react';
import { Modal, Button } from 'antd';
import Calendar from '../../Components/Calendar/Calendar';
import ProductionTaskManagement from './ProductionTaskManagement'; // Your custom calendar component

const CustomUpdateModal = ({ open, onClose, onCancel, selectedDates, setSelectedDates }) => {
  // Handle saving the production tasks
  const openSuccessNotification = () => {
    notification.success({
      message: 'Lưu thành công',
      description: 'Kế hoạch và thiết bị đã được lưu thành công.',
      duration: 3, // Notification will disappear after 3 seconds
    });
  };
  const handleSave = () => {
    console.log('Saved Dates:', selectedDates);
   
    
    onClose(); // Close the modal after saving
    
  };
  

  return (
    <Modal
      title="Nhiệm vụ sản xuất"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            if (typeof onCancel === 'function') {
              onCancel(); // Clear selected dates
            }
            onClose(); // Close the modal
          }}
        >
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
        {/* Pass selectedDates and setSelectedDates to Calendar */}
        <Calendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
      </div>
      <div className="p-2 col-span-1"> <ProductionTaskManagement/></div>

      </div>
      
    </Modal>
  );
};

export default CustomUpdateModal;
