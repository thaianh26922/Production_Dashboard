import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dasboard/Dashboard';
import ProductionDashboard from '../pages/Production/ProductionDashboard';
import ProductionPlanCatalog from '../pages/Production/ProductionPlanCatalog';
import EquipmentDashboard from '../pages/Equiment.jsx/EquimentDashboard';
import ProductionAnalysisPage from '../pages/Production/ProductionAnalysisPage';
import QualityDashboard from '../pages/Quality/QualityDashboard';
import EquimentReports from '../pages/Equiment.jsx/EquimentReports';
import QualityOverView from '../pages/Quality/QualityOverView';

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
          <Route path="/production/reports" element={<ProductionAnalysisPage />} />
          <Route path="/production/schedule" element={<ProductionPlanCatalog />} />

           {/* Route cho Equiment */}
           <Route path="/equipment/machines" element={<EquipmentDashboard/>} />
          <Route path="/equipment/reports" element={<EquimentReports />} />

           {/* Route cho Quality */}
           <Route path="/quality/overview" element={<QualityOverView />} />
          <Route path="/quality/reports" element={<QualityOverView/>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
