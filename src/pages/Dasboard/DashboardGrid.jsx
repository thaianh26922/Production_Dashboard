import React from 'react';
import MachineCard from '../../Components/MachineCard/MachineCard';  // Import MachineCard component

const DashboardGrid = ({ machines }) => {
  return (
    <div className="grid lg:grid-cols-6 gap-1 h-screen sm:grid-cols-2" style={{ maxHeight: '100vh' }}>  {/* Full screen height */}
      {machines.map((machine) => (
        <div key={machine.id} className="flex flex-col h-full justify-center">  {/* Each card fits within */}
          <MachineCard machine={machine} className="h-full" />
        </div>
      ))}
    </div>
  );
};

export default DashboardGrid;
