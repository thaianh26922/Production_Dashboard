import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DynamicFormModal from '../../../Components/Modal/DynamicFormModal';
import AddButton from '../../../Components/Button/AddButton';
import * as yup from 'yup';

const DeviceManagement = () => {
  const [areas, setAreas] = useState(() => {
    const savedAreas = localStorage.getItem('areas');
    return savedAreas ? JSON.parse(savedAreas) : [];
  });
  const [devices, setDevices] = useState(() => {
    const savedDevices = localStorage.getItem('devices');
    return savedDevices ? JSON.parse(savedDevices) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalType, setModalType] = useState('');

  // Lưu dữ liệu vào LocalStorage mỗi khi areas hoặc devices thay đổi
  useEffect(() => {
    localStorage.setItem('areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);

  // Lưu khu vực mới hoặc cập nhật máy
  const handleSave = (data) => {
    if (modalType === 'area') {
      // Kiểm tra khu vực trùng tên
      const isDuplicateArea = areas.some((area) => area.areaName.toLowerCase() === data.areaName.toLowerCase());
      if (isDuplicateArea) {
        toast.error('Khu vực này đã tồn tại!');
      } else {
        // Thêm khu vực mới và sắp xếp theo thứ tự alphabet
        const updatedAreas = [...areas, { ...data }].sort((a, b) => a.areaName.localeCompare(b.areaName));
        setAreas(updatedAreas);
        toast.success('Thêm khu vực thành công!');
      }
    } else {
      if (selectedDevice) {
        const updatedDevices = devices.map((device) =>
          device.id === selectedDevice.id ? { ...selectedDevice, ...data } : device
        );
        setDevices(updatedDevices);
        toast.success('Cập nhật thiết bị thành công!');
      } else {
        const newDevice = { ...data, id: devices.length + 1, area: selectedArea };
        setDevices([...devices, newDevice]);
        toast.success('Thêm thiết bị thành công!');
      }
    }
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  // Xóa máy
  const handleDelete = (id) => {
    const updatedDevices = devices.filter((device) => device.id !== id);
    setDevices(updatedDevices);
    toast.success('Xóa thiết bị thành công!');
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      {/* Quản lý khu vực */}
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Quản lý khu vực</h2>
          <AddButton onClick={() => { setIsModalOpen(true); setModalType('area'); }} />
          <ul className="mt-2">
            {areas.map((area, index) => (
              <li
                key={index}
                className={`py-2 px-4 bg-gray-100 rounded-md mb-2 cursor-pointer ${selectedArea === area.areaName ? 'bg-blue-200' : ''}`}
                onClick={() => setSelectedArea(area.areaName)}
              >
                {area.areaName}
              </li>
            ))}
          </ul>
        </div>

        {/* Quản lý thiết bị */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Quản lý thiết bị</h2>

          {/* Chọn khu vực */}
          <select
            className="mb-4 p-2 border rounded"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="All">Tất cả khu vực</option>
            {areas.map((area, index) => (
              <option key={index} value={area.areaName}>
                {area.areaName}
              </option>
            ))}
          </select>

          <AddButton onClick={() => { setIsModalOpen(true); setModalType('device'); }} disabled={selectedArea === 'All'} />
        </div>
      </div>

      {/* Bảng thiết bị */}
      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Khu vực</th>
            <th className="border px-4 py-2 text-xs">Mã Máy</th>
            <th className="border px-4 py-2 text-xs">Tên Máy</th>
            <th className="border px-4 py-2 text-xs">Model</th>
            <th className="border px-4 py-2 text-xs">Thông số kỹ thuật</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {devices
            .filter((device) => selectedArea === 'All' || device.area === selectedArea)
            .map((device, index) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.area}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.machineCode}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.machineName}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.model}</td>
                <td className="border px-4 py-2 text-sm text-center">{device.specs}</td>
                <td className="py-2 px-2 text-center border">
                  <button
                    className="mr-2 text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setSelectedDevice(device);
                      setIsModalOpen(true);
                      setModalType('device');
                    }}
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

      {/* Modal Thêm Khu vực và Thiết bị */}
      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        onSave={handleSave}
        formFields={
          modalType === 'area'
            ? [
                { name: 'areaName', label: 'Tên Khu Vực', type: 'text', validation: yup.string().required('Tên Khu Vực là bắt buộc') },
              ]
            : [
                { name: 'machineCode', label: 'Mã Máy', type: 'text', validation: yup.string().required('Mã Máy là bắt buộc') },
                { name: 'machineName', label: 'Tên Máy', type: 'text', validation: yup.string().required('Tên Máy là bắt buộc') },
                { name: 'model', label: 'Model', type: 'text', validation: yup.string().required('Model là bắt buộc') },
                { name: 'specs', label: 'Thông số kỹ thuật', type: 'text', validation: yup.string().required('Thông số kỹ thuật là bắt buộc') },
              ]
        }
        contentLabel={modalType === 'area' ? 'Thêm Khu vực' : selectedDevice ? 'Chỉnh sửa Thiết bị' : 'Thêm mới Thiết bị'}
        initialData={selectedDevice}
      />

      <ToastContainer />
    </div>
  );
};

export default DeviceManagement;
