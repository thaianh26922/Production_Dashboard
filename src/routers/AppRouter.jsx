import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dasboard/Dashboard';
import ProductionDashboard from '../pages/Production/ProductionDashboard';
import ProductionPlanCatalog from '../pages/Production/ProductionPlanCatalog';
import EquipmentDashboard from '../pages/Equiment.jsx/EquimentDashboard';
import ProductionAnalysisPage from '../pages/Production/ProductionAnalysisPage';
import QualityDashboard from '../pages/Quality/QualityDashboard';
import EquimentReports from '../pages/Equiment.jsx/EquimentReports';
import QualityOverView from '../pages/Quality/QualityOverView';
import MaintenancePlanCatalog from '../pages/Equiment.jsx/MaintenancePlanCatalog';
import InventoryCatalog from '../pages/Inventory/InventoryCatalog';
import InventoryForm from '../pages/Inventory/InventoryForm';
import InventoryTable from '../pages/Inventory/InventoryTable';
import UserManagement from '../pages/Admin/UserManagement';
import Login from '../Components/Login';

const ProtectedRoute = ({ children, isAuthenticated, requiredRole, userRole }) => {
  if (!isAuthenticated) {
    console.log('User is not authenticated, redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && requiredRole !== userRole) {
    console.log(`User does not have the required role (${requiredRole}). Redirecting to dashboard.`);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role); // Set the role from localStorage or fetched data
      console.log(`User is authenticated with role: ${role}`);
    } else {
      console.log('User is not authenticated.');
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route for Login */}
        <Route path="/login" element={<Login />} />

        {/* Routes inside MainLayout */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />

            {/* Route for Production */}
            <Route path="/production/overview" element={<MainLayout><ProductionDashboard /></MainLayout>} />
            <Route path="/production/reports" element={<MainLayout><ProductionAnalysisPage /></MainLayout>} />
            <Route path="/production/schedule" element={<MainLayout><ProductionPlanCatalog /></MainLayout>} />

            {/* Route for Equipment */}
            <Route path="/equipment/machines" element={<MainLayout><EquipmentDashboard /></MainLayout>} />
            <Route path="/equipment/reports" element={<MainLayout><EquimentReports /></MainLayout>} />
            <Route path="/equipment/maintenance" element={<MainLayout><MaintenancePlanCatalog /></MainLayout>} />

            {/* Route for Quality */}
            <Route path="/quality/overview" element={<MainLayout><QualityOverView /></MainLayout>} />
            <Route path="/quality/reports" element={<MainLayout><QualityOverView /></MainLayout>} />

            {/* Route for Inventory */}
            <Route path="/inventory/material" element={<MainLayout><InventoryForm /></MainLayout>} />
            <Route path="/inventory/reports" element={<MainLayout><InventoryTable /></MainLayout>} />

            {/* Admin Route - Only accessible by admin users */}
            <Route 
              path="/admin/userlist" 
              element={
                <ProtectedRoute 
                  isAuthenticated={isAuthenticated} 
                  requiredRole="Admin" 
                  userRole={userRole}
                >
                  <MainLayout><UserManagement /></MainLayout>
                </ProtectedRoute>
              } 
            />

            {/* Redirect all other paths to Dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          // If not authenticated, redirect all paths to /login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
