import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import DashboardGrid from './DashboardGrid';
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb';

const machines = [
  { id: '001', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '002', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '003', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '004', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '005', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '006', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '007', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '008', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '009', status: 'Error', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '010', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '011', status: 'Idle', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '012', status: 'Set up', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '006', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '007', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '008', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '009', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '010', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '011', status: 'Idle', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '012', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '006', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '007', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '008', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '009', status: 'Error', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '010', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '011', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '012', status: 'Set up', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '006', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '007', status: 'Active', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '008', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '009', status: 'Error', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },
  { id: '010', status: 'Active', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '011', status: 'Idle', time: '3m', oee: 94, pcs: 66, diff: 6, workcenter: 'Line 02', chartData: [5, 4, 6, 3, 7] },
  { id: '012', status: 'Set up', time: '3m', oee: 100, pcs: 66, diff: 6, workcenter: 'Line 01', chartData: [5, 4, 6, 3, 7] },

  // Add more machines here
];

const Dashboard1 = () => {
  const [selectedWorkcenter, setSelectedWorkcenter] = useState('All Workcenters');
  const [selectedOEE, setSelectedOEE] = useState('OEE');
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);  // State for fullscreen toggle
  const cardsRef = useRef(null);  // Ref to access the machine cards section

  // Function to handle workcenter selection
  const handleWorkcenterChange = (e) => {
    setLoading(true);
    setSelectedWorkcenter(e.target.value);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Function to handle OEE selection
  const handleOEEChange = (e) => {
    setSelectedOEE(e.target.value);
  };

  // Function to toggle fullscreen mode using Fullscreen API for machine card section
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (cardsRef.current.requestFullscreen) {
        cardsRef.current.requestFullscreen();
      } else if (cardsRef.current.mozRequestFullScreen) { /* Firefox */
        cardsRef.current.mozRequestFullScreen();
      } else if (cardsRef.current.webkitRequestFullscreen) { /* Chrome, Safari, and Opera */
        cardsRef.current.webkitRequestFullscreen();
      } else if (cardsRef.current.msRequestFullscreen) { /* IE/Edge */
        cardsRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari, and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);  // Toggle fullscreen state
  };

  // Add event listener to detect fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Filter machines based on the selected workcenter
  const filteredMachines = machines.filter((machine) =>
    selectedWorkcenter === 'All Workcenters' || machine.workcenter === selectedWorkcenter
  );

  return (
    <div className="w-full h-full mx-auto relative">
      {/* Breadcrumb and Dropdowns */}
      <div className="flex justify-between items-center mb-4 px-2 ">
        <div className="text-gray-600">
          <Breadcrumb />
        </div>

        <div className="flex space-x-2">
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

      {/* Machine Cards Section */}
      <div ref={cardsRef} className="">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-12 h-12 animate-spin" viewBox="0 0 16 16">
              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
              <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
            </svg>
          </div>
        ) : (
          <DashboardGrid machines={filteredMachines} />
        )}
      </div>

      {/* Fullscreen Button */}
      <button
        className="fixed bottom-4 right-4 z-50 text-white p-3 rounded-full shadow-lg focus:outline-none bg-blue-500 hover:bg-blue-600"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <AiOutlineFullscreenExit size={30} /> : <AiOutlineFullscreen size={30} />}
      </button>
    </div>
  );
};

export default Dashboard1;
