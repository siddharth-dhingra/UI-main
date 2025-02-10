/* eslint-disable react/prop-types */
import { Row, Col, Card, Typography } from 'antd';

const { Title } = Typography;

function StatsCards({ totalAlerts, openAlerts, fixedAlerts, criticalAlerts }) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      <Col xs={24} md={6}>
        <Card
          title="Total Alerts"
          style={{ textAlign: 'center', background: '#fafafa' }}
          headStyle={{ background: '#fafafa' }}
        >
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {totalAlerts}
          </Title>
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card
          title="Open Alerts"
          style={{ textAlign: 'center', background: '#fafafa' }}
          headStyle={{ background: '#fafafa' }}
        >
          <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
            {openAlerts}
          </Title>
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card
          title="Fixed Alerts"
          style={{ textAlign: 'center', background: '#fafafa' }}
          headStyle={{ background: '#fafafa' }}
        >
          <Title level={4} style={{ margin: 0, color: '#faad14' }}>
            {fixedAlerts}
          </Title>
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card
          title="Critical Alerts"
          style={{ textAlign: 'center', background: '#fafafa' }}
          headStyle={{ background: '#fafafa' }}
        >
          <Title level={4} style={{ margin: 0, color: '#f5222d' }}>
            {criticalAlerts}
          </Title>
        </Card>
      </Col>
    </Row>
  );
}

export default StatsCards;
