// src/components/AppHeader.jsx
import { useState, useEffect, useContext } from 'react';
import { Layout, Button, message, Select } from 'antd';
import { UserContext } from '../context/UserContext';
import { fetchFilterData, initiateScan } from '../api/findingsAPI';

const { Header } = Layout;
const { Option } = Select;

function AppHeader() {
  const { user, loading, logout } = useContext(UserContext);
  const [toolOptions, setToolOptions] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

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
      const respMsg = await initiateScan({ selectedTools });
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
          <span style={{ marginRight: 16, alignSelf: 'center' }}>
            Hello, {user.email}
          </span>
          {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && (
            <>
              <Select
                mode="multiple"
                style={{ width: 200, marginRight: 16, alignSelf: 'center' }}
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
              <Button type="primary" onClick={handleScanClick} style={{ margin: '16px 0' }}>
                Scan
              </Button>
            </>
          )}
          <>
            <Button type="default" onClick={handleLogout} style={{ margin: '16px 15px', height:32 }}>
              Logout
            </Button>
          </>
        </>
      )}
    </Header>
  );
}

export default AppHeader;
