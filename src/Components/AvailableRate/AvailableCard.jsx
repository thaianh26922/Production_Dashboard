import React from "react";
import MachineTimeline from "./MachineTimeline"; // Import MachineTimeline component

const AvailableCard = ({ machineName, selectedDate, machineType }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 ">
      <header className="flex justify-between items-center mb-4">
        {/* Hiển thị tên máy dựa trên loại máy được chọn */}
        <h2 className="text-xl font-semibold">
          {machineType === "CNC" ? `${machineName}` : ` ${machineName}`}
        </h2>
        <input
          type="date"
          value={selectedDate}
          onChange={() => {}}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </header>
      <div className="card-body">
        {/* MachineTimeline component */}
        <MachineTimeline />
      </div>
    </div>
  );
};

export default AvailableCard;
