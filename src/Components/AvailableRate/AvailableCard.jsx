import React from "react";
import MachineTimeline from "./MachineTimeline"; // Import MachineTimeline component
import { DatePicker } from 'antd';

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const AvailableCard = ({ machineName, selectedDate, machineType }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 ">
      <header className="flex justify-between items-center mb-4">
        {/* Hiển thị tên máy dựa trên loại máy được chọn */}
        <h2 className="text-xl font-semibold">
          {machineType === "CNC" ? `${machineName}` : ` ${machineName}`}
        </h2>
        <DatePicker onChange={onChange} needConfirm />
      </header>
      <div className="card-body">
        {/* MachineTimeline component */}
        <MachineTimeline />
      </div>
    </div>
  );
};

export default AvailableCard;
