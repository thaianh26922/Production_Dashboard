import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, TimePicker, Input, Form, Space } from 'antd';
import { format } from 'date-fns';
import AddButton from '../Button/AddButton';
import SearchButton from '../Button/SearchButton';
import ExportExcelButton from '../Button/ExportExcelButton';
import * as yup from 'yup';
import FormSample from '../Button/FormSample';
import ImportButton from '../Button/ImportButton';

const { RangePicker } = TimePicker;

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

  const [form] = Form.useForm();

  // Cập nhật LocalStorage mỗi khi `workShifts` thay đổi
  useEffect(() => {
    localStorage.setItem('workShifts', JSON.stringify(workShifts));
  }, [workShifts]);

  // Hàm lưu ca làm việc
  const handleSave = (values) => {
    const data = {
      ...values,
      breakTime: values.breakTime.map((range) => ({
        startTime: range[0].format('HH:mm'),
        endTime: range[1].format('HH:mm')
      }))
    };

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
    form.resetFields();
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
       
        <div className="flex-grow"></div>

        <div className="flex items-center gap-2 ml-auto">
          <AddButton onClick={() => setIsModalOpen(true)} />
          <FormSample onClick={() => setIsModalOpen(false)} />
          <ImportButton onClick={() => setIsModalOpen(false)} />
        

         
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
            <th className="border px-4 py-2 text-xs">Thời Gian Vào Ca</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Tan Ca</th>
            <th className="border px-4 py-2 text-xs">Thời Gian Nghỉ Ngơi</th>
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
              <td className="border px-4 py-2 text-sm text-center">
                {shift.breakTime
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
                  onClick={() => {
                    setSelectedShift(shift);
                    setIsModalOpen(true);
                    form.setFieldsValue({
                      shiftCode: shift.shiftCode,
                      shiftName: shift.shiftName,
                      startTime: shift.startTime,
                      endTime: shift.endTime,
                      breakTime: shift.breakTime.map(bt => [
                        moment(bt.startTime, 'HH:mm'),
                        moment(bt.endTime, 'HH:mm')
                      ])
                    });
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
      <Modal
        title={selectedShift ? 'Chỉnh sửa Ca Làm Việc' : 'Thêm mới Ca Làm Việc'}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedShift(null);
          form.resetFields();
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSave(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="shiftCode"
            label="Mã Ca Làm Việc"
            rules={[{ required: true, message: 'Mã Ca Làm Việc là bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="shiftName"
            label="Tên Ca Làm Việc"
            rules={[{ required: true, message: 'Tên Ca Làm Việc là bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Thời Gian Bắt Đầu"
            rules={[{ required: true, message: 'Thời Gian Bắt Đầu là bắt buộc' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Thời Gian Kết Thúc"
            rules={[{ required: true, message: 'Thời Gian Kết Thúc là bắt buộc' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.List name="breakTime">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'range']}
                      fieldKey={[fieldKey, 'range']}
                      rules={[{ required: true, message: 'Thời gian nghỉ ngơi là bắt buộc' }]}
                    >
                      <RangePicker format="HH:mm" />
                    </Form.Item>
                    <FaMinus onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<FaPlus />}>
                    Thêm Thời Gian Nghỉ Ngơi
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default WorkShiftCatalog;
