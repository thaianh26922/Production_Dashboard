import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import user_avatar from '../../assets/image/user.png'

const UserDropdown = () => {
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="flex items-center focus:outline-none">
          <img
            src={user_avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 text-gray-400 dark:text-white">Đồng Duy Hậu</span>
          <FiChevronDown className="ml-1 text-gray-600" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } px-4 py-2 text-sm text-gray-700 flex items-center`}
                >
                  <img
                    src={user_avatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">Đồng Duy Hậu</div>
                    <div className="text-xs text-gray-500">Nhân viên sản xuất</div>
                  </div>
                </div>
              )}
            </Menu.Item>
            <div className="border-t border-gray-200"></div>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700`}
                >
                  Thông tin cá nhân
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700`}
                >
                  Tin nhắn
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700`}
                >
                  Công việc
                </a>
              )}
            </Menu.Item>
           
            <div className="border-t border-gray-200"></div>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700`}
                >
                  Cài đặt
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700`}
                >
                  Đăng xuất
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
