import React, { useState } from 'react';
import { Modal, Select, Calendar, Button } from 'antd';
import moment from 'moment';

const { Option } = Select;

const CustomUpdateModal = ({ open, onClose, selectedMachines }) => {
  const [selectedDevice, setSelectedDevice] = useState(null); // State to store selected device
  const [schedule, setSchedule] = useState({}); // Store production tasks by date

  // Handle device selection
  const handleDeviceChange = (value) => {
    setSelectedDevice(value);
  };

  // Handle calendar cell selection
  const handleDateSelect = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    // Add or update schedule for the selected date
    setSchedule({
      ...schedule,
      [formattedDate]: '01', // Example task, you can customize this logic
    });
  };

  // Handle saving the production tasks
  const handleSave = () => {
    console.log('Saved Schedule:', schedule);
    onClose(); // Close modal after saving
  };

  // Render calendar date cell with production task (if any)
  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const task = schedule[formattedDate];

    return (
      <div className="task-cell">
        {task ? <span>{task}</span> : null}
      </div>
    );
  };

  // Customize calendar header to match your layout
  const customHeaderRender = ({ value, onChange }) => {
    const currentMonth = value.format('MMMM');
    const currentYear = value.format('YYYY');

    const nextMonth = () => onChange(value.clone().add(1, 'months'));
    const prevMonth = () => onChange(value.clone().subtract(1, 'months'));

    return (
      <div className="custom-calendar-header">
        <Button onClick={prevMonth} icon={<span>&lt;</span>} />
        <span className="text-xl font-bold">
          {currentMonth} {currentYear}
        </span>
        <Button onClick={nextMonth} icon={<span>&gt;</span>} />
      </div>
    );
  };

  return (
    <Modal
      title="Production Schedule"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save Schedule
        </Button>,
      ]}
      width={1000} // Adjust the modal width
    >
      <div className="flex">
        <div className="w-3/4">
          {/* Calendar */}
          <Calendar
            dateCellRender={dateCellRender}
            onSelect={handleDateSelect}
            headerRender={customHeaderRender}
            fullscreen={false}
          />
        </div>
        <div className="w-1/4 pl-4">
          {/* Dropdown to select a device */}
          <h4>Device</h4>
          <Select
            value={selectedDevice}
            onChange={handleDeviceChange}
            style={{ width: '100%' }}
            placeholder="Select Device"
          >
            {selectedMachines.map((machine) => (
              <Option key={machine.id} value={machine.name}>
                {machine.name}
              </Option>
            ))}
          </Select>

          {/* Placeholder for production task input */}
          <h4 className="mt-4">Production Task</h4>
          <div>
            <input
              type="text"
              placeholder="Enter task"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomUpdateModal;
