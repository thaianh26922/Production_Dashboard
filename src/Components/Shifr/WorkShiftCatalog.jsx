import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DynamicFormModal from '../../Components/Modal/DynamicFormModal';
import SearchButton from '../../Components/Button/SearchButton';
import AddButton from '../../Components/Button/AddButton';
import ExportExcelButton from '../../Components/Button/ExportExcelButton';
import * as yup from 'yup';
import { format } from 'date-fns';

const WorkShiftCatalog = () => {
  const [workShifts, setWorkShifts] = useState(() => {
    const savedShifts = localStorage.getItem('workShifts');
    return savedShifts ? JSON.parse(savedShifts) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShift, setSelectedShift] = useState(null);
  const [exportStartDate, setExportStartDate] = useState(new Date());
  const [exportEndDate, setExportEndDate] = useState(new Date());

  // Cập nhật LocalStorage mỗi khi `workShifts` thay đổi
  useEffect(() => {
    localStorage.setItem('workShifts', JSON.stringify(workShifts));
  }, [workShifts]);

  // Hàm lưu ca làm việc
  const handleSave = (data) => {
    if (selectedShift) {
      const updatedShifts = workShifts.map((shift) =>
        shift.id === selectedShift.id ? { ...selectedShift, ...data } : shift
      );
      setWorkShifts(updatedShifts);
      toast.success('Cập nhật ca làm việc thành công!');
    } else {
      const newShift = { ...data, id: workShifts.length + 1 };
      setWorkShifts([...workShifts, newShift]);
      toast.success('Thêm ca làm việc thành công!');
    }
    setIsModalOpen(false);
    setSelectedShift(null);
  };

  // Hàm xóa ca làm việc
  const handleDelete = (id) => {
    const updatedShifts = workShifts.filter((shift) => shift.id !== id);
    setWorkShifts(updatedShifts);
    toast.success('Xóa ca làm việc thành công!');
  };

  // Hàm tìm kiếm ca làm việc
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredShifts = workShifts.filter(
    (shift) =>
      shift.shiftCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.shiftName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExportShifts = workShifts.filter(
    (shift) =>
      shift.createdDate >= exportStartDate &&
      shift.createdDate <= exportEndDate
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      {/* Các nút tìm kiếm, thêm mới và xuất Excel */}
      <div className="flex items-center gap-2 mb-4">
        <SearchButton placeholder="Tìm kiếm mã ca, tên ca..." onSearch={(q) => setSearchQuery(q)} />
        <AddButton onClick={() => setIsModalOpen(true)} />

        <div className="flex-grow"></div>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            value={format(exportStartDate, 'yyyy-MM-dd')}
            onChange={(e) => setExportStartDate(new Date(e.target.value))}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={format(exportEndDate, 'yyyy-MM-dd')}
            onChange={(e) => setExportEndDate(new Date(e.target.value))}
            className="p-2 border rounded"
          />
          <ExportExcelButton data={filteredExportShifts} fileName="DanhSachCaLamViec.xlsx" />
        </div>
      </div>

      {/* Bảng hiển thị danh sách ca làm việc */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Mã Ca Làm Việc</th>
            <th className="border px-4 py-2 text-xs">Tên Ca Làm Việc</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Bắt Đầu</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Kết Thúc</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Nghỉ Ngơi</th>
            <th className="border px-4 py-2 text-xs">Ngày Tạo</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredShifts.map((shift, index) => (
            <tr key={shift.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.shiftCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.shiftName}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.startTime}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.endTime}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.breakTime}</td>
              <td className="border px-4 py-2 text-sm text-center">
                {shift.createdDate ? format(new Date(shift.createdDate), 'dd/MM/yyyy') : 'N/A'}
              </td>
              <td className="py-2 px-2 text-center border">
                <button
                  className="mr-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setSelectedShift(shift);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(shift.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal nhập dữ liệu ca làm việc */}
      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedShift(null);
        }}
        onSave={handleSave}
        formFields={[
          { name: 'shiftCode', label: 'Mã Ca Làm Việc', type: 'text', validation: yup.string().required('Mã Ca Làm Việc là bắt buộc') },
          { name: 'shiftName', label: 'Tên Ca Làm Việc', type: 'text', validation: yup.string().required('Tên Ca Làm Việc là bắt buộc') },
          { name: 'startTime', label: 'Thời Gian Bắt Đầu', type: 'time', validation: yup.string().required('Thời Gian Bắt Đầu là bắt buộc') },
          { name: 'endTime', label: 'Thời Gian Kết Thúc', type: 'time', validation: yup.string().required('Thời Gian Kết Thúc là bắt buộc') },
          { name: 'breakTime', label: 'Thời Gian Nghỉ Ngơi', type: 'time', validation: yup.string().required('Thời Gian Nghỉ Ngơi là bắt buộc') },
          { name: 'createdDate', label: 'Ngày Tạo', type: 'date', validation: yup.date().required('Ngày Tạo là bắt buộc') },
        ]}
        contentLabel={selectedShift ? 'Chỉnh sửa Ca Làm Việc' : 'Thêm mới Ca Làm Việc'}
        initialData={selectedShift}
      />

      <ToastContainer />
    </div>
  );
};

export default WorkShiftCatalog;
