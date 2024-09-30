import React, { useState, useRef } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Form } from 'antd';
import AddButton from '../Button/AddButton';
import ExportExcelButton from '../Button/ExportExcelButton';
import DynamicModal from './DynamicModal';
import SearchButton from '../Button/SearchButton';
import FormSample from '../Button/FormSample';
import ImportButton from '../Button/ImportButton';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import file mẫu Excel từ thư mục assets
import sampleTemplate from '../../assets/form/Ca làm việc.xlsx';

const WorkShiftCatalog = () => {
  const [workShifts, setWorkShifts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Tham chiếu đến thẻ input ẩn để nhập file
  const fileInputRef = useRef(null);

  // Hàm xử lý khi nhấn "ImportButton"
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Kích hoạt sự kiện click trên thẻ input ẩn
    }
  };

  // Hàm để lưu ca làm việc từ modal
  const handleSave = (values) => {
    const shiftData = {
      ...values,
      id: selectedShift ? selectedShift.id : workShifts.length + 1,
      startTime: values.startTime ? values.startTime.format('HH:mm') : null,
      endTime: values.endTime ? values.endTime.format('HH:mm') : null,
      breakTime: values.breakTime
        ? values.breakTime.map((range) => ({
            startTime: range[0] ? range[0].format('HH:mm') : null, // Chuyển đổi sang chuỗi
            endTime: range[1] ? range[1].format('HH:mm') : null,   // Chuyển đổi sang chuỗi
          }))
        : []
    };

    if (selectedShift) {
      const updatedShifts = workShifts.map((shift) =>
        shift.id === selectedShift.id ? { ...shift, ...shiftData } : shift
      );
      setWorkShifts(updatedShifts);
      toast.success('Cập nhật ca làm việc thành công!');
    } else {
      setWorkShifts([...workShifts, shiftData]);
      toast.success('Thêm ca làm việc thành công!');
    }

    setIsModalOpen(false);
    setSelectedShift(null);
    form.resetFields();
  };

  // Xử lý việc tải file Excel lên
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Chuyển đổi dữ liệu từ file Excel sang dạng phù hợp với bảng
      const importedShifts = jsonData.map((row, index) => ({
        id: index + 1,
        shiftCode: row['Mã Ca Làm Việc'],
        shiftName: row['Tên Ca Làm Việc'],
        startTime: row['Thời Gian Vào Ca'],
        endTime: row['Thời Gian Tan Ca'],
        breakTime: row['Thời Gian Nghỉ Ngơi']
          ? [{ startTime: row['Thời Gian Nghỉ Ngơi'].split(' - ')[0], endTime: row['Thời Gian Nghỉ Ngơi'].split(' - ')[1] }]
          : [],
      }));

      setWorkShifts(importedShifts);
      toast.success('Nhập dữ liệu từ file Excel thành công!');
    };

    reader.readAsArrayBuffer(file);
  };

  // Khi mở modal để chỉnh sửa ca làm việc, cần chuyển đổi chuỗi thành đối tượng moment
  const openModal = (shift = null) => {
    setSelectedShift(shift);
    if (shift) {
      form.setFieldsValue({
        shiftCode: shift.shiftCode,
        shiftName: shift.shiftName,
        startTime: shift.startTime ? moment(shift.startTime, 'HH:mm') : null,
        endTime: shift.endTime ? moment(shift.endTime, 'HH:mm') : null,
        breakTime: shift.breakTime
          ? shift.breakTime.map(bt => [
              bt.startTime ? moment(bt.startTime, 'HH:mm') : null,
              bt.endTime ? moment(bt.endTime, 'HH:mm') : null
            ])
          : []
      });
    }
    setIsModalOpen(true);
  };

  // Hàm để xóa ca làm việc
  const handleDelete = (id) => {
    const updatedShifts = workShifts.filter((shift) => shift.id !== id);
    setWorkShifts(updatedShifts);
    toast.success('Xóa ca làm việc thành công!');
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center gap-2 mb-4">
        <SearchButton placeholder="Tìm kiếm mã lỗi, mã thiết bị..." onSearch={(q) => setSearchQuery(q)} />
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex-grow"> <AddButton onClick={() => setIsModalOpen(true)} /></div>
          {/* Nút tải mẫu Excel */}
          <div className="flex-grow">
            <FormSample href={sampleTemplate} label="Tải Form Mẫu" />
          </div>
          {/* Nút Import Excel */}
          <div className="flex-grow">
            <ImportButton onClick={handleImportClick} />
            {/* Thẻ input ẩn để người dùng chọn file */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </div>
          <ExportExcelButton data={workShifts} fileName="Báo cáo lỗi.xlsx" />
        </div>
      </div>

      {/* Bảng hiển thị danh sách ca làm việc */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Mã Ca Làm Việc</th>
            <th className="border px-4 py-2 text-xs">Tên Ca Làm Việc</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Vào Ca</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Tan Ca</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Nghỉ Ngơi</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {workShifts.map((shift, index) => (
            <tr key={shift.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.shiftCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.shiftName}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.startTime}</td>
              <td className="border px-4 py-2 text-sm text-center">{shift.endTime}</td>
              <td className="border px-4 py-2 text-sm text-center">
                {shift.breakTime.length > 0
                  ? shift.breakTime.map((bt, i) => (
                      <div key={i}>
                        {bt.startTime} - {bt.endTime}
                      </div>
                    ))
                  : 'N/A'}
              </td>
              <td className="py-2 px-2 text-center border">
                <button
                  className="mr-2 text-blue-500 hover:text-blue-700"
                  onClick={() => openModal(shift)}
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

      <DynamicModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSave} // Đảm bảo rằng hàm handleSave được truyền vào đây
        form={form}
        title={selectedShift ? 'Chỉnh sửa Ca Làm Việc' : 'Thêm mới Ca Làm Việc'}
        fields={[
          {
            name: 'shiftCode',
            label: 'Mã Ca Làm Việc',
            type: 'input',
            rules: [{ required: true, message: 'Mã Ca Làm Việc là bắt buộc' }]
          },
          {
            name: 'shiftName',
            label: 'Tên Ca Làm Việc',
            type: 'input',
            rules: [{ required: true, message: 'Tên Ca Làm Việc là bắt buộc' }]
          },
          {
            name: 'startTime',
            label: 'Thời gian vào ca',
            type: 'timePicker',
            rules: [{ required: true, message: 'Thời Gian Bắt Đầu là bắt buộc' }]
          },
          {
            name: 'endTime',
            label: 'Thời gian tan ca',
            type: 'timePicker',
            rules: [{ required: true, message: 'Thời Gian Kết Thúc là bắt buộc' }]
          },
          {
            name: 'breakTime',
            label: 'Thời gian nghỉ ngơi',
            type: 'rangePicker',
            rules: [{ required: true, message: 'Thời gian nghỉ ngơi là bắt buộc' }]
          }
        ]}
      />

      <ToastContainer />
    </div>
  );
};

export default WorkShiftCatalog;
