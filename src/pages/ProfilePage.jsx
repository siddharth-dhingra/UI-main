// src/pages/ProfilePage.jsx
import { useContext } from 'react';
import { Layout, Descriptions, Typography } from 'antd';
import { UserContext } from '../context/UserContext';

const { Content } = Layout;
const { Title } = Typography;

function ProfilePage() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Content style={{ margin: '24px', background: '#fff', padding: '24px' }}>
      <Title level={3}>User Profile</Title>
      <Descriptions bordered column={1}>
        {/* <Descriptions.Item label="Profile Picture">
          <Avatar size={64} src={user.pictureUrl} alt={user.name} />
        </Descriptions.Item> */}
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        {/* <Descriptions.Item label="Default Tenant ID">{user.defaultTenantId}</Descriptions.Item> */}
        <Descriptions.Item label="Current Tenant">
          {user.selectedTenantId || user.defaultTenantId}
        </Descriptions.Item>
        <Descriptions.Item label="Role in Current Tenant">{user.role}</Descriptions.Item>
        <Descriptions.Item label="Associated Tenants">
          {user.associatedTenantPairs && user.associatedTenantPairs.map(pair => pair.name).join(', ')}
        </Descriptions.Item>
      </Descriptions>
    </Content>
  );
}

export default ProfilePage;
