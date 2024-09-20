import React from 'react';

import logo from '../../assets/image/logo.png';  
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';


const Header = () => {
  return (
    <header className="bg-cyan-700 shadow h-16 px-4 flex  justify-between items-center">
      <div className="flex items-center">
        {/* Hiển thị Logo */}
        <img src={logo} alt="Logo" className="w-28 h-full object-contain " />
      </div>

      <div className="flex items-center space-x-6">
        {/* Notification Dropdown */}
        <NotificationDropdown />
        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
