import axios from 'axios';
import Qs from 'qs';

export async function fetchFilterData() {
  const [toolTypeResp, severityResp, statusResp] = await Promise.all([
    axios.get('http://localhost:8083/filters/toolTypes'),
    axios.get('http://localhost:8083/filters/severities'),
    axios.get('http://localhost:8083/filters/statuses'),
  ]);
  return {
    toolTypes: toolTypeResp.data || [],
    severities: severityResp.data || [],
    statuses: statusResp.data || [],
  };
}

export async function fetchFindingsAPI({ page, size, selectedToolTypes, selectedSeverities, selectedStatuses }) {
  const params = {
    page,
    size,
  };

  if (selectedToolTypes.length > 0) params.toolTypes = selectedToolTypes;
  if (selectedSeverities.length > 0) params.severities = selectedSeverities;
  if (selectedStatuses.length > 0) params.statuses = selectedStatuses;

  const response = await axios.get('http://localhost:8083/alerts/finding/search', {
    params,
    paramsSerializer: (p) => Qs.stringify(p, { arrayFormat: 'repeat' }),
  });

  return response.data || [];
}

export async function initiateScan({selectedTools}) {

    const requestBody = {
      owner: 'siddharth-dhingra',
      repo: 'juice-shop',
      types: selectedTools.length > 0 ? selectedTools : ['ALL'],
    };
  
    const response = await axios.post('http://localhost:8083/alert/scan', requestBody);

    return response.data;
}

export async function updateAlert({ owner, repo, toolType, alertNumber, newState, reason }) {
  const body = {
    owner,
    repo,
    toolType,
    alertNumber,
    newState,
    reason,
  };

  const response = await axios.post('http://localhost:8083/alerts/update', body);
  console.log(body);
  return response.data;
}