import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const Submenu = ({ title, items, isCollapsed, mainLink, onSubmenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMainLinkClick = () => {
    navigate(mainLink);
    onSubmenuClick(toggleSubmenu);
  };

  return (
    <div className="flex flex-col">
      <div 
        className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer"
        onClick={handleMainLinkClick}
      >
        <span className="flex items-center">
          {title}
        </span>
        <span>
          {isOpen ? <FiChevronDown /> : <FiChevronRight />}
        </span>
      </div>
      <div className={`${isOpen && !isCollapsed ? 'block' : 'hidden'} pl-4 mt-2`}>
        {items.map((item, index) => (
          item.name && (
            <Link
              key={index}
              to={item.link}
              className="block py-1 px-6 text-gray-600 hover:text-black"
            >
              {item.name}
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default Submenu;
