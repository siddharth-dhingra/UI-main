/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
import { Table, Tag, Button } from 'antd';
import { getColorForValue } from '../../utils/colorUtils';

function FindingsTable({ findings, onRowClick, onEditClick, canEdit }) {
  const baseColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (text) => {
        const truncated = text?.length > 5 ? text.slice(0, 5) + '...' : text;
        return <span>{truncated}</span>;
      },
      sorter: (a, b) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (val) => {
        const color = getColorForValue('severity', val);
        return (
          <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
            {val}
          </Tag>
        );
      },
      sorter: (a, b) => a.severity.localeCompare(b.severity),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (val) => {
        const color = getColorForValue('status', val);
        return (
          <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
            {val}
          </Tag>
        );
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Tool Type',
      dataIndex: 'toolType',
      key: 'toolType',
      width: 120,
      render: (val) => {
        const color = getColorForValue('toolType', val);
        return (
          <Tag style={{ backgroundColor: `${color}1A`, color, fontWeight: 'bold' }}>
            {val}
          </Tag>
        );
      },
      sorter: (a, b) => a.toolType.localeCompare(b.toolType),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => {
        const truncated = text?.length > 200 ? text.slice(0, 200) + '...' : text;
        return <span>{truncated}</span>;
      },
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
      sortDirections: ['ascend', 'descend'],
    },
  ];

  const actionColumn = {
    title: 'Action',
    key: 'action',
    width: 100,
    render: (record) => (
      <Button
        type="link"
        onClick={(e) => {
          e.stopPropagation(); // prevent row click
          onEditClick(record);
        }}
      >
        Edit
      </Button>
    ),
  };

  const columns = canEdit
    ? [...baseColumns, actionColumn]
    : baseColumns;


  return (
    <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
      <Table
        columns={columns}
        dataSource={findings}
        rowKey={(record) => record.id}
        pagination={false}
        // Original onRowClick
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        style={{ cursor: 'pointer' }}
        locale={{ emptyText: 'No entries found' }}
      />
    </div>
  );
}

export default FindingsTable;
