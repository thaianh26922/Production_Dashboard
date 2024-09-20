import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiBarChart2, FiGrid, FiClipboard, FiDatabase, FiHeadphones, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Submenu from '../Submenu/Submenu';
import { AuthContext } from '../../context/AuthContext';
import { productionItems, qualityItems, equipmentItems, supportItems, settingItems, inventoryItems, adminItems } from '../../libs/menuItems';
import { toast } from 'react-toastify';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Đã đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <div className={`relative bg-cyan-700 h-full shadow-md ${isCollapsed ? 'w-20' : 'w-48'} flex flex-col justify-between transition-all duration-300 overflow-y-auto`} style={{ maxHeight: '100vh' }}>
      <div className="flex items-center justify-between p-2">
        {!isCollapsed && (
          <h2 className="ml-4 text-lg font-bold transition-opacity duration-300 text-white">
            Data Insight
          </h2>
        )}
        <button onClick={toggleSidebar} className="p-2 ml-1 rounded-full hover:bg-gray-200 focus:outline-none flex items-center">
          {isCollapsed ? <FiChevronRight className="text-sm text-white ml-2" /> : <FiChevronLeft className="text-sm text-white" />}
        </button>
      </div>

      <div className="flex flex-col space-y-4 p-4 text-white">
        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-black">
            <FiHome className="mr-4 text-lg text-white" />
            {!isCollapsed && <span className="text-white">Trang chủ</span>}
          </Link>

          <Submenu
            title={<><FiBarChart2 className="mr-4 text-lg text-white" />{!isCollapsed && <span className="text-white">Sản xuất</span>}</>}
            items={productionItems}
            mainLink="/production/overview"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          <Submenu
            title={<><FiGrid className="mr-4 text-lg text-white" />{!isCollapsed && <span className="text-white">Thiết bị</span>}</>}
            items={equipmentItems}
            mainLink="/equipment/machines"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          <Submenu
            title={<><FiClipboard className="mr-4 text-lg text-white" />{!isCollapsed && <span className="text-white">Chất lượng</span>}</>}
            items={qualityItems}
            mainLink="/quality/overview"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          <Submenu
            title={<><FiDatabase className="mr-4 text-lg text-white" />{!isCollapsed && <span className="text-white">Tồn kho</span>}</>}
            items={inventoryItems}
            mainLink="/inventory/material"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          {userRole === 'Admin' && (
            <Submenu
              title={<><FiSettings className="mr-4 text-lg text-white" />{!isCollapsed && <span className="text-white">Hệ thống</span>}</>}
              items={adminItems}
              mainLink="/admin/userlist"
              isCollapsed={isCollapsed}
              onSubmenuClick={handleSubmenuClick}
              setIsCollapsed={setIsCollapsed}
            />
          )}
        </nav>
      </div>

      <div className="p-4 mt-2">
        <nav className="flex flex-col space-y-4">
          <Submenu
            title={<><FiHeadphones className="mr-4 text-lg text-white" />{!isCollapsed && <span className="text-white">Hỗ trợ</span>}</>}
            items={supportItems}
            mainLink="/support/faq"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          <Submenu
            title={<><FiSettings className="mr-4 text-lg text-white" />{!isCollapsed && <span className="text-white">Cài Đặt</span>}</>}
            items={settingItems}
            mainLink="/settings/profile"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-black focus:outline-none">
            <FiLogOut className="mr-4 text-lg text-white" />
            {!isCollapsed && <span className="text-white">Đăng xuất</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
