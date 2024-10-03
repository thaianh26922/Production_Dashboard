import React, { useState } from 'react';
import { Select, Button, message } from 'antd';
import { UserOutlined, PlusOutlined, CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

const ProductionTaskManagement = ({ selectedMachines, setSelectedMachines }) => {
  const availableEmployees = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Thị D",
    "Hoàng Văn E",
  ];

  const shiftOptions = [
    { label: "Ca chính", value: "ca_chinh" },
    { label: "Ca phụ 1 giờ", value: "ca_phu_1h" },
    { label: "Ca phụ 2 giờ", value: "ca_phu_2h" },
    { label: "Ca phụ 3 giờ", value: "ca_phu_3h" },
  ];

  const [tasks, setTasks] = useState([]);
  const [isMachineListOpen, setIsMachineListOpen] = useState(false);
  const [selectedDiv, setSelectedDiv] = useState(null); // Track selected div
  const [savedPlans, setSavedPlans] = useState([]); // State to store saved plans

  // Hàm để thêm nhiệm vụ mới
  const addTask = () => {
    setTasks([...tasks, { selectedShift: '', selectedEmployees: [], selectedEmployee: '', color: '', date: '' }]);
  };

  // Hàm để xóa nhiệm vụ
  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Cập nhật ca làm việc
  const updateShift = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].selectedShift = value;
    setTasks(updatedTasks);
  };

  // Cập nhật nhân viên
  const updateEmployee = (index, employee) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].selectedEmployee = employee;
    setTasks(updatedTasks);
  };

  // Thêm nhân viên vào danh sách
  const addEmployee = (index) => {
    const updatedTasks = [...tasks];
    if (updatedTasks[index].selectedEmployee && !updatedTasks[index].selectedEmployees.includes(updatedTasks[index].selectedEmployee)) {
      updatedTasks[index].selectedEmployees.push(updatedTasks[index].selectedEmployee);
      updatedTasks[index].selectedEmployee = ''; // Reset selectedEmployee
    }
    setTasks(updatedTasks);
  };

  // Xóa nhân viên
  const removeEmployee = (taskIndex, employee) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].selectedEmployees = updatedTasks[taskIndex].selectedEmployees.filter((e) => e !== employee);
    setTasks(updatedTasks);
  };

  // Toggle danh sách máy
  const toggleMachineList = () => {
    setIsMachineListOpen(!isMachineListOpen);
  };

  // Xóa thiết bị
  const removeMachine = (machineId) => {
    setSelectedMachines(selectedMachines.filter((m) => m.id !== machineId));
  };

  // Xử lý khi click vào các div màu
  const handleDivClick = (index, color) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].color = color; // Cập nhật màu cho nhiệm vụ
    setTasks(updatedTasks);
    setSelectedDiv(index); // Gán selectedDiv để xác định div nào đang được chọn
  };

  // Hàm lưu kế hoạch
  const savePlan = () => {
    // Iterate through tasks and save the necessary information
    const updatedPlans = tasks.map((task) => ({
      date: task.date,
      shift: task.selectedShift,
      color: task.color,
      employees: task.selectedEmployees,
    }));

    setSavedPlans(updatedPlans);
    message.success('Kế hoạch đã được lưu thành công!');

    console.log('Saved Plans:', updatedPlans); // Optional: For debugging
  };

  return (
    <div className="w-full p-4">
      <h2 className="font-semibold mb-4">Quản lý nhiệm vụ sản xuất</h2>

      {/* Danh sách máy */}
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md mb-4">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Danh sách máy</span>
          <Button onClick={toggleMachineList} icon={isMachineListOpen ? <UpOutlined /> : <DownOutlined />}>
            {selectedMachines.length} Thiết bị
          </Button>
        </div>
      </div>

      {/* Hiển thị danh sách máy đã chọn */}
      {isMachineListOpen && (
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto mb-4">
          <h2 className="font-semibold mb-2">Thiết bị đã chọn</h2>
          <ul className="list-disc pl-5">
            {selectedMachines.length > 0 ? (
              selectedMachines.map((machine) => (
                <li key={machine.id} className="mb-1 flex justify-between items-center">
                  <span>{machine.name}</span>
                  <CloseOutlined className="text-red-500 cursor-pointer" onClick={() => removeMachine(machine.id)} />
                </li>
              ))
            ) : (
              <p>Chưa có thiết bị nào được chọn.</p>
            )}
          </ul>
        </div>
      )}

      {/* Nhiệm vụ sản xuất */}
      {tasks.map((task, index) => (
        <div key={index} className="bg-gray-100 rounded-md p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Ca làm việc</span>
            <CloseOutlined
              className="text-gray-600 cursor-pointer"
              onClick={() => removeTask(index)} // Xóa nhiệm vụ
            />
          </div>
          <div className="mb-2 flex">
            <Select
              placeholder="Chọn ca làm việc"
              style={{
                width: '100%',
                marginRight: '8px',
                backgroundColor: task.color === 'red' ? '#ffcccc' :
                                task.color === 'yellow' ? '#ffffcc' :
                                task.color === 'green' ? '#ccffcc' : '',
              }}
              value={task.selectedShift}
              onChange={(value) => updateShift(index, value)} // Cập nhật ca làm việc
            >
              {shiftOptions.map((shift, idx) => (
                <Select.Option key={idx} value={shift.value}>
                  {shift.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="mb-2 flex">
            <Select
              placeholder="Chọn nhân viên"
              value={task.selectedEmployee}
              onChange={(value) => updateEmployee(index, value)} // Cập nhật nhân viên
              style={{ width: '100%', marginRight: '8px' }}
            >
              {availableEmployees.map((employee, idx) => (
                <Select.Option key={idx} value={employee}>
                  {employee}
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addEmployee(index)} />
          </div>
          <div className="max-h-32 overflow-y-auto mb-2">
            {task.selectedEmployees.map((employee, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white p-2 rounded mb-1"
              >
                <div className="flex items-center">
                  <UserOutlined className="mr-2" />
                  <span>{employee}</span>
                </div>
                <CloseOutlined
                  className="text-gray-600 cursor-pointer"
                  onClick={() => removeEmployee(index, employee)}
                />
              </div>
            ))}
          </div>
          <div className="h-12 bg-white border border-black rounded-lg overflow-hidden flex m-2">
            <div
              className={`w-1/3 border-l-4 border-l-red-600 cursor-pointer ${task.color === 'red' ? 'bg-red-600' : ''}`}
              onClick={() => handleDivClick(index, 'red')}
            />
            <div
              className={`w-1/3 border-l-4 border-l-yellow-600 cursor-pointer ${task.color === 'yellow' ? 'bg-yellow-500' : ''}`}
              onClick={() => handleDivClick(index, 'yellow')}
            />
            <div
              className={`w-1/3 cursor-pointer border-l-4 border-l-green-600 ${task.color === 'green' ? 'bg-green-500' : ''}`}
              onClick={() => handleDivClick(index, 'green')}
            />
          </div>
        </div>
      ))}

      {/* Nút để thêm nhiệm vụ sản xuất mới */}
      <Button className="w-full bg-gray-100 text-gray-600 flex items-center justify-center" onClick={addTask}>
        <PlusOutlined className="mr-2" />
        Thêm nhiệm vụ sản xuất
      </Button>

      {/* Nút lưu kế hoạch */}
      <Button className="w-full bg-blue-500 text-white mt-4" onClick={savePlan}>
        Lưu kế hoạch
      </Button>

      {/* Hiển thị các kế hoạch đã lưu */}
      {savedPlans.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Kế hoạch đã lưu</h2>
          {savedPlans.map((plan, idx) => (
            <div key={idx}>
              <p>Ngày: {plan.date}</p>
              <p>Ca: {plan.shift}</p>
              <p>Màu: {plan.color}</p>
              <p>Nhân viên: {plan.employees.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductionTaskManagement;
