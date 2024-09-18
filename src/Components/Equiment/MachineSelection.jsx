import React from 'react';

const MachineSelection = ({ currentMachine, setCurrentMachine }) => {
  return (
    <div className="lg:col-span-1 flex flex-col items-stretch bg-">
      <button 
        className={`p-2 my-2 rounded transition duration-300 text-center ${currentMachine === 'Máy Trộn' ? 'bg-green-500 text-white' : 'bg-green-200 text-black'}`} 
        onClick={() => setCurrentMachine('Máy Trộn')}
      >
        Máy Trộn
      </button>
      <button 
        className={`p-2 my-2 rounded transition duration-300 text-center ${currentMachine === 'Máy Định Hình' ? 'bg-green-500 text-white' : 'bg-green-200 text-black'}`} 
        onClick={() => setCurrentMachine('Máy Định Hình')}
      >
        Máy Định Hình
      </button>
      <button 
        className={`p-2 my-2 rounded transition duration-300 text-center ${currentMachine === 'Máy Nướng' ? 'bg-green-500 text-white' : 'bg-green-200 text-black'}`} 
        onClick={() => setCurrentMachine('Máy Nướng')}
      >
        Máy Nướng
      </button>
      <button 
        className={`p-2 my-2 rounded transition duration-300 text-center ${currentMachine === 'Máy Đóng Gói' ? 'bg-green-500 text-white' : 'bg-green-200 text-black'}`} 
        onClick={() => setCurrentMachine('Máy Đóng Gói')}
      >
        Máy Đóng Gói
      </button>
    </div>
  );
};

export default MachineSelection;
