import React, { useState } from 'react';

const Calendar = ({ tasks = {}, selectedDates, setSelectedDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to current date
  const [today] = useState(new Date().toISOString().split('T')[0]); // Store today's date in 'YYYY-MM-DD' format

  // Function to get the number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the number of days in the previous month
  const getPreviousMonthDays = (year, month) => {
    const previousMonth = month === 0 ? 11 : month - 1;
    const previousYear = month === 0 ? year - 1 : year;
    return getDaysInMonth(previousYear, previousMonth);
  };

  // Function to handle day selection (including deselecting if already selected)
  const handleDayClick = (date) => {
    if (selectedDates.includes(date)) {
      // Deselect if the date is already selected
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      // Select the date
      setSelectedDates([...selectedDates, date]);
    }
  };

  // Function to check if a date is selected
  const isSelected = (date) => {
    return selectedDates.includes(date);
  };

  // Function to generate the calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    // Adjust first day to make Monday the first day of the week
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Get the last days of the previous month to fill the empty slots
    const previousMonthDays = getPreviousMonthDays(year, month);

    // Fill empty slots with days from the previous month (no background color)
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const previousDay = previousMonthDays - i;
      const date = `${year}-${(month === 0 ? 12 : month).toString().padStart(2, '0')}-${previousDay
        .toString()
        .padStart(2, '0')}`;
      days.push(
        <div
          key={`prev-${previousDay}`}
          onClick={() => handleDayClick(date)}
          className={`h-28 border border-gray-300 text-gray-400 p-2 cursor-pointer ${
            isSelected(date) ? 'bg-blue-600 text-white' : ''
          }`}
        >
          {previousDay}
        </div>
      );
    }

    // Fill days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const task = tasks[date]; // Check if there's a task for this date
      const isToday = date === today;

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(date)} // Handle click on the day
          className={`h-28 border border-gray-300 flex flex-col p-2 cursor-pointer ${
            isSelected(date)
              ? 'bg-blue-600 text-white' // If selected, apply selected color
              : isToday
              ? 'bg-blue-300 text-white' // If today, apply today color
              : ''
          }`}
        >
          <div className="flex justify-between">
            <span>{day}</span>
            {isToday && !isSelected(date) && (
              <span className="text-xs bg-white text-blue-500 px-2 py-1 rounded">Today</span>
            )}
          </div>
          {task && <div className="mt-2 text-sm bg-yellow-300 p-1 rounded">{task}</div>} {/* Render the task if present */}
        </div>
      );
    }

    // Fill the remaining slots with days from the next month (no background color)
    const totalDaysDisplayed = adjustedFirstDay + daysInMonth;
    const nextMonthDays = 7 - (totalDaysDisplayed % 7 === 0 ? 7 : totalDaysDisplayed % 7);
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = `${year}-${(month + 2).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      days.push(
        <div
          key={`next-${i}`}
          onClick={() => handleDayClick(date)}
          className={`h-28 border border-gray-300 text-gray-400 p-2 cursor-pointer ${
            isSelected(date) ? 'bg-blue-600 text-white' : ''
          }`}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  return (
    <div className="container mx-auto p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-600">
        {dayNames.map((dayName) => (
          <div key={dayName} className="h-8">
            {dayName}
          </div>
        ))}

        {/* Calendar Days */}
        {generateCalendarDays()}
      </div>

    </div>
  );
};

export default Calendar;
