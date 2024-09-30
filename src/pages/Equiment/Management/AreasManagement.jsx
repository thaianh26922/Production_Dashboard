import React, { useState } from 'react';
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

// Import sample template and data for areas
import sampleTemplate from '../../../assets/form/Khu vực sản xuất.xlsx';  

// Assuming areasData is already defined or imported from a file
const areasData = [
  { id: 1, areaCode: 'KV001', areaName: 'Khu Vực 1' },
  { id: 2, areaCode: 'KV002', areaName: 'Khu Vực 2' },
];

const AreasManagement = () => {
  const [areas, setAreas] = useState(areasData); // Directly set areas without loading
  const [filteredAreas, setFilteredAreas] = useState(areasData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);

    // Filter the areas based on search query (search in areaCode, areaName)
    const filtered = areas.filter((area) =>
      area.areaCode.toLowerCase().includes(query.toLowerCase()) ||
      area.areaName.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredAreas(filtered);
  };

  const handleSave = (values) => {
    const areaData = {
      ...values,
      id: selectedArea ? selectedArea.id : areas.length + 1,
    };

    if (selectedArea) {
      const updatedAreas = areas.map((area) =>
        area.id === selectedArea.id ? { ...area, ...areaData } : area
      );
      setAreas(updatedAreas);
      setFilteredAreas(updatedAreas); // Update filtered areas after save
      toast.success('Cập nhật khu vực thành công!');
    } else {
      const newAreas = [...areas, areaData];
      setAreas(newAreas);
      setFilteredAreas(newAreas); // Update filtered areas after adding a new one
      toast.success('Thêm khu vực thành công!');
    }

    setIsModalOpen(false);
    setSelectedArea(null);
    form.resetFields();
  };

  const handleDelete = (id) => {
    const updatedAreas = areas.filter((area) => area.id !== id);
    setAreas(updatedAreas);
    setFilteredAreas(updatedAreas); // Update filtered areas after delete
    toast.success('Xóa khu vực thành công!');
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
          <AddButton onClick={() => setIsModalOpen(true)} />
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
        onOk={handleSave}
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
      />

      <ToastContainer />
    </div>
  );
};

export default AreasManagement;
