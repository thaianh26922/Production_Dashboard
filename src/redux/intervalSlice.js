// src/redux/intervalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getCurrentDate = () => new Date().toISOString().split('T')[0];

const initialState = {
  selectedDate: getCurrentDate(),
  selectedMachine: null,
  selectedInterval: null,
  declaredIntervals: [], // Mảng chứa các khoảng thời gian đã khai báo
};

const intervalSlice = createSlice({
  name: 'interval',
  initialState,
  reducers: {
    setMachineData: (state, action) => {
      const { selectedDate, selectedMachine, selectedInterval } = action.payload;
      state.selectedDate = selectedDate || state.selectedDate;
      state.selectedMachine = selectedMachine;
      state.selectedInterval = selectedInterval;
    },
    declareInterval: (state, action) => {
      const intervalIndex = action.payload;
      if (!state.declaredIntervals.includes(intervalIndex)) {
        state.declaredIntervals.push(intervalIndex); // Thêm chỉ mục vào mảng nếu chưa tồn tại
      }
    },
  },
});

export const { setMachineData, declareInterval } = intervalSlice.actions;
export default intervalSlice.reducer;
