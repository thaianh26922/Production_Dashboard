// store/store.js
import { configureStore } from '@reduxjs/toolkit';
// Import các slice reducer từ các feature
import productionPlanReducer from '../redux/appSlice'
import maintenancePlanReducer from '../redux/maintenancePlanSlice'
import  useReducer  from '../redux/userSlice'

export const store = configureStore({
  reducer: {
    productionPlan: productionPlanReducer,
    maintenancePlan: maintenancePlanReducer,
    users: useReducer,
    // Thêm các reducer khác vào đây
  },
});

export default store;
