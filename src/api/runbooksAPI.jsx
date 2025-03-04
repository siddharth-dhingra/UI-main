import axios from 'axios';

const RUNBOOK_BASE_URL = "http://localhost:8083/api/runbooks"

export function fetchRunbooksList(tenantId) {
  return axios.get(`${RUNBOOK_BASE_URL}/list`, { params: { tenantId }, withCredentials: true, });
}

export function createRunbookAPI({ name, description, tenantId }) {
  return axios.post(`${RUNBOOK_BASE_URL}?tenantId=${tenantId}`, {
    name,
    description
  },{withCredentials: true,});
}

export function updateRunbookEnabledStatus(runbookId, enabled, tenantId) {
  return axios.put(`${RUNBOOK_BASE_URL}/${runbookId}/enabled`, null, {
    params: { enabled, tenantId },
    withCredentials: true,
  });
}

export function getRunbookConfig(runbookId, tenantId) {
  return axios.get(`${RUNBOOK_BASE_URL}/${runbookId}/config`, {
    params: { tenantId }, withCredentials: true,
  });
}

export function configureRunbookTrigger(runbookId, trigger, tenantId) {
  return axios.put(
    `${RUNBOOK_BASE_URL}/${runbookId}/trigger?tenantId=${tenantId}`,
    { trigger },
    {withCredentials: true,}
  );
}

export function configureRunbookFilters(runbookId, filterPayload, tenantId) {
  return axios.put(
    `${RUNBOOK_BASE_URL}/${runbookId}/filters?tenantId=${tenantId}`,
    { filter: filterPayload },
    {withCredentials: true,}
  );
}

export function configureRunbookActions(runbookId, actionPayload, tenantId) {
  return axios.put(
    `${RUNBOOK_BASE_URL}/${runbookId}/actions?tenantId=${tenantId}`,
    { actions: actionPayload },
    {withCredentials: true,}
  );
}

export function getAvailableTriggers(tenantId) {
  return axios.get(`${RUNBOOK_BASE_URL}/available-trigger`, { params: { tenantId }, withCredentials: true, });
}

export function getPossibleFilters(tenantId) {
  return axios.get(`${RUNBOOK_BASE_URL}/possible-filters`, { params: { tenantId }, withCredentials: true, });
}

export function getPossibleActions(tenantId) {
  return axios.get(`${RUNBOOK_BASE_URL}/possible-actions`, { params: { tenantId }, withCredentials: true, });
}

export function deleteRunbook(runbookId, tenantId) {
    return axios.delete(`${RUNBOOK_BASE_URL}/${runbookId}`, {
      params: { tenantId },
      withCredentials: true,
    });
}
  
