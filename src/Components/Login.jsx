import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Thêm các icon show/hide password
import { toast } from 'react-toastify';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import đúng jwtDecode
import { useAuth } from '../context/AuthContext'; // Đảm bảo đường dẫn này chính xác

function Login() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Trạng thái để hiển thị/ẩn mật khẩu

  const handleLogin = async (event) => {
    event.preventDefault(); // Ngăn form reload lại trang
    console.log('Nút Đăng nhập được nhấn'); // Log sự kiện nhấn nút
  
    setIsLoading(true); // Bắt đầu loading
  
    try {
      const response = await axios.post('http://192.168.1.13:5000/api/login', {
        username,
        password,
      });
  
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
  
        const decodedToken = jwtDecode(token); // Giải mã token
        const role = decodedToken.user.role; // Lấy vai trò từ token
        localStorage.setItem('role', role);  
        setUserRole(role);

        // Log router trước khi điều hướng
        console.log('Vai trò nhận được:', role);

        // Đợi cho đến khi vai trò được cập nhật xong
        await new Promise((resolve) => setTimeout(resolve, 100)); 

        console.log('Token:', localStorage.getItem('token'));
        console.log('Role:', localStorage.getItem('role'));
  
        toast.success('Đăng nhập thành công!');

        // Log router nhận được trước khi điều hướng
        if (role === 'CNVH') {
          console.log('Điều hướng tới: /dashboard/mobile');
          navigate('/dashboard/mobile'); // Điều hướng tới dashboard mobile cho CNVH
        } else {
          console.log('Điều hướng tới: /dashboard');
          navigate('/dashboard'); // Điều hướng tới dashboard chính cho các vai trò khác
        }
      }
    } catch (error) {
      console.error('Login Error:', error); 
      toast.error('Sai tên đăng nhập hoặc mật khẩu!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false); // Kết thúc loading dù thành công hay thất bại
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-500 to-blue-700 px-4 sm:px-0">
      <div className="w-full max-w-lg sm:w-3/4 md:w-1/2 lg:w-1/3 p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đăng nhập tài khoản của bạn</h2>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tên đăng nhập"
            />
          </div>
          
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // Chuyển đổi giữa hiển thị và ẩn mật khẩu
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Mật khẩu"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0"></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </button>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">Quên mật khẩu?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
