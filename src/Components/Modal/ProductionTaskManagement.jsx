import React, { useState } from 'react';
import { X, Plus, ChevronDown, User } from 'lucide-react';

const ProductionTaskManagement = () => {
  // Simulated list of available employees
  const availableEmployees = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Thị D",
    "Hoàng Văn E"
  ];

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const addEmployee = () => {
    if (selectedEmployee && !selectedEmployees.includes(selectedEmployee)) {
      setSelectedEmployees([...selectedEmployees, selectedEmployee]);
      setSelectedEmployee('');
    }
  };

  const removeEmployee = (employee) => {
    setSelectedEmployees(selectedEmployees.filter(e => e !== employee));
  };

  return (
    <div className="w-64 bg-white shadow-md rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Danh sách máy</span>
          <ChevronDown size={20} />
        </div>
        <span className="text-gray-600">'n Thiết bị</span>
      </div>
      
      <div className="p-4">
        <h2 className="font-semibold mb-2">Nhiệm vụ sản xuất</h2>
        <div className="bg-gray-100 rounded-md p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Ca làm việc</span>
            <X size={20} className="text-gray-600 cursor-pointer" />
          </div>
          <div className="mb-2 flex">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-2 rounded border mr-2"
            >
              <option value="">Chọn nhân viên</option>
              {availableEmployees.map((employee, index) => (
                <option key={index} value={employee}>{employee}</option>
              ))}
            </select>
            <button 
              onClick={addEmployee}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto mb-2">
            {selectedEmployees.map((employee, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded mb-1">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{employee}</span>
                </div>
                <X
                  size={16}
                  className="text-gray-600 cursor-pointer"
                  onClick={() => removeEmployee(employee)}
                />
              </div>
            ))}
          </div>
          <div className="h-12 bg-white border border-black  rounded-lg overflow-hidden flex">
            <div className="w-1/3 border-l-red-600 border-l-4  border-r-8 border-r-[#FCFC00] "></div>
            <div className="w-1/3 border-r-green-500 border-r-4"></div>
            <div className="w-1/3 "></div>
          </div>
        </div>
        <button className="w-full py-2 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center">
          <Plus size={20} className="mr-2" />
          Thêm nhiệm vụ sản xuất
        </button>
      </div>
    </div>
  );
};

export default ProductionTaskManagement;