import React from 'react';
import MachineCard from '../../Components/MachineCard/MachineCard';  // Import MachineCard component

const DashboardGrid = ({ machines }) => {
  return (
    <div className="grid grid-cols-6 gap-1">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
};

export default DashboardGrid;
