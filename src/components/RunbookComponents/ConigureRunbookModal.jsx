/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
// import  { useState, useEffect, useContext } from 'react';
// import { Modal, Steps, Button, Select, Switch, message } from 'antd';
// import { getRunbookConfig, configureRunbookTrigger, configureRunbookFilters, configureRunbookActions } from '../../api/runbooksAPI';
// import { UserContext } from '../../context/UserContext';

// const { Step } = Steps;
// const { Option } = Select;

// function ConfigureRunbookModal({ visible, runbook, onClose, refreshList }) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isCompletelyNew, setIsCompletelyNew] = useState(false);
//   const [triggerVal, setTriggerVal] = useState('');
//   const [stateFilter, setStateFilter] = useState('');
//   const [severityFilter, setSeverityFilter] = useState('');
//   const [actionFrom, setActionFrom] = useState('');
//   const [actionTo, setActionTo] = useState('');
//   const [createTicket, setCreateTicket] = useState(false);

//   // Data for possible options
//   const [availableTriggers, setAvailableTriggers] = useState([]);
//   const [possibleFilterData, setPossibleFilterData] = useState({});
//   const [possibleActions, setPossibleActions] = useState({});

//   const { selectedTenantId } = useContext(UserContext);

//   useEffect(() => {
//     if (visible && runbook) {
//       loadConfig();
//       // Optionally, load auxiliary data for triggers/filters/actions
//     }
//   }, [visible, runbook]);

  

//   async function loadConfig() {
//     try {
//       const resp = await getRunbookConfig(runbook.runbookId, selectedTenantId);
//       const { trigger, filters, actions } = resp.data;
//       const noTrigger = !trigger || trigger.trim() === '';
//       setIsCompletelyNew(noTrigger);
//       setTriggerVal(trigger || '');
//       setStateFilter(filters?.state || '');
//       setSeverityFilter(filters?.severity || '');
//       const updateFinding = actions?.update_finding;
//       setActionFrom(updateFinding?.from || '');
//       setActionTo(updateFinding?.to || '');
//       setCreateTicket(!!actions?.create_ticket);
//     } catch (err) {
//       console.error(err);
//       message.error('Failed to load runbook config');
//     }
//   }

//   const steps = [
//     { title: 'Trigger' },
//     { title: 'Filters' },
//     { title: 'Actions' },
//   ];

//   const onNext = async () => {
//     if (currentStep === 0) {
//       if (!triggerVal || triggerVal.trim() === '') {
//         message.error("Trigger can't be empty.");
//         return;
//       }
//       try {
//         await configureRunbookTrigger(runbook.runbookId, triggerVal, selectedTenantId);
//         setIsCompletelyNew(false);
//         setCurrentStep(1);
//         message.success('Trigger saved');
//       } catch (err) {
//         message.error('Failed to save trigger');
//       }
//     } else if (currentStep === 1) {
//       try {
//         const payload = { state: stateFilter, severity: severityFilter };
//         await configureRunbookFilters(runbook.runbookId, payload, selectedTenantId);
//         setCurrentStep(2);
//         message.success('Filters saved');
//       } catch (err) {
//         message.error('Failed to save filters');
//       }
//     } else {
//       try {
//         const update_finding = actionFrom || actionTo ? { from: actionFrom, to: actionTo } : null;
//         const actions = { update_finding, create_ticket: createTicket };
//         await configureRunbookActions(runbook.runbookId, actions, selectedTenantId);
//         message.success('Configuration saved');
//         onClose();
//         refreshList();
//       } catch (err) {
//         message.error('Failed to save actions');
//       }
//     }
//   };

//   const onPrev = () => setCurrentStep((prev) => prev - 1);

//   const handleStepChange = (nextStep) => {
//     if (isCompletelyNew && nextStep > 0) {
//       message.error('Please set the trigger first.');
//       return;
//     }
//     setCurrentStep(nextStep);
//   };

//   return (
//     <Modal
//       open={visible}
//       title={runbook ? `Configure: ${runbook.name}` : 'Configure Runbook'}
//       onCancel={onClose}
//       footer={null}
//       width={500}
//     >
//       <Steps current={currentStep} onChange={handleStepChange} style={{ marginBottom: 24 }}>
//         <Step title="Trigger" />
//         <Step title="Filters" disabled={isCompletelyNew} />
//         <Step title="Actions" disabled={isCompletelyNew} />
//       </Steps>

//       {currentStep === 0 && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Select Trigger</h3>
//           <Select
//             style={{ width: '100%' }}
//             placeholder="Select a trigger"
//             value={triggerVal || undefined}
//             onChange={setTriggerVal}
//           >
//             {availableTriggers.map((tg) => (
//               <Option key={tg} value={tg}>
//                 {tg}
//               </Option>
//             ))}
//           </Select>
//           <div style={{ marginTop: 24, textAlign: 'right' }}>
//             <Button type="primary" onClick={onNext}>
//               Save & Next
//             </Button>
//           </div>
//         </div>
//       )}

//       {currentStep === 1 && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Filters</h3>
//           <div style={{ marginBottom: 16 }}>
//             <label style={{ display: 'block' }}>State Filter:</label>
//             <Select
//               style={{ width: '100%' }}
//               placeholder="Select state"
//               value={stateFilter || undefined}
//               onChange={setStateFilter}
//             >
//               <Option value=""><em>Any</em></Option>
//               {(possibleFilterData.states || []).map((st) => (
//                 <Option key={st} value={st}>
//                   {st}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//           <div style={{ marginBottom: 16 }}>
//             <label style={{ display: 'block' }}>Severity Filter:</label>
//             <Select
//               style={{ width: '100%' }}
//               placeholder="Select severity"
//               value={severityFilter || undefined}
//               onChange={setSeverityFilter}
//             >
//               <Option value=""><em>Any</em></Option>
//               {(possibleFilterData.severities || []).map((sv) => (
//                 <Option key={sv} value={sv}>
//                   {sv}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//           <div style={{ textAlign: 'right' }}>
//             <Button style={{ marginRight: 8 }} onClick={onPrev}>
//               Back
//             </Button>
//             <Button type="primary" onClick={onNext}>
//               Save & Next
//             </Button>
//           </div>
//         </div>
//       )}

//       {currentStep === 2 && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Actions</h3>
//           <div style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
//             <strong>Update Finding (Optional):</strong>
//             <div style={{ marginTop: 8 }}>
//               <label style={{ display: 'block' }}>To State:</label>
//               <Select
//                 style={{ width: '100%', marginBottom: 8 }}
//                 value={actionTo || undefined}
//                 onChange={setActionTo}
//               >
//                 <Option value="">(none)</Option>
//                 {(possibleActions.updateFindingStates || []).map((st) => (
//                   <Option key={st} value={st}>
//                     {st}
//                   </Option>
//                 ))}
//               </Select>
//             </div>
//           </div>
//           <div style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12 }}>
//             <strong>Create Ticket:</strong>
//             <div style={{ marginTop: 8 }}>
//               <Switch checked={createTicket} onChange={setCreateTicket} />
//             </div>
//           </div>
//           <div style={{ textAlign: 'right' }}>
//             <Button style={{ marginRight: 8 }} onClick={onPrev}>
//               Back
//             </Button>
//             <Button type="primary" onClick={onNext}>
//               Save & Finish
//             </Button>
//           </div>
//         </div>
//       )}
//     </Modal>
//   );
// }

// export default ConfigureRunbookModal;

import { Modal, Steps, Select, Button, Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  getAvailableTriggers,
  getPossibleFilters,
  getPossibleActions,
  configureRunbookTrigger,
  configureRunbookFilters,
  configureRunbookActions,
} from '../../api/runbooksAPI';

const { Step } = Steps;
const { Option } = Select;

function ConfigureRunbookModal({ visible, onClose, runbook, initialConfig, onSaved }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompletelyNew, setIsCompletelyNew] = useState(false);

  // Local states for configuration values
  const [triggerVal, setTriggerVal] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [actionFrom, setActionFrom] = useState('');
  const [actionTo, setActionTo] = useState('');
  const [createTicket, setCreateTicket] = useState(false);

  // Data from server for possible options
  const [availableTriggers, setAvailableTriggers] = useState([]);
  const [possibleFilters, setPossibleFilters] = useState({});
  const [possibleActions, setPossibleActions] = useState({});

  // When the modal becomes visible, fetch available options
  useEffect(() => {
    if (visible && runbook) {
      Promise.all([
        getAvailableTriggers(runbook.tenantId),
        getPossibleFilters(runbook.tenantId),
        getPossibleActions(runbook.tenantId)
      ])
      .then(([triggerResp, filtersResp, actionsResp]) => {
         const t = triggerResp.data.trigger;
         const triggers = Array.isArray(t) ? t : t ? [t] : [];
         setAvailableTriggers(triggers);
         setPossibleFilters(filtersResp.data);
         setPossibleActions(actionsResp.data);
      })
      .catch(err => {
         console.error("Error fetching runbook options:", err);
         message.error("Failed to load runbook configuration options.");
      });
    }
  }, [visible, runbook]);

  // When the modal opens, load the current config if available
  useEffect(() => {
    if (visible && initialConfig) {
      setTriggerVal(initialConfig.trigger || '');
      setStateFilter(initialConfig.filters?.state || '');
      setSeverityFilter(initialConfig.filters?.severity || '');
      const updateFinding = initialConfig.actions?.update_finding;
      setActionFrom(updateFinding?.from || '');
      setActionTo(updateFinding?.to || '');
      setCreateTicket(!!initialConfig.actions?.create_ticket);
      setIsCompletelyNew(!(initialConfig.trigger && initialConfig.trigger.trim()));
      setCurrentStep(0);
    }
  }, [visible, initialConfig]);

  // STEP NAVIGATION HANDLERS
  const onNext = async () => {
    if (currentStep === 0) {
      if (!triggerVal || !triggerVal.trim()) {
         message.error("Trigger cannot be empty.");
         return;
      }
      try {
        await configureRunbookTrigger(runbook.runbookId, triggerVal, runbook.tenantId);
        setIsCompletelyNew(false);
        setCurrentStep(1);
        message.success("Trigger saved.");
      } catch (err) {
         message.error("Failed to save trigger.");
      }
    } else if (currentStep === 1) {
      try {
        const payload = { state: stateFilter, severity: severityFilter };
        await configureRunbookFilters(runbook.runbookId, payload, runbook.tenantId);
        setCurrentStep(2);
        message.success("Filters saved.");
      } catch (err) {
         message.error("Failed to save filters.");
      }
    } else {
      const update_finding = (actionFrom || actionTo) ? { from: actionFrom, to: actionTo } : null;
      const actions = {
         update_finding,
         create_ticket: createTicket,
      };
      try {
         await configureRunbookActions(runbook.runbookId, actions, runbook.tenantId);
         message.success("Actions saved.");
         onSaved(); // Callback after saving configuration
         onClose();
      } catch (err) {
        //  message.error("Failed to save actions.");
      }
    }
  };

  const onPrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <Modal
      open={visible}
      title={runbook ? `Configure: ${runbook.name}` : "Configure Runbook"}
      onCancel={onClose}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
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
              onChange={val => setTriggerVal(val)}
              loading={!availableTriggers.length}
            >
               {availableTriggers.map(t => (
                 <Option key={t} value={t}>{t}</Option>
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
           <h3>Configure Filters</h3>
           <div style={{ marginBottom: 16 }}>
             <label style={{ display: 'block' }}>State Filter:</label>
             <Select
                style={{ width: '100%' }}
                placeholder="Select state"
                value={stateFilter || undefined}
                onChange={val => setStateFilter(val)}
             >
                <Option value=""><em>Any</em></Option>
                {(possibleFilters.states || []).map(s => (
                   <Option key={s} value={s}>{s}</Option>
                ))}
             </Select>
           </div>
           <div style={{ marginBottom: 16 }}>
             <label style={{ display: 'block' }}>Severity Filter:</label>
             <Select
                style={{ width: '100%' }}
                placeholder="Select severity"
                value={severityFilter || undefined}
                onChange={val => setSeverityFilter(val)}
             >
                <Option value=""><em>Any</em></Option>
                {(possibleFilters.severities || []).map(s => (
                   <Option key={s} value={s}>{s}</Option>
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
           <h3>Configure Actions</h3>
           <div style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc' }}>
             <strong>Update Finding (Optional):</strong>
             <div style={{ marginTop: 8 }}>
               <label style={{ display: 'block' }}>To State:</label>
               <Select
                 style={{ width: '100%', marginBottom: 8 }}
                 value={actionTo || undefined}
                 onChange={val => setActionTo(val)}
               >
                 <Option value="">(none)</Option>
                 {(possibleActions.updateFindingStates || []).map(s => (
                    <Option key={s} value={s}>{s}</Option>
                 ))}
               </Select>
             </div>
           </div>
           <div style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc' }}>
             <strong>Create Ticket:</strong>
             <div style={{ marginTop: 8 }}>
               <Switch checked={createTicket} onChange={checked => setCreateTicket(checked)} />
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
  );
}

export default ConfigureRunbookModal;
