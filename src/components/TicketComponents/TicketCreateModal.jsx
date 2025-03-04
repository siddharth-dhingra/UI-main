/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createTicket } from '../../api/ticketsAPI';
import { UserContext } from '../../context/UserContext';

function TicketCreateModal({ visible, onClose }) {
  const [form] = Form.useForm();
  const { selectedTenantId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Prefill the form fields from query parameters
  useEffect(() => {
    const summary = searchParams.get('summary') || '';
    const description = searchParams.get('description') || '';
    const truncatedDescription = description.length > 200 ? description.substring(0, 200) : description;
    form.setFieldsValue({ summary, description: truncatedDescription });
  }, [form, searchParams]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const findingId = searchParams.get('findingId');
      if (!findingId) {
        message.error('Missing finding ID.');
        return;
      }
      setLoading(true);
      await createTicket(selectedTenantId, findingId, values.summary, values.description);
      message.success('Ticket created successfully.');
      onClose();
      // Remove mode query param so modal no longer appears
      searchParams.delete('mode');
      setSearchParams(searchParams);
      navigate('/tickets');
    } catch (err) {
      console.error(err);
      message.error('Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Ticket"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="create" type="primary" loading={loading} onClick={handleCreate}>
          Create
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Summary"
          name="summary"
          rules={[{ required: true, message: 'Please enter a summary' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TicketCreateModal;
