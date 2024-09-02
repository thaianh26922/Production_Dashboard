import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho react-toastify
import DynamicFormModal from '../../Components/Modal/DynamicFormModal';
import SearchButton from '../../Components/Button/SearchButton';
import AddButton from '../../Components/Button/AddButton';
import ExportExcelButton from '../../Components/Button/ExportExcelButton';
import * as yup from 'yup';

const ProductionPlanCatalog = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Sản xuất bánh trung thu',
      productType: 'Bánh trung thu',
      startDate: '2024-08-01',
      endDate: '2024-09-30',
      quantity: 10000,
      status: 'Đang tiến hành'
    },
    {
      id: 2,
      name: 'Sản xuất kẹo dẻo',
      productType: 'Kẹo dẻo',
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      quantity: 5000,
      status: 'Hoàn thành'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSave = (data) => {
    if (selectedPlan) {
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === selectedPlan.id ? { ...plan, ...data } : plan
        )
      );
      toast.success('Cập nhật thành công!');
    } else {
      const newPlan = {
        id: plans.length + 1,
        ...data,
      };
      setPlans([...plans, newPlan]);
      toast.success('Đã lưu thành công!');
    }
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleDelete = (id) => {
    setPlans(plans.filter((plan) => plan.id !== id));
    toast.success('Xóa thành công!');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.productType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center gap-2 mb-4">
        <SearchButton placeholder="Tìm kiếm kế hoạch sản xuất..." onSearch={handleSearch} />
        <AddButton onClick={() => setIsModalOpen(true)} />
        <div className="flex-grow"></div>
        <ExportExcelButton data={filteredPlans} fileName="Kế hoạch sản xuất.xlsx" />
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-xs">STT</th>
            <th className="border px-4 py-2 text-xs">Tên kế hoạch</th>
            <th className="border px-4 py-2 text-xs">Loại sản phẩm</th>
            <th className="border px-4 py-2 text-xs">Ngày bắt đầu</th>
            <th className="border px-4 py-2 text-xs">Ngày kết thúc</th>
            <th className="border px-4 py-2 text-xs">Số lượng</th>
            <th className="border px-4 py-2 text-xs">Trạng thái</th>
            <th className="border px-4 py-2 text-xs">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlans.map((plan, index) => (
            <tr key={plan.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-sm">{index + 1}</td>
              <td className="border px-4 py-2 text-sm">{plan.name}</td>
              <td className="border px-4 py-2 text-sm">{plan.productType}</td>
              <td className="border px-4 py-2 text-sm">{plan.startDate}</td>
              <td className="border px-4 py-2 text-sm">{plan.endDate}</td>
              <td className="border px-4 py-2 text-sm">{plan.quantity}</td>
              <td className="border px-4 py-2 text-sm">{plan.status}</td>
              <td className="py-2 px-2 text-center border">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(plan.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DynamicFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        onSave={handleSave}
        formFields={[
          { name: 'name', label: 'Tên kế hoạch', type: 'text', validation: yup.string().required('Tên kế hoạch là bắt buộc') },
          { name: 'productType', label: 'Loại sản phẩm', type: 'text', validation: yup.string().required('Loại sản phẩm là bắt buộc') },
          { name: 'startDate', label: 'Ngày bắt đầu', type: 'date', validation: yup.date().required('Ngày bắt đầu là bắt buộc') },
          { name: 'endDate', label: 'Ngày kết thúc', type: 'date', validation: yup.date().required('Ngày kết thúc là bắt buộc') },
          { name: 'quantity', label: 'Số lượng', type: 'number', validation: yup.number().required('Số lượng là bắt buộc') },
          { name: 'status', label: 'Trạng thái', type: 'text', validation: yup.string().required('Trạng thái là bắt buộc') },
        ]}
        contentLabel={selectedPlan ? 'Chỉnh sửa Kế hoạch sản xuất' : 'Thêm mới Kế hoạch sản xuất'}
        initialData={selectedPlan}
      />
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProductionPlanCatalog;
