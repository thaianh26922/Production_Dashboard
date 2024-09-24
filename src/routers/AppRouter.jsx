import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dasboard/Dashboard';
import ProductionDashboard from '../pages/Production/ProductionDashboard';
import ProductionPlanCatalog from '../pages/Production/ProductionPlanCatalog';
import EquipmentDashboard from '../pages/Equiment/EquimentDashboard';
import ProductionAnalysisPage from '../pages/Production/ProductionAnalysisPage';
import QualityDashboard from '../pages/Quality/QualityDashboard';
import EquimentReports from '../pages/Equiment/EquimentReports';
import QualityOverView from '../pages/Quality/QualityOverView';
import MaintenancePlanCatalog from '../pages/Equiment/MaintenancePlanCatalog';
import InventoryCatalog from '../pages/Inventory/InventoryCatalog';
import InventoryForm from '../pages/Inventory/InventoryForm';
import InventoryTable from '../pages/Inventory/InventoryTable';
import UserManagement from '../pages/Admin/UserManagement';
import EquipmentAnalysis from '../pages/Equiment/EquipmentAnalysis';
import MachineReport from '../pages/Equiment/MachineReport'
import Profile from '../pages/Profile/Profile'
import Messenger from '../pages/Message/Messenger ';
import FAQAccordion from '../pages/FAQ/FAQAccordion'
import Dashboard1 from '../pages/Dasboard/Dashboard1';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Dashboard1 /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard1 /></MainLayout>} />

        {/* Production Routes */}
        <Route path="/production/overview" element={<MainLayout><ProductionDashboard /></MainLayout>} />
        <Route path="/production/reports" element={<MainLayout><ProductionAnalysisPage /></MainLayout>} />
        <Route path="/production/schedule" element={<MainLayout><ProductionPlanCatalog /></MainLayout>} />

        {/* Equipment Routes */}
        <Route path="/equipment/machines" element={<MainLayout><EquipmentDashboard /></MainLayout>} />
        <Route path="/equipment/analysis" element={<MainLayout> <EquipmentAnalysis /> </MainLayout>} />
        <Route path="/equipment/reports" element={<MainLayout><MachineReport /></MainLayout>} />
        <Route path="/equipment/maintenance" element={<MainLayout><MaintenancePlanCatalog /></MainLayout>} />

        {/* Quality Routes */}
        <Route path="/quality/overview" element={<MainLayout><QualityOverView /></MainLayout>} />
        <Route path="/quality/reports" element={<MainLayout><QualityDashboard /></MainLayout>} />

        {/* Inventory Routes */}
        <Route path="/inventory/material" element={<MainLayout><InventoryForm /></MainLayout>} />
        <Route path="/inventory/reports" element={<MainLayout><InventoryTable /></MainLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/userlist" element={<MainLayout><UserManagement /></MainLayout>} />

        <Route path="/settings/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/support/faq" element={<MainLayout> <FAQAccordion /> </MainLayout>} />
        <Route path="/message" element={<MainLayout><Messenger /></MainLayout>} />

        {/* Redirect tất cả các đường dẫn khác */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
