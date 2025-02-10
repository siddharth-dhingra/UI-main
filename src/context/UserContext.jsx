/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { fetchWhoAmI, logoutUser } from '../api/userAPI';

import axios from 'axios';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);         
  const [loading, setLoading] = useState(true);   

  useEffect(() => {
    async function checkLogin() {
      try {
        const resp = await fetchWhoAmI();
        setUser(resp.data); 
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  const login = () => {
    window.location.href = 'http://localhost:8083/oauth2/authorization/google';
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
