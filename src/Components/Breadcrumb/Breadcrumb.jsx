import React from 'react'
import { useLocation, Link } from 'react-router-dom'; 

const Breadcrumb = () => {
    const location = useLocation();
  
    // Chia đường dẫn thành các phần để hiển thị trong breadcrumb
    const pathnames = location.pathname.split('/').filter((x) => x);
  
    return (
      <div className="text-gray-600">
        <Link to="/">Home</Link> {/* Link đến trang chủ */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <span key={to}>
              {' >'}
              <Link to={to} className="font-bold capitalize">
                {value}
              </Link>
            </span>
          );
        })}
      </div>
    );
  };

export default Breadcrumb