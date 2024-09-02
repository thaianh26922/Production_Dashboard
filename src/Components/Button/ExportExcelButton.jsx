import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const ExportExcelButton = ({ data, parentComponentName }) => {
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Generate the filename dynamically based on parentComponentName
    const fileName = `${parentComponentName || 'ExportedData'}.xlsx`;

    XLSX.writeFile(workbook, fileName);
    toast.success('Xuất dữ liệu thành công!');
  };

  return (
    <div className="flex justify-end">
      <button
        className="bg-yellow-500 text-white px-3 py-2 rounded-md text-sm"
        onClick={handleExportExcel}
      >
        Xuất Excel
      </button>
    </div>
  );
};

export default ExportExcelButton;
