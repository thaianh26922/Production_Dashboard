import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Form, Input, Select, Modal } from 'antd';
import AddButton from '../../../Components/Button/AddButton';
import ExportExcelButton from '../../../Components/Button/ExportExcelButton';
import SearchButton from '../../../Components/Button/SearchButton';
import FormSample from '../../../Components/Button/FormSample';
import ImportButton from '../../../Components/Button/ImportButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import moment from 'moment';

// Import sample template and data for devices
import sampleTemplate from '../../../assets/form/Thiết bị.xlsx';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [areas, setAreas] = useState([]); // To store area names from Area model
  const [form] = Form.useForm();

  // Fetch devices and areas from API
  const fetchDevicesAndAreas = async () => {
    try {
      // Fetch devices
      const deviceResponse = await axios.get('http://localhost:5000/api/device');
      setDevices(deviceResponse.data);
      setFilteredDevices(deviceResponse.data);

      // Fetch areas for dropdown
      const areaResponse = await axios.get('http://localhost:5000/api/areas');
      setAreas(areaResponse.data); // Store areas from API
    } catch (error) {
      toast.error('Failed to fetch devices or areas');
    }
  };

  useEffect(() => {
    fetchDevicesAndAreas(); // Fetch data on mount
  }, []);

  // Handle search input change
  const handleSearch = (query) => {
    const filtered = devices.filter((device) =>
      device.deviceCode.toLowerCase().includes(query.toLowerCase()) ||
      device.deviceName.toLowerCase().includes(query.toLowerCase()) ||
      device.area.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDevices(filtered);
  };

  // Save new or updated device
  const handleSave = async (values) => {
    const deviceData = {
      ...values,
      purchaseDate: values.purchaseDate, // No need to format since it's already in YYYY-MM-DD
      _id: selectedDevice ? selectedDevice._id : null,
    };
  
    try {
      if (selectedDevice) {
        // Update device
        await axios.put(`http://localhost:5000/api/device/${selectedDevice._id}`, deviceData);
        toast.success('Cập nhật thiết bị thành công!');
      } else {
        // Create new device
        await axios.post('http://localhost:5000/api/device', deviceData);
        toast.success('Thêm thiết bị thành công!');
      }
  
      fetchDevicesAndAreas(); // Refresh device list after save
      setIsModalOpen(false);
      setSelectedDevice(null);
      form.resetFields(); // Reset form fields after saving
    } catch (error) {
      toast.error('Failed to save device');
    }
  };
  

  // Delete device by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/device/${id}`);
      toast.success('Xóa thiết bị thành công!');
      fetchDevicesAndAreas(); // Refresh device list after delete
    } catch (error) {
      toast.error('Failed to delete device');
    }
  };

  // Open modal to add or edit device
  const openModal = (device = null) => {
    if (device) {
      setSelectedDevice(device);
      form.setFieldsValue({
        ...device,
        purchaseDate: device.purchaseDate, // No need to use moment, since it's already in 'YYYY-MM-DD' format
      });
    } else {
      setSelectedDevice(null);
      form.resetFields(); // Clear form for new device
    }
    setIsModalOpen(true);
  };
  

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center gap-2 mb-4">
        <SearchButton
          placeholder="Tìm kiếm mã thiết bị, tên thiết bị, khu vực..."
          onSearch={(q) => handleSearch(q)}
        />
        <div className="flex items-center gap-2 ml-auto">
          <AddButton onClick={() => openModal()} /> {/* Open modal for new device */}
          <FormSample href={sampleTemplate} label="Tải Form Mẫu" />
          <ImportButton />
          <ExportExcelButton data={devices} fileName="DanhSachThietBi.xlsx" />
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Mã Thiết Bị</th>
            <th className="border px-4 py-2 text-xs">Tên Thiết Bị</th>
            <th className="border px-4 py-2 text-xs">Khu Vực</th>
            <th className="border px-4 py-2 text-xs">Model</th>
            <th className="border px-4 py-2 text-xs">Thông Số Kỹ Thuật</th>
            <th className="border px-4 py-2 text-xs">Ngày Mua</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device, index) => (
            <tr key={device._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-sm text-center">{device.deviceCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{device.deviceName}</td>
              <td className="border px-4 py-2 text-sm text-center">{device.areaName}</td>
              <td className="border px-4 py-2 text-sm text-center">{device.model}</td>
              <td className="border px-4 py-2 text-sm text-center">{device.technicalSpecifications}</td>
              <td className="border px-4 py-2 text-sm text-center">
                {moment(device.purchaseDate).format('DD-MM-YYYY')} {/* Format date */}
              </td>
              <td className="py-2 px-2 text-center border">
                <button
                  className="mr-2 text-blue-500 hover:text-blue-700"
                  onClick={() => openModal(device)} // Open modal for editing
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(device._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit Device */}
      <Modal
        title={selectedDevice ? 'Chỉnh sửa Thiết Bị' : 'Thêm mới Thiết Bị'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)} // Close the modal on cancel
        onOk={() => form.submit()} // Submit form when clicking OK
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Mã Thiết Bị"
            name="deviceCode"
            rules={[{ required: true, message: 'Mã Thiết Bị là bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên Thiết Bị"
            name="deviceName"
            rules={[{ required: true, message: 'Tên Thiết Bị là bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          {/* Area Dropdown */}
          <Form.Item
            label="Khu Vực"
            name="area"
            rules={[{ required: true, message: 'Khu Vực là bắt buộc' }]}
          >
            <Select>
              {areas.map((area) => (
                <Select.Option key={area._id} value={area.areaName}>
                  {area.areaName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: 'Model là bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thông Số Kỹ Thuật"
            name="technicalSpecifications"
            rules={[{ required: true, message: 'Thông Số Kỹ Thuật là bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày Mua"
            name="purchaseDate"
            rules={[{ required: true, message: 'Ngày Mua là bắt buộc' }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default DeviceManagement;

