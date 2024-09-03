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
      setUserRole(role); 
      
    } else {
      console.log('User is not authenticated.');
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route for Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes for authenticated users */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Production Routes */}
        <Route
          path="/production/overview"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><ProductionDashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/production/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><ProductionAnalysisPage /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/production/schedule"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><ProductionPlanCatalog /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Equipment Routes */}
        <Route
          path="/equipment/machines"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><EquipmentDashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><EquimentReports /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment/maintenance"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><MaintenancePlanCatalog /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Quality Routes */}
        <Route
          path="/quality/overview"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><QualityOverView /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quality/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><QualityDashboard /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Inventory Routes */}
        <Route
          path="/inventory/material"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><InventoryForm /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout><InventoryTable /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
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

        {/* Redirect all other paths */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
