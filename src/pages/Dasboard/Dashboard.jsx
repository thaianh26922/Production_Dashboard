import React from 'react';
import ProductionDashboard from '../Production/ProductionDashboard';
import QualityDashboard from '../Quality/QualityDashboard';
import EquimentDashboard from '../Equiment.jsx/EquimentDashboard';
import InventoryTable from '../Inventory/InventoryTable';
import DashboardStatsGrid from './DashboardStatsGrid';

function Dashboard() {
  return (
    <div className="grid gap-4 bg-gray-100 p-1 h-screen">
      {/* Dashboard Stats Grid */}
      <div className=" p-2 rounded-lg shadow-md">
        <DashboardStatsGrid />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md h-full">
          <ProductionDashboard />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          <QualityDashboard />
        </div>
      </div>

      {/* Lower Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          <EquimentDashboard />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          {/* Chỉ hiển thị 6 mục đầu tiên trong danh sách tồn kho */}
          <InventoryTable limit={6} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
