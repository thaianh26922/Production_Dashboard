import React from 'react';
import AppRouter from './routers/AppRouter';
import { Provider } from 'react-redux';
import { store } from '.././src/redux/store'; 
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Đảm bảo bạn đã import CSS của react-toastify

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppRouter />
        
      </AuthProvider>
    </Provider>
  );
}

export default App;
