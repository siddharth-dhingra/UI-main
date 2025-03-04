/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Row, Col, Statistic, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';


// Example usage inside your main component’s return:
function RenderRunbookHeader({
  totalRunbooks,
  totalEnabled,
  onCreateClick,
}) {
    const { user } = useContext(UserContext);
  return (
    <div
      style={{
        background: '#fff',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <h1 style={{ margin: 0 }}>Runbooks</h1>
        </Col>
        <Col>
          <Row gutter={16} align="middle">
            <Col>
              <Statistic
                title="Total Runbooks"
                value={totalRunbooks}
                valueStyle={{ fontSize: '1.2rem', fontWeight: 500, marginRight: 150 }}
              />
            </Col>
            <Col>
              <Statistic
                title="Total Enabled"
                value={totalEnabled}
                valueStyle={{ fontSize: '1.2rem', fontWeight: 500, marginRight: 150 }}
              />
            </Col>
            { (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN')  && (<Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreateClick}
              >
                New Runbook
              </Button>
            </Col>)}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default RenderRunbookHeader;
