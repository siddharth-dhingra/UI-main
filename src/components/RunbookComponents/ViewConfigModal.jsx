/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react';
import { Modal, Button, message } from 'antd';
import { EditOutlined, ThunderboltOutlined, FilterOutlined, SettingOutlined } from '@ant-design/icons';
import { getRunbookConfig } from '../../api/runbooksAPI';
import '../../styles/ViewConfigFlow.css';
import { UserContext } from '../../context/UserContext';

function ViewConfigModal({ visible, runbook, onClose }) {
  const [configData, setConfigData] = useState({
    trigger: '',
    filters: {},
    actions: {},
  });

  const { selectedTenantId } = useContext(UserContext);
  

  useEffect(() => {
    if (visible && runbook) {
      loadConfig();
    }
  }, [visible, runbook]);

  async function loadConfig() {
    try {
      const resp = await getRunbookConfig(runbook.runbookId, selectedTenantId);
      setConfigData(resp.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load runbook config');
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'right', marginTop: '25px' }}>
          <Button type="primary" icon={<EditOutlined />} onClick={onClose}>
            Edit Configuration
          </Button>
        </div>
      }
      title={runbook ? `View Configuration: ${runbook.name}` : 'View Configuration'}
      width={700}
    >
      <div className="view-config-flow-container">
        {/* Trigger Card */}
        <div className="flow-card" style={{ marginTop: "20px" }}>
          <div className="flow-card-header">
            <div className="flow-card-icon">
              <ThunderboltOutlined />
            </div>
            <h3>Trigger</h3>
          </div>
          <div className="flow-card-body">
            {configData.trigger ? (
              <p>Triggered by <strong>{configData.trigger}</strong>.</p>
            ) : (
              <p>No trigger is set.</p>
            )}
          </div>
        </div>

        {/* Connector */}
        <div className="flow-connector">
          <div className="flow-line" />
        </div>

        {/* Filters Card */}
        <div className="flow-card">
          <div className="flow-card-header">
            <div className="flow-card-icon">
              <FilterOutlined />
            </div>
            <h3>Filters</h3>
          </div>
          <div className="flow-card-body">
            <p><strong>State:</strong> {configData.filters?.state || <em>Any</em>}</p>
            <p><strong>Severity:</strong> {configData.filters?.severity || <em>Any</em>}</p>
          </div>
        </div>

        {/* Connector */}
        <div className="flow-connector">
          <div className="flow-line" />
        </div>

        {/* Actions Card */}
        <div className="flow-card">
          <div className="flow-card-header">
            <div className="flow-card-icon">
              <SettingOutlined />
            </div>
            <h3>Actions</h3>
          </div>
          <div className="flow-card-body">
            {configData.actions?.update_finding ? (
              <p>
                Update findings to <strong>{configData.actions.update_finding.to || '—'}</strong> state.
              </p>
            ) : (
              <p>No “Update Finding” action set.</p>
            )}
            <p>
              Create Ticket: {configData.actions?.create_ticket ? <strong>Yes</strong> : <strong>No</strong>}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ViewConfigModal;
