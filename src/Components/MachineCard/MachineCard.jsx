import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Function to get the header color based on machine status
const getHeaderColor = (status) => {
  if (status === 'Chạy') return '#1dd90f';  // Green for Active
  if (status === 'Chờ') return '#f5fa0a';    // Yellow for Idle
  if (status === 'Cài Đặt') return '#f5fa0a';  // Yellow for Set up
  if (status === 'Lỗi') return '#b83b1d';   // Red for Error
  return 'bg-gray-500';                       // Gray for other statuses
};

// Function to get the blink animation class based on machine status
const getBlinkClass = (status) => {
  if (status === 'Lỗi') return 'animate-blinkError';  // Only blink if status is Error
  return '';
};

// Individual Machine Card Component
const MachineCard = ({ machine }) => {
  const headerColor = getHeaderColor(machine.status);
  const blinkClass = getBlinkClass(machine.status); // Apply blinking class if status is 'Error'

  return (
    <div className={`shadow-md ${blinkClass}`} style={{ backgroundColor: headerColor }}>
      {/* 1. Header */}
      <div className={`p-4 mb-2 flex flex-col text-black items-center justify-center ${blinkClass}`} style={{ backgroundColor: headerColor }}>
        {/* Machine Name in the first line */}
        <div> 
          <h2 className="text-4xl font-bold">CNC {machine.id}</h2>
        </div>

        {/* Machine Time and Status in the second line */}
        <div className="text-center">
          <span className="text-lg">{machine.time} · {machine.status}</span>
        </div>
      </div>

      {/* 2. OEE Section */}
      <div className={`flex flex-col items-center mb-7 mt-4 ${blinkClass}`} style={{ backgroundColor: headerColor }}>
        <div className="relative mx-auto" style={{ width: 120, height: 120 }}>
          <CircularProgressbar
            value={machine.oee}
            text={`${machine.oee}%`}
            styles={buildStyles({
              pathColor: '#51524c',
              textColor: '#1c1c1b',
              trailColor: '#c9c9c5',
            })}
          />
        </div>
        <div className="text-center text-white">
          <span className="text-lg font-bold">{machine.parts}</span>
        </div>
      </div>

      {/* 3. Time Labels Section */}
      <div className={`flex justify-between text-black text-md p-1 ${blinkClass}`} style={{ backgroundColor: headerColor }}>
        <span>6:00 AM</span>
        <span>2:00 PM</span>
      </div>
    </div>
  );
};

export default MachineCard;
