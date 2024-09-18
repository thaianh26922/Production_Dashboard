import React, { useState } from 'react';
import MachineDetails from '../../Components/Equiment/MachineDetails';
import PerformanceMetrics from '../../Components/Equiment/PerformanceMetrics';
import RealTimeEnergyChart from '../../Components/Equiment/RealTimeEnergyChart';
import HourlyProductionChart from '../../Components/Equiment/HourlyProductionChart';

const EquipmentDashboard = () => {
  const [currentMachine, setCurrentMachine] = useState('Máy Trộn');

  return (
    <>
      <div className="w-full h-full  ">
        
        {/* Hàng 1: MachineDetails (đã tích hợp MachineSelection) */}
        <div className="bg-white rounded-lg  shadow-lg   ">
          <MachineDetails machineName={currentMachine} setCurrentMachine={setCurrentMachine} />
        </div>
        
        {/* Hàng 2: PerformanceMetrics */}
        <div className="bg-white rounded-lg p-4 shadow-lg mt-2">
          <PerformanceMetrics />
        </div>
        
        {/* Hàng 3: RealTimeEnergyChart và HourlyProductionChart (cùng một hàng) */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <RealTimeEnergyChart />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <HourlyProductionChart />
          </div>
        </div>

      </div>
    </>
  );
};

export default EquipmentDashboard;
