import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation và useNavigate
import '../../index.css'; // Tailwind CSS
import { FiChevronLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS react-toastify

const ResponeSubmit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Nhận dữ liệu từ state
  const { selectedDate, selectedMachine } = location.state || {};

  // State để quản lý trạng thái button nguyên nhân và nút phản hồi
  const [selectedReason, setSelectedReason] = useState(null);
  const [isResponseEnabled, setIsResponseEnabled] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setIsResponseEnabled(true);
  };

  const handleResponse = () => {
    if (selectedReason) {
      toast.success('Phản hồi thành công!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { fontSize: '1.6rem', padding: '1rem', width: '90%' },
      });

      // Quay lại trang trước hoặc bất kỳ hành động nào sau khi phản hồi
      setTimeout(() => {
        navigate('/dashboard/mobile/issue', {
          state: {
            selectedDate: selectedDate, // Truyền lại dữ liệu để giữ lại trạng thái
            selectedMachine: selectedMachine,
          },
        });
      }, 500);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen bg-gray-100 w-full">
      {/* Header */}
      <div className="flex justify-between items-center w-full bg-gradient-to-r from-blue-600 to-sky-500">
        <h1 className="h-32 items-center text-5xl text-white font-bold flex w-full justify-evenly">
          <span className="text-5xl -ml-52 cursor-pointer" onClick={handleBackClick}>
            <FiChevronLeft />
          </span>
          Phản hồi ngừng máy
        </h1>
      </div>

      {/* Nội dung chính */}
      <div className="grid grid-cols-2 gap-4 p-8">
        {['Nguyên Nhân A', 'Nguyên Nhân B', 'Nguyên Nhân C', 'Nguyên Nhân D'].map((reason, index) => (
          <button
            key={index}
            onClick={() => handleReasonClick(reason)}
            className={`p-8 text-4xl font-bold rounded-lg transition duration-300 ease-in-out ${
              selectedReason === reason ? 'bg-blue-600 text-white' : 'bg-gray-200'
            } hover:bg-blue-500`}
          >
            {reason}
          </button>
        ))}
      </div>

      {/* Nút phản hồi */}
      <button
        onClick={handleResponse}
        disabled={!isResponseEnabled}
        className={`w-[90%] p-8 rounded-lg shadow-lg text-white text-center ml-6 mt-2 text-4xl font-bold transition duration-300 ease-in-out ${
          isResponseEnabled ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Phản hồi
      </button>

      {/* Nút hủy bỏ */}
      <button
        onClick={handleCancel}
        className="bg-red-600 w-[90%] hover:bg-red-900 p-8 rounded-lg shadow-lg text-white text-center ml-6 mt-2 text-4xl font-bold transition duration-300 ease-in-out"
      >
        Hủy Bỏ
      </button>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ fontSize: '30px', padding: '3rem', width: '100%', textAlign: 'center' }}
      />
    </div>
  );
};

export default ResponeSubmit;
