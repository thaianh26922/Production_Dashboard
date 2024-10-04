import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import CustomCalendar from '../../Components/Calendar/CustomCalendar';
import ProductionTaskManagement from './ProductionTaskManagement';

const CustomUpdateModal = ({ open, onClose, onCancel, selectedDates, setSelectedDates, selectedMachines }) => {
  const [taskData, setTaskData] = useState({}); // Dữ liệu nhiệm vụ sản xuất lưu theo ngày

  // Hàm xử lý khi lưu nhiệm vụ cùng ngày đã chọn
  const handleSave = () => {
    const updatedTaskData = { ...taskData };

    // Lưu thông tin nhiệm vụ cho từng ngày được chọn
    selectedDates.forEach(date => {
      if (selectedMachines.length > 0) {
        updatedTaskData[date] = {
          machines: selectedMachines, // Lưu các thiết bị đã chọn cho ngày đó
          tasks: updatedTaskData[date]?.tasks || [], // Đảm bảo thông tin nhiệm vụ được lưu kèm ngày
        };
      }
    });

    setTaskData(updatedTaskData); // Lưu thông tin nhiệm vụ với các ngày đã chọn
    console.log('Dữ liệu nhiệm vụ đã lưu:', updatedTaskData);
    setSelectedDates([]); // Xóa các ngày đã chọn sau khi lưu
    onClose(); // Đóng modal sau khi lưu
  };

  // Hàm xử lý khi nhấn nút Hủy bỏ
  const handleCancel = () => {
    setSelectedDates([]); // Xóa các ngày đã chọn
    onCancel(); // Gọi hàm onCancel nếu được truyền vào
    onClose(); // Đóng modal
  };

  // Hàm để lấy thông tin nhiệm vụ đã lưu cho một ngày cụ thể
  const getTaskForDate = (date) => taskData[date] || null;
  console.log (taskData)

  return (
    <Modal
      title="Nhiệm vụ sản xuất"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy bỏ
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu kế hoạch
        </Button>,
      ]}
      width={1200}
    >
      <div className="grid grid-cols-5 gap-1 h-100">
        <div className="p-1 col-span-4">
          {/* Hiển thị lịch với các ngày đã chọn */}
          <CustomCalendar
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            getTaskForDate={getTaskForDate} // Lấy thông tin nhiệm vụ đã lưu cho từng ngày
            taskData={taskData} // Truyền dữ liệu nhiệm vụ đầy đủ để hiển thị trên lịch
          />
        </div>
        <div className="col-span-1">
          {/* Quản lý nhiệm vụ sản xuất */}
          <ProductionTaskManagement 
            selectedMachines={selectedMachines}
            setTaskData={setTaskData} // Cập nhật dữ liệu nhiệm vụ khi chỉnh sửa hoặc thêm mới
            taskData={taskData} // Truyền dữ liệu nhiệm vụ hiện tại để cho phép chỉnh sửa/cập nhật
            selectedDates={selectedDates || []}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CustomUpdateModal;
