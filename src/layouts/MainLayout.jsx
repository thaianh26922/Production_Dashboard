import React, { useMemo, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sider.bar/Siderbar';
import Header from '../Components/Header/Header';
import Dashboard from '../pages/Dasboard/Dashboard';
import Production from '../pages/Production/ProductionDashboard';

// Định nghĩa các component tương ứng với từng route
const routeComponents = {
  '/products': Production,
  // Thêm các route khác nếu cần
};

function MainLayout() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dùng useMemo để tối ưu hóa việc render component dựa trên đường dẫn hiện tại
  const renderContent = useMemo(() => {
    const Component = routeComponents[location.pathname] || Dashboard;
    return <Component />;
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar luôn cố định ở bên trái */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-60'} bg-gray-200 flex-shrink-0 transition-all duration-300`}>
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} setCurrentView={() => {}} />
      </aside>

      {/* Phần bên phải chứa Header và nội dung chính */}
      <div className="flex flex-col flex-grow">
        {/* Header nằm trên cùng của phần bên phải */}
        <header className="flex-shrink-0 ml-2">
          <Header />
        </header>

        {/* Nội dung chính */}
        <main className="flex-grow p-4 bg-gray-100 overflow-auto mt-2 ml-2">
          <Suspense fallback={<div>Loading...</div>}>
            {renderContent}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
