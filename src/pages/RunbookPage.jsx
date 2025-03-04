// import { useEffect, useState, useContext } from 'react';
// import {
//   Layout,
//   Button,
//   Table,
//   Modal,
//   Form,
//   Input,
//   message,
//   Switch,
//   Tag,
//   Steps,
//   Select,
//   Popconfirm,
//   Space,
//   Tooltip
// } from 'antd';
// import {
//   DeleteOutlined,
//   ThunderboltOutlined,
//   FilterOutlined,
//   SettingOutlined,
//   EditOutlined,
//   EyeOutlined
// } from '@ant-design/icons'; 
// import { UserContext } from '../context/UserContext';
// import {
//   fetchRunbooksList,
//   createRunbookAPI,
//   updateRunbookEnabledStatus,
//   getRunbookConfig,
//   configureRunbookTrigger,
//   configureRunbookFilters,
//   configureRunbookActions,
//   getAvailableTriggers,
//   getPossibleFilters,
//   getPossibleActions,
//   deleteRunbook
// } from '../api/runbooksAPI';
// import '../styles/ViewConfigFlow.css';
// import RenderRunbookHeader from '../components/RunbookComponents/RunbookHeader';

// const { Content } = Layout;
// const { Step } = Steps;

// function RunbooksPage() {
//   const { selectedTenantId } = useContext(UserContext);

//   // List of runbooks
//   const [runbooks, setRunbooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalRunbooks, setTotalRunbooks] = useState(0);
//   const [totalEnabled, setTotalEnabled] = useState(0);

//   // CREATE RUNBOOK MODAL
//   const [createModalVisible, setCreateModalVisible] = useState(false);
//   const [createForm] = Form.useForm();

//   // CONFIGURE MODAL (multi-step)
//   const [configureModalVisible, setConfigureModalVisible] = useState(false);
//   const [configureRunbook, setConfigureRunbook] = useState(null); // The runbook being edited
//   const [currentStep, setCurrentStep] = useState(0);

//   // This tracks if the runbook has no trigger => user must do steps in order
//   const [isCompletelyNew, setIsCompletelyNew] = useState(false);

//   // Data from server for possible triggers, filters, actions
//   const [availableTriggers, setAvailableTriggers] = useState([]);
//   const [possibleFilterData, setPossibleFilterData] = useState({});
//   const [possibleActions, setPossibleActions] = useState({});

//   // Local states for storing the runbook’s config
//   const [triggerVal, setTriggerVal] = useState('');
//   const [stateFilter, setStateFilter] = useState('');
//   const [severityFilter, setSeverityFilter] = useState('');
//   const [actionFrom, setActionFrom] = useState('');
//   const [actionTo, setActionTo] = useState('');
//   const [createTicket, setCreateTicket] = useState(false);

//   // NEW: View Configuration
//   const [viewConfigModalVisible, setViewConfigModalVisible] = useState(false);
//   const [selectedRunbook, setSelectedRunbook] = useState(null);
//   const [viewConfigData, setViewConfigData] = useState({
//     trigger: '',
//     filters: {},
//     actions: {},
//   });

//   const { user } = useContext(UserContext);

//   // Steps definition
//   const steps = [
//     { title: 'Trigger' },
//     { title: 'Filters' },
//     { title: 'Actions' },
//   ];

//   useEffect(() => {
//     setRunbooks([]); 
//     loadRunbooksList();
//     loadAuxData();
//   }, [selectedTenantId]);

//   function loadRunbooksList() {
//     setLoading(true);
//     fetchRunbooksList(selectedTenantId)
//       .then((resp) => {
//         const data = Array.isArray(resp.data) ? resp.data : [];
//         setRunbooks(data);
//         setTotalRunbooks(data.length);
//         setTotalEnabled(data.filter((r) => r.enabled).length);
//       })
//       .catch((err) => {
//         console.error(err);
//         // message.error('Failed to load runbooks.');
//       })
//       .finally(() => setLoading(false));
//   }

//   function loadAuxData() {
//     // Fetch triggers
//     getAvailableTriggers(selectedTenantId)
//       .then((resp) => {
//         const t = resp.data.trigger;
//         const triggers = Array.isArray(t) ? t : t ? [t] : [];
//         setAvailableTriggers(triggers);
//       })
//       .catch((err) => console.error(err));

//     // Fetch possible filters
//     getPossibleFilters(selectedTenantId)
//       .then((resp) => setPossibleFilterData(resp.data))
//       .catch((err) => console.error(err));

//     // Fetch possible actions
//     getPossibleActions(selectedTenantId)
//       .then((resp) => setPossibleActions(resp.data))
//       .catch((err) => console.error(err));
//   }

//   // CREATE RUNBOOK
//   const openCreateModal = () => {
//     createForm.resetFields();
//     setCreateModalVisible(true);
//   };
//   const closeCreateModal = () => {
//     setCreateModalVisible(false);
//   };
//   const onCreateRunbookFinish = async (values) => {
//     try {
//       await createRunbookAPI({
//         name: values.name,
//         description: values.description,
//         tenantId: selectedTenantId,
//       });
//       message.success('Runbook created');
//       closeCreateModal();
//       loadRunbooksList();
//     } catch (err) {
//       console.error(err);
//       message.error('Failed to create runbook');
//     }
//   };

//   // ENABLE/DISABLE
//   const toggleRunbookEnabled = async (record, checked) => {
//     try {
//       await updateRunbookEnabledStatus(record.runbookId, checked, selectedTenantId);
//       message.success(`Runbook ${checked ? 'enabled' : 'disabled'}`);
//       loadRunbooksList();
//     } catch (err) {
//       console.error(err);
//       message.error('Failed to update runbook');
//     }
//   };

//   // OPEN CONFIGURE MODAL
//   const openConfigureModal = async (rb) => {
//     setConfigureRunbook(rb);
//     setCurrentStep(0);

//     try {
//       const resp = await getRunbookConfig(rb.runbookId, selectedTenantId);
//       const { trigger, filters, actions } = resp.data;

//       // If there's no trigger => user must do steps in order
//       const noTrigger = !trigger || trigger.trim() === '';
//       setIsCompletelyNew(noTrigger);

//       setTriggerVal(trigger || '');
//       setStateFilter(filters?.state || '');
//       setSeverityFilter(filters?.severity || '');

//       const updateFinding = actions?.update_finding;
//       setActionFrom(updateFinding?.from || '');
//       setActionTo(updateFinding?.to || '');
//       setCreateTicket(!!actions?.create_ticket);

//       setConfigureModalVisible(true);
//     } catch (err) {
//       console.error(err);
//       message.error('Failed to load runbook config');
//     }
//   };

//   // VIEW CONFIGURATION MODAL
//   const openViewConfigModal = async (rb) => {
//     try {
//       const resp = await getRunbookConfig(rb.runbookId, selectedTenantId);
//       setViewConfigData(resp.data); // shape: { trigger, filters, actions }
//       setSelectedRunbook(rb);
//       setViewConfigModalVisible(true);
//     } catch (err) {
//       console.error(err);
//       message.error('Failed to load runbook config');
//     }
//   };

//   const closeViewConfigModal = () => {
//     setViewConfigModalVisible(false);
//     setSelectedRunbook(null);
//     setViewConfigData({ trigger: '', filters: {}, actions: {} });
//   };

//   async function onDeleteRunbook(runbookId) {
//     try {
//       await deleteRunbook(runbookId, selectedTenantId);
//       message.success('Runbook deleted');
//       loadRunbooksList(); // refresh the table
//     } catch (err) {
//       console.error(err);
//       message.error('Failed to delete runbook');
//     }
//   }

//   const closeConfigureModal = () => {
//     setConfigureModalVisible(false);
//     setConfigureRunbook(null);
//   };

//   // STEP NAV HANDLER (when user clicks step header)
//   function handleStepChange(nextStep) {
//     // If user tries to go beyond step 0 but we have no trigger => block
//     if (isCompletelyNew && nextStep > 0) {
//       message.error('Please set the trigger first.');
//       return;
//     }
//     setCurrentStep(nextStep);
//   }

//   // STEP “Next” and “Prev” Buttons
//   async function onNext() {
//     if (currentStep === 0) {
//       // Validate trigger
//       try {
//         await saveTrigger();
//         // Once saved, we set isCompletelyNew=false => user can jump around
//         setIsCompletelyNew(false);
//         setCurrentStep(1);
//       } catch (err) {
//         // handled in saveTrigger
//       }
//     } else if (currentStep === 1) {
//       try {
//         await saveFilters();
//         setCurrentStep(2);
//       } catch (err) {
//         // handled in saveFilters
//       }
//     } else {
//       // Step 2 => actions
//       try {
//         await saveActions();
//         message.success('Configuration saved');
//         closeConfigureModal();
//       } catch (err) {
//         // handled in saveActions
//       }
//     }
//   }

//   function onPrev() {
//     setCurrentStep((prev) => prev - 1);
//   }

//   // SAVE TRIGGER
//   async function saveTrigger() {
//     if (!triggerVal || triggerVal.trim() === '') {
//       message.error("Trigger can't be empty.");
//       throw new Error("Trigger can't be empty");
//     }
//     await configureRunbookTrigger(configureRunbook.runbookId, triggerVal, selectedTenantId);
//     message.success('Trigger saved');
//   }

//   // SAVE FILTERS
//   async function saveFilters() {
//     const payload = {
//       state: stateFilter,
//       severity: severityFilter,
//     };
//     await configureRunbookFilters(configureRunbook.runbookId, payload, selectedTenantId);
//     message.success('Filters saved');
//   }

//   // SAVE ACTIONS
//   async function saveActions() {
//     const update_finding =
//       actionFrom || actionTo ? { from: actionFrom, to: actionTo } : null;
//     const actions = {
//       update_finding,
//       create_ticket: createTicket,
//     };
//     await configureRunbookActions(configureRunbook.runbookId, actions, selectedTenantId);
//     message.success('Actions saved');
//   }

//   console.log(user.role)

//   // TABLE
//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       width: 850,
//       render: (val, record) => (
//         <div>
//           <strong>{val}</strong>
//           <div style={{ fontSize: '1.00em', color: '#888' }}>{record.description}</div>
//         </div>
//       ),
//     },
//     {
//       title: 'Enabled',
//       dataIndex: 'enabled',
//       width: 150,
//       render: (val, record) => (
//         <Switch checked={val} onChange={(checked) => toggleRunbookEnabled(record, checked)} />
//       ),
//     },
//     {
//       title: 'Trigger',
//       dataIndex: 'trigger',
//       width: 200,
//       render: (val) =>
//         val ? <Tag color="blue">{val}</Tag> : <Tag color="default">Not Set</Tag>,
//     },
//     {
//       title: 'Actions',
//       width: 300,
//       render: (_, record) => (
//         <div style={{ display: 'flex', gap: '30px' }}>
//           {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (<Button
//             type="default"
//             icon={<SettingOutlined />}
//             style={{ borderColor: '#1890ff', color: '#1890ff' }}
//             onClick={() => openConfigureModal(record)}
//           >
//             Configure
//           </Button>)}
//           <Button
//             type="dashed"
//             icon={<EyeOutlined />}
//             style={{ borderColor: 'black', color: 'black' }}
//             onClick={() => openViewConfigModal(record)}
//           >
//             View Config
//           </Button>
//           <Popconfirm
//             classNames={{ root: 'centered-popconfirm' }}
//             title={
//               <div style={{ textAlign: 'center' }}>
//                 <DeleteOutlined style={{ color: 'red', fontSize: 20, marginBottom: 8 }} />
//                 <p style={{ margin: 0, fontWeight: 500 }}>
//                   Are you sure you want to delete this runbook?
//                 </p>
//               </div>
//             }
//             onConfirm={() => onDeleteRunbook(record.runbookId)}
//             okText="Yes, Delete"
//             cancelText="No, Cancel"
//             okButtonProps={{ danger: true }}
//             placement="topRight"
//           >
//             {(user?.role === 'SUPER_ADMIN') && (<Button
//               type="default"
//               danger
//               icon={<DeleteOutlined />}
//               style={{ borderColor: 'red', color: 'red' }}
//             >
//               Delete
//             </Button>)}
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Layout style={{ height: '100%', background: '#fff' }}>
//       <RenderRunbookHeader
//         totalRunbooks={totalRunbooks}
//         totalEnabled={totalEnabled}
//         onImportClick={() => {
//           /* handle import logic */
//         }}
//         onCreateClick={openCreateModal}
//       />

//       <Content style={{ padding: '16px' }}>
//         <Table
//           dataSource={runbooks}
//           columns={columns}
//           loading={loading}
//           rowKey={(item) => item.runbookId}
//           pagination={false}
//           style={{ background: '#fff' }}
//         />
//       </Content>

//       {/* CREATE RUNBOOK MODAL */}
//       <Modal
//         open={createModalVisible}
//         title="Create Runbook"
//         onCancel={closeCreateModal}
//         onOk={() => createForm.submit()}
//       >
//         <Form form={createForm} layout="vertical" onFinish={onCreateRunbookFinish}>
//           <Form.Item
//             label="Runbook Name"
//             name="name"
//             rules={[{ required: true, message: 'Runbook name is required' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Runbook description is required' }]}>
//             <Input.TextArea rows={3} />
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* CONFIGURE RUNBOOK MODAL with STEPS */}
//       <Modal
//         open={configureModalVisible}
//         title={
//           configureRunbook ? `Configure: ${configureRunbook.name}` : 'Configure Runbook'
//         }
//         onCancel={closeConfigureModal}
//         footer={null}
//         width={500}
//       >
//         <Steps current={currentStep} onChange={handleStepChange} style={{ marginBottom: 24 }}>
//           <Step title="Trigger" />
//           <Step title="Filters" disabled={isCompletelyNew} />
//           <Step title="Actions" disabled={isCompletelyNew} />
//         </Steps>

//         {/* Step 0: Trigger */}
//         {currentStep === 0 && (
//           <div style={{ marginTop: 24 }}>
//             <h3>1. Select Trigger</h3>
//             <Select
//               style={{ width: '100%' }}
//               placeholder="Select a trigger"
//               value={triggerVal || undefined}
//               onChange={(val) => setTriggerVal(val)}
//             >
//               {availableTriggers.map((tg) => (
//                 <Select.Option key={tg} value={tg}>
//                   {tg}
//                 </Select.Option>
//               ))}
//             </Select>
//             <div style={{ marginTop: 24, textAlign: 'right' }}>
//               <Button type="primary" onClick={onNext}>
//                 Save & Next
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Step 1: Filters */}
//         {currentStep === 1 && (
//           <div style={{ marginTop: 24 }}>
//             <h3>2. Filters</h3>
//             <div style={{ marginBottom: 16 }}>
//               <label style={{ display: 'block' }}>State Filter:</label>
//               <Select
//                 style={{ width: '100%' }}
//                 placeholder="Select state"
//                 value={stateFilter || undefined}
//                 onChange={(val) => setStateFilter(val)}
//               >
//                 <Select.Option value=""><em>Any</em></Select.Option>
//                 {(possibleFilterData.states || []).map((st) => (
//                   <Select.Option key={st} value={st}>
//                     {st}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </div>
//             <div style={{ marginBottom: 16 }}>
//               <label style={{ display: 'block' }}>Severity Filter:</label>
//               <Select
//                 style={{ width: '100%' }}
//                 placeholder="Select severity"
//                 value={severityFilter || undefined}
//                 onChange={(val) => setSeverityFilter(val)}
//               >
//                 <Select.Option value=""><em>Any</em></Select.Option>
//                 {(possibleFilterData.severities || []).map((sv) => (
//                   <Select.Option key={sv} value={sv}>
//                     {sv}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </div>
//             <div style={{ textAlign: 'right' }}>
//               <Button style={{ marginRight: 8 }} onClick={onPrev}>
//                 Back
//               </Button>
//               <Button type="primary" onClick={onNext}>
//                 Save & Next
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Step 2: Actions */}
//         {currentStep === 2 && (
//           <div style={{ marginTop: 24 }}>
//             <h3>3. Actions</h3>
//             <div style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
//               <strong>Update Finding (Optional):</strong>
//               <div style={{ marginTop: 8 }}>
//                 <label style={{ display: 'block' }}>To State:</label>
//                 <Select
//                   style={{ width: '100%', marginBottom: 8 }}
//                   value={actionTo || undefined}
//                   onChange={(val) => setActionTo(val)}
//                 >
//                   <Select.Option value="">(none)</Select.Option>
//                   {(possibleActions.updateFindingStates || []).map((st) => (
//                     <Select.Option key={st} value={st}>
//                       {st}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </div>
//             </div>
//             <div style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
//               <strong>Create Ticket:</strong>
//               <div style={{ marginTop: 8 }}>
//                 <Switch
//                   checked={createTicket}
//                   onChange={(checked) => setCreateTicket(checked)}
//                 />
//               </div>
//             </div>

//             <div style={{ textAlign: 'right' }}>
//               <Button style={{ marginRight: 8 }} onClick={onPrev}>
//                 Back
//               </Button>
//               <Button type="primary" onClick={onNext}>
//                 Save & Finish
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* VIEW CONFIGURATION MODAL (vertical flow) */}
//       <Modal
//   open={viewConfigModalVisible}
//   onCancel={closeViewConfigModal}
//   footer={
//     <div style={{ textAlign: 'right', marginTop: "25px" }}>
//       <Button
//         type="primary"
//         icon={<EditOutlined />}
//         onClick={() => {
//           openConfigureModal(selectedRunbook);
//           closeViewConfigModal();
//         }}
//       >
//         Edit Configuration
//       </Button>
//     </div>
//   }
//   title={selectedRunbook ? `View Configuration: ${selectedRunbook.name}` : 'View Configuration'}
//   width={700}
//   styles={{ body: { backgroundColor: 'transparent', padding: 0, boxShadow: 'none' } }}
// >
//   <div className="view-config-flow-container">
//     {/* Trigger Card */}
//     <div className="flow-card" style={{marginTop:"20px"}}>
//       <div className="flow-card-header">
//         <div className="flow-card-icon">
//           <ThunderboltOutlined />
//         </div>
//         <h3>Trigger</h3>
//       </div>
//       <div className="flow-card-body">
//         {viewConfigData.trigger ? (
//           <p>Triggered by <strong>{viewConfigData.trigger}</strong>.</p>
//         ) : (
//           <p>No trigger is set.</p>
//         )}
//       </div>
//     </div>

//     {/* Connector */}
//     <div className="flow-connector">
//       <div className="flow-line" />
//     </div>

//     {/* Filters Card */}
//     <div className="flow-card">
//       <div className="flow-card-header">
//         <div className="flow-card-icon">
//           <FilterOutlined />
//         </div>
//         <h3>Filters</h3>
//       </div>
//       <div className="flow-card-body">
//         <p><strong>State:</strong> {viewConfigData.filters?.state || <em>Any</em>}</p>
//         <p><strong>Severity:</strong> {viewConfigData.filters?.severity || <em>Any</em>}</p>
//       </div>
//     </div>

//     {/* Connector */}
//     <div className="flow-connector">
//       <div className="flow-line" />
//     </div>

//     {/* Actions Card */}
//     <div className="flow-card">
//       <div className="flow-card-header">
//         <div className="flow-card-icon">
//           <SettingOutlined />
//         </div>
//         <h3>Actions</h3>
//       </div>
//       <div className="flow-card-body">
//         {viewConfigData.actions?.update_finding ? (
//           <p>
//             Update findings to <strong>{viewConfigData.actions.update_finding.to || '—'}</strong> state.
//           </p>
//         ) : (
//           <p>No “Update Finding” action set.</p>
//         )}
//         <p>
//           Create Ticket: {viewConfigData.actions?.create_ticket ? <strong>Yes</strong> : <strong>No</strong>}
//         </p>
//       </div>
//     </div>
//   </div>
// </Modal>


//     </Layout>
//   );
// }

// export default RunbooksPage;

// import { useEffect, useState, useContext } from 'react';
// import { Layout, message } from 'antd';
// import { UserContext } from '../context/UserContext';
// import RenderRunbookHeader from '../components/RunbookComponents/RunbookHeader';
// import RunbooksList from '../components/RunbookComponents/RunbooksList';
// import CreateRunbookModal from '../components/RunbookComponents/CreateRunbookModal';
// import ConfigureRunbookModal from '../components/RunbookComponents/ConigureRunbookModal';
// import ViewConfigModal from '../components/RunbookComponents/ViewConfigModal';
// import { fetchRunbooksList } from '../api/runbooksAPI';

// const { Content } = Layout;

// function RunbooksPage() {
//   const { selectedTenantId } = useContext(UserContext);
//   const [runbooks, setRunbooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalRunbooks, setTotalRunbooks] = useState(0);
//   const [totalEnabled, setTotalEnabled] = useState(0);

//   // Modal states and selected runbook for modals
//   const [createModalVisible, setCreateModalVisible] = useState(false);
//   const [configureModalVisible, setConfigureModalVisible] = useState(false);
//   const [viewConfigModalVisible, setViewConfigModalVisible] = useState(false);
//   const [selectedRunbook, setSelectedRunbook] = useState(null);

//   const loadRunbooksList = () => {
//     setLoading(true);
//     fetchRunbooksList(selectedTenantId)
//       .then((resp) => {
//         const data = Array.isArray(resp.data) ? resp.data : [];
//         setRunbooks(data);
//         setTotalRunbooks(data.length);
//         setTotalEnabled(data.filter((r) => r.enabled).length);
//       })
//       .catch((err) => {
//         console.error(err);
//         message.error('Failed to load runbooks.');
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     if (selectedTenantId) {
//       loadRunbooksList();
//     }
//   }, [selectedTenantId]);

//   return (
//     <Layout style={{ height: '100%', background: '#fff' }}>
//       <RenderRunbookHeader
//         totalRunbooks={totalRunbooks}
//         totalEnabled={totalEnabled}
//         onCreateClick={() => setCreateModalVisible(true)}
//       />
//       <Content style={{ padding: '16px', background: '#f0f2f5', minHeight: '10vh' }}>
//         <RunbooksList
//           runbooks={runbooks}
//           loading={loading}
//           refreshList={loadRunbooksList}
//           onConfigure={(rb) => {
//             setSelectedRunbook(rb);
//             setConfigureModalVisible(true);
//           }}
//           onViewConfig={(rb) => {
//             setSelectedRunbook(rb);
//             setViewConfigModalVisible(true);
//           }}
//         />
//       </Content>
//       <CreateRunbookModal
//         visible={createModalVisible}
//         onClose={() => setCreateModalVisible(false)}
//         refreshList={loadRunbooksList}
//       />
//       <ConfigureRunbookModal
//         visible={configureModalVisible}
//         runbook={selectedRunbook}
//         onClose={() => setConfigureModalVisible(false)}
//         refreshList={loadRunbooksList}
//       />
//       <ViewConfigModal
//         visible={viewConfigModalVisible}
//         runbook={selectedRunbook}
//         onClose={() => setViewConfigModalVisible(false)}
//       />
//     </Layout>
//   );
// }

// export default RunbooksPage;

import { useEffect, useState, useContext } from 'react';
import { Layout, Button, Table, Modal, Form, Input, message, Switch, Tag, Steps, Select, Popconfirm, Space, Card } from 'antd';
import { DeleteOutlined, ThunderboltOutlined, FilterOutlined, SettingOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { UserContext } from '../context/UserContext';
import {
  fetchRunbooksList,
  createRunbookAPI,
  updateRunbookEnabledStatus,
  getRunbookConfig,
  configureRunbookTrigger,
  configureRunbookFilters,
  configureRunbookActions,
  getAvailableTriggers,
  getPossibleFilters,
  getPossibleActions,
  deleteRunbook
} from '../api/runbooksAPI';
import '../styles/ViewConfigFlow.css';
import RenderRunbookHeader from '../components/RunbookComponents/RunbookHeader';

const { Content } = Layout;
const { Step } = Steps;
const { Option } = Select;

function RunbooksPage() {
  const { selectedTenantId } = useContext(UserContext);

  // List of runbooks
  const [runbooks, setRunbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRunbooks, setTotalRunbooks] = useState(0);
  const [totalEnabled, setTotalEnabled] = useState(0);

  // CREATE RUNBOOK MODAL
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  // CONFIGURE MODAL (multi-step)
  const [configureModalVisible, setConfigureModalVisible] = useState(false);
  const [configureRunbook, setConfigureRunbook] = useState(null); // runbook being edited
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompletelyNew, setIsCompletelyNew] = useState(false);

  // Data for triggers, filters, actions
  const [availableTriggers, setAvailableTriggers] = useState([]);
  const [possibleFilterData, setPossibleFilterData] = useState({});
  const [possibleActions, setPossibleActions] = useState({});

  // Local states for storing runbook config
  const [triggerVal, setTriggerVal] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [actionFrom, setActionFrom] = useState('');
  const [actionTo, setActionTo] = useState('');
  const [createTicket, setCreateTicket] = useState(false);

  // VIEW CONFIGURATION MODAL
  const [viewConfigModalVisible, setViewConfigModalVisible] = useState(false);
  const [selectedRunbook, setSelectedRunbook] = useState(null);
  const [viewConfigData, setViewConfigData] = useState({ trigger: '', filters: {}, actions: {} });

  const { user } = useContext(UserContext);

  // Steps for configuration
  const steps = [
    { title: 'Trigger' },
    { title: 'Filters' },
    { title: 'Actions' },
  ];

  useEffect(() => {
    loadRunbooksList();
    loadAuxData();
  }, [selectedTenantId]);

  function loadRunbooksList() {
    setLoading(true);
    fetchRunbooksList(selectedTenantId)
      .then((resp) => {
        const data = Array.isArray(resp.data) ? resp.data : [];
        setRunbooks(data);
        setTotalRunbooks(data.length);
        setTotalEnabled(data.filter((r) => r.enabled).length);
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load runbooks.');
      })
      .finally(() => setLoading(false));
  }

  function loadAuxData() {
    getAvailableTriggers(selectedTenantId)
      .then((resp) => {
        const t = resp.data.trigger;
        const triggers = Array.isArray(t) ? t : t ? [t] : [];
        setAvailableTriggers(triggers);
      })
      .catch((err) => console.error(err));

    getPossibleFilters(selectedTenantId)
      .then((resp) => setPossibleFilterData(resp.data))
      .catch((err) => console.error(err));

    getPossibleActions(selectedTenantId)
      .then((resp) => setPossibleActions(resp.data))
      .catch((err) => console.error(err));
  }

  // CREATE RUNBOOK HANDLERS
  const openCreateModal = () => {
    createForm.resetFields();
    setCreateModalVisible(true);
  };
  const closeCreateModal = () => {
    setCreateModalVisible(false);
  };
  const onCreateRunbookFinish = async (values) => {
    try {
      await createRunbookAPI({
        name: values.name,
        description: values.description,
        tenantId: selectedTenantId,
      });
      message.success('Runbook created');
      closeCreateModal();
      loadRunbooksList();
    } catch (err) {
      console.error(err);
      message.error('Failed to create runbook');
    }
  };

  // ENABLE/DISABLE HANDLER
  const toggleRunbookEnabled = async (record, checked) => {
    try {
      await updateRunbookEnabledStatus(record.runbookId, checked, selectedTenantId);
      message.success(`Runbook ${checked ? 'enabled' : 'disabled'}`);
      loadRunbooksList();
    } catch (err) {
      console.error(err);
      message.error('Failed to update runbook');
    }
  };

  // CONFIGURE MODAL HANDLERS
  const openConfigureModal = async (rb) => {
    setConfigureRunbook(rb);
    setCurrentStep(0);
    try {
      const resp = await getRunbookConfig(rb.runbookId, selectedTenantId);
      const { trigger, filters, actions } = resp.data;
      const noTrigger = !trigger || trigger.trim() === '';
      setIsCompletelyNew(noTrigger);
      setTriggerVal(trigger || '');
      setStateFilter(filters?.state || '');
      setSeverityFilter(filters?.severity || '');
      const updateFinding = actions?.update_finding;
      setActionFrom(updateFinding?.from || '');
      setActionTo(updateFinding?.to || '');
      setCreateTicket(!!actions?.create_ticket);
      setConfigureModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error('Failed to load runbook config');
    }
  };

  const openViewConfigModal = async (rb) => {
    try {
      const resp = await getRunbookConfig(rb.runbookId, selectedTenantId);
      setViewConfigData(resp.data);
      setSelectedRunbook(rb);
      setViewConfigModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error('Failed to load runbook config');
    }
  };

  const closeViewConfigModal = () => {
    setViewConfigModalVisible(false);
    setSelectedRunbook(null);
    setViewConfigData({ trigger: '', filters: {}, actions: {} });
  };

  async function onDeleteRunbook(runbookId) {
    try {
      await deleteRunbook(runbookId, selectedTenantId);
      message.success('Runbook deleted');
      loadRunbooksList();
    } catch (err) {
      console.error(err);
      message.error('Failed to delete runbook');
    }
  }

  const closeConfigureModal = () => {
    setConfigureModalVisible(false);
    setConfigureRunbook(null);
  };

  // STEP HANDLERS
  function handleStepChange(nextStep) {
    if (isCompletelyNew && nextStep > 0) {
      message.error('Please set the trigger first.');
      return;
    }
    setCurrentStep(nextStep);
  }

  async function onNext() {
    if (currentStep === 0) {
      try {
        await saveTrigger();
        setIsCompletelyNew(false);
        setCurrentStep(1);
      } catch (err) {}
    } else if (currentStep === 1) {
      try {
        await saveFilters();
        setCurrentStep(2);
      } catch (err) {}
    } else {
      try {
        await saveActions();
        message.success('Configuration saved');
        closeConfigureModal();
      } catch (err) {}
    }
  }

  function onPrev() {
    setCurrentStep((prev) => prev - 1);
  }

  async function saveTrigger() {
    if (!triggerVal || triggerVal.trim() === '') {
      message.error("Trigger can't be empty.");
      throw new Error("Trigger can't be empty");
    }
    await configureRunbookTrigger(configureRunbook.runbookId, triggerVal, selectedTenantId);
    message.success('Trigger saved');
  }

  async function saveFilters() {
    const payload = { state: stateFilter, severity: severityFilter };
    await configureRunbookFilters(configureRunbook.runbookId, payload, selectedTenantId);
    message.success('Filters saved');
  }

  async function saveActions() {
    const update_finding = actionFrom || actionTo ? { from: actionFrom, to: actionTo } : null;
    const actions = { update_finding, create_ticket: createTicket };
    await configureRunbookActions(configureRunbook.runbookId, actions, selectedTenantId);
    message.success('Actions saved');
  }

  // TABLE COLUMNS
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 850,
      render: (val, record) => (
        <div>
          <strong>{val}</strong>
          <div style={{ fontSize: '1rem', color: '#888' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      width: 150,
      render: (val, record) => (
        <Switch checked={val} onChange={(checked) => toggleRunbookEnabled(record, checked)} />
      ),
    },
    {
      title: 'Trigger',
      dataIndex: 'trigger',
      width: 200,
      render: (val) =>
        val ? <Tag color="blue" style={{fontWeight:"bold"}}>{val}</Tag> : <Tag color="default" style={{fontWeight:"bold"}}>Not Set</Tag>,
    },
    {
      title: 'Actions',
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
            <Button
              type="default"
              icon={<SettingOutlined />}
              style={{ borderColor: '#1890ff', color: '#1890ff' }}
              onClick={() => openConfigureModal(record)}
            >
              Configure
            </Button>
          )}
          <Button
            type="dashed"
            icon={<EyeOutlined />}
            style={{ borderColor: 'black', color: 'black' }}
            onClick={() => openViewConfigModal(record)}
          >
            View Config
          </Button>
          {user?.role === 'SUPER_ADMIN' && (
            <Popconfirm
              title={
                <div style={{ textAlign: 'center' }}>
                  <DeleteOutlined style={{ color: 'red', fontSize: 20, marginBottom: 8 }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    Are you sure you want to delete this runbook?
                  </p>
                </div>
              }
              onConfirm={() => onDeleteRunbook(record.runbookId)}
              okText="Yes, Delete"
              cancelText="No, Cancel"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                style={{ borderColor: 'red', color: 'red' }}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '80vh', background: '#f0f2f5' }}>
      <RenderRunbookHeader
        totalRunbooks={totalRunbooks}
        totalEnabled={totalEnabled}
        onCreateClick={openCreateModal}
      />
      <Content style={{ padding: '16px' }}>
        <Card
          bordered={false}
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            background: 'white',
            padding: '16px'
          }}
        >
          <Table
            dataSource={runbooks}
            columns={columns}
            loading={loading}
            rowKey={(item) => item.runbookId}
            pagination={false}
            style={{ background: 'white' }}
          />
        </Card>
      </Content>

      {/* Create Runbook Modal */}
      <Modal
        open={createModalVisible}
        title="Create Runbook"
        onCancel={closeCreateModal}
        onOk={() => createForm.submit()}
      >
        <Form form={createForm} layout="vertical" onFinish={onCreateRunbookFinish}>
          <Form.Item label="Runbook Name" name="name" rules={[{ required: true, message: 'Runbook name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Runbook description is required' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Configure Runbook Modal */}
      <Modal
        open={configureModalVisible}
        title={configureRunbook ? `Configure: ${configureRunbook.name}` : 'Configure Runbook'}
        onCancel={closeConfigureModal}
        footer={null}
        width={500}
      >
        <Steps current={currentStep} onChange={handleStepChange} style={{ marginBottom: 24 }}>
          <Step title="Trigger" />
          <Step title="Filters" disabled={isCompletelyNew} />
          <Step title="Actions" disabled={isCompletelyNew} />
        </Steps>
        {currentStep === 0 && (
          <div style={{ marginTop: 24 }}>
            <h3>Select Trigger</h3>
            <Select
              style={{ width: '100%' }}
              placeholder="Select a trigger"
              value={triggerVal || undefined}
              onChange={(val) => setTriggerVal(val)}
            >
              {availableTriggers.map((tg) => (
                <Option key={tg} value={tg}>
                  {tg}
                </Option>
              ))}
            </Select>
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Button type="primary" onClick={onNext}>
                Save & Next
              </Button>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div style={{ marginTop: 24 }}>
            <h3>Filters</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block' }}>State Filter:</label>
              <Select
                style={{ width: '100%' }}
                placeholder="Select state"
                value={stateFilter || undefined}
                onChange={(val) => setStateFilter(val)}
              >
                <Option value=""><em>Any</em></Option>
                {(possibleFilterData.states || []).map((st) => (
                  <Option key={st} value={st}>
                    {st}
                  </Option>
                ))}
              </Select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block' }}>Severity Filter:</label>
              <Select
                style={{ width: '100%' }}
                placeholder="Select severity"
                value={severityFilter || undefined}
                onChange={(val) => setSeverityFilter(val)}
              >
                <Option value=""><em>Any</em></Option>
                {(possibleFilterData.severities || []).map((sv) => (
                  <Option key={sv} value={sv}>
                    {sv}
                  </Option>
                ))}
              </Select>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={onPrev}>
                Back
              </Button>
              <Button type="primary" onClick={onNext}>
                Save & Next
              </Button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div style={{ marginTop: 24 }}>
            <h3>Actions</h3>
            <div style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
              <strong>Update Finding (Optional):</strong>
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'block' }}>To State:</label>
                <Select
                  style={{ width: '100%', marginBottom: 8 }}
                  value={actionTo || undefined}
                  onChange={(val) => setActionTo(val)}
                >
                  <Option value="">(none)</Option>
                  {(possibleActions.updateFindingStates || []).map((st) => (
                    <Option key={st} value={st}>
                      {st}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
              <strong>Create Ticket:</strong>
              <div style={{ marginTop: 8 }}>
                <Switch checked={createTicket} onChange={(checked) => setCreateTicket(checked)} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={onPrev}>
                Back
              </Button>
              <Button type="primary" onClick={onNext}>
                Save & Finish
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Configuration Modal */}
      <Modal
        open={viewConfigModalVisible}
        onCancel={closeViewConfigModal}
        footer={
          <div style={{ textAlign: 'right', marginTop: 25 }}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                openConfigureModal(selectedRunbook);
                closeViewConfigModal();
              }}
            >
              Edit Configuration
            </Button>
          </div>
        }
        title={selectedRunbook ? `View Configuration: ${selectedRunbook.name}` : 'View Configuration'}
        width={700}
      >
        <div className="view-config-flow-container">
          {/* Trigger Card */}
          <div className="flow-card" style={{ marginTop: 20 }}>
            <div className="flow-card-header">
              <div className="flow-card-icon">
                <ThunderboltOutlined />
              </div>
              <h3>Trigger</h3>
            </div>
            <div className="flow-card-body">
              {viewConfigData.trigger ? (
                <p>Triggered by <strong>{viewConfigData.trigger}</strong>.</p>
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
              <p><strong>State:</strong> {viewConfigData.filters?.state || <em>Any</em>}</p>
              <p><strong>Severity:</strong> {viewConfigData.filters?.severity || <em>Any</em>}</p>
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
              {viewConfigData.actions?.update_finding ? (
                <p>
                  Update findings to <strong>{viewConfigData.actions.update_finding.to || '—'}</strong> state.
                </p>
              ) : (
                <p>No “Update Finding” action set.</p>
              )}
              <p>
                Create Ticket: {viewConfigData.actions?.create_ticket ? <strong>Yes</strong> : <strong>No</strong>}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default RunbooksPage;
