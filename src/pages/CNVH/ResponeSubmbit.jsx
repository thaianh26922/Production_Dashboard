import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation và useNavigate
import '../../index.css'; // Tailwind CSS
import { FiChevronLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS react-toastify

const ResponeSubmit = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng quay lại

  // State để quản lý trạng thái button nguyên nhân và nút phản hồi
  const [selectedReason, setSelectedReason] = useState(null); // Trạng thái để lưu nguyên nhân được chọn
  const [isResponseEnabled, setIsResponseEnabled] = useState(false); // Trạng thái để bật nút phản hồi

  // Hàm xử lý khi click vào biểu tượng "back" FiChevronLeft
  const handleBackClick = () => {
    navigate(-1); // Điều hướng quay lại trang trước đó
  };

  // Hàm xử lý khi nhấn vào button nguyên nhân
  const handleReasonClick = (reason) => {
    setSelectedReason(reason); // Đặt trạng thái nguyên nhân được chọn
    setIsResponseEnabled(true); // Bật nút phản hồi
  };

  // Hàm xử lý khi nhấn vào nút phản hồi
  const handleResponse = () => {
    if (selectedReason) {
      toast.success('Phản hồi thành công!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { fontSize: '1.6rem', padding: '1rem', width: '90%' }, // Kích thước phù hợp cho điện thoại
      });
  
      // Điều hướng sau một thời gian ngắn (ví dụ 100ms)
      setTimeout(() => {
        navigate('/dashboard/mobile/issue');
      }, 500);
    }
  };
  
  
  

  // Hàm xử lý quay lại trang trước khi hủy bỏ
  const handleCancel = () => {
    navigate(-1); // Điều hướng quay lại trang trước đó
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
        {/* Hiển thị danh sách nguyên nhân (2 cột) */}
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
      
        disabled={!isResponseEnabled} // Nút chỉ hoạt động khi isResponseEnabled = true
        className={`w-[90%] p-8 rounded-lg shadow-lg text-white text-center ml-6 mt-2 text-4xl font-bold transition duration-300 ease-in-out ${
          isResponseEnabled ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Phản hồi
      </button>

      {/* Nút hủy bỏ */}
      <button
        onClick={handleCancel} // Quay lại trang trước khi hủy bỏ
        className="bg-red-600 w-[90%] hover:bg-red-900 p-8 rounded-lg shadow-lg text-white text-center ml-6 mt-2 text-4xl font-bold transition duration-300 ease-in-out"
      >
        Hủy Bỏ
      </button>

      {/* Toast Container để hiển thị các thông báo */}
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
        style={{ fontSize: '30px', padding: '3rem', width: '100%', textAlign: 'center' }} // Cấu hình cho phù hợp với điện thoại
      />
    </div>
  );
};

export default ResponeSubmit;
