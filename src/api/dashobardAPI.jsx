// src/api/dashboardAPI.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8083/dashboard';

export async function fetchToolCounts() {
  const resp = await axios.get(`${BASE_URL}/alerts/toolCounts`);
  return resp.data; // { "CODESCAN": 10, "DEPENDABOT": 5, ... }
}

export async function fetchStateCounts() {
  const resp = await axios.get(`${BASE_URL}/alerts/stateCounts`);
  return resp.data; // { "OPEN": 12, "FIXED": 3, ... }
}

export async function fetchSeverityCounts() {
  const resp = await axios.get(`${BASE_URL}/alerts/severityCounts`);
  return resp.data; // { "CRITICAL": 5, "HIGH": 8, "MEDIUM": 10, ... }
}

export async function fetchCvssHistogram() {
  const resp = await axios.get(`${BASE_URL}/alerts/cvssHistogram`);
  return resp.data; // [ { key: 0.0, count: 2 }, { key: 1.0, count: 5 }, ... ]
}
