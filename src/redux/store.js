// store/store.js
import { configureStore } from '@reduxjs/toolkit';
// Import các slice reducer từ các feature
import productionPlanReducer from '../redux/appSlice'

export const store = configureStore({
  reducer: {
    productionPlan: productionPlanReducer,
    // Thêm các reducer khác vào đây
  },
});

export default store;
