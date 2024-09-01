import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Submenu = ({ title, items, setCurrentView }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSubmenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div 
                className="flex items-center text-gray-700 hover:text-black cursor-pointer"
                onClick={toggleSubmenu}
            >
                {title}
                <FiChevronDown className={`ml-auto transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="ml-6 mt-2 flex flex-col space-y-2">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentView(item.link)}  // Change view based on submenu item
                            className="text-gray-600 hover:text-black"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Submenu;
