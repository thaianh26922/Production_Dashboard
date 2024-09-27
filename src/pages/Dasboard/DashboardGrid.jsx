import React from 'react';
import MachineCard from '../../Components/MachineCard/MachineCard';  // Import the MachineCard component

const DashboardGrid = ({ machines }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 min-h-screen h-full w-full bg-slate-50">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
};

export default DashboardGrid;
