import React from 'react';
import { Modal, Form, Input, TimePicker, Button, Space } from 'antd';
import { FaPlus, FaMinus } from 'react-icons/fa';

const { RangePicker } = TimePicker;

const DynamicModal = ({ open, onCancel, onOk, form, title, fields }) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values); // Pass form values after validation
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical">
        {fields.map((field) => {
          if (field.type === 'input') {
            return (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={field.rules}
              >
                <Input />
              </Form.Item>
            );
          }

          if (field.type === 'timePicker') {
            return (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={field.rules}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            );
          }

          if (field.type === 'rangePicker') {
            return (
              <Form.List key={field.name} name={field.name}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'range']}
                          fieldKey={[fieldKey, 'range']}
                          rules={field.rules}
                        >
                          <RangePicker format="HH:mm" />
                        </Form.Item>
                        <Button type="link" icon={<FaMinus />} onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<FaPlus />}>
                        Thêm Thời Gian Nghỉ Ngơi
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            );
          }

          return null;
        })}
      </Form>
    </Modal>
  );
};

export default DynamicModal;
