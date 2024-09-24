import React from 'react';
import MachineCard from '../../Components/MachineCard/MachineCard';  // Import the MachineCard component

const DashboardGrid = ({ machines }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
};

export default DashboardGrid;
