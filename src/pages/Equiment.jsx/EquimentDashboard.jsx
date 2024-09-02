import React, { useState } from 'react';
import MachineSelection from './MachineSelection';
import MachineDetails from './MachineDetails';
import PerformanceMetrics from './PerformanceMetrics';
import RealTimeEnergyChart from './RealTimeEnergyChart';
import HourlyProductionChart from './HourlyProductionChart';

const EquipmentDashboard = () => {
  const [currentMachine, setCurrentMachine] = useState('Máy Trộn');

  return (
    < >
    <div className="w-vh h-vh">
        <div className="p-2 h-1/3 bg-white rounded-lg grid grid-cols-8 gap-4 ">
            {/* MachineSelection chiếm 1 cột và cao 1/3 của viewport height */}
            <div className="col-span-1 ">
              <MachineSelection currentMachine={currentMachine} setCurrentMachine={setCurrentMachine} />
            </div>

            {/* MachineDetails chiếm 7 cột và cao 2/3 của viewport height */}
            <div className="col-span-7 ">
              <MachineDetails machineName={currentMachine} />
            </div>
        </div>
      

    </div>
    <PerformanceMetrics />
    <div className="grid grid-cols-2 gap-4 mt-2">  
      <div className="bg-white rounded-lg shadow-lg p-4">
        <RealTimeEnergyChart />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <HourlyProductionChart />
      </div>
    </div>

      
    </>
    
  );
};

export default EquipmentDashboard;
