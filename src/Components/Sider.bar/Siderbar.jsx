import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBarChart2, FiGrid, FiClipboard, FiDatabase, FiHeadphones, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Submenu from '../Submenu/Submenu';
import { productionItems, qualityItems, equipmentItems, supportItems, settingItems, inventorytItems, adminItems } from '../../libs/menuItems';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSubmenuClick = (toggleSubmenu) => {
    if (isCollapsed) {
      setIsCollapsed(false); // Mở rộng sidebar
      toggleSubmenu(); // Mở submenu tương ứng
    } else {
      toggleSubmenu(); // Chỉ mở submenu nếu sidebar đã mở rộng
    }
  };

  return (
    <div className={`relative bg-primary-500 h-full shadow-md ${isCollapsed ? 'w-20' : 'w-48'} flex flex-col justify-between transition-all duration-300 overflow-y-auto`} 
      style={{ maxHeight: '100vh' }} // Giới hạn chiều cao sidebar
    >
      <div className="flex items-center justify-between p-2">
        {!isCollapsed && (
          <h2 className="text-lg font-bold transition-opacity duration-300">
            Candy Company
          </h2>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-2 ml-1 rounded-full hover:bg-gray-200 focus:outline-none flex items-center" // Thêm flex và items-center để căn giữa biểu tượng với chữ
        >
          {isCollapsed ? <FiChevronRight className="text-sm text-gray-600 ml-2" /> : <FiChevronLeft className="text-sm text-gray-600" />}
        </button>
      </div>

      <div className="flex flex-col space-y-4 p-4">
        <nav className="flex flex-col space-y-4">
          {/* Dashboard Menu */}
          <Link
            to="/dashboard"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FiHome className="mr-4 text-lg" />
            {!isCollapsed && <span>Trang chủ</span>}
          </Link>

          {/* Production Submenu */}
          <Submenu 
            title={<><FiBarChart2 className="mr-4 text-lg" />{!isCollapsed && <span>Sản xuất</span>}</>} 
            items={productionItems} 
            mainLink="/production/overview" // Link chính khi click vào "Sản xuất"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} // Truyền hàm xử lý click vào submenu
          />

          {/* Equipment Submenu */}
          <Submenu 
            title={<><FiGrid className="mr-4 text-lg" />{!isCollapsed && <span>Thiết bị</span>}</>} 
            items={equipmentItems} 
            mainLink="/equipment/machines" // Link chính khi click vào "Thiết bị"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} // Truyền hàm xử lý click vào submenu
          />

          {/* Quality Submenu */}
          <Submenu 
            title={<><FiClipboard className="mr-4 text-lg" />{!isCollapsed && <span>Chất lượng</span>}</>} 
            items={qualityItems} 
            mainLink="/quality/inspection" // Link chính khi click vào "Chất lượng"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} // Truyền hàm xử lý click vào submenu
          />

          {/* Inventory Menu */}
          <Submenu 
            title={<><FiBarChart2 className="mr-4 text-lg" />{!isCollapsed && <span>Tồn kho</span>}</>} 
            items={inventorytItems} 
            mainLink="/inventory/material" // Link chính khi click vào "Sản xuất"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} // Truyền hàm xử lý click vào submenu
          />
          {/* Production Submenu */}
          <Submenu 
            title={<><FiBarChart2 className="mr-4 text-lg" />{!isCollapsed && <span>Hệ thống</span>}</>} 
            items={adminItems} 
            mainLink="/admin/userlist" // Link chính khi click vào "Sản xuất"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} // Truyền hàm xử lý click vào submenu
          />
        </nav>
      </div>

      <div className="p-4 mt-2">
        <nav className="flex flex-col space-y-4">
          {/* Support Submenu */}
          <Submenu 
            title={<><FiHeadphones className="mr-4 text-lg" />{!isCollapsed && <span>Hỗ trợ</span>}</>} 
            items={supportItems} 
            mainLink="/support/faq" // Link chính khi click vào "Hỗ trợ"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} // Truyền hàm xử lý click vào submenu
          />

          {/* Setting Submenu */}
          <Submenu 
            title={<><FiSettings className="mr-4 text-lg" />{!isCollapsed && <span>Cài Đặt</span>}</>} 
            items={settingItems} 
            mainLink="/settings/profile" // Link chính khi click vào "Cài Đặt"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} // Truyền hàm xử lý click vào submenu
          />

          {/* Logout Menu */}
          <Link
            to="/logout"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FiLogOut className="mr-4 text-lg" />
            {!isCollapsed && <span>Đăng xuất</span>}
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
