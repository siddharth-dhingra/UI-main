/* eslint-disable react/prop-types */
import { Table, Switch, Button, Popconfirm, Tag, Row, Pagination, Card, message } from 'antd';
import { DeleteOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';
import { updateRunbookEnabledStatus, deleteRunbook } from '../../api/runbooksAPI';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

function RunbooksList({ runbooks, loading, refreshList, onConfigure, onViewConfig }) {
  const { selectedTenantId, user } = useContext(UserContext);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 850,
      render: (val, record) => (
        <div>
          <strong>{val}</strong>
          <div style={{ fontSize: '1em', color: '#888' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      width: 150,
      render: (val, record) => (
        <Switch checked={val} onChange={(checked) => toggleEnabled(record, checked)} />
      ),
    },
    {
      title: 'Trigger',
      dataIndex: 'trigger',
      width: 200,
      render: (val) =>
        val ? <Tag color="blue">{val}</Tag> : <Tag color="default">Not Set</Tag>,
    },
    {
      title: 'Actions',
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '30px' }}>
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
            <Button
              type="default"
              icon={<SettingOutlined />}
              style={{ borderColor: '#1890ff', color: '#1890ff' }}
              onClick={() => onConfigure(record)}
            >
              Configure
            </Button>
          )}
          <Button
            type="dashed"
            icon={<EyeOutlined />}
            style={{ borderColor: 'black', color: 'black' }}
            onClick={() => onViewConfig(record)}
          >
            View Config
          </Button>
          {user?.role === 'SUPER_ADMIN' && (
            <Popconfirm
              title={
                <div style={{ textAlign: 'center' }}>
                  <DeleteOutlined style={{ color: 'red', fontSize: 20, marginBottom: 8 }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>Are you sure you want to delete this runbook?</p>
                </div>
              }
              onConfirm={() => handleDelete(record.runbookId)}
              okText="Yes, Delete"
              cancelText="No, Cancel"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                style={{ borderColor: 'red', color: 'red' }}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const toggleEnabled = async (record, checked) => {
    try {
      await updateRunbookEnabledStatus(record.runbookId, checked, selectedTenantId);
      message.success(`Runbook ${checked ? 'enabled' : 'disabled'}`);
      refreshList();
    } catch (err) {
      console.error(err);
      message.error('Failed to update runbook');
    }
  };

  const handleDelete = async (runbookId) => {
    try {
      await deleteRunbook(runbookId, selectedTenantId);
      message.success('Runbook deleted');
      refreshList();
    } catch (err) {
      console.error(err);
      message.error('Failed to delete runbook');
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        background: 'white',
        padding: '16px',
      }}
    >
      <Table
        dataSource={runbooks}
        columns={columns}
        loading={loading}
        rowKey="runbookId"
        pagination={false}
        style={{ background: 'white' }}
      />
      <Row justify="center" style={{ marginTop: 16 }}>
        <Pagination current={1} pageSize={10} total={runbooks.length} onChange={() => {}} />
        {/* If pagination is required, you can implement it here */}
      </Row>
    </Card>
  );
}

export default RunbooksList;
