import React from 'react';

 
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';


const Header = () => {
  return (
    <header className="bg-slate-100 shadow h-16 px-4 flex  justify-between items-center">
        <div className="flex items-center">
         {/* Hiển thị Logo */}
         <h2>Nha May Smart</h2>
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
