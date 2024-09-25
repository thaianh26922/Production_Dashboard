import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Function to get the header color based on machine status
const getHeaderColor = (status) => {
  if (status === 'Active') return '#1dd90f';  // Green for Active
  if (status === 'Idle') return '#f1f520';    // Yellow for Idle
  if (status === 'Set up') return '#f7e872';  // Yellow for Set up
  if (status === 'Error') return '#b83b1d';   // Red for Error
  return 'bg-gray-500';                       // Gray for other statuses
};

// Function to get the blink animation class based on machine status
const getBlinkClass = (status) => {
  if (status === 'Error') return 'animate-blinkError';  // Only blink if status is Error
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
          <h2 className="text-xl font-bold">CNC {machine.id}</h2>
        </div>

        {/* Machine Time and Status in the second line */}
        <div className="text-center">
          <span className="text-sm">{machine.time} · {machine.status}</span>
        </div>
      </div>

      {/* 2. OEE Section */}
      <div className={`flex flex-col items-center mb-7 mt-4 ${blinkClass}`} style={{ backgroundColor: headerColor }}>
        <div className="relative mx-auto" style={{ width: 100, height: 100 }}>
          <CircularProgressbar
            value={machine.oee}
            text={`${machine.oee}%`}
            styles={buildStyles({
              pathColor: '#fff',
              textColor: '#fff',
              trailColor: 'rgba(255, 255, 255, 0.2)',
            })}
          />
        </div>
        <div className="text-center text-white">
          <span className="text-lg font-bold">{machine.parts}</span>
        </div>
      </div>

      {/* 3. Time Labels Section */}
      <div className={`flex justify-between text-black text-xs p-1 ${blinkClass}`} style={{ backgroundColor: headerColor }}>
        <span>6:00 AM</span>
        <span>2:00 PM</span>
      </div>
    </div>
  );
};

export default MachineCard;
