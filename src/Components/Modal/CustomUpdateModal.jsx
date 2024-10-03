import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import CustomCalendar from '../../Components/Calendar/CustomCalendar';
import ProductionTaskManagement from './ProductionTaskManagement';

const CustomUpdateModal = ({ open, onClose, onCancel, selectedDates, setSelectedDates, selectedMachines }) => {
  const [taskData, setTaskData] = useState({}); // Store shift data associated with dates

  // Function to handle saving tasks along with selected dates
  const handleSave = () => {
    const updatedTaskData = { ...taskData };

    selectedDates.forEach(date => {
      if (selectedMachines.length > 0) {
        updatedTaskData[date] = {
          machines: selectedMachines, // Save selected machines for the date
          tasks: taskData.tasksForThisDate || [], // Ensure task data is saved with the date
        };
      }
    });

    setTaskData(updatedTaskData); // Save task info with associated dates
    console.log('Saved Task Data:', updatedTaskData);
    setSelectedDates([]); // Clear selected dates after saving
    onClose(); // Close the modal after saving
  };

  // Function to handle cancel action
  const handleCancel = () => {
    setSelectedDates([]); // Clear selected dates
    onCancel(); // Call the onCancel prop function if provided
    onClose(); // Close the modal
  };

  // Function to pass saved task info to the calendar
  const getTaskForDate = (date) => taskData[date] || null;

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
          {/* Pass selectedDates and taskData to CustomCalendar */}
          <CustomCalendar
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            getTaskForDate={getTaskForDate} // Function to get saved tasks for a date
          />
        </div>
        <div className="p-2 col-span-1">
          {/* Production Task Management */}
          <ProductionTaskManagement 
            selectedMachines={selectedMachines}
            setTaskData={setTaskData} // Pass the function to update task data
          />
        </div>
      </div>
    </Modal>
  );
};

export default CustomUpdateModal;
