import React from 'react';
import ProductionChart from './ProductionChart';
import CycleTimeChart from './CycleTimeChart';

function ProductionDashboard() {
  return (
    <div className=" p-4 rounded-lg ">
      {/* Hàng chứa biểu đồ ProductionChart */}
      <div className="mb-4">
        <ProductionChart />
      </div>

      {/* Hàng chứa biểu đồ CycleTimeChart */}
      <div>
        <CycleTimeChart />
      </div>
    </div>
  );
}

export default ProductionDashboard;
