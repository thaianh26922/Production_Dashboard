import React from 'react';
import { FiHome, FiBarChart2, FiGrid, FiClipboard, FiDatabase, FiHeadphones, FiSettings, FiLogOut } from 'react-icons/fi';
import Submenu from '../Submenu/Submenu';
import { productionItems, qualityItems, equipmentItems, supportItems, settingItems } from '../../libs/menuItems';

const Sidebar = ({ isCollapsed, setIsCollapsed, setCurrentView }) => {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`relative bg-white h-full shadow-md ${isCollapsed ? 'w-20' : 'w-60'} flex flex-col justify-between transition-all duration-300`}>
      <div className="flex flex-col space-y-4 p-4">
        <div className="mb-8 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold transition-opacity duration-300">
              @Name App
            </h2>
          )}
        </div>
        <nav className="flex flex-col space-y-4">
          {/* Dashboard Menu */}
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FiHome className="mr-2 text-lg" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>

          {/* Production Submenu */}
          <Submenu 
            title={<><FiBarChart2 className="mr-2 text-lg" />{!isCollapsed && <span>Production</span>}</>} 
            items={productionItems} 
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
          />

          {/* Equipment Submenu */}
          <Submenu 
            title={<><FiGrid className="mr-2 text-lg" />{!isCollapsed && <span>Equipment</span>}</>} 
            items={equipmentItems} 
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
          />

          {/* Quality Submenu */}
          <Submenu 
            title={<><FiClipboard className="mr-2 text-lg" />{!isCollapsed && <span>Quality</span>}</>} 
            items={qualityItems} 
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
          />

          {/* Inventory Menu */}
          <button
            onClick={() => setCurrentView('inventory')}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FiDatabase className="mr-2 text-lg" />
            {!isCollapsed && <span>Inventory</span>}
          </button>
        </nav>
      </div>

      <div>
        <nav className="flex flex-col space-y-4">
          {/* Support Submenu */}
          <Submenu 
            title={<><FiHeadphones className="mr-2 text-lg" />{!isCollapsed && <span>Support</span>}</>} 
            items={supportItems} 
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
          />

          {/* Setting Submenu */}
          <Submenu 
            title={<><FiSettings className="mr-2 text-lg" />{!isCollapsed && <span>Setting</span>}</>} 
            items={settingItems} 
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
          />

          {/* Logout Menu */}
          <button
            onClick={() => setCurrentView('logout')}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FiLogOut className="mr-2 text-lg" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Nút thu gọn/mở rộng sidebar */}
      <div 
        onClick={toggleSidebar} 
        className={`absolute top-1/2 transform -translate-y-1/2 -right-4 w-8 h-8 flex items-center justify-center cursor-pointer bg-white shadow-lg rounded-full`}
        style={{
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      >
        <div
          className="w-4 h-4 bg-gray-600"
          style={{
            clipPath: isCollapsed 
              ? 'polygon(0% 0%, 100% 50%, 0% 100%)' 
              : 'polygon(100% 0%, 0% 50%, 100% 100%)',
          }}
        />
      </div>
    </div>
  );
}

export default Sidebar;
