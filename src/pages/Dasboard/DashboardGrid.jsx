import React from 'react';
import MachineCard from '../../Components/MachineCard/MachineCard';  // Import the MachineCard component

const DashboardGrid = ({ machines }) => {
  return (
    <div className="grid grid-row md:grid-cols-6 gap-2 min-h-screen h-full w-full auto-rows-fr  bg-slate-50 ">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
};

export default DashboardGrid;
