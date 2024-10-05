import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Form } from 'antd';
import AddButton from '../../../Components/Button/AddButton';
import ExportExcelButton from '../../../Components/Button/ExportExcelButton';
import DynamicModal from '../../../Components/Shifr/DynamicModal';
import SearchButton from '../../../Components/Button/SearchButton';
import FormSample from '../../../Components/Button/FormSample';
import ImportButton from '../../../Components/Button/ImportButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Import sample template and data for areas
import sampleTemplate from '../../../assets/form/Khu vực sản xuất.xlsx';

const AreasManagement = () => {
  const [areas, setAreas] = useState([]); // Initialize empty areas array
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Fetch areas from the back-end API
  const fetchAreas = async () => {
    try {
      const response = await axios.get('https://back-end-production.onrender.com/api/device/areas'); // Your API URL
      setAreas(response.data);
      setFilteredAreas(response.data);
    } catch (error) {
      toast.error('Failed to fetch areas');
    }
  };

  useEffect(() => {
    fetchAreas(); // Fetch areas on component mount
  }, []);

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = areas.filter((area) =>
      area.areaCode.toLowerCase().includes(query.toLowerCase()) ||
      area.areaName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAreas(filtered);
  };

  // Save new or updated area
  const handleSave = async (values) => {
    const areaData = {
      ...values,
      id: selectedArea ? selectedArea.id : areas.length + 1,
    };

    try {
      if (selectedArea) {
        await axios.put(`https://back-end-production.onrender.com/api/device/areas/${selectedArea.id}`, areaData);
        toast.success('Cập nhật khu vực thành công!');
      } else {
        await axios.post('https://back-end-production.onrender.com/api/device/areas', areaData);
        toast.success('Thêm khu vực thành công!');
      }

      fetchAreas(); // Refresh area list after save
      setIsModalOpen(false);
      setSelectedArea(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to save area');
    }
  };

  // Delete area by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://back-end-production.onrender.com/api/device/areas/${id}`);
      toast.success('Xóa khu vực thành công!');
      fetchAreas(); // Refresh area list after delete
    } catch (error) {
      toast.error('Failed to delete area');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center gap-2 mb-4">
        {/* Search button for search functionality */}
        <SearchButton
          placeholder="Tìm kiếm mã khu vực, tên khu vực..."
          onSearch={(q) => handleSearch(q)}
        />
        <div className="flex items-center gap-2 ml-auto">
          <AddButton onClick={() => {
            form.resetFields(); // Reset form fields when opening modal for new area
            setSelectedArea(null); // Clear selectedArea to indicate a new area
            setIsModalOpen(true);
          }} />
          <FormSample href={sampleTemplate} label="Tải Form Mẫu" />
          <ImportButton />
          <ExportExcelButton data={areas} fileName="DanhSachKhuVuc.xlsx" />
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Mã Khu Vực</th>
            <th className="border px-4 py-2 text-xs">Tên Khu Vực</th>
            <th className="border px-4 py-2 text-xs">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredAreas.map((area, index) => (
            <tr key={area.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-sm text-center">{area.areaCode}</td>
              <td className="border px-4 py-2 text-sm text-center">{area.areaName}</td>
              <td className="py-2 px-2 text-center border">
                <button
                  className="mr-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setSelectedArea(area);
                    form.setFieldsValue(area);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(area.id)}
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
        onOk={form.submit} // This will trigger the form submission
        form={form}
        title={selectedArea ? 'Chỉnh sửa Khu Vực' : 'Thêm mới Khu Vực'}
        fields={[
          {
            name: 'areaCode',
            label: 'Mã Khu Vực',
            type: 'input',
            rules: [{ required: true, message: 'Mã Khu Vực là bắt buộc' }]
          },
          {
            name: 'areaName',
            label: 'Tên Khu Vực',
            type: 'input',
            rules: [{ required: true, message: 'Tên Khu Vực là bắt buộc' }]
          }
        ]}
        onFinish={handleSave} // Attach the handleSave function to onFinish
      />

      <ToastContainer />
    </div>
  );
};

export default AreasManagement;
