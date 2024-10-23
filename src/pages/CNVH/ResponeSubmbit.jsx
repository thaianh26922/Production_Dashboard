import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { declareInterval } from '../../redux/intervalSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ResponeSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedInterval, selectedMachine, selectedDate } = useSelector((state) => state.interval);
  console.log(selectedMachine.deviceId)
  useEffect(() => {
    console.log('Selected Interval:', selectedInterval); // Kiểm tra dữ liệu từ Redux
    console.log('Selected Machine:', selectedMachine);
  }, [selectedInterval, selectedMachine]);

  const [filteredReasons, setFilteredReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isResponseEnabled, setIsResponseEnabled] = useState(false);

  // Lấy lý do từ API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/issue`)
      .then((response) => {
        const reasons = response.data.filter((reason) =>
          reason.deviceNames.includes(selectedMachine.deviceName)
        );
        setFilteredReasons(reasons);
      })
      .catch((error) => toast.error('Có lỗi xảy ra khi lấy dữ liệu.'));
  }, [selectedMachine]);

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setIsResponseEnabled(true);
  };
  const handleResponse = async () => {
    if (selectedReason && selectedInterval) {
      try {
        const payload = {
          deviceId: selectedMachine.deviceId,
          deviceName: selectedMachine.deviceName,
          date: selectedDate,
          interval: {
            status: selectedInterval.status,
            startTime: selectedInterval.startTime,
            endTime: selectedInterval.endTime,
            _id: selectedInterval._id,
            selectedIntervalIndex: selectedInterval.selectedIntervalIndex,
          },
          reasonName: selectedReason.reasonName,
        };
  
        console.log('Payload:', payload); // Kiểm tra payload trước khi gửi
  
        // Gửi dữ liệu lên backend
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/downtime`, payload);
  
        // Cập nhật Redux Store để lưu trạng thái đã khai báo
        dispatch(
          declareInterval({
            date: selectedDate,
            intervalIndex: selectedInterval.selectedIntervalIndex,
          })
        );
  
        toast.success('Phản hồi thành công!');
  
        // Điều hướng về trang chính sau 0.5 giây
        setTimeout(() => navigate('/dashboard/mobile/issue'), 500);
      } catch (error) {
        console.error('Error submitting response:', error);
        toast.error('Có lỗi xảy ra khi gửi phản hồi.');
      }
    } else {
      toast.error('Vui lòng chọn một lý do.');
    }
  };
  
  
  

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 p-8">
        {filteredReasons.map((reason, index) => (
          <button
            key={index}
            onClick={() => handleReasonClick(reason)}
            className={`p-8 text-4xl font-bold ${selectedReason === reason ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {reason.reasonName}
          </button>
        ))}
      </div>

      <button
        onClick={handleResponse}
        disabled={!isResponseEnabled}
        className={`w-full p-4 text-xl font-bold ${isResponseEnabled ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Phản hồi
      </button>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default ResponeSubmit;
