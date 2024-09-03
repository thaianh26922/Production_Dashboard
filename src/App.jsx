import React from 'react';
import AppRouter from './routers/AppRouter';
import { Provider } from 'react-redux';
import { store } from '.././src/redux/store'; 
import { AuthProvider } from './context/AuthContext';


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
