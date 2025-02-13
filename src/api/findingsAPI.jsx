import axios from 'axios';
import Qs from 'qs';

export async function fetchFilterData() {
  const [toolTypeResp, severityResp, statusResp] = await Promise.all([
    axios.get('http://localhost:8083/filters/toolTypes',{withCredentials: 'true',}),
    axios.get('http://localhost:8083/filters/severities',{withCredentials: 'true',}),
    axios.get('http://localhost:8083/filters/statuses',{withCredentials: 'true',}),
  ]);
  return {
    toolTypes: toolTypeResp.data || [],
    severities: severityResp.data || [],
    statuses: statusResp.data || [],
  };
}

export async function fetchFindingsAPI({ tenantId, page, size, selectedToolTypes, selectedSeverities, selectedStatuses }) {
  const params = {
    tenantId,
    page,
    size,
  };

  if (selectedToolTypes.length > 0) params.toolTypes = selectedToolTypes;
  if (selectedSeverities.length > 0) params.severities = selectedSeverities;
  if (selectedStatuses.length > 0) params.statuses = selectedStatuses;

  const response = await axios.get('http://localhost:8083/alerts/finding/search', {
    params,
    withCredentials: 'true',
    paramsSerializer: (p) => Qs.stringify(p, { arrayFormat: 'repeat' }),
  });

  return response.data || [];
}

export async function initiateScan(tenantId, selectedTools) {

    const requestBody = {
      types: selectedTools.length > 0 ? selectedTools : ['ALL'],
    };
  
    const response = await axios.post('http://localhost:8083/alert/scan', requestBody,{params: { tenantId }, withCredentials: true,});

    return response.data;
}

export async function updateAlert({ tenantId, toolType, alertNumber, newState, reason }) {
  const body = {
    toolType,
    alertNumber,
    newState,
    reason,
  };

  const response = await axios.post('http://localhost:8083/alerts/update', body, {params: { tenantId }, withCredentials: true,});
  console.log(body);
  return response.data;
}