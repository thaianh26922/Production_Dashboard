import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Bar } from 'react-chartjs-2';

// Function to get OEE background color
const getOEEColor = (oee) => {
  if (oee >= 90) return '#1dd90f';  // Green
  if (oee >= 80) return '#fdcb6e';  // Orange
  if (oee >= 60) return '#fab1a0';  // Light Red
  return '#d63031';                 // Red
};

// Function to get the header color based on machine status
const getHeaderColor = (status) => {
  if (status === 'Active') return 'bg-green-500';  // Green for Active
  if (status === 'Idle') return 'bg-yellow-300';   // Lighter yellow for Idle
  if (status === 'Set up') return 'bg-yellow-500'; // Yellow for Set up
  if (status === 'Down') return 'bg-red-500';      // Red for Down
  return 'bg-gray-500';                            // Gray for other statuses
};

// Individual Machine Card Component
const MachineCard = ({ machine }) => {
  return (
    <div className="shadow-md" style={{ backgroundColor: getOEEColor(machine.oee) }}>
      {/* 1. Header */}
      <div className={`p-6 flex text-white items-center justify-center ${getHeaderColor(machine.status)}`}>
        {/* Machine Name in the first line */}
        <div> <h2 className="text-xl font-bold mb-2">CNC {machine.id}</h2></div>
        

        {/* Machine Time and Status in the second line */}
        <div className="flex justify-between items-center">
          <span>{machine.time} . {machine.status}</span>
          
        </div>
      </div>

      {/* 2. OEE Section */}
      <div className="flex flex-col items-center mb-4">
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
        <div className="text-center text-white mt-2">
          <span className="text-lg font-bold">{machine.parts}</span>
        </div>
        <div className="text-center text-white">
          <span className="text-sm">
            00641: {machine.diff > 0 ? `${machine.diff} parts ahead` : `${Math.abs(machine.diff)} parts behind`}
          </span>
        </div>
      </div>

      {/* 3. Bar Chart + Time Labels */}
      <div>
        {/* Bar Chart with dynamic background color */}
        <div className={`h-16 mb-1 p-2 bg-gray-100`}>
          <Bar
            data={{
              labels: ['6 AM', '9 AM', '12 PM', '1 PM', '2 PM'],
              datasets: [
                {
                  label: 'Parts',
                  data: machine.chartData, // Example chart data
                  backgroundColor: '#5c4e4e',
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: { display: false },
                x: { display: false },
              },
              plugins: { legend: { display: false }, datalabels: { display: false } },
            }}
          />
        </div>

        {/* Time Labels with dynamic background color */}
        <div className={`flex justify-between text-white text-xs p-1 ${getHeaderColor(machine.status)}`}>
          <span>5:00 AM</span>
          <span>2:00 PM</span>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
