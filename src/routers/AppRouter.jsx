import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';  // Layout cho các role khác
import MainLayout2 from '../layouts/MainLayout2'; // Layout dành riêng cho CNVH
import Dashboard1 from '../pages/Dasboard/Dashboard1'; // Desktop view
import Dashboard2 from '../pages/Dasboard/Dashboard2'; // Mobile view dành cho CNVH
import Login from '../Components/Login'; // Trang Login
import UserManagement from '../pages/Admin/UserManagement'; // Admin page
import DeviceReport from '../pages/Equiment/Report/DeviceReport';
import AreasManagement from '../pages/Equiment/Management/AreasManagement'; // Import Areas Management page
import MachineWorkScheduleList from '../pages/Equiment/Management/MachineWorkScheduleList'; // Import Machine Work Schedule
import ErrorReportCatalog from '../pages/ErrorReportCatalog/ErrorReportCatalog'; // Import Error Report
import WorkShiftCatalog from '../Components/Shifr/WorkShiftCatalog'; // Import Work Shift Catalog
import EmployeeCatalog from '../Components/Equiment/Employee/EmployeeCatalog'; // Import Employee Catalog
import AvailableRate from '../pages/Equiment/AvailableRate/AvailableRate'; // Import Available Rate
import DeviceAnalysis from '../pages/Equiment/Management/Analysis/DeviceAnalysis';
import DeviceManagement from '../pages/Equiment/Management/DeviceManagement'
import ResponeIssue from '../pages/CNVH/ResponeIssue';
import ResponeSubmbit from '../pages/CNVH/ResponeSubmbit';

const ProtectedRoute = ({ children, isAuthenticated, requiredRole, userRole }) => {
  if (!isAuthenticated) {
    
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && requiredRole == !userRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


const checkUserRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('Token:', token, 'Role:', role); 
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route path="/login" element={<Login />} />
        
        {/* Route dành riêng cho CNVH */}
        <Route
          path="/dashboard/mobile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              {checkUserRole(userRole, 'CNVH') ? (
                <MainLayout2>
                  <Dashboard2 /> 
                </MainLayout2>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Route mặc định cho các role khác */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <MainLayout>
                  <Dashboard1 /> 
                </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes: Chỉ Admin có quyền truy cập */}
        <Route
          path="/admin/userlist"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="Admin"
              userRole={userRole}
            >
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Route cho CNVH, ví dụ: Respone Issue */}
        <Route
          path="/dashboard/mobile/issue"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="CNVH"
            >
              {checkUserRole(userRole, 'CNVH') ? (
                <MainLayout2>
                  <ResponeIssue />
                </MainLayout2>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

<Route
          path="/dashboard/mobile/issue/respone"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="CNVH"
            >
              {checkUserRole(userRole, 'CNVH') ? (
                <MainLayout2>
                  <ResponeSubmbit />
                </MainLayout2>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Route cho Device Management */}
        <Route
          path="/importdata/devivce"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <DeviceManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Route cho Areas Management */}
        <Route
          path="/importdata/areas"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <AreasManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Route cho Error Report Catalog */}
        <Route
          path="/importdata/issue"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <ErrorReportCatalog />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Route cho Work Shift Catalog */}
        <Route
          path="/importdata/shift"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <WorkShiftCatalog />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Route cho Employee Catalog */}
        <Route
          path="/importdata/employee"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <EmployeeCatalog />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Route cho Available Rate */}
        <Route
          path="/QCS/availablerate"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <AvailableRate />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Route cho Machine Work Schedule */}
        <Route
          path="/QCS/schedule"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <MachineWorkScheduleList />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/QCS/analysis"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <DeviceAnalysis />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/QCS/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MainLayout>
                <DeviceReport/>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
