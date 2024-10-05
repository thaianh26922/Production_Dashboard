import React from 'react';
import { Modal, Form } from 'antd';

const DynamicModal = ({ open, onCancel, onOk, form, title, fields, onFinish }) => {
  return (
    <Modal
      title={title}
      visible={open}
      onCancel={onCancel}
      onOk={onOk} // Ensure onOk triggers form.submit
      okText="OK"
      cancelText="Hủy"
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
          >
            <input type={field.type === 'input' ? 'text' : field.type} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default DynamicModal;
