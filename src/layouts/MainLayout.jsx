import React, { useState } from 'react';
import Sidebar from '../Components/Sider.bar/Siderbar';
import Header from '../Components/Header/Header';

function MainLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-48'} bg-gray-200 flex-shrink-0 transition-all duration-300`}>
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} setCurrentView={() => {}} />
      </aside>

      
      <div className="flex flex-col flex-grow">
        
        <header className="flex-shrink-0 ml-2">
          <Header />
        </header>

        {/* Nội dung chính */}
        <main className="flex-grow p-4 bg-gray-100 overflow-auto mt-2 ml-2">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
