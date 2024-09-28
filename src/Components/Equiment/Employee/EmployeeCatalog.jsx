import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DynamicFormModal from '../../Modal/DynamicFormModal';
import SearchButton from '../../Button/SearchButton';
import AddButton from '../../Button/AddButton';
import ExportExcelButton from '../../Button/ExportExcelButton';
import * as yup from 'yup';

const EmployeeCatalog = () => {
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem('employees');
    return savedEmployees ? JSON.parse(savedEmployees) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Cập nhật LocalStorage mỗi khi `employees` thay đổi
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Hàm lưu nhân viên
  const handleSave = (data) => {
    if (selectedEmployee) {
      const updatedEmployees = employees.map((employee) =>
        employee.id === selectedEmployee.id ? { ...selectedEmployee, ...data } : employee
      );
      setEmployees(updatedEmployees);
      toast.success('Cập nhật nhân viên thành công!');
    } else {
      const newEmployee = { ...data, id: employees.length + 1 };
      setEmployees([...employees, newEmployee]);
      toast.success('Thêm nhân viên thành công!');
    }
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Hàm xóa nhân viên
  const handleDelete = (id) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id);
    setEmployees(updatedEmployees);
    toast.success('Xóa nhân viên thành công!');
  };

  // Hàm tìm kiếm nhân viên
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      {/* Các nút tìm kiếm, thêm mới và xuất Excel */}
      <div className="flex items-center gap-2 mb-4">
        <SearchButton placeholder="Tìm kiếm mã nhân viên, tên nhân viên..." onSearch={(q) => setSearchQuery(q)} />
        <AddButton onClick={() => setIsModalOpen(true)} />

        <div className="flex-grow"></div>

        <ExportExcelButton data={filteredEmployees} fileName="DanhSachNhanVien.xlsx" />
      </div>

      {/* Bảng hiển thị danh sách nhân viên */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Mã Nhân Viên</th>
            <th className="border px-4 py-2 text-xs">Tên Nhân Viên</th>
            <th className="border px-4 py-2 text-xs">Tổ</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-sm text-center">{employee.employeeCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{employee.employeeName}</td>
              <td className="border px-4 py-2 text-sm text-center">{employee.team}</td>
              <td className="py-2 px-2 text-center border">
                <button
                  className="mr-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(employee.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal nhập dữ liệu nhân viên */}
      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSave}
        formFields={[
          { name: 'employeeCode', label: 'Mã Nhân Viên', type: 'text', validation: yup.string().required('Mã Nhân Viên là bắt buộc') },
          { name: 'employeeName', label: 'Tên Nhân Viên', type: 'text', validation: yup.string().required('Tên Nhân Viên là bắt buộc') },
          { name: 'team', label: 'Tổ', type: 'text', validation: yup.string().required('Tổ là bắt buộc') },
        ]}
        contentLabel={selectedEmployee ? 'Chỉnh sửa Nhân Viên' : 'Thêm mới Nhân Viên'}
        initialData={selectedEmployee}
      />

      <ToastContainer />
    </div>
  );
};

export default EmployeeCatalog;
