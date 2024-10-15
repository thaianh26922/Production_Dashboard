import React, { useState, useEffect, useRef } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa'; // Import các icon

const ThemeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  // Hàm để bật/tắt chế độ dark mode
  const toggleDarkMode = (mode) => {
    if (mode === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Lưu trạng thái light mode
      setDarkMode(false); // Cập nhật trạng thái
    } else if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Lưu trạng thái dark mode
      setDarkMode(true); // Cập nhật trạng thái
    }
    setIsOpen(false); // Đóng dropdown sau khi chọn
  };

  // Kiểm tra trạng thái dark mode khi component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-gray-100 dark:bg-[#35393c] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-[#35393c] transition"
      >
        {darkMode ? <FaMoon className="h-4 w-4 mr-2" /> : <FaSun className="h-4 w-4 mr-2" />}
        {darkMode ? 'Dark Mode' : 'Light Mode'}
      </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 ml-2 w-[132px] bg-white dark:bg-[#35393c] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <ul>
            <li
              className="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer dark:text-white"
              onClick={() => toggleDarkMode('light')}
            >
              <FaSun className="h-4 w-4 mr-2 text-yellow-500" />
              Light Mode
            </li>
            <li
              className="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer dark:hover:text-white dark:text-white rounded-lg"
              onClick={() => toggleDarkMode('dark')}
            >
              <FaMoon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-300" />
              Dark Mode
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;
