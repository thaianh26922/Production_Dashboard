import React, { useState } from 'react';
import DashboardGrid from './DashboardGrid';  // Import DashboardGrid component

const machines = [
    { id: '001', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
    { id: '002', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
    { id: 113, status: 'Active', time: '6m', oee: 80, pcs: 236, diff: -56, workcenter: 'Line 01', chartData: [6, 2, 4, 3, 6] },
    { id: 120, status: 'Idle', time: '7m', oee: 78, pcs: 229, diff: -62, workcenter: 'Line 01', chartData: [4, 2, 5, 3, 7] },
    { id: 119, status: 'Active', time: '6m', oee: 80, pcs: 236, diff: -56, workcenter: 'Line 01', chartData: [6, 2, 4, 3, 6] },
    { id: 120, status: 'Active', time: '7m', oee: 78, pcs: 229, diff: -62, workcenter: 'Line 01', chartData: [4, 2, 5, 3, 7] },
    { id: 120, status: 'Set up', time: '7m', oee: 78, pcs: 229, diff: -62, workcenter: 'Line 01', chartData: [4, 2, 5, 3, 7] },
    { id: 120, status: 'Active', time: '7m', oee: 78, pcs: 229, diff: -62, workcenter: 'Line 02', chartData: [4, 2, 5, 3, 7] },
    { id: 119, status: 'Active', time: '6m', oee: 80, pcs: 236, diff: -56, workcenter: 'Line 02', chartData: [6, 2, 4, 3, 6] },
    { id: 120, status: 'Down', time: '7m', oee: 78, pcs: 229, diff: -62, workcenter: 'Line 02', chartData: [4, 2, 5, 3, 7] },
];

const Dashboard1 = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState('All Workcenters');
  const [selectedOEE, setSelectedOEE] = useState('OEE');
  const [loading, setLoading] = useState(false);  // Add loading state

  // Function to handle workcenter selection
  const handleWorkcenterChange = (e) => {
    setLoading(true); // Show loading spinner when switching lines
    setSelectedWorkcenter(e.target.value);

    // Simulate a loading delay with setTimeout
    setTimeout(() => {
      setLoading(false); // Hide loading after delay
    }, 500); // Adjust delay as needed
  };

  // Function to handle OEE selection
  const handleOEEChange = (e) => {
    setSelectedOEE(e.target.value);
  };

  // Filter machines based on the selected workcenter
  const filteredMachines = machines.filter((machine) =>
    selectedWorkcenter === 'All Workcenters' || machine.workcenter === selectedWorkcenter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb and Dropdowns */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          <span>Home / </span>
          <span className="font-bold">Current Shift Dashboard</span>
        </div>

        <div className="flex space-x-4">
          {/* Dropdown for Workcenter */}
          <div className="relative">
            <select
              value={selectedWorkcenter}
              onChange={handleWorkcenterChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-6 leading-tight focus:outline-none hover:bg-gray-50 transition duration-150"
            >
              <option value="All Workcenters">All Workcenters</option>
              <option value="Line 01">Line 01</option>
              <option value="Line 02">Line 02</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>

          {/* Dropdown for OEE */}
          <div className="relative">
            <select
              value={selectedOEE}
              onChange={handleOEEChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-6 text-left leading-tight focus:outline-none hover:bg-gray-50 transition duration-150"
            >
              <option value="OEE">OEE</option>
              <option value="DownTime">DownTime</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional rendering: Show loading spinner or the filtered machines */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          {/* Simple loading spinner */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-12 h-12 animate-spin"
            viewBox="0 0 16 16">
            <path
                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
            <path fill-rule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
        </svg>
        </div>
      ) : (
        <DashboardGrid machines={filteredMachines} />
      )}
    </div>
  );
};

export default Dashboard1;
