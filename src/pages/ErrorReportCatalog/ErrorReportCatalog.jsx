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
import { devicesData } from '../../data/Machine/machineData'; // Nhập dữ liệu từ file data
import FormSample from '../../Components/Button/FormSample';
import ImportButton from '../../Components/Button/ImportButton';

const ErrorReportCatalog = () => {
  const [errorReports, setErrorReports] = useState(() => {
    const savedReports = localStorage.getItem('errorReports');
    return savedReports ? JSON.parse(savedReports) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportStartDate, setExportStartDate] = useState(new Date());
  const [exportEndDate, setExportEndDate] = useState(new Date());
  const [deviceSuggestions, setDeviceSuggestions] = useState(devicesData); // Danh sách mã thiết bị gợi ý

  // Cập nhật LocalStorage mỗi khi `errorReports` thay đổi
  useEffect(() => {
    localStorage.setItem('errorReports', JSON.stringify(errorReports));
  }, [errorReports]);

  // Hàm lưu báo cáo lỗi
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

  // Hàm xóa báo cáo lỗi
  const handleDelete = (id) => {
    const updatedReports = errorReports.filter((report) => report.id !== id);
    setErrorReports(updatedReports);
    toast.success('Xóa báo cáo lỗi thành công!');
  };

  // Hàm tìm kiếm mã thiết bị
  const handleDeviceSearch = (query) => {
    setSearchQuery(query);

    // Lọc danh sách mã thiết bị dựa trên từ khóa nhập vào
    const suggestions = devicesData.filter((device) =>
      device.machineCode.toLowerCase().includes(query.toLowerCase()) ||
      device.machineName.toLowerCase().includes(query.toLowerCase())
    );

    setDeviceSuggestions(suggestions); // Cập nhật danh sách thiết bị gợi ý
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
        <SearchButton placeholder="Tìm kiếm mã lỗi, mã thiết bị..." onSearch={(q) => setSearchQuery(q)} />
        

        

        <div className="flex items-center gap-2 ml-auto">
        <div className="flex-grow"> <AddButton onClick={() => setIsModalOpen(true)} /></div>
        <div className="flex-grow"> <FormSample onClick={() => setIsModalOpen(false)} /></div>
        <div className="flex-grow"> <ImportButton onClick={() => setIsModalOpen(false)} /></div>
          
          <ExportExcelButton data={filteredExportReports} fileName="Báo cáo lỗi.xlsx" />
        </div>
      </div>

      {/* Bảng hiển thị danh sách báo cáo lỗi */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Mã nguyên nhân</th>
            <th className="border px-4 py-2 text-xs">Tên nguyên nhân</th>
            <th className="border px-4 py-2 text-xs">Mã Thiết Bị</th>
            <th className="border px-4 py-2 text-xs">Loại nguyên nhân</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report, index) => (
            <tr key={report.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.errorCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.errorName}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.deviceCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{report.errorType}</td>
            
              
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
          {
            name: 'deviceCode',
            label: 'Mã Thiết Bị',
            type: 'text',
            validation: yup.string().required('Mã Thiết Bị là bắt buộc'),
            renderInput: (props) => (
              <>
                <input
                  {...props}
                  className="p-2 border rounded w-full"
                  placeholder="Chọn mã thiết bị..."
                  onChange={(e) => handleDeviceSearch(e.target.value)} // Gọi hàm tìm kiếm
                  list="deviceCodeList"
                />
                <datalist id="deviceCodeList">
                  {deviceSuggestions.map((device) => (
                    <option key={device.machineCode} value={device.machineCode}>
                      {device.machineName}
                    </option>
                  ))}
                </datalist>
              </>
            ),
          },
          { name: 'errorType', label: 'Loại Lỗi', type: 'text', validation: yup.string().required('Loại Lỗi là bắt buộc') },
          { name: 'errorName', label: 'Tên Lỗi', type: 'text', validation: yup.string().required('Tên Lỗi là bắt buộc') },
          { name: 'startTime', label: 'Thời Gian Bắt Đầu', type: 'time', validation: yup.string().required('Thời Gian Bắt Đầu là bắt buộc') },
          { name: 'endTime', label: 'Thời Gian Kết Thúc', type: 'time', validation: yup.string().required('Thời Gian Kết Thúc là bắt buộc') },
          { name: 'createdDate', label: 'Ngày Lỗi', type: 'date', validation: yup.date().required('Ngày Tạo là bắt buộc') },
        ]}
        contentLabel={selectedReport ? 'Chỉnh sửa Báo cáo Lỗi' : 'Thêm mới Báo cáo Lỗi'}
        initialData={selectedReport}
      />

      <ToastContainer />
    </div>
  );
};

export default ErrorReportCatalog;
