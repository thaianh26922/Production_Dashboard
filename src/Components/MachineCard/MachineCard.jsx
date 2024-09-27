import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Function to get the header color based on machine status
const getHeaderColor = (status) => {
  if (status === 'Chạy') return '#38F338';  // Green for Active
  if (status === 'Chờ') return '#F5F542';   // Yellow for Idle
  if (status === 'Cài Đặt') return '#F5F542';  // Yellow for Set up
  if (status === 'Lỗi') return 'red';       // Red for Error
  if (status === 'Off') return '#f7f5f5';   // Grey for Off
  return 'bg-gray-500';                     // Gray for other statuses
};

// Function to get the signal light colors based on machine status
const getSignalLightColors = (status) => {
  if (status === 'Chạy') return { red: 'white', yellow: 'white', green: '#8ff28f' };
  if (status === 'Chờ' || status === 'Cài Đặt') return { red: 'white', yellow: '#fafa98', green: 'white' };
  if (status === 'Lỗi') return { red: 'red', yellow: 'white', green: 'white' };
  if (status === 'Off') return { red: 'white', yellow: 'white', green: 'white' };
  return { red: 'white', yellow: 'white', green: 'white' }; // Default case
};

// Individual Machine Card Component
const MachineCard = ({ machine }) => {
  const headerColor = getHeaderColor(machine.status);
  const signalLightColors = getSignalLightColors(machine.status); // Get signal light colors

  // Apply the blink class if status is "Lỗi"
  const blinkClass = machine.status === 'Lỗi' ? 'animate-blinkError' : '';

  return (
    <div className={`shadow-md flex flex-col justify-between h-full ${blinkClass}`} style={{ backgroundColor: headerColor }}>
      {/* 1. Header */}
      <div className={`mb-1 flex flex-col items-center justify-center ${blinkClass}`} style={{ backgroundColor: headerColor }}>
        {/* Machine Name */}
        <div className={`text-[#122a35] bg-black-rgba w-full flex justify-center py-1 ${blinkClass}`}> 
          <h2 className="text-5xl font-bold text-[#375BA9]">CNC {machine.id}</h2>
        </div>

        {/* Machine Time and Status */}
        <div className="text-center mt-3"  >
          <span className="text-2xl font-bold">{machine.time} - {machine.status}</span>
        </div>
      </div>

      {/* 2. OEE Section */}
      <div className="flex items-center ml-2 justify-center bg-transparent p-2 mb-8">
        {/* Signal Light */}
        <div className={`flex flex-col  justify-center items-center `}>
          {/* Add signal light as a rectangle */}
          <div className="w-14 h-40 border border-black rounded-lg ">
            <div style={{ backgroundColor: signalLightColors.red, height: '33.33%'  }} className={`rounded-t-lg ${blinkClass} border-l-red-600 border-l-4 rounded-t-lg border-b-2 border-b-red-600` }></div>
            <div style={{ backgroundColor: signalLightColors.yellow, height: '33.33%' }} className="border-[#FCFC00] border-l-4 border-b-2" ></div>
            <div style={{ backgroundColor: signalLightColors.green, height: '33.33%' }} className="border-[#38F338] border-l-4 rounded-b-lg"></div>
          </div>
        </div>

        {/* OEE Circular Progress */}
        <div className="relative mx-auto" style={{ width: 120, height: 120 }}>
          <CircularProgressbar
            value={machine.oee}
            text={`${machine.oee}%`}
            styles={buildStyles({
              pathColor: '#0782f4',
              textColor: '#122a35',
              fontSize: 'bold',
              trailColor: '#dbdbd7',
            })}
          />
        </div>
      </div>

      {/* 3. Time Labels Section */}
      <div className="flex justify-between text-black px-6">
        <span className="text-xl font-bold">8:00 AM</span>
        <span className="text-xl font-bold">5:00 PM</span>
      </div>
    </div>
  );
};

export default MachineCard;
