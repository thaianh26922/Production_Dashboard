import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiBarChart2, FiGrid, FiClipboard, FiDatabase, FiHeadphones, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Submenu from '../Submenu/Submenu';
import { AuthContext } from '../../context/AuthContext';
import { productionItems, qualityItems, equipmentItems, supportItems, settingItems, inventoryItems, adminItems, QCStItems } from '../../libs/menuItems';
import { toast } from 'react-toastify';
import logo from '../../assets/image/logo.png'; 

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
    <div className={`relative bg-slate-100 h-full shadow-md ${isCollapsed ? 'w-20' : 'w-56'} flex flex-col justify-between transition-all duration-300 overflow-y-auto`} style={{ maxHeight: '100vh' }}>
      <div className="flex items-center justify-between p-4 mt-2">
        {!isCollapsed && (
         <div className="flex items-center">
         {/* Hiển thị Logo */}
         <img src={logo} alt="Logo" className="w-28 h-full object-contain " />
        </div>
        )}
        <button onClick={toggleSidebar} className="p-2  rounded-full hover:bg-gray-200 focus:outline-none flex items-center">
          {isCollapsed ? <FiChevronRight className="text-sm text-gray-500 ml-1" /> : <FiChevronLeft className="text-sm text-gray-500" />}
        </button>
      </div>

      <div className="flex flex-col space-y-4 p-1 -mt-10 text-gray-500">
        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-black">
            <FiHome className="mr-4 text-lg text-gray-500" />
            {!isCollapsed && <span className="text-gray-500">Trang chủ</span>}
          </Link>

          {/* <Submenu
            title={<><FiBarChart2 className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Sản xuất</span>}</>}
            items={productionItems}
            mainLink="/production/overview"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          /> */}

          <Submenu
            title={<><FiGrid className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Quản Lý Thiết Bị</span>}</>}
            items={equipmentItems}
            mainLink="/equipment/machines"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />
            <Submenu
            title={<><FiBarChart2 className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Hiệu Suất Tổng Thể </span>}</>}
            items={QCStItems}
            mainLink="/QCS/analysis"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          {/* <Submenu
            title={<><FiClipboard className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Chất lượng</span>}</>}
            items={qualityItems}
            mainLink="/quality/overview"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          /> */}

          {/* <Submenu
            title={<><FiDatabase className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Tồn kho</span>}</>}
            items={inventoryItems}
            mainLink="/inventory/material"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          /> */}

          {userRole === 'Admin' && (
            <Submenu
              title={<><FiSettings className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Hệ thống</span>}</>}
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
            title={<><FiHeadphones className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Hỗ trợ</span>}</>}
            items={supportItems}
            mainLink="/support/faq"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          <Submenu
            title={<><FiSettings className="mr-4 text-lg text-gray-500" />{!isCollapsed && <span className="text-gray-500">Cài Đặt</span>}</>}
            items={settingItems}
            mainLink="/settings/profile"
            isCollapsed={isCollapsed}
            onSubmenuClick={handleSubmenuClick}
            setIsCollapsed={setIsCollapsed}
          />

          <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-black focus:outline-none">
            <FiLogOut className="mr-4 text-lg text-gray-500" />
            {!isCollapsed && <span className="text-gray-500">Đăng xuất</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
