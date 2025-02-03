import { useState, useEffect } from 'react';
import { Layout, Button, message, Select } from 'antd';

import { fetchFilterData, initiateScan } from '../api/findingsAPI'; // Adjust path to your 'findingsAPI.js'

const { Header } = Layout;
const { Option } = Select;

function AppHeader() {
  // State to store fetched tool types
  const [toolOptions, setToolOptions] = useState([]);
  // State for user-selected tools
  const [selectedTools, setSelectedTools] = useState([]);

  // Load tool types on mount
  useEffect(() => {
    const loadToolTypes = async () => {
      try {
        // fetchFilterData returns { toolTypes, severities, statuses }
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
        const respMsg = await initiateScan({selectedTools});
        message.success(respMsg || 'Scan event sent successfully.');
    } catch (error) {
        console.error('Error initiating scan:', error);
        message.error('Failed to initiate scan.');
    }
  };

  return (
    <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', padding: '0 24px' }}>
      {/* Multi-select for tool types fetched from the server */}
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

      {/* Scan button */}
      <Button type="primary" onClick={handleScanClick} style={{ margin: '16px 0' }}>
        Scan
      </Button>
    </Header>
  );
}

export default AppHeader;
