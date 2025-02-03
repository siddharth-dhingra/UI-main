import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

function SettingsPage() {
  return (
    <div>
      <Title level={3}>Settings</Title>
      <Paragraph>Adjust your settings here.</Paragraph>
    </div>
  );
}

export default SettingsPage;
