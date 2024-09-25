import React from 'react';
import MachineCard from '../../Components/MachineCard/MachineCard';  // Import the MachineCard component

const DashboardGrid = ({ machines }) => {
  return (
    <div className="grid grid-row md:grid-cols-7 gap-1 2xl:flex-grow-1">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
};

export default DashboardGrid;
