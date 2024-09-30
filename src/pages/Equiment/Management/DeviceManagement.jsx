import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Form, Spin } from 'antd';
import AddButton from '../../../Components/Button/AddButton';
import ExportExcelButton from '../../../Components/Button/ExportExcelButton';
import DynamicModal from '../../../Components/Shifr/DynamicModal';
import SearchButton from '../../../Components/Button/SearchButton';
import FormSample from '../../../Components/Button/FormSample';
import ImportButton from '../../../Components/Button/ImportButton';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import sample template and data
import sampleTemplate from '../../../assets/form/Thiết bị.xlsx';  
import { areasData, devicesData } from '../../../data/Machine/machineData'; // Import the datasets

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [form] = Form.useForm();

  // Fetch data with loading effect
  useEffect(() => {
    setLoading(true);
    // Simulate data fetch delay
    setTimeout(() => {
      setDevices(devicesData); // Load devices from data.js
      setFilteredDevices(devicesData); // Initially set filteredDevices to full devices list
      setLoading(false); // Stop loading after data is loaded
    }, 2000); // Simulate a 2-second data fetch
  }, []);

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);

    // Filter the devices based on search query (search in machineCode, machineName, area)
    const filtered = devices.filter((device) =>
      device.machineCode.toLowerCase().includes(query.toLowerCase()) ||
      device.machineName.toLowerCase().includes(query.toLowerCase()) ||
      device.area.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredDevices(filtered);
  };

  const handleSave = (values) => {
    const deviceData = {
      ...values,
      id: selectedDevice ? selectedDevice.id : devices.length + 1,
      purchaseDate: values.purchaseDate ? values.purchaseDate.format('YYYY-MM-DD') : null,
    };

    if (selectedDevice) {
      const updatedDevices = devices.map((device) =>
        device.id === selectedDevice.id ? { ...device, ...deviceData } : device
      );
      setDevices(updatedDevices);
      setFilteredDevices(updatedDevices); // Update filtered devices after save
      toast.success('Cập nhật thiết bị thành công!');
    } else {
      const newDevices = [...devices, deviceData];
      setDevices(newDevices);
      setFilteredDevices(newDevices); // Update filtered devices after adding a new one
      toast.success('Thêm thiết bị thành công!');
    }

    setIsModalOpen(false);
    setSelectedDevice(null);
    form.resetFields();
  };

  const handleDelete = (id) => {
    const updatedDevices = devices.filter((device) => device.id !== id);
    setDevices(updatedDevices);
    setFilteredDevices(updatedDevices); // Update filtered devices after delete
    toast.success('Xóa thiết bị thành công!');
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center gap-2 mb-4">
        {/* Search button for search functionality */}
        <SearchButton
          placeholder="Tìm kiếm mã thiết bị, tên thiết bị, khu vực..."
          onSearch={(q) => handleSearch(q)}
        />
        <div className="flex items-center gap-2 ml-auto">
          <AddButton onClick={() => setIsModalOpen(true)} />
          <FormSample href={sampleTemplate} label="Tải Form Mẫu" />
          <ImportButton />
          <ExportExcelButton data={devices} fileName="DanhSachThietBi.xlsx" />
        </div>
      </div>

      {/* Show loading spinner while fetching data */}
      {loading ? (
        <div className="text-center">
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
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
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.machineCode}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.machineName}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.area}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.model}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.specs}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.entrydate}</td>
                <td className="py-2 px-2 text-center border">
                  <button
                    className="mr-2 text-blue-500 hover:text-blue-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(device.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <DynamicModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSave}
        form={form}
        title={selectedDevice ? 'Chỉnh sửa Thiết Bị' : 'Thêm mới Thiết Bị'}
        fields={[
          {
            name: 'deviceCode',
            label: 'Mã Thiết Bị',
            type: 'input',
            rules: [{ required: true, message: 'Mã Thiết Bị là bắt buộc' }]
          },
          {
            name: 'deviceName',
            label: 'Tên Thiết Bị',
            type: 'input',
            rules: [{ required: true, message: 'Tên Thiết Bị là bắt buộc' }]
          },
          {
            name: 'area',
            label: 'Khu Vực',
            type: 'input',
            rules: [{ required: true, message: 'Khu Vực là bắt buộc' }]
          },
          {
            name: 'model',
            label: 'Model',
            type: 'input',
            rules: [{ required: true, message: 'Model là bắt buộc' }]
          },
          {
            name: 'specs',
            label: 'Thông Số Kỹ Thuật',
            type: 'input',
            rules: [{ required: true, message: 'Thông Số Kỹ Thuật là bắt buộc' }]
          },
          {
            name: 'purchaseDate',
            label: 'Ngày Mua',
            type: 'datePicker',
            rules: [{ required: true, message: 'Ngày Mua là bắt buộc' }]
          }
        ]}
      />

      <ToastContainer />
    </div>
  );
};

export default DeviceManagement;
