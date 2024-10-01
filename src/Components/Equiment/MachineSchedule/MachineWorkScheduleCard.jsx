import React, { useState } from 'react';

// Hàm để lấy màu đèn tín hiệu
const getSignalLightColors = (status) => {
  if (status === 'Chạy') return { red: 'white', yellow: 'white', green: '#8ff28f' };
  if (status === 'Chờ' || status === 'Cài Đặt') return { red: 'white', yellow: '#fafa98', green: 'white' };
  if (status === 'Lỗi') return { red: 'red', yellow: 'white', green: 'white' };
  if (status === 'Tắt') return { red: 'white', yellow: 'white', green: 'white' };
  if (status === 'Vệ Sinh') return { red: 'white', yellow: 'white', green: '#807e7e' };
  return { red: 'white', yellow: 'white', green: 'white' };
};

const MachineWorkScheduleCard = ({ machine }) => {
  const [activeStatus, setActiveStatus] = useState(machine.status);

  const signalLightColors = getSignalLightColors(activeStatus);
  const blinkClass = activeStatus === 'Lỗi' ? 'animate-blinkError' : '';

  return (
    <div className=" shadow-md bg-gray-100 rounded-md w-full mb-4">
      {/* Tiêu đề tên máy: Hiển thị CNC hoặc PHAY dựa trên máy */}
      <div className="bg-gray-50 p-1 items-center justify-center flex my-auto"> <h2 className="text-xl font-bold mb-2 flex items-center justify-center text-[#375BA9]">
        {machine.name} {/* Sử dụng thuộc tính `name` để hiển thị CNC hoặc PHAY */}
      </h2></div>
      

      <div className="items-center mb-2 mt-2 grid grid-cols-5 gap-1">
        {/* Đèn tín hiệu */}
        <div className="col-span-1 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="w-16 h-60 border border-black rounded-lg ml-6 mr-2">
              <div
                style={{ backgroundColor: signalLightColors.red, height: '33.333%' }}
                className={`rounded-t-lg  border-l-red-600 border-l-4  border-b-2 border-b-red-600`}
              ></div>
              <div
                style={{ backgroundColor: signalLightColors.yellow, height: '33.333%' }}
                className="border-[#FCFC00] border-l-4 border-b-2"
              ></div>
              <div
                style={{ backgroundColor: signalLightColors.green, height: '33.3333%' }}
                className="border-[#38F338] border-l-4 border-b-[#38F338] border-b-3 rounded-b-lg "
              ></div>
             
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-white mb-2 p-2 rounded-lg shadow-md ml-4 mr-2">
          <h3 className="font-semibold mb-2 text-gray-700">Kế hoạch sản xuất</h3>
          
          {/* Main Shift */}
          <div className="mb-4 p-2 bg-gray-50 rounded-lg shadow ">
            <div className="h-8 rounded-md  items-center justify-start flex mx-auto"  style={{background: 'linear-gradient(90deg, #FCFC00 0.25%, #FFF 100%)',}}> 
                <div className="bg-white text-sm rounded text-black inline-block px-1 ml-1 ">
                  Ca chính
                </div> 
            </div>
            <div className="text-end ">
              <div className="text-gray-800">Nguyễn Văn A</div>
              <div className="text-gray-800">Nguyễn Văn C</div>
             </div>
            
            
          </div>

          {/* Secondary Shift */}
          <div className="mb-4 p-2 bg-gray-50 rounded-lg shadow ">
            <div className="h-8 rounded-md  items-center justify-start flex mx-auto"  style={{background: 'linear-gradient(90deg, #38F338 0%, #FFF 100%)',}}> 
                <div className="bg-white text-sm rounded text-black inline-block px-1 ml-1 ">
                  Ca phụ 1h
                </div> 
            </div>
            <div className="text-end ">
              <div className="text-gray-800">Nguyễn Văn A</div>
              <div className="text-gray-800">Nguyễn Văn C</div>
             </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineWorkScheduleCard;
