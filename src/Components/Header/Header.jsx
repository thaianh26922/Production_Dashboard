import React from 'react';

 
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';


const Header = () => {
  return (
    <header className="bg-slate-100 shadow lg:h-16 px-4 flex sm:h-32  justify-between items-center">
        <div className="flex items-center">
         {/* Hiển thị Logo */}
         <h2 className="font-bold lg:text-2xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">Nhà máy cơ khí Q.C.S</h2>
        </div>

      <div className="lg:flex lg:items-center lg:space-x-6 sm:hidden md:hidden ">
        {/* Notification Dropdown */}
        <NotificationDropdown />
        {/* User Dropdown */}
        <UserDropdown />
      </div>
      <div className="lg:items-center lg:space-x-6 lg:hidden sm:flex ">
        <div className="mr-2 text-xl">AAA</div>
      </div>
    </header>
  );
};

export default Header;
