import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

function DashboardPage() {
  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Paragraph>Welcome to the Dashboard. Select Findings from the sidebar to view findings data.</Paragraph>
    </div>
  );
}

export default DashboardPage;
