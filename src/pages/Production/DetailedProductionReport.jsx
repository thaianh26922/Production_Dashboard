import React from 'react';

function DetailedProductionReport() {
  const productionDetails = [
    { day: 'Monday', units: 1200, defects: 30 },
    { day: 'Tuesday', units: 1300, defects: 25 },
    { day: 'Wednesday', units: 1250, defects: 20 },
    { day: 'Thursday', units: 1400, defects: 15 },
    { day: 'Friday', units: 1350, defects: 10 },
    { day: 'Saturday', units: 1500, defects: 5 },
    { day: 'Sunday', units: 1600, defects: 8 },
  ];

  return (
    <div className="mb-6 flex-grow">
      <h3 className="text-lg font-semibold mb-2">Detailed Production Report</h3>
      <div className="overflow-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Day</th>
              <th className="py-2 px-4 border-b">Units Produced</th>
              <th className="py-2 px-4 border-b">Defects</th>
            </tr>
          </thead>
          <tbody>
            {productionDetails.map((detail, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{detail.day}</td>
                <td className="py-2 px-4 border-b">{detail.units}</td>
                <td className="py-2 px-4 border-b">{detail.defects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailedProductionReport;
