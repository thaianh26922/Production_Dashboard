import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

Modal.setAppElement('#root');

const DynamicFormModal = ({ isOpen, onClose, onSave, formFields, contentLabel, initialData }) => {
  // Define validation schema
  const validationSchema = yup.object().shape(
    formFields.reduce((acc, field) => ({
      ...acc,
      [field.name]: (field.validation || yup.string().required(`${field.label} là bắt buộc`))
    }), {})
  );

  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  // Reset form with initial data when modal opens
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Handle form submission
  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={contentLabel}
      className="max-w-3xl mx-auto mt-26 p-6 bg-white rounded-md shadow-lg"
      overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{contentLabel}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Render form fields dynamically */}
        {formFields.map((field, index) => (
          <div key={index}>
            <label htmlFor={field.name} className="block text-gray-600 text-sm mb-2">{field.label}</label>
            <input
              type={field.type || 'text'}
              id={field.name}
              {...register(field.name)}
              className={`border w-full p-2 rounded-md focus:outline-none focus:ring-2 ${errors[field.name] ? 'border-red-500' : 'focus:ring-blue-400'}`}
              placeholder={field.placeholder || ''}
            />
            {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>}
          </div>
        ))}

        {/* Action buttons */}
        <div className="col-span-full flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DynamicFormModal;
