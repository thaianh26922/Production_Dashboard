import { configureStore } from '@reduxjs/toolkit';
import intervalReducer from './intervalSlice';

const store = configureStore({
  reducer: {
    interval: intervalReducer, 
  },
});

export default store;
