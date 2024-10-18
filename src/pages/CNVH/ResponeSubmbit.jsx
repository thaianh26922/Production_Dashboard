import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import { FiChevronLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ResponeSubmit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Nhận dữ liệu từ state
  const { selectedDate, selectedMachine } = location.state || {};
  
  // Lấy deviceName từ selectedMachine
  const deviceName = selectedMachine?.deviceName || '';

  // State để quản lý trạng thái button nguyên nhân và nút phản hồi
  const [filteredReasons, setFilteredReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isResponseEnabled, setIsResponseEnabled] = useState(false);

  // Fetch reasons from API based on the device name
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        
        const response = await axios.get(`${apiUrl}/issue`);
        const allReasons = response.data;
        console.log(`Fetching reasons from: ${apiUrl}/issue`);
        // Kiểm tra xem dữ liệu có phải là một mảng không
        if (Array.isArray(allReasons)) {
          // Lọc lý do theo deviceName
          const filtered = allReasons.filter(reason =>
            reason.deviceNames.includes(deviceName)
          );

          // Cập nhật state với các lý do đã lọc
          setFilteredReasons(filtered);
        } else {
          console.error('Dữ liệu không phải là một mảng:', allReasons);
          toast.error('Dữ liệu không hợp lệ từ API.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: { fontSize: '1.6rem', padding: '1rem', width: '90%' },
          });
        }
      } catch (error) {
        console.error('Error fetching reasons:', error.response ? error.response.data : error.message);
        toast.error('Có lỗi xảy ra khi lấy dữ liệu.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: { fontSize: '1.6rem', padding: '1rem', width: '90%' },
        });
      }
    };

    if (deviceName) {
      fetchReasons();
    }
  }, [deviceName, apiUrl]);

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
            selectedDate: selectedDate,
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
        {filteredReasons.length > 0 ? (
          filteredReasons.map((reason, index) => (
            <button
              key={index}
              onClick={() => handleReasonClick(reason)}
              className={`p-8 text-4xl font-bold rounded-lg transition duration-300 ease-in-out ${
                selectedReason === reason ? 'bg-blue-600 text-white' : 'bg-gray-200'
              } hover:bg-blue-500`}
            >
              {reason.reasonName}
            </button>
          ))
        ) : (
          <p className="text-xl col-span-2">Không có nguyên nhân nào được tìm thấy cho thiết bị này.</p>
        )}
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
