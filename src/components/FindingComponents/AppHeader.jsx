// src/components/AppHeader.jsx
import { useState, useEffect, useContext } from 'react';
import { Layout, Button, message, Select, Dropdown, Avatar, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { fetchFilterData, initiateScan } from '../../api/findingsAPI';

const { Header } = Layout;
const { Option } = Select;

function AppHeader() {
  const { user, loading, logout, selectedTenantId, setSelectedTenantId } = useContext(UserContext);
  const [toolOptions, setToolOptions] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const navigate = useNavigate();

  const handleTenantChange = (value) => {
    setSelectedTenantId(value);
    message.info(`Switched to tenant: ${value}`);
  };

  // Load tool types on mount (used in the multi-select filter)
  useEffect(() => {
    const loadToolTypes = async () => {
      try {
        // fetchFilterData returns an object like: { toolTypes, severities, statuses }
        const { toolTypes } = await fetchFilterData();
        setToolOptions(toolTypes || []);
      } catch (error) {
        console.error('Error fetching tool types:', error);
        message.error('Failed to fetch tool types.');
      }
    };

    loadToolTypes();
  }, []);

  const handleToolChange = (value) => {
    setSelectedTools(value);
  };

  const handleScanClick = async () => {
    try {
      const respMsg = await initiateScan( selectedTenantId, selectedTools );
      message.success(respMsg || 'Scan event sent successfully.');
    } catch (error) {
      console.error('Error initiating scan:', error);
      message.error('Failed to initiate scan.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();  // logout method from UserContext should call your backend /logout endpoint.
      message.success("Logged out successfully.");
      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      console.error("Logout failed", error);
      message.error("Logout failed.");
    }
  };

  const profileMenu = (
    <Menu onClick={(e) => {
      if (e.key === 'profile') {
        navigate('/profile');
      } else if (e.key === 'logout') {
        handleLogout();
      }
    }}>
      <Menu.Item key="profile">View Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', padding: '0 24px' }}>
        Loading...
      </Header>
    );
  }

  return (
    <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', padding: '0 24px' }}>
      {user && (
        <>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            <span style={{ marginRight: 20, marginLeft: 20 }}>Switch View:</span>
            {user.associatedTenantPairs && user.associatedTenantPairs.length > 1 && (
              <Select
                style={{ width: 150, margin: '16px 15px', height: 32 }}
                value={selectedTenantId}
                onChange={handleTenantChange}
              >
                {user.associatedTenantPairs.map((pair) => (
                  <Option key={pair.id} value={pair.id}>
                    {pair.name}
                  </Option>
                ))}
              </Select>
            )}
          </div>

          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && (
              <>
                <Select
                  mode="multiple"
                  style={{ width: 200, marginRight: 16 }}
                  placeholder="Select tools"
                  value={selectedTools}
                  onChange={handleToolChange}
                >
                  {toolOptions.map((tool) => (
                    <Option key={tool} value={tool}>
                      {tool}
                    </Option>
                  ))}
                </Select>
                <Button type="primary" onClick={handleScanClick}>
                  Scan
                </Button>
              </>
            )}
            <Dropdown overlay={profileMenu} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar src={user.pictureUrl} alt={user.name} style={{marginRight:7}} />
                <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <span style={{ fontSize: '1em', fontWeight: 'bold' }}>{user.name}</span>
                  <span style={{ fontSize: '0.85em', color: '#888' }}>{user.role}</span>
                </div>
              </div>
            </Dropdown>
            {/* <Button type="default" onClick={handleLogout} style={{ marginLeft: 15, height: 32 }}>
              Logout
            </Button> 
          </div> */}
          {/* Center Section: Scan Controls (if role permits) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && (
          <>
            <Select
              mode="multiple"
              style={{ width: 200, marginRight: 16 }}
              placeholder="Select tools"
              value={selectedTools}
              onChange={handleToolChange}
            >
              {toolOptions.map((tool) => (
                <Option key={tool} value={tool}>
                  {tool}
                </Option>
              ))}
            </Select>
            <Button type="primary" onClick={handleScanClick}>
              Scan
            </Button>
          </>
        )}
      </div>

      {/* Right Section: Profile Dropdown */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Dropdown overlay={profileMenu} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar src={user.pictureUrl} alt={user.name} />
            <div style={{ marginLeft: 15, marginRight:20, display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontSize: '1em', fontWeight: 'bold' }}>{user.name}</span>
              <span style={{ fontSize: '0.85em', color: '#888' }}>{user.role}</span>
            </div>
          </div>
        </Dropdown>
      </div>
        </>
      )}
    </Header>
  );
}

export default AppHeader;
