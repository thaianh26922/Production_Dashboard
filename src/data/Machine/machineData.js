const generateFakeData = (startDate, endDate) => {
  const historyData = [];
  const oneDay = 24 * 60 * 60 * 1000; // Một ngày tính bằng mili giây

  // Mẫu dữ liệu trong một ngày
  const dailyTemplate = [
    { time: '06:14', status: 'Chạy', duration: 10 },
    { time: '06:24', status: 'Chờ', duration: 20 },
    { time: '06:44', status: 'Lỗi Máy', duration: 10 },
    { time: '06:54', status: 'Chạy', duration: 60 },
    { time: '07:54', status: 'Dừng', duration: 60 },
    { time: '08:54', status: 'Chờ', duration: 120 },
    { time: '10:54', status: 'Chạy', duration: 120 },
    { time: '12:54', status: 'Dừng', duration: 60 },
    { time: '13:54', status: 'Chạy', duration: 6 },
    { time: '14:00', status: 'Chạy', duration: 120 },
    { time: '16:00', status: 'Chờ', duration: 30 },
    { time: '16:30', status: 'Lỗi Máy', duration: 10 },
    { time: '16:40', status: 'Chạy', duration: 80 },
    { time: '18:00', status: 'Dừng', duration: 60 },
    { time: '19:00', status: 'Chạy', duration: 120 },
    { time: '21:00', status: 'Chờ', duration: 60 },
    { time: '22:00', status: 'Chạy', duration: 120 },
    { time: '00:00', status: 'Chờ', duration: 30 },
    { time: '00:30', status: 'Lỗi Máy', duration: 10 },
    { time: '00:40', status: 'Chạy', duration: 100 },
    { time: '02:20', status: 'Dừng', duration: 120 },
    { time: '04:20', status: 'Chờ', duration: 60 },
    { time: '05:20', status: 'Thiếu đơn', duration: 40 },
  ];

  // Sinh dữ liệu từ ngày bắt đầu đến ngày kết thúc
  for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + oneDay)) {
    const formattedDate = d.toISOString().split('T')[0]; // Lấy định dạng YYYY-MM-DD
    const dailyData = dailyTemplate.map((entry) => ({
      ...entry,
      date: formattedDate, // Thêm ngày vào mỗi mục dữ liệu
    }));

    historyData.push(...dailyData);
  }

  return historyData;
};
