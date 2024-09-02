import { addDays, differenceInDays } from 'date-fns';

export const generateHeatmapData = (start, end) => {
  const daysDifference = differenceInDays(end, start) + 1;
  const xLabels = Array.from({ length: daysDifference }).map((_, i) =>
    addDays(start, i).toLocaleDateString('en-GB')
  );
  const yLabels = ['Chuẩn bị nguyên liệu', 'Trộn và nhồi bột', 'Định hình bánh', 'Nướng bánh', 'Làm mát và đóng gói'];

  const generateRandomData = () => {
    return yLabels.flatMap((stage, stageIndex) =>
      xLabels.map((_, dayIndex) => ({
        x: dayIndex, // Vị trí ngày trên trục x
        y: stageIndex, // Vị trí công đoạn sản xuất trên trục y
        v: Math.floor(Math.random() * 50 + 30), // Cycle time từ 30 đến 80 phút
      }))
    );
  };

  return {
    labels: xLabels, // Truyền mảng xLabels trực tiếp
    yLabels, // Truyền mảng yLabels
    datasets: [
      {
        label: 'Cycle Time',
        data: generateRandomData(),
        backgroundColor: (ctx) => {
          const value = ctx.raw.v;
          const alpha = (value - 30) / 50;
          return `rgba(75, 192, 192, ${alpha})`;  // Màu nền thay đổi theo giá trị
        },
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }
    ],
  };
};
