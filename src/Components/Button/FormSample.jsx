import React from 'react'
import { FiDownload} from 'react-icons/fi';


function FormSample({onClick, label = "Tải Mẫu"}) {
  return (
     <button
      className="bg-green-400 text-sm text-white px-3 py-2 rounded-md flex items-center hover:bg-green-600 transition-colors"
      onClick={onClick}
    >
      <FiDownload className="mr-2" />
      {label}
    </button>
  )
}

export default FormSample