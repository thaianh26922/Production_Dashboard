import React from 'react';
import MachineCard from '../../Components/MachineCard/MachineCard';  // Import MachineCard component

const DashboardGrid = ({ machines }) => {
  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 gap-1 md:grid-cols-3  sm:grid-cols-2" >  
      {machines.map((machine) => (
        <div key={machine.id} className="flex flex-col h-full justify-center">  {/* Each card fits within */}
          <MachineCard machine={machine} className="h-full" />
        </div>
      ))}
    </div>
  );
};

export default DashboardGrid;
