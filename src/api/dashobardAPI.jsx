// src/api/dashboardAPI.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8083/dashboard';

export async function fetchToolCounts(tenantId) {
  const resp = await axios.get(`${BASE_URL}/alerts/toolCounts`,{params: { tenantId },withCredentials: 'true'});
  return resp.data; // { "CODESCAN": 10, "DEPENDABOT": 5, ... }
}

export async function fetchStateCounts(tenantId, tool) {
    const params = { tenantId };
    if (tool && tool !== 'ALL') {
      params.tool = tool;
    }
    const resp = await axios.get(`${BASE_URL}/alerts/stateCounts`, { params,withCredentials: 'true', });
    return resp.data; // { "OPEN": 12, "FIXED": 3, ... }
}
  
export async function fetchSeverityCounts(tenantId, tool) {
    const params = { tenantId };
    if (tool && tool !== 'ALL') {
      params.tool = tool;
    }
    const resp = await axios.get(`${BASE_URL}/alerts/severityCounts`, { params,withCredentials: 'true', });
    return resp.data; // { "CRITICAL": 5, "HIGH": 8, ... }
}
  
export async function fetchCvssHistogram(tenantId, tool) {
    const params = { tenantId };
    if (tool && tool !== 'ALL') {
      params.tool = tool;
    }
    console.log(tenantId)
    const resp = await axios.get(`${BASE_URL}/alerts/cvssHistogram`, { params,withCredentials: 'true', });
    return resp.data; // [ { key: 0.0, count: 2 }, { key: 1.0, count: 5 }, ... ]
}
