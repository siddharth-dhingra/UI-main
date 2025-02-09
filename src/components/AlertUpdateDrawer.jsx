/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
// import { Drawer, Select, Button, Form, message } from 'antd';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { updateAlert } from '../api/findingsAPI'; // Your API helper for POST /alerts/update

// const { Option } = Select;

// function AlertUpdateDrawer({ visible, onClose, finding, onSuccess }) {
//   const [loading, setLoading] = useState(false);
//   const [newState, setNewState] = useState('');
//   const [reason, setReason] = useState('');
//   const [possibleStates, setPossibleStates] = useState([]);
//   const [possibleReasons, setPossibleReasons] = useState([]);

//   // When the drawer becomes visible and a finding is provided, fetch reference data
//   useEffect(() => {
//     async function fetchReferenceData() {
//       if (!finding?.toolType) return;
//       // Convert tool type to lowercase for endpoint URLs
//       const tool = finding.toolType.toLowerCase();
//       try {
//         // Fetch the possible states for this tool type
//         const statesRes = await axios.get(`http://localhost:8083/reference/${tool}/states`);
//         setPossibleStates(statesRes.data);
//         // For SecretScan, fetch resolutions; for others, fetch dismissed reasons
//         if (tool === 'secretscan') {
//           const reasonsRes = await axios.get(`http://localhost:8083/reference/${tool}/resolutions`);
//           setPossibleReasons(reasonsRes.data);
//         } else {
//           const reasonsRes = await axios.get(`http://localhost:8083/reference/${tool}/dismissedReasons`);
//           setPossibleReasons(reasonsRes.data);
//         }
//       } catch (error) {
//         console.error('Error fetching reference data:', error);
//       }
//     }
//     if (visible && finding) {
//       fetchReferenceData();
//       // Set the default new state from the current finding status (converted to uppercase)
//       setNewState(finding.status?.toUpperCase() || 'OPEN');
//       setReason('');
//     }
//   }, [visible, finding]);

//   // Determine if a reason is required based on the selected new state and tool type
//   const needsReason = () => {
//     if (!finding?.toolType) return false;
//     const tool = finding.toolType.toUpperCase();
//     if ((tool === 'CODESCAN' || tool === 'DEPENDABOT') && newState === 'DISMISSED') {
//       return true;
//     }
//     if (tool === 'SECRETSCAN' && newState === 'RESOLVED') {
//       return true;
//     }
//     return false;
//   };

//   // Helper to determine the alert number. Adjust if your finding stores it differently.
//   function parseAlertNumber(finding) {
//     const num = finding?.additionalData?.number;
//     return parseInt(num || finding.id || 0, 10);
//   }

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       // Build the request body using the fetched reference values
//       const requestBody = {
//         owner: finding.owner || 'siddharth-dhingra', // Use finding.owner if available
//         repo: finding.repo || 'juice-shop',          // Use finding.repo if available
//         toolType: finding.toolType,                    // e.g. "CODESCAN", "DEPENDABOT", "SECRETSCAN"
//         alertNumber: parseAlertNumber(finding),
//         newState: newState.toLowerCase(),              // e.g. "open", "dismissed", "resolved"
//         reason: reason,                                // The selected reason (if any)
//       };

//       await updateAlert(requestBody);
//       message.success('Alert update event published!');
//       onSuccess && onSuccess();
//       onClose();
//     } catch (err) {
//       console.error('Error updating alert:', err);
//       message.error('Failed to update alert status.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Drawer
//       title="Update Alert Status"
//       placement="right"
//       visible={visible}
//       width={400}
//       onClose={onClose}
//     >
//       <Form layout="vertical">
//         <Form.Item label="New State">
//           <Select
//             value={newState}
//             onChange={setNewState}
//             style={{ width: '100%' }}
//           >
//             {possibleStates.map((st) => (
//               <Option key={st} value={st.toUpperCase()}>
//                 {st}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         {needsReason() && (
//           <Form.Item label="Reason">
//             <Select
//               value={reason}
//               onChange={setReason}
//               style={{ width: '100%' }}
//               placeholder="Select reason"
//             >
//               {possibleReasons.map((r) => (
//                 <Option key={r} value={r.toLowerCase()}>
//                   {r}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//         )}

//         <Form.Item>
//           <Button type="primary" onClick={handleSubmit} loading={loading}>
//             Confirm
//           </Button>
//           <Button style={{ marginLeft: 8 }} onClick={onClose}>
//             Cancel
//           </Button>
//         </Form.Item>
//       </Form>
//     </Drawer>
//   );
// }

// export default AlertUpdateDrawer;

// src/components/AlertUpdateDrawer.jsx
import { Drawer, Select, Button, Form, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { updateAlert } from '../api/findingsAPI';

const { Option } = Select;

function AlertUpdateDrawer({ visible, onClose, finding, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [newState, setNewState] = useState('');
  const [reason, setReason] = useState('');
  const [possibleStates, setPossibleStates] = useState([]);
  const [possibleReasons, setPossibleReasons] = useState([]);

  // When the drawer becomes visible and a finding is provided, fetch reference data.
  useEffect(() => {
    async function fetchReferenceData() {
      if (!finding?.toolType) return;
      const tool = finding.toolType.toLowerCase();
      try {
        // Fetch possible states for this tool type.
        const statesRes = await axios.get(`http://localhost:8083/reference/${tool}/states`,{withCredentials: 'true',});
        setPossibleStates(statesRes.data);
        // For SecretScan, fetch resolutions; for others, fetch dismissed reasons.
        if (tool === 'secretscan') {
          const reasonsRes = await axios.get(`http://localhost:8083/reference/${tool}/resolutions`,{withCredentials: 'true',});
          setPossibleReasons(reasonsRes.data);
        } else {
          const reasonsRes = await axios.get(`http://localhost:8083/reference/${tool}/dismissedReasons`,{withCredentials: 'true',});
          setPossibleReasons(reasonsRes.data);
        }
      } catch (error) {
        console.error('Error fetching reference data:', error);
      }
    }
    if (visible && finding) {
      fetchReferenceData();
      // Set default newState based on the current status (in uppercase).
      setNewState(finding.status?.toUpperCase() || 'OPEN');
      setReason('');
    }
  }, [visible, finding]);

  // Determine if a reason is required based on the selected new state and tool type.
  const needsReason = () => {
    if (!finding?.toolType) return false;
    const tool = finding.toolType.toUpperCase();
    if ((tool === 'CODESCAN' || tool === 'DEPENDABOT') && newState === 'DISMISSED') {
      return true;
    }
    if (tool === 'SECRETSCAN' && newState === 'RESOLVED') {
      return true;
    }
    return false;
  };

  // Helper to extract the alert number from the finding.
  function parseAlertNumber(finding) {
    const num = finding?.additionalData?.number;
    return parseInt(num || finding.id || 0, 10);
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const requestBody = {
        owner: finding.owner || 'siddharth-dhingra', // Use finding.owner if available.
        repo: finding.repo || 'juice-shop',          // Use finding.repo if available.
        toolType: finding.toolType,                    // e.g. "CODESCAN", "DEPENDABOT", "SECRETSCAN".
        alertNumber: parseAlertNumber(finding),
        newState: newState.toLowerCase(),              // e.g. "open", "dismissed", "resolved".
        reason: reason,                                // The selected reason (if any).
      };

      await updateAlert(requestBody);
      message.success('Alert update event published!');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating alert:', err);
      message.error('Failed to update alert status.');
    } finally {
      setLoading(false);
    }
  };

  // Filter out the current state so it doesn't appear in the dropdown.
  const filteredStates = possibleStates.filter(
    (st) => st.toUpperCase() !== (finding?.status || '').toUpperCase()
  );

  return (
    <Drawer
      title="Update Alert Status"
      placement="right"
      visible={visible}
      width={400}
      onClose={onClose}
    >
      <Form layout="vertical">
        <Form.Item label="New State">
          <Select
            value={newState}
            onChange={setNewState}
            style={{ width: '100%' }}
          >
            {filteredStates.map((st) => (
              <Option key={st} value={st.toUpperCase()}>
                {st}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {needsReason() && (
          <Form.Item label="Reason">
            <Select
              value={reason}
              onChange={setReason}
              style={{ width: '100%' }}
              placeholder="Select reason"
            >
              {possibleReasons.map((r) => (
                <Option key={r} value={r.toLowerCase()}>
                  {r}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Confirm
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default AlertUpdateDrawer;
