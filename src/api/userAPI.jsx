import axios from 'axios';

export async function fetchWhoAmI() {
  return axios.get('http://localhost:8083/whoami', {
    withCredentials: true,
  });
}

export async function logoutUser() {
  return axios.post('http://localhost:8083/logout', null, {
    withCredentials: true,
  });
}
