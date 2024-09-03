import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBarChart2, FiGrid, FiClipboard, FiDatabase, FiHeadphones, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Submenu from '../Submenu/Submenu';
import { AuthContext } from '../../context/AuthContext'
import { productionItems, qualityItems, equipmentItems, supportItems, settingItems, inventoryItems, adminItems } from '../../libs/menuItems';

const Sidebar = ({ isCollapsed, setIsCollapsed}) => {
  // Hàm chuyển đổi trạng thái ẩn/hiện của sidebar
  const {userRole} = useContext(AuthContext);
  console.log('Current role:', userRole);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Hàm xử lý khi click vào submenu
  const handleSubmenuClick = (toggleSubmenu) => {
    if (isCollapsed) {
      setIsCollapsed(false); 
      toggleSubmenu(); 
    } else {
      toggleSubmenu(); 
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
          {/* Mục menu chung: Dashboard */}
          <Link
            to="/dashboard"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FiHome className="mr-4 text-lg" />
            {!isCollapsed && <span>Trang chủ</span>}
          </Link>

          {/* Submenu Sản xuất */}
          <Submenu 
            title={<><FiBarChart2 className="mr-4 text-lg" />{!isCollapsed && <span>Sản xuất</span>}</>} 
            items={productionItems} 
            mainLink="/production/overview" 
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} 
          />

          {/* Submenu Thiết bị */}
          <Submenu 
            title={<><FiGrid className="mr-4 text-lg" />{!isCollapsed && <span>Thiết bị</span>}</>} 
            items={equipmentItems} 
            mainLink="/equipment/machines" 
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} 
          />

          {/* Submenu Chất lượng */}
          <Submenu 
            title={<><FiClipboard className="mr-4 text-lg" />{!isCollapsed && <span>Chất lượng</span>}</>} 
            items={qualityItems} 
            mainLink="/quality/overview" 
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} 
          />

          {/* Submenu Tồn kho */}
          <Submenu 
            title={<><FiDatabase className="mr-4 text-lg" />{!isCollapsed && <span>Tồn kho</span>}</>} 
            items={inventoryItems} 
            mainLink="/inventory/material" 
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} 
          />

          {/* Mục menu của admin chỉ hiển thị nếu userRole là "Admin" */}
          
            { (userRole === 'Admin' && <Submenu 
              title={<><FiSettings className="mr-4 text-lg" />{!isCollapsed && <span>Hệ thống</span>}</>} 
              items={adminItems} 
              mainLink="/admin/userlist" 
              isCollapsed={isCollapsed}
             onSubmenuClick={handleSubmenuClick} 
            />)}
          
        </nav>
      </div>

      <div className="p-4 mt-2">
        <nav className="flex flex-col space-y-4">
          {/* Submenu Hỗ trợ */}
          <Submenu 
            title={<><FiHeadphones className="mr-4 text-lg" />{!isCollapsed && <span>Hỗ trợ</span>}</>} 
            items={supportItems} 
            mainLink="/support/faq" 
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} 
          />

          {/* Submenu Cài đặt */}
          <Submenu 
            title={<><FiSettings className="mr-4 text-lg" />{!isCollapsed && <span>Cài Đặt</span>}</>} 
            items={settingItems} 
            mainLink="/settings/profile" 
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick} 
          />

          {/* Mục Đăng xuất */}
          <Link
            to="/login"
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
