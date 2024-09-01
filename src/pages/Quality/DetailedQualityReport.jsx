import React from 'react';

function DetailedQualityReport() {
  const qualityDetails = [
    { day: 'Monday', defects: 10 },
    { day: 'Tuesday', defects: 8 },
    { day: 'Wednesday', defects: 5 },
    { day: 'Thursday', defects: 7 },
    { day: 'Friday', defects: 4 },
    { day: 'Saturday', defects: 2 },
    { day: 'Sunday', defects: 3 },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Detailed Quality Report</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Day</th>
            <th className="py-2 px-4 border-b">Defects</th>
          </tr>
        </thead>
        <tbody>
          {qualityDetails.map((detail, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{detail.day}</td>
              <td className="py-2 px-4 border-b">{detail.defects}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetailedQualityReport;
