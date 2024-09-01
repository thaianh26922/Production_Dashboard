import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import ProductionChart from './ProductionChart';
import DetailedProductionReport from './DetailedProductionReport';

function ProductionOverview() {
  // Dữ liệu mẫu cho biểu đồ sản lượng sản xuất
    // Dữ liệu mẫu cho kế hoạch sản xuất
  const productionPlan = [
    { day: 'Monday', plan: 1300 },
    { day: 'Tuesday', plan: 1350 },
    { day: 'Wednesday', plan: 1400 },
    { day: 'Thursday', plan: 1450 },
    { day: 'Friday', plan: 1500 },
    { day: 'Saturday', plan: 1550 },
    { day: 'Sunday', plan: 1600 },
  ];

  // Dữ liệu mẫu cho sản lượng theo ca
  const shiftProduction = [
    { shift: 'Morning', units: 600 },
    { shift: 'Afternoon', units: 800 },
    { shift: 'Night', units: 500 },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Production Overview</h2>

      {/* Biểu đồ sản lượng sản xuất */}
     <ProductionChart/>

      {/* Bảng chi tiết sản xuất */}
    <DetailedProductionReport/>

      {/* Kế hoạch sản xuất */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Production Plan</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Day</th>
              <th className="py-2 px-4 border-b">Production Plan</th>
            </tr>
          </thead>
          <tbody>
            {productionPlan.map((plan, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{plan.day}</td>
                <td className="py-2 px-4 border-b">{plan.plan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sản lượng theo ca */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Shift Production</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Shift</th>
              <th className="py-2 px-4 border-b">Units Produced</th>
            </tr>
          </thead>
          <tbody>
            {shiftProduction.map((shift, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{shift.shift}</td>
                <td className="py-2 px-4 border-b">{shift.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductionOverview;
