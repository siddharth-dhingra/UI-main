import axios from 'axios';

export async function fetchWhoAmI(tenantId) {
  const params = {};
  if (typeof tenantId === 'string') {
    params.tenantId = tenantId;
  }
  return axios.get('http://localhost:8083/whoami', {
    params,
    withCredentials: true,
  });
}

export async function logoutUser() {
  return axios.post('http://localhost:8083/logout', null, {
    withCredentials: true,
  });
}
