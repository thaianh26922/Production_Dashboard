import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation và useNavigate
import InfoCard from '../../Components/MachineCard/InfoCard'; // Import InfoCard
import '../../index.css'; // Tailwind CSS
import { FiChevronLeft } from 'react-icons/fi';
import { IoMdClose } from "react-icons/io"; // Import icon
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS react-toastify

// Hàm để lấy ngày hiện tại theo định dạng YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu < 10
  const day = String(today.getDate()).padStart(2, '0'); // Thêm số 0 nếu < 10
  return `${year}-${month}-${day}`;
};

const ResponeIssue = () => {
  const location = useLocation(); // Sử dụng useLocation để nhận dữ liệu
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng quay lại

  // State để quản lý modal, div đã được click và nút phản hồi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiv, setSelectedDiv] = useState(null); // Trạng thái để lưu div đã được chọn
  const [isResponseEnabled, setIsResponseEnabled] = useState(false); // Trạng thái để bật nút phản hồi

  // Lấy dữ liệu từ state khi điều hướng từ Dashboard2
  const { selectedDate, selectedMachine } = location.state || { selectedDate: null, selectedMachine: null };

  // Nếu không có ngày được chọn, sử dụng ngày hiện tại
  const displayDate = selectedDate || getCurrentDate();

  // Hàm xử lý khi click vào biểu tượng "back" FiChevronLeft
  const handleBackClick = () => {
    navigate(-1); // Điều hướng quay lại trang trước đó
  };

  // Hàm xử lý mở modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Hàm xử lý đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý gọi đội QC
  const handleCallQC = () => {
    toast.success('Đã gọi Đội QC thành công. Xin đợi trong giây lát!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: { fontSize: '1.6rem', padding: '1rem', width: '90%' }, // Kích thước và khoảng cách phù hợp cho điện thoại
    });
    handleCloseModal(); // Đóng modal sau khi nhấn
  };

  // Hàm xử lý gọi đội bảo trì
  const handleCallMaintenance = () => {
    toast.success('Đã gọi Đội Bảo Trì thành công. Xin đợi trong giây lát!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: { fontSize: '1.6rem', padding: '1rem', width: '90%' }, // Kích thước và khoảng cách phù hợp cho điện thoại
    });
    handleCloseModal(); // Đóng modal sau khi nhấn
  };

  // Hàm xử lý khi nhấn vào div thời gian ngừng máy
  const handleTimeClick = (index) => {
    setSelectedDiv(index); // Đặt trạng thái cho div đã được chọn
    setIsResponseEnabled(true); // Bật nút phản hồi khi người dùng nhấn vào khoảng thời gian ngừng máy
  };

  // Hàm điều hướng khi nhấn nút phản hồi
  const handleResponse = () => {
    navigate('/dashboard/mobile/issue/respone');
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
      <div className="grid grid-cols-2 w-full p-2 gap-2">
        {/* Hiển thị ngày đã chọn hoặc ngày hiện tại */}
        <div className="justify-start grid grid-flow-row p-8 ">
          <h1 className="text-left text-5xl font-semibold mt-4 w-full">Ngày</h1>
          <div>
            <input
              type="date"
              value={displayDate} // Hiển thị ngày đã chọn hoặc ngày hiện tại
              readOnly // Không cho phép chỉnh sửa ngày đã chọn
              className="block w-[100%] h-24 text-5xl ml-6 mt-6 border bg-white text-center rounded-lg py-6 px-8 focus:outline-none"
            />
          </div>
        </div>

        {/* Hiển thị thiết bị đã chọn */}
        <div className="justify-start grid grid-flow-row p-8">
          <h1 className="text-center text-5xl font-semibold mt-2">Thiết bị đã chọn</h1>
          {selectedMachine ? (
            <InfoCard machine={selectedMachine} className={`bg-white text-center p-[2px] ml-4 text-5xl`} />
          ) : (
            <p className="text-4xl text-center text-red-500">Không có thiết bị nào được chọn!</p>
          )}
        </div>
      </div>

      {/* Nội dung khoảng thời gian ngừng máy */}
      <div className="justify-start grid grid-flow-row p-8">
        <h1 className="text-center text-5xl font-semibold mt-2">Khoảng thời gian ngừng máy</h1>
      </div>

      {/* Danh sách thời gian ngừng máy */}
      {['10:50 - 11:52', '12:00 - 13:00', '14:30 - 15:00'].map((time, index) => (
        <div
          key={index}
          className={`border-8 rounded-3xl grid grid-cols-2 py-8 mt-4 px-8 w-[90%] justify-center items-center ml-8 gap-10 text-4xl cursor-pointer ${selectedDiv === index ? 'bg-gray-200' : 'border-[#FCFC00]'}`}
          onClick={() => handleTimeClick(index)} // Gọi hàm khi nhấn vào div
          style={{ boxShadow: `inset 0px 10px 40px 10px rgba(252, 252, 0, 0.4)` }}
        >
          <span className="col-span-1 flex ml-2 ">Trong khoảng</span>
          <span className="col-span-1 flex">{time}</span>
          <span className="col-span-1 flex ml-2 ">Thời lượng</span>
          <span className="col-span-1 flex">62 phút 59 giây</span>
          <span className="col-span-1 flex ml-2 ">Trạng thái thiết bị</span>
          <span className="col-span-1 flex">Chờ</span>
        </div>
      ))}

      {/* Nút phản hồi */}
      <button
        onClick={handleResponse}
        disabled={!isResponseEnabled} // Nút chỉ hoạt động khi isResponseEnabled = true
        className={`w-[90%] p-8 rounded-lg shadow-lg text-white text-center ml-8 mt-2 text-4xl font-bold transition duration-300 ease-in-out ${isResponseEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Phản hồi
      </button>

      {/* Nút gọi trợ giúp */}
      <button
        onClick={handleOpenModal} // Gọi hàm mở modal
        className="bg-red-600 w-[90%] hover:bg-red-900 p-8 rounded-lg shadow-lg text-white text-center ml-8 mt-2 text-4xl font-bold transition duration-300 ease-in-out"
      >
        Gọi trợ giúp
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[70%] h-[22%] p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-4 w-full ">
              <h2 className="text-6xl text-center font-bold col-span-3 ml-4">{selectedMachine}</h2>
              <button onClick={handleCloseModal} className="text-6xl col-span-1 ml-8 font-bold">
                <IoMdClose />
              </button>
            </div>

            <p className="text-5xl text-center mt-10">Cần gọi trợ giúp từ</p>
            <div className="grid grid-cols-2 gap-4 mt-16">
              <button onClick={handleCallQC} className="border-2 border-blue-600 text-blue-600 text-5xl py-4 px-8 rounded-md">
                Đội QC
              </button>
              <button onClick={handleCallMaintenance} className="border-2 border-blue-600 text-blue-600 text-5xl py-4 px-8 rounded-md">
                Đội Bảo Trì
              </button>
            </div>
          </div>
        </div>
      )}

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
        style={{ fontSize: '30px', padding: '3rem', width: '100%', textAlign:'center' }} // Cấu hình cho phù hợp với điện thoại
      />
    </div>
  );
};

export default ResponeIssue;
