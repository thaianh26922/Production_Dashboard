import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dasboard/Dashboard';
import ProductionDashboard from '../pages/Production/ProductionDashboard';
import ProductionPlanCatalog from '../pages/Production/ProductionPlanCatalog';
import EquipmentDashboard from '../pages/Equiment.jsx/EquimentDashboard';

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
        <Route path="/" element={<Dashboard />} />
          {/* Route cho Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Route cho Production */}
          <Route path="/production/overview" element={<ProductionDashboard />} />
          <Route path="/production/schedule" element={<ProductionPlanCatalog />} />

           {/* Route cho Equiment */}
           <Route path="/equipment/machines" element={<EquipmentDashboard/>} />
          <Route path="/equipment/Maintenance" element={<ProductionPlanCatalog />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
