import React from 'react'
import { FiFilePlus} from 'react-icons/fi';

function ImportButton({onClick, label = "Nhập Dữ liệu"}) {
  return (
    <button
    className="bg-green-400 text-sm text-white px-3 py-2 rounded-md flex items-center hover:bg-green-600 transition-colors"
    onClick={onClick}
  >
    <FiFilePlus className="mr-2" />
    {label}
  </button>
  )
}

export default ImportButton
