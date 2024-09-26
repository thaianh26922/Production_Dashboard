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

const ErrorReportCatalog = () => {
  const [errorReports, setErrorReports] = useState(() => {
    // Lấy dữ liệu từ LocalStorage khi component khởi tạo
    const savedReports = localStorage.getItem('errorReports');
    return savedReports ? JSON.parse(savedReports) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportStartDate, setExportStartDate] = useState(new Date());
  const [exportEndDate, setExportEndDate] = useState(new Date());

  // Cập nhật LocalStorage mỗi khi `errorReports` thay đổi
  useEffect(() => {
    localStorage.setItem('errorReports', JSON.stringify(errorReports));
  }, [errorReports]);

  const handleSave = (data) => {
    if (selectedReport) {
      const updatedReports = errorReports.map((report) =>
        report.id === selectedReport.id ? { ...selectedReport, ...data } : report
      );
      setErrorReports(updatedReports);
      toast.success('Cập nhật báo cáo lỗi thành công!');
    } else {
      const newReport = { ...data, id: errorReports.length + 1 };
      setErrorReports([...errorReports, newReport]);
      toast.success('Thêm báo cáo lỗi thành công!');
    }
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleDelete = (id) => {
    const updatedReports = errorReports.filter((report) => report.id !== id);
    setErrorReports(updatedReports);
    toast.success('Xóa báo cáo lỗi thành công!');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredReports = errorReports.filter(
    (report) =>
      report.errorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.deviceCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExportReports = errorReports.filter(
    (report) =>
      report.createdDate >= exportStartDate &&
      report.createdDate <= exportEndDate
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      {/* Các nút tìm kiếm, thêm mới và xuất Excel */}
      <div className="flex items-center gap-2 mb-4">
        <SearchButton placeholder="Tìm kiếm mã lỗi, mã thiết bị..." onSearch={handleSearch} />
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
          <ExportExcelButton data={filteredExportReports} fileName="Báo cáo lỗi.xlsx" />
        </div>
      </div>

      {/* Bảng hiển thị danh sách báo cáo lỗi */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Mã Lỗi</th>
            <th className="border px-4 py-2 text-xs">Mã Thiết Bị</th>
            <th className="border px-4 py-2 text-xs">Loại Lỗi</th>
            <th className="border px-4 py-2 text-xs">Tên Lỗi</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Bắt Đầu</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Kết Thúc</th>
            <th className="border px-4 py-2 text-xs">Ngày Tạo</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report, index) => (
            <tr key={report.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.errorCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.deviceCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.errorType}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.errorName}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.startTime}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.endTime}</td>
              <td className="border px-4 py-2 text-sm text-center">
                {format(new Date(report.createdDate), 'dd/MM/yyyy')}
              </td>
              <td className="py-2 px-2 text-center border">
                <button
                  className="mr-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setSelectedReport(report);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(report.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal nhập dữ liệu báo cáo lỗi */}
      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReport(null);
        }}
        onSave={handleSave}
        formFields={[
          { name: 'errorCode', label: 'Mã Lỗi', type: 'text', validation: yup.string().required('Mã Lỗi là bắt buộc') },
          { name: 'deviceCode', label: 'Mã Thiết Bị', type: 'text', validation: yup.string().required('Mã Thiết Bị là bắt buộc') },
          { name: 'errorType', label: 'Loại Lỗi', type: 'text', validation: yup.string().required('Loại Lỗi là bắt buộc') },
          { name: 'errorName', label: 'Tên Lỗi', type: 'text', validation: yup.string().required('Tên Lỗi là bắt buộc') },
          { name: 'startTime', label: 'Thời Gian Bắt Đầu', type: 'time', validation: yup.string().required('Thời Gian Bắt Đầu là bắt buộc') },
          { name: 'endTime', label: 'Thời Gian Kết Thúc', type: 'time', validation: yup.string().required('Thời Gian Kết Thúc là bắt buộc') },
          { name: 'productionDate', label: 'Ngày Sản Xuất', type: 'date', validation: yup.date().required('Ngày Sản Xuất là bắt buộc') },
          { name: 'createdDate', label: 'Ngày Tạo', type: 'date', validation: yup.date().required('Ngày Tạo là bắt buộc') },
        ]}
        contentLabel={selectedReport ? 'Chỉnh sửa Báo cáo Lỗi' : 'Thêm mới Báo cáo Lỗi'}
        initialData={selectedReport}
      />

      <ToastContainer />
    </div>
  );
};

export default ErrorReportCatalog;
