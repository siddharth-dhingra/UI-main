/* eslint-disable react/prop-types */
import { Modal, Form, Input, message } from 'antd';
import { createRunbookAPI } from '../../api/runbooksAPI';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function CreateRunbookModal({ visible, onClose, refreshList }) {
  const [form] = Form.useForm();
  const { selectedTenantId } = useContext(UserContext);

  const onFinish = async (values) => {
    try {
      await createRunbookAPI({
        name: values.name,
        description: values.description,
        tenantId: selectedTenantId,
      });
      message.success('Runbook created');
      form.resetFields();
      onClose();
      refreshList();
    } catch (err) {
      console.error(err);
      message.error('Failed to create runbook');
    }
  };

  return (
    <Modal
      open={visible}
      title="Create Runbook"
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Runbook Name"
          name="name"
          rules={[{ required: true, message: 'Runbook name is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Runbook description is required' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateRunbookModal;
