import { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  FileSearchOutlined,
  SettingOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

import armorcodeImg from '../../assets/armorcode_logo.png';
import armorcodeImgCollapsed from '../../assets/armorcode_logo_collapsed.png';

const { Sider } = Layout;

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setSelectedKey(['1']);
    } else if (path.startsWith('/findings')) {
      setSelectedKey(['2']);
    } else if (path.startsWith('/settings')) {
      setSelectedKey(['3']);
    } else if (path.startsWith('/profile')) {
      setSelectedKey(['4']);
    } else {
      setSelectedKey([]);
    }
  }, [location]);

  const handleMenuClick = (e) => {
    if (e.key === '1') {
      navigate('/');
    } else if (e.key === '2') {
      navigate('/findings');
    } else if (e.key === '3') {
      navigate('/settings');
    } else if (e.key === '4') {
      navigate('/profile');
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{ background: '#001529' }}
    >
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          marginTop: 16,
        }}
      >
        <img
          src={collapsed ? armorcodeImgCollapsed : armorcodeImg}
          alt="Armorcode Logo"
          style={{ height: collapsed ? '50px' : '90px', width: collapsed ? '50px' : '180px' }}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKey}
        onClick={handleMenuClick}
        style={{ background: '#001529' }}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<FileSearchOutlined />}>
          Findings
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
        <Menu.Item key="4" icon={<ProfileOutlined />}>
          Profile
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidebar;
