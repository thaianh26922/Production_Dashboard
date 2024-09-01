import React from 'react';
import { FiSearch, FiBell, FiUser, FiMenu } from 'react-icons/fi'; 
import logo from '../../assets/image/logo.png'

const Header = () => {
    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 mr-4" />
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="border rounded-full pl-3 pr-10 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <FiSearch className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500" />
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <FiBell className="text-gray-600 text-xl" />
                <FiUser className="text-gray-600 text-xl" />
                <FiMenu className="text-gray-600 text-xl" />
            </div>
        </header>
    );
}

export default Header;
